import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma as db } from "~/server/db";
import { type JWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

async function refreshAccessToken(token: JWT) {
  const url = `https://www.googleapis.com/oauth2/v3/token`;
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
      method: "POST",
    });

    const refreshedTokens = await response.json();
    await db.account.update({
      where: {
        id: token.uid as string,
      },
      data: {
        access_token: refreshedTokens.access_token,
        refresh_token: refreshedTokens.refresh_token ?? token.refreshToken,
        expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      },
    });
    if (!response.ok) {
      throw new Error(
        refreshedTokens.error_description || "Failed to refresh access token"
      );
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("RefreshAccessTokenError", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  callbacks: {
    session({ session, user, token }) {
      if (token.uid) {
        session.user.id = token.uid as string;
      }
      return session;
    },
    async jwt({ token, account, user, profile }) {
      if (user?.id) {
        token.uid = user.id;
      }
      if (account) {
        token.id = profile?.sub;
      }

      if (account && account.access_token && account.expires_at) {
        token.accessToken = account.access_token as string;
        token.accessTokenExpires =
          Date.now() + (account.expires_at as number) * 1000;
        token.refreshToken = account.refresh_token as string | undefined;
        token.id = user?.id;

        return token;
      }
      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() > token.accessTokenExpires
      ) {
        const refreshedToken = await refreshAccessToken(token);

        return refreshedToken;
      }

      return token;
    },

    async signIn({ user, account: typedAccount }) {
      console.log("signing in");
      const account = typedAccount;
      const email = user.email;

      if (!account || !email || !user.name) {
        console.error("Required values are missing");
        return false;
      }

      console.log(`Email: ${email}`);
      console.log(`Provider Account ID: ${account.providerAccountId}`);
      console.log(`Access Token: ${account.access_token}`);
      if (email && account.providerAccountId && account.access_token) {
        let dbUser = await db.user.findUnique({ where: { email } });
        if (!dbUser) {
          dbUser = await db.user.create({
            data: {
              email,
              name: user.name,
            },
          });
        }

        const existingAccount = await db.account.findUnique({
          where: { providerAccountId: account.providerAccountId },
        });

        if (!existingAccount) {
          await db.account.create({
            data: {
              userId: dbUser.id,
              type: account.provider,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
            },
          });
        } else {
          if (
            existingAccount.access_token !== account.access_token ||
            existingAccount.refresh_token !== account.refresh_token
          ) {
            await db.account.update({
              where: { providerAccountId: account.providerAccountId },
              data: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
              },
            });
          }
        }

        console.log("Signed in");
        return true;
      }
      console.log("Not Signed in");
      return false;
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: [
            "openid",
            "profile",
            "email",
            "https://www.googleapis.com/auth/calendar.readonly",
            "https://www.googleapis.com/auth/calendar.events",
            "https://www.googleapis.com/auth/calendar.freebusy",
            "https://www.googleapis.com/auth/calendar.events.owned",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/contacts.readonly",
            "https://www.googleapis.com/auth/gmail.send",
          ].join(" "),
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

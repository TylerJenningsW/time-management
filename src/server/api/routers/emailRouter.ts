import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { env } from "~/env.mjs";
const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/callback/google"
);
export const emailRouter = createTRPCRouter({
  send: protectedProcedure
    .input(z.object({ to: z.string(), subject: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: ctx.session?.user.id,
          provider: "google",
        },
      });

      if (!account) throw new Error("User not found");
      const email = ctx.session.user.email?.toString()

      oauth2Client.setCredentials({ 
        access_token: account.access_token,
        refresh_token: account.refresh_token,
      });

      oauth2Client.on("tokens", async (tokens) => {
        if (tokens.refresh_token) {
          await ctx.prisma.account.update({
            where: { id: account.id },
            data: { refresh_token: tokens.refresh_token },
          });
        }
        await ctx.prisma.account.update({
          where: { id: account.id },
          data: { access_token: tokens.access_token },
        });
      });
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: email,
          accessToken: account.access_token?.toString(),
        },
      });

      const mailOptions = {
        from: email,
        to: input.to,
        subject: input.subject,
        text: input.text,
      };

      const response = await transporter.sendMail(mailOptions);
      if (response.accepted) {
        return { status: "Email sent successfully" };
      } else if (response.rejected) {
        return { status: "Email failed to send." };
      }
    }),
});

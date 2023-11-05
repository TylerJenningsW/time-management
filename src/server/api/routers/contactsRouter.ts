import { google } from "googleapis";
import { type OAuth2Client } from "google-auth-library";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type Contact } from "~/types/types";

async function fetchAllContacts(
  oauth2Client: OAuth2Client
): Promise<Contact[]> {
  const peopleService = google.people({ version: "v1", auth: oauth2Client });
  const contacts: Contact[] = [];
  let pageToken: string | undefined;

  do {
    try {
      const response = await peopleService.people.connections.list({
        resourceName: "people/me",
        pageSize: 100,
        pageToken: pageToken,
        personFields: "names,emailAddresses",
      });

      if (response.data.connections) {
        for (const person of response.data.connections) {
          const name = person.names?.[0]?.displayName ?? "Unknown Name";
          const email = person.emailAddresses?.[0]?.value ?? "Unknown Email";
          contacts.push({ name, email });
        }
      }

      pageToken = response.data.nextPageToken || undefined;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  } while (pageToken);

  return contacts;
}

export const contactsRouter = createTRPCRouter({
  getContacts: protectedProcedure.query(async ({ ctx }) => {
    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: ctx.session?.user.id,
        provider: "google",
      },
    });

    if (!account) throw new Error("User not found");

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    });

    const allContacts = await fetchAllContacts(oauth2Client);

    return allContacts.map((contact) => {
      return {
        name: contact.name,
        email: contact.email,
      };
    });
  }),
});

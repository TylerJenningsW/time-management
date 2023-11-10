import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { google } from "googleapis";
import { type OAuth2Client } from "google-auth-library";
import { rrulestr } from "rrule";
import { type GoogleEvent } from "~/types/types";


async function fetchAllEvents(
  oauth2Client: OAuth2Client
): Promise<GoogleEvent[]> {
  let events: GoogleEvent[] = [];
  let pageToken: string | undefined;

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  do {
    let response;
    try {
      response = await calendar.events.list({
        calendarId: "primary",
        pageToken,
        singleEvents: true,
      });

      const transformedEvents: GoogleEvent[] = (response.data.items || [])
        .filter((item) => item.id && item.summary && item.start && item.end)
        .map((item) => {
          const start = item.start!;
          const end = item.end!;

          return {
            id: item.id as string,
            summary: item.summary as string,
            start: {
              dateTime: start.dateTime || undefined,
              date: start.date || undefined,
            },
            end: {
              dateTime: end.dateTime || undefined,
              date: end.date || undefined,
            },
          };
        });

      events = [...events, ...transformedEvents];
      pageToken = response.data.nextPageToken || undefined;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  } while (pageToken);

  return events;
}

export const calendarRouter = createTRPCRouter({
  getEvents: protectedProcedure.query(async ({ ctx }) => {
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

    oauth2Client.on('tokens', async (tokens) => {
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

    const allEvents = await fetchAllEvents(oauth2Client);
    
    return allEvents.flatMap((event) => {
      const startDateTime = event.start?.dateTime;
      const startDate = event.start?.date;
      const endDateTime = event.end?.dateTime;
      const endDate = event.end?.date;
    
      let start: Date | undefined;
      let end: Date | undefined;
    
      if (startDateTime) {
        start = new Date(startDateTime);
      } else if (startDate) {
        start = new Date(startDate);
      }
    
      if (endDateTime) {
        end = new Date(endDateTime);
      } else if (endDate) {
        end = new Date(endDate);
      }
    
      if (!start || !end) {
        return [];
      }
    
      if (event.recurrence && event.recurrence[0]) {
        const rule = rrulestr(event.recurrence[0], { dtstart: start });
        const dates = rule.all();
    
        return dates.map(date => ({
          start: date,
          end: new Date(date.getTime() + (end!.getTime() - start!.getTime())),
          title: event.summary || "No Title",
        }));
      }
    
      return [{
        start,
        end,
        title: event.summary || "No Title",
      }];
    });
  }),
});

import { google } from "googleapis";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: "primary",
    });
    return (
      response.data.items?.map((event) => {
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
          throw new Error("Event start or end time is missing");
        }

        return {
          start,
          end,
          title: event.summary || "No Title",
        };
      }) || []
    );
  }),
});

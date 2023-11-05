import BaseCalendar from "./CalendarBase";
import { api } from "~/utils/api";
import React from "react";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Loading from "./loading";

const components = {
  event: (props: any) => {
    const eventType = props?.event?.type;
    switch (eventType) {
      default:
        return (
          <div
            style={{ background: "darkblue", color: "white", height: "100%" }}
          >
            {props.title}
          </div>
        );
    }
  },
};

function Calendar() {
  const { data: session, status } = useSession();
  const calendarQuery = api.calendar.getEvents.useQuery();
  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center gap-4 p-16">
        Sign In
      </div>
    );
  }

  if (calendarQuery.isLoading) {
    return (
      <Loading/>
    );
  }

  if (calendarQuery.isError) {
    return <div>Error: {calendarQuery.error.message}</div>;
  }

  const events = calendarQuery.data;
  console.log("Events from API:", events);

  return <BaseCalendar events={events} components={components} />;
}
export default Calendar;

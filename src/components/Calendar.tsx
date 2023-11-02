import BaseCalendar from "./CalendarBase";
import { api } from "~/utils/api";
import React from "react";

const components = {
  event: (props: any) => {
    const eventType = props?.event?.type;
    switch (eventType) {
      default:
        return (
          <div style={{ background: "darkblue", color: "white", height: "100%" }}>
            {props.title}
          </div>
        );
    }
  },
};

function Calendar() {
  const calendarQuery = api.calendar.getEvents.useQuery();

  if (calendarQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (calendarQuery.isError) {
    return <div>Error: {calendarQuery.error.message}</div>;
  }

  const events = calendarQuery.data;
  console.log("Events from API:", events);

  return <BaseCalendar events={events} components={components} />;
}
export default Calendar;

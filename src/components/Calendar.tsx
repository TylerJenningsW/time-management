import moment from "moment";
import BaseCalendar from "./CalendarBase";
import { api } from "~/utils/api";

const components = {
  event: (props: any) => {
    const eventType = props?.event?.type;
    switch (eventType) {
      case "Reg":
        return (
          <div style={{ background: "yellow", color: "black", height: "100%" }}>
            {props.title}
          </div>
        );
      case "App":
        return (
          <div
            style={{ background: "lightgreen", color: "red", height: "100%" }}
          >
            {props.title}
          </div>
        );
      default:
        return (
          <div style={{ background: "darkblue", color: "white", height: "100%" }}>
            {props.title}
          </div>
        );
    }
  },
};

export default function Calendar() {
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

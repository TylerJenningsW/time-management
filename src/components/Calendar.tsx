import moment from "moment";
import BaseCalendar from "./CalendarBase";

const events = [
  {
    start: moment("2023-10-18T10:00:00").toDate(),
    end: moment("2023-10-18T11:00:00").toDate(),
    title: "MRI Registration",
    type: "Reg", // Add this
  },
  {
    start: moment("2023-10-18T14:00:00").toDate(),
    end: moment("2023-10-18T15:30:00").toDate(),
    title: "ENT Appointment",
    type: "App", // Add this
  },
];

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
        return null;
    }
  },
};

export default function Calendar() {
  return <BaseCalendar events={events} components={components} />;
}

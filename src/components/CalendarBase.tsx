import {
    Calendar as BigCalendar,
    type CalendarProps,
    momentLocalizer,
  } from "react-big-calendar";
  import moment from "moment";
  
  const localizer = momentLocalizer(moment);
  
  export default function CalendarBase(props: Omit<CalendarProps, "localizer">) {
    return <BigCalendar {...props} localizer={localizer} />;
  }
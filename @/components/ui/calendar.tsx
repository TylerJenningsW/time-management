import * as React from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@/lib/utils"
import { useState } from "react";

export type CalendarProps = React.ComponentProps<typeof DatePicker>

function Calendar({
  className,
  onChange,
  ...props
}: CalendarProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date() as Date);
  const handleChange = (date: Date | null, event: React.SyntheticEvent<any> | undefined) => {
    setStartDate(date);
    if (onChange) {
      onChange(date, event);
    }
  };
  
  return (
    <DatePicker
    showTimeSelect
    selected={startDate}
    onChange={handleChange}
      className={cn("p-3 z-[2147483647]", className)}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

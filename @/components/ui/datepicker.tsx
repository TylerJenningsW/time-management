import * as React from "react";

import { cn } from "@/lib/utils";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
export type CalendarProps = React.ComponentProps<typeof DatePicker>

interface DatePickerProps {
  onDateSelect: (date: Date | null) => void;
}
export function Calendar({ onDateSelect }: DatePickerProps) {
  const [date, setDate] = useState<Date | null>(new Date() as Date);
  const handleChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
    onDateSelect(selectedDate);
  };
  
  return (
    <DatePicker
    showTimeSelect={true}
    selected={date}
    onChange={handleChange}
      className={cn("p-3 z-[2147483647]")}
    />
  )
}

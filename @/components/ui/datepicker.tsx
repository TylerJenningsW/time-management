import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface DatePickerProps {
  onDateSelect: (date: Date | undefined) => void;
}
export function DatePicker({ onDateSelect }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setPopoverOpen(false);
    onDateSelect(selectedDate);
  };
  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setPopoverOpen(true);
          }}
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal text-white",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto py-8">
        <Calendar className={cn("py-8 z-[2147483647] bg-black text-white")}
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

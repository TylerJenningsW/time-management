import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import {
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
} from "@/components/ui/modal";
import { Divider, Input } from "@nextui-org/react";
import { MiniCalendar } from "@/components/ui/datepicker";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { type SlotInfo } from "react-big-calendar";
import { cn } from "@/lib/utils";
interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotInfo?: SlotInfo | undefined;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "The title must be at least two characters.",
  }),
  startDate: z.date(),
  endDate: z.date(),
});
export default function EventModal({
  isOpen,
  onClose,
  slotInfo = undefined,
}: EventModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [startSelectedDate, setStartSelectedDate] = useState<Date | null>();
  const trpc = api.useUtils();
  const [endSelectedDate, setEndSelectedDate] = useState<Date | null>();
  console.log(slotInfo);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      startDate: slotInfo?.start || new Date(),
      endDate: slotInfo?.end || new Date(),
    },
  });

  useEffect(() => {
    if (slotInfo) {
      setStartSelectedDate(slotInfo.start);
      setEndSelectedDate(slotInfo.end);
      form.reset({
        ...form.getValues(),
        startDate: slotInfo.start,
        endDate: slotInfo.end,
      });
    }
  }, [slotInfo, form]);

  const calendarMutation = api.calendar.addEvent.useMutation({
    onSuccess() {
      setStartSelectedDate(null);
      setEndSelectedDate(null);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!startSelectedDate || !endSelectedDate) {
      console.error("Start and end dates must be selected");
      return;
    }

    const startDateTime = startSelectedDate.toISOString();
    const endDateTime = endSelectedDate.toISOString();

    calendarMutation.mutate(
      {
        title: values.title,
        startDateTime,
        endDateTime,
        description: "",
      },
      {
        onSuccess: () => {
          console.log("success");
          setIsModalOpen(false);
          trpc.invalidate();
        },
        onError: (error) => {
          console.error("Error submitting event:", error);
        },
      }
    );
    setIsModalOpen(false);
    console.log(values);
  }

  const handleStartDateSelect = (date: Date | null) => {
    setStartSelectedDate(date);
  };
  const handleEndDateSelect = (date: Date | null) => {
    setEndSelectedDate(date);
  };

  return (
    <Modal
      isOpen={isOpen || isModalOpen}
      onOpenChange={onClose || setIsModalOpen}
    >
      <ModalContent
        className={cn(
          "z-[21] flex h-[600px] w-[600px] flex-col gap-4 rounded bg-neutral-300 p-4 dark:bg-neutral-600"
        )}
      >
        <ModalTitle asChild>
          <h1 className="font-bold">Add Event</h1>
        </ModalTitle>
        <Divider />
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8 rounded p-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title:</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-neutral-900"
                      placeholder="John Doe's birthday..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=" text-xs italic">
                    The title of the calendar event.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date:</FormLabel>
                  <br />
                  <FormControl>
                    <MiniCalendar
                      onDateSelect={handleStartDateSelect}
                      defaultDate={slotInfo?.start}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date:</FormLabel>
                  <br />
                  <FormControl>
                    <MiniCalendar
                      onDateSelect={handleEndDateSelect}
                      defaultDate={slotInfo?.end}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Divider />

            <div className="flex justify-end">
              <button
                className="ml-auto mt-auto w-[80px] gap-4 space-x-8 rounded bg-blue-700 px-4 py-2 hover:bg-blue-600"
                type="submit"
              >
                Submit
              </button>
              <ModalClose
                className="ml-2 w-[80px] rounded bg-close-button-bg px-4 py-2 text-close-button-text-color hover:bg-close-button-bg-hover hover:text-close-button-text-color-hover"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Close
              </ModalClose>
            </div>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}

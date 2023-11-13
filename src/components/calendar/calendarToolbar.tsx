import { Calendar } from "@/components/ui/datepicker";
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
import { cn } from "@/lib/utils";
import { Button, Divider, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { Navigate, type View, type ToolbarProps } from "react-big-calendar";
import { Form, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "The title must be at least two characters.",
  }),
  startDate: z.date(),
  endDate: z.date(),
});
const CustomToolbar: React.FC<ToolbarProps> = (toolbar) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startSelectedDate, setStartSelectedDate] = useState<Date | null>();
  const trpc = api.useUtils();
  const [endSelectedDate, setEndSelectedDate] = useState<Date | null>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });
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
    console.log(values);
  }
  const goToBack = () => {
    toolbar.onNavigate(Navigate.PREVIOUS);
  };

  const goToNext = () => {
    toolbar.onNavigate(Navigate.NEXT);
  };

  const goToCurrent = () => {
    toolbar.onNavigate(Navigate.TODAY);
  };
  const handleStartDateSelect = (date: Date | null) => {
    setStartSelectedDate(date);
  };
  const handleEndDateSelect = (date: Date | null) => {
    setEndSelectedDate(date);
  };

  const viewButtons = (
    Array.isArray(toolbar.views) ? toolbar.views : Object.keys(toolbar.views)
  ).map((view) => (
    <button
      key={view}
      onClick={() => toolbar.onView(view as View)}
      className={toolbar.view === view ? "active" : ""}
    >
      {view.charAt(0).toUpperCase() + view.slice(1)}
    </button>
  ));
  return (
    <>
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={goToBack}>
            Back
          </button>
          <button type="button" onClick={goToCurrent}>
            Today
          </button>
          <button type="button" onClick={goToNext}>
            Next
          </button>
        </span>
        <span className="rbc-toolbar-label">{toolbar.label}</span>
        <span className="rbc-btn-group">
          {viewButtons}

          <button type="button" onClick={() => setIsModalOpen(true)}>
            Add Event
          </button>
        </span>
      </div>
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent
          className={cn(
            "z-[21] flex h-[600px] w-[600px] flex-col gap-4 rounded bg-neutral-800 p-4"
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
                      <Calendar
                        onDateSelect={handleStartDateSelect}
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
                      <Calendar onDateSelect={handleEndDateSelect} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Divider />

          <div className="flex justify-end">

            <button className="ml-auto mt-auto w-[80px] gap-4 space-x-8 rounded bg-blue-700 px-4 py-2 hover:bg-blue-600" type="submit">Submit</button>
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
    </>
  );
};

export default CustomToolbar;

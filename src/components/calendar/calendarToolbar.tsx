import { DatePicker } from "@/components/ui/datepicker";
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
  ModalTrigger,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Button, Divider, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { Navigate, type View, type ToolbarProps } from "react-big-calendar";
import { Form, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "The title must be at least two characters.",
  }),
});
const CustomToolbar: React.FC<ToolbarProps> = (toolbar) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
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
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
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
            "z-[21] flex h-1/2 w-[600px] flex-col gap-4 rounded bg-neutral-800 p-4"
          )}
        >
          <ModalTitle asChild>
            <h1 className="font-bold">Add Event</h1>
          </ModalTitle>
          <Divider />
          <FormProvider {...form}>
            <Form {...form}>
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
                        <Input className="bg-neutral-900"
                          placeholder="John Doe's birthday..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="font-italic">
                        The title of the calendar event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </FormProvider>

          <DatePicker onDateSelect={handleDateSelect} />
          <ModalClose
            className="bg-[#310413] px-4 py-2 text-custom-color ml-auto mt-auto hover: w-[80px]"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Close
          </ModalClose>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomToolbar;

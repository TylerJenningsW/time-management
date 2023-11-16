import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQItem() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is the Pomodoro Technique?</AccordionTrigger>
        <AccordionContent>
          The pomodoro technique is a way to better manage your time, which was originally developed by Francesco Cirillo. The technique uses 25-minute splits folowed by a 5-minute break.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I get support?</AccordionTrigger>
        <AccordionContent>
          Contact me at tylerjenningsw@gmail.com
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

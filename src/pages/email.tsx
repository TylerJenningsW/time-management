import { type NextPage } from "next";
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
const formSchema = z.object({
  email: z.string().email({
    message: "Must contain a valid email address.",
  }),
  subject: z.string().min(2, {
    message: "The subject must be at least two characters long."
  }),
  text: z.string().min(2, {
    message: "Te text must be at least two characters long."
  }),
})
const EmailPage: NextPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      subject: "",
      text: "",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <div className="dark:bg-neutral-800 flex flex-col min-h-screen items-center py-20">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-neutral-700  w-1/4 border-solid rounded  p-4 space-y-8">
      <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email To:</FormLabel>
              <FormControl className="">
                <Input placeholder="example@gmail.com..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject:</FormLabel>
              <FormControl className="">
                <Input placeholder="Question about..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text:</FormLabel>
              <FormControl className="">
                <Textarea placeholder="Hey there..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  );
};
export default EmailPage;

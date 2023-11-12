import { type NextPage } from "next";
import { Html } from "@react-email/html";
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { useForm } from "react-hook-form";
const formSchema = z.object({
  email: z.string().email({
    message: "Must contain a valid email address.",
  }),
})
const EmailPage: NextPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <div className="dark:bg-neutral-700 flex flex-col min-h-screen items-center py-20">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/4 border-solid rounded border-2 border-black p-4 space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email To:</FormLabel>
              <FormControl className="">
                <Input placeholder="example@gmail.com..." {...field} />
              </FormControl>
              <FormDescription className="font-italic">
                This is who you are sending the email to.
              </FormDescription>
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

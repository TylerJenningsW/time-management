import { type NextPage } from "next";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const formSchema = z.object({
  email: z.string().email({
    message: "Must contain a valid email address.",
  }),
  subject: z.string().min(2, {
    message: "The subject must be at least two characters long.",
  }),
  text: z.string().min(2, {
    message: "Te text must be at least two characters long.",
  }),
});
const EmailPage: NextPage = () => {
  const router = useRouter();

  const { data: session, status } = useSession();

  const { toast } = useToast();
  const emailMutation = api.email.send.useMutation();
  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=' + window.location.href);
    }
  }, [session, status, router]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      subject: "",
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    emailMutation.mutate(
      {
        to: values.email,
        subject: values.subject,
        text: values.text,
      },
      {
        onSuccess: () => {
          toast({
            className: cn(
              "bottom-2 text-white rounded z-[2147483647] w-[400px] max-h-[100px] right-0 flex fixed md:max-w-[420px] md:bottom-2 md:right-4 sm:bottom-2 sm:right-0"
            ),
            description: `Email sent.`,
          });
        },
        onError: (error) => {
          toast({
            className: cn(
              "bottom-2 rounded z-[2147483647] w-[400px] max-h-[100px] right-0 flex fixed md:max-w-[420px] md:bottom-2 md:right-4 sm:bottom-2 sm:right-0"
            ),
            description: `Email failed to send due to ${error}.`,
          });
        },
      }
    );

    console.log(values);
  }
  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center gap-4 p-16">
        Sign In
      </div>
    );
  }
  return (
    <div className="  mt-16 flex min-h-screen flex-col items-center py-20">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/4  space-y-8 rounded border-solid bg-neutral-300 dark:bg-neutral-600 p-4"
        >
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
          <button
            className="ml-auto mt-auto w-[80px] gap-4 space-x-8 rounded bg-blue-700 px-4 py-2 hover:bg-blue-600"
            type="submit"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
};
export default EmailPage;

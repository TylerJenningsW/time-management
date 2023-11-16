import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useSession } from "next-auth/react";
import Timer from "~/components/timer";
import { api } from "~/utils/api";
import { Card, CardHeader } from "@nextui-org/react";
import { type Task } from "~/types/types";
import Loading from "~/components/loading";
import TrashIcon from "~/svgs/deleteIcon";
import CheckIcon from "~/svgs/checkIcon";
import AiButton from "~/components/aiButton";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

config.autoAddCss = false;

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const { data, isLoading, error } = api.task.get.useQuery();
  const trpc = api.useUtils();
  const { toast } = useToast();

  const deleteMutation = api.task.delete.useMutation({
    onSuccess: (data) => {
      trpc.invalidate();
    },
    onError: (error) => {
      console.error("Error getting AI response:", error);
    },
  });
  const handleDeleteTask = async (taskId: number) => {
    try {
      // Call your API to delete the task
      await deleteMutation.mutate({ taskId: taskId });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };
  useEffect(() => {
    if (data) {
      console.log("Data:", data);

      setTasks(data);
      setLoading(false);
    }
  }, [data]);
  let content;

  if (isLoading) {
    content = <Loading />;
  } else if (error?.message.includes('UNAUTHORIZED')) {
    content = <></>
  }
  else if (error) {
    content = <div>An error occurred: {error.message}</div>;
  } else {
    content = (
      <>
        {tasks.map((task) => (
          <Card
            className="flex w-2/4 gap-4 rounded border-black bg-neutral-300 p-4 dark:bg-neutral-600"
            key={task.id}
          >
            <CardHeader>
              <div className="flex w-3/4">
                <h2 className="px-8">{task.title}</h2>
                <p className="ml-auto px-8">{task.category}</p>
              </div>
              <button className="ml-auto"
                onClick={() => {
                  toast({
                    className: cn(
                      "text-white bottom-2 rounded z-[2147483647] w-[400px] max-h-[100px] right-0 flex fixed md:max-w-[420px] md:bottom-2 md:right-4 sm:bottom-2 sm:right-0"
                    ),
                    description: `Task ${task.title} complete!`,
                  });
                  handleDeleteTask(task.id);
                }}
              >
                <CheckIcon />
              </button>
            </CardHeader>
          </Card>
        ))}
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Time Management App</title>
        <meta
          name="description"
          content="Time Management App for making better use of your time."
        />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center gap-4 p-16">
        <AiButton></AiButton>
        <Timer></Timer>
        {content}
      </main>
    </>
  );
};

export default Home;

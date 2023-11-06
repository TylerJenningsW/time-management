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

config.autoAddCss = false;

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const { data, isLoading, error } = api.task.get.useQuery();


  useEffect(() => {
    if (data) {
      console.log("Data:", data);

      const tasksWithIdAsString = data.map((task) => ({
        ...task,
        id: task.id.toString(),
      }));
      console.log("Tasks with ID as String:", tasksWithIdAsString);

      setTasks(tasksWithIdAsString);
      setLoading(false);
    }
  }, [data]);
  let content;

  if (isLoading || loading) {
    content = <Loading />;
  } else if (error) {
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
            <h2 className="px-8">{task.title}</h2>
            <p className="ml-auto px-8">{task.category}</p>
            <CheckIcon className="ml-auto"/>
            <TrashIcon/>
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
        <meta name="description" content="Time Management App for making better use of your time." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center gap-4 p-16">
        <button className="absolute left-[-36px] top-1/2 z-10 -translate-y-1/2 -rotate-90 transform rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-300">
          AI Chatbot
        </button>
        <Timer></Timer>
        {content}
      </main>
    </>
  );
};

export default Home;

import BaseCalendar from "./CalendarBase";
import { api } from "~/utils/api";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "../loading";
import CustomToolbar from "./calendarToolbar";
import { useRouter } from "next/router";

const components = {
  event: (props: any) => {
    const eventType = props?.event?.type;
    switch (eventType) {
      default:
        return (
          <div
            style={{ background: "darkblue", color: "white", height: "100%" }}
          >
            {props.title}
          </div>
        );
    }
  },
};

function Calendar() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const { data: session, status } = useSession();
  const { data, isLoading, isError, error: trpcError } = api.calendar.getEvents.useQuery(undefined, {
    enabled: shouldFetch,
    onError: (err) => {
      setError(err.message);
      if (err.message.includes('UNAUTHORIZED')) {
        setShouldFetch(false);
      }
    },
  });
  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=' + window.location.href);
    }
  }, [session, status, router]);
  if (!session?.user) {
    return (
      <div className="mt-16 flex min-h-screen flex-col items-center gap-4 p-16">
        Sign In
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error: {error}</div>;
  }

  const events = data;
  console.log("Events from API:", events);

  return (
    <>
      <BaseCalendar
      className="mt-16 backdrop-blur-sm"
        events={events}
        components={{
          ...components,
          toolbar: CustomToolbar
        }}
      />
    </>
  );
}
export default Calendar;

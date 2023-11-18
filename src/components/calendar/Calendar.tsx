import BaseCalendar from "./CalendarBase";
import { api } from "~/utils/api";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "../loading";
import CustomToolbar from "./calendarToolbar";
import { useRouter } from "next/router";
import { type SlotInfo } from "react-big-calendar";
import EventModal from "./eventModal";

const components = {
  event: (props: any) => {
    const eventType = props?.event?.type;
    switch (eventType) {
      default:
        return (
          <div className="bg-blue-700 font-bold text-white"
          >
            {props.title}
          </div>
        );
    }
  },
};

function Calendar() {
  const router = useRouter();
  const clickRef = useRef<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState<SlotInfo>();

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
  useEffect(() => {
    /**
     * What Is This?
     * This is to prevent a memory leak, in the off chance that you
     * teardown your interface prior to the timed method being called.
     */
    return () => {
      window.clearTimeout(clickRef?.current)
    }
  }, [])
  
  const onSelectSlot = useCallback((slotInfo: SlotInfo) => {
    /**
     * Here we are waiting 250 milliseconds prior to firing
     * our method. Why? Because both 'click' and 'doubleClick'
     * would fire, in the event of a 'doubleClick'. By doing
     * this, the 'click' handler is overridden by the 'doubleClick'
     * action.
     */
    window.clearTimeout(clickRef?.current)
    clickRef.current = window.setTimeout(() => { 
      setSlotInfo(slotInfo)
      setIsModalOpen(true);
    }, 250)
  }, [])

  const defaultDate = useMemo(() => new Date(2015, 3, 1), [])
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
        onSelectSlot={onSelectSlot}
        selectable
      />
      
      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        slotInfo={slotInfo} />
    </>
  );
}
export default Calendar;

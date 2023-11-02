import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import Navbar from "~/components/navbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <Navbar />
        <Component {...pageProps} />
      </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

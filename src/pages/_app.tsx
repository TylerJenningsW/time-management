import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import Navbar from "~/components/menu/navbar";
import { Toaster } from "@/components/ui/toaster";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <Toaster />
          <Navbar />
          <Component {...pageProps} />
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

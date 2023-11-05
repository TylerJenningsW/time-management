import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { addTaskRouter } from "./routers/addTaskRouter";
import { calendarRouter } from "./routers/calendarRouter";
import { checkoutRouter } from "./routers/checkoutRouter";
import { contactsRouter } from "./routers/contactsRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  task: addTaskRouter,
  calendar: calendarRouter,
  checkout: checkoutRouter,
  contacts: contactsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

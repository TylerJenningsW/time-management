import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { taskRouter } from "./routers/taskRouter";
import { calendarRouter } from "./routers/calendarRouter";
import { checkoutRouter } from "./routers/checkoutRouter";
import { contactsRouter } from "./routers/contactsRouter";
import { userRouter } from "./routers/user";
import { aiRouter } from "./routers/aiRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  task: taskRouter,
  calendar: calendarRouter,
  checkout: checkoutRouter,
  contacts: contactsRouter,
  user: userRouter,
  ai: aiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

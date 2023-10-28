import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const addTaskRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(z.object({ task: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a task.",
        });
      }
      const task = await ctx.prisma.task.create({
        data: {
          title: input.task,
          userId: ctx.session.user.id,
        },
      });

      return task;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

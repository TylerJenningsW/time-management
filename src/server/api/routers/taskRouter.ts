import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  add: protectedProcedure
  .input(z.object({ title: z.string(), category: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const title = input.title;
    const category = input.category;
    const task = await ctx.prisma.task.create({
      data: {
        title: title,
        category: category,
        userId: userId,
      },
    });

    return task;
  }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const account = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session?.user.id,
      },
      include: {
        tasks: true,
      },
    });
    if (!account) throw new Error("User not found");

    return account?.tasks;
  }),
  delete: protectedProcedure
    .input(z.object({ taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const taskId = input.taskId;
      const userId = ctx.session.user.id;

      const deletedTask = await ctx.prisma.task.deleteMany({
        where: {
          id: taskId,
          userId: userId,
        },
      });

      if (deletedTask.count === 0) {
        throw new Error("Task not found or user not authorized to delete this task");
      }

      return { success: true, taskId: taskId };
    }),
});

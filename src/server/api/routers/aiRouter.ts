import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { OpenAI } from "openai";
import { env } from "~/env.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_KEY,
});

export const aiRouter = createTRPCRouter({
  chat: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const response = await openai.chat.completions.create({
          messages: [{ role: "user", content: input.text }],
          model: "gpt-3.5-turbo",
        });
        return {
          text: response.choices[0]?.message.content,
        };
      } catch (error) {
        console.error("Error calling OpenAI:", error);
        throw new Error("Failed to generate text with OpenAI");
      }
    }),
});

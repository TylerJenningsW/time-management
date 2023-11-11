import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import nodemailer from "nodemailer";

export const emailRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(z.object({ to: z.string(), subject: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;
      const account = await ctx.prisma.account.findFirst({
        where: {
          userId: ctx.session?.user.id,
          provider: "google",
        },
      });
      const accessToken = account?.access_token;
      const email = ctx.session.user.email?.toString()
      if (!account || !session || !accessToken) {
        throw new Error("Unauthorized");
      }
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: email,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: email,
        to: input.to,
        subject: input.subject,
        text: input.text,
      };

      const response = await transporter.sendMail(mailOptions);
      if (response.accepted) {
        return { status: "Email sent successfully" };
      } else if (response.rejected) {
        return { status: "Email failed to send." };
      }
    }),
});

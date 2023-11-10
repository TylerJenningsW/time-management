import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Stripe from "stripe";
import { env } from "~/env.mjs";
const stripe = new Stripe(`${env.STRIPE_SECRET_KEY}`);

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user) {
      throw new Error("FORBIDDEN");
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "us_bank_account"],
      metadata: {
        userId: ctx.session.user.id,
      },
      success_url: "https://localhost:3000/success",
      cancel_url: "https://localhost:3000/",
      line_items: [{ price: env.PRICE_ID, quantity: 1 }],
      mode: "payment",
    });
    return session;
  }),
});

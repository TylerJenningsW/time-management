import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user) {
      throw new Error("FORBIDDEN");
    }
    const session = await stripe.checkout.sessions.create({
        success_url: "https://localhost:3000/success",
        cancel_url: "https://localhost:3000/",
      line_items: [{ price: "price_H5ggYwtDq4fbrJ", quantity: 2 }],
      mode: "payment",
    });
    return session;
  }),
});

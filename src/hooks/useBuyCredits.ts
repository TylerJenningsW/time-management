import { loadStripe } from "@stripe/stripe-js";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

console.log("Stripe Public Key:", env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`);

export default function UseBuyCredits() {
  const checkout = api.checkout.createCheckout.useMutation();

  return {
    buyCredits: async () => {
      const response = await checkout.mutateAsync();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: response.id,
      });
    },
  };
}

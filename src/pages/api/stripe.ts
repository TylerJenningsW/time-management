import { type NextApiRequest, type NextApiResponse } from "next";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { buffer } from "micro";
import { prisma } from "../../server/db";
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
export const config = {
  api: {
    bodyParser: false,
  },
};
const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    console.log("here ok")
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      console.log("here ok2")

      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        `${env.STRIPE_WEBHOOK_SECRET}`
      );
    } catch (err) {
      let message = "Unknown error";
      if (err instanceof Error) message = err.message;
      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }
    switch (event.type) {
      case "checkout.session.completed":
        console.log("completed")
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata && "userId" in session.metadata) {
          console.log("meta")
          const userId = session.metadata.userId as string;

          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              credits: {
                increment: 100,
              },
            },
          });
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhook;

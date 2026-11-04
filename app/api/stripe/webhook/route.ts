import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { employerId, candidateId } = session.metadata || {};

    if (employerId && candidateId) {
      await prisma.candidateUnlock.upsert({
        where: { employerId_candidateId: { employerId, candidateId } },
        create: { employerId, candidateId, stripeSessionId: session.id },
        update: { stripeSessionId: session.id },
      });
    }
  }

  return NextResponse.json({ received: true });
}

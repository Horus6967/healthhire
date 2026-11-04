import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-10-28.endive",
});

export const UNLOCK_PRICE = 4900; // $49.00 in cents

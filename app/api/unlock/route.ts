import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe, UNLOCK_PRICE } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { candidateId } = await req.json() as { candidateId: string };

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { employer: true },
  });

  if (!user?.employer) return NextResponse.json({ error: "Employer only" }, { status: 403 });

  // Check if already unlocked
  const existing = await prisma.candidateUnlock.findUnique({
    where: { employerId_candidateId: { employerId: user.employer.id, candidateId } },
  });
  if (existing) return NextResponse.json({ alreadyUnlocked: true });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://healthhire.careers";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: UNLOCK_PRICE,
          product_data: {
            name: "Candidate Contact Unlock",
            description: "Unlock full contact info and resume for this verified healthcare candidate",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      employerId: user.employer.id,
      candidateId,
    },
    success_url: `${appUrl}/employers/candidates?unlocked=${candidateId}`,
    cancel_url: `${appUrl}/employers/candidates`,
  });

  return NextResponse.json({ url: session.url });
}

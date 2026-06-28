export const dynamic = "force-dynamic";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { headline, bio, location } = await req.json();

  // Get full user details from Clerk in case they haven't been synced via webhook yet
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || null;

  // Upsert the user — handles both webhook-synced and non-synced users
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { role: "CANDIDATE" },
    create: {
      clerkId: userId,
      email,
      name,
      role: "CANDIDATE",
    },
  });

  const candidate = await prisma.candidate.upsert({
    where: { userId: user.id },
    update: { headline, bio, location },
    create: { userId: user.id, headline, bio, location },
  });

  return NextResponse.json(candidate);
}

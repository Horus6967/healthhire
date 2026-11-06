export const dynamic = "force-dynamic";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { headline, bio, location, specialty, phone, resumeUrl } = await req.json() as {
    headline?: string; bio?: string; location?: string; specialty?: string; phone?: string; resumeUrl?: string;
  };

  const cleanPhone = phone?.trim() || null;
  const cleanResume = resumeUrl?.trim() || null;
  if (cleanResume && !/^https?:\/\//i.test(cleanResume)) {
    return NextResponse.json({ error: "Resume link must start with https://" }, { status: 400 });
  }

  // Get full user details from Clerk in case they haven't been synced via webhook yet
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || null;

  // Upsert the user — handles both webhook-synced and non-synced users
  const user = await prisma.user.upsert({
    where: { email },
    update: { clerkId: userId, role: "CANDIDATE" },
    create: {
      clerkId: userId,
      email,
      name,
      role: "CANDIDATE",
    },
  });

  const candidate = await prisma.candidate.upsert({
    where: { userId: user.id },
    update: { headline, bio, location, specialty, phone: cleanPhone, resumeUrl: cleanResume },
    create: { userId: user.id, headline, bio, location, specialty, phone: cleanPhone, resumeUrl: cleanResume },
  });

  return NextResponse.json(candidate);
}

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidate: true },
  });

  if (!user?.candidate) {
    return NextResponse.json({ error: "No candidate profile" }, { status: 403 });
  }

  const application = await prisma.application.upsert({
    where: {
      jobId_candidateId: { jobId, candidateId: user.candidate.id },
    },
    update: {},
    create: {
      jobId,
      candidateId: user.candidate.id,
    },
  });

  return NextResponse.json(application);
}

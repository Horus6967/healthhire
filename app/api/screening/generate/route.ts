import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getScreeningQuestions } from "@/lib/screeningQuestions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidate: { include: { screening: true } } },
  });

  if (!user?.candidate) return NextResponse.json({ error: "No candidate profile" }, { status: 404 });
  if (user.candidate.screening?.status === "COMPLETED") {
    return NextResponse.json({ error: "Screening already completed" }, { status: 400 });
  }

  const { specialty } = await req.json();
  const questions = getScreeningQuestions(specialty ?? "");

  await prisma.screening.upsert({
    where: { candidateId: user.candidate.id },
    create: {
      candidateId: user.candidate.id,
      questions: questions as object[],
      status: "IN_PROGRESS",
    },
    update: {
      questions: questions as object[],
      status: "IN_PROGRESS",
      score: null,
      completedAt: null,
    },
  });

  return NextResponse.json({ questions });
}

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidate: { include: { screening: true } } },
  });

  if (!user?.candidate?.screening) {
    return NextResponse.json({ error: "No screening found" }, { status: 404 });
  }

  const { answers } = await req.json() as { answers: Record<string, string> };

  const questions = user.candidate.screening.questions as Array<{ id: string; question: string }>;

  const qaText = questions
    .map((q) => `Q: ${q.question}\nA: ${answers[q.id] || "(no answer)"}`)
    .join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a healthcare recruiter evaluating screening answers. Score the candidate from 0-100 based on their answers. Consider clinical knowledge, communication, professionalism, and situational judgment. Return JSON: { score: number, summary: string }`,
      },
      { role: "user", content: qaText },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content || "{}";
  const result = JSON.parse(content) as { score?: number; summary?: string };
  const score = Math.min(100, Math.max(0, result.score || 50));

  await prisma.screening.update({
    where: { candidateId: user.candidate.id },
    data: {
      answers,
      score,
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  return NextResponse.json({ score, summary: result.summary });
}

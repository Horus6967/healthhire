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
        content: `You are an experienced healthcare recruiter reviewing a candidate's screening answers. Score honestly from 0-100 based on clinical knowledge, communication, professionalism, and situational judgment. Do not inflate or deflate the score.

Then give constructive, specific feedback written directly to the candidate (use "you"). Return JSON:
{
  "score": number,
  "summary": string (2-3 supportive but accurate sentences about the answers),
  "strengths": string[] (up to 3 strengths that the answers actually show; empty if none),
  "improvements": string[] (3-4 concrete steps to strengthen their answers and their HealthHire profile so it appeals to employers, such as adding specific certifications, years of experience, a clear professional headline, location, and a bio focused on their clinical strengths, and adding verified work history)
}`,
      },
      { role: "user", content: qaText },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content || "{}";
  const result = JSON.parse(content) as {
    score?: number;
    summary?: string;
    strengths?: unknown;
    improvements?: unknown;
  };
  const rawScore = typeof result.score === "number" ? result.score : 50;
  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  const toList = (value: unknown) =>
    Array.isArray(value) ? value.filter((v): v is string => typeof v === "string").slice(0, 4) : [];

  const feedback = {
    summary: typeof result.summary === "string" ? result.summary : "",
    strengths: toList(result.strengths).slice(0, 3),
    improvements: toList(result.improvements),
  };

  await prisma.screening.update({
    where: { candidateId: user.candidate.id },
    data: {
      answers,
      score,
      feedback,
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  return NextResponse.json({ score, ...feedback });
}

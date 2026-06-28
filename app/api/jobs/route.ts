export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, specialty, location, jobType, salary, description, requirements } = body;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { employer: true },
  });

  if (!user?.employer) {
    return NextResponse.json({ error: "No employer profile" }, { status: 403 });
  }

  const job = await prisma.job.create({
    data: {
      employerId: user.employer.id,
      title,
      specialty,
      location,
      jobType,
      salary: salary || null,
      description,
      requirements: requirements || null,
    },
  });

  return NextResponse.json(job);
}

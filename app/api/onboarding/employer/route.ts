import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { companyName, website, description } = await req.json();

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || null;

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { role: "EMPLOYER" },
    create: {
      clerkId: userId,
      email,
      name,
      role: "EMPLOYER",
    },
  });

  const employer = await prisma.employer.upsert({
    where: { userId: user.id },
    update: { companyName, website, description },
    create: { userId: user.id, companyName, website: website || null, description: description || null },
  });

  return NextResponse.json(employer);
}

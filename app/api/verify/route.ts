export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const entry = await prisma.workHistory.findUnique({
    where: { verificationToken: token },
  });

  if (!entry) return NextResponse.json({ error: "Invalid token" }, { status: 404 });

  if (entry.verificationStatus === "VERIFIED") {
    return NextResponse.json({ already: true });
  }

  await prisma.workHistory.update({
    where: { verificationToken: token },
    data: {
      verificationStatus: "VERIFIED",
      verifiedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}

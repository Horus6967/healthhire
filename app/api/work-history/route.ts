import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/resend";
import { generateToken } from "@/lib/utils";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    managerName: string;
    managerEmail: string;
    npiNumber?: string;
    npiVerified?: boolean;
  };
  const { jobTitle, company, startDate, endDate, current, managerName, managerEmail, npiNumber, npiVerified } = body;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidate: true },
  });

  if (!user?.candidate) {
    return NextResponse.json({ error: "No candidate profile" }, { status: 403 });
  }

  const isNpiVerified = !!npiVerified;

  // Only generate a token if we'll need to send the manager email
  const token = isNpiVerified ? null : generateToken();

  const entry = await prisma.workHistory.create({
    data: {
      candidateId: user.candidate.id,
      jobTitle,
      company,
      startDate: new Date(startDate),
      endDate: current ? null : endDate ? new Date(endDate) : null,
      current: !!current,
      managerName,
      managerEmail,
      npiNumber: npiNumber ?? null,
      npiVerified: isNpiVerified,
      verificationToken: token,
      verificationStatus: isNpiVerified ? "VERIFIED" : "PENDING",
      verifiedAt: isNpiVerified ? new Date() : null,
    },
  });

  // Send verification email only when NPI didn't already verify
  let emailError = null;
  if (!isNpiVerified && token) {
    const result = await sendVerificationEmail({
      managerEmail,
      managerName,
      candidateName: user.name || user.email,
      jobTitle,
      company,
      token,
    });
    if (result.error) {
      emailError = result.error;
      console.error("Resend error:", JSON.stringify(result.error));
    }
  }

  return NextResponse.json({ ...entry, emailError });
}

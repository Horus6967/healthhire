export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md text-center">
          <p className="text-slate-500">Invalid verification link.</p>
        </div>
      </div>
    );
  }

  const entry = await prisma.workHistory.findUnique({
    where: { verificationToken: token },
    include: { candidate: { include: { user: true } } },
  });

  if (!entry) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Link not found</h1>
          <p className="text-slate-500 text-sm">This verification link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  if (entry.verificationStatus === "VERIFIED") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Already verified</h1>
          <p className="text-slate-500 text-sm">
            This work history has already been confirmed. Thank you!
          </p>
        </div>
      </div>
    );
  }

  // Auto-verify on page load
  await prisma.workHistory.update({
    where: { verificationToken: token },
    data: { verificationStatus: "VERIFIED", verifiedAt: new Date() },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Work history confirmed!</h1>
        <p className="text-slate-600 mb-2">
          You&apos;ve confirmed that{" "}
          <strong>{entry.candidate.user.name || entry.candidate.user.email}</strong> worked as{" "}
          <strong>{entry.jobTitle}</strong> at <strong>{entry.company}</strong>.
        </p>
        <p className="text-slate-400 text-sm mb-6">
          This verification is now visible to employers on HealthHire. No account required — you&apos;re all done!
        </p>
        <Link href="/" className="text-blue-600 text-sm hover:underline">
          Learn about HealthHire →
        </Link>
      </div>
    </div>
  );
}

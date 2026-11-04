export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import UnlockButton from "@/app/employers/candidates/UnlockButton";

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const viewer = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { employer: { include: { unlocks: true } } },
  });

  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      workHistory: { orderBy: { startDate: "desc" } },
      screening: { select: { score: true, status: true } },
    },
  });

  if (!candidate) notFound();

  const isEmployer = !!viewer?.employer;
  const isOwner = !isEmployer && !!viewer;
  const isUnlocked = isEmployer
    ? viewer.employer!.unlocks.some((u) => u.candidateId === id)
    : false;

  const showContact = isOwner || isUnlocked;
  const score = candidate.screening?.score;
  const screeningDone = candidate.screening?.status === "COMPLETED";
  const verifiedHistory = candidate.workHistory.filter(
    (w) => w.verificationStatus === "VERIFIED" || w.npiVerified
  );

  const initials = (candidate.user.name || candidate.user.email)
    .split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-5">

        {/* Profile card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] font-bold text-2xl flex-shrink-0">
              {showContact ? initials : "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {showContact ? (candidate.user.name || "Healthcare Professional") : "Verified Candidate"}
                </h1>
                {screeningDone && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    (score ?? 0) >= 75 ? "bg-green-50 text-green-700 border-green-200" :
                    (score ?? 0) >= 50 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                    "bg-gray-50 text-gray-600 border-gray-200"
                  }`}>
                    AI Score: {score}/100
                  </span>
                )}
                {verifiedHistory.length > 0 && (
                  <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                    ✓ Verified History
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">{candidate.headline || candidate.specialty || "Healthcare Professional"}</p>
              <p className="text-gray-400 text-sm mt-0.5">{candidate.location || "Location not specified"}</p>
              {showContact && (
                <p className="text-blue-600 text-sm font-medium mt-2">{candidate.user.email}</p>
              )}
            </div>
          </div>

          {candidate.bio && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-gray-600 text-sm leading-relaxed">{candidate.bio}</p>
            </div>
          )}

          {/* Unlock CTA for employers */}
          {isEmployer && !isUnlocked && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Unlock full contact info</p>
                <p className="text-gray-400 text-xs mt-0.5">One-time payment · Instant access · $49</p>
              </div>
              <UnlockButton candidateId={id} />
            </div>
          )}
        </div>

        {/* Work history */}
        {candidate.workHistory.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Work History</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {candidate.workHistory.map((w) => (
                <div key={w.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{w.jobTitle}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{w.company}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {new Date(w.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} —{" "}
                      {w.current ? "Present" : w.endDate ? new Date(w.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {w.npiVerified || w.verificationStatus === "VERIFIED" ? (
                      <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">✓ Verified</span>
                    ) : w.verificationStatus === "PENDING" ? (
                      <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">Pending</span>
                    ) : (
                      <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200">Unverified</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Screening score detail */}
        {screeningDone && score !== null && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">AI Screening</h2>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${
                (score ?? 0) >= 75 ? "bg-green-100 text-green-700" :
                (score ?? 0) >= 50 ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {score}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {(score ?? 0) >= 75 ? "Strong candidate" : (score ?? 0) >= 50 ? "Good candidate" : "Fair candidate"}
                </p>
                <p className="text-gray-500 text-sm">Out of 100 · Scored by AI on clinical knowledge and situational judgment</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

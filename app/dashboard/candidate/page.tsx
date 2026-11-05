export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import WorkHistorySection from "./WorkHistorySection";
import { getScreeningBand, type ScreeningFeedback } from "@/lib/screeningBand";

export default async function CandidateDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      candidate: {
        include: {
          workHistory: { orderBy: { startDate: "desc" } },
          screening: true,
        },
      },
    },
  });

  if (!user) redirect("/onboarding/candidate");
  if (!user.candidate) redirect("/onboarding/candidate");

  const candidate = user.candidate;
  const verifiedCount = candidate.workHistory.filter(
    (w) => w.verificationStatus === "VERIFIED" || w.npiVerified
  ).length;
  const totalCount = candidate.workHistory.length;
  const screening = candidate.screening;
  const screeningDone = screening?.status === "COMPLETED";
  const score = screening?.score;
  const feedback = screening?.feedback as ScreeningFeedback | null | undefined;

  const scoreColor = score !== undefined && score !== null
    ? score >= 75 ? "text-[#3ECF8E]" : score >= 50 ? "text-yellow-400" : "text-red-400"
    : "text-white";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="text-white/40 text-sm mt-1">Welcome back, {user.name || user.email}</p>
          </div>
          <Link
            href={`/candidate/${candidate.id}`}
            className="border border-white/10 text-white/60 hover:text-white hover:border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View public profile →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
            <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">AI Screening</p>
            {screeningDone ? (
              <div>
                <p className={`text-3xl font-bold ${scoreColor}`}>
                  {score}<span className="text-sm font-normal text-white/30">/100</span>
                </p>
                {score !== null && score !== undefined && (
                  <p className="text-sm font-semibold text-white/70 mt-1">{getScreeningBand(score).label} profile</p>
                )}
                <p className="text-xs text-[#3ECF8E] mt-1 font-medium">✓ Complete</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-white/40 mb-2">Not completed</p>
                <Link href="/screening" className="text-xs text-[#3ECF8E] font-semibold hover:underline">
                  Take screening →
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
            <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">Work History</p>
            {totalCount === 0 ? (
              <p className="text-sm text-white/30">None added</p>
            ) : (
              <div>
                <p className={`text-3xl font-bold ${verifiedCount === totalCount ? "text-[#3ECF8E]" : "text-yellow-400"}`}>
                  {verifiedCount}<span className="text-sm font-normal text-white/30">/{totalCount}</span>
                </p>
                <p className="text-xs text-white/35 mt-1">verified</p>
              </div>
            )}
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
            <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">Specialty</p>
            <p className="text-sm font-semibold text-white truncate">{candidate.specialty || candidate.headline || "—"}</p>
            <p className="text-xs text-white/35 mt-1 truncate">{candidate.location || "No location set"}</p>
          </div>
        </div>

        {/* AI Screening CTA */}
        {!screeningDone && (
          <div className="relative overflow-hidden bg-white/[0.03] border border-[#3ECF8E]/20 rounded-xl p-6 flex items-center justify-between gap-4">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ECF8E]/5 to-transparent pointer-events-none" />
            <div className="relative">
              <p className="font-bold text-white text-lg mb-1">Complete your AI Screening</p>
              <p className="text-white/40 text-sm leading-relaxed">
                5 questions · 3 minutes · Employers prioritize screened candidates.
              </p>
            </div>
            <Link
              href="/screening"
              className="relative flex-shrink-0 bg-[#3ECF8E] hover:bg-[#2db87a] text-black px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
            >
              Start Now →
            </Link>
          </div>
        )}

        {/* Private profile tips (candidate only) */}
        {screeningDone && feedback?.improvements && feedback.improvements.length > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <p className="font-bold text-white mb-1">How to strengthen your profile</p>
            <p className="text-white/40 text-sm mb-4">
              These tips are private to you. Following them helps employers see your strengths.
            </p>
            {feedback.summary && (
              <p className="text-white/50 text-sm leading-relaxed mb-4">{feedback.summary}</p>
            )}
            <ul className="space-y-2">
              {feedback.improvements.map((tip) => (
                <li key={tip} className="text-sm text-white/60 flex gap-3">
                  <span className="text-yellow-400 flex-shrink-0">→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Verified badge */}
        {screeningDone && verifiedCount > 0 && (
          <div className="bg-[#3ECF8E]/5 border border-[#3ECF8E]/20 rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#3ECF8E]/15 flex items-center justify-center text-[#3ECF8E] text-lg flex-shrink-0">✓</div>
            <div>
              <p className="font-semibold text-white">HealthHire Verified</p>
              <p className="text-white/40 text-sm">Your profile is live and visible to employers with your AI score and verified history.</p>
            </div>
          </div>
        )}

        {/* Work History */}
        <WorkHistorySection workHistory={candidate.workHistory} />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import WorkHistorySection from "./WorkHistorySection";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user.name || user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Screening</p>
            {screeningDone ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  <span className="font-bold text-green-700">Complete</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{screening?.score}<span className="text-sm font-normal text-gray-400">/100</span></p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="font-semibold text-amber-700 text-sm">Not done</span>
                </div>
                <Link href="/screening" className="text-xs text-blue-600 font-semibold hover:underline">
                  Take screening →
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Work History</p>
            {totalCount === 0 ? (
              <span className="text-sm text-gray-400 font-medium">None added</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${verifiedCount === totalCount ? "bg-green-500" : "bg-amber-400"}`}></span>
                <span className={`font-bold text-sm ${verifiedCount === totalCount ? "text-green-700" : "text-amber-700"}`}>
                  {verifiedCount}/{totalCount} verified
                </span>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Profile</p>
            <p className="text-sm font-semibold text-gray-700 truncate">{candidate.headline || "—"}</p>
            <p className="text-xs text-gray-400 mt-0.5">{candidate.location || "No location"}</p>
          </div>
        </div>

        {/* AI Screening CTA */}
        {!screeningDone && (
          <div className="bg-gradient-to-r from-[#0A66C2] to-blue-500 rounded-2xl p-6 text-white flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-lg mb-1">Complete your AI Screening</p>
              <p className="text-blue-100 text-sm leading-relaxed">
                5 questions · 3 minutes · Employers see your verified score and prioritize you over unscreened candidates.
              </p>
            </div>
            <Link
              href="/screening"
              className="flex-shrink-0 bg-white text-[#0A66C2] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Start Now →
            </Link>
          </div>
        )}

        {/* Verified badge */}
        {screeningDone && verifiedCount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl flex-shrink-0">✓</div>
            <div>
              <p className="font-semibold text-green-900">HealthHire Verified</p>
              <p className="text-green-700 text-sm">Your profile is visible to employers with AI score and verified work history.</p>
            </div>
          </div>
        )}

        {/* Work History */}
        <WorkHistorySection workHistory={candidate.workHistory} />
      </div>
    </div>
  );
}

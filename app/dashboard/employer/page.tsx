export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function EmployerDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      employer: {
        include: {
          unlocks: {
            include: {
              candidate: {
                include: {
                  user: { select: { name: true, email: true } },
                  screening: { select: { score: true } },
                  workHistory: { where: { verificationStatus: "VERIFIED" }, take: 1 },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!user) redirect("/sign-in");
  if (!user.employer) redirect("/onboarding/employer");

  const employer = user.employer;
  const totalUnlocks = employer.unlocks.length;

  const verifiedCandidateCount = await prisma.candidate.count({
    where: { screening: { status: "COMPLETED" } },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">{employer.companyName}</h1>
            <p className="text-white/40 text-sm mt-1">Employer Dashboard</p>
          </div>
          <Link
            href="/employers/candidates"
            className="bg-[#3ECF8E] hover:bg-[#2db87a] text-black px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Browse Candidates →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
            <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">Candidates Unlocked</p>
            <p className="text-3xl font-bold text-white">{totalUnlocks}</p>
            <p className="text-xs text-white/35 mt-1">${totalUnlocks * 49} spent</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
            <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">Available Now</p>
            <p className="text-3xl font-bold text-[#3ECF8E]">{verifiedCandidateCount}</p>
            <p className="text-xs text-white/35 mt-1">verified candidates</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
            <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">Company</p>
            <p className="text-sm font-semibold text-white truncate">{employer.companyName}</p>
            {employer.website && (
              <a href={employer.website} target="_blank" rel="noreferrer" className="text-xs text-[#3ECF8E] hover:underline mt-0.5 block truncate">
                {employer.website}
              </a>
            )}
          </div>
        </div>

        {/* Find candidates CTA */}
        {totalUnlocks === 0 && (
          <div className="relative overflow-hidden bg-white/[0.03] border border-[#3ECF8E]/20 rounded-xl p-6 flex items-center justify-between gap-4">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ECF8E]/5 to-transparent pointer-events-none" />
            <div className="relative">
              <p className="font-bold text-white text-lg mb-1">
                {verifiedCandidateCount} verified candidates waiting
              </p>
              <p className="text-white/40 text-sm">
                Every candidate has completed AI screening and work history verification. Unlock contact info for $49.
              </p>
            </div>
            <Link
              href="/employers/candidates"
              className="relative flex-shrink-0 bg-[#3ECF8E] hover:bg-[#2db87a] text-black px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
            >
              Browse Now →
            </Link>
          </div>
        )}

        {/* Unlocked candidates */}
        {totalUnlocks > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.06] flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-white">Unlocked Candidates</h2>
                <p className="text-xs text-white/35 mt-0.5">Candidates you have full contact access to</p>
              </div>
              <Link href="/employers/candidates" className="text-sm text-[#3ECF8E] font-semibold hover:underline">
                Find more →
              </Link>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {employer.unlocks.map((unlock) => {
                const c = unlock.candidate;
                const initials = (c.user.name || c.user.email)
                  .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                const score = c.screening?.score;
                const scoreColor = score !== undefined && score !== null
                  ? score >= 75 ? "text-[#3ECF8E] border-[#3ECF8E]/30 bg-[#3ECF8E]/10"
                  : score >= 50 ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                  : "text-red-400 border-red-400/30 bg-red-400/10"
                  : "";
                return (
                  <div key={unlock.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#3ECF8E]/10 flex items-center justify-center text-[#3ECF8E] font-bold text-sm flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">{c.user.name || "Healthcare Professional"}</p>
                      <p className="text-[#3ECF8E] text-xs font-medium">{c.user.email}</p>
                      <p className="text-white/35 text-xs mt-0.5">{c.headline || "Healthcare Professional"} · {c.location || "—"}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {c.workHistory.length > 0 && (
                        <span className="text-[#3ECF8E] text-xs font-semibold border border-[#3ECF8E]/30 bg-[#3ECF8E]/10 px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                      {score !== undefined && score !== null && (
                        <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${scoreColor}`}>
                          {score}/100
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

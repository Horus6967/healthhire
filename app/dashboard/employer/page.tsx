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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{employer.companyName}</h1>
            <p className="text-gray-500 text-sm mt-1">Employer Dashboard</p>
          </div>
          <Link
            href="/employers/candidates"
            className="bg-[#0A66C2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004182] transition-colors shadow-sm"
          >
            Find Candidates →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Candidates Unlocked</p>
            <p className="text-3xl font-bold text-gray-900">{totalUnlocks}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Available Now</p>
            <p className="text-3xl font-bold text-gray-900">{verifiedCandidateCount}</p>
            <p className="text-xs text-gray-400 mt-1">verified candidates</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Company</p>
            <p className="text-sm font-semibold text-gray-700 truncate">{employer.companyName}</p>
            {employer.website && (
              <a href={employer.website} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-0.5 block truncate">
                {employer.website}
              </a>
            )}
          </div>
        </div>

        {/* Find candidates CTA */}
        {totalUnlocks === 0 && (
          <div className="bg-gradient-to-r from-[#0A66C2] to-blue-500 rounded-2xl p-6 text-white flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-lg mb-1">Browse {verifiedCandidateCount} verified candidates</p>
              <p className="text-blue-100 text-sm">Every candidate has completed AI screening and work history verification. Unlock contact info for $49.</p>
            </div>
            <Link
              href="/employers/candidates"
              className="flex-shrink-0 bg-white text-[#0A66C2] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Browse Now →
            </Link>
          </div>
        )}

        {/* Unlocked candidates */}
        {totalUnlocks > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-900">Unlocked Candidates</h2>
                <p className="text-xs text-gray-400 mt-0.5">Candidates you have access to contact</p>
              </div>
              <Link href="/employers/candidates" className="text-sm text-blue-600 font-semibold hover:underline">
                Find more →
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {employer.unlocks.map((unlock) => {
                const c = unlock.candidate;
                const initials = (c.user.name || c.user.email)
                  .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <div key={unlock.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] font-bold text-sm flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{c.user.name || "Healthcare Professional"}</p>
                      <p className="text-blue-600 text-xs">{c.user.email}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{c.headline || "Healthcare Professional"} · {c.location || "—"}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {c.workHistory.length > 0 && (
                        <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">
                          ✓ Verified
                        </span>
                      )}
                      {c.screening?.score !== undefined && (
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                          Score: {c.screening.score}
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

export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import UnlockButton from "./UnlockButton";
import { getScreeningBand } from "@/lib/screeningBand";

export default async function CandidateDiscovery({
  searchParams,
}: {
  searchParams: Promise<{ specialty?: string; location?: string; unlocked?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { employer: { include: { unlocks: true } } },
  });

  if (!user?.employer) redirect("/onboarding/employer");

  const unlockedIds = new Set(user.employer.unlocks.map((u) => u.candidateId));

  const candidates = await prisma.candidate.findMany({
    where: {
      screening: { status: "COMPLETED" },
      ...(params.specialty ? { specialty: { contains: params.specialty, mode: "insensitive" } } : {}),
      ...(params.location ? { location: { contains: params.location, mode: "insensitive" } } : {}),
    },
    include: {
      user: { select: { name: true, email: true } },
      workHistory: { where: { verificationStatus: "VERIFIED" }, take: 1 },
      screening: { select: { score: true, status: true } },
    },
    orderBy: { screening: { score: "desc" } },
  });

  const specialties = [
    "Registered Nurse (RN)", "Physician / MD", "Physical Therapist (PT)",
    "Pharmacist", "Medical Assistant (MA)", "Nurse Practitioner (NP)",
    "Physician Assistant (PA)", "Radiologic Technologist",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Find Verified Candidates</h1>
          <p className="text-gray-500 text-sm mt-1">
            Every candidate has completed AI screening and work history verification.
          </p>
        </div>

        {/* Filters */}
        <form method="GET" className="flex flex-wrap gap-3 mb-8">
          <select
            name="specialty"
            defaultValue={params.specialty || ""}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All specialties</option>
            {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            name="location"
            defaultValue={params.location || ""}
            placeholder="Location (e.g. San Francisco, CA)"
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <button
            type="submit"
            className="bg-[#0A66C2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004182] transition-colors"
          >
            Search
          </button>
          {(params.specialty || params.location) && (
            <a href="/employers/candidates" className="text-sm text-gray-400 hover:text-gray-600 self-center">
              Clear filters
            </a>
          )}
        </form>

        {params.unlocked && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
            ✓ Candidate unlocked! You can now view their full contact information below.
          </div>
        )}

        <div className="mb-4 text-sm text-gray-500">
          {candidates.length} verified candidate{candidates.length !== 1 ? "s" : ""} found
        </div>

        {candidates.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-700 font-semibold mb-1">No candidates yet</p>
            <p className="text-gray-400 text-sm">Try different filters or check back soon as more candidates complete screening.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {candidates.map((candidate) => {
              const isUnlocked = unlockedIds.has(candidate.id);
              const score = candidate.screening?.score;
              const hasVerifiedWork = candidate.workHistory.length > 0;
              const initials = (candidate.user.name || candidate.user.email)
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div key={candidate.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-6">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] font-bold text-lg flex-shrink-0">
                    {isUnlocked ? initials : "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-gray-900">
                        {isUnlocked ? (candidate.user.name || "Healthcare Professional") : "Verified Candidate"}
                      </p>
                      {hasVerifiedWork && (
                        <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">
                          ✓ Verified History
                        </span>
                      )}
                      {score !== null && score !== undefined && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          score >= 75 ? "bg-green-50 text-green-700 border-green-200" :
                          score >= 50 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          "bg-gray-50 text-gray-600 border-gray-200"
                        }`}>
                          Score: {score}/100 · {getScreeningBand(score).label}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm truncate">
                      {candidate.headline || candidate.specialty || "Healthcare Professional"}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">{candidate.location || "Location not specified"}</p>
                    {isUnlocked && (
                      <p className="text-blue-600 text-sm font-medium mt-1">{candidate.user.email}</p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <Link
                      href={`/candidate/${candidate.id}`}
                      className="border border-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      View
                    </Link>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-sm font-semibold px-4 py-2 rounded-xl">
                        ✓ Unlocked
                      </span>
                    ) : (
                      <UnlockButton candidateId={candidate.id} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

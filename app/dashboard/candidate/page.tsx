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
          applications: {
            include: { job: { include: { employer: true } } },
            orderBy: { createdAt: "desc" },
          },
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
  const isFullyVerified = totalCount > 0 && verifiedCount === totalCount;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, {user.name || user.email}</p>
          </div>
          <Link href="/jobs" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Browse Jobs →
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Verification Status</p>
            {isFullyVerified ? (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="font-semibold text-green-700">Fully Verified</span>
              </div>
            ) : totalCount === 0 ? (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="font-semibold text-slate-500">No entries yet</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="font-semibold text-yellow-700">{verifiedCount}/{totalCount} verified</span>
              </div>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Applications</p>
            <p className="text-2xl font-bold text-slate-900">{candidate.applications.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Profile</p>
            <p className="text-sm font-medium text-slate-700 truncate">{candidate.headline || "—"}</p>
            <p className="text-xs text-slate-400">{candidate.location || "No location set"}</p>
          </div>
        </div>

        {/* Verification tip */}
        {totalCount === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4 items-start">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-blue-900 text-sm">Add your work history to get verified</p>
              <p className="text-blue-700 text-sm mt-1">
                Licensed providers (RNs, MDs, PTs, etc.) can verify instantly with their NPI number.
                All others get a one-click email sent to their previous manager.
                Verified candidates stand out to employers.
              </p>
            </div>
          </div>
        )}

        {/* Work History */}
        <WorkHistorySection workHistory={candidate.workHistory} />

        {/* Applications */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Applications</h2>
          {candidate.applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm mb-3">No applications yet.</p>
              <Link href="/jobs" className="text-blue-600 text-sm hover:underline">Browse open roles →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {candidate.applications.map((app) => (
                <div key={app.id} className="flex justify-between items-center border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{app.job.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {app.job.employer.companyName} · {app.job.location} · Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    app.status === "APPLIED"    ? "bg-blue-50 text-blue-600 border border-blue-200" :
                    app.status === "REVIEWING"  ? "bg-purple-50 text-purple-600 border border-purple-200" :
                    app.status === "INTERVIEW"  ? "bg-green-50 text-green-600 border border-green-200" :
                    app.status === "OFFER"      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    "bg-red-50 text-red-500 border border-red-200"
                  }`}>
                    {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

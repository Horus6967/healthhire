export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PostJobForm from "./PostJobForm";

export default async function EmployerDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      employer: {
        include: {
          jobs: {
            include: {
              applications: {
                include: {
                  candidate: {
                    include: {
                      user: true,
                      workHistory: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!user) redirect("/onboarding/employer");
  if (!user.employer) redirect("/onboarding/employer");

  const employer = user.employer;
  const totalApplicants = employer.jobs.reduce((sum, j) => sum + j.applications.length, 0);
  const activeJobs = employer.jobs.filter((j) => j.active).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Employer Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">{employer.companyName}</p>
          </div>
          <Link href="/jobs" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
            View job board →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Jobs</p>
            <p className="text-3xl font-bold text-slate-900">{activeJobs}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Applicants</p>
            <p className="text-3xl font-bold text-slate-900">{totalApplicants}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Postings</p>
            <p className="text-3xl font-bold text-slate-900">{employer.jobs.length}</p>
          </div>
        </div>

        {/* Post job */}
        <PostJobForm employerId={employer.id} />

        {/* Job listings */}
        <div className="space-y-4">
          {employer.jobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-slate-500 font-medium mb-1">No jobs posted yet</p>
              <p className="text-slate-400 text-sm">Use the form above to post your first listing.</p>
            </div>
          ) : (
            employer.jobs.map((job) => (
              <div key={job.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {/* Job header */}
                <div className="flex justify-between items-start px-6 py-5 border-b border-slate-100">
                  <div className="min-w-0 flex-1 mr-4">
                    <div className="flex items-center gap-3 mb-1">
                      <Link href={`/jobs/${job.id}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                        {job.title}
                      </Link>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        job.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {job.active ? "Active" : "Closed"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{job.location} · {job.specialty}</p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-slate-400 mt-1">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Applicants */}
                <div className="px-6 py-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {job.applications.length} Applicant{job.applications.length !== 1 ? "s" : ""}
                  </p>
                  {job.applications.length === 0 ? (
                    <p className="text-slate-400 text-sm">No applicants yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {job.applications.map((app) => {
                        const verifiedCount = app.candidate.workHistory.filter(
                          (w) => w.verificationStatus === "VERIFIED" || w.npiVerified
                        ).length;
                        return (
                          <div key={app.id} className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                                {(app.candidate.user.name || app.candidate.user.email || "?")[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-800 text-sm">
                                    {app.candidate.user.name || app.candidate.user.email}
                                  </span>
                                  {verifiedCount > 0 && (
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-green-200">
                                      ✓ {verifiedCount} verified role{verifiedCount > 1 ? "s" : ""}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Applied {new Date(app.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                              app.status === "APPLIED"    ? "bg-blue-50 text-blue-600 border-blue-200" :
                              app.status === "REVIEWING"  ? "bg-purple-50 text-purple-600 border-purple-200" :
                              app.status === "INTERVIEW"  ? "bg-green-50 text-green-600 border-green-200" :
                              app.status === "OFFER"      ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              "bg-red-50 text-red-500 border-red-200"
                            }`}>
                              {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

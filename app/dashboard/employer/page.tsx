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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Employer Dashboard</h1>
          <p className="text-slate-500 mt-1">{employer.companyName}</p>
        </div>

        {/* Post job */}
        <PostJobForm employerId={employer.id} />

        {/* Job listings */}
        <div className="mt-8 space-y-6">
          {employer.jobs.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
              No jobs posted yet. Use the form above to post your first listing.
            </div>
          )}

          {employer.jobs.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link href={`/jobs/${job.id}`} className="font-semibold text-slate-900 hover:text-blue-600">
                    {job.title}
                  </Link>
                  <p className="text-slate-400 text-sm">{job.location} · {job.specialty}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${job.active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {job.active ? "Active" : "Closed"}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">{job.applications.length} applicant(s)</p>
                {job.applications.length > 0 && (
                  <div className="space-y-2">
                    {job.applications.map((app) => {
                      const verifiedCount = app.candidate.workHistory.filter(
                        (w) => w.verificationStatus === "VERIFIED"
                      ).length;
                      return (
                        <div key={app.id} className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-3 text-sm">
                          <div>
                            <span className="font-medium text-slate-800">{app.candidate.user.name || app.candidate.user.email}</span>
                            {verifiedCount > 0 && (
                              <span className="ml-2 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded border border-green-200">
                                ✓ {verifiedCount} verified role{verifiedCount > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-xs">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

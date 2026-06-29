export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ApplyButton from "./ApplyButton";

function formatJobType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();

  const job = await prisma.job.findUnique({
    where: { id },
    include: { employer: true },
  });

  if (!job || !job.active) notFound();

  let alreadyApplied = false;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { candidate: true },
    });
    if (user?.candidate) {
      const app = await prisma.application.findUnique({
        where: { jobId_candidateId: { jobId: id, candidateId: user.candidate.id } },
      });
      alreadyApplied = !!app;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/jobs" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors">
          ← Back to jobs
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Job header */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex justify-between items-start gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                  {job.employer.companyName[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.title}</h1>
                  <p className="text-slate-500">
                    {job.employer.companyName} · {job.location}
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {job.specialty}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {formatJobType(job.jobType)}
                    </span>
                    {job.salary && (
                      <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {job.salary}
                      </span>
                    )}
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      Verified listing
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <ApplyButton jobId={job.id} isSignedIn={!!userId} alreadyApplied={alreadyApplied} />
              </div>
            </div>
          </div>

          {/* Job body */}
          <div className="divide-y divide-slate-100">
            <div className="p-8">
              <h2 className="font-bold text-slate-900 mb-4 text-lg">About this role</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {job.requirements && (
              <div className="p-8">
                <h2 className="font-bold text-slate-900 mb-4 text-lg">Requirements</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
              </div>
            )}

            <div className="p-8">
              <h2 className="font-bold text-slate-900 mb-4 text-lg">About {job.employer.companyName}</h2>
              {job.employer.description && (
                <p className="text-slate-500 text-sm leading-relaxed mb-3">{job.employer.description}</p>
              )}
              {job.employer.website && (
                <a href={job.employer.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {job.employer.website} ↗
                </a>
              )}
            </div>

            <div className="p-8 bg-slate-50">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">Ready to apply?</p>
                  <p className="text-slate-500 text-xs">Your verified profile will be shared with the employer.</p>
                </div>
                <ApplyButton jobId={job.id} isSignedIn={!!userId} alreadyApplied={alreadyApplied} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

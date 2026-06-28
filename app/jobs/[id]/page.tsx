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
        <Link href="/jobs" className="text-blue-600 text-sm hover:underline mb-6 inline-block">
          ← Back to jobs
        </Link>

        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
              <p className="text-slate-500 mt-1">
                {job.employer.companyName} · {job.location}
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                  {job.specialty}
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded">
                  {formatJobType(job.jobType)}
                </span>
                {job.salary && (
                  <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded">
                    {job.salary}
                  </span>
                )}
              </div>
            </div>
            <ApplyButton jobId={job.id} isSignedIn={!!userId} alreadyApplied={alreadyApplied} />
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="font-semibold text-slate-900 mb-3">About this role</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && (
            <div className="border-t border-slate-100 pt-6 mt-6">
              <h2 className="font-semibold text-slate-900 mb-3">Requirements</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-6 mt-6">
            <h2 className="font-semibold text-slate-900 mb-3">About the employer</h2>
            <p className="font-medium text-slate-800">{job.employer.companyName}</p>
            {job.employer.description && (
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">{job.employer.description}</p>
            )}
            {job.employer.website && (
              <p className="text-sm text-blue-600 mt-1">{job.employer.website}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

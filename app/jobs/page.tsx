export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const SPECIALTIES = [
  "All",
  "Registered Nurse",
  "Physician",
  "Physical Therapist",
  "Medical Assistant",
  "Pharmacist",
  "Radiologist",
  "Surgeon",
  "Dentist",
];

const JOB_TYPES = ["All", "FULL_TIME", "PART_TIME", "CONTRACT", "PER_DIEM"];

function formatJobType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ specialty?: string; type?: string; q?: string }>;
}) {
  const params = await searchParams;
  const { specialty, type, q } = params;

  const jobs = await prisma.job.findMany({
    where: {
      active: true,
      ...(specialty && specialty !== "All" ? { specialty } : {}),
      ...(type && type !== "All" ? { jobType: type as never } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { location: { contains: q, mode: "insensitive" } },
              { specialty: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { employer: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Verified Healthcare Jobs</h1>
          <p className="text-slate-500">Every listing is a real, active opening — no exceptions.</p>
        </div>

        {/* Filters */}
        <form method="get" className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 flex flex-wrap gap-3 items-center">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title, location, specialty..."
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            name="specialty"
            defaultValue={specialty || "All"}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {SPECIALTIES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            name="type"
            defaultValue={type || "All"}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Types" : formatJobType(t)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Search
          </button>
          {(q || (specialty && specialty !== "All") || (type && type !== "All")) && (
            <Link href="/jobs" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              Clear filters ×
            </Link>
          )}
        </form>

        {/* Results count */}
        {jobs.length > 0 && (
          <p className="text-sm text-slate-500 mb-4">{jobs.length} job{jobs.length !== 1 ? "s" : ""} found</p>
        )}

        {/* Job list */}
        <div className="space-y-3">
          {jobs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-slate-500 font-medium">No jobs found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
              <Link href="/jobs" className="inline-block mt-4 text-blue-600 text-sm hover:underline">Clear all filters</Link>
            </div>
          )}
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                      {job.employer.companyName[0]}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-snug">{job.title}</h2>
                      <p className="text-slate-500 text-sm mt-0.5">
                        {job.employer.companyName} · {job.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap ml-13">
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
                <div className="flex-shrink-0 text-xs text-slate-400 mt-1 whitespace-nowrap">
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

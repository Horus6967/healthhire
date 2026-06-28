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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Verified Healthcare Jobs</h1>
        <p className="text-slate-500 mb-8">Every listing is a real, active opening.</p>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 flex flex-wrap gap-3 items-center">
          <form className="flex flex-wrap gap-3 w-full" method="get">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search jobs, locations..."
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="specialty"
              defaultValue={specialty || "All"}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SPECIALTIES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              name="type"
              defaultValue={type || "All"}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : formatJobType(t)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Job list */}
        <div className="space-y-4">
          {jobs.length === 0 && (
            <div className="text-center py-20 text-slate-400">No jobs found. Try adjusting your filters.</div>
          )}
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
                  <p className="text-slate-500 text-sm mt-1">
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
                <div className="flex-shrink-0 text-xs text-slate-400">
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

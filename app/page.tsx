import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Every job is real. Every candidate is verified.
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Healthcare jobs you can<br />actually trust
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            No ghost jobs. No resume fraud. Employers verify openings before posting.
            Candidates verify their work history through their actual managers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/jobs"
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Browse Verified Jobs
            </Link>
            <Link
              href="/onboarding/employer"
              className="bg-blue-500/40 text-white border border-white/30 px-8 py-3 rounded-lg font-semibold hover:bg-blue-500/60 transition"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">How HealthHire works</h2>
          <p className="text-slate-500 text-center mb-12">Trust built into every step</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏥",
                title: "Employers post real openings",
                desc: "Job listings are gated — employers must confirm they have an active opening before it goes live. No ghost jobs.",
              },
              {
                icon: "✅",
                title: "Candidates verify work history",
                desc: "Add your work history and we send your previous manager a one-click email to confirm you actually worked there.",
              },
              {
                icon: "🤝",
                title: "Verified matches",
                desc: "Employers see verification badges on candidate profiles. Hire with confidence.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-8 rounded-xl border border-slate-200 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Browse by specialty</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Registered Nurse",
              "Physician",
              "Physical Therapist",
              "Medical Assistant",
              "Pharmacist",
              "Radiologist",
              "Surgeon",
              "Dentist",
            ].map((specialty) => (
              <Link
                key={specialty}
                href={`/jobs?specialty=${encodeURIComponent(specialty)}`}
                className="border border-slate-200 rounded-lg p-4 text-center text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-600 transition"
              >
                {specialty}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to hire or get hired?</h2>
          <p className="text-blue-100 mb-8">Join the platform where trust is built in.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/onboarding/candidate" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              I&apos;m a candidate
            </Link>
            <Link href="/onboarding/employer" className="border border-white/40 px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 transition">
              I&apos;m an employer
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © 2025 HealthHire. All rights reserved.
      </footer>
    </div>
  );
}

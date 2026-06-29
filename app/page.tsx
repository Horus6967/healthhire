import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8 text-blue-200">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Every job is real. Every candidate is verified.
          </div>
          <h1 className="text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
            Healthcare hiring<br />
            <span className="text-blue-400">built on trust.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            No ghost jobs. No resume fraud. Employers post real openings.
            Candidates verify work history through managers or the NPI registry.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/jobs"
              className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25"
            >
              Browse Verified Jobs
            </Link>
            <Link
              href="/onboarding/employer"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold transition-all"
            >
              Post a Job →
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: "100%", label: "Verified listings" },
              { value: "NPI", label: "Registry verified" },
              { value: "Free", label: "For candidates" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How HealthHire works</h2>
            <p className="text-slate-500 text-lg">Trust built into every step of the hiring process</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "🏥",
                title: "Employers post real openings",
                desc: "Job listings are gated — employers confirm every posting is a real, active opening. Ghost jobs are banned.",
              },
              {
                step: "02",
                icon: "✅",
                title: "Candidates verify instantly",
                desc: "Licensed providers verify through the federal NPI registry in seconds. Others get a one-click manager email.",
              },
              {
                step: "03",
                icon: "🤝",
                title: "Hire with confidence",
                desc: "Employers see verification badges on every profile. Know exactly who you're interviewing before you meet them.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-bold text-slate-400 tracking-widest">{item.step}</span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Browse by specialty</h2>
            <p className="text-slate-500">Find openings in your field</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Registered Nurse", icon: "🩺" },
              { label: "Physician", icon: "👨‍⚕️" },
              { label: "Physical Therapist", icon: "🦴" },
              { label: "Medical Assistant", icon: "💊" },
              { label: "Pharmacist", icon: "⚗️" },
              { label: "Radiologist", icon: "🔬" },
              { label: "Surgeon", icon: "🏥" },
              { label: "Dentist", icon: "🦷" },
            ].map(({ label, icon }) => (
              <Link
                key={label}
                href={`/jobs?specialty=${encodeURIComponent(label)}`}
                className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                The only platform where verification isn&apos;t optional
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Healthcare credential fraud costs billions annually. HealthHire is the first platform
                where every candidate&apos;s history is verified before employers ever see it.
              </p>
              <div className="space-y-4">
                {[
                  "NPI registry verification in seconds",
                  "Manager email confirmation for all roles",
                  "Verified badge on every profile",
                  "No fake jobs, ever",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {point}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🛡️", title: "Fraud Prevention", desc: "Every credential checked against official registries" },
                { icon: "⚡", title: "Instant Verification", desc: "NPI check completes in under 2 seconds" },
                { icon: "📧", title: "Manager Confirmed", desc: "One-click email, no account required" },
                { icon: "🎯", title: "Better Matches", desc: "Employers see only qualified, verified talent" },
              ].map((card) => (
                <div key={card.title} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                  <div className="text-2xl mb-3">{card.icon}</div>
                  <div className="font-semibold text-sm text-white mb-1">{card.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-10 text-lg">Join the platform where trust is the standard, not the exception.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/onboarding/candidate"
              className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg"
            >
              I&apos;m a Candidate
            </Link>
            <Link
              href="/onboarding/employer"
              className="bg-blue-500 hover:bg-blue-400 border border-blue-400 text-white px-8 py-3.5 rounded-xl font-semibold transition"
            >
              I&apos;m an Employer
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-xl">✦</span>
            <span className="font-bold text-slate-900">HealthHire</span>
          </div>
          <p className="text-sm text-slate-400">© 2025 HealthHire. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/jobs" className="hover:text-slate-600 transition">Browse Jobs</Link>
            <Link href="/onboarding/employer" className="hover:text-slate-600 transition">For Employers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Every listing verified — no ghost jobs
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-5">
              Healthcare hiring<br />you can trust.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              Connect with verified healthcare employers and candidates.
              Every job is real. Every work history is confirmed.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/jobs"
                className="bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
              >
                Find jobs
              </Link>
              <Link
                href="/onboarding/employer"
                className="border border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50 px-6 py-3 rounded-full font-semibold text-sm transition-colors"
              >
                Post a job
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-3">
              {[
                { title: "ICU Registered Nurse", company: "Memorial Hospital", location: "San Francisco, CA", verified: true },
                { title: "Physical Therapist", company: "Bay Area Health", location: "Oakland, CA", verified: true },
                { title: "Emergency Physician", company: "UCSF Medical Center", location: "San Francisco, CA", verified: true },
              ].map((job) => (
                <div key={job.title} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] font-bold text-sm flex-shrink-0">
                    {job.company[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{job.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{job.company} · {job.location}</p>
                  </div>
                  {job.verified && (
                    <span className="flex-shrink-0 bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">
                      ✓ Verified
                    </span>
                  )}
                </div>
              ))}
              <p className="text-center text-xs text-gray-400 pt-1">Example listings — sign up to see real openings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: "100%", label: "Verified job listings" },
              { value: "NPI", label: "Registry integration" },
              { value: "Free", label: "For candidates" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How HealthHire works</h2>
            <p className="text-gray-500">A better hiring process, built on verification</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏥",
                title: "Employers post real openings",
                desc: "Every job listing is confirmed as a real, active opening before going live. Ghost jobs are prohibited.",
              },
              {
                icon: "✅",
                title: "Candidates verify their history",
                desc: "Licensed providers verify in seconds via the NPI registry. Others get a one-click manager confirmation email.",
              },
              {
                icon: "🤝",
                title: "Better hiring decisions",
                desc: "Employers see verified badges on every profile. Know who you're interviewing before the first call.",
              },
            ].map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by specialty */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by specialty</h2>
            <p className="text-gray-500">Find openings that match your background</p>
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
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium text-gray-700 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all"
              >
                <span className="text-xl">{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-snug">
                The only platform where verification isn&apos;t optional
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Healthcare credential fraud costs the industry billions each year.
                HealthHire is built from the ground up to eliminate it — with
                real-time NPI registry checks and manager email confirmation on every profile.
              </p>
              <div className="space-y-3">
                {[
                  "NPI registry verification in under 2 seconds",
                  "Manager email confirmation — no account required",
                  "Verified badge visible to all employers",
                  "Zero ghost jobs, guaranteed",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3 text-gray-700 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {point}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🛡️", title: "Fraud Prevention", desc: "Credentials checked against federal registries" },
                { icon: "⚡", title: "Instant Verification", desc: "NPI check completes in seconds" },
                { icon: "📧", title: "Manager Confirmed", desc: "One-click email, no login needed" },
                { icon: "🎯", title: "Better Matches", desc: "Only verified, qualified talent" },
              ].map((card) => (
                <div key={card.title} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <div className="text-2xl mb-3">{card.icon}</div>
                  <div className="font-semibold text-sm text-gray-900 mb-1">{card.title}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0A66C2]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-blue-200 mb-8">Join the platform where every hire starts with verified information.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/sign-up"
              className="bg-white text-[#0A66C2] px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors text-sm"
            >
              I&apos;m a Candidate
            </Link>
            <Link
              href="/onboarding/employer"
              className="border border-white/50 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors text-sm"
            >
              I&apos;m an Employer
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <span className="font-bold text-gray-900">HealthHire</span>
          </div>
          <p className="text-sm text-gray-400">© 2025 HealthHire. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/jobs" className="hover:text-gray-600 transition-colors">Browse Jobs</Link>
            <Link href="/onboarding/employer" className="hover:text-gray-600 transition-colors">For Employers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

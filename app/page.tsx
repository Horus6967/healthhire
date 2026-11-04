import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              AI-screened · NPI-verified · No ghost candidates
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-5">
              Hire verified<br />healthcare talent.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              Every candidate on HealthHire completes an AI screening and work history verification before you ever see their profile.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/employers/candidates"
                className="bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
              >
                Browse Candidates
              </Link>
              <Link
                href="/sign-up"
                className="border border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50 px-6 py-3 rounded-full font-semibold text-sm transition-colors"
              >
                Get Verified as a Candidate
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-3">
              {[
                { name: "Sarah M.", role: "ICU Registered Nurse", location: "San Francisco, CA", score: 94, verified: true },
                { name: "James K.", role: "Physician Assistant", location: "Oakland, CA", score: 88, verified: true },
                { name: "Priya R.", role: "Physical Therapist", location: "San Jose, CA", score: 91, verified: true },
              ].map((c) => (
                <div key={c.name} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] font-bold text-sm flex-shrink-0">
                    {c.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{c.role} · {c.location}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {c.verified && (
                      <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">✓ Verified</span>
                    )}
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                      {c.score}/100
                    </span>
                  </div>
                </div>
              ))}
              <p className="text-center text-xs text-gray-400 pt-1">Example profiles — sign up to see real candidates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: "AI", label: "Screening on every candidate" },
              { value: "NPI", label: "Registry verification" },
              { value: "$49", label: "Per candidate unlock" },
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">Two sides, one verified marketplace</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Candidates */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="text-3xl mb-4">👩‍⚕️</div>
              <h3 className="font-bold text-gray-900 text-lg mb-4">For Candidates — Free</h3>
              <div className="space-y-3">
                {[
                  { step: "1", text: "Create your profile (2 min)" },
                  { step: "2", text: "Verify work history via NPI registry or manager email" },
                  { step: "3", text: "Complete 5-question AI screening (3 min)" },
                  { step: "4", text: "Get discovered by top healthcare employers" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0A66C2] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/sign-up"
                className="mt-6 inline-block bg-[#0A66C2] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#004182] transition-colors"
              >
                Get Verified →
              </Link>
            </div>

            {/* Employers */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="text-3xl mb-4">🏥</div>
              <h3 className="font-bold text-gray-900 text-lg mb-4">For Employers — Pay per hire</h3>
              <div className="space-y-3">
                {[
                  { step: "1", text: "Create your company profile (2 min)" },
                  { step: "2", text: "Browse pre-screened, verified healthcare candidates" },
                  { step: "3", text: "Filter by specialty, location, and AI score" },
                  { step: "4", text: "Unlock contact info for $49 per candidate" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/onboarding/employer"
                className="mt-6 inline-block border border-gray-900 text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Post a Role →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">All healthcare specialties</h2>
            <p className="text-gray-500">Verified candidates across the full spectrum of care</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Registered Nurse", icon: "🩺" },
              { label: "Physician", icon: "👨‍⚕️" },
              { label: "Physical Therapist", icon: "🦴" },
              { label: "Medical Assistant", icon: "💊" },
              { label: "Pharmacist", icon: "⚗️" },
              { label: "Radiologist", icon: "🔬" },
              { label: "Nurse Practitioner", icon: "🏥" },
              { label: "Dentist", icon: "🦷" },
            ].map(({ label, icon }) => (
              <Link
                key={label}
                href={`/employers/candidates?specialty=${encodeURIComponent(label)}`}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium text-gray-700 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all"
              >
                <span className="text-xl">{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0A66C2]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to hire smarter?</h2>
          <p className="text-blue-200 mb-8">Every candidate is pre-screened and verified. No more sifting through unqualified applicants.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/employers/candidates"
              className="bg-white text-[#0A66C2] px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors text-sm"
            >
              Browse Candidates
            </Link>
            <Link
              href="/sign-up"
              className="border border-white/50 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors text-sm"
            >
              I&apos;m a Candidate
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
            <Link href="/employers/candidates" className="hover:text-gray-600 transition-colors">Find Candidates</Link>
            <Link href="/onboarding/employer" className="hover:text-gray-600 transition-colors">For Employers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

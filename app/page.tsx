import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#3ECF8E]/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-white/70 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-[#3ECF8E] rounded-full" />
            AI-screened · NPI-verified · No ghost candidates
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-4">
            Hire verified healthcare
            <br />
            <span className="text-[#3ECF8E]">talent in days.</span>
          </h1>

          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mt-6 mb-10 leading-relaxed">
            Every candidate completes an AI clinical screening and work history verification
            before you ever see their profile. No unqualified applicants. No wasted calls.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/employers/candidates"
              className="bg-[#3ECF8E] hover:bg-[#2db87a] text-black px-6 py-3 rounded-md font-semibold text-sm transition-colors"
            >
              Browse verified candidates
            </Link>
            <Link
              href="/sign-up"
              className="border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-md font-semibold text-sm transition-colors"
            >
              Get verified as a candidate →
            </Link>
          </div>

          {/* Candidate cards preview */}
          <div className="mt-16 max-w-2xl mx-auto space-y-2">
            {[
              { name: "Sarah M.", role: "ICU Registered Nurse", location: "San Francisco, CA", score: 94 },
              { name: "James K.", role: "Physician Assistant", location: "Oakland, CA", score: 88 },
              { name: "Priya R.", role: "Physical Therapist", location: "San Jose, CA", score: 91 },
            ].map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-3.5 text-left hover:bg-white/[0.07] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#3ECF8E]/15 flex items-center justify-center text-[#3ECF8E] font-bold text-sm flex-shrink-0">
                  {c.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{c.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{c.role} · {c.location}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[#3ECF8E] text-xs font-semibold border border-[#3ECF8E]/30 bg-[#3ECF8E]/10 px-2 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                  <span className="text-white/50 text-xs font-medium border border-white/10 bg-white/5 px-2 py-0.5 rounded-full">
                    {c.score}/100
                  </span>
                </div>
              </div>
            ))}
            <p className="text-white/25 text-xs pt-1">Example profiles — sign up to see real candidates</p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-white/[0.08] bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-3 divide-x divide-white/[0.08]">
          {[
            { value: "AI", label: "Screening on every candidate" },
            { value: "NPI", label: "Registry verification" },
            { value: "$49", label: "Per candidate unlock" },
          ].map((s) => (
            <div key={s.label} className="text-center px-6">
              <div className="text-2xl font-bold text-[#3ECF8E]">{s.value}</div>
              <div className="text-xs text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-[#3ECF8E] text-sm font-semibold mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Two sides, one verified marketplace.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Candidates */}
            <div className="border border-white/[0.08] bg-white/[0.03] rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-3xl mb-5">👩‍⚕️</div>
              <h3 className="font-bold text-white text-xl mb-2">For Candidates</h3>
              <p className="text-white/40 text-sm mb-6">Always free. Get discovered by top employers.</p>
              <div className="space-y-4">
                {[
                  "Create your profile in 2 minutes",
                  "Verify work history via NPI registry",
                  "Complete 5-question AI screening",
                  "Get discovered by top healthcare employers",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#3ECF8E]/15 border border-[#3ECF8E]/30 text-[#3ECF8E] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/sign-up"
                className="mt-8 inline-block bg-[#3ECF8E] hover:bg-[#2db87a] text-black px-5 py-2.5 rounded-md font-semibold text-sm transition-colors"
              >
                Get verified →
              </Link>
            </div>

            {/* Employers */}
            <div className="border border-white/[0.08] bg-white/[0.03] rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-3xl mb-5">🏥</div>
              <h3 className="font-bold text-white text-xl mb-2">For Employers</h3>
              <p className="text-white/40 text-sm mb-6">Pay $49 per candidate you want to contact.</p>
              <div className="space-y-4">
                {[
                  "Create your company profile in 2 minutes",
                  "Browse pre-screened, verified candidates",
                  "Filter by specialty, location, and AI score",
                  "Unlock contact info for $49 per candidate",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/[0.08] border border-white/15 text-white/50 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/onboarding/employer"
                className="mt-8 inline-block border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors"
              >
                Browse candidates →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties grid */}
      <section className="py-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-[#3ECF8E] text-sm font-semibold mb-3">Specialties</p>
            <h2 className="text-3xl font-bold text-white">All healthcare roles, verified.</h2>
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
                className="flex items-center gap-3 border border-white/[0.08] bg-white/[0.03] hover:border-[#3ECF8E]/40 hover:bg-[#3ECF8E]/5 rounded-xl p-4 text-sm font-medium text-white/60 hover:text-white transition-all"
              >
                <span className="text-lg">{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/[0.08]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to hire smarter?
          </h2>
          <p className="text-white/40 text-lg mb-10">
            Every candidate is pre-screened and verified. No more sifting through unqualified applicants.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/employers/candidates"
              className="bg-[#3ECF8E] hover:bg-[#2db87a] text-black px-8 py-3 rounded-md font-semibold text-sm transition-colors"
            >
              Browse candidates
            </Link>
            <Link
              href="/sign-up"
              className="border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-md font-semibold text-sm transition-colors"
            >
              I&apos;m a candidate
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size={24} />
            <span className="font-bold text-white text-sm">HealthHire</span>
          </div>
          <p className="text-sm text-white/25">© 2025 HealthHire. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/employers/candidates" className="hover:text-white/70 transition-colors">Find Candidates</Link>
            <Link href="/onboarding/employer" className="hover:text-white/70 transition-colors">For Employers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

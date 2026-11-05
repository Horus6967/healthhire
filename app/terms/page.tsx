import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: November 4, 2026</p>

        <div className="space-y-8 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Using HealthHire</h2>
            <p>HealthHire is a marketplace connecting healthcare employers with pre-screened candidates. By creating an account you agree to use the platform only for legitimate employment purposes.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Candidates</h2>
            <p>By completing your profile and AI screening, you consent to your professional information (specialty, score, work history) being visible to employers on the platform. Your contact information is only shared with employers who pay to unlock your profile.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Employers</h2>
            <p>Unlocking a candidate&apos;s contact information costs $49 per candidate. This is a one-time payment that gives you access to that candidate&apos;s email. You agree to only contact candidates for genuine employment opportunities.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Payments</h2>
            <p>Payments are processed by Stripe. All sales are final — refunds are issued at our discretion if a candidate&apos;s information cannot be delivered.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that misuse the platform, harass candidates, or violate these terms.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Contact</h2>
            <p>Questions? Email <a href="mailto:saikuk321@gmail.com" className="text-[#3ECF8E] hover:underline">saikuk321@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

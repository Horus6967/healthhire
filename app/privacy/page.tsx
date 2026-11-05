import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16 prose prose-invert">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: November 4, 2026</p>

        <div className="space-y-8 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">What we collect</h2>
            <p>When you create an account, we collect your name and email address. Candidates additionally provide professional information (specialty, work history, location). We use Google OAuth for authentication — we do not store your Google password.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">How we use it</h2>
            <p>Candidate profiles (specialty, AI screening score, work history) are shown to employers browsing the marketplace. Contact information (email) is only revealed to employers who pay to unlock your profile. We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Data storage</h2>
            <p>Data is stored securely in Supabase (PostgreSQL). Authentication is handled by Clerk. Payment processing is handled by Stripe. None of these providers sell your data.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Your rights</h2>
            <p>You can request deletion of your account and all associated data at any time by emailing <a href="mailto:saikuk321@gmail.com" className="text-[#3ECF8E] hover:underline">saikuk321@gmail.com</a>.</p>
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

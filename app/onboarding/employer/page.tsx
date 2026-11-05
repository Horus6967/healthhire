"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function EmployerOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ companyName: "", website: "", description: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/employers/candidates");
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#3ECF8E]/60 focus:ring-1 focus:ring-[#3ECF8E]/40 transition";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-white/60 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#3ECF8E] rounded-full" />
            Employer Setup
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Set up your company</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Takes 2 minutes. Browse pre-screened, NPI-verified healthcare candidates immediately after.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Company name <span className="text-red-400">*</span>
            </label>
            <input
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="e.g. Memorial Hospital"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Website <span className="text-white/25 font-normal normal-case">(optional)</span>
            </label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://yourhospital.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Company description <span className="text-white/25 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Tell candidates about your organization, mission, and culture..."
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4 text-sm text-white/40 flex gap-3 items-start">
            <span className="flex-shrink-0 text-white/30">⚠</span>
            <span>By continuing, you agree to only contact candidates for genuine employment opportunities.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3ECF8E] hover:bg-[#2db87a] disabled:opacity-50 text-black py-3 rounded-lg font-semibold transition-colors text-sm"
          >
            {loading ? "Saving..." : "Browse Candidates →"}
          </button>
        </form>
      </div>
    </div>
  );
}

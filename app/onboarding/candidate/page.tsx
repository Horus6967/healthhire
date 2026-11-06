"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const SPECIALTIES = [
  "Registered Nurse (RN)", "Licensed Practical Nurse (LPN)", "Physician / MD",
  "Physician Assistant (PA)", "Nurse Practitioner (NP)", "Physical Therapist (PT)",
  "Occupational Therapist (OT)", "Pharmacist", "Medical Assistant (MA)",
  "Radiologic Technologist", "Respiratory Therapist", "Emergency Medical Technician (EMT)",
  "Surgical Technologist", "Dentist", "Other Healthcare Professional",
];

export default function CandidateOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ headline: "", bio: "", location: "", specialty: "", phone: "", resumeUrl: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/screening");
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
            Step 1 of 2 — Your Profile
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Set up your profile</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Takes 2 minutes. Helps employers find you and see your verified background.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Specialty</label>
            <select
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className={inputClass + " [&>option]:bg-[#1a1a1a] [&>option]:text-white"}
            >
              <option value="">Select your specialty...</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Professional headline</label>
            <input
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="e.g. ICU Registered Nurse · 5 years experience"
              className={inputClass}
            />
            <p className="text-xs text-white/25 mt-1.5">Shown at the top of your profile</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. San Francisco, CA"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Phone number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="e.g. (555) 123-4567"
              className={inputClass}
            />
            <p className="text-xs text-white/25 mt-1.5">Shared with employers only after they unlock your profile</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Resume link <span className="text-white/25 font-normal normal-case">(optional)</span></label>
            <input
              type="url"
              value={form.resumeUrl}
              onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
              placeholder="e.g. a Google Drive or LinkedIn link to your resume"
              className={inputClass}
            />
            <p className="text-xs text-white/25 mt-1.5">Make sure the link is viewable by anyone with the link</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Bio <span className="text-white/25 font-normal normal-case">(optional)</span></label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              placeholder="Tell employers about your background and what you're looking for..."
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="bg-[#3ECF8E]/5 border border-[#3ECF8E]/20 rounded-lg p-4 text-sm text-[#3ECF8E]/80 flex gap-3 items-start">
            <span className="flex-shrink-0 text-[#3ECF8E]">→</span>
            <span>Next step: 5-question AI screening (3 min). Your score is shown to employers.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3ECF8E] hover:bg-[#2db87a] disabled:opacity-50 text-black py-3 rounded-lg font-semibold transition-colors text-sm"
          >
            {loading ? "Saving..." : "Continue to Screening →"}
          </button>
        </form>
      </div>
    </div>
  );
}

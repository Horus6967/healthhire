"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const steps = ["Profile", "Done"];

export default function CandidateOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    headline: "",
    bio: "",
    location: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/onboarding/candidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/dashboard/candidate");
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-16">

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i === 0 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"
              }`}>
                {i + 1}
              </div>
              <span className={`text-sm font-medium ${i === 0 ? "text-slate-900" : "text-slate-400"}`}>{step}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-slate-300 mx-1" />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Set up your candidate profile</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              This helps employers find you and see your verified background. You can always edit this later.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Professional headline
              </label>
              <input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Registered Nurse · 5 years ICU experience"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p className="text-xs text-slate-400 mt-1">This appears at the top of your profile</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Location
              </label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. San Francisco, CA"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                placeholder="Tell employers about your background, skills, and what you're looking for..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 flex gap-3">
              <span className="flex-shrink-0">💡</span>
              <span>After setup, you can add verified work history to stand out to employers.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm text-sm"
            >
              {loading ? "Saving..." : "Continue to Dashboard →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

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

type Question = {
  id: string;
  question: string;
  type: "text" | "multiple_choice";
  options?: string[];
};

export default function ScreeningPage() {
  const router = useRouter();
  const [step, setStep] = useState<"specialty" | "questions" | "done">("specialty");
  const [specialty, setSpecialty] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [currentQ, setCurrentQ] = useState(0);

  async function startScreening() {
    if (!specialty) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/screening/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialty }),
      });
      const data = await res.json() as { questions?: Question[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to generate questions");
      setQuestions(data.questions || []);
      setStep("questions");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/screening/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json() as { score?: number; summary?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setScore(data.score ?? null);
      setSummary(data.summary || "");
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;
  const allAnswered = questions.every((q) => answers[q.id]?.trim());

  const scoreColor = score !== null
    ? score >= 75 ? "text-[#3ECF8E]" : score >= 50 ? "text-yellow-400" : "text-red-400"
    : "";
  const scoreBg = score !== null
    ? score >= 75 ? "bg-[#3ECF8E]/10 border-[#3ECF8E]/30" : score >= 50 ? "bg-yellow-400/10 border-yellow-400/30" : "bg-red-400/10 border-red-400/30"
    : "";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Specialty selection */}
        {step === "specialty" && (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-white/60 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-[#3ECF8E] rounded-full" />
                Step 2 of 2 — AI Screening
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">AI Clinical Screening</h1>
              <p className="text-white/40 text-sm leading-relaxed max-w-lg">
                5 specialty-specific questions · ~3 minutes · Your score appears on your profile and helps employers find you faster.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "5 questions", sub: "Specialty-specific" },
                { label: "~3 min", sub: "Quick to complete" },
                { label: "AI scored", sub: "Out of 100" },
              ].map((s) => (
                <div key={s.label} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-center">
                  <div className="font-bold text-white text-sm">{s.label}</div>
                  <div className="text-white/35 text-xs mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                Your specialty
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3ECF8E]/60 focus:ring-1 focus:ring-[#3ECF8E]/40 transition mb-5 [&>option]:bg-[#1a1a1a] [&>option]:text-white"
              >
                <option value="">Select your specialty...</option>
                {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              {error && <p className="text-red-400 text-sm mb-4">⚠ {error}</p>}

              <button
                onClick={startScreening}
                disabled={!specialty || loading}
                className="w-full bg-[#3ECF8E] hover:bg-[#2db87a] disabled:opacity-40 text-black py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Generating questions...
                  </span>
                ) : "Start Screening →"}
              </button>
            </div>
          </div>
        )}

        {/* Questions */}
        {step === "questions" && questions.length > 0 && (
          <div className="space-y-5">
            {/* Progress bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3ECF8E] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-white/35 flex-shrink-0">
                {currentQ + 1} / {questions.length}
              </span>
            </div>

            {/* Question dots */}
            <div className="flex gap-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(i)}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    answers[q.id]?.trim()
                      ? "bg-[#3ECF8E]"
                      : i === currentQ
                      ? "bg-white/40"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            {/* Current question card */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-8">
              <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-4">
                Question {currentQ + 1}
              </p>
              <p className="text-lg font-semibold text-white leading-snug mb-7">
                {questions[currentQ].question}
              </p>

              {questions[currentQ].type === "multiple_choice" && questions[currentQ].options ? (
                <div className="space-y-2.5">
                  {questions[currentQ].options!.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [questions[currentQ].id]: opt })}
                      className={`w-full text-left px-4 py-3.5 rounded-lg border text-sm font-medium transition-all ${
                        answers[questions[currentQ].id] === opt
                          ? "border-[#3ECF8E]/60 bg-[#3ECF8E]/10 text-[#3ECF8E]"
                          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[questions[currentQ].id] || ""}
                  onChange={(e) => setAnswers({ ...answers, [questions[currentQ].id]: e.target.value })}
                  rows={5}
                  placeholder="Type your answer here..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#3ECF8E]/60 focus:ring-1 focus:ring-[#3ECF8E]/40 transition resize-none"
                />
              )}

              {error && <p className="text-red-400 text-sm mt-4">⚠ {error}</p>}

              <div className="flex gap-3 mt-6">
                {currentQ > 0 && (
                  <button
                    onClick={() => setCurrentQ(currentQ - 1)}
                    className="px-5 py-3 border border-white/10 text-white/60 rounded-lg text-sm font-medium hover:border-white/20 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                )}
                {currentQ < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQ(currentQ + 1)}
                    disabled={!answers[questions[currentQ].id]?.trim()}
                    className="flex-1 bg-white/10 hover:bg-white/15 disabled:opacity-30 text-white py-3 rounded-lg font-semibold text-sm transition-colors"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={submitAnswers}
                    disabled={!allAnswered || loading}
                    className="flex-1 bg-[#3ECF8E] hover:bg-[#2db87a] disabled:opacity-40 text-black py-3 rounded-lg font-semibold text-sm transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Scoring...
                      </span>
                    ) : "Submit Answers ✓"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Done */}
        {step === "done" && score !== null && (
          <div className="text-center">
            <div className={`w-28 h-28 rounded-full border-2 flex items-center justify-center mx-auto mb-6 ${scoreBg}`}>
              <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#3ECF8E]/10 text-[#3ECF8E] border border-[#3ECF8E]/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              ✓ Screening Complete
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">
              {score >= 75 ? "Excellent score!" : score >= 50 ? "Good score!" : "Screening recorded"}
            </h2>

            {summary && (
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md mx-auto">{summary}</p>
            )}

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 text-sm text-white/50 mb-8 max-w-md mx-auto text-left flex gap-3">
              <span className="text-[#3ECF8E] flex-shrink-0">✓</span>
              <span>Your verified score is now visible to employers on HealthHire. You&apos;re discoverable in the candidate marketplace.</span>
            </div>

            <button
              onClick={() => router.push("/dashboard/candidate")}
              className="bg-[#3ECF8E] hover:bg-[#2db87a] text-black px-8 py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

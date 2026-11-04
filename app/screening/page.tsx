"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const SPECIALTIES = [
  "Registered Nurse (RN)",
  "Licensed Practical Nurse (LPN)",
  "Physician / MD",
  "Physician Assistant (PA)",
  "Nurse Practitioner (NP)",
  "Physical Therapist (PT)",
  "Occupational Therapist (OT)",
  "Pharmacist",
  "Medical Assistant (MA)",
  "Radiologic Technologist",
  "Respiratory Therapist",
  "Emergency Medical Technician (EMT)",
  "Surgical Technologist",
  "Dentist",
  "Other Healthcare Professional",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Specialty selection */}
        {step === "specialty" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="mb-2 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
              Step 1 of 2 — About You
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">AI Screening</h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              A 5-question AI screening takes about 3 minutes. Employers see your score and a verified badge — it&apos;s the fastest way to stand out.
            </p>

            <label className="block text-sm font-semibold text-gray-700 mb-2">What&apos;s your specialty?</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            >
              <option value="">Select your specialty...</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {error && <p className="text-red-600 text-sm mb-4">⚠ {error}</p>}

            <button
              onClick={startScreening}
              disabled={!specialty || loading}
              className="w-full bg-[#0A66C2] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#004182] disabled:opacity-50 transition-colors"
            >
              {loading ? "Generating questions..." : "Start Screening →"}
            </button>
          </div>
        )}

        {/* Questions */}
        {step === "questions" && questions.length > 0 && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Question {currentQ + 1} of {questions.length}</span>
                <span className="text-xs text-gray-400">{Math.round(progress)}% complete</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0A66C2] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current question */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="mb-2 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                Step 2 of 2 — Screening
              </div>
              <p className="text-lg font-semibold text-gray-900 mt-4 mb-6 leading-snug">
                {questions[currentQ].question}
              </p>

              {questions[currentQ].type === "multiple_choice" && questions[currentQ].options ? (
                <div className="space-y-3">
                  {questions[currentQ].options!.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [questions[currentQ].id]: opt })}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        answers[questions[currentQ].id] === opt
                          ? "border-[#0A66C2] bg-blue-50 text-[#0A66C2]"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              )}

              {error && <p className="text-red-600 text-sm mt-4">⚠ {error}</p>}

              <div className="flex gap-3 mt-6">
                {currentQ > 0 && (
                  <button
                    onClick={() => setCurrentQ(currentQ - 1)}
                    className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                )}
                {currentQ < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQ(currentQ + 1)}
                    disabled={!answers[questions[currentQ].id]?.trim()}
                    className="flex-1 bg-[#0A66C2] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#004182] disabled:opacity-50 transition-colors"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={submitAnswers}
                    disabled={!allAnswered || loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Submitting..." : "Submit Answers ✓"}
                  </button>
                )}
              </div>
            </div>

            {/* All questions overview */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(i)}
                  className={`h-2 rounded-full transition-colors ${
                    answers[q.id]?.trim()
                      ? "bg-green-500"
                      : i === currentQ
                      ? "bg-[#0A66C2]"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Done */}
        {step === "done" && score !== null && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold ${
              score >= 75 ? "bg-green-100 text-green-700" :
              score >= 50 ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>
              {score}
            </div>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-green-200 mb-4">
              ✓ Screening Complete
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {score >= 75 ? "Excellent score!" : score >= 50 ? "Good score!" : "Screening recorded"}
            </h2>
            {summary && (
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">{summary}</p>
            )}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 mb-8">
              Your verified score is now visible to employers on HealthHire. Employers can request to connect with you.
            </div>
            <button
              onClick={() => router.push("/dashboard/candidate")}
              className="bg-[#0A66C2] text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#004182] transition-colors"
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyButton({
  jobId,
  isSignedIn,
  alreadyApplied,
}: {
  jobId: string;
  isSignedIn: boolean;
  alreadyApplied: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);
  const router = useRouter();

  async function handleApply() {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    if (res.ok) {
      setApplied(true);
    }
    setLoading(false);
  }

  if (applied) {
    return (
      <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-5 py-2.5 rounded-xl text-sm font-semibold">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        Applied
      </span>
    );
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="bg-[#0A66C2] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#004182] disabled:opacity-50 transition-colors shadow-sm text-sm"
    >
      {loading ? "Applying..." : "Apply Now"}
    </button>
  );
}

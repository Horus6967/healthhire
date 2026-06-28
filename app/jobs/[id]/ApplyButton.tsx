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
      <span className="bg-green-50 text-green-700 border border-green-200 px-5 py-2 rounded-lg text-sm font-medium">
        ✓ Applied
      </span>
    );
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
    >
      {loading ? "Applying..." : "Apply Now"}
    </button>
  );
}

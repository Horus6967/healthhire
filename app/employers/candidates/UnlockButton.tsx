"use client";

import { useState } from "react";

export default function UnlockButton({ candidateId }: { candidateId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUnlock() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId }),
      });
      const data = await res.json() as { url?: string; alreadyUnlocked?: boolean; error?: string };
      if (data.alreadyUnlocked) {
        window.location.reload();
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleUnlock}
        disabled={loading}
        className="bg-[#0A66C2] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#004182] disabled:opacity-50 transition-colors"
      >
        {loading ? "Loading..." : "Unlock — $49"}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

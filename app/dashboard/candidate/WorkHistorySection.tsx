"use client";

import { useState } from "react";

type WorkHistory = {
  id: string;
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  managerName: string;
  managerEmail: string;
  npiNumber: string | null;
  npiVerified: boolean;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
};

type NpiStatus = "idle" | "loading" | "verified" | "not_found";

export default function WorkHistorySection({ workHistory }: { workHistory: WorkHistory[] }) {
  const [entries, setEntries] = useState(workHistory);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [npiStatus, setNpiStatus] = useState<NpiStatus>("idle");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    managerName: "",
    managerEmail: "",
    npiNumber: "",
    npiVerified: false,
  });

  async function handleNpiVerify() {
    if (!form.npiNumber.trim()) return;
    setNpiStatus("loading");
    try {
      const res = await fetch("/api/npi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          npiNumber: form.npiNumber.trim(),
          // Parse first/last from managerName field if provider is individual
          // For now pass no name so the API accepts any valid NPI number found
        }),
      });
      if (res.ok) {
        const data = await res.json() as { verified: boolean };
        if (data.verified) {
          setNpiStatus("verified");
          setForm((prev) => ({ ...prev, npiVerified: true }));
        } else {
          setNpiStatus("not_found");
          setForm((prev) => ({ ...prev, npiVerified: false }));
        }
      } else {
        setNpiStatus("not_found");
        setForm((prev) => ({ ...prev, npiVerified: false }));
      }
    } catch {
      setNpiStatus("not_found");
      setForm((prev) => ({ ...prev, npiVerified: false }));
    }
  }

  function handleNpiChange(value: string) {
    setForm((prev) => ({ ...prev, npiNumber: value, npiVerified: false }));
    setNpiStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/work-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobTitle: form.jobTitle,
        company: form.company,
        startDate: form.startDate,
        endDate: form.endDate,
        current: form.current,
        managerName: form.managerName,
        managerEmail: form.managerEmail,
        npiNumber: form.npiNumber || undefined,
        npiVerified: form.npiVerified,
      }),
    });
    if (res.ok) {
      const data = await res.json() as WorkHistory & { emailError?: { message: string } };
      setEntries([data, ...entries]);
      setShowForm(false);
      setNpiStatus("idle");
      if (data.emailError) {
        setEmailError(`Email failed: ${data.emailError.message}`);
      } else if (!form.npiVerified) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      }
      setForm({
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        managerName: "",
        managerEmail: "",
        npiNumber: "",
        npiVerified: false,
      });
    }
    setLoading(false);
  }

  function statusBadge(entry: WorkHistory) {
    if (entry.npiVerified) {
      return (
        <span className="text-xs font-medium px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200">
          ✓ NPI Verified
        </span>
      );
    }
    if (entry.verificationStatus === "VERIFIED") {
      return (
        <span className="text-xs font-medium px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200">
          ✓ Verified
        </span>
      );
    }
    if (entry.verificationStatus === "REJECTED") {
      return (
        <span className="text-xs font-medium px-2 py-1 rounded bg-red-50 text-red-600">
          ✗ Not confirmed
        </span>
      );
    }
    return (
      <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">
        ⏳ Pending
      </span>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-slate-900">Work History</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Entry
        </button>
      </div>

      {emailSent && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
          <span>✓</span> Verification email sent to your manager! They just need to click the link — no account required.
        </div>
      )}
      {emailError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          ⚠ {emailError}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-slate-200 rounded-xl p-5 mb-5 bg-slate-50 space-y-4">
          <h3 className="font-medium text-slate-800 text-sm">New work history entry</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Job Title *</label>
              <input required value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Company *</label>
              <input required value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Start Date *</label>
              <input required type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
              <input type="date" value={form.endDate} disabled={form.current} onChange={e => setForm({...form, endDate: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
              <label className="flex items-center gap-2 mt-1 text-xs text-slate-500 cursor-pointer">
                <input type="checkbox" checked={form.current} onChange={e => setForm({...form, current: e.target.checked, endDate: ""})} />
                I currently work here
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Manager Name *</label>
              <input required value={form.managerName} onChange={e => setForm({...form, managerName: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Manager Email *</label>
              <input required type="email" value={form.managerEmail} onChange={e => setForm({...form, managerEmail: e.target.value})}
                placeholder="We'll email them to verify"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* NPI Number */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              NPI Number (optional — for licensed providers)
            </label>
            <div className="flex gap-2 items-center">
              <input
                value={form.npiNumber}
                onChange={e => handleNpiChange(e.target.value)}
                placeholder="10-digit NPI"
                maxLength={10}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleNpiVerify}
                disabled={!form.npiNumber.trim() || npiStatus === "loading"}
                className="bg-slate-700 text-white text-xs px-3 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-40 whitespace-nowrap"
              >
                {npiStatus === "loading" ? "Checking..." : "Verify with NPI"}
              </button>
            </div>
            {npiStatus === "verified" && (
              <p className="text-xs text-green-600 mt-1 font-medium">✓ NPI verified</p>
            )}
            {npiStatus === "not_found" && (
              <p className="text-xs text-slate-500 mt-1">Not found — manager email will be used for verification</p>
            )}
          </div>

          <p className="text-xs text-slate-400">
            {form.npiVerified
              ? "NPI verified — your entry will be marked as verified immediately."
              : "We’ll send your manager a one-click email to confirm your employment. They don’t need an account."}
          </p>
          <div className="flex gap-3 items-center">
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Saving..." : form.npiVerified ? "Save (NPI Verified)" : "Save & Send Verification"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setNpiStatus("idle"); setEmailError(null); }} className="text-sm text-slate-500 hover:text-slate-700">
              Cancel
            </button>
          </div>
        </form>
      )}

      {entries.length === 0 && !showForm && (
        <p className="text-slate-400 text-sm">No work history yet. Add your first entry to start getting verified.</p>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex justify-between items-center border border-slate-100 rounded-lg p-4">
            <div>
              <p className="font-medium text-slate-800 text-sm">{entry.jobTitle}</p>
              <p className="text-slate-400 text-xs">{entry.company}</p>
              <p className="text-slate-400 text-xs">Manager: {entry.managerName}</p>
              {entry.npiNumber && (
                <p className="text-slate-400 text-xs">NPI: {entry.npiNumber}</p>
              )}
            </div>
            {statusBadge(entry)}
          </div>
        ))}
      </div>
    </div>
  );
}

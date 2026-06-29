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
        body: JSON.stringify({ npiNumber: form.npiNumber.trim() }),
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
    }
  }

  function handleNpiChange(value: string) {
    setForm((prev) => ({ ...prev, npiNumber: value, npiVerified: false }));
    setNpiStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setEmailError(null);
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
        setTimeout(() => setEmailSent(false), 6000);
      }
      setForm({ jobTitle: "", company: "", startDate: "", endDate: "", current: false, managerName: "", managerEmail: "", npiNumber: "", npiVerified: false });
    }
    setLoading(false);
  }

  function statusBadge(entry: WorkHistory) {
    if (entry.npiVerified) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          NPI Verified
        </span>
      );
    }
    if (entry.verificationStatus === "VERIFIED") {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          Verified
        </span>
      );
    }
    if (entry.verificationStatus === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600 border border-red-200">
          ✗ Not confirmed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
        ⏳ Pending
      </span>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
        <div>
          <h2 className="font-semibold text-slate-900">Work History</h2>
          <p className="text-xs text-slate-400 mt-0.5">Verified entries build employer trust</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEmailError(null); }}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <span className="text-base leading-none">+</span>
          Add Entry
        </button>
      </div>

      {emailSent && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Verification email sent! Your manager just needs to click the link — no account required.
        </div>
      )}
      {emailError && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          ⚠ {emailError}
        </div>
      )}

      {showForm && (
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800 mb-5">New work history entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Job Title *</label>
                <input required value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})}
                  placeholder="e.g. ICU Registered Nurse"
                  className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Company / Hospital *</label>
                <input required value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                  placeholder="e.g. Memorial Hospital"
                  className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Start Date *</label>
                <input required type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
                  className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">End Date</label>
                <input type="date" value={form.endDate} disabled={form.current} onChange={e => setForm({...form, endDate: e.target.value})}
                  className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-40 disabled:bg-slate-100" />
                <label className="flex items-center gap-2 mt-2 text-xs text-slate-500 cursor-pointer select-none">
                  <input type="checkbox" checked={form.current} onChange={e => setForm({...form, current: e.target.checked, endDate: ""})}
                    className="rounded" />
                  I currently work here
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Manager Name *</label>
                <input required value={form.managerName} onChange={e => setForm({...form, managerName: e.target.value})}
                  placeholder="Full name"
                  className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Manager Email *</label>
                <input required type="email" value={form.managerEmail} onChange={e => setForm({...form, managerEmail: e.target.value})}
                  placeholder="manager@hospital.com"
                  className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            {/* NPI Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600">⚡</span>
                <label className="text-xs font-semibold text-blue-800">
                  Licensed provider? Verify instantly with your NPI number
                </label>
              </div>
              <p className="text-xs text-blue-600 mb-3">For RNs, MDs, PTs, and other licensed providers. Skips the manager email entirely.</p>
              <div className="flex gap-2">
                <input
                  value={form.npiNumber}
                  onChange={e => handleNpiChange(e.target.value)}
                  placeholder="10-digit NPI number"
                  maxLength={10}
                  className="flex-1 border border-blue-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleNpiVerify}
                  disabled={!form.npiNumber.trim() || npiStatus === "loading"}
                  className="bg-blue-600 text-white text-xs px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 whitespace-nowrap font-medium transition-colors"
                >
                  {npiStatus === "loading" ? "Checking..." : "Verify NPI"}
                </button>
              </div>
              {npiStatus === "verified" && (
                <p className="text-xs text-green-600 mt-2 font-semibold flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  NPI verified — your entry will be marked verified immediately
                </p>
              )}
              {npiStatus === "not_found" && (
                <p className="text-xs text-slate-500 mt-2">NPI not found — manager email will be used for verification instead</p>
              )}
            </div>

            <div className="flex gap-3 items-center pt-1">
              <button type="submit" disabled={loading}
                className="bg-blue-600 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-sm">
                {loading ? "Saving..." : form.npiVerified ? "Save (Verified)" : "Save & Send Verification Email"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setNpiStatus("idle"); setEmailError(null); }}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {entries.length === 0 && !showForm && (
          <div className="px-6 py-12 text-center">
            <div className="text-3xl mb-3">📋</div>
            <p className="text-slate-500 text-sm font-medium mb-1">No work history yet</p>
            <p className="text-slate-400 text-xs">Add your first entry to start getting verified by employers.</p>
          </div>
        )}

        {entries.map((entry) => (
          <div key={entry.id} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors">
            <div className="min-w-0 flex-1 mr-4">
              <p className="font-semibold text-slate-800 text-sm truncate">{entry.jobTitle}</p>
              <p className="text-slate-500 text-xs mt-0.5">{entry.company}</p>
              <p className="text-slate-400 text-xs mt-0.5">Manager: {entry.managerName}</p>
            </div>
            <div className="flex-shrink-0">
              {statusBadge(entry)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

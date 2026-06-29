"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SPECIALTIES = [
  "Registered Nurse",
  "Physician",
  "Physical Therapist",
  "Medical Assistant",
  "Pharmacist",
  "Radiologist",
  "Surgeon",
  "Dentist",
  "Other",
];

export default function PostJobForm({ employerId }: { employerId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    specialty: SPECIALTIES[0],
    location: "",
    jobType: "FULL_TIME",
    salary: "",
    description: "",
    requirements: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, employerId }),
    });
    if (res.ok) {
      setOpen(false);
      setForm({ title: "", specialty: SPECIALTIES[0], location: "", jobType: "FULL_TIME", salary: "", description: "", requirements: "" });
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center px-6 py-5">
        <div>
          <h2 className="font-semibold text-slate-900">Post a New Job</h2>
          <p className="text-slate-400 text-sm mt-0.5">Every listing is confirmed as a real, active opening.</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
            open
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {open ? "Cancel" : "+ New Job"}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="border-t border-slate-100 px-6 pb-6 pt-5 space-y-5 bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Job Title *</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                placeholder="e.g. ICU Registered Nurse"
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Specialty *</label>
              <select value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})}
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Location *</label>
              <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                placeholder="e.g. San Francisco, CA"
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Job Type *</label>
              <select value={form.jobType} onChange={e => setForm({...form, jobType: e.target.value})}
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="PER_DIEM">Per Diem</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Salary (optional)</label>
              <input value={form.salary} onChange={e => setForm({...form, salary: e.target.value})}
                placeholder="e.g. $85,000–$100,000/yr or $45–$65/hr"
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Job Description *</label>
            <textarea required rows={5} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Describe the role, responsibilities, team, and work environment..."
              className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Requirements (optional)</label>
            <textarea rows={3} value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})}
              placeholder="Licenses, certifications, years of experience required..."
              className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
          </div>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <span className="text-blue-500 text-lg flex-shrink-0">ℹ</span>
            <p className="text-sm text-blue-700 leading-relaxed">
              By posting this job, you confirm this is a real, active opening.
              Fraudulent listings will result in account suspension.
            </p>
          </div>
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
            {loading ? "Posting..." : "Post Job →"}
          </button>
        </form>
      )}
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";

type TrackResult = {
  tracking_number: string;
  title: string;
  category: string;
  current_status: string;
  created_at: string;
  closed_at: string | null;
  history: {
    status: string;
    note: string | null;
    changed_at: string;
  }[];
};

const statusText: Record<string, string> = {
  NEW: "รับคำร้องเข้าระบบแล้ว",
  RECEIVED: "เจ้าหน้าที่รับเรื่องแล้ว",
  UNDER_REVIEW: "อยู่ระหว่างตรวจสอบ",
  IN_PROGRESS: "อยู่ระหว่างดำเนินการ",
  COMPLETED: "ดำเนินการเสร็จสิ้น",
  CLOSED: "ปิดคำร้อง",
  REJECTED: "ไม่รับดำเนินการ",
};

export default function TrackRequestPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    const response = await fetch(
      `/api/public/track?tracking_number=${encodeURIComponent(trackingNumber)}`
    );

    const json = await response.json();
    setLoading(false);

    if (!response.ok || !json.success) {
      setError(json.error?.message ?? "ไม่พบข้อมูลคำร้อง");
      return;
    }

    setResult(json.data);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900">
            ตรวจสอบสถานะคำร้อง
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            กรอกเลขคำร้อง เช่น REQ-2026-000001
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              required
              placeholder="REQ-2026-000001"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
            />

            <button
              disabled={loading}
              className="rounded-lg bg-blue-700 px-5 py-2.5 font-medium text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        {result && (
          <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">{result.tracking_number}</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  {result.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  ประเภท: {result.category}
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                {statusText[result.current_status] ?? result.current_status}
              </span>
            </div>

            <div className="mt-6 border-l-2 border-slate-200 pl-4">
              {result.history.map((item, index) => (
                <div key={index} className="mb-5">
                  <p className="font-medium text-slate-900">
                    {statusText[item.status] ?? item.status}
                  </p>
                  {item.note && (
                    <p className="mt-1 text-sm text-slate-600">{item.note}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(item.changed_at).toLocaleString("th-TH")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

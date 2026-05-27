"use client";

import { Suspense, FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  NEW: { label: "รับคำร้องเข้าระบบแล้ว", color: "bg-zinc-100 text-zinc-700", icon: Clock },
  RECEIVED: { label: "เจ้าหน้าที่รับเรื่องแล้ว", color: "bg-blue-50 text-blue-700", icon: Clock },
  UNDER_REVIEW: { label: "อยู่ระหว่างตรวจสอบ", color: "bg-amber-50 text-amber-700", icon: Search },
  IN_PROGRESS: { label: "อยู่ระหว่างดำเนินการ", color: "bg-indigo-50 text-indigo-700", icon: Clock },
  COMPLETED: { label: "ดำเนินการเสร็จสิ้น", color: "bg-green-50 text-green-700", icon: CheckCircle2 },
  CLOSED: { label: "ปิดคำร้อง", color: "bg-zinc-100 text-zinc-700", icon: CheckCircle2 },
  REJECTED: { label: "ไม่รับดำเนินการ", color: "bg-red-50 text-red-700", icon: AlertCircle },
};

function TrackRequestContent() {
  const searchParams = useSearchParams();
  const initialTracking = searchParams.get("tracking") ?? "";

  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTracking) {
      handleSearch(initialTracking);
    }
  }, [initialTracking]);

  async function handleSearch(tracking: string) {
    if (!tracking) return;
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/public/track?tracking_number=${encodeURIComponent(tracking)}`
      );
      const json = await response.json();

      if (!response.ok || !json.success) {
        setError(json.error?.message ?? "ไม่พบข้อมูลคำร้อง กรุณาตรวจสอบเลขติดตามอีกครั้ง");
      } else {
        setResult(json.data);
      }
    } catch (e) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSearch(trackingNumber);
  }

  return (
    <>
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-200">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          ตรวจสอบสถานะคำร้อง
        </h1>

        <p className="mt-2 text-sm text-zinc-600">
          กรอกหมายเลขติดตามคำร้องของคุณเพื่อดูสถานะล่าสุด
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              required
              placeholder="เช่น REQ-2026-000001"
              className="w-full rounded-xl border border-zinc-300 pl-10 pr-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus-ring uppercase"
            />
          </div>

          <button
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-70 focus-ring"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ค้นหา"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-6 rounded-2xl bg-white shadow-sm border border-zinc-200 overflow-hidden">
          <div className="p-8 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-xs font-mono font-medium text-zinc-600 mb-3">
                {result.tracking_number}
              </span>
              <h2 className="text-xl font-bold text-zinc-900 leading-tight">
                {result.title}
              </h2>
              <p className="mt-1.5 text-sm text-zinc-500">
                หมวดหมู่: <span className="text-zinc-700 font-medium">{result.category}</span>
              </p>
            </div>

            {(() => {
              const config = statusConfig[result.current_status] || { label: result.current_status, color: "bg-zinc-100 text-zinc-700" };
              return (
                <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-current/10 ${config.color}`}>
                  {config.label}
                </span>
              );
            })()}
          </div>

          <div className="p-8">
            <h3 className="font-semibold text-zinc-900 mb-6">ประวัติการดำเนินการ</h3>
            
            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
              {result.history.map((item, index) => {
                const isLast = index === result.history.length - 1;
                const config = statusConfig[item.status] || { label: item.status, color: "bg-zinc-100 text-zinc-700", icon: Clock };
                const Icon = config.icon;
                
                return (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white border-2 border-zinc-200`}>
                      <div className={`h-2.5 w-2.5 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-zinc-300'}`} />
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                        <p className={`font-semibold ${index === 0 ? 'text-zinc-900' : 'text-zinc-600'}`}>
                          {config.label}
                        </p>
                        <time className="text-xs font-medium text-zinc-400">
                          {new Date(item.changed_at).toLocaleString("th-TH")}
                        </time>
                      </div>
                      {item.note && (
                        <div className="mt-2 rounded-lg bg-zinc-50 border border-zinc-100 p-3 text-sm text-zinc-600">
                          {item.note}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TrackRequestPage() {
  return (
    <main className="min-h-screen bg-zinc-50 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าหลัก
        </Link>
        <Suspense fallback={<div className="p-8 text-center text-zinc-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>}>
          <TrackRequestContent />
        </Suspense>
      </div>
    </main>
  );
}
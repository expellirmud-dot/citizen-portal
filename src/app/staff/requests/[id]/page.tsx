import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ArrowLeft, Clock, User, Phone, Tag, Calendar, FileText } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  NEW: { label: "รับเข้าระบบ", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  RECEIVED: { label: "รับเรื่องแล้ว", color: "bg-blue-50 text-blue-700 border-blue-200" },
  UNDER_REVIEW: { label: "อยู่ระหว่างตรวจสอบ", color: "bg-amber-50 text-amber-700 border-amber-200" },
  IN_PROGRESS: { label: "อยู่ระหว่างดำเนินการ", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  COMPLETED: { label: "ดำเนินการเสร็จสิ้น", color: "bg-green-50 text-green-700 border-green-200" },
  CLOSED: { label: "ปิดคำร้อง", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  REJECTED: { label: "ไม่รับดำเนินการ", color: "bg-red-50 text-red-700 border-red-200" },
};

const statusOptions = [
  ["RECEIVED", "รับเรื่องแล้ว"],
  ["UNDER_REVIEW", "อยู่ระหว่างตรวจสอบ"],
  ["IN_PROGRESS", "อยู่ระหว่างดำเนินการ"],
  ["COMPLETED", "ดำเนินการเสร็จสิ้น"],
  ["CLOSED", "ปิดคำร้อง"],
  ["REJECTED", "ไม่รับดำเนินการ"],
];

export default async function StaffRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const item = await prisma.request.findUnique({
    where: { id },
    include: {
      category: true,
      assignedDepartment: true,
      statusHistory: {
        orderBy: { changedAt: "asc" },
        include: { changedByUser: true },
      },
    },
  });

  if (!item) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-zinc-200 text-center">
          <h1 className="text-xl font-bold text-zinc-900 mb-4">ไม่พบข้อมูลคำร้อง</h1>
          <Link href="/staff/requests" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" /> กลับหน้ารายการ
          </Link>
        </div>
      </main>
    );
  }

  const currentConfig = statusConfig[item.currentStatus] || { label: item.currentStatus, color: "bg-zinc-100 text-zinc-700 border-zinc-200" };

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="w-full border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/staff/requests"
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-mono text-lg font-bold tracking-tight text-zinc-900 leading-none">
                  {item.trackingNumber}
                </h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${currentConfig.color}`}>
                  {currentConfig.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100">
                <h2 className="text-xl font-bold text-zinc-900">{item.title}</h2>
              </div>
              
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8 mb-8">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">ผู้ยื่นคำร้อง</p>
                      <p className="text-sm font-medium text-zinc-900">{item.citizenName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">เบอร์ติดต่อ</p>
                      <p className="text-sm font-medium text-zinc-900">{item.citizenPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">หมวดหมู่</p>
                      <p className="text-sm font-medium text-zinc-900">{item.category.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">วันที่แจ้งเรื่อง</p>
                      <p className="text-sm font-medium text-zinc-900">
                        {new Date(item.createdAt).toLocaleString("th-TH")}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-zinc-400" />
                    <h3 className="font-semibold text-zinc-900">รายละเอียดคำร้อง</h3>
                  </div>
                  <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-100">
                    <p className="whitespace-pre-wrap text-sm text-zinc-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100">
                <h3 className="font-semibold text-zinc-900">ประวัติการอัปเดต</h3>
              </div>
              <div className="p-6">
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-0.5 before:bg-zinc-100">
                  {item.statusHistory.map((history, index) => {
                    const conf = statusConfig[history.newStatus] || { label: history.newStatus, color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
                    return (
                      <div key={history.id} className="relative flex items-start gap-4">
                        <div className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white border-2 ${index === item.statusHistory.length - 1 ? 'border-blue-500' : 'border-zinc-200'}`}>
                          <div className={`h-2 w-2 rounded-full ${index === item.statusHistory.length - 1 ? 'bg-blue-500' : 'bg-zinc-300'}`} />
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex justify-between items-baseline gap-2 mb-1.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${conf.color}`}>
                              {conf.label}
                            </span>
                            <time className="text-xs text-zinc-400 font-medium">
                              {new Date(history.changedAt).toLocaleString("th-TH")}
                            </time>
                          </div>
                          
                          {history.note && (
                            <p className="text-sm text-zinc-600 mt-2 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                              {history.note}
                            </p>
                          )}
                          
                          {history.changedByUser && (
                            <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              อัปเดตโดย {history.changedByUser.fullName}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden sticky top-24">
              <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                <h3 className="font-semibold text-zinc-900">อัปเดตสถานะ</h3>
              </div>
              <div className="p-5">
                <form action={`/api/staff/requests/${item.id}/status`} method="post" className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-2">สถานะใหม่</label>
                    <select name="status" required className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 bg-white focus-ring">
                      <option value="">เลือกสถานะ...</option>
                      {statusOptions.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-2">หมายเหตุการอัปเดต</label>
                    <textarea 
                      name="note" 
                      rows={4} 
                      placeholder="ระบุรายละเอียดการอัปเดตสถานะให้ประชาชนทราบ..."
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-ring resize-none" 
                    />
                  </div>

                  <button className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus-ring">
                    บันทึกสถานะ
                  </button>
                </form>
              </div>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}
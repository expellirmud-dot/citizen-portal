import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const statusText: Record<string, string> = {
  NEW: "รับเข้าระบบ",
  RECEIVED: "รับเรื่องแล้ว",
  UNDER_REVIEW: "อยู่ระหว่างตรวจสอบ",
  IN_PROGRESS: "อยู่ระหว่างดำเนินการ",
  COMPLETED: "ดำเนินการเสร็จสิ้น",
  CLOSED: "ปิดคำร้อง",
  REJECTED: "ไม่รับดำเนินการ",
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
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 border border-slate-200">
          <h1 className="text-xl font-semibold text-slate-900">ไม่พบคำร้อง</h1>
          <Link href="/staff/requests" className="mt-4 inline-block text-blue-700">
            กลับรายการคำร้อง
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Link href="/staff/requests" className="text-sm text-blue-700 hover:underline">
            ← กลับรายการคำร้อง
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {item.trackingNumber}
          </h1>
          <p className="mt-1 text-slate-600">{item.title}</p>
        </div>

        <section className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold text-slate-900">ข้อมูลคำร้อง</h2>
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              {statusText[item.currentStatus] ?? item.currentStatus}
            </span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">ผู้ยื่นคำร้อง</p>
              <p className="font-medium text-slate-900">{item.citizenName}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">เบอร์โทรศัพท์</p>
              <p className="font-medium text-slate-900">{item.citizenPhone}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">ประเภท</p>
              <p className="font-medium text-slate-900">{item.category.name}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">วันที่ส่ง</p>
              <p className="font-medium text-slate-900">
                {new Date(item.createdAt).toLocaleString("th-TH")}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-slate-500">รายละเอียด</p>
              <p className="mt-1 whitespace-pre-wrap text-slate-900">
                {item.description}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
          <h2 className="font-semibold text-slate-900">อัปเดตสถานะ</h2>

          <form action={`/api/staff/requests/${item.id}/status`} method="post" className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">สถานะใหม่</label>
              <select name="status" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="">เลือกสถานะ</option>
                {statusOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">หมายเหตุ</label>
              <textarea name="note" rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>

            <button className="rounded-lg bg-blue-700 px-5 py-2.5 font-medium text-white hover:bg-blue-800">
              บันทึกสถานะ
            </button>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
          <h2 className="font-semibold text-slate-900">ประวัติสถานะ</h2>

          <div className="mt-4 border-l-2 border-slate-200 pl-4">
            {item.statusHistory.map((history) => (
              <div key={history.id} className="mb-5">
                <p className="font-medium text-slate-900">
                  {statusText[history.newStatus] ?? history.newStatus}
                </p>
                {history.note && (
                  <p className="mt-1 text-sm text-slate-600">{history.note}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(history.changedAt).toLocaleString("th-TH")}
                  {history.changedByUser?.fullName
                    ? ` โดย ${history.changedByUser.fullName}`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

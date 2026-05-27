import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const statusText: Record<string, string> = {
  NEW: "รับเข้าระบบ",
  RECEIVED: "รับเรื่องแล้ว",
  UNDER_REVIEW: "ตรวจสอบ",
  IN_PROGRESS: "ดำเนินการ",
  COMPLETED: "เสร็จสิ้น",
  CLOSED: "ปิดเรื่อง",
  REJECTED: "ไม่รับดำเนินการ",
};

export default async function StaffRequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const requests = await prisma.request.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      assignedDepartment: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              รายการคำร้อง
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              รายการคำร้องที่ประชาชนส่งเข้าระบบ
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-white"
          >
            กลับ Dashboard
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">เลขคำร้อง</th>
                <th className="px-4 py-3">หัวข้อ</th>
                <th className="px-4 py-3">ประเภท</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3">วันที่ส่ง</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-blue-700">
                    {item.trackingNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-900">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{item.category.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {statusText[item.currentStatus] ?? item.currentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString("th-TH")}
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    ยังไม่มีคำร้องในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

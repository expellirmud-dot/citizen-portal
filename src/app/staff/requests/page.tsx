import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ArrowLeft, Search } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  NEW: { label: "รับเข้าระบบ", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  RECEIVED: { label: "รับเรื่องแล้ว", color: "bg-blue-50 text-blue-700 border-blue-200" },
  UNDER_REVIEW: { label: "ตรวจสอบ", color: "bg-amber-50 text-amber-700 border-amber-200" },
  IN_PROGRESS: { label: "ดำเนินการ", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  COMPLETED: { label: "เสร็จสิ้น", color: "bg-green-50 text-green-700 border-green-200" },
  CLOSED: { label: "ปิดเรื่อง", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  REJECTED: { label: "ไม่รับดำเนินการ", color: "bg-red-50 text-red-700 border-red-200" },
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
    <main className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="w-full border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 leading-none">
                รายการคำร้อง
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="ค้นหาเลขคำร้อง..." 
              className="w-full rounded-xl border border-zinc-300 pl-9 pr-4 py-2 text-sm focus-ring placeholder:text-zinc-400"
            />
          </div>
          <div className="text-sm text-zinc-500 font-medium">
            ทั้งหมด {requests.length} รายการ
          </div>
        </div>

        <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-medium">
                <tr>
                  <th className="px-6 py-4">เลขคำร้อง</th>
                  <th className="px-6 py-4">หัวข้อปัญหา</th>
                  <th className="px-6 py-4">หมวดหมู่</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4 text-right">วันที่แจ้ง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {requests.map((item) => {
                  const config = statusConfig[item.currentStatus] || { label: item.currentStatus, color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
                  return (
                    <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href={`/staff/requests/${item.id}`} className="font-mono font-medium text-blue-600 hover:underline">
                          {item.trackingNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-900 max-w-[200px] truncate">
                        <Link href={`/staff/requests/${item.id}`} className="hover:text-blue-600 transition-colors">
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">
                        {item.category.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-zinc-500">
                        {new Date(item.createdAt).toLocaleDateString("th-TH")}
                      </td>
                    </tr>
                  );
                })}

                {requests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      ไม่มีรายการคำร้องในขณะนี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
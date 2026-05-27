import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ShieldCheck, LogOut, Users, Settings, ClipboardList, Activity, FileText } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch metrics in parallel
  const [
    totalRequests,
    newRequests,
    inProgressRequests,
    completedRequests,
    rejectedRequests,
    categoriesRaw,
    recentRequests
  ] = await Promise.all([
    prisma.request.count(),
    prisma.request.count({ where: { currentStatus: "NEW" } }),
    prisma.request.count({ where: { currentStatus: { in: ["RECEIVED", "UNDER_REVIEW", "IN_PROGRESS"] } } }),
    prisma.request.count({ where: { currentStatus: { in: ["COMPLETED", "CLOSED"] } } }),
    prisma.request.count({ where: { currentStatus: "REJECTED" } }),
    prisma.requestCategory.findMany({
      include: {
        _count: {
          select: { requests: true }
        }
      }
    }),
    prisma.request.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true }
    })
  ]);

  const categories = categoriesRaw.sort((a, b) => b._count.requests - a._count.requests);

  const statusText: Record<string, string> = {
    NEW: "รับเข้าระบบ",
    RECEIVED: "รับเรื่องแล้ว",
    UNDER_REVIEW: "ตรวจสอบ",
    IN_PROGRESS: "ดำเนินการ",
    COMPLETED: "เสร็จสิ้น",
    CLOSED: "ปิดเรื่อง",
    REJECTED: "ไม่รับดำเนินการ",
  };

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="w-full border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-zinc-900 tracking-tight">
              Dashboard ผู้ดูแลระบบ
            </span>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </Link>
        </div>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              ภาพรวมระบบ
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              ยินดีต้อนรับคุณ {session.user.name}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link href="/staff/requests" className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:border-blue-300 hover:shadow transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-zinc-900">จัดการคำร้อง</h2>
            </div>
            <p className="text-sm text-zinc-500">ตรวจสอบและอัปเดตสถานะคำร้อง</p>
          </Link>

          <Link href="/admin/users" className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:border-blue-300 hover:shadow transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-zinc-100 text-zinc-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-zinc-900">จัดการผู้ใช้งาน</h2>
            </div>
            <p className="text-sm text-zinc-500">เพิ่ม/ลดสิทธิ์เจ้าหน้าที่</p>
          </Link>
          
          <Link href="/admin/categories" className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:border-blue-300 hover:shadow transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-zinc-100 text-zinc-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-zinc-900">ตั้งค่าหมวดหมู่</h2>
            </div>
            <p className="text-sm text-zinc-500">จัดการหมวดหมู่ปัญหาและคำร้อง</p>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center">
            <p className="text-sm font-medium text-zinc-500 mb-1">คำร้องทั้งหมด</p>
            <p className="text-3xl font-bold text-zinc-900">{totalRequests}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center">
            <p className="text-sm font-medium text-blue-600 mb-1">คำร้องใหม่</p>
            <p className="text-3xl font-bold text-blue-700">{newRequests}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center">
            <p className="text-sm font-medium text-amber-600 mb-1">กำลังดำเนินการ</p>
            <p className="text-3xl font-bold text-amber-700">{inProgressRequests}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center">
            <p className="text-sm font-medium text-green-600 mb-1">เสร็จสิ้นแล้ว</p>
            <p className="text-3xl font-bold text-green-700">{completedRequests}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center">
            <p className="text-sm font-medium text-red-600 mb-1">ยกเลิก/ปฏิเสธ</p>
            <p className="text-3xl font-bold text-red-700">{rejectedRequests}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Latest Requests */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  คำร้องล่าสุด (5 รายการ)
                </h3>
                <Link href="/staff/requests" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  ดูทั้งหมด &rarr;
                </Link>
              </div>
              <div className="divide-y divide-zinc-100">
                {recentRequests.map(req => (
                  <Link key={req.id} href={`/staff/requests/${req.id}`} className="block p-5 hover:bg-zinc-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-xs font-mono font-medium text-zinc-600 mb-2">
                          {req.trackingNumber}
                        </span>
                        <p className="font-medium text-zinc-900 truncate max-w-sm">{req.title}</p>
                        <p className="text-sm text-zinc-500 mt-1">{req.category.name}</p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-200">
                          {statusText[req.currentStatus] || req.currentStatus}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {new Date(req.createdAt).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {recentRequests.length === 0 && (
                  <div className="p-8 text-center text-zinc-500 text-sm">
                    ยังไม่มีคำร้องในระบบ
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  สัดส่วนตามหมวดหมู่
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-sm text-zinc-700 truncate" title={cat.name}>{cat.name}</span>
                    </div>
                    <span className="text-sm font-medium text-zinc-900 shrink-0 ml-4">
                      {cat._count.requests}
                    </span>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-center text-zinc-500 text-sm py-4">
                    ยังไม่มีข้อมูลหมวดหมู่
                  </div>
                )}
              </div>
            </div>
            
            {/* Account Info */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
              <h3 className="font-semibold text-zinc-900 mb-4">ข้อมูลบัญชีของคุณ</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">ชื่อ-นามสกุล</p>
                  <p className="text-sm text-zinc-900 font-medium">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">สิทธิ์การใช้งาน</p>
                  <p className="inline-flex px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-xs font-mono font-medium text-zinc-700">
                    {(session.user as any).role || "STAFF"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
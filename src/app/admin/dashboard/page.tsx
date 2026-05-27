import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ShieldCheck, LogOut, Users, Settings, ClipboardList } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link href="/staff/requests" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-blue-300 hover:shadow transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-zinc-900">จัดการคำร้อง</h2>
            </div>
            <p className="text-sm text-zinc-500">ตรวจสอบและอัปเดตสถานะคำร้องทั้งหมดในระบบ</p>
          </Link>

          <Link href="/admin/users" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-blue-300 hover:shadow transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-zinc-100 text-zinc-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-zinc-900">จัดการผู้ใช้งาน</h2>
            </div>
            <p className="text-sm text-zinc-500">เพิ่ม/ลดสิทธิ์เจ้าหน้าที่และผู้ดูแลระบบ</p>
          </Link>
          
          <Link href="/admin/categories" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-blue-300 hover:shadow transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-zinc-100 text-zinc-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Settings className="w-6 h-6" />
              </div>
              <h2 className="font-semibold text-zinc-900">ตั้งค่าหมวดหมู่</h2>
            </div>
            <p className="text-sm text-zinc-500">จัดการหมวดหมู่ปัญหาและคำร้อง</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
          <h3 className="font-semibold text-zinc-900 mb-4">ข้อมูลบัญชีของคุณ</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">ชื่อ-นามสกุล</p>
              <p className="text-zinc-900 font-medium">{session.user.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">อีเมล</p>
              <p className="text-zinc-900 font-medium">{session.user.email}</p>
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
    </main>
  );
}
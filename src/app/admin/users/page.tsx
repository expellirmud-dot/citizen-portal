import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ArrowLeft, Plus } from "lucide-react";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

async function toggleUserStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const currentStatus = formData.get("isActive") === "true";
  
  await prisma.user.update({
    where: { id },
    data: { isActive: !currentStatus },
  });
  
  revalidatePath("/admin/users");
}

async function createUser(formData: FormData) {
  "use server";
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;
  const departmentId = formData.get("departmentId") as string;
  
  if (!fullName || !email || !password || !role) return;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.error("User with this email already exists");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role,
        departmentId: departmentId || null,
        isActive: true,
      },
    });
  } catch (error) {
    console.error("Failed to create user", error);
  }
  
  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      department: true
    }
  });

  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" }
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
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 leading-none">
              จัดการผู้ใช้งาน
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Create Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm sticky top-24">
              <h2 className="font-semibold text-zinc-900 mb-4">เพิ่มผู้ใช้งานใหม่</h2>
              <form action={createUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullName"
                    required
                    placeholder="เช่น สมชาย ใจดี"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="example@local.go.th"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    รหัสผ่าน <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    สิทธิ์การใช้งาน <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    required
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 bg-white focus-ring"
                  >
                    <option value="STAFF">เจ้าหน้าที่ (STAFF)</option>
                    <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
                    <option value="EXECUTIVE">ผู้บริหาร (EXECUTIVE)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    หน่วยงาน / แผนก
                  </label>
                  <select
                    name="departmentId"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 bg-white focus-ring"
                  >
                    <option value="">-- ไม่ระบุ --</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus-ring"
                >
                  <Plus className="w-4 h-4" />
                  เพิ่มผู้ใช้งาน
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="md:col-span-2">
            <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">ผู้ใช้งาน</th>
                      <th className="px-6 py-4">สิทธิ์ / แผนก</th>
                      <th className="px-6 py-4 text-center">สถานะ</th>
                      <th className="px-6 py-4 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-zinc-900">{user.fullName}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-zinc-700">{user.role}</p>
                          <p className="text-xs text-zinc-500">{user.department?.name || "-"}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${user.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
                            {user.isActive ? "ปกติ" : "ระงับ"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <form action={toggleUserStatus}>
                            <input type="hidden" name="id" value={user.id} />
                            <input type="hidden" name="isActive" value={String(user.isActive)} />
                            <button 
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                              disabled={user.email === session?.user?.email}
                              title={user.email === session?.user?.email ? "ไม่สามารถระงับบัญชีตัวเองได้" : undefined}
                            >
                              {user.isActive ? "ระงับการใช้งาน" : "เปิดใช้งาน"}
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                          ยังไม่มีผู้ใช้งาน
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
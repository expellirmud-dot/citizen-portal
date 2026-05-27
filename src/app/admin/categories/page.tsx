import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ArrowLeft, Plus } from "lucide-react";

async function toggleCategoryStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const currentStatus = formData.get("isActive") === "true";
  
  await prisma.requestCategory.update({
    where: { id },
    data: { isActive: !currentStatus },
  });
  
  revalidatePath("/admin/categories");
}

async function createCategory(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  if (!name) return;

  try {
    await prisma.requestCategory.create({
      data: {
        name,
        description: description || null,
        isActive: true,
      },
    });
  } catch (error) {
    console.error("Failed to create category", error);
  }
  
  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const categories = await prisma.requestCategory.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { requests: true }
      }
    }
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
              ตั้งค่าหมวดหมู่
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Create Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm sticky top-24">
              <h2 className="font-semibold text-zinc-900 mb-4">เพิ่มหมวดหมู่ใหม่</h2>
              <form action={createCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    ชื่อหมวดหมู่ <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="เช่น ไฟฟ้าส่องสว่าง"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    รายละเอียดเพิ่มเติม
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="คำอธิบายหมวดหมู่"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus-ring"
                >
                  <Plus className="w-4 h-4" />
                  เพิ่มข้อมูล
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
                      <th className="px-6 py-4">ชื่อหมวดหมู่</th>
                      <th className="px-6 py-4">รายละเอียด</th>
                      <th className="px-6 py-4 text-center">จำนวนคำร้อง</th>
                      <th className="px-6 py-4 text-center">สถานะ</th>
                      <th className="px-6 py-4 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-zinc-900">
                          {cat.name}
                        </td>
                        <td className="px-6 py-4 text-zinc-500 max-w-[200px] truncate">
                          {cat.description || "-"}
                        </td>
                        <td className="px-6 py-4 text-zinc-500 text-center">
                          {cat._count.requests}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${cat.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
                            {cat.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <form action={toggleCategoryStatus}>
                            <input type="hidden" name="id" value={cat.id} />
                            <input type="hidden" name="isActive" value={String(cat.isActive)} />
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                              {cat.isActive ? "ระงับการใช้งาน" : "เปิดใช้งาน"}
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                          ยังไม่มีหมวดหมู่
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
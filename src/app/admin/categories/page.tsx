"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit2, X, AlertCircle, Inbox } from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  _count: {
    requests: number;
  };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/public/categories?all=true");
      const json = await res.json();
      setCategories(json.data ?? []);
    } catch (err) {
      setError("โหลดข้อมูลหมวดหมู่ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("กรุณาระบุชื่อหมวดหมู่");
      return;
    }

    // Check for duplicate names (excluding current editing category)
    const isDuplicate = categories.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== editingCategory?.id
    );

    if (isDuplicate) {
      setError("ชื่อหมวดหมู่ี้มีอยู่ในระบบแล้ว");
      return;
    }

    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}` 
        : "/api/admin/categories";
      
      const method = editingCategory ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message ?? "บันทึกข้อมูลไม่สำเร็จ");
      }

      // Success
      setName("");
      setDescription("");
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function toggleStatus(cat: Category) {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !cat.isActive }),
      });

      if (!res.ok) throw new Error("เปลี่ยนสถานะไม่สำเร็จ");
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  }

  function startEdit(cat: Category) {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setError("");
  }

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
          
          {/* Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm sticky top-24">
              <h2 className="font-semibold text-zinc-900 mb-4">
                {editingCategory ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    ชื่อหมวดหมู่ <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="คำอธิบายหมวดหมู่"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 flex justify-center items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      ยกเลิก
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-[2] flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus-ring"
                  >
                    {editingCategory ? (
                      <>
                        <Edit2 className="w-4 h-4" />
                        บันทึกการแก้ไข
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        เพิ่มข้อมูล
                      </>
                    )}
                  </button>
                </div>
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
                      <tr key={cat.id} className={`hover:bg-zinc-50/50 transition-colors ${editingCategory?.id === cat.id ? "bg-blue-50/30" : ""}`}>
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
                          <button 
                            onClick={() => toggleStatus(cat)}
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${cat.isActive ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200"}`}
                          >
                            {cat.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => startEdit(cat)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            แก้ไข
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!loading && categories.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                              <Inbox className="w-6 h-6" />
                            </div>
                            <div className="text-zinc-900 font-medium">ยังไม่มีหมวดหมู่ในขณะนี้</div>
                            <p className="text-zinc-500 text-xs">คุณสามารถเพิ่มหมวดหมู่ใหม่ได้จากฟอร์มด้านซ้ายมือ</p>
                          </div>
                        </td>
                      </tr>
                    )}
                    {loading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 animate-pulse">
                          กำลังโหลดข้อมูล...
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

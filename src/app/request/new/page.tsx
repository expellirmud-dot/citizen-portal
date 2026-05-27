"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

export default function NewRequestPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then((json) => setCategories(json.data ?? []))
      .catch(() => setError("โหลดประเภทคำร้องไม่สำเร็จ"));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/public/requests", {
      method: "POST",
      body: formData,
    });

    const json = await response.json();
    setLoading(false);

    if (!response.ok || !json.success) {
      setError(json.error?.message ?? "ส่งคำร้องไม่สำเร็จ");
      return;
    }

    router.push(`/request/success?tracking=${json.data.tracking_number}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">
          ยื่นคำร้องออนไลน์
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          กรุณากรอกข้อมูลให้ครบถ้วน เพื่อให้เจ้าหน้าที่สามารถดำเนินการได้อย่างถูกต้อง
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700">ชื่อ-นามสกุล</label>
            <input name="citizen_name" required className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">เบอร์โทรศัพท์</label>
            <input name="citizen_phone" required className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">อีเมล (ถ้ามี)</label>
            <input name="citizen_email" type="email" className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">ประเภทคำร้อง</label>
            <select name="category_id" required className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="">เลือกประเภทคำร้อง</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">หัวข้อ</label>
            <input name="title" required className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">รายละเอียด</label>
            <textarea name="description" required rows={5} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 px-4 py-3 font-medium text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "กำลังส่งคำร้อง..." : "ส่งคำร้อง"}
          </button>
        </form>
      </div>
    </main>
  );
}

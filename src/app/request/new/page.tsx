"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

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
    
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Frontend Validation
    const name = String(formData.get("citizen_name") ?? "").trim();
    if (!name) {
      setError("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    const phone = String(formData.get("citizen_phone") ?? "").trim();
    if (!phone) {
      setError("กรุณากรอกเบอร์โทรศัพท์");
      return;
    }

    const phoneRegex = /^0[0-9]{8,9}$/;
    if (!phoneRegex.test(phone.replace(/[- ]/g, ""))) {
      setError("กรุณาระบุเบอร์โทรศัพท์ให้ถูกต้อง (เช่น 0812345678)");
      return;
    }

    const categoryId = String(formData.get("category_id") ?? "");
    if (!categoryId) {
      setError("กรุณาเลือกประเภทคำร้อง");
      return;
    }

    const title = String(formData.get("title") ?? "").trim();
    if (!title) {
      setError("กรุณากรอกหัวข้อเรื่อง");
      return;
    }

    const description = String(formData.get("description") ?? "").trim();
    if (!description) {
      setError("กรุณากรอกรายละเอียดคำร้อง");
      return;
    }

    const file = formData.get("attachment") as File | null;
    if (file && file.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("รองรับเฉพาะไฟล์รูปภาพ JPG, PNG และ WEBP เท่านั้น");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB");
        return;
      }
    }

    setLoading(true);

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
    <main className="min-h-screen bg-zinc-50 py-10 px-4 flex flex-col">
      <div className="mx-auto max-w-2xl w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าหลัก
        </Link>
        
        <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            ยื่นคำร้องออนไลน์
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            กรุณากรอกข้อมูลให้ครบถ้วน เพื่อให้เจ้าหน้าที่สามารถดำเนินการได้อย่างถูกต้องและรวดเร็ว
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                <input 
                  name="citizen_name" 
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring" 
                  placeholder="ระบุชื่อและนามสกุล" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                <input 
                  name="citizen_phone" 
                  type="tel"
                  inputMode="numeric"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring" 
                  placeholder="08X-XXX-XXXX" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">อีเมล (ถ้ามี)</label>
              <input name="citizen_email" type="email" className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring" placeholder="example@email.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">ประเภทคำร้อง <span className="text-red-500">*</span></label>
              <select name="category_id" className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 bg-white focus-ring">
                <option value="">เลือกประเภทปัญหาที่ต้องการแจ้ง</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">หัวข้อเรื่อง <span className="text-red-500">*</span></label>
              <input name="title" className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring" placeholder="ระบุหัวข้อปัญหาให้ชัดเจน" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">รายละเอียด <span className="text-red-500">*</span></label>
              <textarea name="description" rows={5} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring resize-none" placeholder="อธิบายรายละเอียดของปัญหา หรือสถานที่ที่เกิดเหตุ..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">แนบรูปภาพ (ถ้ามี)</label>
              <input
                name="attachment"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-xs text-zinc-500">รองรับไฟล์ JPG, PNG, WEBP ขนาดไม่เกิน 5MB</p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed focus-ring"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  กำลังดำเนินการ...
                </>
              ) : (
                "ส่งคำร้อง"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

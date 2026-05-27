import Link from "next/link";
import { FileText, Search, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-zinc-900 tracking-tight">
              เทศบาลตำบลด่านทับตะโก
            </span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            สำหรับเจ้าหน้าที่
          </Link>
        </div>
      </header>

      <section className="flex-1 w-full max-w-6xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-8">
          ระบบรับเรื่องราวร้องทุกข์ออนไลน์
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-zinc-900 max-w-3xl leading-tight lg:leading-tight">
          บริการประชาชน<br className="hidden sm:block" />ด้วยความโปร่งใสและรวดเร็ว
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-600">
          ยื่นคำร้อง ติดตามสถานะ
          และตรวจสอบการทำงานของเจ้าหน้าที่ได้ตลอด 24 ชั่วโมง
          เพื่อคุณภาพชีวิตที่ดีขึ้นของทุกคนในชุมชน
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/request/new"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 hover:shadow transition-all focus-ring"
          >
            <FileText className="w-5 h-5" />
            ยื่นคำร้องใหม่
          </Link>

          <Link
            href="/request/track"
            className="flex items-center justify-center gap-2 rounded-xl bg-white border border-zinc-200 px-6 py-3.5 text-base font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all focus-ring"
          >
            <Search className="w-5 h-5 text-zinc-500" />
            ตรวจสอบสถานะ
          </Link>
        </div>
      </section>

      <section className="w-full bg-white border-t border-zinc-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "กรอกข้อมูลคำร้อง",
                desc: "เลือกประเภทปัญหาและให้ข้อมูลที่จำเป็น ระบบจะออกเลขติดตามให้ทันที",
              },
              {
                step: "2",
                title: "เจ้าหน้าที่รับเรื่อง",
                desc: "คำร้องจะถูกส่งไปยังหน่วยงานที่เกี่ยวข้องและเริ่มดำเนินการแก้ไขอย่างรวดเร็ว",
              },
              {
                step: "3",
                title: "ติดตามความคืบหน้า",
                desc: "ใช้เลขติดตามเพื่อดูสถานะการทำงานของเจ้าหน้าที่ได้ทุกขั้นตอนแบบเรียลไทม์",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center p-8 rounded-2xl bg-zinc-50 border border-zinc-100 transition-colors hover:border-zinc-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg mb-5">
                  {item.step}
                </div>
                <h3 className="font-semibold text-zinc-900 text-lg">{item.title}</h3>
                <p className="mt-3 text-zinc-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
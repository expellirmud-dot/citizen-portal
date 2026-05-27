import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-blue-700">
            เทศบาลตำบลด่านทับตะโก
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            ระบบคำร้องออนไลน์
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            ยื่นคำร้อง ติดตามสถานะ และช่วยให้การประสานงานบริการประชาชนเป็นระบบมากขึ้น
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/request/new"
              className="rounded-xl bg-blue-700 px-5 py-3 text-center font-medium text-white hover:bg-blue-800"
            >
              ยื่นคำร้องออนไลน์
            </Link>

            <Link
              href="/request/track"
              className="rounded-xl border border-slate-300 px-5 py-3 text-center font-medium text-slate-700 hover:bg-slate-100"
            >
              ตรวจสอบสถานะคำร้อง
            </Link>

            <Link
              href="/login"
              className="rounded-xl px-5 py-3 text-center font-medium text-slate-500 hover:text-slate-900"
            >
              เจ้าหน้าที่เข้าสู่ระบบ
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["1", "กรอกคำร้อง", "เลือกประเภทและกรอกรายละเอียดปัญหา"],
            ["2", "รับเลขคำร้อง", "ระบบออกเลขติดตามคำร้องให้ทันที"],
            ["3", "ติดตามสถานะ", "ตรวจสอบความคืบหน้าผ่านหน้าเว็บไซต์"],
          ].map(([step, title, desc]) => (
            <div key={step} className="rounded-2xl bg-white p-6 border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-semibold">
                {step}
              </div>
              <h2 className="mt-4 font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

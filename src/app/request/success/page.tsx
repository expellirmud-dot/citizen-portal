import Link from "next/link";

export default async function RequestSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ tracking?: string }>;
}) {
  const params = await searchParams;
  const tracking = params.tracking ?? "-";

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl">
          ✓
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-slate-900">
          ส่งคำร้องเรียบร้อยแล้ว
        </h1>

        <p className="mt-2 text-slate-600">
          กรุณาเก็บเลขคำร้องนี้ไว้สำหรับติดตามสถานะ
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xl font-bold text-blue-700">
          {tracking}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/" className="rounded-lg bg-blue-700 px-4 py-2.5 text-white">
            กลับหน้าแรก
          </Link>
          <Link href="/request/new" className="rounded-lg border px-4 py-2.5 text-slate-700">
            ส่งคำร้องอีกครั้ง
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function RequestSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ tracking?: string }>;
}) {
  const params = await searchParams;
  const tracking = params.tracking ?? "-";

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-zinc-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          ส่งคำร้องสำเร็จ
        </h1>

        <p className="mt-2 text-sm text-zinc-600">
          เทศบาลได้รับเรื่องของคุณเรียบร้อยแล้ว<br/>กรุณาเก็บเลขติดตามนี้ไว้เพื่อตรวจสอบสถานะ
        </p>

        <div className="mt-8 rounded-xl bg-zinc-50 border border-zinc-200 p-5 flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            หมายเลขติดตามคำร้อง
          </span>
          <div className="text-2xl font-bold text-blue-600 tracking-wider">
            {tracking}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link href={`/request/track?tracking=${tracking}`} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus-ring inline-flex justify-center items-center">
            ตรวจสอบสถานะตอนนี้
          </Link>
          <Link href="/" className="w-full rounded-xl bg-white border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors focus-ring inline-flex justify-center items-center">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </main>
  );
}
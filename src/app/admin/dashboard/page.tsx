import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            เข้าสู่ระบบสำเร็จ
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              <strong>ชื่อ:</strong> {session.user.name}
            </p>
            <p>
              <strong>อีเมล:</strong> {session.user.email}
            </p>
            <p>
              <strong>Role:</strong> {(session.user as any).role}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
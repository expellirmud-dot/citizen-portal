"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@danthaptako.local");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าหลัก
        </Link>

        <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              เข้าสู่ระบบเจ้าหน้าที่
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              ระบบบริหารจัดการคำร้องออนไลน์ เทศบาลตำบลด่านทับตะโก
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  className="w-full rounded-xl border border-zinc-300 pl-10 pr-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  className="w-full rounded-xl border border-zinc-300 pl-10 pr-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus-ring"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 border border-red-100">
                <p className="text-sm font-medium text-red-800 text-center">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-70 focus-ring mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
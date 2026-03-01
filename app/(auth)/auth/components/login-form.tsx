"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation"; // Thêm router để điều hướng
import { toast } from "sonner";
import { useAuthContext } from "../../providers/AuthProvider";
import fetchAuth from "@/lib/api/services/fetchAuth";

export default function LoginForm() {
  const router = useRouter();
  const { login, loading: authLoading, error: authError } = useAuthContext();

  // State cho form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(email, password);

    if (!result.success) {
      toast.error(result.error || "Đăng nhập thất bại");
      return;
    }

    const meRes = await fetchAuth.me();
    const roleRaw = meRes.data.data.roles?.[0]; // có thể là "2" hoặc 2 hoặc "Admin"

    const role = String(roleRaw); // ép về string cho chắc
    const to =
      role === "2" || role === "Admin"
        ? "/admin/dashboard"
        : role === "Saler"
          ? "/hosting"
          : "/";

    router.replace(to);
  };

  return (
    <main className="h-[100dvh] bg-white text-black flex flex-col overflow-hidden">
      {/* Top hero image */}
      <div className="relative flex-1 w-full min-h-[52vh]">
        <Image
          src="/images/login.jpg"
          alt="Login hero"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Bottom card */}
      <div
        className="
          relative z-10
          -mt-14
          w-full max-w-md mx-auto
          rounded-t-[32px]
          bg-white
          border-t border-white/10
          shadow-[0_-30px_80px_rgba(0,0,0,0.6)]
          px-6
          pt-6
          pb-[max(2.5rem,env(safe-area-inset-bottom))]
        "
      >
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link href="/register" className="text-red-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 ">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="
                mt-2 w-full rounded-2xl px-4 py-3
                bg-white border border-gray-200
                placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-red-500/60
              "
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Password</label>
            <div
              className="
                mt-2 flex items-center gap-2
                rounded-2xl px-4 py-3
                bg-white border border-gray-200
                focus-within:ring-2 focus-within:ring-red-500/60
              "
            >
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-gray-400 hover:text-red-500 transition"
                aria-label="Toggle password"
              >
                {showPw ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" className="accent-red-500 w-4 h-4" />
              Remember me
            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-red-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="
              w-full rounded-full py-4 text-center text-lg font-semibold text-white
              bg-gradient-to-r from-red-500 via-red-700 to-red-500
              shadow-[0_18px_50px_rgba(239,68,68,0.25)]
              hover:brightness-110 active:brightness-95 transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {authLoading ? "Đang xử lý..." : "Login"}
          </button>

          {/* Social */}
          <div className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-500">Or login with</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="mt-4 flex justify-center gap-3">
              {["G", "f", ""].map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition font-bold"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

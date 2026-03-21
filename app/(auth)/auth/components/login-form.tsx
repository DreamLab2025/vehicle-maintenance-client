"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "../../providers/AuthProvider";
import { useIsMobile } from "@/hooks/useMobile";
import fetchAuth from "@/lib/api/services/fetchAuth";

export default function LoginForm() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuthContext();
  const isMobile = useIsMobile();

  // State cho form
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(email, password);

    if (!result.success) {
      toast.error(result.error || "Đăng nhập thất bại");
      return;
    }

    const meRes = await fetchAuth.me();
    const roleRaw = meRes.data.data.roles?.[0];

    const role = String(roleRaw);
    const to = role === "2" || role === "Admin" ? "/admin/dashboard" : role === "Saler" ? "/hosting" : "/";

    router.replace(to);
  };

  return (
    <main className={isMobile ? "h-[100dvh] bg-white text-black flex flex-col overflow-hidden" : "w-full max-w-md"}>
      {/* Mobile only: Top hero image */}
      {isMobile && (
        <div className="relative flex-1 w-full min-h-[52vh]">
          <Image src="/images/login.jpg" alt="Login hero" fill priority className="object-cover" />
        </div>
      )}

      {/* Form card */}
      <div
        className={
          isMobile
            ? `
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
            `
            : "w-full"
        }
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{"Chào mừng bạn trở lại"}</h1>
          <p className="text-sm text-gray-400">
            {"Bạn chưa có tài khoản?"}{" "}
            <Link href="/register" className="text-red-500 hover:underline">
              {"Đăng ký"}
            </Link>
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400">{"Email"}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={"Nhập email của bạn"}
              className="
                mt-2 w-full rounded-2xl px-4 py-3
                bg-white border border-gray-200
                placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-red-500/60
              "
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">{"Mật khẩu"}</label>
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
                placeholder={"Nhập mật khẩu của bạn"}
                className="w-full bg-transparent outline-none placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPw((v: boolean) => !v)}
                className="text-gray-400 hover:text-red-500 transition"
                aria-label="Toggle password"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-red-500 w-4 h-4"
              />
              {"Nhớ tôi"}
            </label>

            <Link href="/forgot-password" className="text-sm text-red-500 hover:underline">
              {"Quên mật khẩu?"}
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
            {authLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 700);
  };

  return (
    <main className="h-[100dvh] bg-white text-black flex flex-col overflow-hidden">
      {/* Top hero image: tự co giãn để lấp hết phần còn lại */}
      <div className="relative flex-1 w-full min-h-[52vh]">
        <Image
          src="/images/redbg.webp"
          alt="Login hero"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Bottom card: form giữ nguyên chiều cao, đè lên ảnh 1 tí */}
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
        {/* Title */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-red-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 ">Phone</label>
            <input
              type="phone"
              required
              placeholder="093xxxxxxx"
              className="
                mt-2 w-full rounded-2xl px-4 py-3
                bg-white/5 border  border-grey
                placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-orange-500/60
              "
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Password</label>
            <div
              className="
                mt-2 flex items-center gap-2
                rounded-2xl px-4 py-3
                bg-white/5 border border-grey
                focus-within:ring-2 focus-within:ring-orange-500/60
              "
            >
              <input
                type={showPw ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full bg-transparent outline-none placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-gray-400 hover:text-white transition"
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
            disabled={isLoading}
            className="
              w-full rounded-full py-4 text-center text-lg font-semibold text-white
             bg-gradient-to-r from-red-500 via-red-700 to-red-500
              shadow-[0_18px_50px_rgba(245,158,11,0.25)]
              hover:brightness-110 active:brightness-95 transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isLoading ? "Đang xử lý..." : "Login"}
          </button>

          {/* Social */}
          <div className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-500">Or login with</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                aria-label="Google"
              >
                G
              </button>
              <button
                type="button"
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                aria-label="Facebook"
              >
                f
              </button>
              <button
                type="button"
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                aria-label="Apple"
              >
                
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

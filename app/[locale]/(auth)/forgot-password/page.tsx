"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");

  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const key = email.trim();

    const result = await forgotPassword(key);

    if (result.success) {
      toast.success(result.message ?? "OTP sent!");
      router.push(`/reset-password?key=${encodeURIComponent(key)}`);
    } else {
      toast.error(result.error ?? "Send OTP failed");
    }
  };

  return (
    <main className="h-[100dvh] bg-[#F8F9FA] text-black flex flex-col overflow-hidden font-sans">
      {/* Header / Hero */}
      <div className="relative h-[32vh] w-full shrink-0">
        <Image
          src="/images/login10.png"
          alt="Forgot background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        <button
          onClick={() => router.back()}
          className="absolute top-12 left-6 p-2.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white active:scale-90 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-14 left-8 text-white">
          <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
          <p className="text-sm text-white/80 mt-1">
            Enter your email to receive OTP
          </p>
        </div>
      </div>

      {/* Bottom Sheet Card */}
      <div
        className="
          flex-1 relative z-10 -mt-10
          w-full max-w-md mx-auto rounded-t-[42px]
          bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.08)]
          px-8 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]
          flex flex-col
        "
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-8" />

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border-l-4 border-red-500 flex items-center gap-3 text-red-700 text-sm animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="text-[13px] font-bold text-gray-400 ml-1 mb-1.5 block group-focus-within:text-red-500 transition-colors">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="
                  w-full rounded-2xl px-5 py-4
                  bg-gray-50 border border-gray-50
                  focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5
                  outline-none transition-all duration-300
                  text-gray-900 placeholder:text-gray-400
                "
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full rounded-2xl py-4
                  text-center text-base font-bold text-white
                  bg-gradient-to-r from-red-500 to-red-600
                  shadow-[0_12px_24px_-6px_rgba(239,68,68,0.4)]
                  active:scale-[0.96] transition-all duration-200
                  disabled:opacity-60 disabled:active:scale-100
                  flex items-center justify-center gap-3
                "
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Send OTP"
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                We’ll send a 6-digit OTP to your email.
              </p>
            </div>

            <div className="text-center mt-6 pb-2">
              <p className="text-sm text-gray-500">
                Back to{" "}
                <Link
                  href="/login"
                  className="text-red-500 font-bold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

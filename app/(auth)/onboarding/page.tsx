"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <main className="min-h-[100dvh] bg-white flex items-center justify-center px-6 py-8 text-black overflow-hidden">
      <div className="w-full max-w-sm flex flex-col">
        {/* Top spacing cố định */}
        <div className="h-10 md:h-14" />

        {/* Nội dung (giống step 1) */}
        <div className="flex-1 flex items-center">
          <div className="w-full">
            <div className="w-full min-h-[440px] flex flex-col justify-center">
              <div className="flex flex-col items-center text-center gap-6">
                {/* Logo */}
                <div
                  className="
                    w-12 h-12 rounded-xl
                    bg-gradient-to-r
                    from-red-500 via-red-700 to-red-500
                    flex items-center justify-center
                    text-white font-extrabold shadow-lg
                  "
                >
                  LOGO
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-3xl font-semibold text-black">
                    Your{" "}
                    <span className="bg-gradient-to-r font-bold from-red-500 via-red-700 to-red-500 bg-clip-text text-transparent">
                      Vehicle
                    </span>
                  </h1>
                  <h2 className="text-3xl font-semibold text-black">
                    Maintenance
                  </h2>
                </div>

                {/* Subtitle */}
                <p className="text-gray-400 text-sm max-w-xs">
                  Easily manage your vehicle with accurate, real-time updates
                  and quickly find a reputable garage, anytime, anywhere.
                </p>

                {/* Ảnh */}
                <div className="relative w-full h-60 overflow-hidden bg-white">
                  <Image
                    src="/images/car.jpg"
                    alt="Onboarding"
                    fill
                    priority
                    className="object-contain scale-[1.05] opacity-95"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom zone: chỉ còn button */}
        <div className="flex flex-col pt-10">
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="
              w-full rounded-full py-4 px-6 text-center text-lg font-semibold text-white
              bg-gradient-to-r from-red-500 via-red-700 to-red-500
              shadow-[0_18px_50px_rgba(245,158,11,0.28)]
              hover:brightness-110 active:brightness-95
              transition
            "
          >
            Get started
          </button>
        </div>
      </div>
    </main>
  );
}

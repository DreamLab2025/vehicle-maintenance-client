"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
const LOCALE = "vi";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading, logout, initAuthFromStorage } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initAuthFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  if (loading) return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-100">
      <div className="flex items-center justify-between px-5 h-16">
        {/* Left: User Profile */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <>
              <motion.button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <Image
                    src={user.avatarUrl}
                    alt={user.userName || "Avatar"}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover border-2 border-neutral-100"
                    unoptimized
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[13px] font-semibold text-neutral-900 leading-tight">
                    {user.userName || "Xin chào"}
                  </p>
                  <p className="text-[11px] text-neutral-400 flex items-center gap-0.5">
                    Tài khoản
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </p>
                </div>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-0 mt-2 w-44 rounded-xl bg-white shadow-lg shadow-neutral-200/50 border border-neutral-100 overflow-visible z-50"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          router.push(`/${LOCALE}/profile`);
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-neutral-400" />
                        Hồ sơ cá nhân
                      </button>
                      <div className="mx-3 border-t border-neutral-100" />
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.button
              onClick={() => router.push(`/${LOCALE}/login`)}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-[13px] font-medium"
            >
              <User className="w-4 h-4" />
              Đăng nhập
            </motion.button>
          )}
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 scale-150 -my-2">
          <Image
            src="/images/logo.png"
            alt="Vehicle Care"
            width={280}
            height={80}
            className="h-16 w-auto object-contain"
            unoptimized
          />
        </div>

        {/* Right: Spacer */}
        <div className="w-10" />
      </div>
    </header>
  );
}

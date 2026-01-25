"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading, logout, initAuthFromStorage } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initAuthFromStorage();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                  <img
                    src={user.avatarUrl}
                    alt={user.userName || "Avatar"}
                    className="h-9 w-9 rounded-full object-cover border-2 border-neutral-100"
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
                    className="absolute left-0 mt-2 w-44 rounded-xl bg-white shadow-lg shadow-neutral-200/50 border border-neutral-100 overflow-hidden z-50"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          router.push("/profile");
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
              onClick={() => router.push("/login")}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-[13px] font-medium"
            >
              <User className="w-4 h-4" />
              Đăng nhập
            </motion.button>
          )}
        </div>

        {/* Center: App Title */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-[15px] font-bold tracking-tight">
            <span className="text-neutral-900">Vehicle</span>
            <span className="text-red-500">Care</span>
          </h1>
        </div>

        {/* Right: Notification */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className="relative w-9 h-9 rounded-full bg-neutral-50 hover:bg-neutral-100 transition-colors flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px] text-neutral-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>
      </div>
    </header>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, MapPin, LogOut, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Header({
  title = "Your Location",
  location = "Ho Chi Minh, VN",
  onMenuClick,
}: {
  title?: string;
  location?: string;
  onMenuClick?: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading, logout, initAuthFromStorage } = useAuth();
  const router = useRouter();

  // Init auth khi component mount
  useEffect(() => {
    initAuthFromStorage();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Nếu đang load user từ cookie/token, không render gì để tránh flash UI
  if (loading) return null;

  return (
    <header className="w-full">
      <div className="flex items-center justify-between gap-3 bg-white px-4 py-3 border-b border-black/5">
        {/* Left button */}
        <motion.button
          type="button"
          onClick={onMenuClick}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03 }}
          className="grid place-items-center h-11 w-11 rounded-full bg-black/5 border border-white/10 text-black/85"
          aria-label="Menu"
        >
          <LayoutGrid className="h-5 w-5" />
        </motion.button>

        {/* Center info */}
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[12px] leading-none text-black/55">{title}</p>
          <div className="mt-1 flex items-center justify-center gap-1.5 min-w-0">
            <MapPin className="h-4 w-4 text-red-600" />
            <p className="truncate text-[15px] font-semibold text-black/90">{location}</p>
          </div>
        </div>

        {/* Right side: Avatar hoặc Sign In */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <>
              <motion.button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.03 }}
                className="h-11 w-11 rounded-full overflow-hidden border border-white/15"
                aria-label="Profile"
              >
                <img src={user.avatarUrl} alt={user.userName || "Avatar"} className="h-full w-full object-cover" />
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-lg border border-black/10 z-50"
                  >
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.button
              onClick={() => router.push("/login")}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-1 px-3 py-2 rounded-full border border-black/10 text-black/85 hover:bg-black/5"
            >
              <UserPlus className="w-4 h-4" />
              Sign In
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}

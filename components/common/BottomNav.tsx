"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import { Home, Car, Settings, User, Map } from "lucide-react";

const items = [
  { href: "/", Icon: Home, label: "Trang chủ" },
  { href: "/maps", Icon: Map, label: "Bản đồ" },
  { href: "/settings", Icon: Settings, label: "Cài đặt" },
  { href: "/profile", Icon: User, label: "Tài khoản" },
];

function normalizePath(p: string) {
  const clean = p.split("?")[0].split("#")[0];
  if (clean !== "/" && clean.endsWith("/")) return clean.slice(0, -1);
  return clean;
}

export default function BottomNav() {
  const pathnameRaw = usePathname() || "/";
  const pathname = normalizePath(pathnameRaw);

  const isActive = (href: string) => {
    const h = normalizePath(href);
    if (h === "/") return pathname === "/";
    return pathname === h || pathname.startsWith(h + "/");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-100">
        <LayoutGroup id="bottom-nav">
          <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
            {items.map(({ href, Icon, label }) => {
              const active = isActive(href);

              return (
                <Link key={href} href={href} className="relative flex-1">
                  <motion.div className="flex flex-col items-center gap-1 py-2 relative" whileTap={{ scale: 0.9 }}>
                    {active && (
                      <motion.div
                        layoutId="nav-active-bg"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                        className="absolute inset-x-2 -top-1 h-0.5 bg-red-500 rounded-full"
                      />
                    )}

                    <div className={`p-2 rounded-xl transition-colors ${active ? "bg-red-50" : "bg-transparent"}`}>
                      <Icon className={`h-5 w-5 transition-colors ${active ? "text-red-500" : "text-slate-400"}`} />
                    </div>

                    <span
                      className={`text-[10px] font-medium transition-colors ${
                        active ? "text-red-500" : "text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import { Home, Map, Settings, User } from "lucide-react";

const items = [
  { href: "/", Icon: Home },
  { href: "/maps", Icon: Map },
  { href: "/settings", Icon: Settings },
  { href: "/profile", Icon: User },
];

function normalizePath(p: string) {
  // bỏ query/hash + bỏ dấu "/" cuối (trừ "/")
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
    // active cho route con luôn: /map/abc vẫn active tab /map
    return pathname === h || pathname.startsWith(h + "/");
  };

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <LayoutGroup id="bottom-nav">
        <div className="relative flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          {items.map(({ href, Icon }) => {
            const active = isActive(href);

            return (
              <Link key={href} href={href} className="relative">
                <motion.button
                  type="button"
                  className="relative h-14 w-14 rounded-full grid place-items-center"
                  whileTap={{ scale: 0.94 }}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 520,
                        damping: 38,
                      }}
                      className="absolute inset-0 rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                    />
                  )}

                  <span className="relative z-10">
                    <Icon
                      className={`h-6 w-6 ${
                        active ? "text-black" : "text-black/60"
                      }`}
                    />
                  </span>
                </motion.button>
              </Link>
            );
          })}
        </div>
      </LayoutGroup>
    </nav>
  );
}

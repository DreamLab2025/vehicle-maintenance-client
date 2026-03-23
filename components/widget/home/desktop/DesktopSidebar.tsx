"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, LogOut, Settings, Wrench } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const BRAND = "#E22028";

const nav = [
  { href: "/", label: "Phương Tiện", Icon: Car },
  { href: "/maintenance", label: "Thay Phụ Tùng", Icon: Wrench },
  { href: "/settings", label: "Cài Đặt", Icon: Settings },
];

export function DesktopSidebar() {
  const pathname = usePathname() || "/";
  const { user, logout, initAuthFromStorage } = useAuth();

  useEffect(() => {
    initAuthFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalized = pathname.replace(/\/$/, "") || "/";

  return (
    <aside className="flex h-full min-h-0 w-[260px] shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="shrink-0 border-b border-neutral-100 px-6 py-6 dark:border-neutral-800">
        <Link href="/" className="block">
          <span className="text-xl font-bold tracking-tight" style={{ color: BRAND }}>
            VERENDAR
          </span>
          <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">Chăm sóc xe của bạn</p>
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden overscroll-contain p-3">
        {nav.map(({ href, label, Icon }) => {
          const active = href === "/" ? normalized === "/" : normalized === href || normalized.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors",
                active
                  ? "text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900",
              )}
              style={active ? { backgroundColor: BRAND } : undefined}
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-neutral-100 p-3 dark:border-neutral-800">
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white"
          style={{ backgroundColor: BRAND }}
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
            {user?.avatarUrl ? (
              <Image src={user.avatarUrl} alt="" width={40} height={40} className="h-full w-full object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                {(user?.userName || "?").slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">{user?.userName || "Người dùng"}</p>
            <p className="truncate text-[11px] text-white/80">Tài khoản</p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-lg p-2 transition-colors hover:bg-white/10"
            aria-label="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

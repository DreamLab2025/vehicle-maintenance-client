"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import type { UserVehicle } from "@/lib/api/services/fetchUserVehicle";

type DesktopMainHeaderProps = {
  currentVehicle: UserVehicle | null;
};

export function DesktopMainHeader({ currentVehicle }: DesktopMainHeaderProps) {
  const plate = currentVehicle?.licensePlate ?? "—";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-950">
      <nav className="text-[13px] text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-neutral-800 dark:hover:text-neutral-200">
              Phương tiện
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-neutral-900 dark:text-neutral-100">{plate}</li>
        </ol>
      </nav>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          aria-label="Tìm kiếm"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
        <Link
          href="/notifications"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          aria-label="Thông báo"
        >
          <Bell className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </header>
  );
}

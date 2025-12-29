"use client";

import { motion } from "framer-motion";
import { LayoutGrid, MapPin } from "lucide-react";

type HeaderProps = {
  title?: string; // "Your Location"
  location?: string; // "Chicago, USA"
  avatarUrl?: string; // ảnh avatar
  onMenuClick?: () => void;
  onAvatarClick?: () => void;
};

export default function Header({
  title = "Your Location",
  location = "Ho Chi Minh, VN",
  avatarUrl = "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop&crop=faces",
  onMenuClick,
  onAvatarClick,
}: HeaderProps) {
  return (
    <header className="w-full ">
      <div
        className="
    flex items-center justify-between gap-3
    bg-white
    px-4 py-3
    border-b border-black/5
  "
      >
        {/* Left button */}
        <motion.button
          type="button"
          onClick={onMenuClick}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03 }}
          className="
            grid place-items-center
            h-11 w-11 rounded-full
            bg-black/5
            border border-white/10
            text-black/85
          "
          aria-label="Menu"
        >
          <LayoutGrid className="h-5 w-5 co" />
        </motion.button>

        {/* Center info */}
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[12px] leading-none text-black/55">{title}</p>
          <div className="mt-1 flex items-center justify-center gap-1.5 min-w-0">
            <MapPin className="h-4 w-4 text-red-600" />
            <p className="truncate text-[15px] font-semibold text-black/90">
              {location}
            </p>
          </div>
        </div>

        {/* Avatar */}
        <motion.button
          type="button"
          onClick={onAvatarClick}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03 }}
          className="h-11 w-11 rounded-full overflow-hidden border border-white/15"
          aria-label="Profile"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </motion.button>
      </div>
    </header>
  );
}

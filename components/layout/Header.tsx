"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown, Globe, Check } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languagePopupOpen, setLanguagePopupOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languagePopupRef = useRef<HTMLDivElement>(null);
  const { user, loading, logout, initAuthFromStorage } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation("common");
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "vi");

  const languages = [
    { code: "vi", name: "Tiếng Việt", nativeName: "Tiếng Việt" },
    { code: "en", name: "English", nativeName: "English" },
  ];

  // Sync current language with i18n
  useEffect(() => {
    setCurrentLanguage(i18n.language || "vi");
  }, [i18n.language]);

  const changeLanguage = (langCode: string) => {
    if (langCode === currentLanguage) {
      setLanguagePopupOpen(false);
      setDropdownOpen(false);
      return;
    }

    // Update URL locale: /vi/page -> /en/page or /en/page -> /vi/page
    const segments = pathname.split("/");
    // segments[0] = "", segments[1] = locale, segments[2...] = rest
    if (segments[1] === "vi" || segments[1] === "en") {
      segments[1] = langCode;
    }
    const newPath = segments.join("/");

    // Change language
    i18n.changeLanguage(langCode);
    setCurrentLanguage(langCode);

    // Update URL
    router.replace(newPath);

    // Close popups
    setLanguagePopupOpen(false);
    setDropdownOpen(false);
  };

  useEffect(() => {
    initAuthFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!languagePopupOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        languagePopupRef.current &&
        !languagePopupRef.current.contains(target)
      ) {
        const clickedElement = event.target as HTMLElement;
        const languageButton = clickedElement.closest("button");
        const buttonParent = languageButton?.parentElement;
        const isLanguageButton =
          buttonParent?.querySelector("[class*='Globe']") !== null;

        if (!isLanguageButton) {
          setLanguagePopupOpen(false);
        }
      }

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
        setLanguagePopupOpen(false);
      }
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [languagePopupOpen]);

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
                    {user.userName || t("greeting", { defaultValue: "Xin chào" })}
                  </p>
                  <p className="text-[11px] text-neutral-400 flex items-center gap-0.5">
                    {t("account")}
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
                          router.push(`/${currentLanguage}/profile`);
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-neutral-400" />
                        {t("profile")}
                      </button>
                      <div className="mx-3 border-t border-neutral-100" />
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLanguagePopupOpen((prev) => !prev);
                          }}
                          className="flex items-center justify-between gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Globe className="w-4 h-4 text-neutral-400" />
                            <span>{t("language") || "Ngôn ngữ"}</span>
                          </div>
                          <span className="text-xs font-semibold text-red-600">
                            {currentLanguage === "vi" ? "VI" : "EN"}
                          </span>
                        </button>

                        {/* Language Selection Popup */}
                        <AnimatePresence>
                          {languagePopupOpen && (
                            <motion.div
                              ref={languagePopupRef}
                              initial={{ opacity: 0, x: 4, scale: 0.95 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: 4, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-full ml-1 top-0 w-44 rounded-xl bg-white shadow-2xl shadow-neutral-300/60 border border-neutral-200 overflow-hidden z-[100]"
                              style={{ minWidth: "176px" }}
                            >
                              <div className="py-1">
                                {languages.map((lang) => (
                                  <button
                                    key={lang.code}
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      changeLanguage(lang.code);
                                    }}
                                    className={`flex items-center justify-between gap-2 w-full px-4 py-2.5 text-[13px] transition-all ${
                                      currentLanguage === lang.code
                                        ? "bg-red-50 text-red-600 font-semibold"
                                        : "text-neutral-700 hover:bg-neutral-50"
                                    }`}
                                  >
                                    <span className="flex-1 text-left">
                                      {lang.nativeName}
                                    </span>
                                    {currentLanguage === lang.code && (
                                      <Check
                                        className="w-4 h-4 text-red-600 flex-shrink-0"
                                        strokeWidth={3}
                                      />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="mx-3 border-t border-neutral-100" />
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("logout")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.button
              onClick={() => router.push(`/${currentLanguage}/login`)}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-[13px] font-medium"
            >
              <User className="w-4 h-4" />
              {t("login")}
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

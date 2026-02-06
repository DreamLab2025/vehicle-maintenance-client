"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown, Globe, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languagePopupOpen, setLanguagePopupOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languagePopupRef = useRef<HTMLDivElement>(null);
  const { user, loading, logout, initAuthFromStorage } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "vi");
  const [, forceUpdate] = useState({});
  
  const languages = [
    { code: "vi", name: "Tiếng Việt", nativeName: "Tiếng Việt" },
    { code: "en", name: "English", nativeName: "English" },
  ];
  
  // Sync current language with i18n
  useEffect(() => {
    setCurrentLanguage(i18n.language || "vi");
  }, [i18n.language]);
  
  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
      forceUpdate({}); // Force re-render
    };
    
    i18n.on("languageChanged", handleLanguageChange);
    
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);
  
  const changeLanguage = (langCode: string) => {
    console.log("Changing language to:", langCode);
    console.log("Current i18n language before:", i18n.language);
    
    // Change language - this is async but we handle it
    i18n.changeLanguage(langCode).then(() => {
      console.log("Language changed successfully to:", i18n.language);
      setCurrentLanguage(i18n.language || langCode);
      setLanguagePopupOpen(false);
      setDropdownOpen(false);
      forceUpdate({});
      
      // Force re-render by dispatching custom event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: langCode } }));
        // Also trigger a storage event to notify other tabs/windows
        localStorage.setItem("i18nextLng", langCode);
      }
    }).catch((error) => {
      console.error("Error changing language:", error);
      // Fallback: try direct change
      i18n.changeLanguage(langCode);
      setCurrentLanguage(langCode);
      setLanguagePopupOpen(false);
      setDropdownOpen(false);
      forceUpdate({});
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: langCode } }));
        localStorage.setItem("i18nextLng", langCode);
      }
    });
    
    // Also update state immediately for UI feedback
    setCurrentLanguage(langCode);
  };

  useEffect(() => {
    initAuthFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!languagePopupOpen) return;
    
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Close language popup if clicking outside
      if (
        languagePopupRef.current &&
        !languagePopupRef.current.contains(target)
      ) {
        // Check if click is on the language button
        const clickedElement = event.target as HTMLElement;
        const languageButton = clickedElement.closest('button');
        const buttonParent = languageButton?.parentElement;
        const isLanguageButton = buttonParent?.querySelector('[class*="Globe"]') !== null;
        
        if (!isLanguageButton) {
          setLanguagePopupOpen(false);
        }
      }
      
      // Close dropdown if clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
        setLanguagePopupOpen(false);
      }
    }
    
    // Add small delay to avoid immediate closing
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
                    className="absolute left-0 mt-2 w-44 rounded-xl bg-white shadow-lg shadow-neutral-200/50 border border-neutral-100 overflow-visible z-50"
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
                        {t("common.profile")}
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
                            <span>{t("common.language") || "Ngôn ngữ"}</span>
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
                              style={{ minWidth: '176px' }}
                            >
                              <div className="py-1">
                                {languages.map((lang) => (
                                  <button
                                    key={lang.code}
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log("Button clicked for:", lang.code);
                                      console.log("Current language before change:", currentLanguage);
                                      changeLanguage(lang.code);
                                    }}
                                    className={`flex items-center justify-between gap-2 w-full px-4 py-2.5 text-[13px] transition-all ${
                                      currentLanguage === lang.code
                                        ? "bg-red-50 text-red-600 font-semibold"
                                        : "text-neutral-700 hover:bg-neutral-50"
                                    }`}
                                  >
                                    <span className="flex-1 text-left">{lang.nativeName}</span>
                                    {currentLanguage === lang.code && (
                                      <Check className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={3} />
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
                        {t("common.logout")}
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

        {/* Right: Spacer */}
        <div className="w-10" />
      </div>
    </header>
  );
}

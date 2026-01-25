"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [, forceUpdate] = useState({});
  const [, startTransition] = useTransition();

  // Update html lang attribute when language changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = i18n.language || "vi";
    }
  }, [i18n.language]);

  // Listen for language changes to force re-render
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      startTransition(() => {
        if (typeof document !== "undefined") {
          document.documentElement.lang = lng || "vi";
        }
        forceUpdate({});
      });
    };

    i18n.on("languageChanged", handleLanguageChange);
    
    // Also listen for custom event
    const handleCustomLanguageChange = () => {
      startTransition(() => {
        forceUpdate({});
      });
    };
    
    if (typeof window !== "undefined") {
      window.addEventListener("languagechange", handleCustomLanguageChange);
    }

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
      if (typeof window !== "undefined") {
        window.removeEventListener("languagechange", handleCustomLanguageChange);
      }
    };
  }, [i18n, startTransition]);

  return <>{children}</>;
}

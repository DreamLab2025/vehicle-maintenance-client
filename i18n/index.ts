import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// VI translations
import viCommon from "@/messages/vi/common.json";
import viHome from "@/messages/vi/home.json";
import viVehicle from "@/messages/vi/vehicle.json";
import viNav from "@/messages/vi/nav.json";
import viMap from "@/messages/vi/map.json";
import viLanguage from "@/messages/vi/language.json";
import viNotification from "@/messages/vi/notification.json";
import viReminder from "@/messages/vi/reminder.json";
import viAuth from "@/messages/vi/auth.json";

// EN translations
import enCommon from "@/messages/en/common.json";
import enHome from "@/messages/en/home.json";
import enVehicle from "@/messages/en/vehicle.json";
import enNav from "@/messages/en/nav.json";
import enMap from "@/messages/en/map.json";
import enLanguage from "@/messages/en/language.json";
import enNotification from "@/messages/en/notification.json";
import enReminder from "@/messages/en/reminder.json";
import enAuth from "@/messages/en/auth.json";

const resources = {
  vi: {
    common: viCommon,
    home: viHome,
    vehicle: viVehicle,
    nav: viNav,
    map: viMap,
    language: viLanguage,
    notification: viNotification,
    reminder: viReminder,
    auth: viAuth,
  },
  en: {
    common: enCommon,
    home: enHome,
    vehicle: enVehicle,
    nav: enNav,
    map: enMap,
    language: enLanguage,
    notification: enNotification,
    reminder: enReminder,
    auth: enAuth,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    supportedLngs: ["vi", "en"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;

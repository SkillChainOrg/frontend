import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import hiCommon from "./locales/hi/common.json";

const LANGUAGE_STORAGE_KEY = "skillchain-language";
const SUPPORTED_LANGUAGES = ["en", "hi"];

const getInitialLanguage = () => {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return SUPPORTED_LANGUAGES.includes(storedLanguage) ? storedLanguage : "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enCommon,
    },
    hi: {
      translation: hiCommon,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: {
    escapeValue: false,
  },
});

if (typeof window !== "undefined") {
  document.documentElement.lang = i18n.language;

  i18n.on("languageChanged", (language) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  });
}

export default i18n;

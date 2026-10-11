"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translate, type Locale, type MessageKey } from "./messages";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("site-locale");
    const defaultLocale: Locale = "en";
    const nextLocale =
      savedLocale === "en" || savedLocale === "mn" ? savedLocale : defaultLocale;

    setLocaleState(nextLocale);

    if (savedLocale !== nextLocale) {
      window.localStorage.setItem("site-locale", nextLocale);
    }

    setPreferenceLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    if (preferenceLoaded) {
      window.localStorage.setItem("site-locale", locale);
    }
  }, [locale, preferenceLoaded]);

  function setLocale(nextLocale: Locale) {
    setLocaleState(nextLocale);
  }

  function t(key: MessageKey, values?: Record<string, string | number>) {
    return translate(locale, key, values);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

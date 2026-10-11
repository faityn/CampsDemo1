"use client";

import { useLocale } from "@/i18n/LocaleProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const currentLocale = locale ?? "en";

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-white/40 bg-black/20 p-1 text-[9px] uppercase tracking-[0.15em] text-white backdrop-blur-md"
      aria-label={t("language.choose")}
    >
      <button
        type="button"
        lang="en"
        aria-label={t("language.english")}
        aria-pressed={currentLocale === "en"}
        onClick={() => setLocale("en")}
        className={`rounded-full px-2.5 py-1.5 transition-colors ${
          currentLocale === "en" ? "bg-white text-black" : "hover:bg-white/15"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        lang="mn"
        aria-label={t("language.mongolian")}
        aria-pressed={currentLocale === "mn"}
        onClick={() => setLocale("mn")}
        className={`rounded-full px-2.5 py-1.5 transition-colors ${
          currentLocale === "mn" ? "bg-white text-black" : "hover:bg-white/15"
        }`}
      >
        MN
      </button>
    </div>
  );
}

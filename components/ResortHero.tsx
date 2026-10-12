"use client";

import Link from "next/link";
import { useId } from "react";
import type { Destination } from "@/data/destinations";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleProvider";

export default function ResortHero({
  destination,
  preview = false,
}: {
  destination: Destination;
  preview?: boolean;
}) {
  const { t } = useLocale();
  const filterId = `destination-logo-${useId().replace(/:/g, "")}`;

  return (
    <section
      className={[
        "relative overflow-hidden",
        preview ? "aspect-[2/1] w-full" : "h-[78vh] min-h-[620px]",
      ].join(" ")}
    >
      <img
        src={destination.image}
        alt={destination.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/5" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${destination.heroGradientColor} 75%, transparent), transparent, rgb(0 0 0 / 0.05))`,
        }}
      />
      {!preview && (
        <div className="absolute right-6 top-7 z-10 flex items-center gap-5 md:right-12">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.3em] text-white/85 hover:text-white"
          >
            ← {t("common.backToDestinations")}
          </Link>
          <LanguageSwitcher />
        </div>
      )}
      <div
        className={[
          "absolute left-6 top-6 z-10",
          preview ? "md:left-7 md:top-7" : "md:left-10 md:top-10",
        ].join(" ")}
      >
        <div
          className={[
            "flex shrink-0 items-center justify-center overflow-hidden rounded-full border-[2px] bg-white shadow-2xl",
            preview
              ? "h-16 w-16 p-2 md:h-20 md:w-20"
              : "h-24 w-24 p-2 md:h-32 md:w-32 md:p-4",
          ].join(" ")}
          style={{
            borderColor: destination.accent,
          }}
        >
          <svg aria-hidden="true" className="absolute h-0 w-0">
            <defs>
              <filter id={filterId}>
                <feColorMatrix
                  in="SourceGraphic"
                  result="toneMask"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1 -1 -1 1 3"
                />
                <feComposite
                  in="toneMask"
                  in2="SourceGraphic"
                  operator="in"
                  result="logoMask"
                />
                <feFlood
                  floodColor={destination.accent}
                />
                <feComposite in2="logoMask" operator="in" />
              </filter>
            </defs>
          </svg>
          <img
            src={destination.logo}
            alt={`${destination.name} logo`}
            className="h-full w-full object-contain"
            style={{ filter: `url(#${filterId})` }}
          />
        </div>
      </div>
      <div
        className={[
          "absolute bottom-12 left-6 z-10 items-end gap-4 text-white md:gap-6",
          preview ? "md:left-7 bottom-6" : "md:left-12",
        ].join(" ")}
      >
        <div>
          <p
            className="mb-3 inline-flex rounded-sm border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: `color-mix(in srgb, ${destination.accent} 55%, transparent)`,
              borderColor: `color-mix(in srgb, ${destination.accent} 80%, transparent)`,
            }}
          >
            {destination.eyebrow}
          </p>
          <h1
            className={[
              "font-sans font-normal",
              preview ? "text-4xl md:text-5xl" : "text-6xl md:text-[120px]",
            ].join(" ")}
          >
            {destination.name}
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/80">
            {destination.region}
          </p>
        </div>
      </div>
    </section>
  );
}

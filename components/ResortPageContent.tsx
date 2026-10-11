"use client";

import ResortDetails from "@/components/ResortDetails";
import ResortHero from "@/components/ResortHero";
import SafeRichText from "@/components/SafeRichText";
import { localizeDestination } from "@/data/destination-locales";
import type { Destination } from "@/data/destinations";
import { useLocale } from "@/i18n/LocaleProvider";

export default function ResortPageContent({
  destination: sourceDestination,
}: {
  destination: Destination;
}) {
  const { locale, t } = useLocale();
  const destination = localizeDestination(sourceDestination, locale);

  return (
    <main
      className={`destination-page theme-${destination.theme} min-h-screen`}
    >
      <ResortHero destination={destination} />

      <section className="overview mx-auto max-w-5xl px-6 py-24 md:py-36">
        <p className="max-w-3xl text-3xl leading-tight md:text-6xl">
          {destination.signature}
        </p>
        <SafeRichText
          html={destination.description}
          className="mt-8 max-w-2xl text-sm leading-7 text-[color:var(--muted)] md:text-base [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
        />
        <div className="mt-16 grid gap-8 border-t border-[color:var(--line)] pt-8 md:grid-cols-3">
          {destination.facts.map((fact) => (
            <div key={fact.label}>
              <p className="text-[9px] uppercase tracking-[.3em] text-[color:var(--muted)]">
                {fact.label}
              </p>
              <p className="mt-3 text-sm">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      <ResortDetails destination={destination} />
    </main>
  );
}

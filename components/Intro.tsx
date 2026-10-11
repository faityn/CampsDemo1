"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import { destinations as fallbackDestinations, type Destination } from "@/data/destinations";
import { localizeDestination } from "@/data/destination-locales";
import { useLocale } from "@/i18n/LocaleProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SafeRichText from "@/components/SafeRichText";
import type { IntroPageContent } from "@/lib/site-content";

export default function Intro({
  introContent,
  destinations = fallbackDestinations,
}: {
  introContent?: IntroPageContent;
  destinations?: Destination[];
}) {
  const { locale, t } = useLocale();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 900], [0, 220]);
  const heroScale = useTransform(scrollY, [0, 900], [1, 1.12]);

  const homeContent: IntroPageContent = introContent
    ? {
        ...introContent,
        eyebrow:
          locale === "mn"
            ? introContent.eyebrowMn ?? introContent.eyebrow
            : introContent.eyebrow,
        tagline:
          locale === "mn"
            ? introContent.taglineMn ?? introContent.tagline
            : introContent.tagline,
        countryName:
          locale === "mn"
            ? introContent.countryNameMn ?? introContent.countryName
            : introContent.countryName,
        motto:
          locale === "mn"
            ? introContent.mottoMn ?? introContent.motto
            : introContent.motto,
        scroll:
          locale === "mn"
            ? introContent.scrollMn ?? introContent.scroll
            : introContent.scroll,
        destinationsLabel:
          locale === "mn"
            ? introContent.destinationsLabelMn ?? introContent.destinationsLabel
            : introContent.destinationsLabel,
        chooseLabel:
          locale === "mn"
            ? introContent.chooseLabelMn ?? introContent.chooseLabel
            : introContent.chooseLabel,
        destinationsDescription:
          locale === "mn"
            ? introContent.destinationsDescriptionMn ??
              introContent.destinationsDescription
            : introContent.destinationsDescription,
        differentLuxury:
          locale === "mn"
            ? introContent.differentLuxuryMn ?? introContent.differentLuxury
            : introContent.differentLuxury,
        closingHeadline:
          locale === "mn"
            ? introContent.closingHeadlineMn ?? introContent.closingHeadline
            : introContent.closingHeadline,
        closing:
          locale === "mn"
            ? introContent.closingMn ?? introContent.closing
            : introContent.closing,
      }
    : {
        eyebrow: t("home.eyebrow"),
        tagline: t("home.tagline"),
        countryName: t("home.countryName"),
        motto: t("home.motto"),
        scroll: t("home.scroll"),
        destinationsLabel: t("home.destinations"),
        chooseLabel: t("home.choose"),
        destinationsDescription: t("home.destinationsDescription"),
        differentLuxury: t("home.differentLuxury"),
        closingHeadline: `<p>${t("home.spaceToBreathe")}</p><p>${t("home.timeToStay")}</p>`,
        closing: t("home.closing"),
        heroImage: "/images/2.jpg",
      };

  const localizedDestinations = destinations.map((destination) =>
    localizeDestination(destination, locale),
  );

  return (
    <main className="bg-[#0d0e0b] text-white">
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
        <motion.img
          src={homeContent.heroImage || "/images/2.jpg"}
          alt={t("home.landscapeAlt")}
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0b] via-transparent to-black/30" />

        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-5 sm:px-6 md:px-12 md:py-7">
          <div className="text-[8px] uppercase tracking-[0.22em] sm:text-[10px] sm:tracking-[0.35em]">
            {homeContent.eyebrow}
          </div>
          <LanguageSwitcher />
        </header>

        <div className="relative z-10 flex h-full items-end px-4 pb-10 pt-24 sm:px-6 md:px-12 md:pb-20">
          <div className="max-w-5xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 text-[9px] uppercase tracking-[0.3em] text-white/70 sm:mb-5 sm:text-xs sm:tracking-[0.45em]"
            >
              {homeContent.tagline}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9 }}
              className="font-serif text-[18vw] leading-[0.78] tracking-[-0.07em] sm:text-[16vw] md:text-[11vw]"
            >
              {homeContent.countryName}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/75 sm:mt-9 sm:gap-5 sm:text-xs sm:tracking-[0.28em]"
            >
              <span className="h-px w-10 bg-white/60 sm:w-14" /> {homeContent.motto}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-7 right-6 z-20 hidden text-[9px] uppercase tracking-[0.3em] text-white/60 md:block">
          {homeContent.scroll}
        </div>
      </section>

      <section className="px-5 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-white/45">
                {homeContent.destinationsLabel}
              </p>
              <h2 className="font-serif text-4xl md:text-6xl">{homeContent.chooseLabel}</h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-6 text-white/45 md:block">
              {homeContent.destinationsDescription}
            </p>
          </div>

          <Swiper
            modules={[Mousewheel]}
            mousewheel={{ forceToAxis: true }}
            spaceBetween={18}
            slidesPerView={1.08}
            breakpoints={{
              768: { slidesPerView: 2 },
              1100: { slidesPerView: 2.7 },
            }}
            className="!overflow-visible"
          >
            {localizedDestinations.map((d) => (
              <SwiperSlide key={d.slug}>
                <Link href={`/resorts/${d.slug}`} className="group block">
                  <article className="relative h-[570px] overflow-hidden rounded-[2px]">
                    <img
                      src={d.image}
                      alt={d.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/15" />
                    <div className="absolute left-6 top-6 flex w-[calc(100%-48px)] items-center justify-between">
                      <span className="text-[10px] tracking-[0.35em] text-white/60">
                        {d.logoMark} / {d.region}
                      </span>
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/35 p-3 text-[9px] uppercase tracking-[0.25em]">
                        <img
                          src={d.logo}
                          alt={`${d.name} logo`}
                          className="max-w-[50px] object-contain brightness-0 invert drop-shadow-[0_18px_30px_rgba(0,0,0,0.65)]"
                        />
                      </span>
                    </div>
                    <div className="absolute bottom-7 left-7 right-7">
                      <p
                        className="mb-2 text-[10px] uppercase tracking-[0.35em]"
                        style={{ color: d.accent }}
                      >
                        {d.eyebrow}
                      </p>
                      <h3 className="font-sans font-normal text-5xl">{d.name}</h3>
                      <div className="mt-5 flex items-center justify-between gap-5">
                        <p className="max-w-sm text-xs leading-5 text-white/65">
                          {d.description}
                        </p>
                        <span className="shrink-0 text-[10px] uppercase tracking-[0.22em] transition-transform group-hover:translate-x-2">
                          {t("home.explore")} →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-28 md:px-12 md:py-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-6 text-[10px] uppercase tracking-[0.4em] text-white/40">
            {homeContent.differentLuxury}
          </p>
          <SafeRichText
            html={homeContent.closingHeadline}
            className="font-serif text-5xl leading-none md:text-8xl [&_p+p]:mt-2"
          />
          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-white/50">
            {homeContent.closing}
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 md:px-12">
        <div className="flex flex-col justify-between gap-4 text-[9px] uppercase tracking-[0.28em] text-white/35 md:flex-row">
          <span>
            © {new Date().getFullYear()} hoyorzagal · {t("common.rightsReserved")}
          </span>
          <span>{t("home.footerLocations")}</span>
        </div>
      </footer>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import ResortGallery from "@/components/ResortGallery";
import type {
  Destination,
  DestinationActivity,
  DestinationStay,
} from "@/data/destinations";
import SafeRichText from "@/components/SafeRichText";
import { destinations as allDestinations } from "@/data/destinations";
import { localizeDestination } from "@/data/destination-locales";
import { useLocale } from "@/i18n/LocaleProvider";
import type { MessageKey } from "@/i18n/messages";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type DetailTab =
  | "accommodations"
  | "restaurant"
  | "activities"
  | "gallery"
  | "about"
  | "location"
  | "contact";

type MapLayer = "satellite" | "terrain";

const mapLayers: { id: MapLayer; labelKey: MessageKey }[] = [
  { id: "satellite", labelKey: "common.satellite" },
  { id: "terrain", labelKey: "common.terrain" },
];

const tabs: { id: DetailTab; labelKey: MessageKey }[] = [
  { id: "activities", labelKey: "common.activities" },
  { id: "accommodations", labelKey: "common.accommodation" },
  { id: "restaurant", labelKey: "common.restaurant" },

  { id: "gallery", labelKey: "common.gallery" },
  { id: "about", labelKey: "common.aboutUs" },
  { id: "location", labelKey: "common.location" },
  { id: "contact", labelKey: "common.contactUs" },
];

export default function ResortDetails({
  destination: sourceDestination,
}: {
  destination: Destination;
}) {
  const { locale, t } = useLocale();
  const destination = localizeDestination(sourceDestination, locale);
  const [activeTab, setActiveTab] = useState<DetailTab>("activities");
  const [mapLayer, setMapLayer] = useState<MapLayer>("terrain");
  const [selectedStay, setSelectedStay] = useState<DestinationStay | null>(
    null,
  );
  const [restaurantSwiper, setRestaurantSwiper] =
    useState<SwiperInstance | null>(null);
  const [restaurantThumbsSwiper, setRestaurantThumbsSwiper] =
    useState<SwiperInstance | null>(null);
  const [activeRestaurantImage, setActiveRestaurantImage] = useState(0);

  useEffect(() => {
    if (!selectedStay) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedStay(null);
    }

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [selectedStay]);

  useEffect(() => {
    const sections = tabs
      .map(({ id }) => document.getElementById(`${destination.slug}-${id}`))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              first.boundingClientRect.top - second.boundingClientRect.top,
          )[0];

        if (visibleSection) {
          setActiveTab(
            visibleSection.target.id.replace(
              `${destination.slug}-`,
              "",
            ) as DetailTab,
          );
        }
      },
      { rootMargin: "-18% 0px -68%", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [destination.slug]);

  function scrollToSection(id: DetailTab) {
    setActiveTab(id);
    document.getElementById(`${destination.slug}-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="destination-details w-full">
      <div className="mx-auto max-w-[1380px] px-6 md:px-12">
        <div className="sticky top-0 z-20 border-y border-[color:var(--line)] bg-[color:var(--bg)]/95 py-5 backdrop-blur-md">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label={t("common.sectionNavigation")}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`shrink-0 border px-4 py-3 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  activeTab === tab.id
                    ? "border-[color:var(--ink)] bg-[color:var(--ink)] text-[color:var(--bg)]"
                    : "border-[color:var(--line)] text-[color:var(--muted)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>
        <div id="activities" className=" pt-16  md:pt-24  ">
          <section
            id={`${destination.slug}-activities `}
            className=" scroll-mt-28 "
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionIntro
                eyebrow={t("common.makeItYours")}
                title={t("common.activities")}
                text={destination.description}
              />
              {destination.activities.length > 4 && (
                <div className="flex shrink-0 justify-end gap-2">
                  <button
                    type="button"
                    aria-label={t("common.previousActivities")}
                    className={`activities-prev-${destination.slug} flex h-11 w-11 items-center justify-center border border-[color:var(--line)] text-lg transition-colors hover:bg-[color:var(--ink)] hover:text-[color:var(--bg)]`}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label={t("common.nextActivities")}
                    className={`activities-next-${destination.slug} flex h-11 w-11 items-center justify-center border border-[color:var(--line)] text-lg transition-colors hover:bg-[color:var(--ink)] hover:text-[color:var(--bg)]`}
                  >
                    →
                  </button>
                </div>
              )}
            </div>
            {destination.activities.length > 4 ? (
              <>
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{
                    prevEl: `.activities-prev-${destination.slug}`,
                    nextEl: `.activities-next-${destination.slug}`,
                  }}
                  loop={true}
                  pagination={{ clickable: true }}
                  spaceBetween={20}
                  slidesPerView={1.15}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    900: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 },
                  }}
                  className="activities-swiper mt-5 !pb-12"
                  grabCursor
                >
                  {destination.activities.map((activity, index) => (
                    <SwiperSlide key={`${destination.slug}-activity-${index}`}>
                      <ActivityCard
                        activity={activity}
                        destination={destination}
                        index={index}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            ) : (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {destination.activities.map((activity, index) => (
                  <ActivityCard
                    key={`${destination.slug}-activity-${index}`}
                    activity={activity}
                    destination={destination}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>
          <section
            id={`${destination.slug}-accommodations`}
            className="scroll-mt-28 pb-16 md:pb-24 pt-16 md:pt-24 "
          >
            <SectionIntro
              eyebrow={t("common.stayWithUs")}
              title={t("common.accommodation")}
              text={t("common.accommodationDescription")}
            />
            <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2">
              {destination.stay.map((item, index) => (
                <button
                  key={`${destination.slug}-stay-${index}`}
                  type="button"
                  onClick={() => item.gallery?.length && setSelectedStay(item)}
                  className="flex h-full flex-col overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface)] text-left"
                >
                  <img
                    src={item.image || "/images/2.jpg"}
                    alt={item.title}
                    className="h-72 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-3xl">{item.title}</h3>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[color:var(--muted)]">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section
            id={`${destination.slug}-restaurant`}
            className="destination-theme-section scroll-mt-28 pt-24 pb-24 "
          >
            <div className="grid gap-12 md:grid-cols-[1fr_0.8fr]">
              <div>
                <SectionIntro
                  eyebrow={destination.featuredRestaurant.title}
                  title={t("common.restaurant")}
                />
                <p className="mt-6 max-w-xl whitespace-pre-line text-sm leading-7 text-[color:var(--muted)]">
                  {destination.featuredRestaurant.text}
                </p>
              </div>
              <div className="border-l border-[color:var(--line)] pl-6 md:mt-12">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)]">
                  {t("common.diningRhythm")}
                </p>
                <dl className="mt-6 space-y-5 text-sm text-[color:var(--muted)]">
                  <InfoRow
                    label={t("common.breakfast")}
                    value="08:00 — 10:00"
                  />
                  <InfoRow label={t("common.dinner")} value="19:00 — 21:00" />
                  <InfoRow
                    label={t("common.style")}
                    value={t("common.localSeasonal")}
                  />
                </dl>
              </div>
            </div>
            <ResortGallery
              images={destination.restaurantGallery}
              title={t("common.restaurantImages", { name: destination.name })}
              slug={`${destination.slug}-restaurant`}
            />
            {/* <div className="-mx-6 mt-20 bg-[#f4ede2] px-6 py-16 text-[#302015] md:mx-[calc((100vw-100%)/-2)] md:px-[max(calc((100vw-1380px)/2),3rem)] md:py-24">
              <div className="mx-auto grid max-w-[1380px] items-center gap-10 md:grid-cols-[1.1fr_.9fr]">
                <div className="relative h-[360px] min-w-0 overflow-hidden md:h-[530px]">
                  <Swiper
                    modules={[Thumbs]}
                    thumbs={{
                      swiper:
                        restaurantThumbsSwiper &&
                        !restaurantThumbsSwiper.destroyed
                          ? restaurantThumbsSwiper
                          : null,
                    }}
                    onSwiper={setRestaurantSwiper}
                    onSlideChange={(swiper) =>
                      setActiveRestaurantImage(swiper.realIndex)
                    }
                    loop
                    className="h-full w-full"
                  >
                    {destination.restaurantGallery.map((image, index) => (
                      <SwiperSlide key={`${destination.slug}-featured-${index}`}>
                        <img
                          src={image}
                          alt={`${destination.name} restaurant ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="min-w-0 md:pl-5">
                  <p className="text-[10px] uppercase tracking-[0.45em] text-[#8c6b52]">
                    Restaurant
                    <span className="ml-3 inline-block h-px w-12 bg-[#8c6b52] align-middle" />
                  </p>
                  <h3 className="mt-5 max-w-lg font-serif text-4xl leading-tight md:text-5xl">
                    {destination.featuredRestaurant.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-sm leading-7 text-[#665348]">
                    {destination.featuredRestaurant.text}
                  </p>
                  <a
                    href={`#${destination.slug}-contact`}
                    className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#4b2917] px-6 py-3 text-xs text-white transition-colors hover:bg-[#684027]"
                  >
                    View Menu <span aria-hidden="true">→</span>
                  </a>

                  <div className="mt-10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => restaurantThumbsSwiper?.slidePrev()}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#4b2917]/30 bg-white/70 text-[#4b2917] transition hover:bg-white"
                      aria-label={t("common.previousRestaurantThumbnails")}
                    >
                      ←
                    </button>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <Swiper
                        modules={[Thumbs]}
                        onSwiper={setRestaurantThumbsSwiper}
                        slidesPerView={3}
                        spaceBetween={8}
                        watchSlidesProgress
                        watchOverflow
                        loop
                        breakpoints={{
                          640: { slidesPerView: 3 },
                          1024: { slidesPerView: 3 },
                        }}
                        className="w-full min-w-0"
                      >
                        {destination.restaurantGallery.map((image, index) => (
                          <SwiperSlide
                            key={`${destination.slug}-featured-thumb-${index}`}
                            className="min-w-0"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                restaurantSwiper?.slideToLoop(index)
                              }
                              className={`relative block aspect-square w-full overflow-hidden rounded-md border transition ${
                                activeRestaurantImage === index
                                  ? "border-[#4b2917] ring-2 ring-[#4b2917]/60"
                                  : "border-transparent"
                              }`}
                              aria-label={`View restaurant image ${index + 1}`}
                              aria-current={
                                activeRestaurantImage === index
                                  ? "true"
                                  : undefined
                              }
                            >
                              <img
                                src={image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </button>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    <button
                      type="button"
                      onClick={() => restaurantThumbsSwiper?.slideNext()}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#4b2917]/30 bg-white/70 text-[#4b2917] transition hover:bg-white"
                      aria-label={t("common.nextRestaurantThumbnails")}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </section>

          <section
            id={`${destination.slug}-gallery`}
            className="scroll-mt-28 py-24"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionIntro
                eyebrow={t("common.senseOfPlace")}
                title={t("common.gallery")}
                text={t("common.galleryDescription", {
                  name: destination.name,
                })}
              />
              <div className="flex shrink-0 justify-end gap-2">
                <button
                  type="button"
                  aria-label={t("common.previousImages", {
                    name: destination.name,
                  })}
                  className={`gallery-prev-${destination.slug} flex h-11 w-11 items-center justify-center border border-[color:var(--line)] text-lg transition-colors hover:bg-[color:var(--ink)] hover:text-[color:var(--bg)]`}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label={t("common.nextImages", {
                    name: destination.name,
                  })}
                  className={`gallery-next-${destination.slug} flex h-11 w-11 items-center justify-center border border-[color:var(--line)] text-lg transition-colors hover:bg-[color:var(--ink)] hover:text-[color:var(--bg)]`}
                >
                  →
                </button>
              </div>
            </div>
            <ResortGallery
              images={destination.gallery}
              title={destination.name}
              slug={destination.slug}
              enableNavigation
              enableLightbox
              showNavigationControls={false}
            />
          </section>

          <section
            id={`${destination.slug}-about`}
            className="destination-theme-section scroll-mt-28"
          >
            <div className="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14">
              <div className="group relative min-h-[340px] overflow-hidden md:min-h-[650px]">
                <img
                  src={destination.aboutImage}
                  alt={`${destination.name} camp`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                <p className="absolute bottom-6 left-6 border-l border-white/70 pl-3 text-[10px] uppercase tracking-[0.3em] text-white/90 md:bottom-9 md:left-9">
                  {destination.region}
                </p>
              </div>
              <div className="relative py-4 md:py-12">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--muted)]">
                  {t("common.aboutEyebrow")}
                </p>
                <h2 className="mt-4 font-serif text-5xl leading-none md:text-7xl">
                  {t("common.aboutUs")}
                </h2>
                <p className="mt-8 max-w-xl font-serif text-2xl leading-snug md:text-3xl">
                  {destination.signature}
                </p>
                <div className="mt-8 max-w-xl space-y-5 border-l border-[color:var(--theme-line)] pl-5 text-sm leading-7 text-[color:var(--muted)] md:pl-7 md:text-base">
                  {destination.aboutText.map((paragraph, index) => (
                    <SafeRichText
                      key={`${destination.slug}-about-${index}`}
                      html={paragraph}
                      className="[&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* <AboutParallaxSection destination={destination} /> */}

          <section
            id={`${destination.slug}-location`}
            className="scroll-mt-28 pt-24 pb-24"
          >
            <div className="grid gap-12 md:grid-cols-[1fr_1.15fr]">
              <div>
                <SectionIntro
                  eyebrow={t("common.findYourWay")}
                  title={t("common.howToGetThere")}
                  text={destination.arrivalText}
                />
                <div className="mt-10 space-y-5 border-l border-[color:var(--line)] pl-6">
                  <InfoRow
                    label={t("common.startingPoint")}
                    value={t("common.ulaanbaatar")}
                  />
                  <InfoRow
                    label={t("common.destination")}
                    value={destination.region}
                  />
                  <InfoRow
                    label={t("common.transfer")}
                    value={t("common.privateVehicle")}
                  />
                  <p className="pt-3 text-xs leading-6 text-[color:var(--muted)]">
                    {t("common.transportHelp")}
                  </p>
                </div>
              </div>
              <div className="relative min-h-[360px] overflow-hidden border border-[color:var(--line)] bg-[#e8e3d8] md:min-h-[460px]">
                <iframe
                  title={`${t("common.howToGetThere")}: ${destination.name}`}
                  src={`https://www.google.com/maps?q=${destination.mapCenter}&z=11&output=embed&t=${mapLayer === "satellite" ? "k" : "p"}&hl=${locale}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0"
                />
                <div className="pointer-events-none absolute left-2 top-2 bg-[color:var(--bg)] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink)] shadow-lg">
                  {t("common.howToGetThere")}
                </div>
                <div className="absolute right-2 top-2 flex gap-1 bg-[color:var(--bg)] p-1 shadow-lg">
                  {mapLayers.map((layer) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setMapLayer(layer.id)}
                      className={`px-3 py-2 text-[9px] uppercase tracking-[0.14em] transition-colors ${
                        mapLayer === layer.id
                          ? "bg-[color:var(--ink)] text-[color:var(--bg)]"
                          : "text-[color:var(--muted)] hover:text-[color:var(--ink)]"
                      }`}
                    >
                      {t(layer.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            id={`${destination.slug}-contact`}
            className="destination-theme-section scroll-mt-28"
          >
            <div className="relative left-1/2 mx-auto grid w-screen max-w-[1380px] -translate-x-1/2 gap-12 px-6 md:grid-cols-3 md:px-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.45em] text-[color:var(--muted)]">
                  {t("common.contactUs")}{" "}
                  <span
                    className="ml-3 inline-block h-px w-12 align-middle"
                    style={{ backgroundColor: destination.accent }}
                  />
                </p>
                <p className="mt-5 max-w-sm whitespace-pre-line text-sm leading-7 text-[color:var(--muted)]">
                  {destination.contactText}
                </p>
              </div>

              <div className="space-y-6 pt-3 text-sm text-[color:var(--muted)]">
                <div className="flex items-center gap-4">
                  <svg
                    aria-hidden="true"
                    className="h-[17px] w-[17px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={destination.accent}
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7a2 2 0 0 1 1.73 2.03z" />
                  </svg>
                  <a
                    href={`tel:${destination.phone}`}
                    className="transition-opacity hover:opacity-70"
                  >
                    {destination.phone}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <svg
                    aria-hidden="true"
                    className="h-[17px] w-[17px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={destination.accent}
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                  <a
                    href="mailto:info@hoyorzagal.mn"
                    className="transition-opacity hover:opacity-70"
                  >
                    info@hoyorzagal.mn
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <svg
                    aria-hidden="true"
                    className="h-[17px] w-[17px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={destination.accent}
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <a
                    href={destination.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-opacity hover:opacity-70"
                  >
                    {destination.region}
                  </a>
                </div>
              </div>

              <nav className="pt-3" aria-label={t("common.resortNavigation")}>
                <div className="grid gap-3 text-sm text-[color:var(--ink)]">
                  <a
                    href="/"
                    className="flex items-center justify-between border-b border-[color:var(--theme-line)] pb-3 transition-colors hover:opacity-60"
                  >
                    {t("common.home")} <span aria-hidden="true">↗</span>
                  </a>
                  {allDestinations
                    .filter((item) => item.slug !== destination.slug)
                    .map((item) => (
                      <a
                        key={item.slug}
                        href={`/resorts/${item.slug}`}
                        className="flex items-center justify-between border-b border-[color:var(--theme-line)] pb-3 transition-colors hover:opacity-60"
                      >
                        {item.name} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                </div>
              </nav>
            </div>
          </section>
        </div>
      </div>

      <footer className="bg-[color:var(--theme-bg)] px-6 py-7 text-center text-[10px] uppercase tracking-[.25em] text-[color:var(--theme-ink)]">
        <a href="/" className="transition-opacity hover:opacity-100">
          © {new Date().getFullYear()} HOYOR ZAGAL ·{" "}
          {t("common.rightsReserved")}
        </a>
      </footer>

      {selectedStay?.gallery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedStay.title} ${t("common.gallery")}`}
          onClick={() => setSelectedStay(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden bg-[color:var(--bg)] p-4 md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedStay(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-black/60 text-xl text-white transition-colors hover:bg-black/80"
              aria-label={t("common.closeGallery")}
            >
              ×
            </button>
            <div className="mb-5 pr-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                {t("common.campAccommodation", { name: destination.name })}
              </p>
              <h3 className="mt-2 font-serif text-3xl text-[color:var(--ink)] md:text-5xl">
                {selectedStay.title}
              </h3>
            </div>
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1}
              className="accommodation-modal-swiper"
            >
              {selectedStay.gallery.map((image, index) => (
                <SwiperSlide key={`${selectedStay.title}-${index}`}>
                  <img
                    src={image}
                    alt={t("common.campView", {
                      name: selectedStay.title,
                      number: index + 1,
                    })}
                    className="h-[55vh] min-h-[280px] w-full object-cover md:h-[62vh]"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
              {selectedStay.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function AboutParallaxSection({ destination }: { destination: Destination }) {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-8%", "8%"],
  );

  return (
    <section
      ref={sectionRef}
      aria-label={`${destination.name} — ${t("common.aboutUs")}`}
      className="relative left-1/2 flex min-h-[75svh] w-screen -translate-x-1/2 items-center overflow-hidden"
    >
      <motion.img
        src={destination.gallery[0]}
        alt={`${destination.name} landscape`}
        className="absolute -top-[8%] left-0 h-[116%] w-full object-cover"
        style={{ y: imageY }}
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/35" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 md:px-12 md:py-28">
        <div className="max-w-3xl text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white drop-shadow-md">
            {destination.region}
          </p>
          <h2 className="mt-5 font-serif text-6xl leading-[0.95] [text-shadow:0_3px_18px_rgba(0,0,0,0.6)] md:text-8xl">
            {t("common.aboutUs")}
          </h2>
          <p className="mt-8 max-w-2xl font-serif text-2xl font-medium leading-snug [text-shadow:0_2px_12px_rgba(0,0,0,0.75)] md:text-4xl">
            {destination.signature}
          </p>
          <div className="mt-7 max-h-[min(45svh,28rem)] max-w-2xl space-y-4 overflow-y-auto overscroll-contain border-l-2 border-white py-1 pl-5 pr-3 text-sm font-medium leading-7 text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.9)] md:pl-7 md:text-base md:leading-8">
            {destination.aboutText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityCard({
  activity,
  destination,
  index,
}: {
  activity: DestinationActivity;
  destination: Destination;
  index: number;
}) {
  const { t } = useLocale();

  return (
    <article
      tabIndex={0}
      className="group relative isolate aspect-[3/4] w-full overflow-hidden bg-[color:var(--surface)]"
    >
      <img
        src={activity.image}
        alt={`${activity.title} ${t("common.at")} ${destination.name}`}
        className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/15 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-white md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-7 bg-white/70" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/75">
            {String(index + 1).padStart(2, "0")} / {t("common.experience")}
          </p>
        </div>
        <h3 className="font-serif text-3xl text-white">{activity.title}</h3>
        <p className="mt-3 max-h-40 translate-y-0 whitespace-pre-line text-sm leading-6 text-white/80 transition-all duration-500 md:max-h-0 md:translate-y-4 md:overflow-hidden md:opacity-0 md:group-hover:max-h-40 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:max-h-40 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          {activity.text}
        </p>
      </div>
    </article>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--muted)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-5xl leading-none md:text-7xl">
        {title}
      </h2>
      {/* <p className="mt-6 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
        {text}
      </p> */}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-[color:var(--line)] pb-4 text-sm">
      <span className="text-[color:var(--muted)]">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

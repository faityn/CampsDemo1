"use client";

import { useEffect, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import DestinationGallery from "@/components/DestinationGallery";
import type { Destination, DestinationStay } from "@/data/destinations";
import "swiper/css";
import "swiper/css/pagination";

type DetailTab =
  | "experience"
  | "accommodations"
  | "restaurant"
  | "gallery"
  | "directions"
  | "contact";

type MapLayer = "satellite" | "terrain";

const mapLayers: { id: MapLayer; label: string }[] = [
  { id: "satellite", label: "Satellite" },
  { id: "terrain", label: "Terrain" },
];

const tabs: { id: DetailTab; label: string }[] = [
  { id: "experience", label: "The experience" },
  { id: "gallery", label: "Gallery" },
  { id: "restaurant", label: "Restaurant" },
  { id: "accommodations", label: "Accommodations" },
  { id: "directions", label: "How to get there" },
  { id: "contact", label: "Contact us" },
];

export default function DestinationDetails({
  destination,
}: {
  destination: Destination;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>("experience");
  const [mapLayer, setMapLayer] = useState<MapLayer>("terrain");
  const [selectedStay, setSelectedStay] = useState<DestinationStay | null>(
    null,
  );

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
      <div className="mx-auto max-w-6xl px-6  md:px-12">
        <div className="sticky top-0 z-20 border-y border-[color:var(--line)] bg-[color:var(--bg)]/95 py-5 backdrop-blur-md">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Destination details"
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
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-32 pt-16 md:space-y-44 md:pt-24">
          <section
            id={`${destination.slug}-experience`}
            className="scroll-mt-28"
          >
            <SectionIntro
              eyebrow="Make it yours"
              title="The experience"
              text={destination.description}
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {destination.highlights.map((item, index) => (
                <article
                  key={`${destination.slug}-highlight-${index}`}
                  className="border-t border-[color:var(--line)] pt-5"
                >
                  <p className="text-[10px] text-[color:var(--muted)]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-8 font-serif text-3xl">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            id={`${destination.slug}-gallery`}
            className="destination-theme-section scroll-mt-28"
          >
            <SectionIntro
              eyebrow="A sense of place"
              title="Gallery"
              text={`A closer look at life around ${destination.name}.`}
            />
            <DestinationGallery
              images={destination.gallery}
              title={destination.name}
              slug={destination.slug}
            />
          </section>

          <section
            id={`${destination.slug}-restaurant`}
            className="destination-white-section scroll-mt-28"
          >
            <div className="grid gap-12 md:grid-cols-[1fr_0.8fr]">
              <SectionIntro
                eyebrow="At the table"
                title="Restaurant"
                text={destination.restaurantText}
              />
              <div className="border-l border-[color:var(--line)] pl-6 md:mt-12">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)]">
                  Dining rhythm
                </p>
                <dl className="mt-6 space-y-5 text-sm text-[color:var(--muted)]">
                  <InfoRow label="Breakfast" value="08:00 — 10:00" />
                  <InfoRow label="Dinner" value="19:00 — 21:00" />
                  <InfoRow label="Style" value="Local & seasonal" />
                </dl>
              </div>
            </div>
            <DestinationGallery
              images={destination.restaurantGallery}
              title={`${destination.name} restaurant`}
              slug={`${destination.slug}-restaurant`}
            />
          </section>

          <section
            id={`${destination.slug}-accommodations`}
            className="destination-theme-section scroll-mt-28"
          >
            <SectionIntro
              eyebrow="Stay with us"
              title="Accommodations"
              text="Thoughtful spaces designed to keep you close to the landscape, with the warmth and quiet you need to settle in."
            />
            <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2">
              {destination.stay.map((item, index) => (
                <button
                  key={`${destination.slug}-stay-${index}`}
                  type="button"
                  onClick={() => item.gallery && setSelectedStay(item)}
                  className="flex h-full flex-col overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface)] text-left"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-72 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-3xl">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section
            id={`${destination.slug}-directions`}
            className="scroll-mt-28"
          >
            <div className="grid gap-12 md:grid-cols-[1fr_1.15fr]">
              <div>
                <SectionIntro
                  eyebrow="Find your way"
                  title="How to get there"
                  text={destination.arrivalText}
                />
                <div className="mt-10 space-y-5 border-l border-[color:var(--line)] pl-6">
                  <InfoRow label="Starting point" value="Ulaanbaatar" />
                  <InfoRow label="Destination" value={destination.region} />
                  <InfoRow label="Transfer" value="Private vehicle" />
                  <p className="pt-3 text-xs leading-6 text-[color:var(--muted)]">
                    Our team can help arrange transport and share the best route
                    for your arrival date.
                  </p>
                </div>
              </div>
              <div className="relative min-h-[360px] overflow-hidden border border-[color:var(--line)] bg-[#e8e3d8] md:min-h-[460px]">
                <iframe
                  title={`How to get there: ${destination.name}`}
                  src={`https://www.google.com/maps?q=${destination.mapCenter}&z=11&output=embed&t=${mapLayer === "satellite" ? "k" : "p"}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0"
                />
                <div className="pointer-events-none absolute left-2 top-2 bg-[color:var(--bg)] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink)] shadow-lg">
                  How to get there
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
                      {layer.label}
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
            <div className="grid gap-12 md:grid-cols-[1fr_0.8fr]">
              <SectionIntro
                eyebrow="We are here"
                title="Contact us"
                text={destination.contactText}
              />
              <div className="space-y-6 border-l border-[color:var(--line)] pl-6 md:mt-12">
                <InfoRow label="Email" value="info@hoyorzagal.mn" />
                <InfoRow label="Phone" value={destination.phone} />
                <InfoRow label="Location" value={destination.region} />
                <a
                  href="mailto:info@hoyorzagal.mn"
                  className="inline-block border border-[color:var(--ink)] bg-[color:var(--ink)] px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-[color:var(--bg)] transition-opacity hover:opacity-80"
                >
                  Start a conversation
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {selectedStay?.gallery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedStay.title} gallery`}
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
              aria-label="Close gallery"
            >
              ×
            </button>
            <div className="mb-5 pr-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Alungoo accommodations
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
                    alt={`${selectedStay.title} view ${index + 1}`}
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

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--muted)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-5xl leading-none md:text-7xl">
        {title}
      </h2>
      <p className="mt-6 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
        {text}
      </p>
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

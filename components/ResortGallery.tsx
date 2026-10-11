"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "@/i18n/LocaleProvider";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

export default function ResortGallery({
  images,
  title,
  slug,
  enableNavigation = false,
  enableLightbox = false,
  showNavigationControls = true,
}: {
  images: string[];
  title: string;
  slug: string;
  enableNavigation?: boolean;
  enableLightbox?: boolean;
  showNavigationControls?: boolean;
}) {
  const { t } = useLocale();
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const isLightboxOpen = activeImage !== null;

  useEffect(() => {
    if (!isLightboxOpen) return;

    const scrollY = window.scrollY;
    const bodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveImage(null);
      if (event.key === "ArrowLeft") {
        setActiveImage((index) =>
          index === null ? null : (index - 1 + images.length) % images.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveImage((index) =>
          index === null ? null : (index + 1) % images.length,
        );
      }
    }

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.position = bodyStyles.position;
      document.body.style.top = bodyStyles.top;
      document.body.style.left = bodyStyles.left;
      document.body.style.right = bodyStyles.right;
      document.body.style.width = bodyStyles.width;
      document.body.style.overflow = bodyStyles.overflow;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, images.length]);

  return (
    <div className="mt-8">
      {enableNavigation && showNavigationControls && (
        <div className="mb-5 flex justify-end gap-2">
          <button
            type="button"
            aria-label={t("common.previousImages", { name: title })}
            className={`gallery-prev-${slug} flex h-11 w-11 items-center justify-center border border-[color:var(--line)] text-lg transition-colors hover:bg-[color:var(--ink)] hover:text-[color:var(--bg)]`}
          >
            ←
          </button>
          <button
            type="button"
            aria-label={t("common.nextImages", { name: title })}
            className={`gallery-next-${slug} flex h-11 w-11 items-center justify-center border border-[color:var(--line)] text-lg transition-colors hover:bg-[color:var(--ink)] hover:text-[color:var(--bg)]`}
          >
            →
          </button>
        </div>
      )}
      <Swiper
        modules={enableNavigation ? [Navigation] : []}
        navigation={
          enableNavigation
            ? {
                prevEl: `.gallery-prev-${slug}`,
                nextEl: `.gallery-next-${slug}`,
              }
            : false
        }
        spaceBetween={18}
        slidesPerView={1.2}
        slidesPerGroup={1}
        loop={true}
        loopPreventsSliding={false}
        watchOverflow={false}
        breakpoints={{
          480: { slidesPerView: 1.8 },
          640: { slidesPerView: 2.2 },
          900: { slidesPerView: 2.2 },
          1200: { slidesPerView: 2.2 },
        }}
        grabCursor
        speed={900}
        className="w-full overflow-hidden"
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${slug}-${index}`}>
            <div className="overflow-hidden rounded-[2px] border border-white/10 bg-white/[0.02]">
              {enableLightbox ? (
                <button
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className="block w-full cursor-zoom-in"
                  aria-label={t("common.openImage", {
                    name: title,
                    number: index + 1,
                  })}
                >
                  <img
                    src={image}
                    alt={t("common.campView", {
                      name: title,
                      number: index + 1,
                    })}
                    className="h-[340px] w-full object-cover md:h-[420px]"
                  />
                </button>
              ) : (
                <img
                  src={image}
                  alt={`${title} view ${index + 1}`}
                  className="h-[340px] w-full object-cover md:h-[420px]"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {enableLightbox &&
        activeImage !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex h-[100dvh] items-center justify-center overflow-hidden bg-black/90 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} ${t("common.gallery")}`}
            onClick={() => setActiveImage(null)}
          >
            <div
              className="relative w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-2xl text-white transition hover:bg-black/60"
                aria-label={t("common.closeGallery")}
              >
                ×
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveImage(
                    (activeImage - 1 + images.length) % images.length,
                  )
                }
                className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-xl text-white transition hover:bg-black/60 md:left-5"
                aria-label={t("common.previousImage")}
              >
                ←
              </button>
              <div className="relative mx-auto aspect-[16/10] max-h-[calc(100dvh-8rem)] w-full overflow-hidden rounded-xl border border-white/10 bg-[#1a120d] shadow-2xl">
                <img
                  src={images[activeImage]}
                  alt={t("common.campImage", {
                    name: title,
                    number: activeImage + 1,
                  })}
                  className="h-full w-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setActiveImage((activeImage + 1) % images.length)}
                className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-xl text-white transition hover:bg-black/60 md:right-5"
                aria-label={t("common.nextImage")}
              >
                →
              </button>
              <div className="mt-4 flex items-center justify-between gap-4 text-sm text-white/75">
                <span>
                  {t("common.imageNumber", {
                    number: activeImage + 1,
                    total: images.length,
                  })}
                </span>
                <span className="uppercase tracking-[0.2em] text-white/50">
                  {title}
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

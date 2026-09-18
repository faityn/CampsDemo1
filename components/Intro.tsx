"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import { destinations } from "@/data/destinations";

export default function Intro() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 900], [0, 220]);
  const heroScale = useTransform(scrollY, [0, 900], [1, 1.12]);

  return (
    <main className="bg-[#0d0e0b] text-white">
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
        <motion.img
          src="/images/1.jpg"
          alt="Mongolian landscape"
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0b] via-transparent to-black/30" />

        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-5 sm:px-6 md:px-12 md:py-7">
          <div className="text-[8px] uppercase tracking-[0.22em] sm:text-[10px] sm:tracking-[0.35em]">
            Mongolia / Destinations
          </div>
          <div className="rounded-full border border-white/40 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] backdrop-blur-md sm:px-4 sm:py-2 sm:text-[10px] sm:tracking-[0.25em]">
            Explore
          </div>
        </header>

        <div className="relative z-10 flex h-full items-end px-4 pb-10 pt-24 sm:px-6 md:px-12 md:pb-20">
          <div className="max-w-5xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 text-[9px] uppercase tracking-[0.3em] text-white/70 sm:mb-5 sm:text-xs sm:tracking-[0.45em]"
            >
              Three escapes · One journey
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9 }}
              className="font-serif text-[18vw] leading-[0.78] tracking-[-0.07em] sm:text-[16vw] md:text-[11vw]"
            >
              Mongolia
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/75 sm:mt-9 sm:gap-5 sm:text-xs sm:tracking-[0.28em]"
            >
              <span className="h-px w-10 bg-white/60 sm:w-14" /> Stay close to
              the wild
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-7 right-6 z-20 hidden text-[9px] uppercase tracking-[0.3em] text-white/60 md:block">
          Scroll to discover
        </div>
      </section>

      <section className="px-5 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-white/45">
                Our destinations
              </p>
              <h2 className="font-serif text-4xl md:text-6xl">
                Choose your escape.
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-6 text-white/45 md:block">
              Three distinctive stays. One beautifully simple way to experience
              Mongolia.
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
            {destinations.map((d, i) => (
              <SwiperSlide key={d.slug}>
                <Link href={`/destinations/${d.slug}`} className="group block">
                  <article className="relative h-[570px] overflow-hidden rounded-[2px]">
                    <img
                      src={d.image}
                      alt={d.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/15" />
                    {/* <div className="absolute inset-0 flex items-center justify-center px-8">
                      <img
                        src={d.logo}
                        alt={`${d.name} logo`}
                        className="w-[46%] max-w-[240px] object-contain brightness-0 invert drop-shadow-[0_18px_30px_rgba(0,0,0,0.65)]"
                      />
                    </div> */}
                    <div className="absolute left-6 top-6 flex w-[calc(100%-48px)] items-center justify-between">
                      <span className="text-[10px] tracking-[0.35em] text-white/60">
                        {d.logoMark} / {d.region}
                      </span>
                      <span className="rounded-full h-16 w-16 border border-white/35 p-3 flex justify-center text-[9px] uppercase tracking-[0.25em]">
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
                      <h3 className="font-serif text-5xl">{d.name}</h3>
                      <div className="mt-5 flex items-center justify-between gap-5">
                        <p className="max-w-sm text-xs leading-5 text-white/65">
                          {d.description}
                        </p>
                        <span className="shrink-0 text-[10px] uppercase tracking-[0.22em] transition-transform group-hover:translate-x-2">
                          Explore →
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
            A different kind of luxury
          </p>
          <h2 className="font-serif text-5xl leading-none md:text-8xl">
            Space to breathe.
            <br />
            Time to stay.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-white/50">
            Discover remote landscapes, thoughtful hospitality and the quiet
            beauty of Mongolia.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 md:px-12">
        <div className="flex flex-col justify-between gap-4 text-[9px] uppercase tracking-[0.28em] text-white/35 md:flex-row">
          <span>© 2026 hoyorzagal</span>
          <span>Elssen Tasarkhai · Terelj · Terelj </span>
        </div>
      </footer>
    </main>
  );
}

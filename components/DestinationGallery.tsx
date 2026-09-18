"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function DestinationGallery({
  images,
  title,
  slug,
}: {
  images: string[];
  title: string;
  slug: string;
}) {
  return (
    <div className="mt-8">
      <Swiper
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
              <img
                src={image}
                alt={`${title} view ${index + 1}`}
                className="h-[340px] w-full object-cover md:h-[420px]"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const banners = [
  {
    id: 1,
    src: "/banners/banner1.jpeg",
    alt: "Banner 1",
  },
  {
    id: 2,
    src: "/banners/banner2.jpeg",
    alt: "Banner 2",
  },
];

export default function HeroCarousel() {
  return (
    <div className="w-full">
    <Swiper
      spaceBetween={0}
      centeredSlides
      effect="fade"
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      modules={[Autoplay, Pagination, Navigation, EffectFade]}
      className="w-full rounded-[20px] md:rounded-[24px] overflow-hidden"
    >
      {banners.map((b) => (
        <SwiperSlide key={b.id} className="rounded-2xl overflow-hidden">
          <Image
            src={b.src}
            alt={b.alt}
            width={960}
            height={360}
            className="w-full h-auto object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
}

"use client";
import Image from "next/image";

export default function Banner() {
  return (
    <div className="w-full relative rounded-xl overflow-hidden shadow">
      <Image src="/banners/banner1.jpeg" alt="Banner" width={1200} height={400} className="w-full h-auto object-cover" priority />
    </div>
  );
}

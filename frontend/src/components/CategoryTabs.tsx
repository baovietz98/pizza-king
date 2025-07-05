import { MagnifyingGlassIcon, FireIcon, GiftIcon, CakeIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type Tab = { id: string; label: string; icon?: any; iconSrc?: string };

const tabs: Tab[] = [
  { id: "search", label: "Tìm kiếm", icon: MagnifyingGlassIcon },
  { id: "favorite", label: "Bạn Sẽ Thích", icon: FireIcon },
  { id: "combo", label: "Combo", icon: GiftIcon },
  { id: "bogo", label: "Mua 1 Tặng 1", iconSrc: "/icons/BOGO_Gray.webp" },
  { id: "summer", label: "Menu Hè 2025", iconSrc: "/icons/Deals_Gray.webp" },
  { id: "pizza", label: "Pizza", icon: CakeIcon },
  { id: "chicken", label: "Ghiền Gà", iconSrc: "/icons/Chicken_Gray.webp" },
  { id: "starter", label: "Món Khai Vị", iconSrc: "/icons/Starter_Gray.webp" },
  { id: "mybox", label: "My Box", iconSrc: "/icons/Mybox_Gray.webp" },
  { id: "drink", label: "Thức Uống", iconSrc: "/icons/Water_Gray.webp" },
  { id: "spicy", label: "Cay", iconSrc: "/Spicy_icon.svg" },
  { id: "veg", label: "Chay", iconSrc: "/Vegan_icon.svg" },
];

interface Props {
  active: string;
  onChange: (id: string) => void;
}

import { useRef } from "react";
import Image from "next/image";

export default function CategoryTabs({ active, onChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 200;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }
  return (
    <div className="sticky top-[72px] z-40 bg-white shadow-sm overflow-visible">
      <button
        onClick={() => scroll("left")}
        className="hidden"
      >
        <ChevronLeftIcon className="w-6 h-6 text-gray-500" />
      </button>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar gap-6 py-3 px-6"
      >
      {tabs.map((t) => {
                const isActive = active === t.id;
        return (
          <button
            key={t.id}
            className={clsx(
              "group",
              "flex flex-col items-center uppercase tracking-wide min-w-[72px] h-20 px-6 text-sm md:text-base transition-colors hover:text-red-600",
              isActive ? "text-red-600" : "text-gray-500"
            )}
            onClick={() => onChange(t.id)}
          >
            {t.icon ? (
              <t.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <Image src={t.iconSrc!} alt={t.label} width={24} height={24} className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" />
            )}
            <p className={clsx("mt-1 whitespace-nowrap", isActive ? "text-red-600 font-medium" : "text-gray-700 font-normal md:group-hover:font-medium")}>{t.label}</p>
          </button>
        );
      })}
    </div>
      <button
        onClick={() => scroll("right")}
        className="hidden"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-500" />
      </button>
    </div>
  );
}

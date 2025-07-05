import Image from "next/image";

interface Props {
  id: string;
  title: string;
  description?: string;
  price?: number | null;
  image: string;
}

export default function ComboCard({ title, description, price, image }: Props) {
  return (
    <div className="group w-full rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
      {/* Banner image */}
      <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
        <Image src={image} alt={title} fill sizes="100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-base sm:text-lg font-semibold uppercase text-gray-900 line-clamp-2">
          {title}
        </h3>
        {price != null && (
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-500">Chỉ từ</span>
            <span className="text-red-600 font-bold text-sm sm:text-base">
              {new Intl.NumberFormat("vi-VN").format(price)} đ
            </span>
          </div>
        )}
        {description && (
          <p className="text-sm text-gray-700 line-clamp-2 min-h-[40px]">{description}</p>
        )}
      </div>
    </div>
  );
}

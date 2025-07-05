import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

interface Props {
  large?: boolean;
  onClick?: () => void;
  title: string;
  description?: string;
  price?: number | null;
  image: string;
  isNew?: boolean;
}

export default function ProductListItem({ title, description, price, image, isNew, large = false, onClick }: Props) {
  return (
    <div onClick={onClick} className="group cursor-pointer rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition relative w-full flex items-center">
      {/* Product image */}
      <div className={`relative shrink-0 ${large ? 'w-56 h-56 md:w-64 md:h-64' : 'w-28 h-28 md:w-32 md:h-32'} overflow-hidden rounded-2xl`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex-1 px-3 py-2 space-y-1">
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 text-gray-900">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2">
          {isNew && (
            <span className="text-[10px] bg-red-600 text-white px-1 rounded uppercase tracking-wide">
              New
            </span>
          )}
          {price != null && (
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-xs text-gray-700">Chỉ từ</span>
              <span className="text-red-600 font-bold text-sm sm:text-base">
                {new Intl.NumberFormat("vi-VN").format(price)} đ
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Add button */}
      <button
        type="button"
        className={clsx(
          "ml-auto mr-2 p-2 sm:p-3 rounded-full bg-[#c8102e] text-white hover:bg-[#a50d26] focus:outline-none"
        )}
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

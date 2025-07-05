"use client";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/solid";
import { CartItem } from "@/contexts/CartContext";

interface Props {
  item: CartItem;
  onIncrease: () => void;
  onRemove: () => void;
}

export default function CartItemCard({ item, onIncrease, onRemove }: Props) {
  const { image, name, size, crust, quantity, price } = item;
  const formatted = new Intl.NumberFormat("vi-VN").format(price * quantity);

  return (
    <div className="flex gap-2 items-stretch pb-2 md:pb-4 cursor-pointer">
      {/* image */}
      <div className="relative w-[74px] h-[88px] md:w-[82px] md:h-[96px] flex-shrink-0 overflow-hidden">
        <Image src={image} alt={name} fill sizes="80px" className="object-cover" />
      </div>

      {/* info */}
      <div className="flex-1 flex items-start md:items-center justify-between gap-4 overflow-hidden">
        {/* left column */}
        <div className="w-full md:w-[55%] flex flex-col">
          <div className="flex justify-between">
            <h6 className="text-sm md:text-base font-semibold truncate">{name}</h6>
            <span className="md:hidden text-sm font-semibold">{quantity}</span>
          </div>

          {size && <p className="text-sm md:text-base text-gray-500"><span className="hidden md:inline">Cỡ: </span>{size}</p>}
          {crust && <p className="text-sm md:text-base text-gray-500"><span className="hidden md:inline">Đế: </span>{crust}</p>}

          <div className="flex-1" />

          <div className="flex justify-between">
            <button onClick={onIncrease} className="text-red-600 font-medium text-sm md:text-base text-gray-500">Chỉnh sửa</button>
            <span className="md:hidden font-semibold text-sm">{formatted}&nbsp;₫</span>
          </div>
        </div>

        {/* desktop qty */}
        <span className="hidden md:flex w-[10%] items-center justify-center text-base font-medium">{quantity}</span>

        {/* desktop price & remove */}
        <div className="w-[35%] hidden md:flex items-center gap-4 justify-end">
          <span className="font-semibold text-lg">{formatted}&nbsp;₫</span>
          <button onClick={onRemove}><TrashIcon className="h-5 w-5 text-gray-600" /></button>
        </div>
      </div>
    </div>
  );
}
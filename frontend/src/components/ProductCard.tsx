import Image from "next/image";

interface Props {
  title: string;
  price?: number | null;
  image: string;
  isNew?: boolean;
}

export default function ProductCard({ title, price, image, isNew }: Props) {
  return (
    <div className="border rounded-lg w-48 shrink-0 overflow-hidden hover:shadow-md transition">
      <Image src={image} alt={title} width={192} height={192} className="h-32 w-full object-cover" />
      <div className="p-2 flex flex-col gap-1">
        <h3 className="text-sm font-semibold line-clamp-2 min-h-[36px]">{title}</h3>
        {isNew && <span className="text-[10px] bg-red-600 text-white px-1 rounded">New</span>}
        {price != null && (
          <span className="text-red-600 font-bold text-sm">
            {new Intl.NumberFormat("vi-VN").format(price)} đ
          </span>
        )}
      </div>
    </div>
  );
}

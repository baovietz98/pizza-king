import ProductListItem from "./ProductListItem";
import ComboCard from "./ComboCard";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description?: string;
  price?: number | null;
  image: string;
  isNew?: boolean;
}

interface Props {
  id?: string;
  title: string;
  products: Product[];
  onProductClick?: (id: string) => void;
}

export default function ProductListSection({ id, title, products, onProductClick }: Props) {
  return (
    <section id={id} className="mt-8 w-full scroll-mt-[200px]">
      <div className="flex items-center w-full mb-4">
        <span className="flex-1 h-px bg-gray-300"></span>
        <h2 className="text-lg font-semibold uppercase px-3 whitespace-nowrap">{title}</h2>
        <span className="flex-1 h-px bg-gray-300"></span>
      </div>
      {["pizza","combo"].includes(title.toLowerCase()) && (
        <div className="w-full h-24 sm:h-28 md:h-36 lg:h-40 overflow-hidden relative mb-4 rounded-[12px]">
          <Image
            src={title.toLowerCase()==="pizza" ? "https://cdn.pizzahut.vn/images/WEB_V3/CATEGORIES_MenuTool/Pizza%20break._2025031721213884S.webp" : "https://cdn.pizzahut.vn/images/WEB_V3/CATEGORIES_MenuTool/Break%20banner._20250319142629BC6.webp"}
            alt={`${title} Category Banner`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {products.map((p) => (
          title.toLowerCase()==='combo' ? (
            <ComboCard key={p.id} {...p} />
          ) : (
            <ProductListItem key={p.id} {...p} onClick={() => onProductClick?.(p.id)} />
          )
        ))}
      </div>
    </section>
  );
}

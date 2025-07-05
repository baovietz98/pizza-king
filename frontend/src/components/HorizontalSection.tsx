import ProductCard from "./ProductCard";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  isNew?: boolean;
}

interface Props {
  id?: string;
  title: string;
  products: Product[];
}

export default function HorizontalSection({ id, title, products }: Props) {
  return (
    <section id={id} className="mt-8 scroll-mt-[90px]">
      <h2 className="text-lg font-semibold mb-4 uppercase">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}

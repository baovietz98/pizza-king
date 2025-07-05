interface ProductPageProps {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Chi tiết sản phẩm: {params.slug}</h1>
    </div>
  );
}

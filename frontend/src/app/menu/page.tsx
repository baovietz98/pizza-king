import ProductCard from '@/components/products/ProductCard'
import Image from 'next/image'
import { getProducts } from '@/services/api'

// Categories data
const categories = [
  {
    id: 'pizza',
    name: 'Pizza',
    image: 'https://cdn.pizzahut.vn/images/Web_V3/Categories/Pizza.webp'
  },
  {
    id: 'pasta',
    name: 'Mỳ Ý',
    image: 'https://cdn.pizzahut.vn/images/Web_V3/Categories/Pasta.webp'
  },
  {
    id: 'rice',
    name: 'Cơm',
    image: 'https://cdn.pizzahut.vn/images/Web_V3/Categories/Rice.webp'
  },
  {
    id: 'sides',
    name: 'Món phụ',
    image: 'https://cdn.pizzahut.vn/images/Web_V3/Categories/Sides.webp'
  }
]

export default async function MenuPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categories */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Danh mục món ăn</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative h-32 rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Tất cả sản phẩm</h2>
          <div className="flex gap-4">
            <select className="px-4 py-2 border rounded-lg">
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select className="px-4 py-2 border rounded-lg">
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
} 
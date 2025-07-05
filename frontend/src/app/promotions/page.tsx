import Image from 'next/image'
import Link from 'next/link'

// Temporary sample data
const promotions = [
  {
    id: '1',
    title: 'Mua 1 tặng 1 - Thứ 2 đến thứ 6',
    description: 'Áp dụng cho tất cả các loại pizza size lớn khi đặt hàng online',
    image: 'https://cdn.pizzahut.vn/images/Web_V3/Homepage/OLO%20NHIỆT%20HÈ%20-%20VN_XJRJY_300620251118.webp',
    validUntil: '2024-12-31'
  },
  {
    id: '2',
    title: 'Combo tiết kiệm - Chỉ từ 99K',
    description: '1 Pizza size vừa + 1 nước ngọt, áp dụng cho đơn hàng từ 200K',
    image: 'https://cdn.pizzahut.vn/images/Web_V3/Homepage/Hometop-des_ECV50_130620250948.webp',
    validUntil: '2024-12-31'
  }
]

export default function PromotionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Khuyến mãi đang diễn ra</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-48 md:h-64">
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{promo.title}</h2>
              <p className="text-gray-600 mb-4">{promo.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Có hiệu lực đến: {new Date(promo.validUntil).toLocaleDateString('vi-VN')}
                </span>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 bg-[#d6232a] text-white px-4 py-2 rounded-full font-medium hover:bg-[#b91d23] transition-colors"
                >
                  Đặt ngay
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
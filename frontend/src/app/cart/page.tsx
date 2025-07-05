"use client";
import { useCart } from "@/contexts/CartContext";
import CartItemCard from "@/components/CartItemCard";
import Link from "next/link";

export default function CartPage() {
  const { items, increase, remove } = useCart();

  const totalQty = items.reduce((t, i) => t + i.quantity, 0);
  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <Link href="/" className="text-[#e31837] font-medium hover:underline">
          Tiếp tục mua sắm →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:flex lg:gap-10">
      {/* Danh sách sản phẩm */}
      <section className="flex-1">
        <h2 className="text-xl font-bold mb-4">
          Sản phẩm đã chọn ({totalQty})
        </h2>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id}>
              <CartItemCard
                item={item}
                onIncrease={() => increase(item.id)}
                onRemove={() => remove(item.id)}
              />
            </li>
          ))}
        </ul>
        <Link href="/" className="block mt-4 text-sm text-[#e31837] hover:underline">
          ← Tiếp tục mua sắm
        </Link>
      </section>

      {/* Tóm tắt đơn */}
      <aside className="w-full max-w-sm mt-10 lg:mt-0">
        <div className="bg-gray-50 rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-medium">Tóm tắt đơn hàng</h3>
          <div className="flex justify-between text-sm">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí vận chuyển</span>
            <span>{shipping.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString()} đ</span>
          </div>
          <button className="w-full bg-[#e31837] text-white py-3 rounded-md hover:bg-[#c8102e]">
            Tiến hành thanh toán
          </button>
        </div>
      </aside>
    </div>
  );
}
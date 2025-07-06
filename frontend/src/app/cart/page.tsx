"use client";
import { useState } from "react";
import { useCart, CartItem } from "@/contexts/CartContext";
import ProductModal from "@/components/ProductModal";
import CartItemCard from "@/components/CartItemCard";
import Link from "next/link";

export default function CartPage() {
  const { items, remove } = useCart();
  const [editing, setEditing] = useState<CartItem | null>(null);

  const totalQty = items.reduce((t, i) => t + i.quantity, 0);
  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <Link href="/" className="text-[#c8102e] font-medium hover:underline">
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
                                onEdit={() => setEditing(item)}
                onRemove={() => remove(item.id)}
              />
            </li>
          ))}
        </ul>
        <Link href="/" className="block mt-4 text-sm text-[#c8102e] hover:underline">
          ← Tiếp tục mua sắm
        </Link>
      </section>

      {/* Tóm tắt đơn */}
      <aside className="w-full flex flex-col md:w-1/3 md:gap-6 gap-2 max-h-fit md:sticky md:top-[80px]">
        {/* Voucher card */}
        <div className="md:border md:rounded-2xl p-4 md:p-6 bg-white cursor-pointer">
          <div className="flex items-center justify-between bg-white">
            <p className="text-base md:text-xl font-semibold">Voucher</p>
            <div className="flex-1 text-right flex items-center justify-end">
              <p className="md:hidden text-sm inline text-primary">Nhập hoặc chọn voucher của bạn</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="inline"><path fill="#637381" d="M8.822 19.116a.7.7 0 0 1-.45-.169.63.63 0 0 1 0-.9L14.278 12 8.372 5.981a.63.63 0 0 1 0-.9.63.63 0 0 1 .9 0l6.356 6.47a.63.63 0 0 1 0 .9l-6.356 6.468a.66.66 0 0 1-.45.197"/></svg>
            </div>
          </div>
          <p className="hidden md:block mt-6 text-primary">Nhập hoặc chọn voucher của bạn</p>
        </div>

        {/* Utensil card (Muỗng nĩa nhựa) */}
        <div className="md:border md:rounded-2xl p-4 md:p-6 bg-white cursor-pointer">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Muỗng nĩa nhựa</p>
            <div className="flex gap-2 text-sm">
              <p>Không</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="#637381" d="M8.822 19.116a.7.7 0 0 1-.45-.169.63.63 0 0 1 0-.9L14.278 12 8.372 5.981a.63.63 0 0 1 0-.9.63.63 0 0 1 .9 0l6.356 6.47a.63.63 0 0 1 0 .9l-6.356 6.468a.66.66 0 0 1-.45.197"/></svg>
            </div>
          </div>
        </div>

        {/* Order summary card */}
        <div className="md:border md:rounded-2xl p-4 md:p-6 bg-white space-y-4">
          <h3 className="text-lg md:text-xl font-semibold">Tóm tắt đơn hàng</h3>
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
          <button className="w-full bg-[#c8102e] text-white py-3 rounded-md hover:bg-[#c8102e]">
            Tiến hành thanh toán
          </button>
        </div>
      </aside>
    {editing && (
        <ProductModal
          id={editing.productId}
          open={!!editing}
          onClose={() => setEditing(null)}
          apiBase={process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api"}
          cartItemId={editing.id}
          initialSize={editing.size}
          initialCrust={editing.crust}
          initialQuantity={editing.quantity}
        />
      )}
    </div>
  );
}
"use client";
import { useState } from "react";
import { useCart, CartItem } from "@/contexts/CartContext";
import ProductModal from "@/components/ProductModal";
import CartItemCard from "@/components/CartItemCard";
import Link from "next/link";

export default function CartPage() {
  const { items, remove } = useCart();
  const [editing, setEditing] = useState<CartItem | null>(null);
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  const totalQty = items.reduce((t, i) => t + i.quantity, 0);
  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  const handleApplyVoucher = () => {
    if (voucherCode.trim()) {
      // TODO: Apply voucher logic here
      console.log('Applying voucher:', voucherCode);
      setShowVoucherPopup(false);
    }
  };

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
        <div 
          className="md:border md:rounded-2xl p-4 md:p-6 bg-white cursor-pointer"
          onClick={() => setShowVoucherPopup(true)}
        >
          <div className="flex items-center justify-between bg-white">
            <p className="text-base md:text-xl font-semibold">Voucher</p>
            <div className="flex-1 text-right flex items-center justify-end">
              <p className="md:hidden text-sm inline text-primary">Nhập hoặc chọn voucher của bạn</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="inline"><path fill="#637381" d="M8.822 19.116a.7.7 0 0 1-.45-.169.63.63 0 0 1 0-.9L14.278 12 8.372 5.981a.63.63 0 0 1 0-.9.63.63 0 0 1 .9 0l6.356 6.47a.63.63 0 0 1 0 .9l-6.356 6.468a.66.66 0 0 1-.45.197"/></svg>
            </div>
          </div>
          <p 
            className="hidden md:block mt-6 text-primary"
            onClick={() => setShowVoucherPopup(true)}
          >
            Nhập hoặc chọn voucher của bạn
          </p>
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
          <Link href="/checkout" className="w-full bg-[#c8102e] text-white py-3 rounded-md hover:bg-[#c8102e] block text-center">
            Tiến hành thanh toán
          </Link>
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

      {/* Voucher Popup */}
      {showVoucherPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVoucherPopup(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowVoucherPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                <path 
                  fill="currentColor" 
                  d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                />
              </svg>
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold text-center mb-6 pr-8">MÃ KHUYẾN MÃI</h2>

            {/* Input section */}
            <div className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá của bạn"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c8102e] text-base"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Or select section */}
            <div className="mb-6">
              <p className="text-gray-600 text-center mb-4">Hoặc chọn mã giảm giá của bạn</p>
              
              {/* Available vouchers area */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none">
                    <path 
                      fill="#9CA3AF" 
                      d="M16 2.667C8.64 2.667 2.667 8.64 2.667 16S8.64 29.333 16 29.333 29.333 23.36 29.333 16 23.36 2.667 16 2.667zM16 26.667C10.12 26.667 5.333 21.88 5.333 16S10.12 5.333 16 5.333 26.667 10.12 26.667 16 21.88 26.667 16 26.667z"
                    />
                    <path 
                      fill="#9CA3AF" 
                      d="M16 10.667c-.737 0-1.333.596-1.333 1.333v8c0 .737.596 1.333 1.333 1.333s1.333-.596 1.333-1.333v-8c0-.737-.596-1.333-1.333-1.333zM16 24c-.737 0-1.333.596-1.333 1.333S15.263 26.667 16 26.667s1.333-.596 1.333-1.333S16.737 24 16 24z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium mb-2">Chưa có mã giảm giá</p>
                <p className="text-gray-400 text-sm">
                  Thêm mã giảm giá có sẵn vào tài khoản với phía trên
                </p>
              </div>
            </div>

            {/* Done button */}
            <button
              onClick={() => setShowVoucherPopup(false)}
              className="w-full py-3 bg-[#c8102e] text-white rounded-lg font-medium hover:bg-[#a00e28] transition-colors"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface SizeOption { name: string; price: number; }
interface CrustOption { name: string; price: number; }
interface ProductDetail {
  _id: string;
  name: string;
  description?: string;
  image: string;
  sizes?: SizeOption[];
  availableCrusts?: string[];
}

interface Props {
  id: string | null;
  open: boolean;
  onClose: () => void;
  apiBase: string;
}

export default function ProductModal({ id, open, onClose, apiBase }: Props) {
  const { addItem } = useCart();
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedCrust, setSelectedCrust] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (!open || !id) return;
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`${apiBase}/products/${id}`);
        const data = await res.json();
        const detailData = data.data || data;
        setDetail(detailData);
        setSelectedSize(detailData.sizes?.[0] ?? null);
        setSelectedCrust(detailData.availableCrusts?.[0] ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [open, id, apiBase]);

  const totalPrice = selectedSize ? selectedSize.price * quantity : 0;

  const handleAddToCart = async () => {
    if (!detail || !selectedSize) return;
    
    const item = {
      productId: detail._id, 
      name: detail.name,
      price: selectedSize.price,
      size: selectedSize.name,
      crust: selectedCrust || undefined,
      quantity,
      image: detail.image,
    };
    
    console.log('Attempting to add item to cart:', item);
    
    try {
      setIsAddingToCart(true);
      setError(null);
      await addItem(item);
      console.log('Successfully added item to cart');
      onClose();
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      
      // More specific error messages based on the error type
      let errorMessage = 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.';
      
      if (err.message.includes('NetworkError')) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
      } else if (err.message.includes('401') || err.message.includes('403')) {
        errorMessage = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.';
      } else if (err.message.includes('404')) {
        errorMessage = 'Sản phẩm không tồn tại hoặc đã bị xóa.';
      } else if (err.message.includes('500')) {
        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
      }
      
      setError(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-lg max-w-4xl w-full mx-4 md:mx-0 flex flex-col md:flex-row overflow-hidden animate-fade-in md:h-[650px]">
        {/* Close */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Image left (desktop) */}
        {detail && (
          <div className="hidden md:block md:w-1/2 relative h-full flex-shrink-0">
            {/* Show only half image by centering */}
            <Image src={detail.image} alt={detail.name} fill className="object-contain" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[90vh]">
          {loading && <p className="text-center text-sm text-[#c8102e] py-10">Đang tải...</p>}
          {detail && (
            <>
              {/* Mobile image */}
              <div className="block md:hidden w-full relative h-60 mb-4">
                <Image src={detail.image} alt={detail.name} fill className="object-contain" />
              </div>
              <h2 className="text-xl font-bold mb-1">{detail.name}</h2>
              {detail.description && <p className="text-sm text-gray-700 mb-4">{detail.description}</p>}

              {/* Sizes */}
              {detail.sizes && detail.sizes.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold mb-2">Kích thước</p>
                  <div className="flex gap-3">
                    {detail.sizes.map((s) => (
                      <button
                        key={s.name}
                        onClick={() => setSelectedSize(s)}
                        className={`cursor-pointer px-4 py-2 border rounded-lg text-sm transition ${
                          selectedSize?.name === s.name ? "bg-[#c8102e] text-white border-[#c8102e]" : "hover:border-[#c8102e]"
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Crusts */}
              {detail.availableCrusts && detail.availableCrusts.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Đế bánh</p>
                  <div className="space-y-2">
                    {detail.availableCrusts.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCrust(c)}
                        className="w-full flex items-center justify-between my-2 cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 border-2 rounded-full ${selectedCrust===c ? 'border-[#c8102e]' : 'border-gray-300'}`}>
                            {selectedCrust===c && <div className="w-full h-full rounded-full bg-[#c8102e]"></div>}
                          </div>
                          <span className={`ml-2 text-sm md:text-base font-medium ${selectedCrust===c ? 'text-gray-900' : 'text-gray-700'}`}>{c}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Quantity & add to cart */}
              <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    className="w-10 h-10 flex items-center justify-center text-[#c8102e] hover:bg-[#c8102e]/10 transition"
                    disabled={quantity === 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button
                    className="w-10 h-10 flex items-center justify-center text-[#c8102e] hover:bg-[#c8102e]/10 transition"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={!selectedSize || isAddingToCart}
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#c8102e] disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#a50d26] transition"
                >
                  {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                  <span>{new Intl.NumberFormat("vi-VN").format(totalPrice)} đ</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

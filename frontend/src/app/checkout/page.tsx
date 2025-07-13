"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Payment method types
const PAYMENT_METHODS = [
  {
    id: 'COD',
    name: 'Tiền mặt',
    icon: '/icons/cash.png',
    description: ''
  },
  {
    id: 'ZALOPAY',
    name: 'ZaloPay',
    icon: '/icons/zalopay.png',
    description: ''
  },
  {
    id: 'MOMO',
    name: 'Momo',
    icon: '/icons/momo.png',
    description: ''
  },
  {
    id: 'ONEPAY',
    name: 'ATM/VISA',
    icon: '/icons/visa.png',
    description: ''
  },
  {
    id: 'VNPAY',
    name: 'VNPAY',
    icon: '/icons/vnpay.png',
    description: 'Nhập VNPAYPH2, Giảm 10,000 cho đơn từ 299,000'
  }
];

export default function CheckoutPage() {
  const { items } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Form states
  const [orderType] = useState('takeaway'); // 'takeaway' | 'delivery'
  const [note, setNote] = useState('');
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.name || '',
    phoneNumber: user?.phone || '',
    email: user?.email || ''
  });

  // Update customer info when user changes
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        fullName: user.name || '',
        phoneNumber: user.phone || prev.phoneNumber, // Keep existing if user has no phone
        email: user.email || ''
      }));
    }
  }, [user]);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Calculate totals
  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const memberDiscount = 0; // TODO: Calculate member discount
  const shippingFee = orderType === 'delivery' ? 30000 : 0;
  const total = subtotal - memberDiscount + shippingFee;
  const rewardPoints = Math.floor(total / 10000); // 1 point per 10,000 VND

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim()) {
      // TODO: Apply voucher logic here
      console.log('Applying voucher:', voucherCode);
      setShowVoucherPopup(false);
    }
  };

  const handleSubmit = async () => {
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với các điều khoản và điều kiện');
      return;
    }

    if (!user && (!customerInfo.fullName || !customerInfo.phoneNumber || !customerInfo.email)) {
      alert('Vui lòng điền đầy đủ thông tin khách hàng');
      return;
    }

    // TODO: Submit order
    console.log('Submitting order...', {
      orderType,
      note,
      paymentMethod,
      customerInfo,
      items,
      total
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8102e] mx-auto"></div>
          <p className="mt-4 text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

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
    <>
      {/* Main Container with Navigation and Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        
        {/* Navigation Bar */}
        <div className="bg-white border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-[#c8102e] transition-colors font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none">
                <path fill="currentColor" d="M15.75 8.381H3.74l4.782-4.865a.63.63 0 0 0 0-.9.63.63 0 0 0-.9 0L1.8 8.522a.63.63 0 0 0 0 .9l5.822 5.906a.66.66 0 0 0 .45.197.7.7 0 0 0 .45-.169.63.63 0 0 0 0-.9l-4.753-4.81H15.75a.624.624 0 0 0 .619-.618.63.63 0 0 0-.619-.647"></path>
              </svg>
              Quay lại
            </button>
            <div className="flex-1 text-center">
              <h4 className="text-lg font-semibold text-gray-800">Thanh toán</h4>
            </div>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Checkout Content */}
        {/* Checkout Content */}
        <div className="lg:flex lg:gap-10">
        {/* Left side - 3 cards */}
        <section className="flex-1">
          <div className="space-y-6">
            
            {/* Card 1: Order Type & Store Info */}
            <div className="border rounded-2xl p-6 bg-white">
              <div className="flex items-center justify-between pb-6 cursor-pointer">
                <h6 className="text-base md:text-xl font-semibold">Mua mang về tại</h6>
                <div className="flex-1 text-right">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="inline">
                    <path fill="#637381" d="M8.822 19.116a.7.7 0 0 1-.45-.169.63.63 0 0 1 0-.9L14.278 12 8.372 5.981a.63.63 0 0 1 0-.9.63.63 0 0 1 .9 0l6.356 6.47a.63.63 0 0 1 0 .9l-6.356 6.468a.66.66 0 0 1-.45.197"/>
                  </svg>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <p className="text-lg font-medium">Pizza Hut Parc Mall</p>
                <p className="text-lg font-normal">L4 - 12B, tầng 4 khối đế, Trung tâm thương mại Parc Mall, số 547 - 549 đường Tạ Quang Bửu, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam</p>
                
                {/* Note section */}
                <div className="mt-4">
                  <div className="flex flex-row items-center justify-between mb-2">
                    <p className="text-sm font-medium text-black select-none text-left">Ghi chú</p>
                    <p className="text-sm text-gray-500 font-medium select-none">{note.length}/200</p>
                  </div>
                  <div className="min-h-12 flex flex-col justify-center relative">
                    <input
                      placeholder="Ghi chú cho giao hàng, ví dụ: tầng, phòng..."
                      maxLength={200}
                      className="py-3 pr-4 pl-5 block w-full rounded-md text-base font-normal border border-gray-300 hover:border-[#c8102e] focus:border-gray-600 focus:border-[1px] focus:ring-0 disabled:text-gray-500 disabled:bg-gray-50 disabled:border-gray-50"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>

                {/* Pickup time */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-black select-none text-left">Thời gian nhận</label>
                  <button
                    type="button"
                    className="py-3 px-6 inline-flex items-center justify-center rounded-lg gap-2 bg-transparent border border-gray-300 w-full pl-5 pr-4 text-black hover:bg-white"
                  >
                    <span className="inline text-base text-left w-full font-normal">Ngay lập tức</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                      <path fill="#637381" stroke="#637381" d="m2.296 5.154.005.004 5.35 5.225.35.343.35-.345 5.35-5.275.002-.002c.019-.019.036-.023.047-.023s.028.004.046.023l.352-.352-.352.352c.019.018.023.035.023.046s-.004.027-.022.046L8.05 10.843l-.003.004a.4.4 0 0 1-.06.052l-.017-.004a.2.2 0 0 1-.04-.023L2.203 5.246c-.018-.019-.022-.035-.022-.046s.004-.028.022-.046c.019-.019.036-.023.047-.023s.028.004.046.023Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Customer Information */}
            <div className="border rounded-2xl p-6 bg-white">
              <div className="flex items-center justify-between pb-6">
                <h6 className="text-base md:text-xl font-semibold">Người đặt hàng</h6>
                {user && (
                  <span className="text-sm text-green-600 font-medium">✓ Đã đăng nhập</span>
                )}
              </div>
              
              <div className="flex flex-col gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2 text-black select-none text-left">
                    Họ và tên
                  </label>
                  <div className="min-h-12 flex flex-col justify-center relative">
                    <input
                      id="fullName"
                      placeholder="Nhập đầy đủ họ tên của bạn"
                      autoComplete="name"
                      className="py-3 pr-4 pl-5 block w-full rounded-md text-base font-normal border border-gray-300 hover:border-[#c8102e] focus:border-gray-600 focus:border-[1px] focus:ring-0 disabled:text-gray-500 disabled:bg-gray-50 disabled:border-gray-50"
                      type="text"
                      value={customerInfo.fullName}
                      onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                      disabled={!!user}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2 text-black select-none text-left">
                    Số điện thoại
                  </label>
                  <div className="min-h-12 flex flex-col justify-center relative">
                    <input
                      id="phoneNumber"
                      maxLength={13}
                      placeholder="Nhập số điện thoại của bạn"
                      inputMode="tel"
                      autoComplete="tel"
                      className="py-3 pr-4 pl-5 block w-full rounded-md text-base font-normal border border-gray-300 hover:border-[#c8102e] focus:border-gray-600 focus:border-[1px] focus:ring-0 disabled:text-gray-500 disabled:bg-gray-50 disabled:border-gray-50"
                      type="tel"
                      value={customerInfo.phoneNumber}
                      onChange={(e) => handleCustomerInfoChange('phoneNumber', e.target.value)}
                    />
                  </div>
                  {user && user.phone && (
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Bạn có thể thay đổi số điện thoại cho đơn hàng này
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-black select-none text-left">
                    Email
                  </label>
                  <div className="min-h-12 flex flex-col justify-center relative">
                    <input
                      id="email"
                      placeholder="Nhập email của bạn"
                      inputMode="email"
                      autoComplete="email"
                      className="py-3 pr-4 pl-5 block w-full rounded-md text-base font-normal border border-gray-300 hover:border-[#c8102e] focus:border-gray-600 focus:border-[1px] focus:ring-0 disabled:text-gray-500 disabled:bg-gray-50 disabled:border-gray-50"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                      disabled={!!user}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Payment Method */}
            <div className="border rounded-2xl p-6 bg-white">
              <div className="flex items-center justify-between pb-6">
                <h6 className="text-base md:text-xl font-semibold">Phương thức thanh toán</h6>
              </div>

              {/* Payment methods */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col w-full">
                  <div className="flex gap-6 flex-col">
                    {PAYMENT_METHODS.map((method, index) => (
                      <div key={method.id} className="flex flex-col">
                        <div
                          tabIndex={index}
                          className="flex gap-2 cursor-pointer"
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" className="text-[#c8102e]">
                            <circle
                              cx="10"
                              cy="10"
                              r="9.5"
                              fill={paymentMethod === method.id ? "#F1F4FF" : "#fff"}
                              stroke={paymentMethod === method.id ? "currentColor" : "#DFE4EA"}
                            />
                            {paymentMethod === method.id && (
                              <circle cx="10" cy="10" r="5" fill="currentColor" />
                            )}
                          </svg>
                          <label htmlFor={method.id} className="text-sm select-none cursor-pointer">
                            <div className="flex items-center gap-4 ml-2">
                              <div className="w-9 h-9 bg-gray-100 rounded flex items-center justify-center">
                                {method.id === 'COD' && <span className="text-xs font-bold">💵</span>}
                                {method.id === 'ZALOPAY' && <span className="text-xs font-bold text-blue-600">Z</span>}
                                {method.id === 'MOMO' && <span className="text-xs font-bold text-pink-600">M</span>}
                                {method.id === 'ONEPAY' && <span className="text-xs font-bold text-green-600">💳</span>}
                                {method.id === 'VNPAY' && <span className="text-xs font-bold text-blue-800">V</span>}
                              </div>
                              <p>{method.name}</p>
                            </div>
                          </label>
                        </div>
                        {method.description && paymentMethod === method.id && (
                          <div className="flex ml-6">
                            <p className="text-sm text-gray-500 line-clamp-2">{method.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-6 max-h-fit lg:sticky lg:top-4 mt-6 lg:mt-0">
          
          {/* Voucher Card */}
          <div className="border rounded-2xl p-6 bg-white">
            <div 
              className="flex items-center justify-between pb-6 cursor-pointer"
              onClick={() => setShowVoucherPopup(true)}
            >
              <h6 className="text-base md:text-xl font-semibold">Voucher</h6>
              <div className="flex-1 text-right">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="inline">
                  <path fill="#637381" d="M8.822 19.116a.7.7 0 0 1-.45-.169.63.63 0 0 1 0-.9L14.278 12 8.372 5.981a.63.63 0 0 1 0-.9.63.63 0 0 1 .9 0l6.356 6.47a.63.63 0 0 1 0 .9l-6.356 6.468a.66.66 0 0 1-.45.197"/>
                </svg>
              </div>
            </div>
            <p 
              className="text-[#c8102e] cursor-pointer"
              onClick={() => setShowVoucherPopup(true)}
            >
              Nhập hoặc chọn voucher của bạn
            </p>
          </div>

          {/* Cart Summary */}
          <div className="border rounded-2xl p-6 bg-white">
            <div>
              <Link href="/cart" className="flex items-center justify-between">
                <h6 className="text-base md:text-xl font-semibold w-full">Giỏ hàng của tôi</h6>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                  <path fill="#637381" d="M8.822 19.116a.7.7 0 0 1-.45-.169.63.63 0 0 1 0-.9L14.278 12 8.372 5.981a.63.63 0 0 1 0-.9.63.63 0 0 1 .9 0l6.356 6.47a.63.63 0 0 1 0 .9l-6.356 6.468a.66.66 0 0 1-.45.197"/>
                </svg>
              </Link>
              <p>Có {items.length} sản phẩm trong giỏ hàng của bạn</p>
              
              <div className="w-full h-[1px] bg-gray-200 my-2"></div>
              
              <div className="pb-2">
                {/* Subtotal */}
                <div className="w-full flex justify-between items-center py-2">
                  <div className="w-full flex items-center gap-1">
                    <p>Tạm tính</p>
                  </div>
                  <p className="text-sm font-medium md:text-base md:font-semibold">
                    {subtotal.toLocaleString()}&nbsp;₫
                  </p>
                </div>

                {/* Member discount */}
                <div className="w-full flex justify-between items-center py-2">
                  <div className="w-full flex items-center gap-1">
                    <p>Giảm giá thành viên</p>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" className="cursor-pointer">
                        <path fill="#374151" fillRule="evenodd" d="M11 2.875s1.653 0 3.163.639c0 0 1.458.617 2.582 1.74 0 0 1.124 1.125 1.741 2.583 0 0 .639 1.51.639 3.163 0 0 0 1.653-.639 3.163 0 0-.617 1.458-1.74 2.582 0 0-1.125 1.124-2.583 1.741 0 0-1.51.639-3.163.639 0 0-1.653 0-3.163-.639 0 0-1.458-.617-2.582-1.74 0 0-1.124-1.125-1.741-2.583 0 0-.639-1.51-.639-3.163 0 0 0-1.653.639-3.163 0 0 .617-1.458 1.74-2.582 0 0 1.125-1.124 2.583-1.741 0 0 1.51-.639 3.163-.639m0 1.25s-1.4 0-2.676.54c0 0-1.234.522-2.185 1.474 0 0-.952.951-1.474 2.185 0 0-.54 1.277-.54 2.676 0 0 0 1.4.54 2.676 0 0 .522 1.233 1.474 2.185 0 0 .951.952 2.185 1.474 0 0 1.277.54 2.676.54 0 0 1.4 0 2.676-.54 0 0 1.233-.522 2.185-1.474 0 0 .952-.952 1.474-2.185 0 0 .54-1.277.54-2.676 0 0 0-1.4-.54-2.676 0 0-.522-1.234-1.474-2.185 0 0-.952-.952-2.185-1.474 0 0-1.277-.54-2.676-.54" clipRule="evenodd"/>
                        <path fill="#374151" d="M11 15.375h.625a.625.625 0 1 0 0-1.25v-3.75A.625.625 0 0 0 11 9.75h-.625a.625.625 0 1 0 0 1.25v3.75c0 .345.28.625.625.625M11.781 7.563a.937.937 0 1 1-1.875 0 .937.937 0 0 1 1.875 0"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium md:text-base md:font-semibold text-green-600">
                    {memberDiscount.toLocaleString()}&nbsp;₫
                  </p>
                </div>

                {/* Shipping fee */}
                <div className="w-full flex justify-between items-center py-2">
                  <div className="w-full flex items-center gap-1">
                    <p>Phí giao hàng</p>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" className="cursor-pointer">
                        <path fill="#374151" fillRule="evenodd" d="M11 2.875s1.653 0 3.163.639c0 0 1.458.617 2.582 1.74 0 0 1.124 1.125 1.741 2.583 0 0 .639 1.51.639 3.163 0 0 0 1.653-.639 3.163 0 0-.617 1.458-1.74 2.582 0 0-1.125 1.124-2.583 1.741 0 0-1.51.639-3.163.639 0 0-1.653 0-3.163-.639 0 0-1.458-.617-2.582-1.74 0 0-1.124-1.125-1.741-2.583 0 0-.639-1.51-.639-3.163 0 0 0-1.653.639-3.163 0 0 .617-1.458 1.74-2.582 0 0 1.125-1.124 2.583-1.741 0 0 1.51-.639 3.163-.639m0 1.25s-1.4 0-2.676.54c0 0-1.234.522-2.185 1.474 0 0-.952.951-1.474 2.185 0 0-.54 1.277-.54 2.676 0 0 0 1.4.54 2.676 0 0 .522 1.233 1.474 2.185 0 0 .951.952 2.185 1.474 0 0 1.277.54 2.676.54 0 0 1.4 0 2.676-.54 0 0 1.233-.522 2.185-1.474 0 0 .952-.952 1.474-2.185 0 0 .54-1.277.54-2.676 0 0 0-1.4-.54-2.676 0 0-.522-1.234-1.474-2.185 0 0-.952-.952-2.185-1.474 0 0-1.277-.54-2.676-.54" clipRule="evenodd"/>
                        <path fill="#374151" d="M11 15.375h.625a.625.625 0 1 0 0-1.25v-3.75A.625.625 0 0 0 11 9.75h-.625a.625.625 0 1 0 0 1.25v3.75c0 .345.28.625.625.625M11.781 7.563a.937.937 0 1 1-1.875 0 .937.937 0 0 1 1.875 0"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium md:text-base md:font-semibold">
                    {shippingFee.toLocaleString()}&nbsp;₫
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t flex items-end justify-between text-right">
                <p className="text-nowrap">Tổng cộng</p>
                <div>
                  <p className="text-lg font-semibold md:text-3xl md:font-bold">
                    {total.toLocaleString()}&nbsp;₫
                  </p>
                </div>
              </div>

              {/* Reward points */}
              <div className="text-gray-500 font-normal md:text-base text-right flex gap-1 items-center justify-end">
                <p>Nhận</p>
                <p className="font-medium md:font-semibold text-black">{rewardPoints} điểm</p>
                <p>Hut rewards</p>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="border rounded-2xl p-6 bg-white">
            <div className="flex flex-col">
              <div className="flex flex-row items-stretch">
                <input
                  id="agreeTerm"
                  className="cursor-pointer shrink-0 mt-1 border-gray-300 rounded text-[#c8102e] focus:ring-offset-0 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <label htmlFor="agreeTerm" className="text-base text-black ms-2 select-none cursor-pointer">
                  <a className="text-[#c8102e] underline" href="/info?TNC">
                    Tôi đồng ý với các điều khoản và điều kiện
                  </a>
                </label>
              </div>
            </div>
          </div>

          {/* Order button */}
          <div className="bg-white">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!agreeTerms || (!user && (!customerInfo.fullName || !customerInfo.phoneNumber || !customerInfo.email))}
              className="py-3 px-6 inline-flex items-center justify-center rounded-lg gap-2 bg-[#c8102e] border border-transparent text-white disabled:bg-gray-300 disabled:pointer-events-none w-full"
            >
              <span className="inline text-center text-base font-medium">Đặt hàng</span>
            </button>
          </div>
          
        </aside>
        </div>
      </div>

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
    </>
  );
}
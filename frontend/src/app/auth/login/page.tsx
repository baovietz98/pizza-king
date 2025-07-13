"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/lib/authApi";

export default function LoginPage() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const { setUserFromLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await login({ email, password });
      
      // Cập nhật user state trong AuthContext
      if (response.user) {
        setUserFromLogin({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role
        });
      }
      
      // Hiển thị thông báo nếu đã merge cart
      if (response.cartMerged) {
        setSuccessMessage("Đăng nhập thành công! Giỏ hàng của bạn đã được cập nhật.");
      }
      
      await refreshCart(); // Refresh cart để lấy dữ liệu mới
      
      // Chuyển hướng sau 1 giây nếu có thông báo merge cart
      if (response.cartMerged) {
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
      router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col items-center">
      {/* Header red block */}
      <div className="w-full pt-6 pb-14 bg-primary flex flex-col items-center relative md:max-w-[512px] md:rounded-2xl">
        <img src="/logopizzaking.png" alt="PizzaKing" className="w-20 h-auto" />
        <p className="text-sm text-white mt-6">Đăng nhập để mở khóa</p>
        <p className="text-lg text-white font-semibold">lợi ích tuyệt vời</p>
        <div className="flex flex-row justify-between w-full px-4 mt-6 text-white">
          <Feature text1="Tận hưởng" text2="Vô vàn ưu đãi" icon="gift" />
          <Feature text1="Tích luỹ" text2="Hut rewards" icon="star" />
          <Feature text1="Dễ dàng" text2="Đặt món" icon="bag" />
        </div>
      </div>

      {/* Form */}
      <div className="w-full px-4 md:max-w-[512px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white border shadow-[0_10px_15px_0_rgba(5,13,29,0.18)] px-4 py-6 gap-4 rounded-2xl -mt-8 md:mt-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Email</label>
            <input
              type="email"
              required
              placeholder="Vui lòng nhập email của bạn"
              className="py-3 px-5 block w-full rounded-md text-base border border-stroke focus:border-secondary focus:ring-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                placeholder="Vui lòng nhập mật khẩu của bạn"
                className="py-3 pl-5 pr-10 block w-full rounded-md text-base border border-stroke focus:border-secondary focus:ring-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-secondary"
              >
                {showPass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238 9.598 7.477A3 3 0 0 0 8.5 5a3 3 0 0 0-.977 5.836l-1.71 1.71A7.646 7.646 0 0 1 .82 8a7.646 7.646 0 0 1 12.54-1.992l1.06 1.06a.75.75 0 1 0 1.06-1.06l-1.06-1.06C12.287 2.832 10.21 2 8 2 3.945 2 .223 4.944.077 4.992a.75.75 0 0 0 0 1.016C.223 6.056 3.945 9 8 9c1.81 0 3.512-.5 5.026-1.3l1.09 1.09a.75.75 0 0 0 1.06-1.06l-1.09-1.09a7.648 7.648 0 0 1 .273 1.36 7.646 7.646 0 0 1-1.55 3.238z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 3a5 5 0 0 0-4.546 2.916.5.5 0 0 1-.908-.418A6 6 0 1 1 14 8a.5.5 0 0 1-1 0A5 5 0 0 0 8 3z" />
                    <path d="M8 1a7 7 0 0 1 6.468 4.132.5.5 0 0 1-.936.352A6 6 0 1 0 .468 5.482a.5.5 0 0 1-.936-.352A7 7 0 0 1 8 1z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

          <div className="text-right">
            <a href="/forgot-password" className="text-primary underline text-sm">Quên mật khẩu</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 flex items-center justify-center rounded-lg bg-primary text-white disabled:bg-stroke"
          >
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>

          <p className="text-center text-sm">
            Bạn chưa có tài khoản? <a href="/auth/register" className="text-primary underline">Tạo tài khoản</a>
          </p>
        </form>
      </div>
    </div>
  );
}

function Feature({ text1, text2, icon }: { text1: string; text2: string; icon: string }) {
  return (
    <div className="flex flex-col items-center text-white text-xs">
      {/* Placeholder icon; use appropriate icons if available */}
      <span className="mb-1">🎁</span>
      <p className="leading-4 font-light">{text1}</p>
      <span className="font-medium leading-4">{text2}</span>
    </div>
  );
}

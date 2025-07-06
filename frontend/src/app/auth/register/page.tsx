"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { setUserFromLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    // Validate
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      // Đăng ký thành công, chuyển đến trang đăng nhập
      router.push("/auth/login?message=Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="w-full h-full bg-white flex flex-col items-center">
      {/* Header red block */}
      <div className="w-full pt-6 pb-14 bg-primary flex flex-col items-center relative md:max-w-[512px] md:rounded-2xl">
        <img src="/logopizzaking.png" alt="PizzaKing" className="w-20 h-auto" />
        <p className="text-sm text-white mt-6">Tạo tài khoản mới</p>
        <p className="text-lg text-white font-semibold">để tận hưởng ưu đãi</p>
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
            <label className="block text-sm font-medium mb-2 text-black">Họ và tên</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Vui lòng nhập họ và tên"
              className="py-3 px-5 block w-full rounded-md text-base border border-stroke focus:border-secondary focus:ring-0"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Vui lòng nhập email của bạn"
              className="py-3 px-5 block w-full rounded-md text-base border border-stroke focus:border-secondary focus:ring-0"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="Vui lòng nhập số điện thoại"
              className="py-3 px-5 block w-full rounded-md text-base border border-stroke focus:border-secondary focus:ring-0"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                required
                placeholder="Vui lòng nhập mật khẩu (ít nhất 6 ký tự)"
                className="py-3 pl-5 pr-10 block w-full rounded-md text-base border border-stroke focus:border-secondary focus:ring-0"
                value={formData.password}
                onChange={handleChange}
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

          <div>
            <label className="block text-sm font-medium mb-2 text-black">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="Vui lòng nhập lại mật khẩu"
                className="py-3 pl-5 pr-10 block w-full rounded-md text-base border border-stroke focus:border-secondary focus:ring-0"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass((p) => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-secondary"
              >
                {showConfirmPass ? (
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

          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 flex items-center justify-center rounded-lg bg-primary text-white disabled:bg-stroke"
          >
            {loading ? "Đang xử lý..." : "Đăng Ký"}
          </button>

          <p className="text-center text-sm">
            Đã có tài khoản? <a href="/auth/login" className="text-primary underline">Đăng nhập</a>
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

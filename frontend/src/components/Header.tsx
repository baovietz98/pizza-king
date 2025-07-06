"use client";
import Link from "next/link";
import Image from "next/image";

import { ShoppingCartIcon, BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { items } = useCart();
  const { user, logout, loading } = useAuth();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = items.reduce((t,i)=>t+i.quantity,0);

  const handleUserMenuClick = () => {
    setOpenUserMenu(!openUserMenu);
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setOpenUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white text-gray-900 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 h-18 md:h-[72px]">
        {/* Left: order type + store */}
        <div className="hidden md:flex flex-col flex-1 cursor-pointer overflow-hidden text-left">
          <p className="text-sm text-gray-500">Mua mang về:</p>
          <p className="font-semibold truncate max-w-[160px]">Pizza Hut Parc Mall</p>
        </div>
        {/* Mobile: store info */}
        <div className="md:hidden flex flex-col flex-1 cursor-pointer overflow-hidden text-left">
          <p className="text-xs text-gray-500">Mua mang về:</p>
          <p className="text-sm font-semibold truncate">Pizza Hut Parc Mall</p>
        </div>
        {/* Center: logo */}
        <Link href="/" className="flex-1 flex-shrink-0 flex justify-center items-center">
          <Image src="/logopizzaking.png" alt="PizzaKing" width={60} height={60} className="object-contain md:w-20 md:h-20" />
        </Link>
        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/menu" className="hover:text-yellow-300">Menu</Link>
          <Link href="/deals" className="hover:text-yellow-300">Khuyến mãi</Link>
          <Link href="/stores" className="hover:text-yellow-300">Cửa hàng</Link>
        </nav>
        {/* Right: icons */}
        <div className="flex items-center gap-6 flex-1 justify-end">
          {/* Notifications */}
          <button className="hidden md:inline-flex relative">
            <BellIcon className="w-6 h-6 md:w-7 md:h-7 text-red-600" />
          </button>
          {/* Language dropdown */}
          <div className="relative hidden md:inline-flex group">
            <span className="text-sm font-semibold cursor-pointer select-none">VI</span>
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              <button className="block w-full text-left px-4 py-2 hover:text-red-600">Tiếng Việt</button>
              <button className="block w-full text-left px-4 py-2 hover:text-red-600">English</button>
            </div>
          </div>
          {/* Cart */}
          <Link href="/cart" className="relative flex items-center cursor-pointer hover:text-red-700 transition-colors" id="cart">
            <ShoppingCartIcon className="w-6 h-6 md:w-7 md:h-7 text-red-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 md:-right-3 min-w-[18px] md:min-w-[20px] h-4 md:h-5 px-1 flex items-center justify-center text-[10px] md:text-xs font-bold text-white bg-red-600 rounded-full">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          {/* User dropdown */}
          {loading ? (
            <div className="relative inline-flex items-center">
              <UserCircleIcon className="w-6 h-6 text-gray-400 animate-pulse" />
            </div>
          ) : user ? (
            <div ref={userMenuRef} className="relative inline-flex items-center cursor-pointer">
              <span 
                className="flex items-center gap-1 hover:text-red-600 transition-colors" 
                onClick={() => setOpenUserMenu(!openUserMenu)}
              >
                <UserCircleIcon className="w-6 h-6 text-red-600" />
                <span className="hidden md:inline">{user.name}</span>
              </span>
                                <div className={`absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md py-2 z-[9999] border border-gray-200 ${
                    openUserMenu ? 'block' : 'hidden'
                  }`} style={{ top: '100%', right: '0' }}>
                <Link href="/tracking" className="block px-4 py-2 hover:text-red-600 hover:bg-gray-50">Theo dõi đơn hàng</Link>
                <Link href="/rewards" className="block px-4 py-2 hover:text-red-600 hover:bg-gray-50">Đổi điểm</Link>
                <Link href="/hut-rewards" className="block px-4 py-2 hover:text-red-600 hover:bg-gray-50">Hut Rewards</Link>
                <Link href="/support" className="block px-4 py-2 hover:text-red-600 hover:bg-gray-50">Hỗ trợ khách hàng</Link>
                <hr className="my-1" />
                <button 
                  onClick={() => {
                    logout();
                    setOpenUserMenu(false);
                  }} 
                  className="block w-full text-left px-4 py-2 hover:text-red-600 hover:bg-gray-50"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div ref={userMenuRef} className="relative inline-flex items-center cursor-pointer">
              <UserCircleIcon 
                className="w-6 h-6 text-red-600 hover:text-red-700 transition-colors" 
                onClick={handleUserMenuClick}
              />
              {openUserMenu && (
                <div className="fixed inset-0 z-[9999]" onClick={() => setOpenUserMenu(false)}>
                  <div className="absolute top-16 right-4 w-44 bg-white shadow-lg rounded-md py-2 border border-gray-200">
                    <Link href="/auth/login" className="block px-4 py-2 hover:text-red-600 hover:bg-gray-50 text-black">Đăng nhập</Link>
                    <Link href="/auth/register" className="block px-4 py-2 hover:text-red-600 hover:bg-gray-50 text-black">Đăng ký</Link>
                    <hr className="my-1" />
                    <Link href="/tracking" className="block px-4 py-2 hover:text-red-600 hover:bg-gray-50 text-black">Theo dõi đơn hàng</Link>
                    <Link href="/rewards" className="block px-4 py-2 hover:text-red-600 hover:bg-gray-50 text-black">Đổi điểm</Link>
                    <Link href="/hut-rewards" className="block px-4 py-2 hover:text-red-600 hover:bg-gray-50 text-black">Hut Rewards</Link>
                    <Link href="/support" className="block px-4 py-2 hover:text-red-600 hover:bg-gray-50 text-black">Hỗ trợ khách hàng</Link>
                  </div>
                </div>
              )}
            </div>
          )}
          

          {/* Loading state */}
          {loading && (
            <div className="relative inline-flex items-center">
              <UserCircleIcon className="w-6 h-6 text-gray-400 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
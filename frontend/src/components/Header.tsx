import Link from "next/link";
import Image from "next/image";

import { ShoppingCartIcon, BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <header className="bg-white text-gray-900 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 h-18 md:h-[72px]">
        {/* Left: order type + store */}
        <div className="hidden md:flex flex-col flex-1 cursor-pointer overflow-hidden text-left">
          <p className="text-sm text-gray-500">Mua mang về:</p>
          <p className="font-semibold truncate max-w-[160px]">Pizza Hut Parc Mall</p>
        </div>
        {/* Center: logo */}
        <Link href="/" className="flex-1 flex-shrink-0 flex justify-center items-center">
          <Image src="/logo.svg" alt="PizzaHut" width={80} height={80} className="object-contain" />
        </Link>
        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/menu" className="hover:text-yellow-300">Menu</Link>
          <Link href="/deals" className="hover:text-yellow-300">Khuyến mãi</Link>
          <Link href="/stores" className="hover:text-yellow-300">Cửa hàng</Link>
        </nav>
        {/* Right: icons */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Notifications */}
          <button className="hidden md:inline-flex relative">
            <BellIcon className="w-6 h-6 text-red-600" />
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
          <Link href="/cart" className="relative">
            <ShoppingCartIcon className="w-6 h-6 text-red-600" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs font-bold px-1">
              0
            </span>
          </Link>
          {/* User dropdown */}
          <div className="relative hidden md:inline-flex group cursor-pointer">
            <UserCircleIcon className="w-6 h-6 text-red-600" />
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition text-sm">
              <Link href="/auth/login" className="block px-4 py-2 hover:text-red-600">Đăng nhập</Link>
              <Link href="/auth/register" className="block px-4 py-2 hover:text-red-600">Đăng ký</Link>
              <Link href="/tracking" className="block px-4 py-2 hover:text-red-600">Theo dõi đơn hàng</Link>
              <Link href="/rewards" className="block px-4 py-2 hover:text-red-600">Đổi điểm</Link>
              <Link href="/hut-rewards" className="block px-4 py-2 hover:text-red-600">Hut Rewards</Link>
              <Link href="/support" className="block px-4 py-2 hover:text-red-600">Hỗ trợ khách hàng</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

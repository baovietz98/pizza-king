"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/auth")) return null;
  return (
    <footer className="w-full mt-16 text-gray-700">
      {/* khu vực chính */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between bg-gray-50 rounded-lg shadow p-4 md:p-9 gap-8">
        {/* Logo + thông tin CTY + social */}
        <div className="space-y-4 max-w-xs">
          <Link href="/">
            <Image
              src="/logopizzaking.png"
              alt="Pizza King"
              width={156}
              height={32}
              className="w-[156px] object-contain"
            />
          </Link>


          <div className="flex gap-3">
            <Link
              href="https://www.facebook.com/VietnamPizzaHut"
              aria-label="Facebook"
            >
              <Image
                src="/facebook-icon.svg"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </Link>
            <Link
              href="https://www.youtube.com/c/PizzaHutViệtNamPHV"
              aria-label="YouTube"
            >
              <Image
                src="/youtubeIcon.svg"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </Link>
            <Link
              href="mailto:customerservice@pizzaking.vn"
              aria-label="Email"
            >
              <Image
                src="/gmailIcon.svg"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </Link>
          </div>
        </div>

        {/* Cột: Về chúng tôi */}
        <div>
          <h5 className="mb-4 text-base md:text-lg font-semibold">Về chúng tôi</h5>
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="cursor-pointer">Giới thiệu</Link></li>
            <li><Link href="#" className="cursor-pointer">Tầm nhìn &amp; Sứ mệnh</Link></li>
            <li><Link href="#" className="cursor-pointer">Giá trị cốt lõi</Link></li>
            <li><Link href="#" className="cursor-pointer">An toàn thực phẩm</Link></li>
            <li><Link href="#" className="cursor-pointer">LIMO</Link></li>
            <li>
              <Link
                href="https://pizzaking.talent.vn/"
                className="cursor-pointer"
              >
                Cơ hội nghề nghiệp
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột: Vị trí cửa hàng */}
        <div>
          <h5 className="mb-4 text-base md:text-lg font-semibold">Vị trí cửa hàng</h5>
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="cursor-pointer">Miền Bắc</Link></li>
            <li><Link href="#" className="cursor-pointer">Miền Trung</Link></li>
            <li><Link href="#" className="cursor-pointer">Miền Nam</Link></li>
          </ul>
        </div>

        {/* Cột: Tải app + chứng nhận */}
        <div>
          <h5 className="mb-4 text-base md:text-lg font-semibold">Tải ứng dụng</h5>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            <Link href="http://onelink.to/pizzakingvietnam">
              <Image
                src="/ch_play.svg"
                alt="Google Play"
                width={130}
                height={49}
                className="object-contain"
              />
            </Link>
            <Link href="http://onelink.to/pizzakingvietnam">
              <Image
                src="/apple_store.svg"
                alt="App Store"
                width={130}
                height={49}
                className="object-contain"
              />
            </Link>
            <Link href="http://online.gov.vn/Home/WebDetails/16305">
              <Image
                src="/certification.svg"
                alt="Certification"
                width={130}
                height={49}
                className="object-contain"
              />
            </Link>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row justify-between items-center text-xs md:text-sm py-4">
        <p className="text-nowrap mt-4 md:mt-0">Phiên bản 1.0.0</p>
        <ul className="flex flex-wrap gap-4 md:gap-12">
          <li><Link href="#" className="cursor-pointer">Hut Rewards</Link></li>
          <li><Link href="#" className="cursor-pointer">Điều khoản và quyền lợi</Link></li>
          <li className="text-primary font-medium">Liên hệ 1900&nbsp;1822</li>
        </ul>
      </div>
    </footer>
  );
}
export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <h2 className="font-semibold text-white mb-2">Pizza Hut Vietnam</h2>
          <p className="leading-relaxed text-xs">
            Công ty TNHH Pizza Hut Việt Nam, 34A-34B Phan Đình Giót, P.2, Tân Bình,
            TP.HCM. MST: 0303902751 do Sở KHĐT TP.HCM cấp ngày 27/07/2005.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-white mb-2">Về chúng tôi</h2>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
            <li><a href="#" className="hover:text-white">Tin tức</a></li>
            <li><a href="#" className="hover:text-white">Khuyến mãi</a></li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-white mb-2">Hỗ trợ</h2>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Trung tâm trợ giúp</a></li>
            <li><a href="#" className="hover:text-white">Chính sách giao hàng</a></li>
            <li><a href="#" className="hover:text-white">Liên hệ</a></li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-white mb-2">Kết nối</h2>
          <div className="flex gap-3">
            <a href="#" className="hover:text-white">Fb</a>
            <a href="#" className="hover:text-white">Ig</a>
            <a href="#" className="hover:text-white">Yt</a>
          </div>
        </div>
      </div>
      <div className="bg-neutral-800 text-center text-xs py-4">
        © 2025 Pizza Hut Vietnam. All rights reserved.
      </div>
    </footer>
  );
}

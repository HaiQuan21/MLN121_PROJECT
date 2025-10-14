import { motion } from 'framer-motion';
import { useState } from 'react';

const features = [
    {
      iconImage: '/assets/vi_dien_tu.jpg',
      title: 'Ví điện tử',
      desc: 'Momo, ZaloPay, VNPay - lưu trữ và thanh toán tiền điện tử trên smartphone',
      color: 'from-purple-500 to-pink-500',
      detailedImage: '/assets/vi_dien_tu.jpg',
      detailedInfo: 'Ví điện tử (digital wallet) phổ biến từ những năm 2010, với các ví địa phương ở Việt Nam như Momo (2010), ZaloPay (2016) và VNPay. Chúng lưu trữ và thanh toán tiền điện tử qua smartphone, hỗ trợ QR code, chuyển khoản và mua sắm, thường liên kết với ngân hàng. Ưu điểm là tiện lợi và an toàn (NFC, mã hóa), nhưng phụ thuộc vào kết nối internet và có phí giao dịch.',
      source: 'Ví điện tử Momo - một trong những ví phổ biến nhất Việt Nam',
      sourceUrl: 'https://www.aia.com.vn/vi/song-khoe/loi-khuyen/tai-chinh/vi-dien-tu-la-gi.html'
    },
    {
      iconImage: '/assets/ngan_hang_so.png',
      title: 'Ngân hàng số',
      desc: 'Giao dịch 24/7 không cần đến chi nhánh, mọi thao tác qua app',
      color: 'from-blue-500 to-cyan-500',
      detailedImage: '/assets/ngan_hang_so.png',
      detailedInfo: 'Ngân hàng số (digital banking) bắt đầu phổ biến từ những năm 1990, với các ngân hàng đầu tiên cung cấp dịch vụ trực tuyến như Stanford Federal Credit Union năm 1994. Nó cho phép giao dịch 24/7 qua app hoặc web, không cần đến chi nhánh, bao gồm chuyển khoản, thanh toán hóa đơn và quản lý tài khoản. Đến nay, nó tích hợp AI và bảo mật sinh trắc học, giúp giảm chi phí và tăng tiện lợi, nhưng vẫn phụ thuộc vào hệ thống ngân hàng truyền thống.',
      source: 'Ứng dụng ngân hàng số hiện đại',
      sourceUrl: 'https://techcombank.com/thong-tin/blog/ngan-hang-so'
    },
    {
      iconImage: '/assets/blockchain.webp',
      title: 'Blockchain',
      desc: 'Công nghệ sổ cái phân tán, đảm bảo tính minh bạch và bảo mật',
      color: 'from-green-500 to-emerald-500',
      detailedImage: '/assets/blockchain.webp',
      detailedInfo: 'Công nghệ blockchain được giới thiệu năm 2008 bởi Satoshi Nakamoto trong whitepaper Bitcoin, như một sổ cái phân tán (distributed ledger) đảm bảo minh bạch, bảo mật và chống giả mạo mà không cần trung ương. Mỗi "khối" chứa dữ liệu giao dịch, liên kết bằng mã hóa, và được xác thực bởi mạng lưới nút (nodes). Nó mở rộng ứng dụng từ tiền tệ đến chuỗi cung ứng và hợp đồng thông minh.',
      source: 'Công nghệ blockchain - sổ cái phân tán',
      sourceUrl: 'https://www.investopedia.com/terms/b/blockchain.asp'
    },
    {
      iconImage: '/assets/tien_dien_tu.jpg',
      title: 'Tiền điện tử',
      desc: 'Bitcoin, Ethereum - tiền kỹ thuật số phi tập trung toàn cầu',
      color: 'from-orange-500 to-red-500',
      detailedImage: '/assets/tien_dien_tu.jpg',
      detailedInfo: 'Tiền điện tử (cryptocurrency) bắt đầu với Bitcoin năm 2009, theo sau là Ethereum năm 2015. Đây là tiền kỹ thuật số phi tập trung, sử dụng blockchain để giao dịch toàn cầu mà không cần ngân hàng, với giá trị dựa trên cung-cầu và công nghệ. Bitcoin tập trung vào lưu trữ giá trị như "vàng kỹ thuật số", trong khi Ethereum hỗ trợ hợp đồng thông minh và ứng dụng phân tán (dApps).',
      source: 'Bitcoin - tiền điện tử đầu tiên và phổ biến nhất',
      sourceUrl: 'https://www.vpbank.com.vn/bi-kip-va-chia-se/retail-story-and-tips/others/tien-dien-tu-la-gi-so-sanh-tien-dien-tu-voi-tien-mat'
    },
    {
      iconImage: '/assets/defi.png',
      title: 'DeFi',
      desc: 'Tài chính phi tập trung - vay mượn, đầu tư không qua trung gian',
      color: 'from-yellow-500 to-orange-500',
      detailedImage: '/assets/defi.png',
      detailedInfo: 'DeFi (Decentralized Finance) nổi lên năm 2018 trên Ethereum, với các giao thức như MakerDAO, cho phép vay mượn, đầu tư và trao đổi mà không qua trung gian như ngân hàng, sử dụng smart contracts. Boom năm 2020 với TVL (total value locked) vượt tỷ đô, nhưng rủi ro cao như hack và biến động giá.',
      source: 'DeFi - Tài chính phi tập trung',
      sourceUrl: 'https://coin98.net/defi-la-gi'
    },
    {
      iconImage: '/assets/cbdc.png',
      title: 'Tiền kỹ thuật số của Ngân hàng Trung ương (Central Bank Digital Currency - CBDC).',
      desc: 'Giao dịch tức thì, phí thấp, vượt qua biên giới quốc gia',
      color: 'from-indigo-500 to-purple-500',
      detailedImage: '/assets/cbdc.png',
      detailedInfo: 'CBDC (Central Bank Digital Currency) bắt đầu phát triển mạnh từ 2020, với các dự án như e-CNY (Trung Quốc) và Sand Dollar (Bahamas). Đây là tiền kỹ thuật số do ngân hàng trung ương phát hành, kết hợp lợi ích của crypto với sự ổn định fiat. Đến 2025, hơn 100 quốc gia đang nghiên cứu, tập trung vào thanh toán nhanh và bao phủ tài chính.',
      source: 'CBDC - Tiền kỹ thuật số ngân hàng trung ương',
      sourceUrl: 'https://www.dnse.com.vn/hoc/cbdc-la-gi'
    },
  ];

// Function để extract domain name từ URL
function getDomainName(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
}

// Modal component để hiển thị thông tin chi tiết
function DetailModal({ item, isOpen, onClose }: { 
  item: typeof features[0] | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen || !item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">{item.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {item.detailedImage && (
            <div className="mb-6">
              <img
                src={item.detailedImage}
                alt={item.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Hiển thị source ngay dưới hình ảnh trong modal */}
              {item.source && (
                <p className="text-sm text-slate-500 italic mt-3 text-center">
                  {item.source}
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Tóm tắt</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
            
            {item.detailedInfo && (
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Thông tin chi tiết</h3>
                <p className="text-slate-600 leading-relaxed">{item.detailedInfo}</p>
              </div>
            )}
            
            {item.sourceUrl && item.sourceUrl !== '#' && (
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Tìm hiểu thêm tại đây</h3>
                <a 
                  href={item.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  🔗 {getDomainName(item.sourceUrl)}
                </a>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DigitalPage() {
  const [selectedItem, setSelectedItem] = useState<typeof features[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: typeof features[0]) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const examples = [
    { name: 'PayPal', logo: '/assets/paypal.png', users: '400M+', desc: 'Ví điện tử toàn cầu' },
    { name: 'Bitcoin', logo: '/assets/Bitcoin.png', users: '300M+', desc: 'Tiền điện tử đầu tiên' },
    { name: 'Momo', logo: '/assets/MoMo_Logo.png', users: '30M+', desc: 'Ví Việt phổ biến nhất' },
    { name: 'Ethereum', logo: '/assets/ethereum.webp', users: '200M+', desc: 'Nền tảng hợp đồng thông minh' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Tiền <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Số hóa</span> là gì?
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Sự chuyển đổi từ tiền mặt vật lý sang các hình thức thanh toán kỹ thuật số, mở ra kỷ nguyên mới của tài chính
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer"
              onClick={() => handleItemClick(feature)}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 overflow-hidden"
              >
                <img
                  src={feature.iconImage}
                  alt={feature.title}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-300">{feature.desc}</p>
              <motion.div 
                className="mt-3 text-sm text-blue-300 font-medium"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Click để xem chi tiết →
                </motion.span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Ví dụ thực tế
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examples.map((example, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-lg"
              >
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img
                    src={example.logo}
                    alt={example.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{example.name}</h3>
                <div className="text-blue-600 font-semibold mb-2">{example.users}</div>
                <p className="text-slate-600 text-sm">{example.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Tại sao Tiền số hóa quan trọng?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="text-white font-semibold mb-2">Nhanh chóng</h4>
              <p className="text-slate-300 text-sm">Giao dịch hoàn tất trong vài giây thay vì vài ngày</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="text-white font-semibold mb-2">An toàn</h4>
              <p className="text-slate-300 text-sm">Mã hóa và bảo mật đa lớp bảo vệ tài sản</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🌍</div>
              <h4 className="text-white font-semibold mb-2">Toàn cầu</h4>
              <p className="text-slate-300 text-sm">Giao dịch xuyên biên giới không giới hạn</p>
            </div>
          </div>
        </motion.div>
      </div>

      <DetailModal 
        item={selectedItem} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

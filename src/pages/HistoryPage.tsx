import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const timelineData = [
  {
    year: '9000 TCN',
    title: 'Nền kinh tế tặng vật & hàng đổi hàng',
    desc: 'Lúc này chưa có tiền, con người trao đổi hàng hóa trực tiếp: ví dụ đổi thịt lấy công cụ. Đây được coi là hình thức giao dịch sớm nhất trong lịch sử loài người.',
    image: '🔄',
    detailedImage: '/assets/trao_doi_hang_hoa.jpg',
    detailedInfo: 'Trước khi có tiền tệ, các xã hội săn bậc hái lượm và nông nghiệp sơ khai sử dụng hệ thống trao đổi trực tiếp (barter) hoặc tặng vật (gift economy). Ví dụ, đổi thịt lấy công cụ, hạt giống lấy da thú, hoặc tặng quà để xây dựng mối quan hệ xã hội và liên minh bộ lạc. Điều này bắt đầu phổ biến sau khi con người thuần hóa gia súc và trồng trọt khoảng 9000-6000 TCN, giúp tạo dư thừa hàng hóa để trao đổi. Hệ thống này đơn giản nhưng bất tiện vì cần sự trùng hợp nhu cầu (muốn đổi đúng thứ đối phương có), và vẫn tồn tại ở một số cộng đồng ngày nay.',
    source: 'Minh họa trao đổi hàng hóa và quà tặng ở thời kỳ đồ đá mới',
    sourceUrl: 'https://en.wikipedia.org/wiki/History_of_money'
  },
  {
    year: '1100 TCN',
    title: 'Tiền hàng hóa ở Trung Quốc',
    desc: 'Người Trung Quốc dùng mô hình thu nhỏ của các vật phẩm (như dao, công cụ) làm tiền. Tuy nhiên, loại "tiền" này khá bất tiện và thậm chí có thể gây nguy hiểm (ví dụ: dao nhỏ bằng kim loại).',
    image: '🔪',
    detailedImage: '/assets/tien_hang_hoa_o_Trung_Quoc.jpg',
    detailedInfo: 'Ở Trung Quốc cổ đại, tiền hàng hóa (commodity money) được sử dụng dưới dạng mô hình thu nhỏ của công cụ như dao (knife money) hoặc xẻng (spade money), đúc từ đồng thanh. Những "đồng tiền" này xuất hiện khoảng 1200-1100 TCN, chủ yếu ở các vương quốc như Yên (Yan) và Tề (Qi), dùng để trao đổi hàng hóa thay vì công cụ thực tế. Chúng bất tiện vì nặng nề, dễ gãy và thậm chí nguy hiểm (có lưỡi sắc), nhưng đánh dấu bước chuyển từ barter sang tiền tệ có giá trị nội tại. Loại tiền này phổ biến đến thời Chiến Quốc (475-221 TCN) trước khi bị thay thế bởi tiền tròn lỗ vuông.',
    source: 'Tiền dao đồng cổ Trung Quốc từ khoảng 1100 TCN',
    sourceUrl: 'https://learn.apmex.com/answers/what-is-chinese-knife-money/'
  },
  {
    year: '1200 TCN',
    title: 'Vỏ sò Cowrie',
    desc: 'Châu Phi và Châu Á sử dụng vỏ sò làm tiền tệ, một trong những hình thức tiền tệ sớm nhất.',
    image: '🐚',
    detailedImage: '/assets/Tien_vo_so.jpg',
    detailedInfo: 'Vỏ sò cowrie (từ Ấn Độ Dương và Thái Bình Dương) được sử dụng làm tiền tệ ở Châu Phi, Châu Á và một số khu vực khác do tính bền vững và dễ mang theo. Đây là một trong những hình thức tiền tệ sớm nhất, dùng trong trao đổi hàng hóa và thậm chí là biểu tượng địa vị xã hội. Chúng lan rộng qua thương mại và vẫn được dùng ở một số nơi đến thế kỷ 20.',
    source: 'Vỏ sò cowrie cổ đại dùng làm tiền tệ',
    sourceUrl: 'https://nmaahc.si.edu/cowrie-shells-and-trade-power'
  },
  {
    year: '600 TCN',
    title: 'Tiền xu vàng và bạc',
    desc: 'Vương quốc Lydia (Thổ Nhĩ Kỳ ngày nay) đúc tiền xu kim loại đầu tiên.',
    image: '💰',
    detailedImage: '/assets/tien_xu_co_dai.jpg',
    detailedInfo: 'Vương quốc Lydia (nay là Thổ Nhĩ Kỳ) đúc tiền xu kim loại đầu tiên từ electrum (hợp kim vàng-bạc), đánh dấu sự chuyển đổi từ hàng hóa sang tiền tệ chuẩn hóa. Đồng xu được dập hình sư tử và giúp thúc đẩy thương mại. Ý tưởng này nhanh chóng lan sang Hy Lạp và Ba Tư.',
    source: 'Đồng xu Lydia đầu tiên từ khoảng 600 TCN',
    sourceUrl: 'https://www.egypttoday.com/Article/4/113533/The-first-currency-in-history-Kingdom-of-Lydia-minted-gold'
  },
  {
    year: '100 TCN',
    title: 'Đế chế La Mã',
    desc: 'Đồng Denarius trở thành tiền tệ chuẩn của đế chế, lưu hành rộng rãi.',
    image: '🏛️',
    detailedImage: '/assets/de_che_la_ma_dong_denarius.jpg',
    detailedInfo: 'Đồng denarius (bạc) trở thành tiền tệ chuẩn của Đế chế La Mã từ thế kỷ 3 TCN, nhưng phổ biến rộng rãi vào khoảng 100 TCN. Nó được dùng cho thương mại, thuế và quân sự, với hệ thống tiền tệ bao gồm vàng, bạc và đồng. Denarius thường in hình hoàng đế và được lưu hành khắp châu Âu, Trung Đông.',
    source: 'Đồng Denarius La Mã cổ đại',
    sourceUrl: 'https://learn.apmex.com/learning-guide/history/what-is-a-denarius/'
  },
  {
    year: '960',
    title: 'Tiền giấy đầu tiên',
    desc: 'Trung Quốc nhà Tống phát minh tiền giấy để thuận tiện trong thương mại.',
    image: '📜',
    detailedImage: '/assets/tien_giay_dau_tien.jpg',
    detailedInfo: 'Trung Quốc dưới triều Tống phát minh tiền giấy (jiaozi) khoảng năm 960-1024 để thay thế đồng xu nặng nề, do thiếu đồng. Đây là tiền giấy chính thức đầu tiên, in trên giấy từ vỏ cây dâu và có giá trị bảo đảm bằng kim loại. Nó giúp thương mại phát triển nhưng cũng dẫn đến lạm phát nếu in.',
    source: 'Tiền giấy nhà Tống (Jiaozi)',
    sourceUrl: 'https://historyofinformation.com/detail.php?entryid=242'
  },
  {
    year: '1661',
    title: 'Tiền giấy Châu Âu',
    desc: 'Thụy Điển phát hành tiền giấy đầu tiên ở Châu Âu qua Stockholms Banco.',
    image: '🏦',
    detailedImage: '/assets/tien_giay_chau_au.jpg',
    detailedInfo: 'Thụy Điển phát hành tiền giấy đầu tiên ở châu Âu qua Stockholms Banco năm 1661, thay thế tấm đồng nặng. Tuy nhiên, ngân hàng phá sản năm 1664 do không đủ dự trữ. Đây là bước đầu cho tiền giấy châu Âu, sau đó lan rộng với Ngân hàng Anh năm 1694.',
    source: 'Tiền giấy Stockholms Banco năm 1661',
    sourceUrl: 'https://www.riksbank.se/en-gb/about-the-riksbank/history/historical-timeline/1600-1699/first-banknotes-in-europe/'
  },
  {
    year: '1950',
    title: 'Thẻ tín dụng',
    desc: 'Diners Club ra mắt thẻ tín dụng đầu tiên, mở đầu kỷ nguyên thanh toán không dùng tiền mặt.',
    image: '💳',
    detailedImage: '/assets/the_tin_dung.jpg',
    detailedInfo: 'Diners Club ra mắt thẻ tín dụng đầu tiên năm 1950 tại Mỹ, ban đầu dùng cho nhà hàng. Nó mở ra kỷ nguyên thanh toán không tiền mặt, sau đó là American Express (1958) và Visa/Mastercard. Thẻ tín dụng trở thành phổ biến toàn cầu vào cuối thế kỷ 20.',
    source: 'Thẻ Diners Club đầu tiên năm 1950',
    sourceUrl: 'https://www.saturdayeveningpost.com/2016/04/day-cash-died/'
  },
  {
    year: '2009',
    title: 'Bitcoin ra đời',
    desc: 'Satoshi Nakamoto tạo ra Bitcoin, tiền điện tử đầu tiên dựa trên blockchain.',
    image: '₿',
    detailedImage: '/assets/Bitcoin.png',
    detailedInfo: 'Satoshi Nakamoto (bí danh) tạo ra Bitcoin năm 2009, tiền điện tử đầu tiên dựa trên blockchain – một sổ cái phân tán không cần trung ương. Nó giải quyết vấn đề chi tiêu kép và mở đường cho hàng ngàn tiền điện tử khác.',
    source: 'Biểu tượng Bitcoin và blockchain',
    sourceUrl: 'https://money.usnews.com/investing/articles/the-history-of-bitcoin'
  },
  {
    year: '2020+',
    title: 'Kỷ nguyên CBDC',
    desc: 'Các ngân hàng trung ương bắt đầu phát triển tiền kỹ thuật số chính thức.',
    image: '🌐',
    detailedImage: '/assets/ki_nguyen_cdbc.jpg',
    detailedInfo: 'Các ngân hàng trung ương bắt đầu phát triển Central Bank Digital Currency (CBDC) từ khoảng 2020, như e-CNY của Trung Quốc hay Sand Dollar của Bahamas. Đây là tiền kỹ thuật số chính thức, kết hợp lợi ích của tiền điện tử với sự kiểm soát của nhà nước. Đến năm 2025, nhiều quốc gia đang thử nghiệm, tập trung vào thanh toán nhanh và an toàn.',
    source: 'Khái niệm tiền kỹ thuật số ngân hàng trung ương (CBDC)',
    sourceUrl: 'https://www.eurofinance.com/news/future-of-finance-cbdcs-and-a-new-era-for-money-and-global-transactions/'
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
  item: typeof timelineData[0] | null; 
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
              <div className="text-blue-600 font-bold text-lg mb-2">{item.year}</div>
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
            
            {item.sourceUrl && (
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Tìm hiểu thêm tại đây</h3>
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

function TimelineItem({ item, index, onItemClick }: { 
  item: typeof timelineData[0]; 
  index: number; 
  onItemClick: (item: typeof timelineData[0]) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex gap-4 md:gap-8 items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
        <motion.div
          whileHover={{ 
            scale: 1.05,
            y: -5,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
          onClick={() => onItemClick(item)}
        >
          <div className="text-blue-600 font-bold text-lg mb-2">{item.year}</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">{item.title}</h3>
          
          {/* Hiển thị hình ảnh nếu có */}
          {item.detailedImage && (
            <motion.div 
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.img
                src={item.detailedImage}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                whileHover={{ 
                  filter: "brightness(1.1) contrast(1.05)",
                  transition: { duration: 0.3 }
                }}
              />
              {/* Hiển thị source ngay dưới hình ảnh */}
              {item.source && (
                <motion.p 
                  className="text-xs text-slate-400 italic mt-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {item.source}
                </motion.p>
              )}
            </motion.div>
          )}
          
          <p className="text-slate-600">{item.desc}</p>
          {(item.detailedInfo || item.detailedImage) && (
            <motion.div 
              className="mt-3 text-sm text-blue-500 font-medium"
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
          )}
        </motion.div>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Timeline node với animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          whileHover={{ 
            scale: 1.3, 
            rotate: 360,
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)"
          }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            type: "spring",
            stiffness: 200
          }}
          className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center text-2xl md:text-4xl shadow-2xl z-20 border-2 md:border-4 border-white"
        >
          {/* Glow effect */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-md"
          />
          <span className="relative z-10">{item.image}</span>
        </motion.div>
      </div>

      <div className="flex-1" />
    </motion.div>
  );
}

export default function HistoryPage() {
  const [selectedItem, setSelectedItem] = useState<typeof timelineData[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: typeof timelineData[0]) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Lịch sử <span className="text-blue-600">Tiền tệ</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Hành trình 4000 năm tiến hóa của tiền tệ qua các nền văn minh
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto relative">
          {/* Timeline line chạy qua toàn bộ */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 opacity-30"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />
          
          <div className="space-y-16">
            {timelineData.map((item, index) => (
              <TimelineItem 
                key={index} 
                item={item} 
                index={index} 
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      </div>

      <DetailModal 
        item={selectedItem} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

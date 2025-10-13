import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const timelineData = [
  {
    year: '1200 TCN',
    title: 'Vỏ sò Cowrie',
    desc: 'Châu Phi và Châu Á sử dụng vỏ sò làm tiền tệ, một trong những hình thức tiền tệ sớm nhất.',
    image: '🐚',
  },
  {
    year: '600 TCN',
    title: 'Tiền xu vàng và bạc',
    desc: 'Vương quốc Lydia (Thổ Nhĩ Kỳ ngày nay) đúc tiền xu kim loại đầu tiên.',
    image: '💰',
  },
  {
    year: '100 TCN',
    title: 'Đế chế La Mã',
    desc: 'Đồng Denarius trở thành tiền tệ chuẩn của đế chế, lưu hành rộng rãi.',
    image: '🏛️',
  },
  {
    year: '960',
    title: 'Tiền giấy đầu tiên',
    desc: 'Trung Quốc nhà Tống phát minh tiền giấy để thuận tiện trong thương mại.',
    image: '📜',
  },
  {
    year: '1661',
    title: 'Tiền giấy Châu Âu',
    desc: 'Thụy Điển phát hành tiền giấy đầu tiên ở Châu Âu qua Stockholms Banco.',
    image: '🏦',
  },
  {
    year: '1950',
    title: 'Thẻ tín dụng',
    desc: 'Diners Club ra mắt thẻ tín dụng đầu tiên, mở đầu kỷ nguyên thanh toán không dùng tiền mặt.',
    image: '💳',
  },
  {
    year: '2009',
    title: 'Bitcoin ra đời',
    desc: 'Satoshi Nakamoto tạo ra Bitcoin, tiền điện tử đầu tiên dựa trên blockchain.',
    image: '₿',
  },
  {
    year: '2020+',
    title: 'Kỷ nguyên CBDC',
    desc: 'Các ngân hàng trung ương bắt đầu phát triển tiền kỹ thuật số chính thức.',
    image: '🌐',
  },
];

function TimelineItem({ item, index }: { item: typeof timelineData[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex gap-8 items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="text-blue-600 font-bold text-lg mb-2">{item.year}</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">{item.title}</h3>
          <p className="text-slate-600">{item.desc}</p>
        </motion.div>
      </div>

      <div className="relative flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-4xl shadow-xl z-10"
        >
          {item.image}
        </motion.div>
        {index < timelineData.length - 1 && (
          <div className="w-1 h-32 bg-gradient-to-b from-blue-500 to-blue-300 absolute top-20" />
        )}
      </div>

      <div className="flex-1" />
    </motion.div>
  );
}

export default function HistoryPage() {
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

        <div className="max-w-4xl mx-auto space-y-16">
          {timelineData.map((item, index) => (
            <TimelineItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

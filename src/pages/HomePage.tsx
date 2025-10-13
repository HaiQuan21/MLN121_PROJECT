import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const evolutionStages = [
    { icon: '🐚', label: 'Vỏ sò', year: '1200 TCN' },
    { icon: '💰', label: 'Vàng', year: '600 TCN' },
    { icon: '📜', label: 'Tiền giấy', year: '1661' },
    { icon: '💳', label: 'Thẻ tín dụng', year: '1950' },
    { icon: '⛓️', label: 'Blockchain', year: '2009' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Tiền có còn là{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">
              hàng hóa đặc biệt
            </span>
            <br />
            trong thời đại tiền số?
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Khám phá hành trình tiến hóa của tiền tệ từ hàng hóa nguyên thủy đến công nghệ blockchain hiện đại
          </p>
        </motion.div>

        <div className="flex justify-center items-center gap-4 mb-16 overflow-x-auto pb-8">
          {evolutionStages.map((stage, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-3 min-w-[120px]"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <div className="text-5xl mb-2">{stage.icon}</div>
                <div className="text-white font-semibold text-center">{stage.label}</div>
                <div className="text-amber-400 text-sm text-center">{stage.year}</div>
              </motion.div>
              {idx < evolutionStages.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.2 + 0.3, duration: 0.3 }}
                  className="hidden md:block absolute w-16 h-1 bg-gradient-to-r from-amber-400 to-blue-400"
                  style={{ left: `${(idx + 1) * 140}px` }}
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <motion.button
            onClick={() => onNavigate('history')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center gap-2 shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Khám phá hành trình
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {[
            { title: 'Lịch sử 4000 năm', desc: 'Từ hàng hóa đến tiền số', page: 'history' },
            { title: 'Công nghệ Blockchain', desc: 'Cách mạng trong giao dịch', page: 'digital' },
            { title: 'Tương lai Tiền tệ', desc: 'CBDC và AI trong tài chính', page: 'future' },
          ].map((card, idx) => (
            <motion.button
              key={idx}
              onClick={() => onNavigate(card.page)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left hover:bg-white/10 transition-colors"
            >
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-slate-300">{card.desc}</p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

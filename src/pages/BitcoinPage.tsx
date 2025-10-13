import { motion } from 'framer-motion';
import { TrendingUp, Users, Shield, Zap } from 'lucide-react';

export default function BitcoinPage() {
  const milestones = [
    { year: '2008', event: 'Whitepaper Bitcoin', desc: 'Satoshi Nakamoto công bố bản whitepaper "Bitcoin: A Peer-to-Peer Electronic Cash System"' },
    { year: '2009', event: 'Genesis Block', desc: 'Block đầu tiên được khai thác, Bitcoin chính thức ra đời' },
    { year: '2010', event: 'Giao dịch đầu tiên', desc: 'Laszlo Hanyecz mua 2 pizza với 10,000 BTC (trị giá ~$41)' },
    { year: '2013', event: 'Vượt $1,000', desc: 'Bitcoin đạt mốc $1,000 lần đầu tiên' },
    { year: '2017', event: 'Bùng nổ ICO', desc: 'Bitcoin tăng vọt lên gần $20,000, thu hút hàng triệu nhà đầu tư' },
    { year: '2021', event: 'ATH $69,000', desc: 'Bitcoin đạt đỉnh lịch sử, các tổ chức lớn bắt đầu đầu tư' },
    { year: '2024', event: 'Bitcoin ETF', desc: 'SEC Mỹ phê duyệt Bitcoin ETF, hợp pháp hóa đầu tư tổ chức' },
  ];

  const impacts = [
    {
      icon: TrendingUp,
      title: 'Tài sản số',
      desc: 'Vốn hóa hơn $1.3 nghìn tỷ USD, trở thành lớp tài sản mới',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Tài chính phi tập trung',
      desc: 'Không cần ngân hàng trung gian, người dùng kiểm soát tài sản',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Bảo vệ khỏi lạm phát',
      desc: 'Giới hạn 21 triệu BTC, không thể in thêm như tiền fiat',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Thanh toán toàn cầu',
      desc: 'Chuyển tiền xuyên biên giới nhanh chóng, phí thấp',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-8xl mb-6"
          >
            ₿
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Câu chuyện về <span className="text-orange-500">Bitcoin</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Từ một ý tưởng cấp tiến đến cuộc cách mạng tài chính toàn cầu
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-white mb-16 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4">Satoshi Nakamoto</h2>
          <p className="text-lg leading-relaxed">
            Một cá nhân hoặc nhóm người bí ẩn đã tạo ra Bitcoin vào năm 2008, sau khủng hoảng tài chính toàn cầu.
            Mục tiêu: tạo ra một hệ thống tiền tệ phi tập trung, không bị kiểm soát bởi chính phủ hay ngân hàng.
            Đến nay, danh tính thực sự vẫn là một bí ẩn.
          </p>
        </motion.div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Các cột mốc quan trọng</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 to-yellow-500 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-xl p-6 shadow-lg"
                    >
                      <div className="text-orange-500 font-bold text-xl mb-2">{milestone.year}</div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{milestone.event}</h3>
                      <p className="text-slate-600">{milestone.desc}</p>
                    </motion.div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10"
                  >
                    {idx + 1}
                  </motion.div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Tác động kinh tế</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {impacts.map((impact, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-br ${impact.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <impact.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{impact.title}</h3>
                <p className="text-slate-600">{impact.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Bitcoin hôm nay</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">300M+</div>
              <div className="text-slate-300">Người dùng toàn cầu</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">$1.3T</div>
              <div className="text-slate-300">Vốn hóa thị trường</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">21M</div>
              <div className="text-slate-300">Tổng số Bitcoin tối đa</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Brain, Building2, Cpu, Globe2, Leaf, ShieldCheck } from 'lucide-react';

export default function FuturePage() {
  const trends = [
    {
      icon: Building2,
      title: 'CBDC - Tiền số của Ngân hàng Trung ương',
      desc: 'Các quốc gia như Trung Quốc (Digital Yuan), EU (Digital Euro) đang phát triển tiền kỹ thuật số chính thức, kết hợp lợi ích của tiền mặt và công nghệ blockchain.',
      color: 'from-blue-500 to-cyan-500',
      facts: ['80+ quốc gia nghiên cứu', 'Giao dịch tức thì', 'Giảm chi phí in tiền'],
    },
    {
      icon: Cpu,
      title: 'Blockchain 3.0',
      desc: 'Thế hệ blockchain mới với tốc độ xử lý nhanh hơn, phí thấp hơn, thân thiện môi trường hơn. Ethereum 2.0, Polkadot, Cardano dẫn đầu xu hướng.',
      color: 'from-purple-500 to-pink-500',
      facts: ['100,000+ TPS', 'Tiêu thụ năng lượng thấp', 'Interoperability'],
    },
    {
      icon: Brain,
      title: 'AI trong Tài chính',
      desc: 'Trí tuệ nhân tạo phân tích rủi ro, tự động hóa giao dịch, phát hiện gian lận, và cá nhân hóa dịch vụ tài chính cho từng người dùng.',
      color: 'from-green-500 to-emerald-500',
      facts: ['Phát hiện gian lận 95%', 'Tư vấn tự động 24/7', 'Dự đoán xu hướng'],
    },
    {
      icon: Globe2,
      title: 'DeFi & Web3',
      desc: 'Tài chính phi tập trung cho phép vay mượn, đầu tư, bảo hiểm không qua trung gian. Web3 trao quyền sở hữu dữ liệu lại cho người dùng.',
      color: 'from-orange-500 to-red-500',
      facts: ['$100B+ TVL', 'Không cần KYC', 'Lãi suất minh bạch'],
    },
    {
      icon: ShieldCheck,
      title: 'Bảo mật Lượng tử',
      desc: 'Với sự phát triển của máy tính lượng tử, các hệ thống mã hóa mới đang được phát triển để bảo vệ tài sản số trong tương lai.',
      color: 'from-indigo-500 to-purple-500',
      facts: ['Quantum-resistant', 'Mã hóa tuyệt đối', 'Bảo vệ dài hạn'],
    },
    {
      icon: Leaf,
      title: 'Green Finance',
      desc: 'Tiền tệ xanh và tài chính bền vững, sử dụng năng lượng tái tạo cho mining và giao dịch, giảm thiểu tác động môi trường.',
      color: 'from-lime-500 to-green-500',
      facts: ['Carbon-neutral', 'Năng lượng tái tạo', 'ESG compliant'],
    },
  ];

  const predictions = [
    { year: '2025', event: 'CBDC phổ biến ở 20+ quốc gia', icon: '🏛️' },
    { year: '2027', event: 'AI quản lý 50% giao dịch tài chính', icon: '🤖' },
    { year: '2030', event: 'Tiền mặt chỉ còn 10% giao dịch toàn cầu', icon: '💳' },
    { year: '2035', event: 'Blockchain trở thành chuẩn cho mọi giao dịch', icon: '⛓️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Tiền trong <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">Tương lai</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Khám phá những xu hướng và công nghệ sẽ định hình tương lai của tiền tệ và tài chính
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {trends.map((trend, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 bg-gradient-to-br ${trend.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <trend.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">{trend.title}</h3>
              <p className="text-slate-300 mb-4">{trend.desc}</p>
              <div className="space-y-2">
                {trend.facts.map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 + i * 0.1 }}
                    className="flex items-center gap-2 text-sm text-cyan-300"
                  >
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                    {fact}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Dự đoán Timeline</h2>
          <div className="space-y-6">
            {predictions.map((pred, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-6 bg-white/10 rounded-xl p-6"
              >
                <div className="text-5xl">{pred.icon}</div>
                <div className="flex-1">
                  <div className="text-cyan-400 font-bold text-xl mb-1">{pred.year}</div>
                  <div className="text-white text-lg">{pred.event}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-cyan-600/20 to-pink-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-6">Tương lai của Tiền tệ</h3>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Chúng ta đang chứng kiến một cuộc cách mạng tài chính chưa từng có. Tiền không chỉ là phương tiện giao dịch,
            mà đang trở thành một hệ sinh thái kỹ thuật số thông minh, kết nối mọi người trên toàn cầu.
            Câu hỏi không phải là "liệu tiền có thay đổi không?" mà là "bạn đã sẵn sàng cho tương lai chưa?"
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-4xl mb-3">🚀</div>
              <h4 className="text-white font-bold mb-2">Tốc độ</h4>
              <p className="text-slate-300 text-sm">Giao dịch tức thì, không biên giới, không ngày lễ</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-4xl mb-3">🔐</div>
              <h4 className="text-white font-bold mb-2">Bảo mật</h4>
              <p className="text-slate-300 text-sm">Mã hóa tuyệt đối, bảo vệ tài sản số của bạn</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-4xl mb-3">🌍</div>
              <h4 className="text-white font-bold mb-2">Toàn cầu</h4>
              <p className="text-slate-300 text-sm">Một hệ thống tài chính cho toàn nhân loại</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Smartphone, CreditCard, Lock, Globe, TrendingUp, Zap } from 'lucide-react';

export default function DigitalPage() {
  const features = [
    {
      icon: Smartphone,
      title: 'Ví điện tử',
      desc: 'Momo, ZaloPay, VNPay - lưu trữ và thanh toán tiền điện tử trên smartphone',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: CreditCard,
      title: 'Ngân hàng số',
      desc: 'Giao dịch 24/7 không cần đến chi nhánh, mọi thao tác qua app',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Lock,
      title: 'Blockchain',
      desc: 'Công nghệ sổ cái phân tán, đảm bảo tính minh bạch và bảo mật',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Globe,
      title: 'Tiền điện tử',
      desc: 'Bitcoin, Ethereum - tiền kỹ thuật số phi tập trung toàn cầu',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: TrendingUp,
      title: 'DeFi',
      desc: 'Tài chính phi tập trung - vay mượn, đầu tư không qua trung gian',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Zap,
      title: 'Thanh toán nhanh',
      desc: 'Giao dịch tức thì, phí thấp, vượt qua biên giới quốc gia',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  const examples = [
    { name: 'PayPal', logo: '💙', users: '400M+', desc: 'Ví điện tử toàn cầu' },
    { name: 'Bitcoin', logo: '₿', users: '300M+', desc: 'Tiền điện tử đầu tiên' },
    { name: 'Momo', logo: '💖', users: '30M+', desc: 'Ví Việt phổ biến nhất' },
    { name: 'Ethereum', logo: 'Ξ', users: '200M+', desc: 'Nền tảng hợp đồng thông minh' },
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
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-300">{feature.desc}</p>
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
                <div className="text-5xl mb-3">{example.logo}</div>
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
    </div>
  );
}

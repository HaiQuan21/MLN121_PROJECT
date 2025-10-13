import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'history', label: 'Lịch sử' },
    { id: 'digital', label: 'Tiền số hóa' },
    { id: 'bitcoin', label: 'Câu chuyện Bitcoin' },
    { id: 'future', label: 'Tương lai' },
    { id: 'interact', label: 'Tương tác' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-amber-400 font-bold text-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Coins className="w-8 h-8" />
            <span>Hành trình Tiền tệ</span>
          </motion.button>

          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          <div className="md:hidden">
            <motion.button
              onClick={() => onNavigate('menu')}
              className="text-white p-2"
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

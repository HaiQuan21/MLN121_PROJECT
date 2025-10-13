import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; text: string }>>([
    { type: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn về tiền tệ và tiền số?' },
  ]);
  const [input, setInput] = useState('');

  const responses: Record<string, string> = {
    'bitcoin': 'Bitcoin là loại tiền điện tử đầu tiên, được tạo ra năm 2009 bởi Satoshi Nakamoto. Nó hoạt động trên công nghệ blockchain.',
    'blockchain': 'Blockchain là công nghệ sổ cái phân tán, ghi lại các giao dịch một cách an toàn và minh bạch.',
    'tiền số': 'Tiền số hóa bao gồm tiền điện tử, ví điện tử, và các hệ thống thanh toán kỹ thuật số như PayPal, Momo.',
    'lịch sử': 'Tiền tệ đã phát triển từ hàng hóa (vỏ sò, vàng) đến tiền xu, tiền giấy, và giờ là tiền số.',
    'cbdc': 'CBDC (Central Bank Digital Currency) là tiền kỹ thuật số do ngân hàng trung ương phát hành.',
    'default': 'Tôi có thể giúp bạn tìm hiểu về lịch sử tiền tệ, Bitcoin, blockchain, tiền số hóa, và tương lai của tiền. Hãy hỏi tôi!',
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);

    const lowerInput = input.toLowerCase();
    let response = responses.default;

    for (const key in responses) {
      if (lowerInput.includes(key)) {
        response = responses[key];
        break;
      }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { type: 'bot', text: response }]);
    }, 500);

    setInput('');
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-300" />
                <span className="font-semibold">Trợ lý Tiền tệ</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-3 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 rounded-bl-none shadow'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Nhập câu hỏi..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <motion.button
                  onClick={handleSend}
                  className="bg-blue-600 text-white p-2 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Coins({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="9" cy="9" r="7" opacity="0.5" />
      <circle cx="15" cy="15" r="7" />
    </svg>
  );
}

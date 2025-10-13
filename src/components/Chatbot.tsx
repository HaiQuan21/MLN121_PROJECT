import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; text: string }>>([
    { type: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn về tiền ảo, ví điện tử và ngân hàng số?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Database responses thông minh cho các chủ đề
  const responses: Record<string, string> = {
    'bitcoin': 'Bitcoin là loại tiền điện tử đầu tiên, được tạo ra năm 2009 bởi Satoshi Nakamoto. Nó hoạt động trên công nghệ blockchain và có tính phi tập trung, không cần ngân hàng trung ương.',
    'ethereum': 'Ethereum là nền tảng blockchain thế hệ thứ hai, cho phép tạo ra các ứng dụng phi tập trung (DApps) và smart contracts. ETH là token gốc của mạng Ethereum.',
    'blockchain': 'Blockchain là công nghệ sổ cái phân tán, ghi lại các giao dịch một cách an toàn và minh bạch. Mỗi khối chứa thông tin về giao dịch và được liên kết với khối trước đó.',
    'ví điện tử': 'Ví điện tử là ứng dụng cho phép lưu trữ, gửi và nhận tiền điện tử. Có hai loại chính: ví nóng (kết nối internet) và ví lạnh (offline). Ví dụ: MetaMask, Trust Wallet, Ledger.',
    'ngân hàng số': 'Ngân hàng số là ngân hàng hoạt động hoàn toàn trên nền tảng kỹ thuật số, không có chi nhánh vật lý. Cung cấp dịch vụ ngân hàng 24/7 qua ứng dụng di động và web.',
    'cbdc': 'CBDC (Central Bank Digital Currency) là tiền kỹ thuật số do ngân hàng trung ương phát hành. Khác với tiền điện tử phi tập trung, CBDC được kiểm soát bởi chính phủ.',
    'defi': 'DeFi (Decentralized Finance) là hệ thống tài chính phi tập trung, cho phép người dùng giao dịch, cho vay, đi vay mà không cần trung gian như ngân hàng truyền thống.',
    'nft': 'NFT (Non-Fungible Token) là token không thể thay thế, đại diện cho quyền sở hữu duy nhất của một tài sản kỹ thuật số như nghệ thuật, âm nhạc, hoặc bất động sản ảo.',
    'sàn giao dịch': 'Sàn giao dịch tiền điện tử là nền tảng cho phép mua bán, trao đổi các loại tiền điện tử. Ví dụ: Binance, Coinbase, Kraken. Cần chú ý đến bảo mật và phí giao dịch.',
    'thanh toán số': 'Thanh toán số bao gồm các phương thức thanh toán không dùng tiền mặt như ví điện tử (Momo, ZaloPay), thẻ ngân hàng, QR code, và các công nghệ mới như NFC.',
    'smart contract': 'Smart contract là hợp đồng tự động thực thi khi đáp ứng các điều kiện được lập trình sẵn. Chúng chạy trên blockchain và không cần bên thứ ba để thực thi.',
    'web3': 'Web3 là thế hệ tiếp theo của internet, tập trung vào tính phi tập trung, quyền sở hữu dữ liệu của người dùng, và sử dụng blockchain để tạo ra các ứng dụng dân chủ hơn.',
    'bảo mật': 'Bảo mật trong crypto bao gồm: sử dụng ví cứng, không chia sẻ private key, xác thực 2FA, kiểm tra địa chỉ ví trước khi gửi tiền, và cẩn thận với các scam/phishing.',
    'quy định': 'Quy định về crypto đang được các quốc gia xây dựng. Một số nước đã hợp pháp hóa Bitcoin, một số cấm hoàn toàn. Cần tuân thủ luật pháp địa phương khi đầu tư.',
    'lịch sử': 'Lịch sử tiền tệ: từ hàng hóa (vỏ sò, vàng) → tiền xu → tiền giấy → tiền điện tử. Bitcoin mở ra kỷ nguyên tiền tệ số hóa phi tập trung.',
    'tương lai': 'Tương lai của tiền tệ sẽ là sự kết hợp giữa tiền fiat truyền thống và tiền điện tử. CBDC sẽ phổ biến, DeFi sẽ thay thế một phần hệ thống tài chính truyền thống.',
  };
  const keywordSuggestions = [
    'Bitcoin và Ethereum',
    'Blockchain và công nghệ sổ cái phân tán',
    'Ví điện tử và ví crypto',
    'Ngân hàng số và fintech',
    'CBDC - Tiền kỹ thuật số ngân hàng trung ương',
    'DeFi - Tài chính phi tập trung',
    'NFT và token',
    'Sàn giao dịch tiền điện tử',
    'Thanh toán số và payment gateway',
    'Smart contract và DApp',
    'Web3 và metaverse',
    'Quy định pháp lý về crypto',
    'Bảo mật và riêng tư trong crypto'
  ];


  // Logic tìm kiếm thông minh
  const findBestResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Tìm từ khóa phù hợp nhất
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        return response;
      }
    }
    
    // Kiểm tra các từ khóa phụ
    const relatedKeywords = {
      'tiền ảo': 'bitcoin',
      'crypto': 'bitcoin', 
      'tiền điện tử': 'bitcoin',
      'coin': 'bitcoin',
      'altcoin': 'ethereum',
      'eth': 'ethereum',
      'dapp': 'smart contract',
      'hợp đồng thông minh': 'smart contract',
      'fintech': 'ngân hàng số',
      'digital banking': 'ngân hàng số',
      'payment': 'thanh toán số',
      'giao dịch': 'sàn giao dịch',
      'trading': 'sàn giao dịch',
      'exchange': 'sàn giao dịch',
      'token': 'nft',
      'digital art': 'nft',
      'metaverse': 'web3',
      'internet': 'web3',
      'security': 'bảo mật',
      'privacy': 'bảo mật',
      'regulation': 'quy định',
      'legal': 'quy định',
      'history': 'lịch sử',
      'evolution': 'lịch sử',
      'future': 'tương lai',
      'trend': 'tương lai'
    };
    
    for (const [key, mappedKey] of Object.entries(relatedKeywords)) {
      if (lowerQuestion.includes(key)) {
        return responses[mappedKey];
      }
    }
    
    // Nếu không tìm thấy, trả về gợi ý
    return 'Tôi chỉ có thể trả lời các câu hỏi dựa trên những từ khóa sau: Bitcoin, Ethereum, blockchain, ví điện tử, ngân hàng số, CBDC, DeFi, NFT, sàn giao dịch, thanh toán số, smart contract, Web3, quy định pháp lý, bảo mật và riêng tư trong crypto.';
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { type: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = findBestResponse(input);
      setMessages((prev) => [...prev, { type: 'bot', text: response }]);
      setIsLoading(false);
    }, 800);

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
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-blue-700 p-1 rounded"
                title="Đóng chatbot"
                aria-label="Đóng chatbot"
              >
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
              
              {/* Gợi ý từ khóa khi chưa có tin nhắn nào */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">
                      💡 Gợi ý các chủ đề bạn có thể hỏi:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {keywordSuggestions.slice(0, 6).map((suggestion, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                          onClick={() => setInput(suggestion)}
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 flex justify-start"
                >
                  <div className="bg-white text-slate-800 rounded-lg rounded-bl-none shadow p-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Nhập câu hỏi..."
                  disabled={isLoading}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none ${
                    isLoading
                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                      : 'border-slate-300 focus:border-blue-500'
                  }`}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={isLoading}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                  whileHover={!isLoading ? { scale: 1.05 } : {}}
                  whileTap={!isLoading ? { scale: 0.95 } : {}}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
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

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Heart, Coins, Zap, Play, RotateCcw, Trophy } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import * as Dialog from '@radix-ui/react-dialog';

interface GameState {
  chronoCoin: number;
  matCoin: number;
  lifespan: number;
  qualityOfLife: number;
  energy: number;
  knowledge: number;
  timeLeft: number;
  gameActive: boolean;
  gameEnded: boolean;
  gameWon: boolean;
  score: number;
  powerUpsUsed: {
    fiftyFifty: boolean;
    askAudience: boolean;
    phoneFriend: boolean;
    switchQuestion: boolean;
  };
}

interface GameEvent {
  id: string;
  title: string;
  description: string;
  cost: { chronoCoin?: number; matCoin?: number };
  effect: { 
    lifespan?: number; 
    qualityOfLife?: number; 
    energy?: number; 
    knowledge?: number;
    chronoCoin?: number;
    matCoin?: number;
  };
  type: 'lifespan' | 'quality' | 'energy' | 'knowledge' | 'quiz' | 'trade' | 'mandatory' | 'lottery';
  quizQuestion?: string;
  quizOptions?: string[];
  quizAnswer?: number;
  mandatory?: boolean;
  category?: string;
}

export default function MinigamePage() {
  const [gameState, setGameState] = useState<GameState>({
    chronoCoin: 30,
    matCoin: 30,
    lifespan: 100,
    qualityOfLife: 100,
    energy: 100,
    knowledge: 100,
    timeLeft: 300, // 5 phút
    gameActive: false,
    gameEnded: false,
    gameWon: false,
    score: 0,
    powerUpsUsed: {
      fiftyFifty: false,
      askAudience: false,
      phoneFriend: false,
      switchQuestion: false
    }
  });

  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [lotteryResult, setLotteryResult] = useState<{
    show: boolean;
    effects: { [key: string]: number | string };
    message: string;
  }>({
    show: false,
    effects: {},
    message: ''
  });
  const [showRules, setShowRules] = useState(false);
  const [modalState, setModalState] = useState<{
    show: boolean;
    type: 'askAudience' | 'phoneFriend' | null;
    data: any;
  }>({
    show: false,
    type: null,
    data: null
  });

  // Database các sự kiện game phức tạp
  const gameEvents: GameEvent[] = [
    // Lifespan Events
    {
      id: 'medicine',
      title: '💊 Thuốc kéo dài sự sống',
      description: 'Bạn cần thuốc để duy trì sức khỏe. Trả 8 ChronoCoin để tăng tuổi thọ?',
      cost: { chronoCoin: 8 },
      effect: { lifespan: 20 },
      type: 'lifespan',
      category: 'Health'
    },
    {
      id: 'medical_emergency',
      title: '🚨 Sự cố y tế',
      description: 'Bắt buộc trả 20 ChronoCoin hoặc mất 50% tuổi thọ!',
      cost: { chronoCoin: 20 },
      effect: { lifespan: 30 },
      type: 'mandatory',
      mandatory: true,
      category: 'Emergency'
    },
    {
      id: 'exercise',
      title: '💪 Tập luyện',
      description: 'Tập luyện giúp kéo dài tuổi thọ nhưng tốn năng lượng.',
      cost: { chronoCoin: 5 },
      effect: { lifespan: 15, energy: -10 },
      type: 'lifespan',
      category: 'Health'
    },

    // Quality of Life Events
    {
      id: 'apartment',
      title: '🏠 Căn hộ mới',
      description: 'Căn hộ mới cần 15 MatCoin để cải thiện chất lượng sống.',
      cost: { matCoin: 15 },
      effect: { qualityOfLife: 25 },
      type: 'quality',
      category: 'Housing'
    },
    {
      id: 'food',
      title: '🍎 Thức ăn dinh dưỡng',
      description: 'Thức ăn dinh dưỡng giúp tăng cả sức khỏe và chất lượng sống.',
      cost: { matCoin: 10 },
      effect: { lifespan: 10, qualityOfLife: 15 },
      type: 'quality',
      category: 'Food'
    },
    {
      id: 'technology',
      title: '📱 Công nghệ mới',
      description: 'Công nghệ mới giúp cải thiện chất lượng sống.',
      cost: { matCoin: 20 },
      effect: { qualityOfLife: 30 },
      type: 'quality',
      category: 'Technology'
    },

    // Energy Events
    {
      id: 'rest',
      title: '😴 Nghỉ ngơi',
      description: 'Cơ thể mệt mỏi: Trả 10 ChronoCoin để tăng năng lượng?',
      cost: { chronoCoin: 10 },
      effect: { energy: 20 },
      type: 'energy',
      category: 'Rest'
    },
    {
      id: 'work_stress',
      title: '💼 Căng thẳng công việc',
      description: 'Làm việc quá sức làm giảm năng lượng. Nghỉ ngơi để phục hồi?',
      cost: { chronoCoin: 8 },
      effect: { energy: 25, matCoin: 5 },
      type: 'energy',
      category: 'Work'
    },
    {
      id: 'energy_drink',
      title: '⚡ Nước tăng lực',
      description: 'Nước tăng lực giúp tăng năng lượng tạm thời.',
      cost: { matCoin: 12 },
      effect: { energy: 15, lifespan: -5 },
      type: 'energy',
      category: 'Consumable'
    },

    // Knowledge Events
    {
      id: 'online_course',
      title: '🎓 Khóa học trực tuyến',
      description: 'Cơ hội học hỏi: Trả 15 MatCoin để tăng kiến thức?',
      cost: { matCoin: 15 },
      effect: { knowledge: 25 },
      type: 'knowledge',
      category: 'Education'
    },
    {
      id: 'social_network',
      title: '🌐 Mạng xã hội trả phí',
      description: 'Kết nối với mạng lưới chuyên nghiệp để tăng kiến thức.',
      cost: { matCoin: 20 },
      effect: { knowledge: 30, energy: -5 },
      type: 'knowledge',
      category: 'Social'
    },
    {
      id: 'isolation',
      title: '🏠 Cô lập xã hội',
      description: 'Thiếu tương tác xã hội làm giảm kiến thức. Tham gia hoạt động?',
      cost: { matCoin: 10 },
      effect: { knowledge: 20, energy: -10 },
      type: 'knowledge',
      category: 'Social'
    },

    // Trade Events
    {
      id: 'trade',
      title: '💱 Giao dịch rủi ro',
      description: 'Đổi 10 ChronoCoin lấy 15 MatCoin nhưng mất cơ hội sống lâu hơn.',
      cost: { chronoCoin: 10 },
      effect: { matCoin: 15, lifespan: -5 },
      type: 'trade',
      category: 'Finance'
    },
    {
      id: 'investment',
      title: '📈 Đầu tư thông minh',
      description: 'Đầu tư 20 MatCoin để có cơ hội nhận lại nhiều hơn.',
      cost: { matCoin: 20 },
      effect: { matCoin: 35, knowledge: 10 },
      type: 'trade',
      category: 'Finance'
    },

    // Lottery Events - Cơ hội hay Hình phạt
    {
      id: 'mystery_box',
      title: '🎁 Hộp bí ẩn',
      description: 'Một hộp bí ẩn xuất hiện! Bạn có muốn mở nó không?',
      cost: {},
      effect: {},
      type: 'lottery',
      category: 'Mystery'
    },
    {
      id: 'fortune_teller',
      title: '🔮 Thầy bói',
      description: 'Một thầy bói mời bạn bốc quẻ. Cơ hội hay rủi ro?',
      cost: {},
      effect: {},
      type: 'lottery',
      category: 'Mystery'
    },
    {
      id: 'lucky_draw',
      title: '🎰 Rút thăm may mắn',
      description: 'Tham gia rút thăm may mắn! Bạn có dám thử không?',
      cost: {},
      effect: {},
      type: 'lottery',
      category: 'Mystery'
    },
    {
      id: 'magic_potion',
      title: '🧪 Thuốc thần bí',
      description: 'Một lọ thuốc thần bí xuất hiện. Uống hay không uống?',
      cost: {},
      effect: {},
      type: 'lottery',
      category: 'Mystery'
    },
    {
      id: 'ancient_artifact',
      title: '🏺 Cổ vật cổ đại',
      description: 'Bạn tìm thấy một cổ vật cổ đại. Chạm vào hay bỏ qua?',
      cost: {},
      effect: {},
      type: 'lottery',
      category: 'Mystery'
    }
  ];

  // Database câu hỏi quiz theo 4 nhóm
  const quizQuestions = [
    // Nhóm 1: Lịch sử tiền tệ (15 câu)
    {
      id: 'history_1',
      question: 'Hình thức trao đổi đầu tiên trong lịch sử tiền tệ là gì?',
      options: ['Tiền giấy', 'Trao đổi hàng hóa (barter)', 'Tiền xu', 'Tiền số'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_2',
      question: 'Loại tiền tệ đầu tiên được sử dụng rộng rãi là gì?',
      options: ['Vàng', 'Vỏ sò (cowrie shells)', 'Tiền giấy', 'Thẻ tín dụng'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_3',
      question: 'Tiền xu đầu tiên được đúc ở đâu?',
      options: ['Trung Quốc', 'Ai Cập', 'Lydia (Asia Minor)', 'Ấn Độ'],
      answer: 2,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_4',
      question: 'Tiền giấy đầu tiên được phát hành ở đâu?',
      options: ['Châu Âu', 'Trung Quốc', 'Mỹ', 'Ấn Độ'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_5',
      question: 'Sự kiện nào đánh dấu sự ra đời của đồng đô la Mỹ?',
      options: ['Tuyên ngôn Độc lập 1776', 'Đạo luật Mint Act 1792', 'Nội chiến Mỹ 1861', 'Đại suy thoái 1929'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_6',
      question: 'Vàng trở thành tiêu chuẩn tiền tệ toàn cầu vào thế kỷ nào?',
      options: ['18', '19', '20', '21'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_7',
      question: 'Hệ thống tiền tệ đầu tiên ở châu Mỹ là gì?',
      options: ['Tiền giấy in bởi Anh', 'Bills of credit từ Continental Congress', 'Tiền xu vàng', 'Tiền số'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_8',
      question: 'Spade money là loại tiền tệ cổ của triều đại nào ở Trung Quốc?',
      options: ['Hán', 'Chu', 'Tần', 'Minh'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_9',
      question: 'Sự kiện "Gold Rush" đầu tiên ở Mỹ xảy ra năm nào?',
      options: ['1802', '1849', '1900', '1933'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_10',
      question: 'Tiền tệ đầu tiên được đề cập trong Kinh Thánh là gì?',
      options: ['Vàng', 'Tiền bạc (shekels)', 'Vỏ sò', 'Tiền giấy'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_11',
      question: 'Coinage đầu tiên xuất hiện ở khu vực nào?',
      options: ['Châu Phi', 'Asia Minor', 'Châu Mỹ', 'Châu Âu'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_12',
      question: 'Tiền giấy hiện đại bắt nguồn từ cuộc chiến chống giả mạo ở thế kỷ nào?',
      options: ['7', '10', '15', '18'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_13',
      question: 'Cattle (gia súc) được sử dụng làm tiền tệ từ năm nào?',
      options: ['9000–6000 BC', '1000 BC', '500 AD', '1800 AD'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_14',
      question: 'United States Mint được thành lập năm nào?',
      options: ['1776', '1792', '1833', '1900'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },
    {
      id: 'history_15',
      question: 'Tiền tệ tiến hóa từ kim loại sang giấy do nhu cầu gì?',
      options: ['Dễ mang theo', 'Chống giả mạo', 'Tăng giá trị', 'Kết nối số'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Lịch sử tiền tệ'
    },

    // Nhóm 2: Tiền số hóa là gì (10 câu)
    {
      id: 'digital_1',
      question: 'Tiền số (digital currency) tồn tại dưới dạng gì?',
      options: ['Vật lý như tiền giấy', 'Hoàn toàn điện tử', 'Kim loại quý', 'Hàng hóa trao đổi'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tiền số hóa'
    },
    {
      id: 'digital_2',
      question: 'CBDC là viết tắt của gì?',
      options: ['Central Bank Digital Currency', 'Crypto Blockchain Digital Coin', 'Commercial Bank Deposit Currency', 'Cash-Based Digital Currency'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tiền số hóa'
    },
    {
      id: 'digital_3',
      question: 'Cryptocurrency khác với tiền truyền thống ở điểm nào?',
      options: ['Không cần ngân hàng trung ương', 'Luôn có dạng vật lý', 'Chỉ dùng để trao đổi hàng hóa', 'Được in bởi chính phủ'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tiền số hóa'
    },
    {
      id: 'digital_4',
      question: 'Ví điện tử (digital wallet) dùng để làm gì?',
      options: ['Lưu trữ tiền giấy', 'Chuyển khoản điện tử', 'Đúc tiền xu', 'Trao đổi vàng'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tiền số hóa'
    },
    {
      id: 'digital_5',
      question: 'Tiền số có thể được quy định bởi ai?',
      options: ['Chỉ cá nhân', 'Ngân hàng trung ương hoặc không quy định', 'Chỉ doanh nghiệp', 'Chỉ chính phủ'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tiền số hóa'
    },
    {
      id: 'digital_6',
      question: 'Blockchain dùng để làm gì trong tiền số?',
      options: ['Xác thực giao dịch', 'In tiền giấy', 'Trao đổi hàng hóa', 'Lưu trữ vàng'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tiền số hóa'
    },
    {
      id: 'digital_7',
      question: 'Tiền ảo (virtual currency) không có dạng gì?',
      options: ['Điện tử', 'Vật lý', 'Số hóa', 'Mã hóa'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tiền số hóa'
    },
    {
      id: 'digital_8',
      question: 'Digital money được chuyển giao qua gì?',
      options: ['Máy in', 'Máy tính và mạng', 'Thư tay', 'Xe tải'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tiền số hóa'
    },
    {
      id: 'digital_9',
      question: 'Stablecoins là loại tiền số gì?',
      options: ['Biến động cao', 'Liên kết với tài sản ổn định', 'Chỉ dùng cho game', 'Không mã hóa'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tiền số hóa'
    },
    {
      id: 'digital_10',
      question: 'Tiền số giúp giảm rủi ro gì?',
      options: ['Giả mạo', 'Mất mát vật lý', 'Tất cả các lựa chọn', 'Không có rủi ro'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tiền số hóa'
    },

    // Nhóm 3: Câu chuyện về Bitcoin (10 câu)
    {
      id: 'bitcoin_1',
      question: 'Bitcoin được tạo ra bởi ai?',
      options: ['Elon Musk', 'Satoshi Nakamoto', 'Bill Gates', 'Warren Buffett'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Bitcoin'
    },
    {
      id: 'bitcoin_2',
      question: 'Bitcoin ra đời năm nào?',
      options: ['2008', '2009', '2010', '2011'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Bitcoin'
    },
    {
      id: 'bitcoin_3',
      question: 'Giá Bitcoin lần đầu đạt 1 USD vào năm nào?',
      options: ['2009', '2010', '2011', '2013'],
      answer: 2,
      reward: { chronoCoin: 5 },
      category: 'Bitcoin'
    },
    {
      id: 'bitcoin_4',
      question: 'Sự kiện đầu tiên mua hàng bằng Bitcoin là gì?',
      options: ['Mua xe', 'Mua pizza', 'Mua nhà', 'Mua vàng'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Bitcoin'
    },
    {
      id: 'bitcoin_5',
      question: 'Bitcoin đạt đỉnh giá đầu tiên vào năm nào?',
      options: ['2013', '2017', '2021', '2025'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Bitcoin'
    },
    {
      id: 'bitcoin_6',
      question: 'Blockchain của Bitcoin bắt đầu từ block nào?',
      options: ['Block 0 (Genesis)', 'Block 1', 'Block 100', 'Block 1000'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Bitcoin'
    },
    {
      id: 'bitcoin_7',
      question: 'Bitcoin bị ảnh hưởng lớn bởi sự kiện nào năm 2020?',
      options: ['Đại dịch COVID-19', 'Chiến tranh', 'Bầu cử Mỹ', 'Olympics'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Bitcoin'
    },
    {
      id: 'bitcoin_8',
      question: 'Lịch sử Bitcoin bắt nguồn từ lĩnh vực nào?',
      options: ['Cryptography', 'Ngân hàng', 'Nông nghiệp', 'Du lịch'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Bitcoin'
    },
    {
      id: 'bitcoin_9',
      question: 'Bitcoin lần đầu đạt 10 USD vào tháng nào năm 2011?',
      options: ['Tháng 1', 'Tháng 6', 'Tháng 12', 'Không đạt'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Bitcoin'
    },
    {
      id: 'bitcoin_10',
      question: 'Bitcoin kết thúc năm 2019 với giá khoảng bao nhiêu?',
      options: ['1000 USD', '7200 USD', '10000 USD', '50000 USD'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Bitcoin'
    },

    // Nhóm 4: Tiền trong tương lai (15 câu)
    {
      id: 'future_1',
      question: 'CBDC có thể thay đổi gì trong ngân hàng?',
      options: ['Kết thúc ngân hàng truyền thống', 'Tăng tốc giao dịch', 'Tất cả các lựa chọn', 'Không thay đổi'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_2',
      question: 'Số lượng quốc gia đang khám phá CBDC là bao nhiêu?',
      options: ['50', '114', '200', '300'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_3',
      question: 'CBDC có thể dùng để tạo tiền gì?',
      options: ['Programmable money', 'Tiền giấy mới', 'Vàng kỹ thuật số', 'Hàng hóa'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_4',
      question: 'Xu hướng CBDC tăng mạnh ở khu vực nào?',
      options: ['Châu Âu', 'Thị trường mới nổi', 'Châu Phi', 'Mỹ'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_5',
      question: 'Số lượng giao dịch CBDC dự đoán năm 2031 là bao nhiêu?',
      options: ['1 tỷ', '7.8 tỷ', '100 tỷ', '1 nghìn tỷ'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_6',
      question: 'Blockchain giúp CBDC giảm rủi ro gì?',
      options: ['Thất bại của tổ chức tài chính', 'Lạm phát', 'Chiến tranh', 'Thời tiết'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_7',
      question: 'Digital currencies có thể mở ra kỷ nguyên gì?',
      options: ['Thanh toán toàn cầu mới', 'Trao đổi hàng hóa cũ', 'Tiền giấy', 'Vàng'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_8',
      question: 'Nghiên cứu về tiền tương lai tập trung vào gì?',
      options: ['Digitalisation', 'In tiền giấy', 'Trao đổi vật lý', 'Không thay đổi'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_9',
      question: 'Stablecoins được đề cập trong báo cáo nào?',
      options: ['Future of Money and Payments', 'Wikipedia', 'Kinh Thánh', 'Không có'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_10',
      question: 'CBDC giúp tăng gì cho thị trường mới nổi?',
      options: ['Financial inclusion', 'Lạm phát', 'Nợ nần', 'Chiến tranh'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_11',
      question: 'Tương lai tiền tệ bao gồm gì?',
      options: ['Instant payments', 'Chỉ tiền giấy', 'Trao đổi hàng hóa', 'Không số hóa'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_12',
      question: 'CBDC có thể được sử dụng như gì?',
      options: ['Dạng số của tiền mặt', 'Vàng', 'Hàng hóa', 'Xe hơi'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_13',
      question: 'Xu hướng toàn cầu của CBDC là gì?',
      options: ['Giảm sử dụng tiền mặt', 'Tăng tiền giấy', 'Không thay đổi', 'Chỉ ở Mỹ'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_14',
      question: 'Blockchain trong CBDC giúp gì?',
      options: ['Tạo tiền lập trình', 'In tiền', 'Trao đổi vật lý', 'Không giúp'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },
    {
      id: 'future_15',
      question: 'Tương lai thanh toán tập trung vào gì?',
      options: ['Digital wallets và CBDC', 'Chỉ vàng', 'Tiền giấy', 'Hàng hóa'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Tương lai tiền tệ'
    },

    // Nhóm 5: Cung và Cầu (10 câu)
    {
      id: 'supply_demand_1',
      question: 'Trong kinh tế thị trường, giá cả được xác định chủ yếu bởi yếu tố nào?',
      options: ['Chính phủ', 'Cung và cầu', 'Ngân hàng', 'Công nghệ'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Cung và Cầu'
    },
    {
      id: 'supply_demand_2',
      question: 'Khi cầu tăng mà cung không đổi, điều gì xảy ra với giá?',
      options: ['Giảm', 'Tăng', 'Không đổi', 'Biến mất'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Cung và Cầu'
    },
    {
      id: 'supply_demand_3',
      question: 'Nếu cung vượt cầu, điều gì thường xảy ra?',
      options: ['Giá tăng', 'Giá giảm', 'Sản xuất ngừng', 'Lạm phát'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Cung và Cầu'
    },
    {
      id: 'supply_demand_4',
      question: 'Yếu tố nào sau đây làm tăng cầu trong kinh tế thị trường?',
      options: ['Thu nhập người tiêu dùng giảm', 'Giá sản phẩm tăng', 'Quảng cáo hiệu quả', 'Cung giảm mạnh'],
      answer: 2,
      reward: { chronoCoin: 5 },
      category: 'Cung và Cầu'
    },
    {
      id: 'supply_demand_5',
      question: '"Độ co giãn của cầu" đo lường điều gì?',
      options: ['Sản lượng sản xuất', 'Phản ứng của cầu khi giá thay đổi', 'Chi phí vận chuyển', 'Lợi nhuận doanh nghiệp'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Cung và Cầu'
    },
    {
      id: 'supply_demand_6',
      question: 'Khi giá dầu tăng, cầu cho xe điện thường:',
      options: ['Giảm', 'Tăng', 'Không đổi', 'Biến mất'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Cung và Cầu'
    },
    {
      id: 'supply_demand_7',
      question: 'Cung tăng khi nào?',
      options: ['Chi phí sản xuất giảm', 'Giá sản phẩm giảm', 'Thuế tăng cao', 'Cầu giảm'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Cung và Cầu'
    },
    {
      id: 'supply_demand_8',
      question: 'Trong kinh tế thị trường, "thặng dư tiêu dùng" là gì?',
      options: ['Lợi nhuận của nhà sản xuất', 'Lợi ích người mua nhận khi trả ít hơn giá trị mong muốn', 'Thuế chính phủ thu', 'Chi phí vận chuyển'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Cung và Cầu'
    },
    {
      id: 'supply_demand_9',
      question: 'Khi chính phủ áp giá trần dưới giá thị trường, điều gì xảy ra?',
      options: ['Thặng dư hàng hóa', 'Thiếu hụt hàng hóa', 'Giá tăng vọt', 'Cầu giảm'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Cung và Cầu'
    },
    {
      id: 'supply_demand_10',
      question: 'Yếu tố nào không ảnh hưởng trực tiếp đến cung trong ngắn hạn?',
      options: ['Công nghệ sản xuất', 'Giá nguyên liệu', 'Sở thích tiêu dùng', 'Thuế sản xuất'],
      answer: 2,
      reward: { chronoCoin: 5 },
      category: 'Cung và Cầu'
    },

    // Nhóm 6: Cạnh Tranh và Thị Trường (10 câu)
    {
      id: 'competition_1',
      question: 'Kinh tế thị trường khuyến khích điều gì giữa các doanh nghiệp?',
      options: ['Độc quyền', 'Cạnh tranh', 'Hợp tác duy nhất', 'Giảm sản xuất'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Cạnh Tranh và Thị Trường'
    },
    {
      id: 'competition_2',
      question: 'Thị trường cạnh tranh hoàn hảo có đặc điểm gì?',
      options: ['Một nhà cung cấp duy nhất', 'Nhiều nhà cung cấp với sản phẩm giống nhau', 'Giá cố định bởi chính phủ', 'Không có người mua'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Cạnh Tranh và Thị Trường'
    },
    {
      id: 'competition_3',
      question: 'Độc quyền (monopoly) xảy ra khi:',
      options: ['Nhiều công ty cạnh tranh', 'Một công ty kiểm soát toàn bộ thị trường', 'Giá cả do người tiêu dùng quyết định', 'Cung bằng cầu'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Cạnh Tranh và Thị Trường'
    },
    {
      id: 'competition_4',
      question: 'Trong kinh tế thị trường, "lợi thế cạnh tranh" dựa trên gì?',
      options: ['Giá cao nhất', 'Sản phẩm/dịch vụ tốt hơn hoặc rẻ hơn', 'Thuế thấp', 'Quy định chính phủ'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Cạnh Tranh và Thị Trường'
    },
    {
      id: 'competition_5',
      question: 'Thị trường oligopoly có đặc điểm gì?',
      options: ['Một nhà cung cấp', 'Vài nhà cung cấp lớn', 'Nhiều nhà cung cấp nhỏ', 'Không có cạnh tranh'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Cạnh Tranh và Thị Trường'
    },
    {
      id: 'competition_6',
      question: 'Cạnh tranh trong kinh tế thị trường dẫn đến gì?',
      options: ['Giá cao hơn', 'Đổi mới và hiệu quả', 'Giảm chất lượng', 'Tăng độc quyền'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Cạnh Tranh và Thị Trường'
    },
    {
      id: 'competition_7',
      question: 'Thị trường chứng khoán là nơi gì?',
      options: ['Mua bán hàng hóa vật lý', 'Mua bán cổ phiếu và trái phiếu', 'Trao đổi tiền ảo', 'Bán vàng'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Cạnh Tranh và Thị Trường'
    },
    {
      id: 'competition_8',
      question: '"Thất bại thị trường" xảy ra khi:',
      options: ['Giá bằng cung cầu', 'Thị trường không phân bổ tài nguyên hiệu quả', 'Cạnh tranh tăng cao', 'Lợi nhuận đạt tối đa'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Cạnh Tranh và Thị Trường'
    },
    {
      id: 'competition_9',
      question: 'Trong kinh tế thị trường, ai quyết định sản xuất gì?',
      options: ['Chính phủ', 'Doanh nghiệp dựa trên nhu cầu người tiêu dùng', 'Ngân hàng trung ương', 'Nhà đầu tư nước ngoài'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Cạnh Tranh và Thị Trường'
    },
    {
      id: 'competition_10',
      question: 'Yếu tố nào làm giảm cạnh tranh trong thị trường?',
      options: ['Nhiều công ty tham gia', 'Rào cản gia nhập cao', 'Giá thấp', 'Sản phẩm đa dạng'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Cạnh Tranh và Thị Trường'
    },

    // Nhóm 7: Lạm Phát và Suy Thoái (10 câu)
    {
      id: 'inflation_1',
      question: 'Lạm phát là gì trong kinh tế thị trường?',
      options: ['Giá cả giảm liên tục', 'Giá cả tăng liên tục', 'Sản xuất tăng', 'Cầu giảm'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lạm Phát và Suy Thoái'
    },
    {
      id: 'inflation_2',
      question: 'Lạm phát cao ảnh hưởng thế nào đến tiền tệ?',
      options: ['Tăng giá trị tiền', 'Giảm sức mua của tiền', 'Không ảnh hưởng', 'Giảm cung tiền'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lạm Phát và Suy Thoái'
    },
    {
      id: 'inflation_3',
      question: 'Suy thoái kinh tế được định nghĩa bởi:',
      options: ['Tăng trưởng GDP liên tục', 'Giảm GDP trong 2 quý liên tiếp', 'Giá cả tăng vọt', 'Cạnh tranh giảm'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lạm Phát và Suy Thoái'
    },
    {
      id: 'inflation_4',
      question: 'Ngân hàng trung ương giảm lãi suất để làm gì?',
      options: ['Tăng lạm phát', 'Kích thích kinh tế', 'Giảm cung tiền', 'Tăng giá hàng hóa'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lạm Phát và Suy Thoái'
    },
    {
      id: 'inflation_5',
      question: '"Hyperinflation" xảy ra khi lạm phát đạt mức:',
      options: ['1-2% mỗi năm', 'Trên 50% mỗi tháng', '10% mỗi quý', 'Không thay đổi'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lạm Phát và Suy Thoái'
    },
    {
      id: 'inflation_6',
      question: 'Trong suy thoái, điều gì thường tăng?',
      options: ['Việc làm', 'Thất nghiệp', 'Lạm phát', 'Đầu tư'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lạm Phát và Suy Thoái'
    },
    {
      id: 'inflation_7',
      question: 'Lạm phát do cầu kéo (demand-pull) xảy ra khi:',
      options: ['Chi phí sản xuất tăng', 'Người tiêu dùng chi tiêu nhiều hơn cung', 'Chính phủ tăng thuế', 'Cung tiền giảm'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lạm Phát và Suy Thoái'
    },
    {
      id: 'inflation_8',
      question: 'Chính sách nào giúp kiểm soát lạm phát?',
      options: ['Giảm lãi suất', 'Tăng lãi suất', 'Giảm thuế', 'Tăng chi tiêu chính phủ'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lạm Phát và Suy Thoái'
    },
    {
      id: 'inflation_9',
      question: 'Suy thoái kinh tế thường dẫn đến:',
      options: ['Tăng giá hàng hóa', 'Giảm đầu tư doanh nghiệp', 'Tăng cung tiền', 'Giảm thất nghiệp'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lạm Phát và Suy Thoái'
    },
    {
      id: 'inflation_10',
      question: '"Stagflation" là gì?',
      options: ['Lạm phát cao và tăng trưởng kinh tế', 'Lạm phát cao và suy thoái', 'Giá giảm và tăng trưởng', 'Không có lạm phát'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Lạm Phát và Suy Thoái'
    },

    // Nhóm 8: Đầu Tư và Tài Chính Thị Trường (10 câu)
    {
      id: 'investment_1',
      question: 'Trong kinh tế thị trường, "đầu tư" thường nhằm mục đích gì?',
      options: ['Giảm giá hàng hóa', 'Tạo lợi nhuận trong tương lai', 'Tăng thuế', 'Giảm cầu'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Đầu Tư và Tài Chính Thị Trường'
    },
    {
      id: 'investment_2',
      question: 'Thị trường tài chính giúp gì cho kinh tế?',
      options: ['Phân bổ vốn hiệu quả', 'Tăng lạm phát', 'Giảm sản xuất', 'Ngăn chặn cạnh tranh'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Đầu Tư và Tài Chính Thị Trường'
    },
    {
      id: 'investment_3',
      question: 'Cổ phiếu đại diện cho gì trong một công ty?',
      options: ['Nợ của công ty', 'Quyền sở hữu một phần công ty', 'Lợi nhuận cố định', 'Hàng hóa sản xuất'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Đầu Tư và Tài Chính Thị Trường'
    },
    {
      id: 'investment_4',
      question: 'Trái phiếu là gì?',
      options: ['Quyền sở hữu công ty', 'Khoản vay cho công ty hoặc chính phủ', 'Tiền tệ số', 'Hàng hóa vật lý'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Đầu Tư và Tài Chính Thị Trường'
    },
    {
      id: 'investment_5',
      question: '"Rủi ro đầu tư" liên quan đến điều gì?',
      options: ['Lợi nhuận cố định', 'Khả năng mất tiền hoặc không đạt lợi nhuận kỳ vọng', 'Giá hàng hóa tăng', 'Cung tăng'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Đầu Tư và Tài Chính Thị Trường'
    },
    {
      id: 'investment_6',
      question: 'Trong kinh tế thị trường, "bong bóng tài chính" là gì?',
      options: ['Giá tài sản tăng quá cao so với giá trị thực', 'Giá tài sản giảm đột ngột', 'Tăng cung tiền', 'Giảm lạm phát'],
      answer: 0,
      reward: { matCoin: 5 },
      category: 'Đầu Tư và Tài Chính Thị Trường'
    },
    {
      id: 'investment_7',
      question: 'Quỹ đầu tư mạo hiểm (venture capital) thường đầu tư vào:',
      options: ['Công ty lớn ổn định', 'Startup công nghệ mới', 'Ngân hàng trung ương', 'Hàng hóa vật lý'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Đầu Tư và Tài Chính Thị Trường'
    },
    {
      id: 'investment_8',
      question: '"Lợi nhuận kép" (compound interest) hoạt động thế nào?',
      options: ['Chỉ tính trên vốn ban đầu', 'Tính lãi trên cả vốn và lãi tích lũy', 'Không tạo lợi nhuận', 'Giảm giá trị đầu tư'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Đầu Tư và Tài Chính Thị Trường'
    },
    {
      id: 'investment_9',
      question: 'Thị trường "bull market" là gì?',
      options: ['Giá tài sản giảm liên tục', 'Giá tài sản tăng liên tục', 'Không có giao dịch', 'Lạm phát tăng'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Đầu Tư và Tài Chính Thị Trường'
    },
    {
      id: 'investment_10',
      question: '"Diversification" trong đầu tư là gì?',
      options: ['Đầu tư vào một tài sản duy nhất', 'Phân bổ đầu tư vào nhiều tài sản để giảm rủi ro', 'Tăng lãi suất', 'Giảm cung tiền'],
      answer: 1,
      reward: { matCoin: 5 },
      category: 'Đầu Tư và Tài Chính Thị Trường'
    },

    // Nhóm 9: Chính Sách và Toàn Cầu Hóa (10 câu)
    {
      id: 'policy_1',
      question: 'Trong kinh tế thị trường, chính phủ can thiệp để làm gì?',
      options: ['Loại bỏ cạnh tranh', 'Sửa thất bại thị trường (như ô nhiễm)', 'Tăng độc quyền', 'Giảm cung'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Chính Sách và Toàn Cầu Hóa'
    },
    {
      id: 'policy_2',
      question: 'Toàn cầu hóa trong kinh tế thị trường dẫn đến gì?',
      options: ['Giảm thương mại quốc tế', 'Tăng giao thương giữa các quốc gia', 'Giảm cạnh tranh', 'Tăng độc quyền'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Chính Sách và Toàn Cầu Hóa'
    },
    {
      id: 'policy_3',
      question: 'Thuế nhập khẩu cao có thể làm gì?',
      options: ['Tăng giá hàng hóa nhập khẩu', 'Giảm giá hàng hóa nội địa', 'Tăng lạm phát', 'Giảm đầu tư'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Chính Sách và Toàn Cầu Hóa'
    },
    {
      id: 'policy_4',
      question: '"Tự do thương mại" trong kinh tế thị trường là gì?',
      options: ['Loại bỏ rào cản thương mại giữa các quốc gia', 'Tăng thuế nhập khẩu', 'Giảm xuất khẩu', 'Tăng độc quyền'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Chính Sách và Toàn Cầu Hóa'
    },
    {
      id: 'policy_5',
      question: 'Ngân hàng trung ương điều chỉnh cung tiền để:',
      options: ['Tăng sản xuất hàng hóa', 'Ổn định kinh tế', 'Giảm cạnh tranh', 'Tăng giá hàng hóa'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Chính Sách và Toàn Cầu Hóa'
    },
    {
      id: 'policy_6',
      question: 'Hiệp định thương mại tự do (FTA) có lợi ích gì?',
      options: ['Tăng thuế nhập khẩu', 'Giảm chi phí thương mại giữa các nước', 'Giảm xuất khẩu', 'Tăng lạm phát'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Chính Sách và Toàn Cầu Hóa'
    },
    {
      id: 'policy_7',
      question: 'Toàn cầu hóa có thể làm tăng:',
      options: ['Bất bình đẳng thu nhập', 'Giảm cạnh tranh', 'Tăng độc quyền', 'Giảm đầu tư'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Chính Sách và Toàn Cầu Hóa'
    },
    {
      id: 'policy_8',
      question: '"Chính sách tài khóa" liên quan đến gì?',
      options: ['Điều chỉnh lãi suất', 'Chi tiêu và thuế của chính phủ', 'Tăng cung tiền', 'Giảm sản xuất'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Chính Sách và Toàn Cầu Hóa'
    },
    {
      id: 'policy_9',
      question: 'Kinh tế thị trường toàn cầu phụ thuộc nhiều vào:',
      options: ['Công nghệ và thương mại', 'Chỉ sản xuất nội địa', 'Giảm giao thương', 'Tăng thuế'],
      answer: 0,
      reward: { chronoCoin: 5 },
      category: 'Chính Sách và Toàn Cầu Hóa'
    },
    {
      id: 'policy_10',
      question: '"Rủi ro hệ thống" trong kinh tế thị trường là gì?',
      options: ['Rủi ro từ một công ty', 'Rủi ro ảnh hưởng toàn bộ thị trường tài chính', 'Giảm giá hàng hóa', 'Tăng cung tiền'],
      answer: 1,
      reward: { chronoCoin: 5 },
      category: 'Chính Sách và Toàn Cầu Hóa'
    }
  ];

  // Tạo particle effect
  const createParticles = useCallback((x: number, y: number) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1000);
  }, []);

  // Game timer và giảm dần tất cả tài nguyên
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameEnded) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        
        // Giảm tài nguyên theo thời gian
        const newLifespan = Math.max(0, prev.lifespan - 0.3); // Giảm 0.3%/giây
        const newQualityOfLife = Math.max(0, prev.qualityOfLife - 0.2); // Giảm 0.2%/giây
        const newEnergy = Math.max(0, prev.energy - 0.4); // Giảm 0.4%/giây (nhanh nhất)
        const newKnowledge = Math.max(0, prev.knowledge - 0.1); // Giảm 0.1%/giây (chậm nhất)
        
        // Game over conditions
        if (newTimeLeft <= 0 || newLifespan <= 0 || newQualityOfLife <= 0 || newEnergy <= 0 || newKnowledge <= 0) {
          const isWin = newTimeLeft <= 0 && 
                       newLifespan >= 50 && 
                       newQualityOfLife >= 50 && 
                       newEnergy >= 50 && 
                       newKnowledge >= 50 && 
                       (prev.chronoCoin + prev.matCoin) >= 60;
          
          return {
            ...prev,
            timeLeft: 0,
            lifespan: Math.max(0, newLifespan),
            qualityOfLife: Math.max(0, newQualityOfLife),
            energy: Math.max(0, newEnergy),
            knowledge: Math.max(0, newKnowledge),
            gameActive: false,
            gameEnded: true,
            gameWon: isWin,
            score: prev.chronoCoin + prev.matCoin + Math.floor(prev.lifespan) + Math.floor(prev.qualityOfLife) + Math.floor(prev.energy) + Math.floor(prev.knowledge)
          };
        }

        return {
          ...prev,
          timeLeft: newTimeLeft,
          lifespan: newLifespan,
          qualityOfLife: newQualityOfLife,
          energy: newEnergy,
          knowledge: newKnowledge
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameActive, gameState.gameEnded]);

  // Random events
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameEnded || currentEvent) return;

    console.log('Setting up random event timer...'); // Debug log

    const eventTimer = setTimeout(() => {
      console.log('Random event timer triggered!'); // Debug log
      
      // 70% chance cho quiz, 30% cho các sự kiện khác
      const isQuiz = Math.random() < 0.7;
      
      if (isQuiz) {
        // Chọn random quiz question
        const randomQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
        const quizEvent: GameEvent = {
          id: randomQuiz.id,
          title: `🧠 ${randomQuiz.category}`,
          description: 'Trả lời đúng để nhận coin!',
          type: 'quiz',
          cost: {},
          effect: {},
          quizQuestion: randomQuiz.question,
          quizOptions: randomQuiz.options,
          quizAnswer: randomQuiz.answer
        };
        console.log('Setting quiz event:', quizEvent.title); // Debug log
        setCurrentEvent(quizEvent);
      } else {
        // Chọn random game event
        const randomEvent = gameEvents[Math.floor(Math.random() * gameEvents.length)];
        console.log('Setting game event:', randomEvent.title); // Debug log
        setCurrentEvent(randomEvent);
      }
      
      setShowQuiz(isQuiz);
    }, Math.random() * 5000 + 2000); // 2-7 giây (nhanh hơn)

    return () => {
      console.log('Clearing event timer'); // Debug log
      clearTimeout(eventTimer);
    };
  }, [gameState.gameActive, gameState.gameEnded, currentEvent]);

  // Trigger first event immediately when game starts
  useEffect(() => {
    if (gameState.gameActive && !gameState.gameEnded && !currentEvent) {
      console.log('Game started, triggering first event...'); // Debug log
      
      // Trigger first event after a short delay
      const firstEventTimer = setTimeout(() => {
        const isQuiz = Math.random() < 0.7;
        
        if (isQuiz) {
          const randomQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
          const quizEvent: GameEvent = {
            id: randomQuiz.id,
            title: `🧠 ${randomQuiz.category}`,
            description: 'Trả lời đúng để nhận coin!',
            type: 'quiz',
            cost: {},
            effect: {},
            quizQuestion: randomQuiz.question,
            quizOptions: randomQuiz.options,
            quizAnswer: randomQuiz.answer
          };
          console.log('First event - Quiz:', quizEvent.title);
          setCurrentEvent(quizEvent);
        } else {
          const randomEvent = gameEvents[Math.floor(Math.random() * gameEvents.length)];
          console.log('First event - Game event:', randomEvent.title);
          setCurrentEvent(randomEvent);
        }
        
        setShowQuiz(isQuiz);
      }, 1000); // 1 giây sau khi game bắt đầu

      return () => clearTimeout(firstEventTimer);
    }
  }, [gameState.gameActive, gameState.gameEnded, currentEvent]);

  const startGame = () => {
    setGameState({
      chronoCoin: 30,
      matCoin: 30,
      lifespan: 100,
      qualityOfLife: 100,
      energy: 100,
      knowledge: 100,
      timeLeft: 300, // 5 phút
      gameActive: true,
      gameEnded: false,
      gameWon: false,
      score: 0,
      powerUpsUsed: {
        fiftyFifty: false,
        askAudience: false,
        phoneFriend: false,
        switchQuestion: false
      }
    });
    setCurrentEvent(null);
    setShowQuiz(false);
    setQuizAnswer(null);
    setEliminatedOptions([]);
  };

  const resetGame = () => {
    setGameState({
      chronoCoin: 30,
      matCoin: 30,
      lifespan: 100,
      qualityOfLife: 100,
      energy: 100,
      knowledge: 100,
      timeLeft: 300, // 5 phút
      gameActive: true, // Tự động bắt đầu game
      gameEnded: false,
      gameWon: false,
      score: 0,
      powerUpsUsed: {
        fiftyFifty: false,
        askAudience: false,
        phoneFriend: false,
        switchQuestion: false
      }
    });
    setCurrentEvent(null);
    setShowQuiz(false);
    setQuizAnswer(null);
    setEliminatedOptions([]);
  };

  const handleEventChoice = (accept: boolean) => {
    if (!currentEvent) return;

    if (accept) {
      // Kiểm tra đủ tiền không
      const hasEnoughChrono = !currentEvent.cost.chronoCoin || gameState.chronoCoin >= currentEvent.cost.chronoCoin;
      const hasEnoughMat = !currentEvent.cost.matCoin || gameState.matCoin >= currentEvent.cost.matCoin;

      if (hasEnoughChrono && hasEnoughMat) {
        setGameState(prev => ({
          ...prev,
          chronoCoin: prev.chronoCoin - (currentEvent.cost.chronoCoin || 0) + (currentEvent.effect.chronoCoin || 0),
          matCoin: prev.matCoin - (currentEvent.cost.matCoin || 0) + (currentEvent.effect.matCoin || 0),
          lifespan: Math.min(100, Math.max(0, prev.lifespan + (currentEvent.effect.lifespan || 0))),
          qualityOfLife: Math.min(100, Math.max(0, prev.qualityOfLife + (currentEvent.effect.qualityOfLife || 0))),
          energy: Math.min(100, Math.max(0, prev.energy + (currentEvent.effect.energy || 0))),
          knowledge: Math.min(100, Math.max(0, prev.knowledge + (currentEvent.effect.knowledge || 0)))
        }));

        // Particle effect
        createParticles(400, 300);
      } else {
        alert('Không đủ tiền để thực hiện hành động này!');
        return;
      }
    } else {
      // Hậu quả của việc từ chối
      if (currentEvent.type === 'mandatory') {
        // Sự kiện bắt buộc - áp dụng hậu quả nặng
        setGameState(prev => ({
          ...prev,
          lifespan: Math.max(0, prev.lifespan - 50),
          qualityOfLife: Math.max(0, prev.qualityOfLife - 30),
          energy: Math.max(0, prev.energy - 40),
          knowledge: Math.max(0, prev.knowledge - 20)
        }));
      } else {
        // Sự kiện thường - áp dụng hậu quả nhẹ
        setGameState(prev => ({
          ...prev,
          lifespan: Math.max(0, prev.lifespan - 10),
          qualityOfLife: Math.max(0, prev.qualityOfLife - 10),
          energy: Math.max(0, prev.energy - 15),
          knowledge: Math.max(0, prev.knowledge - 5)
        }));
      }
    }

    setCurrentEvent(null);
    setShowQuiz(false);
    setQuizAnswer(null);
  };

  const handleLotteryDraw = () => {
    if (!currentEvent) return;

    // Tạo kết quả ngẫu nhiên
    const possibleEffects = [
      // Hiệu ứng tích cực
      { lifespan: 20, message: "✨ Tuổi thọ tăng lên!" },
      { qualityOfLife: 25, message: "🏠 Chất lượng sống cải thiện!" },
      { energy: 30, message: "⚡ Năng lượng tràn đầy!" },
      { knowledge: 20, message: "🧠 Kiến thức mở rộng!" },
      { chronoCoin: 15, message: "💰 Nhận được ChronoCoin!" },
      { matCoin: 20, message: "💎 Nhận được MatCoin!" },
      
      // Hiệu ứng tiêu cực
      { lifespan: -15, message: "💀 Tuổi thọ giảm đi..." },
      { qualityOfLife: -20, message: "😞 Chất lượng sống kém đi..." },
      { energy: -25, message: "😴 Cảm thấy mệt mỏi..." },
      { knowledge: -15, message: "🤯 Kiến thức bị mất..." },
      { chronoCoin: -10, message: "💸 Mất ChronoCoin..." },
      { matCoin: -12, message: "💸 Mất MatCoin..." },
      
      // Hiệu ứng hỗn hợp
      { lifespan: 10, energy: -10, message: "⚖️ Cân bằng sức khỏe và năng lượng" },
      { qualityOfLife: 15, knowledge: -8, message: "🎭 Đánh đổi chất lượng sống và kiến thức" },
      { chronoCoin: 8, matCoin: -5, message: "🔄 Chuyển đổi tiền tệ" },
      { energy: 20, lifespan: -5, message: "⚡ Năng lượng tăng nhưng tuổi thọ giảm" }
    ];

    // Chọn ngẫu nhiên một hiệu ứng
    const randomEffect = possibleEffects[Math.floor(Math.random() * possibleEffects.length)];
    
    // Áp dụng hiệu ứng vào game state
    setGameState(prev => {
      const newState = { ...prev };
      
      // Áp dụng từng hiệu ứng
      Object.entries(randomEffect).forEach(([key, value]) => {
        if (key !== 'message' && typeof value === 'number') {
          if (key === 'lifespan') {
            newState.lifespan = Math.max(0, Math.min(100, prev.lifespan + value));
          } else if (key === 'qualityOfLife') {
            newState.qualityOfLife = Math.max(0, Math.min(100, prev.qualityOfLife + value));
          } else if (key === 'energy') {
            newState.energy = Math.max(0, Math.min(100, prev.energy + value));
          } else if (key === 'knowledge') {
            newState.knowledge = Math.max(0, Math.min(100, prev.knowledge + value));
          } else if (key === 'chronoCoin') {
            newState.chronoCoin = Math.max(0, prev.chronoCoin + value);
          } else if (key === 'matCoin') {
            newState.matCoin = Math.max(0, prev.matCoin + value);
          }
        }
      });
      
      return newState;
    });

    // Hiển thị kết quả
    const { message, ...effects } = randomEffect;
    const filteredEffects = Object.fromEntries(
      Object.entries(effects).filter(([_, value]) => typeof value === 'number')
    );
    setLotteryResult({
      show: true,
      effects: filteredEffects,
      message: message
    });

    // Tạo particle effect nếu có hiệu ứng tích cực
    const hasPositiveEffect = Object.entries(randomEffect).some(([key, value]) => 
      key !== 'message' && typeof value === 'number' && value > 0
    );
    
    if (hasPositiveEffect) {
      createParticles(400, 300);
    }

    // Ẩn kết quả sau 3 giây và đóng sự kiện
    setTimeout(() => {
      setLotteryResult({ show: false, effects: {}, message: '' });
      setCurrentEvent(null);
    }, 3000);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setQuizAnswer(answerIndex);
    
    if (currentEvent && answerIndex === currentEvent.quizAnswer) {
      // Đúng - nhận cả ChronoCoin và MatCoin
      setGameState(prev => ({
        ...prev,
        chronoCoin: prev.chronoCoin + 5,
        matCoin: prev.matCoin + 5
      }));
      createParticles(400, 300);
    } else {
      // Sai - mất tài nguyên ngẫu nhiên và mất tiền ngẫu nhiên
      const randomResource = Math.floor(Math.random() * 4);
      const randomMoneyLoss = Math.floor(Math.random() * 6) + 10; // 10-15 đơn vị
      const randomCoinType = Math.random() < 0.5 ? 'chronoCoin' : 'matCoin';
      
      setGameState(prev => {
        const newState = { ...prev };
        
        // Mất tài nguyên ngẫu nhiên
        switch (randomResource) {
          case 0:
            newState.lifespan = Math.max(0, prev.lifespan - 5);
            break;
          case 1:
            newState.qualityOfLife = Math.max(0, prev.qualityOfLife - 5);
            break;
          case 2:
            newState.energy = Math.max(0, prev.energy - 5);
            break;
          case 3:
            newState.knowledge = Math.max(0, prev.knowledge - 5);
            break;
        }
        
        // Mất tiền ngẫu nhiên
        if (randomCoinType === 'chronoCoin') {
          newState.chronoCoin = Math.max(0, prev.chronoCoin - randomMoneyLoss);
        } else {
          newState.matCoin = Math.max(0, prev.matCoin - randomMoneyLoss);
        }
        
        return newState;
      });
    }

    setTimeout(() => {
      setCurrentEvent(null);
      setShowQuiz(false);
      setQuizAnswer(null);
      setEliminatedOptions([]);
    }, 2000);
  };

  const getConsequenceInfo = (event: GameEvent) => {
    // Hậu quả cho sự kiện bắt buộc
    if (event.type === 'mandatory') {
      return {
        lifespan: 50,
        qualityOfLife: 30,
        energy: 40,
        knowledge: 20,
        text: "Hậu quả nặng!"
      };
    }

    // Hậu quả đặc biệt dựa trên nội dung sự kiện
    const title = event.title.toLowerCase();
    const description = event.description.toLowerCase();

    // Sự kiện y tế - hậu quả nghiêm trọng về sức khỏe
    if (title.includes('thuốc') || title.includes('bệnh') || title.includes('y tế') || 
        description.includes('thuốc') || description.includes('bệnh')) {
      return {
        lifespan: 35,
        qualityOfLife: 10,
        energy: 20,
        knowledge: 0,
        text: "Bệnh tật nghiêm trọng"
      };
    }

    // Sự kiện nhà ở - hậu quả về chất lượng sống
    if (title.includes('nhà') || title.includes('căn hộ') || title.includes('chỗ ở') ||
        description.includes('nhà') || description.includes('căn hộ')) {
      return {
        lifespan: 5,
        qualityOfLife: 30,
        energy: 10,
        knowledge: 0,
        text: "Sống trong điều kiện kém"
      };
    }

    // Sự kiện thức ăn - hậu quả về năng lượng và sức khỏe
    if (title.includes('thức ăn') || title.includes('đồ ăn') || title.includes('thực phẩm') ||
        description.includes('thức ăn') || description.includes('đồ ăn')) {
      return {
        lifespan: 15,
        qualityOfLife: 20,
        energy: 25,
        knowledge: 0,
        text: "Thiếu dinh dưỡng"
      };
    }

    // Sự kiện tập thể dục - hậu quả về năng lượng
    if (title.includes('tập') || title.includes('gym') || title.includes('thể dục') ||
        description.includes('tập') || description.includes('gym')) {
      return {
        lifespan: 10,
        qualityOfLife: 5,
        energy: 40,
        knowledge: 0,
        text: "Thể lực yếu"
      };
    }

    // Sự kiện công nghệ - hậu quả về kiến thức
    if (title.includes('công nghệ') || title.includes('máy tính') || title.includes('internet') ||
        description.includes('công nghệ') || description.includes('máy tính')) {
      return {
        lifespan: 0,
        qualityOfLife: 5,
        energy: 5,
        knowledge: 30,
        text: "Lạc hậu công nghệ"
      };
    }

    // Sự kiện giao dịch - hậu quả cân bằng
    if (title.includes('giao dịch') || title.includes('đầu tư') || title.includes('kinh doanh') ||
        description.includes('giao dịch') || description.includes('đầu tư')) {
      return {
        lifespan: 10,
        qualityOfLife: 15,
        energy: 10,
        knowledge: 15,
        text: "Mất cơ hội tài chính"
      };
    }

    // Hậu quả mặc định dựa trên loại sự kiện
    switch (event.type) {
      case 'lifespan':
        return {
          lifespan: 25,
          qualityOfLife: 5,
          energy: 10,
          knowledge: 0,
          text: "Sức khỏe suy giảm"
        };
      
      case 'quality':
        return {
          lifespan: 5,
          qualityOfLife: 20,
          energy: 5,
          knowledge: 0,
          text: "Chất lượng sống kém"
        };
      
      case 'energy':
        return {
          lifespan: 10,
          qualityOfLife: 5,
          energy: 30,
          knowledge: 5,
          text: "Kiệt sức"
        };
      
      case 'knowledge':
        return {
          lifespan: 0,
          qualityOfLife: 0,
          energy: 5,
          knowledge: 25,
          text: "Thiếu kiến thức"
        };
      
      case 'trade':
        return {
          lifespan: 15,
          qualityOfLife: 15,
          energy: 10,
          knowledge: 10,
          text: "Mất cơ hội"
        };
      
      case 'quiz':
        return {
          lifespan: 0,
          qualityOfLife: 0,
          energy: 0,
          knowledge: 0,
          text: "Không có hậu quả"
        };
      
      case 'lottery':
        return {
          lifespan: 0,
          qualityOfLife: 0,
          energy: 0,
          knowledge: 0,
          text: "Không có hậu quả"
        };
      
      default:
        return {
          lifespan: 10,
          qualityOfLife: 10,
          energy: 10,
          knowledge: 5,
          text: "Hậu quả nhẹ"
        };
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Power-up functions
  const useFiftyFifty = () => {
    if (gameState.powerUpsUsed.fiftyFifty || !currentEvent?.quizOptions) return;
    
    const correctAnswer = currentEvent.quizAnswer!;
    const wrongAnswers = currentEvent.quizOptions
      .map((_, index) => index)
      .filter(index => index !== correctAnswer);
    
    // Chọn 2 đáp án sai để loại bỏ
    const toEliminate = wrongAnswers.slice(0, 2);
    setEliminatedOptions(toEliminate);
    
    setGameState(prev => ({
      ...prev,
      chronoCoin: prev.chronoCoin - 5,
      powerUpsUsed: { ...prev.powerUpsUsed, fiftyFifty: true }
    }));
  };

  const useAskAudience = () => {
    if (gameState.powerUpsUsed.askAudience || !currentEvent?.quizOptions) return;
    
    // Hiển thị modal với kết quả "khán giả"
    const correctAnswer = currentEvent.quizAnswer!;
    const audienceResults = currentEvent.quizOptions.map((_, index) => {
      if (index === correctAnswer) {
        return Math.floor(Math.random() * 20) + 50; // 50-70% cho đáp án đúng
      }
      return Math.floor(Math.random() * 30) + 10; // 10-40% cho đáp án sai
    });
    
    // Normalize để tổng = 100%
    const total = audienceResults.reduce((sum, val) => sum + val, 0);
    const normalizedResults = audienceResults.map(val => Math.round((val / total) * 100));
    
    // Hiển thị modal với kết quả
    setModalState({
      show: true,
      type: 'askAudience',
      data: {
        results: normalizedResults,
        options: currentEvent.quizOptions
      }
    });
    
    setGameState(prev => ({
      ...prev,
      matCoin: prev.matCoin - 10,
      powerUpsUsed: { ...prev.powerUpsUsed, askAudience: true }
    }));
  };

  const usePhoneFriend = () => {
    if (gameState.powerUpsUsed.phoneFriend || !currentEvent?.quizOptions) return;
    
    const correctAnswer = currentEvent.quizAnswer!;
    const correctLetter = String.fromCharCode(65 + correctAnswer);
    
    // 80% chance đưa ra đáp án đúng
    const isCorrect = Math.random() < 0.8;
    const suggestedAnswer = isCorrect ? correctLetter : 
      String.fromCharCode(65 + Math.floor(Math.random() * currentEvent.quizOptions.length));
    
    // Hiển thị modal với gợi ý từ bạn
    setModalState({
      show: true,
      type: 'phoneFriend',
      data: {
        suggestedAnswer,
        isCorrect,
        correctAnswer: correctLetter
      }
    });
    
    setGameState(prev => ({
      ...prev,
      chronoCoin: prev.chronoCoin - 8,
      powerUpsUsed: { ...prev.powerUpsUsed, phoneFriend: true }
    }));
  };

  const useSwitchQuestion = () => {
    if (gameState.powerUpsUsed.switchQuestion) return;
    
    // Chọn câu hỏi mới
    const randomQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    const newQuizEvent: GameEvent = {
      id: randomQuiz.id,
      title: `🧠 ${randomQuiz.category}`,
      description: 'Trả lời đúng để nhận coin!',
      type: 'quiz',
      cost: {},
      effect: {},
      quizQuestion: randomQuiz.question,
      quizOptions: randomQuiz.options,
      quizAnswer: randomQuiz.answer
    };
    
    setCurrentEvent(newQuizEvent);
    setEliminatedOptions([]);
    
    setGameState(prev => ({
      ...prev,
      matCoin: prev.matCoin - 15,
      powerUpsUsed: { ...prev.powerUpsUsed, switchQuestion: true }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Thời Đại Tiền Tệ Kép
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-blue-500 mx-auto mb-6"></div>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Sống và Sở Hữu - Quản lý ChronoCoin và MatCoin để cân bằng giữa sự sống và chất lượng cuộc sống
          </p>
        </motion.div>

        {/* Game Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 mb-8"
        >
          {!gameState.gameActive && !gameState.gameEnded && (
            <div className="flex gap-4">
              <motion.button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Bắt đầu Game
              </motion.button>
              
              <motion.button
                onClick={() => setShowRules(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Luật chơi
              </motion.button>
            </div>
          )}
          
          {(gameState.gameActive || gameState.gameEnded) && (
            <motion.button
              onClick={resetGame}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-5 h-5" />
              Chơi lại
            </motion.button>
          )}
        </motion.div>

        {/* Game Stats - 4 Tài nguyên */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* ChronoCoin */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm">ChronoCoin</span>
            </div>
            <div className="text-xl font-bold text-white">{gameState.chronoCoin}</div>
            <div className="text-xs text-slate-300">Thời gian sống</div>
          </div>

          {/* MatCoin */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold text-sm">MatCoin</span>
            </div>
            <div className="text-xl font-bold text-white">{gameState.matCoin}</div>
            <div className="text-xs text-slate-300">Vật chất</div>
          </div>

          {/* Lifespan */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold text-sm">Tuổi thọ</span>
            </div>
            <div className="text-xl font-bold text-white">{Math.floor(gameState.lifespan)}%</div>
            <Progress.Root className="relative overflow-hidden bg-slate-700 rounded-full w-full h-2 mt-2">
              <Progress.Indicator
                className={`w-full h-full transition-all duration-300 ${gameState.lifespan < 20 ? 'bg-red-600 animate-pulse' : 'bg-red-500'}`}
                style={{ transform: `translateX(-${100 - gameState.lifespan}%)` }}
              />
            </Progress.Root>
          </div>

          {/* Quality of Life */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold text-sm">Chất lượng sống</span>
            </div>
            <div className="text-xl font-bold text-white">{Math.floor(gameState.qualityOfLife)}%</div>
            <Progress.Root className="relative overflow-hidden bg-slate-700 rounded-full w-full h-2 mt-2">
              <Progress.Indicator
                className={`w-full h-full transition-all duration-300 ${gameState.qualityOfLife < 20 ? 'bg-green-600 animate-pulse' : 'bg-green-500'}`}
                style={{ transform: `translateX(-${100 - gameState.qualityOfLife}%)` }}
              />
            </Progress.Root>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          {/* Energy */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-semibold text-sm">Năng lượng tinh thần</span>
            </div>
            <div className="text-xl font-bold text-white">{Math.floor(gameState.energy)}%</div>
            <Progress.Root className="relative overflow-hidden bg-slate-700 rounded-full w-full h-2 mt-2">
              <Progress.Indicator
                className={`w-full h-full transition-all duration-300 ${gameState.energy < 20 ? 'bg-orange-600 animate-pulse' : 'bg-orange-500'}`}
                style={{ transform: `translateX(-${100 - gameState.energy}%)` }}
              />
            </Progress.Root>
          </div>

          {/* Knowledge */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold text-sm">Kiến thức</span>
            </div>
            <div className="text-xl font-bold text-white">{Math.floor(gameState.knowledge)}%</div>
            <Progress.Root className="relative overflow-hidden bg-slate-700 rounded-full w-full h-2 mt-2">
              <Progress.Indicator
                className={`w-full h-full transition-all duration-300 ${gameState.knowledge < 20 ? 'bg-purple-600 animate-pulse' : 'bg-purple-500'}`}
                style={{ transform: `translateX(-${100 - gameState.knowledge}%)` }}
              />
            </Progress.Root>
          </div>
        </motion.div>

        {/* Timer */}
        {gameState.gameActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 inline-block">
              <div className="text-3xl font-bold text-white">
                {formatTime(gameState.timeLeft)}
              </div>
              <div className="text-slate-300">Thời gian còn lại</div>
              {!currentEvent && (
                <div className="text-xs text-yellow-300 mt-2">
                  ⏳ Nhiệm vụ sẽ xuất hiện sớm...
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Current Event - Inline Display */}
        <AnimatePresence>
          {currentEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {currentEvent.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {currentEvent.description}
                  </p>
                </div>

                {currentEvent.type === 'lottery' ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎲</div>
                      <p className="text-lg text-slate-300 mb-6">
                        Bạn có muốn thử vận may không? Kết quả có thể là cơ hội hoặc hình phạt!
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      <motion.button
                        onClick={handleLotteryDraw}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        🎲 Bốc 1 quẻ
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setCurrentEvent(null);
                          setLotteryResult({ show: false, effects: {}, message: '' });
                        }}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ❌ Không bốc
                      </motion.button>
                    </div>
                  </div>
                ) : currentEvent.type === 'quiz' && showQuiz ? (
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-white mb-4">
                      {currentEvent.quizQuestion}
                    </div>
                    
                    {/* Power-ups */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <motion.button
                        onClick={useFiftyFifty}
                        disabled={gameState.powerUpsUsed.fiftyFifty || gameState.chronoCoin < 5}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          gameState.powerUpsUsed.fiftyFifty || gameState.chronoCoin < 5
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        50/50 (5 ChronoCoin)
                      </motion.button>
                      
                      <motion.button
                        onClick={useAskAudience}
                        disabled={gameState.powerUpsUsed.askAudience || gameState.matCoin < 10}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          gameState.powerUpsUsed.askAudience || gameState.matCoin < 10
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        Hỏi khán giả (10 MatCoin)
                      </motion.button>
                      
                      <motion.button
                        onClick={usePhoneFriend}
                        disabled={gameState.powerUpsUsed.phoneFriend || gameState.chronoCoin < 8}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          gameState.powerUpsUsed.phoneFriend || gameState.chronoCoin < 8
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        Gọi bạn (8 ChronoCoin)
                      </motion.button>
                      
                      <motion.button
                        onClick={useSwitchQuestion}
                        disabled={gameState.powerUpsUsed.switchQuestion || gameState.matCoin < 15}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          gameState.powerUpsUsed.switchQuestion || gameState.matCoin < 15
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        Đổi câu hỏi (15 MatCoin)
                      </motion.button>
                    </div>
                    
                    <div className="space-y-2">
                      {currentEvent.quizOptions?.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleQuizAnswer(index)}
                          disabled={quizAnswer !== null || eliminatedOptions.includes(index)}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            eliminatedOptions.includes(index)
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                              : quizAnswer === index
                                ? quizAnswer === currentEvent.quizAnswer
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                                : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                          }`}
                          whileHover={{ scale: eliminatedOptions.includes(index) ? 1 : 1.02 }}
                          whileTap={{ scale: eliminatedOptions.includes(index) ? 1 : 0.98 }}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                    {quizAnswer !== null && (
                      <div className="text-center mt-4">
                        {quizAnswer === currentEvent.quizAnswer ? (
                          <div className="text-green-400 font-semibold">
                            ✅ Đúng! +5 ChronoCoin +5 MatCoin
                          </div>
                        ) : (
                          <div className="text-red-400 font-semibold">
                            ❌ Sai! Mất tài nguyên và tiền ngẫu nhiên
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Thông tin chi phí và hậu quả */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Chi phí khi mua */}
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                        <h4 className="text-green-400 font-semibold mb-2">✅ Khi Mua:</h4>
                        <div className="space-y-1 text-sm">
                          {currentEvent.cost.chronoCoin && (
                            <div className="text-yellow-300">
                              💰 Chi phí: {currentEvent.cost.chronoCoin} ChronoCoin
                            </div>
                          )}
                          {currentEvent.cost.matCoin && (
                            <div className="text-blue-300">
                              💰 Chi phí: {currentEvent.cost.matCoin} MatCoin
                            </div>
                          )}
                          {currentEvent.effect.lifespan && (
                            <div className="text-red-300">
                              ❤️ Tuổi thọ: {currentEvent.effect.lifespan > 0 ? '+' : ''}{currentEvent.effect.lifespan}%
                            </div>
                          )}
                          {currentEvent.effect.qualityOfLife && (
                            <div className="text-green-300">
                              ⚡ Chất lượng sống: {currentEvent.effect.qualityOfLife > 0 ? '+' : ''}{currentEvent.effect.qualityOfLife}%
                            </div>
                          )}
                          {currentEvent.effect.energy && (
                            <div className="text-orange-300">
                              🔋 Năng lượng: {currentEvent.effect.energy > 0 ? '+' : ''}{currentEvent.effect.energy}%
                            </div>
                          )}
                          {currentEvent.effect.knowledge && (
                            <div className="text-purple-300">
                              🧠 Kiến thức: {currentEvent.effect.knowledge > 0 ? '+' : ''}{currentEvent.effect.knowledge}%
                            </div>
                          )}
                          {currentEvent.effect.chronoCoin && (
                            <div className="text-yellow-300">
                              💰 ChronoCoin: +{currentEvent.effect.chronoCoin}
                            </div>
                          )}
                          {currentEvent.effect.matCoin && (
                            <div className="text-blue-300">
                              💰 MatCoin: +{currentEvent.effect.matCoin}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hậu quả khi từ chối */}
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                        <h4 className="text-red-400 font-semibold mb-2">❌ Khi Từ Chối:</h4>
                        {(() => {
                          const consequence = getConsequenceInfo(currentEvent);
                          return (
                            <div className="space-y-1 text-sm">
                              <div className="text-red-300 font-medium mb-2">{consequence.text}</div>
                              {consequence.lifespan > 0 && (
                                <div className="text-red-300">
                                  ❤️ Tuổi thọ: -{consequence.lifespan}%
                                </div>
                              )}
                              {consequence.qualityOfLife > 0 && (
                                <div className="text-red-300">
                                  ⚡ Chất lượng sống: -{consequence.qualityOfLife}%
                                </div>
                              )}
                              {consequence.energy > 0 && (
                                <div className="text-red-300">
                                  🔋 Năng lượng: -{consequence.energy}%
                                </div>
                              )}
                              {consequence.knowledge > 0 && (
                                <div className="text-red-300">
                                  🧠 Kiến thức: -{consequence.knowledge}%
                                </div>
                              )}
                              {consequence.lifespan === 0 && consequence.qualityOfLife === 0 && 
                               consequence.energy === 0 && consequence.knowledge === 0 && (
                                <div className="text-gray-400">
                                  Không có hậu quả
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => handleEventChoice(true)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Mua
                      </motion.button>
                      <motion.button
                        onClick={() => handleEventChoice(false)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Bỏ qua
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Modal */}
        <Dialog.Root open={gameState.gameEnded}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 max-w-lg w-full mx-4 z-50">
              <div className="text-center">
                {gameState.gameWon ? (
                  <>
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-green-600 mb-4">
                      🎉 Chúc mừng!
                    </h2>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800 font-medium">
                        Bạn đã chinh phục hành trình tiền tệ tương lai! Tiền không chỉ là hàng hóa, mà là chìa khóa sự sống.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-red-600 mb-4">
                      Game Over!
                    </h2>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-red-800 font-medium">
                        {gameState.lifespan <= 0 && "Bạn đã hết tuổi thọ!"}
                        {gameState.qualityOfLife <= 0 && "Bạn thiếu vật chất cơ bản!"}
                        {gameState.energy <= 0 && "Bạn đã kiệt sức!"}
                        {gameState.knowledge <= 0 && "Bạn thiếu quản lý kiến thức, dẫn đến cô lập xã hội!"}
                        {gameState.timeLeft <= 0 && "Hết thời gian!"}
                      </p>
                    </div>
                  </>
                )}
                
                <div className="space-y-2 mb-6">
                  <div className="text-lg text-slate-600">
                    Tuổi thọ: <span className="font-bold text-red-500">{Math.floor(gameState.lifespan)}%</span>
                  </div>
                  <div className="text-lg text-slate-600">
                    Chất lượng sống: <span className="font-bold text-green-500">{Math.floor(gameState.qualityOfLife)}%</span>
                  </div>
                  <div className="text-lg text-slate-600">
                    Năng lượng: <span className="font-bold text-orange-500">{Math.floor(gameState.energy)}%</span>
                  </div>
                  <div className="text-lg text-slate-600">
                    Kiến thức: <span className="font-bold text-purple-500">{Math.floor(gameState.knowledge)}%</span>
                  </div>
                  <div className="text-lg text-slate-600">
                    ChronoCoin: <span className="font-bold text-yellow-500">{gameState.chronoCoin}</span>
                  </div>
                  <div className="text-lg text-slate-600">
                    MatCoin: <span className="font-bold text-blue-500">{gameState.matCoin}</span>
                  </div>
                  <div className="text-lg text-slate-600">
                    Điểm số: <span className="font-bold text-indigo-500">{gameState.score}</span>
                  </div>
                </div>
                
                {gameState.gameWon ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 font-medium">
                      🚀 Khám phá thêm về tương lai tiền tệ tại trang "Tiền trong tương lai"!
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 font-medium">
                      📚 Học thêm từ trang "Lịch sử tiền tệ" để cải thiện kỹ năng quản lý!
                    </p>
                  </div>
                )}
                
                <motion.button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Chơi lại
                </motion.button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Particles */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 1, x: particle.x, y: particle.y }}
              animate={{ 
                opacity: 0, 
                scale: 0, 
                x: particle.x + (Math.random() - 0.5) * 200,
                y: particle.y + (Math.random() - 0.5) * 200
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="fixed pointer-events-none z-40"
            >
              <Coins className="w-4 h-4 text-yellow-500" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Lottery Result Modal */}
        <AnimatePresence>
          {lotteryResult.show && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-md mx-4 text-center"
              >
                <div className="text-6xl mb-4">🎲</div>
                <h3 className="text-2xl font-bold text-white mb-4">Kết quả bốc quẻ!</h3>
                
                <div className="text-lg text-slate-300 mb-6">
                  {lotteryResult.message}
                </div>
                
                <div className="space-y-2 mb-6">
                  {Object.entries(lotteryResult.effects).map(([key, value]) => {
                    if (key === 'message' || typeof value !== 'number') return null;
                    
                    const isPositive = value > 0;
                    const icon = key === 'lifespan' ? '❤️' : 
                               key === 'qualityOfLife' ? '⚡' :
                               key === 'energy' ? '🔋' :
                               key === 'knowledge' ? '🧠' :
                               key === 'chronoCoin' ? '💰' : '💎';
                    
                    const label = key === 'lifespan' ? 'Tuổi thọ' :
                                 key === 'qualityOfLife' ? 'Chất lượng sống' :
                                 key === 'energy' ? 'Năng lượng' :
                                 key === 'knowledge' ? 'Kiến thức' :
                                 key === 'chronoCoin' ? 'ChronoCoin' : 'MatCoin';
                    
                    return (
                      <div key={key} className={`text-lg font-semibold ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {icon} {label}: {isPositive ? '+' : ''}{value}
                        {key === 'lifespan' || key === 'qualityOfLife' || key === 'energy' || key === 'knowledge' ? '%' : ''}
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-sm text-slate-400">
                  Kết quả sẽ tự động đóng sau 3 giây...
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rules Modal */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Luật Chơi - Thời Đại Tiền Tệ Kép
                    </h2>
                    <motion.button
                      onClick={() => setShowRules(false)}
                      className="text-white hover:text-gray-300 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Mô tả Game */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-blue-400 mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Mô tả Game
                    </h3>
                    <div className="text-slate-300 space-y-2">
                      <p><strong className="text-white">Bối cảnh:</strong> Năm 2100, trong một xã hội giả tưởng nơi tiền tệ định nghĩa mọi khía cạnh cuộc sống.</p>
                      <p><strong className="text-white">Mục tiêu:</strong> Người chơi là một công dân phải quản lý tài nguyên để "sống sót" và "thịnh vượng" trong 3-5 phút.</p>
                      <p><strong className="text-white">Cơ chế:</strong> Các kịch bản tình huống ngẫu nhiên sẽ xuất hiện, yêu cầu quyết định chi tiêu ChronoCoin hoặc MatCoin.</p>
                      <p><strong className="text-white">Nhiệm vụ:</strong> Thỉnh thoảng, nhiệm vụ quiz sẽ xuất hiện để kiếm thêm tiền, và người chơi có thể dùng power-ups để hỗ trợ.</p>
                    </div>
                  </div>

                  {/* Tài Nguyên Quản Lý */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-green-400 mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Tài Nguyên Quản Lý
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                          <h4 className="text-red-400 font-semibold flex items-center gap-2">
                            ❤️ Lifespan (Thời Gian Sống)
                          </h4>
                          <p className="text-slate-300 text-sm">Đại diện cho sức khỏe và tuổi thọ. Giảm do tuổi tác hoặc bệnh tật. Mua bằng ChronoCoin.</p>
                        </div>
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                          <h4 className="text-green-400 font-semibold flex items-center gap-2">
                            ⚡ Quality of Life (Chất Lượng Cuộc Sống)
                          </h4>
                          <p className="text-slate-300 text-sm">Đại diện cho nhu cầu cơ bản (thức ăn, nhà ở). Giảm do thiếu vật chất. Mua bằng MatCoin.</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3">
                          <h4 className="text-orange-400 font-semibold flex items-center gap-2">
                            🔋 Energy (Năng Lượng)
                          </h4>
                          <p className="text-slate-300 text-sm">Đại diện cho sức lực hàng ngày (làm việc, di chuyển). Giảm do lao động hoặc stress. Mua bằng ChronoCoin.</p>
                        </div>
                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                          <h4 className="text-purple-400 font-semibold flex items-center gap-2">
                            🧠 Knowledge (Kiến Thức)
                          </h4>
                          <p className="text-slate-300 text-sm">Đại diện cho học hỏi và kết nối xã hội. Giảm do cô lập hoặc thiếu cập nhật. Mua bằng MatCoin.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Điều Kiện Thắng/Thua */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Điều Kiện Thắng/Thua
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                        <h4 className="text-green-400 font-semibold mb-2">🏆 Thắng</h4>
                        <ul className="text-slate-300 text-sm space-y-1">
                          <li>• Hoàn thành timer (5 phút)</li>
                          <li>• Tất cả tài nguyên đều trên 50%</li>
                          <li>• Tổng ChronoCoin + MatCoin đạt ít nhất 60</li>
                          <li>• Nhận thông điệp chúc mừng và điểm số cao</li>
                        </ul>
                      </div>
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                        <h4 className="text-red-400 font-semibold mb-2">💀 Thua</h4>
                        <ul className="text-slate-300 text-sm space-y-1">
                          <li>• Bất kỳ tài nguyên nào về 0</li>
                          <li>• Hết tiền để xử lý events bắt buộc</li>
                          <li>• Nhận thông điệp thất bại với lý do cụ thể</li>
                          <li>• Khuyến khích chơi lại và học thêm</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Gameplay Chi Tiết */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Gameplay Chi Tiết
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h4 className="text-white font-semibold mb-2">🎮 Khởi Đầu</h4>
                        <p className="text-slate-300 text-sm">Người chơi bắt đầu với 30 ChronoCoin, 30 MatCoin, và tất cả tài nguyên ở 100%. Dashboard hiển thị 4 progress bars với animation.</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h4 className="text-white font-semibold mb-2">⚡ Events (Kịch Bản Tình Huống)</h4>
                        <p className="text-slate-300 text-sm">Ngẫu nhiên xuất hiện mỗi 10-20 giây. Ví dụ: "Cơ thể mệt mỏi: Trả 10 ChronoCoin để tăng Energy 20%?" với lựa chọn Mua hoặc Bỏ qua.</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h4 className="text-white font-semibold mb-2">🧠 Nhiệm Vụ Quiz</h4>
                        <p className="text-slate-300 text-sm">Xuất hiện ngẫu nhiên từ 100 câu hỏi về tiền tệ và kinh tế. Trả lời đúng: +5 ChronoCoin +5 MatCoin. Sai: Mất tài nguyên ngẫu nhiên và tiền.</p>
                      </div>
                    </div>
                  </div>

                  {/* Power-Ups */}
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Power-Ups
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                          <h4 className="text-yellow-400 font-semibold">50/50</h4>
                          <p className="text-slate-300 text-sm">Loại bỏ 2 đáp án sai. Chi phí: 5 ChronoCoin. Mỗi game chỉ dùng 1 lần.</p>
                        </div>
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                          <h4 className="text-blue-400 font-semibold">Ask the Audience</h4>
                          <p className="text-slate-300 text-sm">Hiển thị "bỏ phiếu giả" thiên về đáp án đúng. Chi phí: 10 MatCoin.</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                          <h4 className="text-green-400 font-semibold">Phone a Friend</h4>
                          <p className="text-slate-300 text-sm">Gợi ý đáp án đúng với xác suất 80%. Chi phí: 8 ChronoCoin.</p>
                        </div>
                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                          <h4 className="text-purple-400 font-semibold">Switch Question</h4>
                          <p className="text-slate-300 text-sm">Thay bằng câu hỏi mới nếu khó. Chi phí: 15 MatCoin.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cơ hội hay Hình phạt */}
                  <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-pink-400 mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      Cơ hội hay Hình phạt
                    </h3>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-slate-300 text-sm">
                        Sự kiện đặc biệt với cơ chế bốc quẻ ngẫu nhiên. Chọn "🎲 Bốc 1 quẻ" để nhận hiệu ứng ngẫu nhiên (có thể tích cực hoặc tiêu cực) hoặc "❌ Không bốc" để tránh rủi ro.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-b-2xl border-t border-slate-700">
                  <div className="flex justify-center">
                    <motion.button
                      onClick={() => setShowRules(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Đã hiểu, bắt đầu chơi!
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal cho Ask Audience và Phone Friend */}
        <Dialog.Root open={modalState.show} onOpenChange={(open) => {
          if (!open) {
            setModalState({ show: false, type: null, data: null });
          }
        }}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 z-50 border border-slate-700">
              <Dialog.Title className="text-xl font-bold text-white mb-4">
                {modalState.type === 'askAudience' ? '🎭 Kết quả khán giả' : '📞 Gợi ý từ bạn'}
              </Dialog.Title>
              
              {modalState.type === 'askAudience' && modalState.data && (
                <div className="space-y-3">
                  <p className="text-slate-300 mb-4">Khán giả đã bình chọn:</p>
                  {modalState.data.results.map((result: number, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-white font-semibold w-8">
                        {String.fromCharCode(65 + index)}:
                      </span>
                      <div className="flex-1 bg-slate-700 rounded-full h-6 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000 ease-out"
                          style={{ width: `${result}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold w-12 text-right">
                        {result}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {modalState.type === 'phoneFriend' && modalState.data && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📞</div>
                    <p className="text-slate-300 mb-2">Bạn tôi nói:</p>
                    <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                      <p className="text-xl font-bold text-white">
                        "Tôi nghĩ đáp án là: <span className="text-yellow-400">{modalState.data.suggestedAnswer}</span>"
                      </p>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      {modalState.data.isCorrect ? '✅ Tin tưởng bạn này!' : '⚠️ Cân nhắc kỹ nhé!'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                <Dialog.Close asChild>
                  <motion.button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Đã hiểu
                  </motion.button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}

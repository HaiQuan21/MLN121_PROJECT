import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ThumbsUp, MessageSquare } from 'lucide-react';

export default function InteractPage() {
  const [pollVote, setPollVote] = useState<string | null>(null);
  const [pollResults, setPollResults] = useState({ yes: 45, no: 30, unsure: 25 });
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState<Array<{ q: string; a: string }>>([
    {
      q: 'Bitcoin có an toàn không?',
      a: 'Bitcoin sử dụng công nghệ blockchain với mã hóa mạnh mẽ, nhưng bạn cần bảo vệ khóa riêng của mình. Không có tổ chức trung gian, bạn chịu trách nhiệm hoàn toàn về tài sản.',
    },
    {
      q: 'CBDC khác gì so với tiền điện tử?',
      a: 'CBDC do ngân hàng trung ương phát hành và kiểm soát, trong khi tiền điện tử như Bitcoin là phi tập trung. CBDC ổn định hơn nhưng ít tự do hơn.',
    },
  ]);

  const handleVote = (option: string) => {
    if (pollVote) return;
    setPollVote(option);
    setPollResults((prev) => ({
      ...prev,
      [option]: prev[option as keyof typeof prev] + 1,
    }));
  };

  const handleSubmitQuestion = () => {
    if (!question.trim()) return;
    setQuestions((prev) => [
      ...prev,
      { q: question, a: 'Câu hỏi của bạn đang được xem xét bởi chuyên gia. Vui lòng quay lại sau!' },
    ]);
    setQuestion('');
  };

  const total = pollResults.yes + pollResults.no + pollResults.unsure;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Tương tác & <span className="text-blue-600">Khảo sát</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Chia sẻ ý kiến và đặt câu hỏi của bạn về tương lai của tiền tệ
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <ThumbsUp className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-slate-900">Cuộc thăm dò</h2>
            </div>
            <p className="text-lg text-slate-700 mb-6">
              Bạn có nghĩ tiền vẫn là hàng hóa đặc biệt trong thời đại số?
            </p>

            <div className="space-y-4 mb-8">
              {[
                { key: 'yes', label: 'Có, tiền vẫn là hàng hóa đặc biệt', color: 'green' },
                { key: 'no', label: 'Không, tiền đã trở thành dữ liệu số', color: 'red' },
                { key: 'unsure', label: 'Không chắc chắn', color: 'gray' },
              ].map((option) => (
                <motion.button
                  key={option.key}
                  onClick={() => handleVote(option.key)}
                  disabled={!!pollVote}
                  whileHover={!pollVote ? { scale: 1.02 } : {}}
                  whileTap={!pollVote ? { scale: 0.98 } : {}}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    pollVote === option.key
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  } ${pollVote && pollVote !== option.key ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800">{option.label}</span>
                    {pollVote && (
                      <span className="text-sm font-bold text-slate-600">
                        {Math.round((pollResults[option.key as keyof typeof pollResults] / total) * 100)}%
                      </span>
                    )}
                  </div>
                  {pollVote && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(pollResults[option.key as keyof typeof pollResults] / total) * 100}%`,
                      }}
                      className={`h-2 bg-gradient-to-r from-${option.color}-400 to-${option.color}-600 rounded-full`}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {pollVote && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center"
              >
                <p className="text-blue-800 font-semibold">
                  Cảm ơn bạn đã tham gia! Tổng số phiếu: {total}
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-slate-900">Hỏi chuyên gia</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Có thắc mắc về tiền số, blockchain, hoặc tương lai của tiền tệ? Đặt câu hỏi ngay!
            </p>

            <div className="flex gap-2 mb-8">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
              />
              <motion.button
                onClick={handleSubmitQuestion}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700"
              >
                <Send className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-50 rounded-xl p-4"
                >
                  <div className="font-semibold text-slate-800 mb-2">Q: {item.q}</div>
                  <div className="text-slate-600 text-sm pl-4 border-l-4 border-purple-500">
                    A: {item.a}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Cảm ơn bạn đã tham gia!</h3>
          <p className="text-lg max-w-2xl mx-auto">
            Ý kiến của bạn giúp chúng tôi hiểu rõ hơn về quan điểm cộng đồng đối với tương lai của tiền tệ.
            Hãy tiếp tục theo dõi và khám phá những xu hướng mới nhất!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

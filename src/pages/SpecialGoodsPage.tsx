import { motion } from 'framer-motion';
import { Package, Star, Shield, Zap, Target, Gem, Cpu, Snowflake } from 'lucide-react';

export default function SpecialGoodsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const specialGoodsTypes = [
    {
      id: 1,
      title: "Hàng hóa sức lao động",
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      description: "Các dịch vụ lao động, như lao động trí óc hoặc lao động chuyên môn, có giá trị đặc biệt do tính chất không thể tái tạo và sự độc đáo của từng người lao động.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "Các sản phẩm tài chính",
      icon: <Target className="w-8 h-8 text-green-500" />,
      description: "Vốn tín dụng và các loại hình tài chính khác thường được coi là hàng hóa đặc biệt trong nền kinh tế. Điều này là do chúng không phải là các sản phẩm vật lý có thể chạm được mà thay vào đó, chúng đại diện cho quyền sử dụng hoặc quyền kiểm soát về tài chính trong tương lai.",
      color: "from-green-400 to-emerald-500"
    },
    {
      id: 3,
      title: "Tiền",
      icon: <Package className="w-8 h-8 text-blue-500" />,
      description: "Tiền là một loại hàng hóa đặc biệt vì nó không có giá trị sử dụng trực tiếp mà chỉ là phương tiện trao đổi giữa các hàng hóa khác.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 4,
      title: "Dịch vụ",
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      description: "Dịch vụ như giáo dục, y tế, và giải trí mang lại giá trị đặc biệt thông qua trải nghiệm và sự phục vụ cá nhân hóa.",
      color: "from-purple-400 to-pink-500"
    },
    {
      id: 5,
      title: "Hàng hóa có tính chất nguy hiểm",
      icon: <Shield className="w-8 h-8 text-red-500" />,
      description: "Những sản phẩm như chất độc hại, vũ khí, và chất nổ đều là hàng hóa đặc biệt do tính chất nguy hiểm và yêu cầu quản lý đặc biệt.",
      color: "from-red-400 to-rose-500"
    },
    {
      id: 6,
      title: "Hàng hóa có giá trị cao",
      icon: <Gem className="w-8 h-8 text-amber-500" />,
      description: "Các sản phẩm có giá trị cao như kim cương, vàng, và những tác phẩm nghệ thuật quý hiếm cũng được coi là hàng hóa đặc biệt vì tính khan hiếm và giá trị tài chính cao.",
      color: "from-amber-400 to-yellow-500"
    },
    {
      id: 7,
      title: "Hàng hóa sử dụng công nghệ cao",
      icon: <Cpu className="w-8 h-8 text-indigo-500" />,
      description: "Các sản phẩm công nghệ tiên tiến như điện thoại thông minh, máy tính, và máy bay không chỉ mang lại giá trị sử dụng mà còn được coi là hàng hóa đặc biệt vì tính tiên tiến và sự phát triển liên tục của công nghệ.",
      color: "from-indigo-400 to-blue-500"
    },
    {
      id: 8,
      title: "Hàng hóa có chế độ bảo quản riêng",
      icon: <Snowflake className="w-8 h-8 text-teal-500" />,
      description: "Các loại hàng hóa như thực phẩm tươi sống, thuốc men hay hóa chất cần được bảo quản bởi điều kiện đặc biệt để đảm bảo chất lượng và an toàn khi sử dụng cũng là hàng hóa đặc biệt.",
      color: "from-teal-400 to-cyan-500"
    }
  ];

  const importancePoints = [
    {
      title: "Tạo ra giá trị độc đáo",
      description: "Các sản phẩm và dịch vụ đặc biệt thường mang lại giá trị độc đáo và không thể thay thế. Điều này tạo ra sự hấp dẫn đối với người tiêu dùng và tạo nên một phân khúc thị trường riêng biệt."
    },
    {
      title: "Thúc đẩy sự đổi mới và sáng tạo",
      description: "Hàng hóa đặc biệt thường là kết quả của quá trình đổi mới và sáng tạo. Việc phát triển và tiếp thị những sản phẩm này thúc đẩy sự phát triển của các ngành công nghiệp và nền kinh tế."
    },
    {
      title: "Tạo ra cơ hội đầu tư",
      description: "Sự độc đáo và giá trị cao của hàng hóa đặc biệt tạo ra cơ hội đầu tư hấp dẫn. Người đầu tư có thể tìm kiếm lợi nhuận từ việc đầu tư vào các sản phẩm và dịch vụ này."
    },
    {
      title: "Thúc đẩy phát triển công nghệ",
      description: "Các sản phẩm và dịch vụ đặc biệt thường đòi hỏi sự tiên tiến trong công nghệ và quy trình sản xuất. Việc nghiên cứu và phát triển những sản phẩm này thúc đẩy sự tiến bộ trong lĩnh vực công nghệ."
    },
    {
      title: "Tạo ra giá trị thêm cho xã hội",
      description: "Hàng hóa đặc biệt không chỉ mang lại giá trị thương mại mà còn đóng góp vào việc tạo ra giá trị xã hội. Chúng có thể là các sản phẩm y tế cần thiết, các giải pháp môi trường hoặc các sản phẩm nghệ thuật nâng cao chất lượng cuộc sống của mọi người."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Hàng hóa đặc biệt
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Khám phá những sản phẩm và dịch vụ có giá trị đặc biệt trong nền kinh tế hiện đại
          </p>
        </motion.div>

        {/* Definition Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Hàng hóa đặc biệt là gì?
          </h2>
          <p className="text-lg text-slate-200 leading-relaxed mb-6">
            Hàng hóa đặc biệt là những sản phẩm sở hữu những đặc tính riêng biệt, có giá trị kinh tế cao, 
            ảnh hưởng lớn đến xã hội, cần có chế độ quản lý chặt chẽ hơn so với các loại hàng hóa thông thường. 
            Loại hàng hóa này thường mang lại giá trị đặc biệt đối với người tiêu dùng và thị trường, ví dụ là vàng.
          </p>
          <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg p-4 border border-amber-500/30">
            <p className="text-amber-200 font-medium">
              💡 Ví dụ điển hình: Vàng - một kim loại quý có giá trị kinh tế cao và được sử dụng làm phương tiện lưu trữ giá trị từ hàng nghìn năm nay.
            </p>
          </div>
        </motion.div>

        {/* Importance Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Vai trò quan trọng trong nền kinh tế hiện đại
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {importancePoints.map((point, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {point.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Special Goods Types */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            8 loại hàng hóa đặc biệt trên thị trường
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {specialGoodsTypes.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.id}. {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

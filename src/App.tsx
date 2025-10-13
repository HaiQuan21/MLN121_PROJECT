import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import DigitalPage from './pages/DigitalPage';
import BitcoinPage from './pages/BitcoinPage';
import FuturePage from './pages/FuturePage';
import InteractPage from './pages/InteractPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'history':
        return <HistoryPage />;
      case 'digital':
        return <DigitalPage />;
      case 'bitcoin':
        return <BitcoinPage />;
      case 'future':
        return <FuturePage />;
      case 'interact':
        return <InteractPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <Chatbot />
    </div>
  );
}

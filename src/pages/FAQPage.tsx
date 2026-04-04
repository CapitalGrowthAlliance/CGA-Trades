import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

const renderWithNoTranslate = (text: string) => {
  const parts = text.split(/(Capital Growth Alliance|CGA)/g);
  return parts.map((part, i) => 
    (part === 'Capital Growth Alliance' || part === 'CGA') ? 
      <span key={i} className="notranslate">{part}</span> : 
      part
  );
};

const AccordionItem = ({ question, answer, isOpen, onClick, index }: { question: string, answer: string, isOpen: boolean, onClick: () => void, index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", bounce: 0.3 }}
      className={`border border-border-color rounded-2xl mb-4 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-primary/10 ${isOpen ? 'border-accent-primary/50 shadow-lg shadow-accent-primary/20 bg-bg-secondary' : 'bg-bg-primary hover:border-text-secondary/30'}`}
    >
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        onClick={onClick}
      >
        <span className={`font-semibold text-lg transition-colors ${isOpen ? 'text-accent-primary' : 'text-text-primary'}`}>{renderWithNoTranslate(question)}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-accent-primary/10 text-accent-primary' : 'bg-black/5 dark:bg-white/5 text-text-secondary'}`}
        >
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-5 text-text-secondary leading-relaxed">
              {renderWithNoTranslate(answer)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t('faq.q1', 'What is Capital Growth Alliance?'), a: t('faq.a1', 'Capital Growth Alliance is a premier investment platform specializing in forex and cryptocurrency trading, founded in 2010.') },
    { q: t('faq.q2', 'How do I start investing?'), a: t('faq.a2', 'Simply create an account, complete your KYC verification, deposit funds, and choose an investment plan that suits your goals.') },
    { q: t('faq.q3', 'Is my investment secure?'), a: t('faq.a3', 'Yes, we employ industry-leading security protocols, cold storage solutions, and maintain deep liquidity pools to ensure your funds are protected.') },
    { q: t('faq.q4', 'What is the minimum deposit?'), a: t('faq.a4', 'The minimum deposit varies depending on the investment plan you choose, starting from as low as $100.') },
    { q: t('faq.q5', 'How do withdrawals work?'), a: t('faq.a5', 'Withdrawals can be requested at any time from your dashboard and are typically processed within 24 hours to your designated wallet or bank account.') },
    { q: t('faq.q6', 'Do you have a referral program?'), a: t('faq.a6', 'Yes, you can earn a 5% commission on the deposits made by users who sign up using your unique referral link.') },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans relative overflow-hidden transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-glass-bg backdrop-blur-xl border-b border-glass-border shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold">{t('nav.faq', 'FAQ')}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-primary/20 rounded-full blur-[100px] -z-10"></div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('faq.heroTitle', 'Frequently Asked Questions')}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-accent-primary mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            {t('faq.heroSubtitle', 'Find answers to common questions about our platform, investment plans, and security.')}
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mb-12"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('faq.searchPlaceholder', 'Search questions...')}
            className="block w-full pl-12 pr-4 py-4 border border-border-color rounded-2xl bg-bg-secondary text-text-primary focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all shadow-sm text-lg"
          />
        </motion.div>

        {/* Accordion Section */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                index={index}
                question={faq.q}
                answer={faq.a}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-text-secondary">
              <p className="text-lg">No matching questions found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

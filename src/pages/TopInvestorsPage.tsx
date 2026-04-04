import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { MOCK_INVESTORS } from '../constants/investors';

export default function TopInvestorsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/home')}
          className="p-2 rounded-full hover:bg-bg-secondary transition-colors text-text-secondary hover:text-text-primary"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-text-primary">{t('investors.page_title', 'Top Investors')}</h1>
      </div>

      {/* Description */}
      <div className="bg-accent-primary/5 border border-accent-primary/10 rounded-2xl p-6 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center shrink-0">
          <Award className="w-6 h-6 text-accent-primary" />
        </div>
        <div>
          <p className="text-text-primary font-medium">Global Leaderboard</p>
          <p className="text-sm text-text-secondary">Celebrating our most successful investors across the globe. Rankings are updated in real-time based on total equity.</p>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[30px_1fr_85px_65px] sm:grid-cols-[40px_1fr_100px_100px] gap-2 sm:gap-4 px-4 sm:px-6 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border-light">
        <span>#</span>
        <span>Investor</span>
        <span className="text-right">Equity</span>
        <span className="text-right">Daily ROI</span>
      </div>

      {/* List */}
      <div className="divide-y divide-border-light">
        {MOCK_INVESTORS.map((investor, index) => (
          <motion.div
            key={investor.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(index * 0.02, 1) }}
            className="grid grid-cols-[30px_1fr_85px_65px] sm:grid-cols-[40px_1fr_100px_100px] gap-2 sm:gap-4 px-4 sm:px-6 py-4 items-center hover:bg-bg-secondary transition-colors"
          >
            <span className={`text-[10px] sm:text-sm font-bold ${investor.rank <= 3 ? 'text-accent-primary' : 'text-text-muted'}`}>
              {investor.rank}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="text-base sm:text-lg shrink-0" title={investor.country}>{investor.flag}</span>
              <span className="text-[11px] sm:text-sm font-semibold text-text-primary truncate">{investor.name}</span>
            </div>
            <span className="text-[11px] sm:text-sm font-bold text-text-primary text-right">
              ${investor.equity.toLocaleString()}
            </span>
            <div className="flex items-center justify-end gap-0.5 sm:gap-1 text-emerald-500 font-bold text-[10px] sm:text-sm">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 h-3" />
              {investor.dailyRoi}%
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

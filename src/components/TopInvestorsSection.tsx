import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MOCK_INVESTORS } from '../constants/investors';

export default function TopInvestorsSection() {
  const { t } = useTranslation();
  const top10 = MOCK_INVESTORS.slice(0, 10);

  return (
    <section className="py-20 px-6 lg:px-12 bg-bg-secondary/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-accent-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              {t('investors.title', 'Top Investors')}
            </h2>
          </div>
          <Link 
            to="/top-investors" 
            className="text-sm font-bold text-accent-primary hover:text-accent-hover transition-colors flex items-center gap-1 group"
          >
            {t('investors.see_all', 'See All')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="bg-bg-secondary border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-[30px_1fr_85px_65px] sm:grid-cols-[40px_1fr_100px_80px] gap-2 sm:gap-4 px-4 sm:px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border-light bg-bg-hover/50">
            <span>#</span>
            <span>Investor</span>
            <span className="text-right">Equity</span>
            <span className="text-right">ROI</span>
          </div>

          <div className="divide-y divide-border-light">
            {top10.map((investor) => (
              <div 
                key={investor.rank}
                className="grid grid-cols-[30px_1fr_85px_65px] sm:grid-cols-[40px_1fr_100px_80px] gap-2 sm:gap-4 px-4 sm:px-6 py-4 items-center hover:bg-bg-hover transition-colors"
              >
                <span className={`text-[10px] sm:text-xs font-bold ${investor.rank <= 3 ? 'text-accent-primary' : 'text-text-muted'}`}>
                  {investor.rank}
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="text-sm sm:text-base shrink-0" title={investor.country}>{investor.flag}</span>
                  <span className="text-[11px] sm:text-xs font-semibold text-text-primary truncate">{investor.name}</span>
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-text-primary text-right">
                  ${investor.equity.toLocaleString()}
                </span>
                <div className="flex items-center justify-end gap-0.5 sm:gap-1 text-emerald-500 font-bold text-[10px] sm:text-xs">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 h-3" />
                  {investor.dailyRoi}%
                </div>
              </div>
            ))}
          </div>

          <Link 
            to="/top-investors"
            className="block w-full py-4 text-center text-sm font-bold text-accent-primary hover:bg-bg-hover transition-all border-t border-border-light"
          >
            {t('investors.see_all_button', 'See All')}
          </Link>
        </div>
      </div>
    </section>
  );
}

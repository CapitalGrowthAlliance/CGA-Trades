import React from 'react';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSite } from '../context/SiteContext';

export default function InvestmentPlans({ onInvest }: { onInvest: (planId: string, amount: number) => void }) {
  const { t } = useTranslation();
  const { investmentPlans, loading } = useSite();

  if (loading) {
    return <div className="text-center text-text-muted py-8">{t('plans.loading', 'Loading plans...')}</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 my-8">
      {investmentPlans.map((plan, index) => (
        <div
          key={plan.id}
          className="bg-bg-card border border-border-light rounded-2xl p-3 md:p-6 shadow-light hover:bg-bg-hover transition-all duration-300 hover:scale-105 group relative overflow-hidden flex flex-col justify-between aspect-[4/5] md:aspect-auto"
        >
          <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <h3 className="text-sm md:text-xl font-bold text-text-primary mb-1 md:mb-2 line-clamp-1">{plan.name}</h3>
            <div className="text-lg md:text-3xl font-extrabold text-accent-primary mb-2 md:mb-6">
              {plan.roi}% <span className="text-[10px] md:text-base font-bold uppercase">{t('plans.roi', 'ROI')}</span>
            </div>
            
            <div className="space-y-1.5 md:space-y-3 mb-3 md:mb-8">
              <div className="flex items-center text-text-secondary text-[10px] md:text-sm">
                <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-accent-primary shrink-0" />
                <span className="truncate">{plan.duration} Days</span>
              </div>
              <div className="flex items-center text-text-secondary text-[10px] md:text-sm">
                <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-emerald-500 shrink-0" />
                <span className="truncate">${plan.minAmount?.toLocaleString()} - ${plan.maxAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              const amount = prompt(t('plans.prompt_amount', `Enter amount to invest in {{name}} (Min: $\{{min}}):`, { name: plan.name, min: plan.minAmount }));
              if (amount && !isNaN(Number(amount))) {
                onInvest(plan.id, Number(amount));
              }
            }}
            className="w-full py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl font-bold text-slate-900 bg-accent-primary hover:bg-accent-hover transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-lg active:scale-95 relative overflow-hidden text-[10px] md:text-sm uppercase tracking-wider"
          >
            {t('plans.invest_now', 'Invest Now')}
          </button>
        </div>
      ))}
    </div>
  );
}

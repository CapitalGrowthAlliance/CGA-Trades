import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BalanceData {
  balance: number;
  totalInvestments: number;
  totalEarnings: number;
  roiPercentage: number;
  referralEarnings?: number;
}

export default function BalanceCards({ data }: { data: BalanceData | null }) {
  const { t } = useTranslation();
  const [displayData, setDisplayData] = useState<BalanceData>({
    balance: 0.00,
    totalInvestments: 0.00,
    totalEarnings: 0.00,
    roiPercentage: 0.00,
    referralEarnings: 0.00
  });

  useEffect(() => {
    if (data) {
      setDisplayData({
        balance: data.balance || 0.00,
        totalInvestments: data.totalInvestments || 0.00,
        totalEarnings: data.totalEarnings || 0.00,
        roiPercentage: data.roiPercentage || 0.00,
        referralEarnings: data.referralEarnings || 0.00
      });
    }
  }, [data]);

  const cards = [
    { title: t('dashboard.wallet_balance', 'Wallet Balance'), value: displayData.balance, icon: Wallet, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-400/10', prefix: '$' },
    { title: t('dashboard.total_deposits', 'Total Deposits'), value: displayData.totalInvestments, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-400/10', prefix: '$' },
    { title: t('dashboard.total_earnings', 'Total Earnings'), value: displayData.totalEarnings, icon: DollarSign, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 dark:bg-amber-400/10', prefix: '$' },
    { title: t('dashboard.referral_bonus', 'Referral Bonus'), value: displayData.referralEarnings || 0, icon: DollarSign, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10 dark:bg-purple-400/10', prefix: '$' },
    { title: t('dashboard.roi', 'ROI'), value: displayData.roiPercentage, icon: Percent, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10 dark:bg-indigo-400/10', suffix: '%' },
  ];

  return (
    <div className="flex flex-wrap justify-around md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="w-[40%] h-auto p-[10px] md:w-auto md:p-6 bg-bg-card border border-border-light rounded-2xl shadow-light hover:bg-bg-hover transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <h4 className="text-text-secondary text-sm font-medium mb-1">{card.title}</h4>
          <div className="text-2xl font-bold text-text-primary flex items-baseline gap-1">
            {card.prefix && <span className="text-lg text-text-muted">{card.prefix}</span>}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={card.value}
            >
              {card.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.span>
            {card.suffix && <span className="text-lg text-text-muted">{card.suffix}</span>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

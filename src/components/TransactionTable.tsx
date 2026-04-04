import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownLeft, RefreshCcw, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function TransactionTable({ previewMode = false }: { previewMode?: boolean }) {
  const { t } = useTranslation();
  const token = 'mock-token';
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (previewMode) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    if (!token) return;

    fetch('/api/user/transactions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [previewMode, token]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'investment': return <RefreshCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'referral_bonus': return <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  if (loading) {
    return <div className="text-center text-text-muted py-8">{t('transactions.loading', 'Loading transactions...')}</div>;
  }

  return (
    <div className="bg-bg-card border border-border-light rounded-2xl p-6 shadow-light my-8 overflow-hidden">
      <h3 className="text-xl font-bold text-text-primary mb-6">{t('transactions.title', 'Recent Transactions')}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-light text-text-secondary text-sm">
              <th className="pb-3 font-medium">{t('transactions.type', 'Type')}</th>
              <th className="pb-3 font-medium">{t('transactions.amount', 'Amount')}</th>
              <th className="pb-3 font-medium">{t('transactions.date', 'Date')}</th>
              <th className="pb-3 font-medium text-right">{t('transactions.status', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-text-muted">{t('transactions.empty', 'No transactions found')}</td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="border-b border-border-light hover:bg-bg-hover transition-colors group"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bg-hover flex items-center justify-center border border-border-light group-hover:scale-110 transition-transform">
                        {getIcon(tx.type)}
                      </div>
                      <span className="text-text-secondary capitalize text-sm">{t(`transactions.types.${tx.type}`, tx.type.replace('_', ' '))}</span>
                    </div>
                  </td>
                  <td className="py-4 text-text-primary font-medium text-sm">
                    ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 text-text-muted text-sm">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                      {t(`transactions.statuses.${tx.status}`, tx.status.charAt(0).toUpperCase() + tx.status.slice(1))}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

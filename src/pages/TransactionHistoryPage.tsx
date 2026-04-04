import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

type TransactionStatus = 'PENDING' | 'SUCCESS' | 'DECLINED' | 'EXPIRED' | 'INVESTMENT SUCCESSFUL' | 'WITHDRAWAL SUCCESSFUL';
type TransactionType = 'WALLET_DEPOSIT' | 'PLAN_SUBSCRIPTION' | 'DIRECT_INVESTMENT' | 'WITHDRAWAL';

interface Transaction {
  id: string;
  type: TransactionType;
  currency: string;
  amount: number;
  fee: number;
  planName?: string;
  withdrawalMethod?: string;
  depositProof?: string;
  status: TransactionStatus;
  createdAt: string;
}

export default function TransactionHistoryPage({ isComponent = false }: { isComponent?: boolean }) {
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user) return;
        const q = query(collection(db, 'transactions'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
            createdAt: docData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
          };
        }) as Transaction[];
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const toggleExpand = (id: string) => {
    if (expandedTx === id) {
      setExpandedTx(null);
    } else {
      setExpandedTx(id);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'PENDING') return 'text-red-500 bg-red-500/10';
    if (s === 'SUCCESS' || s === 'INVESTMENT SUCCESSFUL' || s === 'WITHDRAWAL SUCCESSFUL' || s === 'COMPLETED') return 'text-green-500 bg-green-500/10';
    if (s === 'DECLINED') return 'text-red-500 bg-red-500/10';
    if (s === 'EXPIRED') return 'text-gray-500 bg-gray-500/10';
    return 'text-gray-500 bg-gray-500/10';
  };

  const getTypeIcon = (type: string) => {
    const t = type.toUpperCase();
    if (t === 'WALLET_DEPOSIT' || t === 'DEPOSIT') return <Wallet className="w-5 h-5 text-blue-500" />;
    if (t === 'PLAN_SUBSCRIPTION' || t === 'DIRECT_INVESTMENT' || t === 'INVESTMENT') return <TrendingUp className="w-5 h-5 text-purple-500" />;
    if (t === 'WITHDRAWAL') return <ArrowUpRight className="w-5 h-5 text-orange-500" />;
    return <ArrowDownLeft className="w-5 h-5 text-gray-500" />;
  };

  const getTypeLabel = (type: string) => {
    const t = type.toUpperCase();
    if (t === 'WALLET_DEPOSIT' || t === 'DEPOSIT') return 'Wallet Deposit';
    if (t === 'PLAN_SUBSCRIPTION' || t === 'INVESTMENT') return 'Investment';
    if (t === 'DIRECT_INVESTMENT') return 'Direct Investment';
    if (t === 'WITHDRAWAL') return 'Withdrawal';
    return 'Transaction';
  };

  const formatMoney = (amount: number, currency: string = 'USD') => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className={isComponent ? "space-y-6 transition-colors duration-300" : "p-4 md:p-8 max-w-5xl mx-auto space-y-6 transition-colors duration-300"}>
      {!isComponent && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Transaction History</h1>
            <p className="text-sm text-text-secondary mt-1">View and manage your financial activities.</p>
          </div>
        </div>
      )}

      <div className="bg-bg-secondary rounded-2xl border border-border-light shadow-sm overflow-hidden transition-colors duration-300">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            No transactions found.
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex flex-col">
                <div 
                  className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-bg-tertiary transition-colors"
                  onClick={() => toggleExpand(tx.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center shrink-0 transition-colors duration-300">
                      {getTypeIcon(tx.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {getTypeLabel(tx.type)}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {formatDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 md:gap-8">
                    <div className="text-right">
                      <p className="font-bold text-text-primary">
                        {tx.type.toUpperCase() === 'WITHDRAWAL' ? '-' : '+'}{formatMoney(tx.amount, tx.currency)}
                      </p>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1 ${getStatusColor(tx.status)}`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-text-secondary">
                      {expandedTx === tx.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {expandedTx === tx.id && (
                  <div className="p-4 md:p-6 bg-bg-tertiary border-t border-border-light grid grid-cols-1 md:grid-cols-2 gap-4 text-sm transition-colors duration-300">
                    <div>
                      <span className="block text-text-secondary mb-1">Transaction ID</span>
                      <span className="font-medium text-text-primary font-mono text-xs">{tx.id}</span>
                    </div>
                    <div>
                      <span className="block text-text-secondary mb-1">Currency</span>
                      <span className="font-medium text-text-primary">{tx.currency || 'USD'}</span>
                    </div>
                    <div>
                      <span className="block text-text-secondary mb-1">Amount</span>
                      <span className="font-medium text-text-primary">{formatMoney(tx.amount, tx.currency)}</span>
                    </div>
                    {tx.fee > 0 && (
                      <div>
                        <span className="block text-text-secondary mb-1">Fee (20%)</span>
                        <span className="font-medium text-text-primary">{formatMoney(tx.fee, tx.currency)}</span>
                      </div>
                    )}
                    {tx.type.toUpperCase() === 'WITHDRAWAL' && tx.fee > 0 && (
                      <div>
                        <span className="block text-text-secondary mb-1">Amount Paid</span>
                        <span className="font-medium text-text-primary">{formatMoney(tx.amount - tx.fee, tx.currency)}</span>
                      </div>
                    )}
                    {tx.planName && (
                      <div>
                        <span className="block text-text-secondary mb-1">Plan Name</span>
                        <span className="font-medium text-text-primary">{tx.planName}</span>
                      </div>
                    )}
                    {tx.withdrawalMethod && (
                      <div>
                        <span className="block text-text-secondary mb-1">Withdrawal Method</span>
                        <span className="font-medium text-text-primary">{tx.withdrawalMethod}</span>
                      </div>
                    )}
                    {tx.depositProof && (
                      <div>
                        <span className="block text-text-secondary mb-1">Deposit Proof</span>
                        <span className="font-medium text-text-primary">{tx.depositProof}</span>
                      </div>
                    )}
                    <div>
                      <span className="block text-text-secondary mb-1">Date & Time</span>
                      <span className="font-medium text-text-primary">{formatDate(tx.createdAt)} {formatTime(tx.createdAt)}</span>
                    </div>
                    <div>
                      <span className="block text-text-secondary mb-1">Status</span>
                      <span className={`font-medium ${getStatusColor(tx.status).split(' ')[0]}`}>{tx.status.toUpperCase()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

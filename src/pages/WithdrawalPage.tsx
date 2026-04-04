import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useSite } from '../context/SiteContext';

interface WithdrawalMethod {
  id: string;
  type: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  walletAddress?: string;
}

export default function WithdrawalPage({ isComponent = false }: { isComponent?: boolean }) {
  const navigate = useNavigate();
  const { user: authUser, userData } = useAuth();
  const user = userData || { totalEarnings: 0 };
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [amount, setAmount] = useState('');
  const [methods, setMethods] = useState<WithdrawalMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { featureToggles } = useSite();

  // New method state
  const [showNewMethod, setShowNewMethod] = useState(false);
  const [newMethodType, setNewMethodType] = useState<'USD' | 'NGN'>('USD');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (authUser) {
      fetchMethods();
    }
  }, [authUser]);

  const fetchMethods = async () => {
    if (!authUser) return;
    try {
      const q = query(collection(db, 'withdrawal_methods'), where('userId', '==', authUser.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WithdrawalMethod[];
      setMethods(data);
      if (data.length > 0) {
        setSelectedMethod(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch methods', err);
    }
  };

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;
    setError('');
    setLoading(true);

    try {
      await addDoc(collection(db, 'withdrawal_methods'), {
        userId: authUser.uid,
        type: newMethodType,
        bankName,
        accountNumber,
        accountName,
        walletAddress,
        createdAt: serverTimestamp()
      });
      setShowNewMethod(false);
      fetchMethods();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;
    setError('');
    setLoading(true);

    try {
      await addDoc(collection(db, 'transactions'), {
        userId: authUser.uid,
        type: 'WITHDRAWAL',
        amount: parseFloat(amount),
        currency,
        methodId: selectedMethod,
        status: 'PENDING',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredMethods = methods.filter(m => m.type === currency);

  if (featureToggles?.withdrawalsEnabled === false) {
    return (
      <div className={isComponent ? "space-y-6 transition-colors duration-300" : "p-4 md:p-8 max-w-3xl mx-auto space-y-6 transition-colors duration-300"}>
        <div className="bg-bg-secondary rounded-2xl border border-border-light shadow-sm p-8 text-center transition-colors duration-300">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Withdrawals Temporarily Disabled</h2>
          <p className="text-text-secondary">
            We are currently performing maintenance on our withdrawal systems. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={isComponent ? "space-y-6 transition-colors duration-300" : "p-4 md:p-8 max-w-3xl mx-auto space-y-6 transition-colors duration-300"}>
        <div className="bg-bg-secondary rounded-2xl border border-border-light shadow-sm p-8 text-center space-y-4 transition-colors duration-300">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-500 transition-colors duration-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Withdrawal Requested</h2>
          <p className="text-text-secondary max-w-sm mx-auto">
            Your withdrawal request has been submitted successfully and is pending admin approval. A 20% fee has been applied.
          </p>
          <button
            onClick={() => navigate('/fund?tab=history')}
            className="mt-6 inline-block bg-accent-primary hover:bg-accent-hover text-slate-900 font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            View Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isComponent ? "space-y-6 transition-colors duration-300" : "p-4 md:p-8 max-w-3xl mx-auto space-y-6 transition-colors duration-300"}>
      {!isComponent && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Withdraw Profits</h1>
          <p className="text-sm text-text-secondary mt-1">Withdraw from your accumulated profits.</p>
        </div>
      )}

      <div className="bg-bg-secondary rounded-2xl border border-border-light shadow-sm p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 transition-colors duration-300">
          <div>
            <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">Withdrawable Profits</p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">
              ${user?.totalEarnings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>
          <ArrowUpRight className="w-8 h-8 text-amber-500 opacity-50" />
        </div>

            {showNewMethod ? (
              <div className="space-y-6">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                    <strong>Warning:</strong> The account name MUST match your profile name exactly. Mismatched names will lead to withdrawal failure.
                  </p>
                </div>
                <div className="space-y-6">
                  <h3 className="font-semibold text-text-primary">One-time Payment Method</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Method Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setNewMethodType('USD')}
                        className={`p-3 rounded-xl border ${newMethodType === 'USD' ? 'border-accent-primary bg-accent-primary/5 text-accent-primary' : 'border-border-color text-text-primary'} font-medium transition-colors`}
                      >
                        USDT TRC20
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewMethodType('NGN')}
                        className={`p-3 rounded-xl border ${newMethodType === 'NGN' ? 'border-accent-primary bg-accent-primary/5 text-accent-primary' : 'border-border-color text-text-primary'} font-medium transition-colors`}
                      >
                        Naira Bank Account
                      </button>
                    </div>
                  </div>

                  {newMethodType === 'USD' ? (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Wallet Address (TRC20)</label>
                      <input
                        type="text"
                        required
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full bg-bg-tertiary border border-border-color rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all"
                        placeholder="T..."
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Bank Name</label>
                        <input
                          type="text"
                          required
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full bg-bg-tertiary border border-border-color rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Account Number</label>
                        <input
                          type="text"
                          required
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full bg-bg-tertiary border border-border-color rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Account Name (Must match profile)</label>
                        <input
                          type="text"
                          required
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          className="w-full bg-bg-tertiary border border-border-color rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowNewMethod(false)}
                      className="flex-1 bg-bg-tertiary text-text-primary font-semibold py-3 rounded-xl transition-colors border border-border-light"
                    >
                      Use Saved Method
                    </button>
                  </div>
                </div>
              </div>
            ) : (
          <form onSubmit={handleWithdraw} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Select Currency</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setCurrency('USD'); setSelectedMethod(''); }}
                  className={`p-4 rounded-xl border ${currency === 'USD' ? 'border-accent-primary bg-accent-primary/5 text-accent-primary' : 'border-border-color text-text-primary'} font-medium transition-colors`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrency('NGN'); setSelectedMethod(''); }}
                  className={`p-4 rounded-xl border ${currency === 'NGN' ? 'border-accent-primary bg-accent-primary/5 text-accent-primary' : 'border-border-color text-text-primary'} font-medium transition-colors`}
                >
                  NGN (₦)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Withdrawal Method</label>
              {filteredMethods.length > 0 ? (
                <div className="space-y-3">
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-full bg-bg-tertiary border border-border-color rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all appearance-none"
                    required
                  >
                    <option value="" disabled>Select a saved method</option>
                    {filteredMethods.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.type === 'NGN' ? `${m.bankName} - ${m.accountNumber}` : `USDT TRC20 - ${m.walletAddress}`}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewMethod(true)}
                    className="text-sm text-accent-primary font-medium flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Use another payment method
                  </button>
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed border-border-color rounded-xl transition-colors duration-300">
                  <p className="text-sm text-text-secondary mb-3">No saved methods for {currency}</p>
                  <button
                    type="button"
                    onClick={() => { setNewMethodType(currency); setShowNewMethod(true); }}
                    className="text-sm text-accent-primary font-medium flex items-center gap-1 justify-center mx-auto hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Use another payment method
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">{currency === 'USD' ? '$' : '₦'}</span>
                <input
                  type="number"
                  required
                  min={currency === 'USD' ? "25" : "5000"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-bg-tertiary border border-border-color rounded-xl pl-8 pr-4 py-3 text-text-primary focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all"
                  placeholder={currency === 'USD' ? "Min $25" : "Min ₦5,000"}
                />
              </div>
              {amount && parseFloat(amount) > 0 && (
                <p className="text-xs text-text-secondary mt-2">
                  A 20% fee ({currency === 'USD' ? '$' : '₦'}{(parseFloat(amount) * 0.2).toFixed(2)}) will be deducted. Net payout: {currency === 'USD' ? '$' : '₦'}{(parseFloat(amount) * 0.8).toFixed(2)}
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20 transition-colors duration-300">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) <= 0 || !selectedMethod}
              className="w-full bg-accent-primary hover:bg-accent-hover text-slate-900 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

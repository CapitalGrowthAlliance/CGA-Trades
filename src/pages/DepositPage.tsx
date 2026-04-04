import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, UploadCloud, CheckCircle2, AlertCircle, CreditCard, Bitcoin, Coins, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import CryptoWalletCard from '../components/CryptoWalletCard';
import { useSite } from '../context/SiteContext';

export default function DepositPage({ isComponent = false }: { isComponent?: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [proof, setProof] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { featureToggles, wallets, bankDetails } = useSite();

  const selectedWallet = wallets.find(w => w.id === paymentMethod);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to deposit.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'WALLET_DEPOSIT',
        amount: parseFloat(amount),
        currency,
        paymentMethod: selectedWallet ? `${selectedWallet.name} (${selectedWallet.network})` : paymentMethod,
        depositProof: proof,
        status: 'PENDING',
        createdAt: serverTimestamp()
      });
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (featureToggles?.depositsEnabled === false) {
    return (
      <div className={isComponent ? "space-y-6 transition-colors duration-300" : "p-4 md:p-8 max-w-4xl mx-auto space-y-6 transition-colors duration-300"}>
        <div className="bg-bg-secondary rounded-2xl border border-border-light shadow-sm p-8 text-center transition-colors duration-300">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Deposits Temporarily Disabled</h2>
          <p className="text-text-secondary">
            We are currently performing maintenance on our deposit systems. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={isComponent ? "space-y-6 transition-colors duration-300" : "p-4 md:p-8 max-w-4xl mx-auto space-y-6 transition-colors duration-300"}>
      {!isComponent && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Fund Wallet</h1>
          <p className="text-sm text-text-secondary mt-1">Add funds to your wallet to start investing.</p>
        </div>
      )}

      <div className="bg-bg-secondary rounded-2xl border border-border-light shadow-sm p-6 transition-colors duration-300">
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setPaymentMethod(''); setStep(2); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Select Currency</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`p-4 rounded-xl border ${currency === 'USD' ? 'border-accent-primary bg-accent-primary/5 text-accent-primary' : 'border-border-color text-text-primary'} font-medium transition-colors`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('NGN')}
                  className={`p-4 rounded-xl border ${currency === 'NGN' ? 'border-accent-primary bg-accent-primary/5 text-accent-primary' : 'border-border-color text-text-primary'} font-medium transition-colors`}
                >
                  NGN (₦)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">{currency === 'USD' ? '$' : '₦'}</span>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-bg-tertiary border border-border-color rounded-xl pl-8 pr-4 py-3 text-text-primary focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full bg-accent-primary hover:bg-accent-hover text-slate-900 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              Proceed to Payment
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Select Payment Method</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currency === 'USD' ? (
                  wallets.map(wallet => (
                    <button
                      key={wallet.id}
                      type="button"
                      onClick={() => setPaymentMethod(wallet.id)}
                      className={`p-4 rounded-xl border flex items-center gap-3 ${paymentMethod === wallet.id ? 'border-accent-primary bg-accent-primary/5 text-accent-primary' : 'border-border-color text-text-primary'} font-medium transition-colors text-left`}
                    >
                      <img src={wallet.logo} alt={wallet.name} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                      <div>
                        <div className="font-semibold">{wallet.name}</div>
                        <div className="text-xs opacity-70">Network: {wallet.network}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    className={`p-4 rounded-xl border flex items-center gap-3 ${paymentMethod === 'Bank Transfer' ? 'border-accent-primary bg-accent-primary/5 text-accent-primary' : 'border-border-color text-text-primary'} font-medium transition-colors text-left`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <div>
                      <div className="font-semibold">Bank Transfer</div>
                      <div className="text-xs opacity-70">Direct transfer to local bank account</div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-bg-tertiary text-text-primary font-semibold py-3 rounded-xl transition-colors border border-border-light"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!paymentMethod}
                className="flex-1 bg-accent-primary hover:bg-accent-hover text-slate-900 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-text-primary">Payment Details</h3>
                <div className="text-sm font-medium px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full">
                  Amount: {currency === 'USD' ? '$' : '₦'}{amount}
                </div>
              </div>

              {selectedWallet ? (
                <CryptoWalletCard 
                  name={selectedWallet.name}
                  network={selectedWallet.network}
                  address={selectedWallet.address}
                  logo={selectedWallet.logo}
                  qrLogo={selectedWallet.qrLogo}
                />
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 transition-colors duration-300">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Bank Transfer Details</h3>
                  <div className="space-y-2 text-text-primary">
                    <p className="text-sm"><span className="font-medium">Bank:</span> {bankDetails?.bankName || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Account Number:</span> {bankDetails?.accountNumber || 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Account Name:</span> {bankDetails?.accountName || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Upload Proof of Payment</label>
              <div className="border-2 border-dashed border-border-color rounded-xl p-8 text-center transition-colors duration-300">
                <UploadCloud className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                <p className="text-sm text-text-secondary mb-4">Upload a screenshot or PDF of your receipt</p>
                <input
                  type="text"
                  required
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                  placeholder="Enter filename (mock upload)"
                  className="w-full bg-bg-tertiary border border-border-color rounded-xl px-4 py-2 text-text-primary text-sm outline-none transition-colors duration-300"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20 transition-colors duration-300">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 bg-bg-tertiary text-text-primary font-semibold py-3 rounded-xl transition-colors border border-border-light"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !proof}
                className="flex-1 bg-accent-primary hover:bg-accent-hover text-slate-900 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Deposit'}
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-500 transition-colors duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Deposit Submitted</h2>
            <p className="text-text-secondary max-w-sm mx-auto">
              Your deposit request has been submitted successfully and is pending admin approval.
            </p>
            <button
              onClick={() => navigate('/fund?tab=history')}
              className="mt-6 inline-block bg-accent-primary hover:bg-accent-hover text-slate-900 font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              View Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

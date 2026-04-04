import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Wallet, Building2, CreditCard, Bitcoin, Copy, UploadCloud, Lock, ArrowRight, Info, X, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import ThemeToggle from '../components/ThemeToggle';
import CryptoWalletCard from '../components/CryptoWalletCard';

const WALLETS = [
  {
    id: 'usdt-trc20',
    name: 'USDT',
    network: 'TRC20',
    address: 'TJTym5Qs77hBEr2kEiJPVEQwR4kM2AosSG',
    logo: 'https://i.imgur.com/vhrolAG.png'
  },
  {
    id: 'usdt-erc20',
    name: 'Ethereum',
    network: 'ERC20',
    address: '0x264E87AA85CBC641cBC4261a193bdc9948934E6D',
    logo: 'https://i.imgur.com/x0Yn97W.png'
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    network: 'BTC',
    address: 'bc1p2mw24svf4yg5d6v4lxk5309jlcgcqjdagaefuc0adac9z4ys2p5qfq9t8t',
    logo: 'https://i.imgur.com/cM4qrCS.png'
  }
];

const REGIONS = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
  'France', 'Singapore', 'Tanzania', 'Nigeria', 'Uganda', 
  'Cameroon', 'South Africa', 'Kenya', 'Ghana'
];

type PaymentMethod = 'wallet' | 'bank' | 'card' | 'crypto';

export default function InvestmentFundingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, userData } = useAuth();
  const user = userData || { fullName: 'User', balance: 0 };
  const [activeMethod, setActiveMethod] = useState<PaymentMethod | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [regionError, setRegionError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(WALLETS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);

  // Validation States
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Extract state passed from InvestmentReviewPage
  const { plan, amount, isNaira } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Redirect back if no plan data is found
    if (!plan || !amount) {
      navigate('/invest');
    }
  }, [plan, amount, navigate]);

  if (!plan || !amount) return null;

  const symbol = isNaira ? '₦' : '$';
  const selectedWallet = WALLETS.find(w => w.id === selectedCryptoId);
  
  // Use actual wallet balance
  const walletBalance = user?.balance || 0;
  const isBalanceSufficient = walletBalance >= amount;

  const handleMethodClick = (method: PaymentMethod) => {
    setActiveMethod(method);
    setIsModalOpen(true);
    // Reset validation states when switching methods
    setPaymentProof(null);
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  const handleRegionClick = (region: string) => {
    if (region === 'Nigeria') {
      setSelectedRegion(region);
      setRegionError(null);
      setTimeout(() => {
        setIsRegionModalOpen(false);
        setSelectedRegion(null);
        handleMethodClick('bank');
      }, 300);
    } else {
      setSelectedRegion(null);
      setRegionError("This payment method is not available in your region");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isCardValid = () => {
    const nameValid = cardName.trim().split(/\s+/).length >= 2;
    const numberValid = cardNumber.replace(/\D/g, '').length >= 15;
    const cvvValid = cardCvv.replace(/\D/g, '').length >= 3;
    
    let expiryValid = false;
    const expiryMatch = cardExpiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
    if (expiryMatch) {
      const month = parseInt(expiryMatch[1], 10);
      const year = parseInt(`20${expiryMatch[2]}`, 10);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      if (year > currentYear || (year === currentYear && month >= currentMonth)) {
        expiryValid = true;
      }
    }

    return nameValid && numberValid && expiryValid && cvvValid;
  };

  const isConfirmDisabled = () => {
    if (isProcessing) return true;
    if (activeMethod === 'wallet' && !isBalanceSufficient) return true;
    if ((activeMethod === 'bank' || activeMethod === 'crypto') && !paymentProof) return true;
    if (activeMethod === 'card' && !isCardValid()) return true;
    return false;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted.substring(0, 19));
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setCardExpiry(value.substring(0, 5));
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardCvv(value.substring(0, 4));
  };

  const handleConfirm = async () => {
    if (!activeMethod || !authUser) return;
    
    setIsProcessing(true);
    
    try {
      const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const paymentMethodStr = activeMethod === 'crypto' && selectedWallet 
        ? `${selectedWallet.name} (${selectedWallet.network})` 
        : activeMethod;

      await addDoc(collection(db, 'investments'), {
        userId: authUser.uid,
        planId: plan.id,
        planName: plan.name,
        amount: parseFloat(amount),
        currency: isNaira ? 'NGN' : 'USD',
        roi: plan.roi,
        duration: plan.duration,
        status: 'pending',
        paymentMethod: paymentMethodStr,
        transactionId,
        depositProof: paymentProof,
        createdAt: serverTimestamp()
      });

      await addDoc(collection(db, 'transactions'), {
        userId: authUser.uid,
        type: 'PLAN_SUBSCRIPTION',
        amount: parseFloat(amount),
        currency: isNaira ? 'NGN' : 'USD',
        planName: plan.name,
        paymentMethod: paymentMethodStr,
        depositProof: paymentProof,
        status: 'PENDING',
        transactionId,
        createdAt: serverTimestamp()
      });

      navigate('/investment/pending', {
        state: { 
          plan, 
          amount, 
          isNaira, 
          paymentMethod: paymentMethodStr,
          transactionId,
          dateSubmitted: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to submit investment:', error);
      setIsProcessing(false);
    }
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    switch (activeMethod) {
      case 'wallet': return 'Confirm Investment';
      case 'bank': return 'I Have Made the Transfer';
      case 'card': return 'Pay Now';
      case 'crypto': return 'Confirm Payment';
      default: return 'Select Payment Method';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderUploadSection = () => (
    <div>
      <p className="text-sm font-medium text-text-primary mb-2">Upload Payment Proof</p>
      {!paymentProof ? (
        <div className="border-2 border-dashed border-border-light rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mb-4">
            <UploadCloud className="w-6 h-6 text-accent-primary" />
          </div>
          <p className="text-sm font-medium text-text-primary mb-4">Choose how to upload your proof</p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <label className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors cursor-pointer text-sm font-medium">
              <Camera className="w-4 h-4" />
              Take Photo
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </label>
            
            <label className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border-light hover:bg-bg-hover transition-colors cursor-pointer text-sm font-medium">
              <UploadCloud className="w-4 h-4" />
              Gallery
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </label>
          </div>
          
          <p className="text-xs text-text-secondary mt-4">SVG, PNG, JPG (max. 5MB)</p>
        </div>
      ) : (
        <div className="border border-border-light rounded-xl p-4 flex flex-col items-center bg-bg-secondary/30">
          <div className="relative w-full max-w-[200px] aspect-auto rounded-lg overflow-hidden mb-4 border border-border-light bg-black/5">
            <img src={paymentProof} alt="Payment Proof Preview" className="w-full h-auto object-contain" />
          </div>
          <div className="flex flex-col gap-2 w-full max-w-[300px]">
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors cursor-pointer text-xs font-medium">
                <Camera className="w-3.5 h-3.5" />
                Retake
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>
              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border-light hover:bg-bg-hover transition-colors cursor-pointer text-xs font-medium">
                <UploadCloud className="w-3.5 h-3.5" />
                Gallery
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>
            </div>
            <button type="button" onClick={() => setPaymentProof(null)} className="w-full py-2 rounded-lg border border-red-500/20 text-red-500 text-xs font-medium text-center hover:bg-red-500/10 transition-colors">
              Remove Image
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
      {/* Top Navigation Bar */}
      <nav className="h-[72px] border-b border-border-light bg-bg-secondary/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <img src="https://i.imgur.com/jt4vAVS.png" alt="CGA Logo" className="h-5 md:h-6 w-auto" referrerPolicy="no-referrer" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="w-9 h-9 rounded-full bg-accent-secondary flex items-center justify-center text-text-primary font-semibold border border-border-light">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Stepper */}
      <div className="w-full border-b border-border-light bg-bg-secondary/50">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between relative">
            {/* Background Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-border-light -z-10"></div>
            {/* Active Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2/3 h-[2px] bg-emerald-500 -z-10"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 bg-bg-secondary px-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-text-secondary hidden sm:block">Select Plan</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 bg-bg-secondary px-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-text-secondary hidden sm:block">Review</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 bg-bg-secondary px-2">
              <div className="w-8 h-8 rounded-full bg-accent-primary text-slate-900 flex items-center justify-center shadow-[0_0_15px_rgba(200,255,0,0.3)] ring-4 ring-accent-primary/20">
                <span className="font-bold text-sm">3</span>
              </div>
              <span className="text-xs font-bold text-text-primary hidden sm:block">Fund</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-2 bg-bg-secondary px-2">
              <div className="w-8 h-8 rounded-full bg-bg-hover text-text-muted border border-border-light flex items-center justify-center">
                <span className="font-semibold text-sm">4</span>
              </div>
              <span className="text-xs font-medium text-text-muted hidden sm:block">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 pb-32 lg:pb-10">
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-bg-hover text-text-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Fund Your Investment</h1>
            <p className="text-sm text-text-secondary mt-1">Choose a funding method to proceed.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN - Payment Methods */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Bank Transfer */}
            <button 
              className="w-full text-left bg-bg-card border border-border-light rounded-[20px] overflow-hidden transition-all duration-200 hover:border-accent-primary/50 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              onClick={() => setIsRegionModalOpen(true)}
            >
              <div className="p-4 sm:p-6 flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-bg-hover text-text-secondary">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">Bank Transfer</h3>
                  <p className="text-xs sm:text-sm text-text-secondary">Transfer directly to our corporate account</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted" />
              </div>
            </button>

            {/* Crypto */}
            <button 
              className="w-full text-left bg-bg-card border border-border-light rounded-[20px] overflow-hidden transition-all duration-200 hover:border-accent-primary/50 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              onClick={() => handleMethodClick('crypto')}
            >
              <div className="p-4 sm:p-6 flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-bg-hover text-text-secondary">
                  <Bitcoin className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">Cryptocurrency</h3>
                  <p className="text-xs sm:text-sm text-text-secondary">Pay with USDT, BTC, or ETH</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted" />
              </div>
            </button>

            {/* Debit/Credit Card */}
            <button 
              className="w-full text-left bg-bg-card border border-border-light rounded-[20px] overflow-hidden transition-all duration-200 hover:border-accent-primary/50 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              onClick={() => handleMethodClick('card')}
            >
              <div className="p-4 sm:p-6 flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-bg-hover text-text-secondary">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">Debit/Credit Card</h3>
                  <p className="text-xs sm:text-sm text-text-secondary">Pay securely with Visa or Mastercard</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted" />
              </div>
            </button>

            {/* Wallet Balance */}
            <button 
              className="w-full text-left bg-bg-card border border-border-light rounded-[20px] overflow-hidden transition-all duration-200 hover:border-accent-primary/50 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              onClick={() => handleMethodClick('wallet')}
            >
              <div className="p-4 sm:p-6 flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-bg-hover text-text-secondary">
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">Wallet Balance</h3>
                  <p className="text-xs sm:text-sm text-text-secondary">Pay directly from your available balance</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted" />
              </div>
            </button>

          </div>

          {/* RIGHT COLUMN (Sticky Summary) */}
          <div className="lg:col-span-4">
            <div className="sticky top-[120px]">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-bg-card/80 backdrop-blur-xl border border-border-light rounded-[20px] p-6 shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <h3 className="text-lg font-bold text-text-primary mb-6">Investment Summary</h3>
                
                <div className="space-y-3.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Investment Plan</span>
                    <span className="font-semibold text-text-primary">{plan.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Investment Amount</span>
                    <span className="font-semibold text-text-primary">{symbol}{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Selected Currency</span>
                    <span className="font-semibold text-text-primary">{isNaira ? '₦' : '$'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Daily ROI</span>
                    <span className="font-semibold text-text-primary">{plan.roi}%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </main>

      {/* Region Selection Modal */}
      <AnimatePresence>
        {isRegionModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 pb-[120px] sm:p-6 sm:pb-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => { setIsRegionModalOpen(false); setRegionError(null); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-bg-card border border-border-light rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-140px)] sm:max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-light">
                <h2 className="text-xl font-bold text-text-primary">Choose your transfer region</h2>
                <button onClick={() => { setIsRegionModalOpen(false); setRegionError(null); }} className="p-2 rounded-full hover:bg-bg-hover text-text-secondary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-4 sm:p-6 overflow-y-auto">
                {regionError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium text-center">
                    {regionError}
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {REGIONS.map(region => (
                    <button
                      key={region}
                      onClick={() => handleRegionClick(region)}
                      className={`p-4 rounded-xl border transition-all text-sm font-medium flex items-center justify-center text-center ${
                        selectedRegion === region
                          ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' 
                          : 'border-border-light bg-bg-primary text-text-primary hover:border-accent-primary/50 hover:bg-bg-hover'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Method Modal */}
      <AnimatePresence>
        {isModalOpen && activeMethod && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pb-[120px] sm:p-6 sm:pb-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-bg-card border border-border-light rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-140px)] sm:max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-light">
                <h2 className="text-xl font-bold text-text-primary">
                  {activeMethod === 'bank' && 'Bank Transfer'}
                  {activeMethod === 'crypto' && 'Cryptocurrency'}
                  {activeMethod === 'card' && 'Debit/Credit Card'}
                  {activeMethod === 'wallet' && 'Wallet Balance'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-bg-hover text-text-secondary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-4 sm:p-6 overflow-y-auto">
                {activeMethod === 'bank' && (
                  <div className="space-y-6">
                    <div className="bg-bg-primary border border-border-light rounded-xl p-4 sm:p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary">Bank Name</span>
                        <span className="font-semibold text-text-primary">Guaranty Trust Bank</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary">Account Name</span>
                        <span className="font-semibold text-text-primary">CGA Investments Ltd</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary">Account Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-text-primary text-lg tracking-wider">0123456789</span>
                          <button onClick={() => copyToClipboard('0123456789')} className="p-1.5 rounded-md hover:bg-bg-hover text-text-secondary transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border-light flex justify-between items-center">
                        <span className="text-sm text-text-secondary">Reference Code</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-accent-primary bg-accent-primary/10 px-2 py-1 rounded">CGA-INV-882</span>
                          <button onClick={() => copyToClipboard('CGA-INV-882')} className="p-1.5 rounded-md hover:bg-bg-hover text-text-secondary transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {renderUploadSection()}
                  </div>
                )}

                {activeMethod === 'crypto' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-text-secondary uppercase tracking-wider">Select Asset & Network</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {WALLETS.map(wallet => (
                          <button
                            key={wallet.id}
                            type="button"
                            onClick={() => setSelectedCryptoId(wallet.id)}
                            className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                              selectedCryptoId === wallet.id 
                                ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' 
                                : 'border-border-light bg-bg-primary text-text-secondary hover:border-border-light/80'
                            }`}
                          >
                            <img src={wallet.logo} alt={wallet.name} className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                            <div className="text-left">
                              <div className="text-xs font-bold leading-none">{wallet.name}</div>
                              <div className="text-[10px] opacity-70">{wallet.network}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedWallet && (
                      <CryptoWalletCard 
                        name={selectedWallet.name}
                        network={selectedWallet.network}
                        address={selectedWallet.address}
                        logo={selectedWallet.logo}
                      />
                    )}

                    {renderUploadSection()}
                  </div>
                )}

                {activeMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Cardholder Name</label>
                        <input 
                          type="text" 
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-bg-primary border border-border-light rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" 
                          placeholder="John Doe" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Card Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="w-full bg-bg-primary border border-border-light rounded-xl pl-12 pr-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-mono" 
                            placeholder="0000 0000 0000 0000" 
                          />
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">Expiry Date</label>
                          <input 
                            type="text" 
                            value={cardExpiry}
                            onChange={handleCardExpiryChange}
                            className="w-full bg-bg-primary border border-border-light rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-mono" 
                            placeholder="MM/YY" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">CVV</label>
                          <input 
                            type="text" 
                            value={cardCvv}
                            onChange={handleCardCvvChange}
                            className="w-full bg-bg-primary border border-border-light rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-mono" 
                            placeholder="123" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-text-secondary mt-4">
                      <Lock className="w-3.5 h-3.5" />
                      Secured by encrypted payment gateway
                    </div>
                  </div>
                )}

                {activeMethod === 'wallet' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-bg-primary border border-border-light">
                      <span className="text-text-secondary">Available Balance</span>
                      <span className="font-bold text-text-primary">{symbol}{walletBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-bg-primary border border-border-light">
                      <span className="text-text-secondary">Investment Amount</span>
                      <span className="font-bold text-text-primary">{symbol}{amount.toLocaleString()}</span>
                    </div>
                    
                    {isBalanceSufficient ? (
                      <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Balance sufficient
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                        <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">!</div>
                        Insufficient balance
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-border-light bg-bg-secondary/50">
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled()}
                  className="w-full h-14 rounded-xl font-bold text-slate-900 bg-accent-primary hover:bg-[#b3e600] disabled:bg-bg-hover disabled:text-text-muted disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(200,255,0,0.3)] disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {getButtonText()}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

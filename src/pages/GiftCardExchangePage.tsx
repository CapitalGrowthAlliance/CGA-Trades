import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, RefreshCw, Upload, X, CheckCircle, CheckCircle2, AlertCircle, Loader2, CreditCard, DollarSign, ChevronRight, Bitcoin, Building2, Globe, Camera, Image as ImageIcon } from 'lucide-react';

// --- Scoped Styles for Gold Theme ---
const goldStyles = `
  /* Global Gold Theme Override */
  body.gold-theme-active {
    background-color: #050505 !important;
  }
  body.gold-theme-active header,
  body.gold-theme-active footer,
  body.gold-theme-active nav {
    background-color: rgba(10, 10, 10, 0.9) !important;
    border-color: rgba(212, 175, 55, 0.3) !important;
  }
  body.gold-theme-active nav a {
    color: #D4AF37 !important;
    transition: all 0.3s ease;
  }
  body.gold-theme-active nav a:hover {
    color: #F3E5AB !important;
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
  }
  body.gold-theme-active svg {
    color: #D4AF37 !important;
  }
  body.gold-theme-active .bg-bg-secondary {
    background-color: #0a0a0a !important;
  }
  body.gold-theme-active .text-text-primary {
    color: #D4AF37 !important;
  }
  body.gold-theme-active .text-text-secondary {
    color: #C5B358 !important;
  }
  body.gold-theme-active .border-border-light {
    border-color: rgba(212, 175, 55, 0.3) !important;
  }

  .gold-vault-container {
    /* Override all global CSS variables for this container */
    --bg-primary: #050505 !important;
    --bg-secondary: #0a0a0a !important;
    --text-primary: #F3E5AB !important;
    --text-secondary: #C5B358 !important;
    
    font-family: 'Montserrat', sans-serif;
    background: radial-gradient(circle at 50% -20%, #3a2a00 0%, #050505 70%);
    background-color: #050505;
    color: #F3E5AB;
    min-height: 100vh;
    width: 100%;
    position: relative;
    overflow-x: hidden;
  }

  .gold-vault-container h1, 
  .gold-vault-container h2, 
  .gold-vault-container h3, 
  .gold-vault-container .font-cinzel {
    font-family: 'Cinzel', serif;
  }

  .gold-gradient-text {
    background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0px 2px 10px rgba(212, 175, 55, 0.2);
  }

  .gold-gradient-bg {
    background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
  }

  .gold-glass-card {
    background: rgba(20, 15, 0, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(212, 175, 55, 0.3);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(212, 175, 55, 0.05);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .gold-glass-card:hover {
    border-color: rgba(212, 175, 55, 0.8);
    box-shadow: 0 15px 45px 0 rgba(212, 175, 55, 0.15), inset 0 0 30px rgba(212, 175, 55, 0.1);
    transform: translateY(-5px);
  }

  .gold-button {
    background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728);
    color: #050505;
    border: none;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .gold-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
    transform: skewX(-25deg);
    animation: shimmer 3s infinite;
  }

  .gold-button:hover {
    box-shadow: 0 0 25px rgba(212, 175, 55, 0.7);
    transform: scale(1.02);
  }

  .gold-button-outline {
    background: transparent;
    color: #D4AF37;
    border: 1px solid #D4AF37;
    transition: all 0.3s ease;
    box-shadow: inset 0 0 10px rgba(212, 175, 55, 0.1);
  }

  .gold-button-outline:hover {
    background: rgba(212, 175, 55, 0.1);
    box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.3), 0 0 15px rgba(212, 175, 55, 0.2);
  }

  .gold-input {
    background: rgba(10, 8, 0, 0.8);
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #F3E5AB;
    transition: all 0.3s ease;
  }

  .gold-input:focus {
    outline: none;
    border-color: #D4AF37;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
  }

  .gold-input::placeholder {
    color: rgba(197, 179, 88, 0.5);
  }

  @keyframes shimmer {
    0% { left: -100%; }
    20% { left: 200%; }
    100% { left: 200%; }
  }

  /* Particle Effect */
  .gold-particle {
    position: absolute;
    background: #D4AF37;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    animation: float-up 5s linear infinite;
  }

  @keyframes float-up {
    0% { transform: translateY(0) scale(0); opacity: 0; }
    20% { opacity: 0.6; }
    80% { opacity: 0.6; }
    100% { transform: translateY(-100px) scale(1); opacity: 0; }
  }

  /* Nigeria Theme Active Highlights */
  .nigeria-theme-active .gold-glass-card {
    border-color: rgba(212, 175, 55, 0.5);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(212, 175, 55, 0.08);
  }
  .nigeria-theme-active .gold-input:focus {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  }
`;

// --- Mock Data ---
const AVAILABLE_CARDS = [
  { id: 1, type: 'Amazon', value: 100, price: 92, discount: '8% OFF', image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=400' },
  { id: 2, type: 'iTunes', value: 50, price: 45, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400' },
  { id: 3, type: 'Steam', value: 200, price: 175, discount: '12.5% OFF', image: 'https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&q=80&w=400' },
  { id: 4, type: 'Google Play', value: 25, price: 23, discount: '8% OFF', image: 'https://images.unsplash.com/photo-1607252656733-fd742050d565?auto=format&fit=crop&q=80&w=400' },
];

const GIFT_CARD_TYPES = [
  'Apple', 'Amazon', 'iTunes', 'Razer Gold', 'Google Play', 
  'Netflix', 'Visa', 'Sony', 'Walmart', 'Others'
];

export default function GiftCardExchangePage() {
  const [activeModal, setActiveModal] = useState<'buy' | 'sell' | 'buyGuide' | 'sellGuide' | null>(null);
  
  // Sell Form State
  const [sellForm, setSellForm] = useState({
    type: 'Apple',
    otherType: '',
    amount: '',
    code: '',
    paymentMethod: '' as 'usdt' | 'btc' | 'bank' | '',
    walletAddress: '',
    bankDetails: {
      fullName: '',
      bankName: '',
      accountNumber: ''
    },
    image: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);
  const [sellError, setSellError] = useState('');
  
  // Bank Region Modal State
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [regionError, setRegionError] = useState('');
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [isBankDetailsComplete, setIsBankDetailsComplete] = useState(false);
  const [bankModalError, setBankModalError] = useState('');

  // Mobile & Image Preview State
  const [isMobile, setIsMobile] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const REGIONS = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'Singapore', 'Tanzania', 
    'Nigeria', 'Uganda', 'Cameroon', 'South Africa', 
    'Kenya', 'Ghana'
  ];

  // Device Detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll Lock for Modals
  useEffect(() => {
    if (activeModal || showRegionModal || showBankDetailsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeModal, showRegionModal, showBankDetailsModal]);

  // Cleanup Image Preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSellForm({...sellForm, image: file});
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handlePaymentMethodChange = (method: 'usdt' | 'btc' | 'bank') => {
    if (method === 'bank') {
      setShowRegionModal(true);
      return;
    }
    
    setSellForm({
      ...sellForm,
      paymentMethod: method,
      walletAddress: '',
      bankDetails: { fullName: '', bankName: '', accountNumber: '' }
    });
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    if (region !== 'Nigeria') {
      setRegionError('Payment method not supported in your region');
    } else {
      setRegionError('');
      setSellForm({
        ...sellForm,
        paymentMethod: 'bank',
        walletAddress: '',
      });
      setShowRegionModal(false);
      if (!isBankDetailsComplete) {
        setShowBankDetailsModal(true);
      }
    }
  };

  const handleSaveBankDetails = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sellForm.bankDetails.fullName || !sellForm.bankDetails.bankName || !sellForm.bankDetails.accountNumber) {
      setBankModalError('Please fill in all fields');
      return;
    }
    setBankModalError('');
    setIsBankDetailsComplete(true);
    setShowBankDetailsModal(false);
  };

  // Global Theme Override Effect
  useEffect(() => {
    document.body.classList.add('gold-theme-active');
    return () => {
      document.body.classList.remove('gold-theme-active');
    };
  }, []);

  // Particles Effect
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'gold-particle';
      
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(particle);
      
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, 5000);
    };

    const interval = setInterval(createParticle, 200);
    return () => clearInterval(interval);
  }, []);

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSellError('');
    
    if (!sellForm.amount || !sellForm.code || !sellForm.paymentMethod || (sellForm.type === 'Others' && !sellForm.otherType)) {
      setSellError('Please fill in all required fields and select a payment method.');
      return;
    }

    if (sellForm.paymentMethod === 'usdt' || sellForm.paymentMethod === 'btc') {
      if (!sellForm.walletAddress) {
        setSellError('Please enter your wallet address.');
        return;
      }
    } else if (sellForm.paymentMethod === 'bank') {
      if (!isBankDetailsComplete || !sellForm.bankDetails.fullName || !sellForm.bankDetails.bankName || !sellForm.bankDetails.accountNumber) {
        setSellError('Please enter your complete bank details.');
        return;
      }
    }

    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setSellSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSellSuccess(false);
        setActiveModal(null);
        setIsBankDetailsComplete(false);
        setSellForm({ 
          type: 'Apple', 
          otherType: '',
          amount: '', 
          code: '',
          paymentMethod: '',
          walletAddress: '',
          bankDetails: { fullName: '', bankName: '', accountNumber: '' },
          image: null 
        });
      }, 3000);
    }, 2000);
  };

  return (
    <div className={`gold-vault-container ${selectedRegion === 'Nigeria' ? 'nigeria-theme-active' : ''}`} ref={containerRef}>
      <style>{goldStyles}</style>

      {/* Ambient Light Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#AA771C] rounded-full mix-blend-screen filter blur-[200px] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-10 md:py-20 min-h-screen flex flex-col">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 md:mb-20 mt-16 md:mt-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 mb-2 md:mb-8">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
            <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">Premium Trading Desk</span>
          </div>
          
          <h1 className="text-[6.5vw] min-[400px]:text-[26px] sm:text-5xl md:text-7xl font-bold mb-1 md:mb-6 tracking-tight whitespace-nowrap">
            <span className="gold-gradient-text">CGA Gift Card</span> Exchange
          </h1>
          <p className="text-[3.2vw] min-[400px]:text-[12px] sm:text-lg md:text-2xl text-[#C5B358] max-w-3xl mx-auto font-light tracking-wide leading-snug md:leading-relaxed">
            <span className="block sm:inline">Buy and Sell Gift Cards Instantly </span>
            <span className="block sm:inline">with Premium Rates.</span>
            <span className="block mt-1 sm:mt-0 sm:ml-1">Experience the luxury of seamless digital asset exchange.</span>
          </p>
        </motion.div>

        {/* Main Action Cards */}
        <div id="trading-desk" className="grid grid-cols-2 gap-3 md:gap-8 max-w-5xl mx-auto w-full mb-12 md:mb-24">
          
          {/* BUY CARD COLUMN */}
          <div className="flex flex-col gap-3">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="gold-glass-card rounded-[16px] p-4 md:p-10 flex flex-col items-center text-center group cursor-pointer h-full"
              onClick={() => setActiveModal('buy')}
            >
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-[#D4AF37]/50 flex items-center justify-center mb-4 md:mb-8 group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br from-[#1a1400] to-[#050505] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <ShoppingBag className="w-5 h-5 md:w-8 md:h-8 text-[#D4AF37]" />
              </div>
              <h2 className="text-sm md:text-3xl font-bold mb-2 md:mb-4 text-[#F3E5AB] tracking-wider">BUY<span className="hidden md:inline"> GIFT CARDS</span></h2>
              <p className="text-[10px] md:text-base text-[#C5B358] mb-4 md:mb-10 leading-snug md:leading-relaxed hidden sm:block">
                Purchase premium gift cards securely at discounted rates. Instant delivery to your vault.
              </p>
              <button className="gold-button-outline w-full py-2 md:py-4 rounded-sm font-semibold tracking-widest uppercase text-[10px] md:text-sm mt-auto">
                Browse<span className="hidden md:inline"> Inventory</span>
              </button>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() => setActiveModal('buyGuide')}
              className="gold-glass-card w-full py-3 rounded-[12px] flex items-center justify-center gap-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
            >
              <span className="text-xs md:text-sm font-semibold tracking-widest uppercase">Buy Guide</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* SELL CARD COLUMN */}
          <div className="flex flex-col gap-3">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="gold-glass-card rounded-[16px] p-4 md:p-10 flex flex-col items-center text-center group cursor-pointer h-full"
              onClick={() => setActiveModal('sell')}
            >
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-[#D4AF37]/50 flex items-center justify-center mb-4 md:mb-8 group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br from-[#1a1400] to-[#050505] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <RefreshCw className="w-5 h-5 md:w-8 md:h-8 text-[#D4AF37]" />
              </div>
              <h2 className="text-sm md:text-3xl font-bold mb-2 md:mb-4 text-[#F3E5AB] tracking-wider">SELL<span className="hidden md:inline"> GIFT CARDS</span></h2>
              <p className="text-[10px] md:text-base text-[#C5B358] mb-4 md:mb-10 leading-snug md:leading-relaxed hidden sm:block">
                Liquidate your unused gift cards for instant cash. Highest market rates guaranteed.
              </p>
              <button className="gold-button w-full py-2 md:py-4 rounded-sm font-semibold tracking-widest uppercase text-[10px] md:text-sm mt-auto">
                Trade<span className="hidden md:inline"> Now</span>
              </button>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => setActiveModal('sellGuide')}
              className="gold-glass-card w-full py-3 rounded-[12px] flex items-center justify-center gap-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
            >
              <span className="text-xs md:text-sm font-semibold tracking-widest uppercase">Sell Guide</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

        </div>

      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+20px)]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => !isSubmitting && setActiveModal(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: -10 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="gold-glass-card w-[90%] max-w-[360px] rounded-[16px] relative z-10 overflow-hidden max-h-[75vh] flex flex-col mb-5"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-[#D4AF37]/20 flex justify-between items-center bg-[#0a0800] shrink-0">
                <h3 className="text-lg font-cinzel font-bold text-[#D4AF37]">
                  {activeModal === 'sell' ? 'Initiate Sell Trade' : 'Premium Inventory'}
                </h3>
                <button 
                  onClick={() => !isSubmitting && setActiveModal(null)}
                  className="text-[#C5B358] hover:text-[#F3E5AB] transition-colors p-1"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - SELL */}
              {activeModal === 'sell' && (
                <div className="p-4 overflow-y-auto custom-scrollbar">
                  {sellSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
                      </div>
                      <h4 className="text-xl font-cinzel font-bold text-[#D4AF37] mb-2">Trade Submitted</h4>
                      <p className="text-sm text-[#C5B358]">Your gift card is being verified. Funds will be credited shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSellSubmit} className="space-y-4">
                      
                      {sellError && (
                        <div className="p-3 border border-red-500/30 bg-red-500/10 rounded flex items-start gap-2 text-red-200 text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <p>{sellError}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold tracking-widest uppercase text-[#C5B358]">Card Type</label>
                          <select 
                            className="w-full gold-input p-2.5 text-sm rounded-sm appearance-none"
                            value={sellForm.type}
                            onChange={(e) => setSellForm({...sellForm, type: e.target.value, otherType: e.target.value === 'Others' ? sellForm.otherType : ''})}
                            disabled={isSubmitting}
                          >
                            {GIFT_CARD_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold tracking-widest uppercase text-[#C5B358]">Card Value ($)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5B358]/50" />
                            <input 
                              type="number" 
                              placeholder="0.00"
                              className="w-full gold-input p-2.5 pl-9 text-sm rounded-sm"
                              value={sellForm.amount}
                              onChange={(e) => setSellForm({...sellForm, amount: e.target.value})}
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {sellForm.type === 'Others' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1.5 overflow-hidden"
                          >
                            <label className="text-[10px] font-semibold tracking-widest uppercase text-[#C5B358]">Enter Gift Card Name</label>
                            <input 
                              type="text" 
                              placeholder="Type card name"
                              className="w-full gold-input p-2.5 text-sm rounded-sm"
                              value={sellForm.otherType}
                              onChange={(e) => setSellForm({...sellForm, otherType: e.target.value})}
                              disabled={isSubmitting}
                              required
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-[#C5B358]">Enter Gift Card Code *</label>
                        <input 
                          type="text" 
                          placeholder="Type gift card code here"
                          className="w-full gold-input p-2.5 text-sm rounded-sm"
                          value={sellForm.code}
                          onChange={(e) => setSellForm({...sellForm, code: e.target.value})}
                          disabled={isSubmitting}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-[#C5B358]">Upload Card Image</label>
                        
                        {imagePreview ? (
                          <div className="relative rounded-sm overflow-hidden border border-[#D4AF37]/30 group">
                            <img src={imagePreview} alt="Card Preview" className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => {
                                  setSellForm({...sellForm, image: null});
                                  setImagePreview(null);
                                }}
                                className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2">
                            {isMobile && (
                              <div className="relative">
                                <input 
                                  type="file" 
                                  id="card-image-camera" 
                                  className="hidden" 
                                  accept="image/*"
                                  capture="environment"
                                  disabled={isSubmitting}
                                  onChange={handleImageChange}
                                />
                                <label htmlFor="card-image-camera" className="gold-button-outline w-full py-2.5 rounded-sm flex items-center justify-center gap-2 cursor-pointer text-xs">
                                  <Camera className="w-4 h-4" />
                                  Take Photo
                                </label>
                              </div>
                            )}
                            <div className="relative">
                              <input 
                                type="file" 
                                id="card-image-gallery" 
                                className="hidden" 
                                accept="image/*"
                                disabled={isSubmitting}
                                onChange={handleImageChange}
                              />
                              <label htmlFor="card-image-gallery" className="gold-button-outline w-full py-2.5 rounded-sm flex items-center justify-center gap-2 cursor-pointer text-xs">
                                <ImageIcon className="w-4 h-4" />
                                Upload Image
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 pt-3 border-t border-[#D4AF37]/20">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-[#C5B358]">Select Payment Method *</label>
                        <div className="grid grid-cols-3 gap-2">
                          <div 
                            onClick={() => !isSubmitting && handlePaymentMethodChange('usdt')}
                            className={`cursor-pointer border rounded-sm p-2 flex flex-col items-center justify-center gap-1.5 transition-all ${sellForm.paymentMethod === 'usdt' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#D4AF37]/30 bg-[#0a0800]/50 hover:border-[#D4AF37]/60'}`}
                          >
                            <div className="w-6 h-6 rounded-full bg-[#26A17B]/20 flex items-center justify-center">
                              <DollarSign className="w-3.5 h-3.5 text-[#26A17B]" />
                            </div>
                            <span className="text-[10px] font-medium text-center leading-tight">USDT<br/><span className="text-[8px] text-[#D4AF37]">(Rec)</span></span>
                          </div>

                          <div 
                            onClick={() => !isSubmitting && handlePaymentMethodChange('btc')}
                            className={`cursor-pointer border rounded-sm p-2 flex flex-col items-center justify-center gap-1.5 transition-all ${sellForm.paymentMethod === 'btc' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#D4AF37]/30 bg-[#0a0800]/50 hover:border-[#D4AF37]/60'}`}
                          >
                            <div className="w-6 h-6 rounded-full bg-[#F7931A]/20 flex items-center justify-center">
                              <Bitcoin className="w-3.5 h-3.5 text-[#F7931A]" />
                            </div>
                            <span className="text-[10px] font-medium text-center leading-tight">Bitcoin</span>
                          </div>

                          <div 
                            onClick={() => !isSubmitting && handlePaymentMethodChange('bank')}
                            className={`cursor-pointer border rounded-sm p-2 flex flex-col items-center justify-center gap-1.5 transition-all ${sellForm.paymentMethod === 'bank' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#D4AF37]/30 bg-[#0a0800]/50 hover:border-[#D4AF37]/60'}`}
                          >
                            <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                              <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                            </div>
                            <span className="text-[10px] font-medium text-center leading-tight">Bank</span>
                          </div>
                        </div>

                        <AnimatePresence mode="wait">
                          {(sellForm.paymentMethod === 'usdt' || sellForm.paymentMethod === 'btc') && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-1.5 overflow-hidden"
                            >
                              <label className="text-[10px] font-semibold tracking-widest uppercase text-[#C5B358]">
                                {sellForm.paymentMethod === 'usdt' ? 'USDT TRC20 Address' : 'Bitcoin Address'}
                              </label>
                              <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5B358]/50" />
                                <input 
                                  type="text" 
                                  placeholder={`Enter ${sellForm.paymentMethod === 'usdt' ? 'USDT TRC20' : 'Bitcoin'} address`}
                                  className="w-full gold-input p-2.5 pl-9 text-sm rounded-sm"
                                  value={sellForm.walletAddress}
                                  onChange={(e) => setSellForm({...sellForm, walletAddress: e.target.value})}
                                  disabled={isSubmitting}
                                />
                              </div>
                            </motion.div>
                          )}

                          {sellForm.paymentMethod === 'bank' && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-3 overflow-hidden"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold tracking-widest uppercase text-[#D4AF37]">Region: {selectedRegion}</span>
                                <button type="button" onClick={() => setShowRegionModal(true)} className="text-[10px] text-[#C5B358] hover:text-[#F3E5AB] underline">Change</button>
                              </div>
                              
                              {isBankDetailsComplete ? (
                                <div 
                                  onClick={() => setShowBankDetailsModal(true)}
                                  className="p-3 border border-[#D4AF37]/50 bg-[#D4AF37]/5 rounded-sm cursor-pointer hover:bg-[#D4AF37]/10 transition-colors group relative overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                  <div className="flex justify-between items-start mb-2 relative z-10">
                                    <span className="text-xs font-bold text-[#F3E5AB] flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Bank Details Saved</span>
                                    <span className="text-[10px] text-[#D4AF37] underline">Change Details</span>
                                  </div>
                                  <div className="text-[10px] text-[#C5B358] space-y-1 relative z-10">
                                    <p><span className="opacity-70 inline-block w-12">Name:</span> <span className="text-[#F3E5AB]">{sellForm.bankDetails.fullName}</span></p>
                                    <p><span className="opacity-70 inline-block w-12">Bank:</span> <span className="text-[#F3E5AB]">{sellForm.bankDetails.bankName}</span></p>
                                    <p><span className="opacity-70 inline-block w-12">Acct:</span> <span className="text-[#F3E5AB]">****{sellForm.bankDetails.accountNumber.slice(-4)}</span></p>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setShowBankDetailsModal(true)}
                                  className="w-full py-3 border border-dashed border-[#D4AF37]/50 text-[#D4AF37] rounded-sm hover:bg-[#D4AF37]/10 transition-colors text-xs font-medium flex items-center justify-center gap-2"
                                >
                                  <Building2 className="w-4 h-4" />
                                  Enter Bank Details
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="gold-button w-full py-3 rounded-sm mt-2 flex items-center justify-center gap-2 text-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Submit Trade'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Modal Body - BUY */}
              {activeModal === 'buy' && (
                <div className="p-4 overflow-y-auto custom-scrollbar bg-[#050505]">
                  <div className="grid grid-cols-1 gap-4">
                    {AVAILABLE_CARDS.map((card) => (
                      <div key={card.id} className="border border-[#D4AF37]/20 rounded-lg overflow-hidden group bg-[#0a0800] flex">
                        <div className="w-24 shrink-0 overflow-hidden relative">
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                          <img src={card.image} alt={card.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-1 right-1 z-20 bg-[#D4AF37] text-black text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                            {card.discount}
                          </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-cinzel font-bold text-sm text-[#F3E5AB] mb-0.5">{card.type}</h4>
                            <span className="text-[10px] text-[#C5B358]">Value: ${card.value}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-lg font-bold text-[#D4AF37]">${card.price}</span>
                            <button className="gold-button-outline px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-widest flex items-center justify-center gap-1">
                              Buy <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REGION MODAL --- */}
      <AnimatePresence>
        {showRegionModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+20px)]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowRegionModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: -10 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="gold-glass-card w-[90%] max-w-[360px] rounded-[16px] relative z-10 overflow-hidden max-h-[75vh] flex flex-col mb-5"
            >
              <div className="p-4 border-b border-[#D4AF37]/20 flex justify-between items-center bg-[#0a0800] shrink-0">
                <h3 className="text-lg font-cinzel font-bold text-[#D4AF37]">
                  Choose Your Region
                </h3>
                <button 
                  onClick={() => setShowRegionModal(false)}
                  className="text-[#C5B358] hover:text-[#F3E5AB] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto custom-scrollbar bg-[#050505]">
                {selectedRegion && regionError ? (
                  <div className="text-center py-6">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-[#F3E5AB] mb-2">{selectedRegion}</h4>
                    <p className="text-red-400 text-sm">{regionError}</p>
                    <button 
                      onClick={() => {
                        setSelectedRegion('');
                        setRegionError('');
                      }}
                      className="mt-4 gold-button-outline px-5 py-2 rounded-sm text-xs"
                    >
                      Back to Regions
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {REGIONS.map(region => {
                      const isNigeria = region === 'Nigeria';
                      return (
                        <button
                          key={region}
                          onClick={() => handleRegionSelect(region)}
                          className={`p-2.5 border rounded-sm text-xs transition-all text-left flex items-center justify-between group ${
                            isNigeria 
                              ? 'bg-[#D4AF37] text-black border-[#D4AF37] hover:bg-[#C5A028] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                              : 'border-[#D4AF37]/30 text-[#C5B358] hover:bg-[#D4AF37]/10 hover:text-[#F3E5AB] hover:border-[#D4AF37]/60'
                          }`}
                        >
                          {region}
                          <ChevronRight className={`w-3 h-3 transition-opacity ${isNigeria ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- BANK DETAILS MODAL --- */}
      <AnimatePresence>
        {showBankDetailsModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+20px)]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowBankDetailsModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: -10 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="gold-glass-card w-[90%] max-w-[360px] rounded-[16px] relative z-10 overflow-hidden max-h-[75vh] flex flex-col mb-5 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.15)]"
            >
              <div className="p-4 border-b border-[#D4AF37]/20 flex justify-between items-center bg-[#0a0800] shrink-0">
                <h3 className="text-lg font-cinzel font-bold text-[#D4AF37] flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Nigeria Bank Details
                </h3>
                <button 
                  onClick={() => setShowBankDetailsModal(false)}
                  className="text-[#C5B358] hover:text-[#F3E5AB] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBankDetails} className="p-5 overflow-y-auto custom-scrollbar bg-[#050505] space-y-4">
                {bankModalError && (
                  <div className="p-3 border border-red-500/30 bg-red-500/10 rounded flex items-start gap-2 text-red-200 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{bankModalError}</p>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-[#C5B358]">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Account holder name"
                    className="w-full gold-input p-3 text-sm rounded-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50"
                    value={sellForm.bankDetails.fullName}
                    onChange={(e) => setSellForm({...sellForm, bankDetails: {...sellForm.bankDetails, fullName: e.target.value}})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-[#C5B358]">Bank Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter bank name"
                    className="w-full gold-input p-3 text-sm rounded-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50"
                    value={sellForm.bankDetails.bankName}
                    onChange={(e) => setSellForm({...sellForm, bankDetails: {...sellForm.bankDetails, bankName: e.target.value}})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-[#C5B358]">Account Number</label>
                  <input 
                    type="text" 
                    placeholder="Enter account number"
                    className="w-full gold-input p-3 text-sm rounded-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50"
                    value={sellForm.bankDetails.accountNumber}
                    onChange={(e) => setSellForm({...sellForm, bankDetails: {...sellForm.bankDetails, accountNumber: e.target.value}})}
                  />
                </div>

                <button 
                  type="submit"
                  className="gold-button w-full py-3 rounded-sm mt-2 text-sm font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  Save Details
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- BUY GUIDE MODAL --- */}
      <AnimatePresence>
        {activeModal === 'buyGuide' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+20px)]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setActiveModal(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: -10 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="gold-glass-card w-[90%] max-w-[360px] rounded-[16px] relative z-10 overflow-hidden max-h-[75vh] flex flex-col mb-5"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#D4AF37]/20 flex justify-between items-center bg-[#0a0800] shrink-0">
                <h3 className="text-lg font-cinzel font-bold text-[#D4AF37] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  How to Buy
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="text-[#C5B358] hover:text-[#F3E5AB] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 overflow-y-auto custom-scrollbar bg-[#050505] space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">1</div>
                    <div>
                      <h4 className="text-[#F3E5AB] font-semibold mb-1">Select Gift Card</h4>
                      <p className="text-xs text-[#C5B358] leading-relaxed">Browse our inventory and select the gift card you wish to purchase (e.g., Amazon, iTunes, Steam).</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">2</div>
                    <div>
                      <h4 className="text-[#F3E5AB] font-semibold mb-1">Choose Value</h4>
                      <p className="text-xs text-[#C5B358] leading-relaxed">Select the denomination you want to buy. Our premium discounted rates will be automatically applied.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">3</div>
                    <div>
                      <h4 className="text-[#F3E5AB] font-semibold mb-1">Make Payment</h4>
                      <p className="text-xs text-[#C5B358] leading-relaxed">Complete your purchase using your preferred payment method (Crypto or Bank Transfer).</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">4</div>
                    <div>
                      <h4 className="text-[#F3E5AB] font-semibold mb-1">Instant Delivery</h4>
                      <p className="text-xs text-[#C5B358] leading-relaxed">Once payment is confirmed, your gift card code will be instantly delivered to your vault and email.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg">
                  <p className="text-[10px] text-[#C5B358] text-center italic">
                    Note: This is an instructional guide. To make an actual purchase, click the "Buy Gift Cards" button on the main page.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SELL GUIDE MODAL --- */}
      <AnimatePresence>
        {activeModal === 'sellGuide' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+20px)]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setActiveModal(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: -10 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="gold-glass-card w-[90%] max-w-[360px] rounded-[16px] relative z-10 overflow-hidden max-h-[75vh] flex flex-col mb-5"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#D4AF37]/20 flex justify-between items-center bg-[#0a0800] shrink-0">
                <h3 className="text-lg font-cinzel font-bold text-[#D4AF37] flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  How to Sell
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="text-[#C5B358] hover:text-[#F3E5AB] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 overflow-y-auto custom-scrollbar bg-[#050505] space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">1</div>
                    <div>
                      <h4 className="text-[#F3E5AB] font-semibold mb-1">Enter Card Details</h4>
                      <p className="text-xs text-[#C5B358] leading-relaxed">Select the type of gift card you have, enter its value, and provide the exact claim code.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">2</div>
                    <div>
                      <h4 className="text-[#F3E5AB] font-semibold mb-1">Upload Receipt (Optional)</h4>
                      <p className="text-xs text-[#C5B358] leading-relaxed">For faster processing, upload a clear image of the physical card or purchase receipt.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">3</div>
                    <div>
                      <h4 className="text-[#F3E5AB] font-semibold mb-1">Select Payout Method</h4>
                      <p className="text-xs text-[#C5B358] leading-relaxed">Choose how you want to be paid: Crypto (USDT/BTC) or direct Bank Transfer (supported regions only).</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">4</div>
                    <div>
                      <h4 className="text-[#F3E5AB] font-semibold mb-1">Verification & Payout</h4>
                      <p className="text-xs text-[#C5B358] leading-relaxed">Our team will verify your card. Once approved, funds are sent instantly to your chosen payout method.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg">
                  <p className="text-[10px] text-[#C5B358] text-center italic">
                    Note: This is an instructional guide. To initiate an actual trade, click the "Sell Gift Cards" button on the main page.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

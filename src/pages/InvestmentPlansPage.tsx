import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Clock, DollarSign, ArrowRight, ArrowLeft, BookOpen, X, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TradingRobotImage from '../components/TradingRobotImage';
import CommitmentNote from '../components/CommitmentNote';

// --- Currency Toggle Component ---
function CurrencyToggle({ isNaira, onToggle }: { isNaira: boolean, onToggle: () => void }) {
  return (
    <div 
      role="switch"
      aria-pressed={isNaira}
      onClick={onToggle}
      className="relative flex items-center w-[110px] h-10 rounded-full bg-gray-200 dark:bg-gray-800 p-1 cursor-pointer active:scale-95 transition-all"
    >
      {/* Sliding Indicator (Ticker) */}
      <div 
        className={`absolute top-1 left-1 w-[54px] h-8 rounded-full bg-black dark:bg-white shadow-md shadow-green-400/30 transition-all duration-300 ease-in-out transform ${
          isNaira ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      
      {/* Labels */}
      <div className="relative z-10 flex w-full justify-between items-center px-4">
        <span className={`text-sm font-bold transition-colors duration-300 ${!isNaira ? 'text-white dark:text-black' : 'text-gray-500 dark:text-gray-400'}`}>
          $
        </span>
        <span className={`text-sm font-bold transition-colors duration-300 ${isNaira ? 'text-white dark:text-black' : 'text-gray-500 dark:text-gray-400'}`}>
          ₦
        </span>
      </div>
    </div>
  );
}

// --- Card Face Component ---
function CardFace({ plan, isNaira, amount, setAmount, onInvest, isMobileExpanded, onSwitch }: any) {
  const dailyRoi = (amount * (plan.roi / 100));
  
  let minWithdrawal = isNaira ? '₦3,000' : '$15';
  if (plan.id === 'plan_2') {
    minWithdrawal = isNaira ? '₦1,500,000' : '$8,200';
  } else if (plan.id === 'plan_3') {
    minWithdrawal = isNaira ? '₦17,500,000' : '$174,000';
  }

  const min = isNaira ? plan.nairaMin : plan.minInvestment;
  const max = isNaira ? plan.nairaMax : plan.maxInvestment;
  const symbol = isNaira ? '₦' : '$';

  const progress = ((amount - min) / (max - min)) * 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    let num = Number(val);
    if (num > max) num = max;
    setAmount(num);
  };

  let step = 100;
  if (isNaira) {
    step = min >= 100000000 ? 1000000 : min >= 10000000 ? 100000 : 10000;
  } else {
    step = min >= 1000000 ? 10000 : min >= 50000 ? 1000 : 100;
  }

  return (
    <div className="w-full h-full flex flex-col bg-bg-card/80 backdrop-blur-xl border border-border-light rounded-2xl p-4 sm:p-5 shadow-2xl overflow-hidden relative group">
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/0 to-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className={`absolute -inset-[1px] bg-gradient-to-b ${plan.accent} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500 pointer-events-none blur-[2px]`}></div>

      {/* Robot Image */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className="absolute top-4 right-4 z-20"
      >
        <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-xl scale-150 animate-pulse"></div>
        <TradingRobotImage 
          className="w-12 h-12 sm:w-14 sm:h-14 relative z-10" 
          src={plan.videoUrl || (isNaira ? "https://i.imgur.com/ro9I5Jf.mp4" : "https://i.imgur.com/KdQWEqF.mp4")}
        />
      </motion.div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex flex-col items-start gap-1 mb-2 sm:mb-4 pr-14 sm:pr-16">
          <h3 className="text-lg sm:text-xl font-bold text-text-primary">{plan.name}</h3>
          {plan.id === 'plan_2' && (
            <span className="px-2 py-0.5 bg-accent-primary text-bg-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
              Popular
            </span>
          )}
        </div>
        
        <div className="mb-2 sm:mb-5">
          <div className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${plan.accent} mb-0 sm:mb-1 drop-shadow-sm`}>
            {plan.roi}%
          </div>
          <div className="text-[10px] sm:text-xs text-text-secondary font-medium uppercase tracking-widest">Daily ROI</div>
        </div>
        
        <div className="space-y-2 sm:space-y-4 mb-2 sm:mb-5 flex-1">
          {/* Manual Input Section */}
          <div className="border-b border-white/5 pb-2 sm:pb-3">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-text-secondary font-semibold text-sm">{symbol}</span>
              <input
                type="text"
                value={amount === 0 ? '0' : amount}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full pl-7 pr-20 sm:pr-24 py-2 sm:py-2.5 bg-bg-secondary border border-border-light focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 rounded-xl text-sm text-text-primary font-semibold focus:outline-none transition-all"
              />
              <span className="absolute right-3 text-[10px] text-text-secondary font-medium pointer-events-none">
                min. {symbol}{min.toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* Slider Section */}
          <div className="pt-1 sm:pt-2 pb-2 sm:pb-3">
            <div className="flex justify-between items-end mb-2 sm:mb-4">
              <span className="text-xs text-text-secondary font-medium">Amount</span>
              <span className="text-base sm:text-lg font-bold text-text-primary">{symbol}{amount.toLocaleString()}</span>
            </div>
            
            <div className="relative h-3 sm:h-4 w-full bg-white/10 rounded-full mb-3 sm:mb-5">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${plan.accent}`}
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              >
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-[0_0_15px_${plan.glow}] border-2 border-transparent`}></div>
              </div>
              <input 
                type="range" 
                min={min} 
                max={max} 
                step={step}
                value={amount} 
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            <div className="flex justify-between text-[10px] sm:text-xs text-text-secondary">
              <span>{symbol}{min.toLocaleString()}</span>
              <span>{symbol}{max.toLocaleString()}</span>
            </div>
          </div>

          {/* Projections */}
          <div className="bg-black/30 rounded-xl p-2 sm:p-3 space-y-1 sm:space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-xs text-text-secondary">Daily Profit</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-500">+{symbol}{dailyRoi.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-xs text-text-secondary">Min. Withdrawal</span>
              <span className="text-xs sm:text-sm font-bold text-text-primary">{minWithdrawal}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onInvest(plan, amount, isNaira)}
          disabled={amount < min}
          className={`w-full py-2 sm:py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group/btn mt-2 transition-all duration-300 ease-out ${
            amount < min 
              ? 'bg-bg-secondary text-text-secondary cursor-not-allowed' 
              : 'bg-accent-primary hover:bg-accent-hover text-bg-primary'
          }`}
        >
          Invest Now
          <ArrowRight className={`w-4 h-4 transition-transform ${amount >= min ? 'group-hover/btn:translate-x-1' : ''}`} />
        </button>
      </div>
    </div>
  );
}

// --- Plan Card Component ---
function PlanCard({ plan, index, onInvest, isExpanded, onToggle }: { 
  plan: any, 
  index: number, 
  onInvest: (plan: any, amount: number, isNaira: boolean) => void,
  isExpanded: boolean,
  onToggle: () => void
}) {
  const [isNaira, setIsNaira] = useState(false);
  const [usdAmount, setUsdAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState(0);

  // Reset amounts when card is collapsed on mobile
  useEffect(() => {
    if (!isExpanded) {
      setUsdAmount(0);
      setNairaAmount(0);
    }
  }, [isExpanded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.7, ease: "easeOut" }}
      whileHover={{ y: isExpanded ? 0 : -10 }}
      className={`relative flex flex-col md:pt-6 snap-start transition-all duration-500 max-w-sm md:max-w-none mx-auto w-full ${
        isExpanded ? 'h-auto sm:h-full' : 'h-auto sm:h-full'
      }`}
      style={{ perspective: '2000px' }}
    >
      {/* Mobile Collapsed View */}
      <div className="md:hidden">
        {!isExpanded && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onToggle}
            className="flex justify-between items-center py-6 px-4 bg-bg-card/80 backdrop-blur-xl border border-border-light rounded-2xl shadow-xl cursor-pointer active:scale-[0.98] transition-transform"
          >
             <div className="flex items-center gap-3">
               {plan.mobileImage && (
                 <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 shadow-sm shrink-0">
                   <img src={plan.mobileImage} alt={plan.name} className="w-full h-full object-cover" />
                 </div>
               )}
               <span className="text-lg font-bold text-text-primary">{plan.name}</span>
             </div>
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 onToggle();
               }}
               className="bg-accent-primary hover:bg-accent-hover text-bg-primary font-bold px-5 py-2 rounded-xl text-sm whitespace-nowrap"
             >
               Invest Now
             </button>
          </motion.div>
        )}
      </div>

      {/* Full Card Content (Desktop or Expanded Mobile) */}
      <div className={`${!isExpanded ? 'hidden md:flex' : 'flex'} flex-col h-full relative pt-6 md:pt-0`}>
        {/* Premium Toggle Switch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
          <CurrencyToggle isNaira={isNaira} onToggle={() => setIsNaira(!isNaira)} />
        </div>

        <motion.div
          className="relative w-full h-full flex-1 flex flex-col"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isNaira ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Front (USD) */}
          <div 
            className="w-full h-full flex flex-col"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardFace 
              plan={plan} 
              isNaira={false} 
              amount={usdAmount} 
              setAmount={setUsdAmount} 
              onInvest={onInvest}
              isMobileExpanded={isExpanded}
              onSwitch={onToggle}
            />
          </div>

          {/* Back (Naira) */}
          <div 
            className="absolute inset-0 w-full h-full flex flex-col" 
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
          >
            <CardFace 
              plan={plan} 
              isNaira={true} 
              amount={nairaAmount} 
              setAmount={setNairaAmount} 
              onInvest={onInvest}
              isMobileExpanded={isExpanded}
              onSwitch={onToggle}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// --- Main Page Component ---
export default function InvestmentPlansPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [regionError, setRegionError] = useState<string | null>(null);

  const regions = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Singapore', 'Tanzania', 'Nigeria', 'Uganda', 'Cameroon', 
    'South Africa', 'Kenya', 'Ghana'
  ];

  const handleRegionSelect = (region: string) => {
    if (region === 'Nigeria') {
      navigate('/investment-guide');
    } else {
      setRegionError('This feature is not available in your region');
      setTimeout(() => setRegionError(null), 3000);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Fetch plans or use mock data
    const fetchPlans = async () => {
      try {
        // Even if API succeeds or fails, use our new static plans for the preview to ensure the UI matches the requirements
        // In a real app, the API would return these new values.
        setPlans([
          { id: 'plan_1', name: t('plans.regular', 'Regular'), roi: 2.5, duration: t('plans.duration_30', '30 Days'), minInvestment: 100, maxInvestment: 49999, nairaMin: 10000, nairaMax: 9000000, accent: 'from-accent-primary to-accent-secondary', glow: 'rgba(59, 130, 246, 0.6)', mobileImage: 'https://ngcbgroup.com/images/photos/3/42.png', videoUrl: 'https://cdn.dribbble.com/userupload/12700016/file/original-a077b23b3f9e3fd27f605e3d2849ed26.mp4' },
          { id: 'plan_2', name: t('plans.premium', 'Premium'), roi: 2.7, duration: t('plans.duration_90', '90 Days'), minInvestment: 50000, maxInvestment: 999999, nairaMin: 10000000, nairaMax: 90000000, accent: 'from-accent-primary to-accent-secondary', glow: 'rgba(59, 130, 246, 0.6)', mobileImage: 'https://www.amarkets.com/wp-content/uploads/2024/06/forex-robots-TSS.jpg', videoUrl: 'https://cdn.dribbble.com/userupload/17957549/file/original-2ac0cc43509417f81fd0248660d699e8.mp4' },
          { id: 'plan_3', name: t('plans.elite', 'Elite'), roi: 2.9, duration: t('plans.duration_180', '180 Days'), minInvestment: 1000000, maxInvestment: 10000000, nairaMin: 100000000, nairaMax: 10000000000, accent: 'from-accent-primary to-accent-secondary', glow: 'rgba(59, 130, 246, 0.6)', mobileImage: 'https://images.theengineeringprojects.com/image/main/2024/12/developing-forex-robot-software.jpg', videoUrl: 'https://cdn.dribbble.com/userupload/13584738/file/original-c7d93b4dd2d05fd4b987e44e9b0fea60.mp4' },
        ]);
      } catch (err) {
        // Fallback to mock data for preview/demo
        setPlans([
          { id: 'plan_1', name: t('plans.regular', 'Regular'), roi: 2.5, duration: t('plans.duration_30', '30 Days'), minInvestment: 100, maxInvestment: 49999, nairaMin: 10000, nairaMax: 9000000, accent: 'from-accent-primary to-accent-secondary', glow: 'rgba(59, 130, 246, 0.6)', mobileImage: 'https://ngcbgroup.com/images/photos/3/42.png', videoUrl: 'https://cdn.dribbble.com/userupload/12700016/file/original-a077b23b3f9e3fd27f605e3d2849ed26.mp4' },
          { id: 'plan_2', name: t('plans.premium', 'Premium'), roi: 2.7, duration: t('plans.duration_90', '90 Days'), minInvestment: 50000, maxInvestment: 999999, nairaMin: 10000000, nairaMax: 90000000, accent: 'from-accent-primary to-accent-secondary', glow: 'rgba(59, 130, 246, 0.6)', mobileImage: 'https://www.amarkets.com/wp-content/uploads/2024/06/forex-robots-TSS.jpg', videoUrl: 'https://cdn.dribbble.com/userupload/17957549/file/original-2ac0cc43509417f81fd0248660d699e8.mp4' },
          { id: 'plan_3', name: t('plans.elite', 'Elite'), roi: 2.9, duration: t('plans.duration_180', '180 Days'), minInvestment: 1000000, maxInvestment: 10000000, nairaMin: 100000000, nairaMax: 10000000000, accent: 'from-accent-primary to-accent-secondary', glow: 'rgba(59, 130, 246, 0.6)', mobileImage: 'https://images.theengineeringprojects.com/image/main/2024/12/developing-forex-robot-software.jpg', videoUrl: 'https://cdn.dribbble.com/userupload/13584738/file/original-c7d93b4dd2d05fd4b987e44e9b0fea60.mp4' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [t]);

  const handleInvest = (plan: any, amount: number, isNaira: boolean) => {
    navigate('/investment/review', {
      state: { plan, amount, isNaira }
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-bg-primary min-h-screen relative overflow-hidden">
      
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base Radial Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary/10 via-bg-primary to-bg-primary opacity-70"></div>
        
        {/* Purple Hint Glow */}
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-[#B48EFC]/5 blur-[120px] rounded-full mix-blend-screen"></div>
        
        {/* Lemon Yellow Hint Glow */}
        <div className="absolute top-[30%] left-[10%] w-[500px] h-[500px] bg-[#F7F57C]/5 blur-[100px] rounded-full mix-blend-screen"></div>
        
        {/* Gold Hint Glow */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-primary/5 blur-[150px] rounded-full mix-blend-screen"></div>

        {/* Diagonal Streaks */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #1C1C1C 0px, #1C1C1C 1px, transparent 1px, transparent 40px)' }}></div>
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 80px)' }}></div>
        
        {/* Coffee Stripe Pattern */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #4A3B2C 0px, #4A3B2C 1px, transparent 1px, transparent 20px)' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-24 flex flex-col flex-1 w-full">
        
        {loading ? (
          <div className="flex justify-center items-center h-64 flex-1">
            <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 relative snap-y snap-mandatory mb-8 place-items-center">
              {/* Decorative background glow for cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-accent-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

              {plans.map((plan, index) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  index={index} 
                  onInvest={handleInvest} 
                  isExpanded={expandedId === plan.id}
                  onToggle={() => setExpandedId(expandedId === plan.id ? null : plan.id)}
                />
              ))}
            </div>

            {/* Investment Guide Section */}
            <div className="flex flex-col items-center mb-8 w-full gap-6">
              <div className="text-center px-4 max-w-sm mx-auto">
                <p className="text-sm text-text-secondary leading-relaxed">
                  <span className="text-accent-primary font-bold">AI- and robotics-powered investment.</span><br/>
                  Select from our strategically designed investment plans tailored to match your financial goals.
                </p>
              </div>

              <button 
                onClick={() => setShowRegionModal(true)}
                className="flex items-center justify-center gap-2 w-full max-w-sm py-4 rounded-xl border border-accent-primary text-accent-primary hover:bg-accent-primary/10 font-bold shadow-lg active:scale-[0.98] transition-all"
              >
                <BookOpen className="w-5 h-5" />
                Investment Guide
              </button>
            </div>
          </div>
        )}

        {/* Commitment Note */}
        {!loading && (
          <div className="mt-auto pt-8">
            <CommitmentNote />
          </div>
        )}
      </div>

      {/* Region Selection Modal */}
      <AnimatePresence>
        {showRegionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+20px)]">
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
              className="bg-bg-card/80 backdrop-blur-xl border border-border-light w-[90%] max-w-[360px] rounded-[16px] relative z-10 overflow-hidden max-h-[75vh] flex flex-col mb-5 shadow-2xl"
            >
              <div className="p-4 border-b border-border-light flex justify-between items-center bg-bg-secondary shrink-0">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent-primary" />
                  Select Region
                </h3>
                <button 
                  onClick={() => setShowRegionModal(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto custom-scrollbar bg-black/20 space-y-2">
                {regionError && (
                  <div className="p-3 mb-2 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400 text-xs text-center font-medium">
                    {regionError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-2">
                  {regions.map((region) => {
                    const isNigeria = region === 'Nigeria';
                    return (
                      <button
                        key={region}
                        onClick={() => handleRegionSelect(region)}
                        className={`p-3 border rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between group ${
                          isNigeria 
                            ? 'bg-accent-primary hover:bg-accent-hover text-bg-primary border-transparent' 
                            : 'bg-bg-secondary border-border-light text-text-secondary hover:bg-bg-secondary/80 hover:text-text-primary'
                        }`}
                      >
                        {region}
                        <ArrowRight className={`w-4 h-4 transition-transform ${isNigeria ? 'opacity-100 translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Clock, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import CommitmentNote from '../components/CommitmentNote';

export default function InvestmentReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const user = userData || { fullName: 'User' };
  const [agreed, setAgreed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract state passed from InvestmentPlansPage
  const { plan, amount, isNaira } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Redirect back if no plan data is found
    if (!plan || !amount) {
      navigate('/invest');
    }
    setIsLoaded(true);
  }, [plan, amount, navigate]);

  if (!plan || !amount) return null;

  const symbol = isNaira ? '₦' : '$';
  const dailyRoi = amount * (plan.roi / 100);

  const handleConfirm = () => {
    if (agreed) {
      navigate('/investment/funding', {
        state: { plan, amount, isNaira }
      });
    }
  };

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
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-[2px] bg-emerald-500 -z-10"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 bg-bg-secondary px-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-text-secondary hidden sm:block">Select Plan</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 bg-bg-secondary px-2">
              <div className="w-8 h-8 rounded-full bg-accent-primary text-bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.3)] ring-4 ring-accent-primary/20">
                <span className="font-bold text-sm">2</span>
              </div>
              <span className="text-xs font-bold text-text-primary hidden sm:block">Review</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 bg-bg-secondary px-2">
              <div className="w-8 h-8 rounded-full bg-bg-hover text-text-muted border border-border-light flex items-center justify-center">
                <span className="font-semibold text-sm">3</span>
              </div>
              <span className="text-xs font-medium text-text-muted hidden sm:block">Fund</span>
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
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-20 lg:pb-10">
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-bg-hover text-text-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Review Investment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-6">
            
            {/* Plan Overview Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-bg-card/80 backdrop-blur-xl border border-border-light rounded-[16px] sm:rounded-[20px] p-4 sm:p-8 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border-light">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-text-primary mb-1.5 sm:mb-2">{plan.name} Plan</h2>
                  <div className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-accent-secondary text-text-primary text-[10px] sm:text-xs font-semibold tracking-wide uppercase">
                    {isNaira ? 'Naira Investment' : 'USD Investment'}
                  </div>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${plan.accent} flex items-center justify-center text-slate-900 shadow-sm`}>
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-8">
                <div>
                  <p className="text-xs sm:text-sm text-text-secondary mb-0.5 sm:mb-1">Investment Amount</p>
                  <p className="text-base sm:text-xl font-bold text-text-primary">{symbol}{amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-text-secondary mb-0.5 sm:mb-1">Daily ROI</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base sm:text-xl font-bold text-emerald-500">{plan.roi}%</p>
                    <span className="md:hidden text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      +{symbol}{dailyRoi.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Projected Returns Card (Hidden on Mobile) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:block bg-bg-card/80 backdrop-blur-xl border border-border-light rounded-[16px] sm:rounded-[20px] p-4 sm:p-8 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm sm:text-lg font-bold text-text-primary mb-4 sm:mb-6">Projected Daily Returns</h3>
              
              <div className="space-y-4 sm:space-y-5">
                <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-border-light/50">
                  <span className="text-sm sm:text-base text-text-secondary">Daily Profit</span>
                  <span className="text-sm sm:text-base font-semibold text-emerald-500">+{symbol}{dailyRoi.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>
            </motion.div>

            {/* Agreement Section (Desktop) */}
            <div className="hidden lg:block pt-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    className="peer sr-only"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <div className="w-5 h-5 rounded border-2 border-text-muted peer-checked:bg-accent-primary peer-checked:border-accent-primary transition-colors flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                  </div>
                </div>
                <span className="text-sm text-text-secondary select-none">
                  I understand and agree to the <Link to="/terms/investment" className="text-text-primary font-medium hover:underline hover:text-accent-primary transition-colors">investment terms</Link>.
                </span>
              </label>
            </div>

          </div>

          {/* RIGHT COLUMN (Sticky Summary) */}
          <div className="lg:col-span-4">
            <div className="sticky top-[120px]">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-bg-card/80 backdrop-blur-xl border border-border-light rounded-[16px] sm:rounded-[20px] p-4 sm:p-6 shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <h3 className="text-base sm:text-lg font-bold text-text-primary mb-4 sm:mb-6">Investment Summary</h3>
                
                <div className="space-y-2.5 sm:space-y-3.5 mb-6 sm:mb-8">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-text-secondary">Investment Plan</span>
                    <span className="font-semibold text-text-primary">{plan.name}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-text-secondary">Investment Amount</span>
                    <span className="font-semibold text-text-primary">{symbol}{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-text-secondary">Selected Currency</span>
                    <span className="font-semibold text-text-primary">{isNaira ? '₦' : '$'}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-text-secondary">Daily ROI</span>
                    <span className="font-semibold text-text-primary">{plan.roi}%</span>
                  </div>
                </div>

                {/* Mobile Agreement & Confirm Section (Merged into Summary) */}
                <div className="lg:hidden space-y-4 mt-6 pt-6 border-t border-border-light">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                      />
                      <div className="w-4 h-4 rounded border-2 border-text-muted peer-checked:bg-accent-primary peer-checked:border-accent-primary transition-colors flex items-center justify-center">
                        <Check className="w-3 h-3 text-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                      </div>
                    </div>
                    <span className="text-xs text-text-secondary select-none leading-tight">
                      I understand and agree to the <Link to="/terms/investment" className="text-text-primary font-medium hover:underline">investment terms</Link>.
                    </span>
                  </label>

                  <button
                    onClick={handleConfirm}
                    disabled={!agreed}
                    className="w-full h-12 rounded-xl text-sm font-bold text-bg-primary bg-accent-primary hover:bg-accent-hover disabled:bg-bg-hover disabled:text-text-muted disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    Confirm Investment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="hidden lg:block space-y-4">
                  <button
                    onClick={handleConfirm}
                    disabled={!agreed}
                    className="w-full h-14 rounded-xl font-bold text-bg-primary bg-accent-primary hover:bg-accent-hover disabled:bg-bg-hover disabled:text-text-muted disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    Confirm & Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <div className="text-center">
                    <button onClick={() => navigate(-1)} className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium">
                      Back to Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>

        {/* Commitment Note */}
        <CommitmentNote />
      </main>
    </div>
  );
}

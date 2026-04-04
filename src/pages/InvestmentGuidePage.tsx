import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, ShieldCheck, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InvestmentGuidePage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col pt-20 pb-12 px-4 sm:px-6">
      <div className="relative z-10 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-bg-card border border-border-light flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Investment Guide</h1>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          
          {/* Introduction */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card/80 backdrop-blur-xl border border-border-light rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold text-text-primary mb-3">Welcome to CGA Investments</h2>
            <p className="text-text-secondary leading-relaxed text-sm">
              Our investment plans are designed to provide consistent, automated returns using advanced trading algorithms. 
              Choose a plan that fits your financial goals and let our system work for you.
            </p>
          </motion.div>

          {/* Plans Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-text-primary px-2">Available Plans</h3>
            
            {/* Regular Plan */}
            <div className="bg-bg-card/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-blue-400">Regular Plan</h4>
                    <p className="text-xs text-text-secondary mt-1">Continuous with daily earnings</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg">
                    <span className="text-blue-400 font-bold">2.5% Daily ROI</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg-secondary/50 rounded-xl p-3 border border-border-light">
                    <span className="text-[10px] uppercase tracking-wider text-text-secondary block mb-1">Min Investment</span>
                    <span className="font-bold text-text-primary text-sm">$100 / ₦10,000</span>
                  </div>
                  <div className="bg-bg-secondary/50 rounded-xl p-3 border border-border-light">
                    <span className="text-[10px] uppercase tracking-wider text-text-secondary block mb-1">Max Investment</span>
                    <span className="font-bold text-text-primary text-sm">$49,999 / ₦9,000,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-bg-card/80 backdrop-blur-xl border border-accent-primary/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-accent-primary">Premium Plan</h4>
                    <p className="text-xs text-text-secondary mt-1">Continuous with daily earnings</p>
                  </div>
                  <div className="bg-accent-primary/10 border border-accent-primary/20 px-3 py-1 rounded-lg">
                    <span className="text-accent-primary font-bold">2.7% Daily ROI</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg-secondary/50 rounded-xl p-3 border border-border-light">
                    <span className="text-[10px] uppercase tracking-wider text-text-secondary block mb-1">Min Investment</span>
                    <span className="font-bold text-text-primary text-sm">$50,000 / ₦10,000,000</span>
                  </div>
                  <div className="bg-bg-secondary/50 rounded-xl p-3 border border-border-light">
                    <span className="text-[10px] uppercase tracking-wider text-text-secondary block mb-1">Max Investment</span>
                    <span className="font-bold text-text-primary text-sm">$999,999 / ₦90,000,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Elite Plan */}
            <div className="bg-bg-card/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-purple-400">Elite Plan</h4>
                    <p className="text-xs text-text-secondary mt-1">Continuous with daily earnings</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg">
                    <span className="text-purple-400 font-bold">2.9% Daily ROI</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg-secondary/50 rounded-xl p-3 border border-border-light">
                    <span className="text-[10px] uppercase tracking-wider text-text-secondary block mb-1">Min Investment</span>
                    <span className="font-bold text-text-primary text-sm">$1,000,000 / ₦100,000,000</span>
                  </div>
                  <div className="bg-bg-secondary/50 rounded-xl p-3 border border-border-light">
                    <span className="text-[10px] uppercase tracking-wider text-text-secondary block mb-1">Max Investment</span>
                    <span className="font-bold text-text-primary text-sm">$10M / ₦10B</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-bg-card/80 backdrop-blur-xl border border-border-light rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-text-primary mb-6">How It Works</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary font-bold shrink-0">1</div>
                <div>
                  <h4 className="text-text-primary font-semibold mb-1">Select a Plan & Amount</h4>
                  <p className="text-sm text-text-secondary">Choose the plan that fits your budget and set your desired investment amount using the slider or input field.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary font-bold shrink-0">2</div>
                <div>
                  <h4 className="text-text-primary font-semibold mb-1">Review Details</h4>
                  <p className="text-sm text-text-secondary">Review your projected daily returns, total ROI, and the minimum withdrawal amount for your selected plan.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary font-bold shrink-0">3</div>
                <div>
                  <h4 className="text-text-primary font-semibold mb-1">Fund Your Investment</h4>
                  <p className="text-sm text-text-secondary">Proceed to the funding page to complete your deposit via Crypto or Bank Transfer (where supported).</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary font-bold shrink-0">4</div>
                <div>
                  <h4 className="text-text-primary font-semibold mb-1">Earn Daily Returns</h4>
                  <p className="text-sm text-text-secondary">Once your deposit is verified, your investment becomes active and you start earning your daily ROI automatically.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Note */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-accent-primary/5 border border-accent-primary/20 rounded-2xl p-5 flex items-start gap-4"
          >
            <ShieldCheck className="w-6 h-6 text-accent-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-accent-primary font-semibold mb-1">Secure & Transparent</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your funds are managed by our advanced trading algorithms with strict risk management protocols. 
                Withdrawals are processed promptly once the minimum threshold is met.
              </p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4 pb-8"
          >
            <button
              onClick={() => navigate('/invest')}
              className="bg-accent-primary hover:bg-accent-hover text-bg-primary w-full py-4 rounded-xl text-sm flex items-center justify-center gap-2 font-bold transition-colors"
            >
              Start your investment journey now
              <Zap className="w-5 h-5" />
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { 
  User, 
  Wallet, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PieChart, 
  DollarSign,
  ChevronRight,
  Activity,
  CheckCircle2,
  Clock,
  Settings,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface DashboardData {
  metrics: {
    totalEquity: number;
    roiEarnings: number;
    referralBonus: number;
    withdrawableBalance: number;
    totalReferrals: number;
    activeReferrals: number;
  };
  activeInvestments: {
    id: string;
    planName: string;
    dailyRoi: number;
    amount: number;
    currency: string;
  }[];
}

export default function DashboardPage() {
  const { user, userData } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !userData) return;

    const q = query(
      collection(db, 'investments'), 
      where('userId', '==', user.uid), 
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const investments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

        const dashboardData: DashboardData = {
          metrics: {
            totalEquity: userData.balance || 0,
            roiEarnings: userData.roiEarnings || 0,
            referralBonus: userData.referralBonus || 0,
            withdrawableBalance: userData.withdrawableProfits || 0,
            totalReferrals: userData.referralCount || 0,
            activeReferrals: userData.activeReferralsCount || 0,
          },
          activeInvestments: investments.map(inv => ({
            id: inv.id,
            planName: inv.planName,
            dailyRoi: inv.roi,
            amount: inv.amount,
            currency: inv.currency || 'USD'
          }))
        };
        setData(dashboardData);
        setLoading(false);
      } catch (err: any) {
        console.error('Error processing dashboard data:', err);
        setError('Failed to process dashboard data.');
        setLoading(false);
      }
    }, (err) => {
      console.error('Error fetching dashboard snapshot:', err);
      setError('Failed to load real-time dashboard data.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userData]);

  const formatCurrency = (amount: number | undefined | null, currency: string = 'USD') => {
    const symbol = currency === 'NGN' ? '₦' : '$';
    const value = amount ?? 0;
    return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-bg-secondary p-8 rounded-2xl border border-border-light text-center max-w-md">
          <p className="text-red-500 mb-4">{error || 'Something went wrong'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-accent-primary text-black font-bold rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { metrics = {}, activeInvestments = [] } = data || {};
  const {
    totalEquity = 0,
    roiEarnings = 0,
    referralBonus = 0,
    withdrawableBalance = 0,
    totalReferrals = 0,
    activeReferrals = 0
  } = metrics as any;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-4 md:p-8 pb-24 lg:pb-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary border border-accent-primary/20">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Investment Dashboard</h1>
              <p className="text-sm text-text-secondary">Welcome back, manage your portfolio performance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/profile"
              className="px-4 py-2 rounded-xl bg-bg-secondary border border-border-light text-text-primary hover:bg-accent-primary/10 hover:text-accent-primary transition-all flex items-center gap-2 text-sm font-bold"
            >
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </Link>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold uppercase tracking-wider">Account Active</span>
            </div>
          </div>
        </div>

        {/* Financial Overview - Recipe 8: Clean Utility / Minimal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Equity', value: totalEquity, icon: PieChart, color: 'purple' },
            { label: 'ROI Earnings', value: roiEarnings, icon: TrendingUp, color: 'emerald' },
            { label: 'Referral Bonus', value: referralBonus, icon: Users, color: 'blue' },
            { label: 'Withdrawable', value: withdrawableBalance, icon: DollarSign, color: 'amber' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-secondary p-5 rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-${item.color}-500/10 text-${item.color}-500 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">{item.label}</p>
              <h3 className="text-2xl font-bold">{formatCurrency(item.value)}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Active Investments & ROI Performance */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Active Investments Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent-primary" />
                  Active Investments
                </h2>
                <span className="text-xs font-medium px-2 py-1 bg-accent-primary/10 text-accent-primary rounded-lg">
                  {activeInvestments.length} Active
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeInvestments.length > 0 ? (
                  activeInvestments.map((inv) => (
                    <div key={inv.id} className="bg-bg-secondary rounded-2xl border border-border-light overflow-hidden group hover:border-accent-primary/30 transition-colors">
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm">{inv.planName}</h4>
                              <span className="text-[9px] uppercase tracking-wider text-emerald-500 font-bold">Status: Active</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-text-secondary uppercase tracking-tighter">Daily ROI</p>
                            <p className="font-bold text-sm text-accent-primary">{inv.dailyRoi}%</p>
                          </div>
                        </div>
                        
                        <div className="py-2.5 border-t border-border-light/50 flex justify-between items-center">
                          <div>
                            <p className="text-[9px] text-text-secondary uppercase mb-0.5">Amount Invested</p>
                            <p className="font-bold text-lg">{formatCurrency(inv.amount, inv.currency)}</p>
                          </div>
                          <button className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-accent-primary/10 hover:text-accent-primary transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-bg-secondary rounded-2xl border border-dashed border-border-light">
                    <p className="text-text-secondary mb-4">You don't have any active investments yet.</p>
                    <Link 
                      to="/invest" 
                      className="px-6 py-2 bg-accent-primary text-black font-bold rounded-xl hover:scale-105 transition-transform inline-block"
                    >
                      Start Investing
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* ROI Performance Section */}
            <section className="bg-bg-secondary rounded-2xl border border-border-light p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                ROI Performance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="relative p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="w-16 h-16" />
                  </div>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Daily ROI Earnings</p>
                  <h3 className="text-3xl font-bold text-emerald-500">{formatCurrency(roiEarnings / 30)}</h3>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500/70 uppercase">
                    <ArrowUpRight className="w-3 h-3" />
                    Updated Today
                  </div>
                </div>
                <div className="relative p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <PieChart className="w-16 h-16" />
                  </div>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Total ROI Earned</p>
                  <h3 className="text-3xl font-bold text-blue-500">{formatCurrency(roiEarnings)}</h3>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-500/70 uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    Lifetime Earnings
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Referral Summary & Recent Activity */}
          <div className="space-y-8">
            
            {/* Referral Summary Section */}
            <section className="bg-bg-secondary rounded-2xl border border-border-light p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Referral Summary
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Total Referrals</span>
                  </div>
                  <span className="text-xl font-bold">{totalReferrals}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Active Referrals</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-500">{activeReferrals}</span>
                </div>
                
                <div className="p-5 rounded-2xl bg-accent-primary text-black">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Referral Earnings</p>
                  <h3 className="text-3xl font-black">{formatCurrency(referralBonus)}</h3>
                  <p className="text-[10px] mt-2 font-medium opacity-80 italic">Earnings are triggered ONLY when your referred users make an investment.</p>
                </div>
              </div>
            </section>

            {/* Recent Activity Section */}
            <section className="bg-bg-secondary rounded-2xl border border-border-light overflow-hidden">
              <div className="p-6 border-b border-border-light flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Recent Activity
                </h2>
                <Link to="/transactions" className="text-xs font-bold text-accent-primary hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-border-light">
                {/* We can fetch real transactions here too, but for now let's keep it simple or fetch from profile */}
                <div className="p-8 text-center text-text-secondary text-sm">
                  Check transaction history for details.
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}

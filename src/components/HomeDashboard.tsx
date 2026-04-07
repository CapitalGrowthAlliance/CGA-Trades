import React, { useState, useEffect } from 'react';
import { Wallet, DollarSign, TrendingUp, Bot, CheckCircle2, Coins, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function HomeDashboard() {
  const { user: authUser, userData } = useAuth();
  const isAuthenticated = !!authUser;
  const user = userData || { balance: 0, totalInvestments: 0, totalEarnings: 0, fullName: 'User' };

  const [investments, setInvestments] = useState<any[]>([]);
  const [liveROI, setLiveROI] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [progress, setProgress] = useState(0);
  const [activePlans, setActivePlans] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !authUser) {
      // Mock data for unauthenticated users to show $0.00
      setInvestments([]);
      setLiveROI(0);
      setDailyTarget(0);
      setProgress(0);
      setTimeRemaining('00:00:00');
      setActivePlans([]);
      return;
    }

    const q = query(collection(db, 'investments'), where('userId', '==', authUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvestments(data);
    }, (error) => {
      console.error('Failed to fetch investments snapshot', error);
    });

    return () => unsubscribe();
  }, [isAuthenticated, authUser]);

  useEffect(() => {
    const active = investments.filter(inv => inv.status === 'active' && inv.activationTime);
    setActivePlans(active);
    
    if (active.length === 0) {
      setLiveROI(0);
      setDailyTarget(0);
      setProgress(0);
      setTimeRemaining('00:00:00');
      return;
    }

    // Memoize total daily target to avoid re-calculating every second
    const totalDailyTarget = active.reduce((sum, inv) => sum + (inv.amount * (inv.roi / 100)), 0);
    setDailyTarget(totalDailyTarget);

    const interval = setInterval(() => {
      const now = Date.now();
      let currentTotalROI = 0;
      let earliestActivation = now;

      active.forEach(inv => {
        const activationTime = new Date(inv.activationTime).getTime();
        if (activationTime < earliestActivation) {
          earliestActivation = activationTime;
        }

        const dailyProfit = inv.amount * (inv.roi / 100);
        const profitPerSecond = dailyProfit / 86400;
        
        const elapsedSeconds = Math.floor((now - activationTime) / 1000);
        
        // Calculate ROI for current 24h cycle
        const currentCycleSeconds = elapsedSeconds % 86400;
        currentTotalROI += profitPerSecond * currentCycleSeconds;
      });

      setLiveROI(currentTotalROI);
      setProgress(totalDailyTarget > 0 ? (currentTotalROI / totalDailyTarget) * 100 : 0);

      // Time remaining in the current 24h cycle based on earliest activation
      const elapsedSinceEarliest = Math.floor((now - earliestActivation) / 1000);
      const secondsRemaining = 86400 - (elapsedSinceEarliest % 86400);
      
      const h = Math.floor(secondsRemaining / 3600);
      const m = Math.floor((secondsRemaining % 3600) / 60);
      const s = secondsRemaining % 60;
      setTimeRemaining(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);

    }, 1000);

    return () => clearInterval(interval);
  }, [investments]);

  const totalAssets = (user?.balance || 0) + (user?.totalInvestments || 0) + (user?.totalEarnings || 0) + liveROI;

  return (
    <div className="w-full bg-[#0b0f19] border-b border-border-light pt-8 pb-8 md:pb-4 px-4 md:px-6 lg:px-12 relative">
      <div className="max-w-7xl mx-auto flex justify-center mt-4">
        <div className="grid grid-cols-2 md:flex md:flex-nowrap justify-center gap-3 md:gap-6 w-full max-w-5xl">
          
          {/* Total Assets */}
          <div className="bg-[#1a1d24] rounded-2xl border border-[#2a2d35] shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center w-full p-3 md:w-full md:max-w-[180px] md:min-w-[140px] md:p-4 md:aspect-auto text-center">
            <div className="flex flex-col items-center w-full">
              <div className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 flex items-center justify-center mb-1 md:mb-2 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                <Coins className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <p className="text-[10px] md:text-xs text-gray-300 font-bold mb-2 md:mb-3">Total Assets</p>
              <div className="w-full h-px bg-gray-700 mb-2 md:mb-3"></div>
              <h2 className="text-sm md:text-lg font-bold text-white mb-3">${totalAssets.toFixed(2)}</h2>
              
              <div className="w-full">
                <Link 
                  to="/invest" 
                  className="w-full py-2 px-2 rounded-lg text-[10px] md:text-xs font-bold text-white flex items-center justify-center relative overflow-hidden bg-slate-900 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:brightness-110 active:scale-95 group"
                >
                  {/* Static Gradient Background */}
                  <div className="absolute inset-0 bg-blue-600 opacity-80" />
                  
                  {/* Inner Button Surface */}
                  <div className="absolute inset-[1.5px] bg-gradient-to-b from-blue-500 to-blue-700 rounded-[7px] z-0" />
                  
                  <span className="relative z-10">Start Investing</span>
                  {/* Glossy Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20 pointer-events-none z-20"></div>
                </Link>
              </div>
            </div>
          </div>

          {/* Available Balance */}
          <div className="bg-[#1a1d24] rounded-2xl border border-[#2a2d35] shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center w-full aspect-square p-3 md:w-full md:max-w-[180px] md:min-w-[140px] md:p-4 md:aspect-auto text-center">
            <div className="flex flex-col items-center w-full">
              <div className="w-10 h-10 md:w-12 md:h-12 text-green-500 flex items-center justify-center mb-1 md:mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                <Wallet className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <p className="text-[10px] md:text-xs text-gray-300 font-bold mb-2 md:mb-3">Available Balance</p>
              <div className="w-full h-px bg-gray-700 mb-2 md:mb-3"></div>
              <h2 className="text-sm md:text-lg font-bold text-white">${(user?.balance || 0).toFixed(2)}</h2>
            </div>
          </div>

          {/* Funding */}
          <div className="bg-[#1a1d24] rounded-2xl border border-[#2a2d35] shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center w-full p-3 md:w-full md:max-w-[180px] md:min-w-[140px] md:p-4 md:aspect-auto text-center">
            <div className="flex flex-col items-center w-full">
              <div className="w-10 h-10 md:w-12 md:h-12 text-blue-400 flex items-center justify-center mb-1 md:mb-2 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                <Landmark className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <p className="text-[10px] md:text-xs text-gray-300 font-bold mb-2 md:mb-3">Funding</p>
              <div className="w-full h-px bg-gray-700 mb-2 md:mb-3"></div>
              <h2 className="text-sm md:text-lg font-bold text-white mb-3">${(user?.totalInvestments || 0).toFixed(2)}</h2>

              <div className="w-full">
                <Link 
                  to="/fund" 
                  className="w-full py-2 px-2 rounded-lg text-[10px] md:text-xs font-bold text-white flex items-center justify-center relative overflow-hidden bg-slate-900 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:brightness-110 active:scale-95 group"
                >
                  {/* Static Gradient Background */}
                  <div className="absolute inset-0 bg-green-600 opacity-80" />
                  
                  {/* Inner Button Surface */}
                  <div className="absolute inset-[1.5px] bg-gradient-to-b from-green-500 to-green-700 rounded-[7px] z-0" />
                  
                  <span className="relative z-10">Fund Now</span>
                  {/* Glossy Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20 pointer-events-none z-20"></div>
                </Link>
              </div>
            </div>
          </div>

          {/* Daily ROI AI Engine */}
          <div className="bg-[#1a1d24] text-white rounded-2xl border border-[#2a2d35] shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden group flex flex-col justify-between w-full aspect-square md:w-full md:max-w-[180px] md:min-w-[140px] md:aspect-auto p-0 text-center">
            {/* Top Image Section */}
            <div className="relative w-full h-16 md:h-24 bg-gradient-to-b from-blue-900/40 to-transparent flex items-end justify-center overflow-hidden pt-2 md:pt-4">
              {/* Candlesticks background (Static) */}
              <div className="absolute bottom-0 left-0 w-full h-12 md:h-16 flex items-end justify-between px-2 opacity-40">
                {[...Array(10)].map((_, i) => {
                  const isGreen = i % 2 === 0 || i % 3 === 0;
                  const color = isGreen ? 'bg-green-500' : 'bg-red-500';
                  const height = 20 + (i * 3) % 30; // Static height variation
                  return (
                    <div 
                      key={i}
                      className="relative flex flex-col items-center justify-center w-1.5 md:w-2"
                      style={{ height: `${height}px` }}
                    >
                      {/* Wick */}
                      <div className={`absolute w-[1px] h-full ${color}`} />
                      {/* Body */}
                      <div className={`relative w-full ${color} rounded-[1px]`} style={{ height: `${40 + (i % 3) * 20}%` }} />
                    </div>
                  );
                })}
              </div>
              
              <div className="relative z-10 w-12 h-12 md:w-20 md:h-20 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                <img 
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=transparent" 
                  alt="AI Robot" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Static eyes overlay */}
                <div className="absolute top-[58.6%] left-[39.4%] -translate-x-1/2 -translate-y-1/2 w-[12%] h-[18%] bg-accent-primary rounded-sm shadow-[0_0_12px_rgba(200,255,0,0.9)]" />
                <div className="absolute top-[58.6%] left-[60.6%] -translate-x-1/2 -translate-y-1/2 w-[12%] h-[18%] bg-accent-primary rounded-sm shadow-[0_0_12px_rgba(200,255,0,0.9)]" />
              </div>
            </div>
            
            <div className="flex flex-col px-2 md:px-4 pb-2 md:pb-4 pt-1 md:pt-2 w-full">
              <p className="text-[10px] md:text-xs text-gray-300 font-bold text-center mb-1 md:mb-2">Daily ROI</p>
              
              <div className="flex flex-wrap items-baseline justify-center gap-x-1 gap-y-0 mb-1 md:mb-2">
                <span className="text-[7px] md:text-[10px] text-gray-400">Earning:</span>
                <span className="text-[9px] md:text-xs font-bold text-green-400">${liveROI.toFixed(2)}</span>
                <span className="text-[7px] md:text-[10px] text-gray-500">/ ${dailyTarget.toFixed(2)}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 md:h-1.5 bg-gray-800 rounded-full overflow-hidden mb-1.5 md:mb-3 border border-gray-700">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-yellow-400"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              {/* Active Plans */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-1 md:pb-2 mb-1 md:mb-2">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-green-500" />
                  <span className="text-[8px] md:text-[10px] text-gray-300">Active Plans:</span>
                </div>
                <span className="text-[8px] md:text-[10px] font-bold text-white">{activePlans.length}</span>
              </div>

              {/* Time Left */}
              <div className="flex items-center justify-center">
                <span className="text-[8px] md:text-[10px] text-gray-400">Time Left: <span className="text-gray-300 font-mono">{timeRemaining || '00:00:00'}</span></span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

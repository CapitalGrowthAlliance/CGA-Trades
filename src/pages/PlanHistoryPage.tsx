import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, BarChart2, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function PlanHistoryPage() {
  const { user: authUser } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) {
      fetchInvestments();
    }
  }, [authUser]);

  const fetchInvestments = async () => {
    if (!authUser) return;
    try {
      setLoading(true);
      const q = query(
        collection(db, 'investments'),
        where('userId', '==', authUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const invs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvestments(invs);
    } catch (error) {
      console.error('Failed to fetch investments', error);
    } finally {
      setLoading(false);
    }
  };

  const activatePlan = async (id: string) => {
    try {
      setActivating(id);
      const invRef = doc(db, 'investments', id);
      await updateDoc(invRef, {
        status: 'active',
        activatedAt: new Date().toISOString()
      });
      await fetchInvestments();
    } catch (error) {
      console.error('Failed to activate plan', error);
      alert('Failed to activate plan. Please try again.');
    } finally {
      setActivating(null);
    }
  };

  if (!authUser) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Investment Plan History</h1>
        <p className="text-sm text-text-secondary mt-1">Manage and activate your AI trading plans.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">Loading plans...</div>
      ) : investments.length === 0 ? (
        <div className="text-center py-12 bg-bg-secondary rounded-2xl border border-border-light">
          <p className="text-text-secondary">You have no investment plans yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map((inv) => {
            const dailyProfit = inv.amount * (inv.roi / 100);
            const isActive = inv.status === 'active';

            return (
              <div key={inv.id} className="bg-[#0a0a0a] text-white p-4 sm:p-5 rounded-2xl border border-[#333] shadow-lg relative overflow-hidden group flex flex-col">
                {/* Background animated elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_${isActive ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,255,0.05)'}_0%,_transparent_60%)]`}></div>
                </div>
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className={`w-5 h-5 ${isActive ? 'text-accent-primary' : 'text-gray-500'}`} />
                      <h3 className="text-base font-bold tracking-wider">{inv.planName}</h3>
                    </div>
                    <BarChart2 className={`w-4 h-4 ${isActive ? 'text-accent-primary' : 'text-gray-500'}`} />
                  </div>
                  
                  <div className="space-y-2.5 mb-4 flex-1">
                    <div className="flex justify-between items-center border-b border-[#333] pb-1.5">
                      <span className="text-sm text-gray-400">Deposit Amount</span>
                      <span className="font-mono font-bold">${inv.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#333] pb-1.5">
                      <span className="text-sm text-gray-400">Daily ROI</span>
                      <span className="font-mono font-bold text-accent-primary">{inv.roi}%</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#333] pb-1.5">
                      <span className="text-sm text-gray-400">Expected Daily Profit</span>
                      <span className="font-mono font-bold text-emerald-400">${dailyProfit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#333] pb-1.5">
                      <span className="text-sm text-gray-400">Duration</span>
                      <span className="font-mono">{inv.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Status</span>
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${isActive ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {isActive ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {inv.status}
                      </span>
                    </div>
                  </div>

                  {!isActive ? (
                    <button
                      onClick={() => activatePlan(inv.id)}
                      disabled={activating === inv.id}
                      className="w-full py-2.5 text-sm bg-accent-primary hover:bg-[#d4ff00] text-black font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {activating === inv.id ? 'Activating...' : 'Activate Plan'}
                    </button>
                  ) : (
                    <div className="w-full py-2.5 text-sm bg-[#111] border border-[#333] text-accent-primary font-bold rounded-xl flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary"></div>
                      AI Trading Active
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

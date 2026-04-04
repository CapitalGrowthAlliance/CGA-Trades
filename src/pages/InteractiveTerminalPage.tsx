import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Globe, 
  Coins, 
  ArrowLeft,
  Maximize2,
  Settings,
  Layout,
  LineChart as LineChartIcon,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ASSET_CLASSES = [
  { id: 'commodities', label: 'Commodities', icon: Globe },
  { id: 'indices', label: 'Indices', icon: BarChart3 },
  { id: 'forex', label: 'Forex', icon: Activity },
  { id: 'crypto', label: 'Crypto', icon: Coins },
];

const MOCK_CHARTS = [
  { id: 'gold', class: 'commodities', name: 'Gold (XAU/USD)', color: 'from-yellow-500/20' },
  { id: 'oil', class: 'commodities', name: 'Crude Oil', color: 'from-orange-500/20' },
  { id: 'sp500', class: 'indices', name: 'S&P 500', color: 'from-blue-500/20' },
  { id: 'nasdaq', class: 'indices', name: 'NASDAQ 100', color: 'from-indigo-500/20' },
  { id: 'eurusd', class: 'forex', name: 'EUR/USD', color: 'from-emerald-500/20' },
  { id: 'gbpjpy', class: 'forex', name: 'GBP/JPY', color: 'from-purple-500/20' },
  { id: 'btc', class: 'crypto', name: 'Bitcoin', color: 'from-orange-600/20' },
  { id: 'eth', class: 'crypto', name: 'Ethereum', color: 'from-blue-600/20' },
];

export default function InteractiveTerminalPage() {
  const navigate = useNavigate();
  const [selectedChart, setSelectedChart] = useState(MOCK_CHARTS[0]);
  const [activeClass, setActiveClass] = useState('all');

  const filteredCharts = activeClass === 'all' 
    ? MOCK_CHARTS 
    : MOCK_CHARTS.filter(c => c.class === activeClass);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              INTERACTIVE <span className="text-accent-primary">TERMINAL</span>
              <div className="px-2 py-0.5 rounded-md bg-accent-primary/10 border border-accent-primary/20 text-[10px] text-accent-primary font-mono">LIVE</div>
            </h1>
            <p className="text-sm text-slate-500">Advanced Multi-Asset Analysis Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveClass('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeClass === 'all' ? 'bg-accent-primary text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            All Assets
          </button>
          {ASSET_CLASSES.map(cls => (
            <button 
              key={cls.id}
              onClick={() => setActiveClass(cls.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeClass === cls.id ? 'bg-accent-primary text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              <cls.icon className="w-3 h-3" />
              {cls.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Chart Area */}
        <div className="xl:col-span-3 space-y-6">
          <motion.div 
            layoutId="main-chart"
            className="relative aspect-video xl:aspect-auto xl:h-[600px] bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden group shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-blue-500/5" />
            
            {/* Chart Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/40 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                  <Activity className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{selectedChart.name}</h2>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="text-emerald-500">● LIVE</span>
                    <span>15M TIMEFRAME</span>
                    <span>VOL: 1.2M</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <Maximize2 className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <Settings className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Placeholder for real chart (TradingView, etc.) */}
            <div className="absolute inset-0 flex items-center justify-center pt-20">
              <div className="w-full h-full p-8">
                <div className="w-full h-full border border-white/5 rounded-2xl bg-black/20 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Mock Chart Lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                    <path d="M0 100 Q 100 80, 200 120 T 400 90 T 600 110 T 800 70 T 1000 100" fill="none" stroke="#c8ff00" strokeWidth="2" />
                    <path d="M0 150 Q 150 130, 300 170 T 600 140 T 900 160 T 1200 120" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
                  
                  <LineChartIcon className="w-16 h-16 text-slate-800 mb-4" />
                  <p className="text-slate-600 font-mono text-xs uppercase tracking-[0.2em]">Initializing Chart Engine...</p>
                  
                  {/* Floating Data Points */}
                  <div className="absolute top-1/3 left-1/4 p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-500 font-bold">
                    +2.45%
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 p-2 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-500 font-bold">
                    SUPPORT
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Footer/Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-4 z-20">
              {['1M', '5M', '15M', '1H', '4H', '1D'].map(tf => (
                <button 
                  key={tf}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${tf === '15M' ? 'bg-accent-primary text-slate-900' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredCharts.map((chart) => (
                <motion.button
                  key={chart.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedChart(chart)}
                  className={`p-4 rounded-3xl border transition-all text-left relative overflow-hidden group ${
                    selectedChart.id === chart.id 
                      ? 'bg-accent-primary/10 border-accent-primary shadow-[0_0_20px_rgba(200,255,0,0.1)]' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${chart.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedChart.id === chart.id ? 'bg-accent-primary text-slate-900' : 'bg-white/10 text-slate-400'}`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="text-[10px] font-mono text-emerald-500">+0.42%</div>
                    </div>
                    <h3 className="font-bold text-sm text-white mb-1">{chart.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{chart.class}</p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Layout className="w-5 h-5 text-accent-primary" />
              Terminal Layout
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Single View', active: true },
                { label: 'Split Horizontal', active: false },
                { label: 'Split Vertical', active: false },
                { label: 'Quad View', active: false },
              ].map(opt => (
                <button 
                  key={opt.label}
                  className={`w-full p-4 rounded-2xl border text-left text-xs font-bold transition-all ${opt.active ? 'bg-accent-primary/10 border-accent-primary text-accent-primary' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent-primary" />
              AI Indicators
            </h3>
            <div className="space-y-4">
              {[
                { label: 'AI Support/Resistance', enabled: true },
                { label: 'Trend Exhaustion', enabled: true },
                { label: 'Volume Profile', enabled: false },
                { label: 'Sentiment Overlay', enabled: false },
              ].map(ind => (
                <div key={ind.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{ind.label}</span>
                  <div className={`w-10 h-5 rounded-full p-1 transition-colors ${ind.enabled ? 'bg-accent-primary' : 'bg-slate-700'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${ind.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-400 hover:bg-white/10 transition-all">
            Export Analysis Report
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar, 
  BarChart3, 
  Activity, 
  Zap, 
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Globe,
  Coins,
  LineChart as LineChartIcon,
  Flame,
  Target
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  CartesianGrid
} from 'recharts';

// --- Mock Data Generators ---

const generateMarketIntelligence = () => [
  { asset: 'BTC/USD', type: 'Crypto', status: 'Scanning', confidence: 88, trend: 'Bullish' },
  { asset: 'EUR/USD', type: 'Forex', status: 'Analyzing', confidence: 74, trend: 'Neutral' },
  { asset: 'Gold', type: 'Commodity', status: 'Scanning', confidence: 92, trend: 'Bullish' },
  { asset: 'S&P 500', type: 'Index', status: 'Scanning', confidence: 65, trend: 'Bearish' },
  { asset: 'ETH/BTC', type: 'Crypto', status: 'Scanning', confidence: 81, trend: 'Bullish' },
  { asset: 'Crude Oil', type: 'Commodity', status: 'Analyzing', confidence: 58, trend: 'Neutral' },
];

const generateTradeSetups = () => [
  { 
    pair: 'GBP/JPY', 
    signal: 'BUY', 
    price: '191.450', 
    reasoning: 'AI detected triple bottom on 15m timeframe with RSI divergence.', 
    time: '2m ago',
    probability: 84
  },
  { 
    pair: 'TSLA', 
    signal: 'SELL', 
    price: '175.20', 
    reasoning: 'Volume exhaustion at resistance level. AI predicts 2.5% correction.', 
    time: 'Just now',
    probability: 76
  },
  { 
    pair: 'SOL/USD', 
    signal: 'BUY', 
    price: '145.80', 
    reasoning: 'Breakout of descending wedge confirmed by AI pattern recognition.', 
    time: '5m ago',
    probability: 91
  }
];

const generateStrengthData = () => [
  { name: 'USD', strength: 85, color: '#c8ff00' },
  { name: 'EUR', strength: 45, color: '#3b82f6' },
  { name: 'JPY', strength: 20, color: '#ef4444' },
  { name: 'BTC', strength: 92, color: '#f59e0b' },
  { name: 'GOLD', strength: 78, color: '#fbbf24' },
];

const generateVolatilityAlerts = () => [
  { asset: 'NVDA', change: '+4.2%', impact: 'High', time: '10:45 AM' },
  { asset: 'DOGE', change: '-8.5%', impact: 'Extreme', time: '10:42 AM' },
  { asset: 'NASDAQ', change: '+1.1%', impact: 'Medium', time: '10:30 AM' },
];

const generateEconomicEvents = () => [
  { time: '14:30', event: 'CPI m/m', impact: 'High', currency: 'USD' },
  { time: '15:45', event: 'Flash Services PMI', impact: 'Medium', currency: 'EUR' },
  { time: '18:00', event: 'FOMC Meeting Minutes', impact: 'High', currency: 'USD' },
];

const generateChartData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: Math.floor(Math.random() * 100) + 500,
  }));
};

// --- Components ---

const GlassPanel = ({ children, title, icon: Icon, className = "" }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl ${className}`}
  >
    {title && (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-accent-primary" />}
          <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
      </div>
    )}
    {children}
  </motion.div>
);

export default function AIInsightsPage() {
  const navigate = useNavigate();
  const [marketIntel, setMarketIntel] = useState(generateMarketIntelligence());
  const [tradeSetups, setTradeSetups] = useState(generateTradeSetups());
  const [chartData, setChartData] = useState(generateChartData());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => {
        setMarketIntel(generateMarketIntelligence());
        setTradeSetups(generateTradeSetups());
        setChartData(generateChartData());
        setRefreshing(false);
      }, 500);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden pb-20">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="sticky top-24 z-50 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-bg-primary/80 backdrop-blur-md p-6 rounded-2xl border border-border-light">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-accent-primary font-bold text-sm mb-2"
            >
              <Brain className="w-4 h-4" />
              AI CORE v4.2 ACTIVE
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              AI <span className="text-accent-primary">INSIGHTS</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Next Scan</span>
                <span className="text-sm font-mono text-accent-primary">00:05s</span>
              </div>
              <RefreshCw className={`w-5 h-5 text-accent-primary ${refreshing ? 'animate-spin' : ''}`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. AI Market Intelligence (Left Column) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassPanel title="Market Intelligence" icon={Search}>
              <div className="space-y-4">
                {marketIntel.map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{item.asset}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-400">{item.type}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-bold ${item.trend === 'Bullish' ? 'text-emerald-500' : item.trend === 'Bearish' ? 'text-red-500' : 'text-slate-400'}`}>
                        {item.trend === 'Bullish' ? <TrendingUp className="w-3 h-3" /> : item.trend === 'Bearish' ? <TrendingDown className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                        {item.trend}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                        <span className="text-xs text-slate-500">{item.status}...</span>
                      </div>
                      <div className="text-xs font-mono text-accent-primary">{item.confidence}% Conf.</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel title="Strength Index" icon={BarChart3}>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateStrengthData()} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#ffffff40" fontSize={12} width={40} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '12px' }}
                    />
                    <Bar dataKey="strength" radius={[0, 4, 4, 0]}>
                      {generateStrengthData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>

          {/* 2. AI Trade Setup Detection (Middle Column) */}
          <div className="lg:col-span-5 space-y-6">
            <GlassPanel title="Trade Setup Detection" icon={Zap} className="border-accent-primary/20">
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {tradeSetups.map((setup, i) => (
                    <motion.div 
                      key={setup.pair}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative p-6 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${setup.signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                          {setup.signal} SIGNAL
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 flex items-center justify-center">
                          <Activity className="w-6 h-6 text-accent-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-white">{setup.pair}</h4>
                          <p className="text-xs text-slate-500 font-mono">Entry: {setup.price}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-6 leading-relaxed italic">
                        "{setup.reasoning}"
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                          <Clock className="w-3 h-3" />
                          {setup.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-bold text-accent-primary">{setup.probability}% Probability</div>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${setup.probability}%` }}
                              className="h-full bg-accent-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </GlassPanel>

            <GlassPanel title="Live Market Pulse" icon={Activity}>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c8ff00" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#c8ff00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#c8ff00" fill="url(#pulseGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-around">
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Volatility</div>
                  <div className="text-lg font-bold text-white">High</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Sentiment</div>
                  <div className="text-lg font-bold text-emerald-500">Bullish</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Volume</div>
                  <div className="text-lg font-bold text-white">2.4B</div>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* 3. Alerts & Calendar (Right Column) */}
          <div className="lg:col-span-3 space-y-6">
            <GlassPanel title="Volatility Alerts" icon={Flame}>
              <div className="space-y-4">
                {generateVolatilityAlerts().map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${alert.impact === 'Extreme' ? 'bg-red-500 animate-ping' : alert.impact === 'High' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                      <div>
                        <div className="text-sm font-bold text-white">{alert.asset}</div>
                        <div className="text-[10px] text-slate-500">{alert.time}</div>
                      </div>
                    </div>
                    <div className={`text-xs font-bold ${alert.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                      {alert.change}
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel title="Economic Calendar" icon={Calendar}>
              <div className="space-y-4">
                {generateEconomicEvents().map((event, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-accent-primary">{event.time}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${event.impact === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                        {event.impact}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white group-hover:text-accent-primary transition-colors">{event.event}</span>
                      <span className="text-xs text-slate-500">{event.currency}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:bg-white/10 transition-all">
                View Full Calendar
              </button>
            </GlassPanel>

            <GlassPanel title="AI Heatmap" icon={Globe}>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-lg ${i % 3 === 0 ? 'bg-emerald-500/40' : i % 2 === 0 ? 'bg-red-500/40' : 'bg-slate-700/40'} border border-white/5 animate-pulse`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <p className="mt-4 text-[10px] text-center text-slate-500 uppercase font-bold tracking-widest">Global Correlation Matrix</p>
            </GlassPanel>
          </div>

        </div>

        {/* Bottom Section: Drawings & Charts */}
        <div className="mt-12">
          <GlassPanel title="AI-Generated Technical Analysis" icon={LineChartIcon}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-[250px] md:h-[400px] w-full bg-black/20 rounded-3xl border border-white/5 relative overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '12px' }}
                      />
                      <Area type="step" dataKey="value" stroke="#c8ff00" fill="#c8ff0010" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                  {/* Mock Chart Annotations */}
                  <div className="absolute top-1/4 left-1/3 p-2 rounded-lg bg-accent-primary/20 border border-accent-primary/40 text-[10px] font-bold text-accent-primary">
                    AI RESISTANCE LEVEL
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 p-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-[10px] font-bold text-blue-400">
                    AI SUPPORT ZONE
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent-primary" />
                    AI Trend Lines
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Primary Trend</span>
                      <span className="text-emerald-500 font-bold">Strong Bullish</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Secondary Trend</span>
                      <span className="text-slate-400 font-bold">Consolidating</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">AI Confidence</span>
                      <span className="text-accent-primary font-bold">89.4%</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <LineChartIcon className="w-4 h-4 text-accent-primary" />
                    Pattern Recognition
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Head & Shoulders', 'Double Top', 'Bull Flag', 'Wedge'].map(p => (
                      <span key={p} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/markets')}
                  className="w-full py-4 bg-accent-primary text-slate-900 font-bold rounded-2xl hover:bg-[#b3e600] transition-all shadow-[0_0_20px_rgba(200,255,0,0.2)]"
                >
                  Launch Interactive Terminal
                </button>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

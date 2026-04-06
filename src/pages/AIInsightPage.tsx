import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  AlertTriangle, 
  Calendar, 
  Activity, 
  BarChart3, 
  Globe, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Clock,
  Gauge,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  momentum: 'Strong' | 'Moderate' | 'Weak';
  sentiment: { bullish: number; bearish: number; neutral: number };
  volatility: 'Low' | 'Moderate' | 'High' | 'Extreme';
  confidence: number;
  category: 'Forex' | 'Crypto' | 'Commodity' | 'Index';
}

interface TradeSetup {
  id: string;
  symbol: string;
  type: 'Breakout' | 'Reversal' | 'Trend Continuation' | 'Support Reaction' | 'Resistance Reaction';
  direction: 'Long' | 'Short';
  entry: number;
  target: number;
  stop: number;
  risk: 'Low' | 'Medium' | 'High';
  confidence: number;
  time: string;
}

interface EconomicEvent {
  id: string;
  event: string;
  country: string;
  currency: string;
  impact: 'Low' | 'Medium' | 'High';
  time: string;
  expectedVolatility: 'Low' | 'Medium' | 'High' | 'Very High';
}

interface CurrencyStrength {
  symbol: string;
  strength: number; // 0 to 100
  status: 'Very Strong' | 'Strong' | 'Neutral' | 'Weak' | 'Very Weak';
}

// --- Mock Data Generators ---

const INITIAL_ASSETS: MarketAsset[] = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.0845, change: 0.0012, changePercent: 0.11, trend: 'Bullish', momentum: 'Moderate', sentiment: { bullish: 62, bearish: 30, neutral: 8 }, volatility: 'Moderate', confidence: 84, category: 'Forex' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', price: 1.2632, change: -0.0045, changePercent: -0.35, trend: 'Bearish', momentum: 'Strong', sentiment: { bullish: 35, bearish: 55, neutral: 10 }, volatility: 'High', confidence: 78, category: 'Forex' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', price: 150.24, change: 0.45, changePercent: 0.30, trend: 'Bullish', momentum: 'Strong', sentiment: { bullish: 70, bearish: 20, neutral: 10 }, volatility: 'Moderate', confidence: 91, category: 'Forex' },
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', price: 64230.50, change: 1240.20, changePercent: 1.96, trend: 'Bullish', momentum: 'Strong', sentiment: { bullish: 75, bearish: 15, neutral: 10 }, volatility: 'High', confidence: 89, category: 'Crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', price: 3450.15, change: 45.30, changePercent: 1.33, trend: 'Bullish', momentum: 'Moderate', sentiment: { bullish: 68, bearish: 22, neutral: 10 }, volatility: 'Moderate', confidence: 82, category: 'Crypto' },
  { symbol: 'SOLUSD', name: 'Solana / US Dollar', price: 145.60, change: 8.40, changePercent: 6.12, trend: 'Bullish', momentum: 'Strong', sentiment: { bullish: 82, bearish: 10, neutral: 8 }, volatility: 'Extreme', confidence: 94, category: 'Crypto' },
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', price: 2155.40, change: 12.50, changePercent: 0.58, trend: 'Bullish', momentum: 'Moderate', sentiment: { bullish: 58, bearish: 32, neutral: 10 }, volatility: 'Moderate', confidence: 76, category: 'Commodity' },
  { symbol: 'WTI', name: 'Crude Oil WTI', price: 78.45, change: -1.20, changePercent: -1.51, trend: 'Bearish', momentum: 'Moderate', sentiment: { bullish: 40, bearish: 50, neutral: 10 }, volatility: 'High', confidence: 72, category: 'Commodity' },
  { symbol: 'SPX500', name: 'S&P 500', price: 5120.30, change: 15.40, changePercent: 0.30, trend: 'Bullish', momentum: 'Moderate', sentiment: { bullish: 60, bearish: 30, neutral: 10 }, volatility: 'Low', confidence: 85, category: 'Index' },
  { symbol: 'NAS100', name: 'Nasdaq 100', price: 18250.45, change: 110.20, changePercent: 0.61, trend: 'Bullish', momentum: 'Strong', sentiment: { bullish: 65, bearish: 25, neutral: 10 }, volatility: 'Moderate', confidence: 88, category: 'Index' },
];

const INITIAL_SETUPS: TradeSetup[] = [
  { id: '1', symbol: 'GBPUSD', type: 'Resistance Reaction', direction: 'Short', entry: 1.2650, target: 1.2580, stop: 1.2685, risk: 'Medium', confidence: 82, time: '10m ago' },
  { id: '2', symbol: 'BTCUSD', type: 'Breakout', direction: 'Long', entry: 64100, target: 66500, stop: 63200, risk: 'High', confidence: 91, time: '25m ago' },
  { id: '3', symbol: 'EURUSD', type: 'Trend Continuation', direction: 'Long', entry: 1.0840, target: 1.0910, stop: 1.0815, risk: 'Low', confidence: 87, time: '45m ago' },
];

const INITIAL_EVENTS: EconomicEvent[] = [
  { id: '1', event: 'US Non-Farm Payrolls', country: 'USA', currency: 'USD', impact: 'High', time: '14:30', expectedVolatility: 'Very High' },
  { id: '2', event: 'ECB President Speech', country: 'EU', currency: 'EUR', impact: 'Medium', time: '16:00', expectedVolatility: 'High' },
  { id: '3', event: 'UK GDP Report', country: 'UK', currency: 'GBP', impact: 'High', time: '09:00', expectedVolatility: 'High' },
];

const CURRENCIES: string[] = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];

// --- Components ---

const MarketAnalysisCard = ({ asset }: { asset: MarketAsset }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-bg-secondary border border-border-light rounded-2xl p-5 hover:border-accent-primary/30 transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-lg group-hover:text-accent-primary transition-colors">{asset.symbol}</h3>
        <p className="text-xs text-text-secondary">{asset.name}</p>
      </div>
      <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
        asset.trend === 'Bullish' ? 'bg-green-500/10 text-green-500' : 
        asset.trend === 'Bearish' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
      }`}>
        {asset.trend}
      </div>
    </div>

    <div className="flex items-end justify-between mb-6">
      <div>
        <p className="text-2xl font-mono font-bold tracking-tighter">
          {asset.category === 'Forex' ? asset.price.toFixed(4) : 
           asset.category === 'Crypto' ? asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : 
           asset.price.toFixed(2)}
        </p>
        <p className={`text-xs font-medium flex items-center gap-1 ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {asset.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {asset.changePercent.toFixed(2)}%
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">AI Confidence</p>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-bg-primary rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${asset.confidence}%` }}
              className="h-full bg-accent-primary"
            />
          </div>
          <span className="text-xs font-bold">{asset.confidence}%</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-light">
      <div>
        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">Momentum</p>
        <p className="text-xs font-semibold">{asset.momentum}</p>
      </div>
      <div>
        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">Volatility</p>
        <p className="text-xs font-semibold">{asset.volatility}</p>
      </div>
    </div>
  </motion.div>
);

const TradeSetupCard = ({ setup }: { setup: TradeSetup }) => (
  <div className="bg-bg-secondary border border-border-light rounded-2xl p-5 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-3">
      <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
        setup.direction === 'Long' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
      }`}>
        {setup.direction}
      </div>
    </div>
    
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
        <Zap className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold">{setup.symbol}</h4>
        <p className="text-xs text-text-secondary">{setup.type}</p>
      </div>
    </div>

    <div className="space-y-3 mb-5">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">Entry Zone</span>
        <span className="font-mono font-bold">{setup.entry}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">Take Profit</span>
        <span className="font-mono font-bold text-green-500">{setup.target}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">Stop Loss</span>
        <span className="font-mono font-bold text-red-500">{setup.stop}</span>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-border-light">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          setup.risk === 'Low' ? 'bg-green-500' : setup.risk === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        <span className="text-xs font-medium">{setup.risk} Risk</span>
      </div>
      <span className="text-[10px] text-text-secondary font-bold uppercase">{setup.time}</span>
    </div>
  </div>
);

const SentimentBar = ({ asset }: { asset: MarketAsset }) => (
  <div className="bg-bg-secondary border border-border-light rounded-2xl p-5">
    <div className="flex justify-between items-center mb-3">
      <h4 className="font-bold text-sm">{asset.symbol} Sentiment</h4>
      <span className="text-[10px] text-text-secondary font-bold uppercase">Live</span>
    </div>
    <div className="h-2 w-full bg-bg-primary rounded-full overflow-hidden flex mb-2">
      <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${asset.sentiment.bullish}%` }} />
      <div className="h-full bg-bg-hover transition-all duration-500" style={{ width: `${asset.sentiment.neutral}%` }} />
      <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${asset.sentiment.bearish}%` }} />
    </div>
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
      <span className="text-green-500">{asset.sentiment.bullish}% Bullish</span>
      <span className="text-text-secondary">{asset.sentiment.neutral}% Neutral</span>
      <span className="text-red-500">{asset.sentiment.bearish}% Bearish</span>
    </div>
  </div>
);

const EconomicEventRow = ({ event }: { event: EconomicEvent }) => (
  <div className="flex items-center justify-between p-4 hover:bg-bg-hover transition-colors rounded-xl group">
    <div className="flex items-center gap-4">
      <div className="w-12 text-center">
        <p className="text-sm font-bold">{event.time}</p>
        <p className="text-[10px] text-text-secondary font-bold uppercase">{event.currency}</p>
      </div>
      <div className="w-px h-8 bg-border-light" />
      <div>
        <p className="text-sm font-semibold group-hover:text-accent-primary transition-colors">{event.event}</p>
        <p className="text-[10px] text-text-secondary font-bold uppercase">{event.country}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right hidden sm:block">
        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">Impact</p>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-3 h-1 rounded-full ${
              i <= (event.impact === 'High' ? 3 : event.impact === 'Medium' ? 2 : 1)
                ? (event.impact === 'High' ? 'bg-red-500' : event.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500')
                : 'bg-bg-primary'
            }`} />
          ))}
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">Expected Vol</p>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          event.expectedVolatility === 'Very High' ? 'bg-red-500/10 text-red-500' :
          event.expectedVolatility === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {event.expectedVolatility}
        </span>
      </div>
    </div>
  </div>
);

export default function AIInsightPage() {
  const [assets, setAssets] = useState<MarketAsset[]>(INITIAL_ASSETS);
  const [setups, setSetups] = useState<TradeSetup[]>(INITIAL_SETUPS);
  const [events] = useState<EconomicEvent[]>(INITIAL_EVENTS);
  const [currencyStrength, setCurrencyStrength] = useState<CurrencyStrength[]>(
    CURRENCIES.map(c => ({ symbol: c, strength: 50, status: 'Neutral' }))
  );
  const [alerts, setAlerts] = useState<string[]>([
    "EURUSD approaching key resistance zone.",
    "Bitcoin bullish breakout probability rising.",
    "Nasdaq momentum accelerating."
  ]);

  // --- Real-time Simulation ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Update asset prices and metrics
      setAssets(prev => prev.map(asset => {
        const volatilityFactor = asset.volatility === 'Extreme' ? 0.02 : asset.volatility === 'High' ? 0.01 : 0.005;
        const change = (Math.random() - 0.5) * asset.price * volatilityFactor;
        const newPrice = asset.price + change;
        const newChange = asset.change + change;
        const newChangePercent = (newChange / (newPrice - newChange)) * 100;
        
        // Randomly shift sentiment slightly
        const sentimentShift = (Math.random() - 0.5) * 2;
        const newBullish = Math.max(0, Math.min(100, asset.sentiment.bullish + sentimentShift));
        const newBearish = Math.max(0, Math.min(100 - newBullish, asset.sentiment.bearish - sentimentShift));
        const newNeutral = 100 - newBullish - newBearish;

        return {
          ...asset,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          sentiment: { bullish: newBullish, bearish: newBearish, neutral: newNeutral },
          confidence: Math.max(60, Math.min(98, asset.confidence + (Math.random() - 0.5) * 2))
        };
      }));

      // Update currency strength
      setCurrencyStrength(prev => prev.map(curr => {
        const newStrength = Math.max(10, Math.min(95, curr.strength + (Math.random() - 0.5) * 5));
        let status: CurrencyStrength['status'] = 'Neutral';
        if (newStrength > 80) status = 'Very Strong';
        else if (newStrength > 65) status = 'Strong';
        else if (newStrength < 20) status = 'Very Weak';
        else if (newStrength < 35) status = 'Weak';
        
        return { ...curr, strength: newStrength, status };
      }).sort((a, b) => b.strength - a.strength));

      // Occasionally add a new alert
      if (Math.random() > 0.9) {
        const randomAsset = INITIAL_ASSETS[Math.floor(Math.random() * INITIAL_ASSETS.length)];
        const alertTypes = [
          `${randomAsset.symbol} volatility spike detected.`,
          `${randomAsset.symbol} momentum shifting ${Math.random() > 0.5 ? 'bullish' : 'bearish'}.`,
          `AI detecting potential ${Math.random() > 0.5 ? 'long' : 'short'} setup on ${randomAsset.symbol}.`
        ];
        setAlerts(prev => [alertTypes[Math.floor(Math.random() * alertTypes.length)], ...prev.slice(0, 4)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">AI Insight Terminal</h1>
          </div>
          <p className="text-text-secondary max-w-2xl">
            Institutional-grade market intelligence hub powered by real-time quantitative analysis and neural network predictions.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-bg-secondary border border-border-light rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-bold uppercase tracking-wider">Live Data Stream</span>
          </div>
          <div className="w-px h-6 bg-border-light" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span className="text-sm font-mono">{new Date().toLocaleTimeString()} UTC</span>
          </div>
        </div>
      </div>

      {/* Top Stats / Performance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Global Risk Sentiment', value: 'Risk-On', icon: Gauge, color: 'text-green-500' },
          { label: 'Strongest Asset Class', value: 'Crypto', icon: Zap, color: 'text-accent-primary' },
          { label: 'Most Volatile Market', value: 'SOLUSD', icon: Activity, color: 'text-orange-500' },
          { label: 'Top Trending Instrument', value: 'USDJPY', icon: TrendingUp, color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-bg-secondary border border-border-light rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-bg-primary flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-0.5">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Market Insights & Alerts */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Market Insights Engine */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-primary" />
                <h2 className="text-xl font-bold">Market Insights Engine</h2>
              </div>
              <div className="flex gap-2">
                {['All', 'Forex', 'Crypto', 'Indices'].map(tab => (
                  <button key={tab} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    tab === 'All' ? 'bg-accent-primary text-white' : 'bg-bg-secondary text-text-secondary hover:bg-bg-hover'
                  }`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.slice(0, 6).map((asset, i) => (
                <MarketAnalysisCard key={i} asset={asset} />
              ))}
            </div>
          </section>

          {/* AI Market Heatmap */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-accent-primary" />
              <h2 className="text-xl font-bold">AI Market Heatmap</h2>
            </div>
            <div className="bg-bg-secondary border border-border-light rounded-2xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {assets.map((asset, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-xl p-3 flex flex-col justify-between transition-all duration-500 ${
                      asset.changePercent > 1 ? 'bg-green-500/80 text-white' :
                      asset.changePercent > 0.2 ? 'bg-green-500/40 text-text-primary' :
                      asset.changePercent < -1 ? 'bg-red-500/80 text-white' :
                      asset.changePercent < -0.2 ? 'bg-red-500/40 text-text-primary' :
                      'bg-yellow-500/20 text-text-primary'
                    }`}
                  >
                    <span className="text-xs font-bold">{asset.symbol}</span>
                    <span className="text-lg font-mono font-bold">{asset.changePercent.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Economic Calendar */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-accent-primary" />
              <h2 className="text-xl font-bold">Global Economic Calendar</h2>
            </div>
            <div className="bg-bg-secondary border border-border-light rounded-2xl overflow-hidden">
              <div className="divide-y divide-border-light">
                {events.map((event, i) => (
                  <EconomicEventRow key={i} event={event} />
                ))}
              </div>
              <button className="w-full py-4 text-xs font-bold text-accent-primary hover:bg-bg-hover transition-colors uppercase tracking-widest">
                View Full Calendar
              </button>
            </div>
          </section>
        </div>

        {/* Right Column - Trade Setups, Sentiment, Strength */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AI Trade Setup Detection */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-accent-primary" />
              <h2 className="text-xl font-bold">AI Trade Setups</h2>
            </div>
            <div className="space-y-4">
              {setups.map((setup, i) => (
                <TradeSetupCard key={i} setup={setup} />
              ))}
            </div>
          </section>

          {/* Market Sentiment Engine */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-accent-primary" />
              <h2 className="text-xl font-bold">Sentiment Engine</h2>
            </div>
            <div className="space-y-4">
              {assets.slice(0, 4).map((asset, i) => (
                <SentimentBar key={i} asset={asset} />
              ))}
            </div>
          </section>

          {/* Currency Strength Index */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-accent-primary" />
              <h2 className="text-xl font-bold">Currency Strength</h2>
            </div>
            <div className="bg-bg-secondary border border-border-light rounded-2xl p-6">
              <div className="space-y-5">
                {currencyStrength.map((curr, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">{curr.symbol}</span>
                      <span className={`font-bold uppercase tracking-tighter ${
                        curr.status.includes('Strong') ? 'text-green-500' : 
                        curr.status.includes('Weak') ? 'text-red-500' : 'text-text-secondary'
                      }`}>
                        {curr.status}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-bg-primary rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${curr.strength}%` }}
                        className={`h-full transition-all duration-500 ${
                          curr.strength > 70 ? 'bg-green-500' : curr.strength < 30 ? 'bg-red-500' : 'bg-accent-primary'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Smart Market Alerts */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-accent-primary" />
              <h2 className="text-xl font-bold">Intelligence Alerts</h2>
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {alerts.map((alert, i) => (
                  <motion.div 
                    key={alert}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-bg-secondary border-l-4 border-accent-primary p-4 rounded-r-xl shadow-sm flex items-start gap-3"
                  >
                    <Info className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                    <p className="text-xs font-medium leading-relaxed">{alert}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

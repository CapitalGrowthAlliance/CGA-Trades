import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Globe, 
  Coins, 
  BarChart3, 
  Flame, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Brain,
  Target,
  Maximize2,
  Settings,
  RefreshCw,
  Layout,
  ArrowRight
} from 'lucide-react';

// --- Types ---
interface Asset {
  id: string;
  name: string;
  symbol: string; // Twelve Data format: BTC/USD
  tvSymbol: string; // TradingView format: BINANCE:BTCUSDT
  category: 'Commodities' | 'Indices' | 'Forex' | 'Crypto';
}

// --- Symbol Mapping Utility ---
const COMMON_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', tvSymbol: 'BINANCE:BTCUSDT', category: 'Crypto' },
  { symbol: 'ETH', name: 'Ethereum', tvSymbol: 'BINANCE:ETHUSDT', category: 'Crypto' },
  { symbol: 'SOL', name: 'Solana', tvSymbol: 'BINANCE:SOLUSDT', category: 'Crypto' },
  { symbol: 'BNB', name: 'Binance Coin', tvSymbol: 'BINANCE:BNBUSDT', category: 'Crypto' },
  { symbol: 'XRP', name: 'Ripple', tvSymbol: 'BINANCE:XRPUSDT', category: 'Crypto' },
  { symbol: 'EURUSD', name: 'Euro / US Dollar', tvSymbol: 'FX:EURUSD', category: 'Forex' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', tvSymbol: 'FX:GBPUSD', category: 'Forex' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', tvSymbol: 'FX:USDJPY', category: 'Forex' },
  { symbol: 'GOLD', name: 'Gold', tvSymbol: 'OANDA:XAUUSD', category: 'Commodities' },
  { symbol: 'SILVER', name: 'Silver', tvSymbol: 'OANDA:XAGUSD', category: 'Commodities' },
  { symbol: 'NASDAQ', name: 'Nasdaq 100', tvSymbol: 'NASDAQ:NDX', category: 'Indices' },
  { symbol: 'SPX', name: 'S&P 500', tvSymbol: 'FOREXCOM:SPXUSD', category: 'Indices' },
  { symbol: 'DJI', name: 'Dow Jones', tvSymbol: 'DJ:DJI', category: 'Indices' },
  { symbol: 'OIL', name: 'Crude Oil', tvSymbol: 'TVC:USOIL', category: 'Commodities' },
  { symbol: 'TSLA', name: 'Tesla', tvSymbol: 'NASDAQ:TSLA', category: 'Stocks' },
  { symbol: 'AAPL', name: 'Apple', tvSymbol: 'NASDAQ:AAPL', category: 'Stocks' },
  { symbol: 'NVDA', name: 'Nvidia', tvSymbol: 'NASDAQ:NVDA', category: 'Stocks' },
];

const mapToTVSymbol = (input: string): string => {
  const cleanInput = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  const match = COMMON_ASSETS.find(a => a.symbol === cleanInput || a.name.toUpperCase().includes(cleanInput));
  if (match) return match.tvSymbol;
  
  // Heuristic for crypto
  if (cleanInput.length <= 5 && !['GOLD', 'OIL', 'SPX', 'NDX', 'DOW'].includes(cleanInput)) {
    return `BINANCE:${cleanInput}USDT`;
  }

  return input;
};

const TIMEFRAMES = [
  '1m', '3m', '5m', '15m', '30m', '1H', '2H', '4H', 'D', 'W', 'M'
];

// --- Components ---

const TradingViewChart = ({ symbol, timeframe }: { symbol: string; timeframe: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      if (!container.current || !(window as any).TradingView) return;

      const containerId = `tradingview_${Math.random().toString(36).substring(7)}`;
      container.current.id = containerId;

      let interval = '15';
      if (timeframe.includes('m')) interval = timeframe.replace('m', '');
      else if (timeframe.includes('H')) interval = (parseInt(timeframe.replace('H', '')) * 60).toString();
      else if (['D', 'W', 'M'].includes(timeframe)) interval = timeframe;

      widgetRef.current = new (window as any).TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": interval,
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": containerId,
        "studies": [
          "RSI@tv-basicstudies",
          "MACD@tv-basicstudies",
          "StochasticRSI@tv-basicstudies"
        ],
        "loading_screen": { "backgroundColor": "#050505" },
        "drawings_access": { type: 'black', tools: [{ name: "Regression Trend" }] },
      });
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      if ((window as any).TradingView) {
        initWidget();
      } else {
        script.addEventListener('load', initWidget);
      }
    }

    return () => {
      if (script) script.removeEventListener('load', initWidget);
    };
  }, [symbol, timeframe]);

  return (
    <div className="w-full h-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl" ref={container} />
  );
};

const MarketsPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT');
  const [assetInput, setAssetInput] = useState('BTC');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
  const [livePrice, setLivePrice] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(true);

  // --- API Integration ---
  const fetchPrice = async () => {
    const apiKey = process.env.REACT_APP_API_KEY;
    if (!apiKey || apiKey === 'demo') {
      // Mock price if no API key
      const mockPrice = (Math.random() * 1000 + 40000).toFixed(2);
      setLivePrice(parseFloat(mockPrice).toLocaleString());
      return;
    }

    let searchSymbol = assetInput;
    if (searchSymbol.includes(':')) searchSymbol = searchSymbol.split(':')[1];
    if (searchSymbol.endsWith('USDT')) searchSymbol = searchSymbol.replace('USDT', '/USD');
    
    try {
      setIsRefreshing(true);
      const response = await fetch(`https://api.twelvedata.com/price?symbol=${searchSymbol}&apikey=${apiKey}`);
      const data = await response.json();
      if (data.price) {
        setLivePrice(parseFloat(data.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }));
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const handleAssetSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const tvSymbol = mapToTVSymbol(assetInput);
    setSelectedSymbol(tvSymbol);
    setShowSuggestions(false);
  };

  const suggestions = useMemo(() => {
    if (!assetInput) return [];
    return COMMON_ASSETS.filter(a => 
      a.symbol.toLowerCase().includes(assetInput.toLowerCase()) || 
      a.name.toLowerCase().includes(assetInput.toLowerCase())
    ).slice(0, 5);
  }, [assetInput]);

  // --- AI Insights Logic (Mock) ---
  const aiInsights = useMemo(() => {
    const hash = selectedSymbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const trend = hash % 2 === 0 ? 'Bullish' : 'Bearish';
    const confidence = 70 + (hash % 25);
    const signal = confidence > 85 ? 'Strong Buy' : confidence > 75 ? 'Buy' : trend === 'Bullish' ? 'Hold' : 'Sell';
    return { trend, confidence, signal };
  }, [selectedSymbol]);

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col overflow-hidden">
      {/* Top Control Bar */}
      <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center px-4 md:px-6 justify-between z-50 shrink-0 sticky top-20">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-sm">
            <form onSubmit={handleAssetSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search Asset (e.g. BTC, GOLD)..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-12 text-sm focus:outline-none focus:border-accent-primary transition-all font-mono"
                value={assetInput}
                onChange={(e) => {
                  setAssetInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary transition-all">
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]"
                >
                  {suggestions.map((asset) => (
                    <button
                      key={asset.symbol}
                      onClick={() => {
                        setAssetInput(asset.symbol);
                        setSelectedSymbol(asset.tvSymbol);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-bold text-white">{asset.symbol}</span>
                        <span className="text-[10px] text-slate-500">{asset.name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase font-bold">{asset.category}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {['BTC', 'ETH', 'EURUSD', 'GOLD', 'NASDAQ'].map((asset) => (
              <button
                key={asset}
                onClick={() => {
                  setAssetInput(asset);
                  setSelectedSymbol(mapToTVSymbol(asset));
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase ${assetInput.toUpperCase() === asset ? 'bg-accent-primary text-slate-900' : 'text-slate-400 hover:text-white'}`}
              >
                {asset}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${selectedTimeframe === tf ? 'bg-accent-primary text-slate-900' : 'bg-white/5 text-slate-500 hover:text-white'}`}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Price</span>
              <span className="text-sm font-mono text-accent-primary flex items-center gap-2">
                {livePrice || '---'}
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </span>
            </div>
            <button 
              onClick={() => setIsAIInsightsOpen(!isAIInsightsOpen)}
              className={`p-2 rounded-xl border transition-all hidden md:block ${isAIInsightsOpen ? 'bg-accent-primary/10 border-accent-primary text-accent-primary' : 'bg-white/5 border-white/10 text-slate-500'}`}
            >
              <Brain className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Main Chart Area - Occupies 70-80% on desktop */}
        <section className={`flex-1 flex flex-col transition-all duration-300 ${isAIInsightsOpen ? 'md:mr-0' : ''}`}>
          <div className="flex-1 p-2 md:p-4">
            <TradingViewChart symbol={selectedSymbol} timeframe={selectedTimeframe} />
          </div>
          
          {/* Mobile Toggle Button */}
          <div className="md:hidden absolute bottom-4 right-4 z-50">
            <button 
              onClick={() => setIsAIInsightsOpen(!isAIInsightsOpen)}
              className="p-4 bg-accent-primary text-slate-900 rounded-full shadow-2xl"
            >
              <Brain className="w-6 h-6" />
            </button>
          </div>
        </section>

        {/* Right: AI Insights Panel - Collapsible */}
        <aside className={`
          ${isAIInsightsOpen ? 'w-full md:w-72 lg:w-80' : 'w-0'} 
          border-l border-white/10 bg-black/20 backdrop-blur-md transition-all duration-300 flex flex-col overflow-hidden
          absolute md:relative right-0 z-40 h-full md:h-auto
          ${!isAIInsightsOpen && 'invisible md:hidden'}
        `}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent-primary" />
              AI Insights
            </h2>
            <button onClick={() => setIsAIInsightsOpen(false)} className="p-1 hover:bg-white/10 rounded">
              <ChevronDown className="w-4 h-4 md:rotate-90" />
            </button>
          </div>
          
          <div className="p-6 space-y-8 overflow-y-auto no-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Market Trend</span>
                <span className={`text-sm font-black flex items-center gap-1 ${aiInsights.trend === 'Bullish' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {aiInsights.trend === 'Bullish' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {aiInsights.trend}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">AI Confidence</span>
                  <span className="text-accent-primary">{aiInsights.confidence}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${aiInsights.confidence}%` }}
                    className="h-full bg-accent-primary"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-accent-primary/10 to-transparent border border-accent-primary/20 text-center">
              <Zap className="w-8 h-8 text-accent-primary mx-auto mb-4" />
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">AI Signal</div>
              <div className="text-2xl font-black text-white tracking-tighter">{aiInsights.signal}</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-3 h-3 text-accent-primary" />
                Technical Analysis
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'RSI (14)', value: '64.2', status: 'Neutral' },
                  { label: 'MACD', value: '0.0042', status: 'Bullish' },
                  { label: 'Moving Avg', value: 'EMA 200', status: 'Above' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs text-slate-400">{item.label}</span>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">{item.value}</div>
                      <div className={`text-[10px] font-bold ${item.status === 'Bullish' ? 'text-emerald-500' : 'text-slate-500'}`}>{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-2">
                <Flame className="w-4 h-4" />
                Volatility Alert
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                AI detected unusual volume spikes in {assetInput.toUpperCase()}. Expect increased volatility over the next 4 hours.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default MarketsPage;

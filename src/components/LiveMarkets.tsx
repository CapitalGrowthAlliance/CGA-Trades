import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, TrendingUp, TrendingDown, Activity, DollarSign, BarChart2, X, Maximize2, Minimize2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';

// --- Types ---
interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  supply: number;
  sparkline: number[];
}

interface ForexData {
  pair: string;
  bid: number;
  ask: number;
  spread: number;
  change24h: number;
  sparkline: number[];
}

interface MarketSummary {
  totalMarketCap: number;
  btcDominance: number;
  fearGreed: number;
  volume24h: number;
  dxy: number;
}

// --- Mock Initial Data (will be updated by real data) ---
const INITIAL_CRYPTO: CryptoData[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 0, change1h: 0, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0, supply: 0, sparkline: [] },
  { symbol: 'ETH', name: 'Ethereum', price: 0, change1h: 0, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0, supply: 0, sparkline: [] },
  { symbol: 'BNB', name: 'BNB', price: 0, change1h: 0, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0, supply: 0, sparkline: [] },
  { symbol: 'SOL', name: 'Solana', price: 0, change1h: 0, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0, supply: 0, sparkline: [] },
  { symbol: 'XRP', name: 'XRP', price: 0, change1h: 0, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0, supply: 0, sparkline: [] },
  { symbol: 'ADA', name: 'Cardano', price: 0, change1h: 0, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0, supply: 0, sparkline: [] },
  { symbol: 'AVAX', name: 'Avalanche', price: 0, change1h: 0, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0, supply: 0, sparkline: [] },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0, change1h: 0, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0, supply: 0, sparkline: [] },
  { symbol: 'DOT', name: 'Polkadot', price: 0, change1h: 0, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0, supply: 0, sparkline: [] },
  { symbol: 'LINK', name: 'Chainlink', price: 0, change1h: 0, change24h: 0, change7d: 0, marketCap: 0, volume24h: 0, supply: 0, sparkline: [] },
];

const INITIAL_FOREX: ForexData[] = [
  { pair: 'EUR/USD', bid: 1.0850, ask: 1.0852, spread: 0.0002, change24h: 0.15, sparkline: [] },
  { pair: 'GBP/USD', bid: 1.2640, ask: 1.2643, spread: 0.0003, change24h: -0.22, sparkline: [] },
  { pair: 'USD/JPY', bid: 150.20, ask: 150.22, spread: 0.02, change24h: 0.45, sparkline: [] },
  { pair: 'USD/CHF', bid: 0.8820, ask: 0.8822, spread: 0.0002, change24h: -0.10, sparkline: [] },
  { pair: 'AUD/USD', bid: 0.6540, ask: 0.6542, spread: 0.0002, change24h: 0.30, sparkline: [] },
  { pair: 'USD/CAD', bid: 1.3520, ask: 1.3523, spread: 0.0003, change24h: -0.05, sparkline: [] },
  { pair: 'EUR/GBP', bid: 0.8580, ask: 0.8582, spread: 0.0002, change24h: 0.12, sparkline: [] },
  { pair: 'EUR/JPY', bid: 163.00, ask: 163.03, spread: 0.03, change24h: 0.55, sparkline: [] },
];

// --- Components ---

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length === 0) return <div className="w-20 h-8 bg-white/5 rounded animate-pulse"></div>;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 80;
    const y = 32 - ((val - min) / range) * 32;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="80" height="32" className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const FormatCurrency = ({ value, maximumSignificantDigits = 4 }: { value: number, maximumSignificantDigits?: number }) => {
  if (value === 0) return <span>$0.00</span>;
  
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: value < 1 ? maximumSignificantDigits : undefined,
    minimumFractionDigits: value >= 1 ? 2 : undefined,
    maximumFractionDigits: value >= 1 ? 2 : undefined,
  }).format(value);
  
  return <span>{formatted}</span>;
};

const FormatCompact = ({ value }: { value: number }) => {
  const formatted = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2
  }).format(value);
  return <span>${formatted}</span>;
};

const ChangeBadge = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  return (
    <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
};

export default function LiveMarkets() {
  const { t } = useTranslation();
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(INITIAL_CRYPTO);
  const [forexData, setForexData] = useState<ForexData[]>(INITIAL_FOREX);
  const [summary, setSummary] = useState<MarketSummary>({
    totalMarketCap: 2500000000000,
    btcDominance: 52.4,
    fearGreed: 72,
    volume24h: 85000000000,
    dxy: 103.85
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [cryptoFilter, setCryptoFilter] = useState<'all' | 'gainers' | 'losers' | 'trending'>('all');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const marketContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      marketContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (marketContainerRef.current) {
      observer.observe(marketContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch Crypto Data (CoinGecko for initial snapshot + sparklines)
  useEffect(() => {
    if (!isVisible) return;

    const fetchCryptoSnapshot = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch from CoinGecko');
        }

        const data = await response.json();
        
        const mappedData: CryptoData[] = (data as any[]).map((coin: any) => ({
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          change1h: coin.price_change_percentage_1h_in_currency || 0,
          change24h: coin.price_change_percentage_24h_in_currency || 0,
          change7d: coin.price_change_percentage_7d_in_currency || 0,
          marketCap: coin.market_cap,
          volume24h: coin.total_volume,
          supply: coin.circulating_supply,
          sparkline: coin.sparkline_in_7d?.price || []
        }));

        setCryptoData(mappedData);
      } catch (error) {
        console.error("Error fetching crypto snapshot:", error);
      }
    };

    fetchCryptoSnapshot();
    // Refresh snapshot every 5 minutes
    const interval = setInterval(fetchCryptoSnapshot, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Binance WebSocket for real-time crypto prices
  useEffect(() => {
    if (!isVisible) return;

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/!ticker@arr`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!Array.isArray(data)) return;

      // Create a map for faster lookup
      const tickerMap = new Map();
      data.forEach((ticker: any) => {
        if (ticker.s.endsWith('USDT')) {
          tickerMap.set(ticker.s.replace('USDT', ''), {
            price: parseFloat(ticker.c),
            change24h: parseFloat(ticker.P)
          });
        }
      });

      setCryptoData(prev => prev.map(coin => {
        const update = tickerMap.get(coin.symbol);
        if (update) {
          return { ...coin, price: update.price, change24h: update.change24h };
        }
        return coin;
      }));
    };

    return () => ws.close();
  }, [isVisible]);

  // Simulated Forex Updates (since free real-time forex WebSockets are rare)
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setForexData(prev => prev.map(pair => {
        const volatility = pair.bid * 0.0001;
        const change = (Math.random() - 0.5) * volatility;
        const newBid = pair.bid + change;
        const newAsk = newBid + pair.spread;
        
        // Simulate sparkline
        const sparkline = [...(pair.sparkline || Array(20).fill(pair.bid)), newBid].slice(-20);

        return {
          ...pair,
          bid: newBid,
          ask: newAsk,
          sparkline
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const filteredCrypto = useMemo(() => {
    let result = cryptoData.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (cryptoFilter === 'gainers') {
      result = result.filter(c => c.change24h > 0).sort((a, b) => b.change24h - a.change24h);
    } else if (cryptoFilter === 'losers') {
      result = result.filter(c => c.change24h < 0).sort((a, b) => a.change24h - b.change24h);
    } else if (cryptoFilter === 'trending') {
      // Just sort by volume for trending
      result = result.sort((a, b) => b.volume24h - a.volume24h);
    }

    return result;
  }, [cryptoData, searchQuery, cryptoFilter]);

  const filteredForex = useMemo(() => {
    return forexData.filter(f => 
      f.pair.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [forexData, searchQuery]);

  return (
    <section ref={marketContainerRef} className={`py-12 bg-bg-primary relative z-10 ${isFullscreen ? 'overflow-y-auto h-screen w-screen' : ''}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
        
        {/* Section Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">{t('markets.title', 'Live Markets')}</h2>
            <p className="text-text-secondary">{t('markets.subtitle', 'Real-time cryptocurrency and forex market data.')}</p>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="p-2 bg-bg-card border border-border-light rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Expand to Fullscreen"}
          >
            {isFullscreen ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Market Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-bg-card border border-border-light rounded-xl p-4 shadow-sm">
            <div className="text-text-muted text-xs font-medium mb-1 flex items-center gap-1">
              <BarChart2 className="w-3 h-3" /> {t('markets.crypto_market_cap', 'Crypto Market Cap')}
            </div>
            <div className="text-lg font-bold text-text-primary"><FormatCompact value={summary.totalMarketCap} /></div>
          </div>
          <div className="bg-bg-card border border-border-light rounded-xl p-4 shadow-sm">
            <div className="text-text-muted text-xs font-medium mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> {t('markets.btc_dominance', 'BTC Dominance')}
            </div>
            <div className="text-lg font-bold text-text-primary">{summary.btcDominance}%</div>
          </div>
          <div className="bg-bg-card border border-border-light rounded-xl p-4 shadow-sm">
            <div className="text-text-muted text-xs font-medium mb-1">{t('markets.fear_greed', 'Fear & Greed')}</div>
            <div className="text-lg font-bold text-emerald-400">{summary.fearGreed} ({t('markets.greed', 'Greed')})</div>
          </div>
          <div className="bg-bg-card border border-border-light rounded-xl p-4 shadow-sm">
            <div className="text-text-muted text-xs font-medium mb-1">{t('markets.volume_24h', '24h Volume')}</div>
            <div className="text-lg font-bold text-text-primary"><FormatCompact value={summary.volume24h} /></div>
          </div>
          <div className="bg-bg-card border border-border-light rounded-xl p-4 shadow-sm">
            <div className="text-text-muted text-xs font-medium mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> {t('markets.dxy_index', 'DXY Index')}
            </div>
            <div className="text-lg font-bold text-text-primary">{summary.dxy.toFixed(2)}</div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className={`bg-bg-card border border-border-light rounded-2xl shadow-xl overflow-hidden flex flex-col ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
          <Tabs defaultValue="crypto" className="w-full flex flex-col h-full">
            <div className="p-4 border-b border-border-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-secondary/50 shrink-0">
              <TabsList className="bg-bg-hover">
                <TabsTrigger value="crypto" className="data-[state=active]:bg-bg-card data-[state=active]:text-text-primary">{t('markets.cryptocurrency', 'Cryptocurrency')}</TabsTrigger>
                <TabsTrigger value="forex" className="data-[state=active]:bg-bg-card data-[state=active]:text-text-primary">{t('markets.forex', 'Forex')}</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-bg-primary p-1 rounded-lg border border-border-light">
                  <button 
                    onClick={() => setCryptoFilter('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${cryptoFilter === 'all' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    {t('markets.filter_all', 'All')}
                  </button>
                  <button 
                    onClick={() => setCryptoFilter('gainers')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${cryptoFilter === 'gainers' ? 'bg-bg-card text-emerald-400 shadow-sm' : 'text-text-secondary hover:text-emerald-400'}`}
                  >
                    {t('markets.filter_gainers', 'Gainers')}
                  </button>
                  <button 
                    onClick={() => setCryptoFilter('losers')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${cryptoFilter === 'losers' ? 'bg-bg-card text-rose-400 shadow-sm' : 'text-text-secondary hover:text-rose-400'}`}
                  >
                    {t('markets.filter_losers', 'Losers')}
                  </button>
                  <button 
                    onClick={() => setCryptoFilter('trending')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${cryptoFilter === 'trending' ? 'bg-bg-card text-accent-primary shadow-sm' : 'text-text-secondary hover:text-accent-primary'}`}
                  >
                    {t('markets.filter_trending', 'Trending')}
                  </button>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="text" 
                    placeholder={t('markets.search_placeholder', 'Search markets...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-bg-primary border border-border-light rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="crypto" className="m-0 flex-1 min-h-0 flex flex-col">
              <div className={`overflow-x-auto overflow-y-auto custom-scrollbar ${isFullscreen ? 'flex-1' : 'max-h-[500px]'}`}>
                <table className="w-full text-left border-collapse whitespace-nowrap relative">
                  <thead className="sticky top-0 z-20 bg-bg-secondary/95 backdrop-blur-sm shadow-sm">
                    <tr className="border-b border-border-light text-text-muted text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">{t('markets.asset', 'Asset')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('markets.price', 'Price')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('markets.1h', '1h %')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('markets.24h', '24h %')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('markets.7d', '7d %')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('markets.market_cap', 'Market Cap')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('markets.volume', 'Volume (24h)')}</th>
                      <th className="px-6 py-4 font-medium text-center">{t('markets.last_7_days', 'Last 7 Days')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {filteredCrypto.map((coin) => (
                      <tr 
                        key={coin.symbol} 
                        onClick={() => setSelectedAsset(`BINANCE:${coin.symbol}USDT`)}
                        className="hover:bg-bg-hover transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center text-xs font-bold text-text-primary border border-border-light">
                              {coin.symbol[0]}
                            </div>
                            <div>
                              <div className="font-bold text-text-primary group-hover:text-accent-primary transition-colors">{coin.name}</div>
                              <div className="text-xs text-text-muted">{coin.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-text-primary">
                          <FormatCurrency value={coin.price} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChangeBadge value={coin.change1h} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChangeBadge value={coin.change24h} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChangeBadge value={coin.change7d} />
                        </td>
                        <td className="px-6 py-4 text-right text-text-secondary text-sm">
                          <FormatCompact value={coin.marketCap} />
                        </td>
                        <td className="px-6 py-4 text-right text-text-secondary text-sm">
                          <FormatCompact value={coin.volume24h} />
                        </td>
                        <td className="px-6 py-4 flex justify-center">
                          <Sparkline data={coin.sparkline} color={coin.change7d >= 0 ? '#34d399' : '#fb7185'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="forex" className="m-0 flex-1 min-h-0 flex flex-col">
              <div className={`overflow-x-auto overflow-y-auto custom-scrollbar ${isFullscreen ? 'flex-1' : 'max-h-[500px]'}`}>
                <table className="w-full text-left border-collapse whitespace-nowrap relative">
                  <thead className="sticky top-0 z-20 bg-bg-secondary/95 backdrop-blur-sm shadow-sm">
                    <tr className="border-b border-border-light text-text-muted text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">{t('markets.pair', 'Pair')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('markets.bid', 'Bid')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('markets.ask', 'Ask')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('markets.spread', 'Spread')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('markets.24h', '24h %')}</th>
                      <th className="px-6 py-4 font-medium text-center">{t('markets.trend', 'Trend')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {filteredForex.map((pair) => (
                      <tr 
                        key={pair.pair} 
                        onClick={() => setSelectedAsset(`FX:${pair.pair.replace('/', '')}`)}
                        className="hover:bg-bg-hover transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-text-primary group-hover:text-accent-primary transition-colors">{pair.pair}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-text-primary">
                          {pair.bid.toFixed(4)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-text-primary">
                          {pair.ask.toFixed(4)}
                        </td>
                        <td className="px-6 py-4 text-right text-text-secondary">
                          {(pair.spread * 10000).toFixed(1)} {t('markets.pips', 'pips')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChangeBadge value={pair.change24h} />
                        </td>
                        <td className="px-6 py-4 flex justify-center">
                          <Sparkline data={pair.sparkline} color={pair.change24h >= 0 ? '#34d399' : '#fb7185'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Full Chart Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedAsset(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative bg-bg-card border border-border-light shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                isChartFullscreen 
                  ? 'w-screen h-screen max-w-none rounded-none' 
                  : 'w-full max-w-6xl h-[80vh] rounded-2xl'
              }`}
            >
              <div className="flex items-center justify-between p-4 border-b border-border-light bg-bg-secondary">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-text-primary">{selectedAsset.split(':')[1]}</h3>
                  <span className="px-2 py-1 rounded bg-bg-hover text-xs font-medium text-text-secondary">{selectedAsset.split(':')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsChartFullscreen(!isChartFullscreen)}
                    className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-bg-hover"
                    title={isChartFullscreen ? "Exit Fullscreen" : "Expand to Fullscreen"}
                  >
                    {isChartFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedAsset(null);
                      setIsChartFullscreen(false);
                    }}
                    className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-bg-hover"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full bg-[#131722]">
                {/* TradingView Widget */}
                <iframe
                  title="TradingView Chart"
                  src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${selectedAsset}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${selectedAsset}`}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

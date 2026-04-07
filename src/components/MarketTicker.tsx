import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const INITIAL_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: 67241.50, change: 2.41, history: [65000, 66000, 65500, 67000, 67241], logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', price: 3450.20, change: 1.20, history: [3300, 3400, 3350, 3420, 3450], logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032' },
  { symbol: 'SOL', name: 'Solana', type: 'crypto', price: 145.60, change: -0.50, history: [150, 148, 149, 146, 145.6], logo: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
  { symbol: 'BNB', name: 'BNB', type: 'crypto', price: 590.30, change: 0.80, history: [580, 585, 582, 588, 590], logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=032' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex', price: 1.0842, change: -0.14, history: [1.086, 1.085, 1.084, 1.085, 1.0842], logos: ['https://flagcdn.com/w40/eu.png', 'https://flagcdn.com/w40/us.png'] },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', type: 'forex', price: 1.2650, change: 0.20, history: [1.260, 1.262, 1.261, 1.264, 1.265], logos: ['https://flagcdn.com/w40/gb.png', 'https://flagcdn.com/w40/us.png'] },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', type: 'forex', price: 151.20, change: 0.35, history: [150.5, 150.8, 151.0, 150.9, 151.2], logos: ['https://flagcdn.com/w40/us.png', 'https://flagcdn.com/w40/jp.png'] },
  { symbol: 'XAU/USD', name: 'Gold / US Dollar', type: 'forex', price: 2340.50, change: 1.10, history: [2310, 2320, 2315, 2330, 2340.5], logos: ['https://cdn-icons-png.flaticon.com/512/272/272531.png', 'https://flagcdn.com/w40/us.png'] },
  { symbol: 'META', name: 'Facebook', type: 'stock', price: 505.40, change: 3.40, history: [490, 500, 495, 502, 505.4], logo: 'https://logo.clearbit.com/facebook.com' },
  { symbol: 'AMZN', name: 'Amazon', type: 'stock', price: 180.20, change: 0.90, history: [178, 179, 178.5, 179.5, 180.2], logo: 'https://logo.clearbit.com/amazon.com' },
  { symbol: 'NVDA', name: 'NVIDIA', type: 'stock', price: 890.50, change: 4.20, history: [850, 870, 860, 880, 890.5], logo: 'https://logo.clearbit.com/nvidia.com' },
  { symbol: 'AAPL', name: 'Apple', type: 'stock', price: 173.50, change: -0.80, history: [175, 174, 173, 174, 173.5], logo: 'https://logo.clearbit.com/apple.com' },
  { symbol: 'TSLA', name: 'Tesla', type: 'stock', price: 175.20, change: 2.10, history: [170, 172, 171, 174, 175.2], logo: 'https://logo.clearbit.com/tesla.com' },
];

const AssetIcon = React.memo(({ asset }: { asset: any }) => {
  const [error, setError] = useState(false);
  const [forexErrors, setForexErrors] = useState<boolean[]>([false, false]);
  
  if (asset.type === 'forex' && asset.logos) {
    return (
      <div className="flex items-center -space-x-2 shrink-0">
        {asset.logos.map((logo: string, i: number) => (
          <div key={i} className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center overflow-hidden z-[1]">
            {!forexErrors[i] ? (
              <img 
                src={logo} 
                alt="currency" 
                loading="lazy"
                className="w-full h-full object-cover" 
                onError={() => {
                  const newErrors = [...forexErrors];
                  newErrors[i] = true;
                  setForexErrors(newErrors);
                }}
              />
            ) : (
              <div className="w-full h-full bg-accent-primary/20 flex items-center justify-center text-[8px] font-bold">
                {asset.symbol.split('/')[i] || '?'}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!error && asset.logo && asset.logo.startsWith('http')) {
    return (
      <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0 p-1.5">
        <img src={asset.logo} alt={asset.symbol} loading="lazy" className="w-full h-full object-contain" onError={() => setError(true)} />
      </div>
    );
  }
  
  if (asset.logo && !asset.logo.startsWith('http')) {
    return (
      <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0 text-lg">
        {asset.logo}
      </div>
    );
  }

  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-emerald-500', 'bg-pink-500', 'bg-cyan-500'];
  const colorIndex = asset.symbol.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % colors.length;
  const colorClass = colors[colorIndex];
  
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${colorClass} bg-opacity-80 shrink-0`}>
      {asset.symbol.charAt(0)}
    </div>
  );
});

const Sparkline = React.memo(({ data, isPositive }: { data: number[], isPositive: boolean }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 48;
  const height = 18;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const color = isPositive ? '#10B981' : '#EF4444'; // emerald-500 or red-500

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
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
});

export default function MarketTicker() {
  const { theme } = useTheme();
  const [assets, setAssets] = useState(INITIAL_ASSETS);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        // Randomly update 30% of assets each tick
        if (Math.random() > 0.3) return asset;
        
        const volatility = asset.type === 'crypto' ? 0.002 : 0.0005;
        const changePercent = (Math.random() - 0.5) * volatility;
        const newPrice = asset.price * (1 + changePercent);
        const newHistory = [...asset.history.slice(1), newPrice];
        const newChange = asset.change + (changePercent * 100);
        
        return {
          ...asset,
          price: newPrice,
          history: newHistory,
          change: newChange
        };
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, type: string) => {
    if (type === 'forex' && price < 10) return price.toFixed(4);
    if (price < 1) return price.toFixed(4);
    if (price > 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return price.toFixed(2);
  };

  // Duplicate assets for infinite scroll
  const tickerItems = [...assets, ...assets];

  return (
    <div 
      className="w-full relative z-40 overflow-hidden h-[50px] md:h-[60px] flex items-center border-b transition-colors duration-300"
      style={{
        background: theme === 'dark' ? 'rgba(15,15,15,0.65)' : 'rgba(255,255,255,0.65)',
        backdropFilter: theme === 'dark' ? 'blur(12px)' : 'blur(10px)',
        WebkitBackdropFilter: theme === 'dark' ? 'blur(12px)' : 'blur(10px)',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
      }}
    >
      <div className="flex w-max">
        {assets.map((asset, index) => {
          const isPositive = asset.change >= 0;
          return (
            <div key={`${asset.symbol}-${index}`} className="flex items-center gap-4 px-6 border-r border-black/5 dark:border-white/5 shrink-0">
              <AssetIcon asset={asset} />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-text-primary">{asset.symbol}</span>
                  <span className="text-xs text-text-secondary hidden md:inline-block">{asset.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">
                    {asset.type === 'forex' ? '' : '$'}{formatPrice(asset.price, asset.type)}
                  </span>
                  <span className={`text-xs font-bold flex items-center ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(asset.change).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="ml-2 hidden sm:block">
                <Sparkline data={asset.history} isPositive={isPositive} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

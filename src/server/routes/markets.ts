import express from 'express';

const router = express.Router();

// Cache for market data
let cryptoCache: any = null;
let lastCryptoFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const INITIAL_CRYPTO = [
  'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'DOT', 'LINK'
];

router.get('/crypto', async (req, res) => {
  try {
    const now = Date.now();
    if (cryptoCache && (now - lastCryptoFetch < CACHE_DURATION)) {
      return res.json(cryptoCache);
    }

    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from CoinGecko');
    }

    const data = await response.json();
    
    const mappedData = (data as any[]).map((coin: any) => ({
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

    cryptoCache = mappedData;
    lastCryptoFetch = now;

    res.json(mappedData);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    // If cache exists, return stale data
    if (cryptoCache) {
      return res.json(cryptoCache);
    }
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

export default router;

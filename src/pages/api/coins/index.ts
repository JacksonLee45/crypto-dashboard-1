// pages/api/coins/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { fetchWithCache } from '../../../lib/redis';
import { rateLimiter } from '../../../lib/rateLimit';

type CoinData = {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  marketCapPercentage: number;
  volume: number;
  priceChange24h: number;
  image: string;
};

interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  market_cap_rank: number;
}

// Create a rate limiter that allows 30 requests per minute per IP
const limiter = rateLimiter({
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
  message: 'Rate limit exceeded. Please wait before making additional requests.'
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Apply rate limiting
  await limiter(req, res);
  
  try {
    const limit = Number(req.query.limit) || 100;
    
    const data = await fetchWithCache<CoinData[]>(
      `coins:markets:${limit}`,
      async () => {
        // Fetch coins data from CoinGecko
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: limit,
              page: 1,
              sparkline: false,
              price_change_percentage: '24h'
            }
          }
        );
        
        // Fetch global market data to get market cap percentages
        const globalResponse = await axios.get(
          'https://api.coingecko.com/api/v3/global'
        );
        
        const marketCapPercentages = globalResponse.data.data.market_cap_percentage;
        
        // Map and transform the data
        return response.data.map((coin: CoinGeckoMarketData, index: number) => ({
          id: coin.id,
          rank: index + 1,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          marketCap: coin.market_cap,
          marketCapPercentage: marketCapPercentages[coin.symbol.toLowerCase()] || 0,
          volume: coin.total_volume,
          priceChange24h: coin.price_change_percentage_24h || 0,
          image: coin.image
        }));
      },
      // Cache for 5 minutes (300 seconds)
      300
    );
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching coins data:', error);
    res.status(500).json({ error: 'Failed to fetch coins data' });
  }
}

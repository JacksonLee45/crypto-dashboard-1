// pages/api/coins/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { fetchWithCache } from '../../../lib/redis';

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        return response.data.map((coin: any, index: number) => ({
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

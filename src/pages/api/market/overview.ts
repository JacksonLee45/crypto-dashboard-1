// pages/api/market/overview.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { fetchWithCache } from '../../../lib/redis';

type MarketOverviewData = {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  activeCurrencies: number;
  marketCapChange: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await fetchWithCache<MarketOverviewData>(
      'market:overview',
      async () => {
        // Fetch global data from CoinGecko
        const globalDataResponse = await axios.get(
          'https://api.coingecko.com/api/v3/global'
        );
        
        const globalData = globalDataResponse.data.data;
        
        // Calculate BTC dominance
        const btcDominance = 
          (globalData.market_cap_percentage.btc || 0);
        
        return {
          totalMarketCap: globalData.total_market_cap.usd,
          totalVolume: globalData.total_volume.usd,
          btcDominance: btcDominance,
          activeCurrencies: globalData.active_cryptocurrencies,
          marketCapChange: globalData.market_cap_change_percentage_24h_usd
        };
      },
      // Cache for 5 minutes (300 seconds)
      300
    );
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching market overview data:', error);
    res.status(500).json({ error: 'Failed to fetch market overview data' });
  }
}

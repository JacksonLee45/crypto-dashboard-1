// pages/api/coins/[id]/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { fetchWithCache } from '../../../../lib/redis';
import { withApiMiddleware } from '../../../../lib/apiMiddleware';

type CoinDetailResponse = {
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
  description: string;
  marketCapRank: number;
  high24h: number;
  low24h: number;
  priceChangePercentage7d: number;
  priceChangePercentage30d: number;
  totalSupply: number | null;
  circulatingSupply: number;
  maxSupply: number | null;
  athPrice: number;
  athDate: string;
  atlPrice: number;
  atlDate: string;
  website: string;
  twitter: string | null;
  reddit: string | null;
  github: string | null;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid coin ID' });
    }

    const data = await fetchWithCache<CoinDetailResponse>(
      `coin:${id}:details`,
      async () => {
        // Fetch detailed coin data from CoinGecko
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`,
          {
            params: {
              localization: false,
              tickers: false,
              market_data: true,
              community_data: false,
              developer_data: false,
              sparkline: false
            }
          }
        );
        
        const coinData = response.data;
        
        // Extract and transform the data
        return {
          id: coinData.id,
          rank: coinData.market_cap_rank,
          name: coinData.name,
          symbol: coinData.symbol,
          price: coinData.market_data.current_price.usd,
          marketCap: coinData.market_data.market_cap.usd,
          volume: coinData.market_data.total_volume.usd,
          priceChange24h: coinData.market_data.price_change_percentage_24h || 0,
          image: coinData.image.large,
          description: coinData.description.en || '',
          marketCapRank: coinData.market_cap_rank,
          high24h: coinData.market_data.high_24h.usd,
          low24h: coinData.market_data.low_24h.usd,
          marketCapPercentage: coinData.market_data.market_cap_change_percentage_24h || 0,
          priceChangePercentage7d: coinData.market_data.price_change_percentage_7d || 0,
          priceChangePercentage30d: coinData.market_data.price_change_percentage_30d || 0,
          totalSupply: coinData.market_data.total_supply,
          circulatingSupply: coinData.market_data.circulating_supply,
          maxSupply: coinData.market_data.max_supply,
          athPrice: coinData.market_data.ath.usd,
          athDate: coinData.market_data.ath_date.usd,
          atlPrice: coinData.market_data.atl.usd,
          atlDate: coinData.market_data.atl_date.usd,
          website: coinData.links.homepage[0] || '',
          twitter: coinData.links.twitter_screen_name,
          reddit: coinData.links.subreddit_url,
          github: coinData.links.repos_url?.github?.[0] || null
        };
      },
      // Cache for 5 minutes (300 seconds)
      300
    );
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching coin details:', error);
    res.status(500).json({ error: 'Failed to fetch coin details' });
  }
}

// Apply rate limiting middleware with 20 requests per minute
export default withApiMiddleware(handler, {
  rateLimit: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
    message: 'Rate limit exceeded for coin detail API. Please try again later.'
  }
});

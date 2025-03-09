// pages/api/coins/[id]/history.ts
import type { NextApiRequest, NextApiResponse } from 'next'; 
import axios from 'axios'; 
import { fetchWithCache } from '../../../../lib/redis';

type PricePoint = {
  timestamp: number;
  price: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, range = '7d' } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid coin ID' });
    }

    const rangeValue = Array.isArray(range) ? range[0] : range;

    // Determine days and interval based on the requested range
    // For free API, we just specify days, no interval parameter
    let days: number;

    switch (rangeValue) {
      case '1d':
        days = 1;
        break;
      case '7d':
        days = 7;
        break;
      case '30d':
        days = 30;
        break;
      case '90d':
        days = 90;
        break;
      case '1y':
        days = 365;
        break;
      default:
        days = 7;
    }

    const data = await fetchWithCache<PricePoint[]>(
      `coin:${id}:history:${rangeValue}`,
      async () => {
        // Fetch price history from CoinGecko - No API key required for basic endpoints
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: days
              // No interval parameter for free API
            }
          }
        );

        // Map and transform the price data
        return response.data.prices.map((priceData: [number, number]) => ({
          timestamp: priceData[0],
          price: priceData[1]
        }));
      },
      // Cache duration based on range - longer cache to avoid rate limits
      rangeValue === '1d' ? 300 : 1800 // 5 minutes for 1d, 30 minutes for others
    );

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching price history:',
      error.response?.status,
      error.response?.data || error.message
    );

    // Return a more detailed error response
    res.status(500).json({
      error: 'Failed to fetch price history',
      details: error.response?.data || error.message
    });
  }
}

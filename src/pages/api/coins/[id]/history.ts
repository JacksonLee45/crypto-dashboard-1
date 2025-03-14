// pages/api/coins/[id]/history.ts
import type { NextApiRequest, NextApiResponse } from 'next'; 
import axios from 'axios'; 
import { fetchWithCache } from '../../../../lib/redis';
import { withApiMiddleware } from '../../../../lib/apiMiddleware';
import { API_CONFIG } from '../../../../config/api';

type PricePoint = {
  timestamp: number;
  price: number;
};

async function handler(
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

    // Choose cache duration based on data range
    const cacheDuration = 
      rangeValue === '1d' 
        ? API_CONFIG.cacheDuration.short 
        : API_CONFIG.cacheDuration.medium;

    const data = await fetchWithCache<PricePoint[]>(
      `coin:${id}:history:${rangeValue}`,
      async () => {
        // Fetch price history from CoinGecko
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: days
            }
          }
        );

        // Map and transform the price data
        return response.data.prices.map((priceData: [number, number]) => ({
          timestamp: priceData[0],
          price: priceData[1]
        }));
      },
      cacheDuration
    );

    res.status(200).json(data);
  } catch (error) {

    const typedError = error as Error & {
      response?: {
        status?: number;
        data?: unknown;
      }
    };

    console.error('Error fetching price history:',
      typedError.response?.status,
      typedError.response?.data || typedError.message
    );

    res.status(500).json({
      error: 'Failed to fetch price history',
      details: typedError.response?.data || typedError.message
    });
  }
}

// Apply rate limiting middleware
export default withApiMiddleware(handler, {
  rateLimit: API_CONFIG.rateLimit.standard
});

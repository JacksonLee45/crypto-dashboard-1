// pages/api/coins/[id]/history.ts
import type { NextApiRequest, NextApiResponse } from 'next'; import axios from 'axios'; import { fetchWithCache } from '../../../../lib/redis';

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
    let days: number;
    let interval: string;

    switch (rangeValue) {
      case '1d':
        days = 1;
        interval = 'hourly';
        break;
      case '7d':
        days = 7;
        interval = 'hourly';
        break;
      case '30d':
        days = 30;
        interval = 'daily';
        break;
      case '90d':
        days = 90;
        interval = 'daily';
        break;
      case '1y':
        days = 365;
        interval = 'daily';
        break;
      default:
        days = 7;
        interval = 'hourly';
    }

    // Get API key from environment variables
    const apiKey = process.env.COINGECKO_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'CoinGecko API key is missing' });
    }

    const data = await fetchWithCache<PricePoint[]>(
      `coin:${id}:history:${rangeValue}`,
      async () => {
        // Fetch price history from CoinGecko with API key
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: days,
              interval: interval,
              x_cg_demo_api_key: apiKey // Add API key to request
            },
            headers: {
              'x-cg-demo-api-key': apiKey // Some APIs require the key in headers instead
            }
          }
        );

        // Map and transform the price data
        return response.data.prices.map((priceData: [number, number]) => ({
          timestamp: priceData[0],
          price: priceData[1]
        }));
      },
      // Cache duration based on range
      rangeValue === '1d' ? 300 : 1800 // 5 minutes for 1d, 30 minutes for others
    );

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
}

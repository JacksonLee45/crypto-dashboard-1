// pages/api/market/overview.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { fetchWithCache } from '../../../lib/redis';
import { createLogger } from '../../../lib/logger';

type MarketOverviewData = {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  activeCurrencies: number;
  marketCapChange: number;
};

// Create a logger instance for this API route
const logger = createLogger('API:MarketOverview');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const startTime = performance.now();
  const requestId = req.headers['x-request-id'] as string || `req_${Date.now().toString(36)}`;

  // Log the incoming request
  logger.logRequest(req, { requestId });

  try {
    const data = await fetchWithCache<MarketOverviewData>(
      'market:overview',
      async () => {
        // Log the external API call
        logger.info('Fetching data from CoinGecko API', { 
          requestId, 
          endpoint: 'global' 
        });

        try {
          // Fetch global data from CoinGecko
          const globalDataResponse = await axios.get(
            'https://api.coingecko.com/api/v3/global'
          );
          
          const globalData = globalDataResponse.data.data;
          
          // Calculate BTC dominance
          const btcDominance = 
            (globalData.market_cap_percentage.btc || 0);
          
          // Log successful external API response
          logger.info('Received response from CoinGecko API', { 
            requestId,
            statusCode: globalDataResponse.status,
            dataSize: JSON.stringify(globalDataResponse.data).length
          });

          return {
            totalMarketCap: globalData.total_market_cap.usd,
            totalVolume: globalData.total_volume.usd,
            btcDominance: btcDominance,
            activeCurrencies: globalData.active_cryptocurrencies,
            marketCapChange: globalData.market_cap_change_percentage_24h_usd
          };
        } catch (error: any) {
          // Log error from external API
          logger.error('Error from CoinGecko API', {
            requestId,
            statusCode: error.response?.status,
            error: error.response?.data || error.message,
            stack: error.stack
          });
          throw error; // Re-throw to be caught by the outer try/catch
        }
      },
      // Cache for 5 minutes (300 seconds)
      300,
      // Pass the request ID for tracing through the cache
      requestId
    );
    
    const responseTime = Math.round(performance.now() - startTime);
    
    // Log the successful response
    logger.logResponse(200, responseTime, { 
      requestId,
      dataSize: JSON.stringify(data).length
    });
    
    res.status(200).json(data);
  } catch (error: any) {
    const responseTime = Math.round(performance.now() - startTime);
    const statusCode = 500;
    
    // Log the error response
    logger.error('Failed to fetch market overview data', {
      requestId,
      error: error.message,
      stack: error.stack,
      statusCode
    });
    
    // Log the response
    logger.logResponse(statusCode, responseTime, { 
      requestId,
      error: 'Failed to fetch market overview data'
    });
    
    res.status(statusCode).json({ error: 'Failed to fetch market overview data' });
  }
}

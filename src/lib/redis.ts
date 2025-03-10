import { Redis } from '@upstash/redis'
import { createLogger } from './logger';

// Initialize the Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Create a logger instance for Redis operations
const logger = createLogger('Redis');

// Generate a request ID for tracing
const generateRequestId = () => {
  return `req_${Math.random().toString(36).substring(2, 15)}`;
};

// Helper function to fetch data with caching 
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 60, // Default TTL of 60 seconds
  requestId?: string // Optional requestId for tracing
): Promise<T> {
  // Create a unique request ID if not provided
  const traceId = requestId || generateRequestId();

  // Try to get data from cache
  try {
    const startTime = performance.now();
    const cachedData = await redis.get(key);
    const cacheQueryTime = Math.round(performance.now() - startTime);

    // If data exists in cache, return it
    if (cachedData) {
      logger.logCacheHit(key, { 
        traceId, 
        queryTimeMs: cacheQueryTime,
        dataSize: JSON.stringify(cachedData).length
      });
      return cachedData as T;
    }

    // Log cache miss
    logger.logCacheMiss(key, { traceId, queryTimeMs: cacheQueryTime });

    // If not in cache, fetch fresh data
    logger.info(`Fetching fresh data for key: ${key}`, { traceId });
    const fetchStartTime = performance.now();
    
    try {
      const freshData = await fetchFn();
      const fetchTime = Math.round(performance.now() - fetchStartTime);
      
      // Log successful fetch
      logger.info(`Successfully fetched fresh data`, { 
        traceId,
        key,
        fetchTimeMs: fetchTime,
        dataSize: JSON.stringify(freshData).length 
      });

      // Store in cache with expiration
      try {
        const cacheSetStart = performance.now();
        await redis.set(key, freshData, { ex: ttl });
        const cacheSetTime = Math.round(performance.now() - cacheSetStart);
        
        logger.logCacheSet(key, ttl, { 
          traceId, 
          setTimeMs: cacheSetTime 
        });
      } catch (cacheError) {
        logger.error(`Failed to cache data for key: ${key}`, {
          traceId,
          error: cacheError instanceof Error ? cacheError.message : String(cacheError),
          stack: cacheError instanceof Error ? cacheError.stack : undefined
        });
        // Continue despite cache set failure
      }

      return freshData;
    } catch (fetchError) {
      logger.error(`Failed to fetch fresh data for key: ${key}`, {
        traceId,
        error: fetchError instanceof Error ? fetchError.message : String(fetchError),
        stack: fetchError instanceof Error ? fetchError.stack : undefined
      });
      throw fetchError; // Re-throw to propagate the error
    }
  } catch (error) {
    logger.error(`Cache operation failed for key: ${key}`, {
      traceId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // If there's any cache-related error, fall back to fetching fresh data
    logger.info(`Falling back to direct fetch for key: ${key}`, { traceId });
    return await fetchFn();
  }
}

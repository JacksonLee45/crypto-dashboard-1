import { Redis } from '@upstash/redis'

// Initialize the Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Helper function to fetch data with caching 
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 60 // Default TTL of 60 seconds
): Promise<T> {

  // Try to get data from cache
  const cachedData = await redis.get(key)

  // If data exists in cache, return it
  if (cachedData) {
    console.log(`Cache hit for key: ${key}`)
    return cachedData as T
  }

  // If not in cache, fetch fresh data
  console.log(`Cache miss for key: ${key}, fetching data...`)
  const freshData = await fetchFn()

  // Store in cache with expiration
  await redis.set(key, freshData, { ex: ttl })
  console.log(`Data cached with key: ${key} for ${ttl} seconds`)

  return freshData
}

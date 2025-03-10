// src/lib/rateLimit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { redis } from './redis';

export type RateLimitConfig = {
  maxRequests: number;  // Maximum number of requests allowed
  windowMs: number;     // Time window in milliseconds
  message?: string;     // Optional custom error message
};

/**
 * Creates a rate limiter middleware for Next.js API routes
 */
export function rateLimiter(config: RateLimitConfig) {
  return async function rateLimit(
    req: NextApiRequest,
    res: NextApiResponse,
    next?: () => Promise<void>
  ) {
    // Get IP address from request
    const ip = getIPAddress(req);
    
    // Skip rate limiting if IP cannot be determined
    if (!ip) {
      console.warn('Rate limiting skipped: Unable to determine IP address');
      return next ? await next() : null;
    }
    
    const key = `rate-limit:${ip}`;
    
    try {
      // Get current count and expiry time
      const [currentCount, ttl] = await Promise.all([
        redis.incr(key),                // Increment the counter
        redis.ttl(key)                  // Get remaining TTL
      ]);

      // If this is the first request, set expiry
      if (currentCount === 1) {
        await redis.expire(key, Math.floor(config.windowMs / 1000));
      }
      
      // Set rate limit headers for transparency
      const windowSeconds = Math.max(1, ttl);
      const resetTime = new Date(Date.now() + windowSeconds * 1000);
      
      res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, config.maxRequests - currentCount).toString());
      res.setHeader('X-RateLimit-Reset', resetTime.toISOString());
      
      // If limit is exceeded, return error
      if (currentCount > config.maxRequests) {
        return res.status(429).json({
          error: config.message || 'Too many requests, please try again later.',
          retryAfter: windowSeconds
        });
      }
      
      // Continue to the next middleware or API handler
      return next ? await next() : null;
      
    } catch (error) {
      // If rate limiting fails, log and continue
      console.error('Rate limiting error:', error);
      return next ? await next() : null;
    }
  };
}

/**
 * Extracts the client IP address from the request
 */
function getIPAddress(req: NextApiRequest): string | null {
  // For proxies, prioritize X-Forwarded-For
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // X-Forwarded-For may contain multiple IPs, take the first one
    const forwardedIps = Array.isArray(forwarded) 
      ? forwarded[0] 
      : forwarded.split(',')[0].trim();
    
    return forwardedIps || null;
  }
  
  // For direct connections
  return req.socket.remoteAddress || null;
}

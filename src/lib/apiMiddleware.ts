// src/lib/apiMiddleware.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimiter, RateLimitConfig } from './rateLimit';

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

type MiddlewareOptions = {
  rateLimit?: RateLimitConfig;
};

export function withApiMiddleware(
  handler: ApiHandler,
  options: MiddlewareOptions = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Apply rate limiting if configured
    if (options.rateLimit) {
      const limiter = rateLimiter(options.rateLimit);
      
      // Create a promise-based next function
      const next = () => new Promise<void>((resolve) => {
        resolve();
      });
      
      // Apply rate limiting and proceed only if it passes
      await limiter(req, res, next);
      
      // If rate limit was exceeded, the response will already be sent
      if (res.writableEnded) {
        return;
      }
    }
    
    // Call the original handler
    return handler(req, res);
  };
}

// Example usage:
/*
export default withApiMiddleware(
  async function handler(req, res) {
    // Your API logic here
  },
  {
    rateLimit: {
      maxRequests: 30,
      windowMs: 60 * 1000, // 1 minute
    }
  }
);
*/

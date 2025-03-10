// src/config/api.ts

/**
 * Global API configuration settings
 */
 export const API_CONFIG = {
    /**
     * Rate limiting configuration
     */
    rateLimit: {
      /**
       * Standard rate limit for general API endpoints
       */
      standard: {
        maxRequests: 30,
        windowMs: 60 * 1000, // 1 minute
        message: 'Too many requests, please try again later.'
      },
      
      /**
       * Lower rate limit for resource-intensive endpoints
       */
      restricted: {
        maxRequests: 10,
        windowMs: 60 * 1000, // 1 minute
        message: 'Rate limit exceeded for resource-intensive operation. Please try again later.'
      },
      
      /**
       * Higher rate limit for simple endpoints
       */
      relaxed: {
        maxRequests: 60,
        windowMs: 60 * 1000, // 1 minute
        message: 'Rate limit exceeded. Please try again later.'
      }
    },
    
    /**
     * Cache duration configuration (in seconds)
     */
    cacheDuration: {
      short: 60,        // 1 minute
      medium: 300,       // 5 minutes
      long: 1800,        // 30 minutes
      veryLong: 3600 * 6 // 6 hours
    }
  };
  
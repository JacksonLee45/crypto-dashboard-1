// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from './lib/logger';

const logger = createLogger('Middleware');

export default function middleware(request: NextRequest) {
  // Generate a unique request ID if not present
  const requestId = request.headers.get('x-request-id') || `req_${uuidv4()}`;
  
  // Get the URL path without query parameters
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Log only API requests to avoid excessive logging
  if (path.startsWith('/api/')) {
    logger.info(`Incoming request to ${path}`, {
      method: request.method,
      path,
      query: Object.fromEntries(url.searchParams.entries()),
      requestId,
    });
  }

  // Clone the headers to add our request ID
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);

  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

// Configure which paths should use the middleware
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
  ],
};

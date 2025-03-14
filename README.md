# Crypto Dashboard

A comprehensive cryptocurrency dashboard featuring real-time market data, interactive visualizations, and a robust API layer with advanced caching strategies.

Checkout the deployed site!
- [Crypto Dashboard Preview](https://crypto-dashboard-eta-woad.vercel.app/)

## 🌟 Features

- **Advanced API Infrastructure**
  - Redis-powered caching system with TTL-based cache invalidation
  - IP-based rate limiting to prevent API abuse
  - Request tracing with unique IDs for debugging and monitoring
  - Comprehensive security headers (CSP, HSTS, X-Content-Type-Options)
  - Structured error handling and logging

- **Real-time Cryptocurrency Data**
  - Market overview with key metrics
  - Price charts with multiple timeframes
  - Market dominance visualization
  - Detailed coin information and statistics
  - Trading volume analysis

- **Responsive UI & Data Visualization**
  - Interactive charts powered by Recharts
  - Responsive design for all device sizes
  - Optimized data loading states
  - Client-side caching with React Query

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Next.js 15** for server-side rendering and routing
- **React Query** for data fetching, caching, and state management
- **Recharts** for interactive data visualization
- **Tailwind CSS** with shadcn/ui components for styling

### Backend & Infrastructure
- **Next.js API Routes** for serverless API endpoints
- **Redis** (Upstash) for distributed caching
- **API middlewares** for rate limiting, logging, and security
- **CoinGecko API** integration for cryptocurrency data
- **TypeScript** for type safety throughout the codebase

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- [Optional] Upstash Redis account for caching

### Installation

1. Clone the repository
```bash
git clone https://github.com/JacksonLee45/crypto-dashboard-1.git
cd crypto-dashboard
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory and add:
```
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## 🏗️ Architecture

### API Layer Architecture

The application follows a multi-layered API architecture:

1. **Client Request** → Enters the application 2. **Middleware Layer**
   - Request parsing and validation
   - IP-based rate limiting
   - Request ID generation and propagation
   - Security headers application
3. **API Route Handler**
   - Cache check and retrieval
   - External API calls (if needed)
   - Data transformation and normalization
   - Response formatting
4. **Cache Management Layer**
   - TTL-based cache strategies
   - Fallback mechanisms
   - Background refresh patterns

### Caching Strategy

The application employs a sophisticated caching strategy:

- **Short-lived cache** (60s) for volatile data like current prices
- **Medium-lived cache** (5min) for market overviews and listings
- **Long-lived cache** (30min) for historical data and infrequently changing information
- **Very long-lived cache** (6h) for static content like coin descriptions

Each cache strategy is implemented with appropriate TTL values and includes:
- Automatic cache invalidation
- Graceful handling of cache misses
- Request tracing through cache operations

### Rate Limiting Implementation

All API endpoints are protected by a Redis-based rate limiting system:
- IP address tracking for identifying clients
- Sliding window algorithm for accurate tracking
- Different rate limits based on endpoint resource requirements
- Clear rate limit headers for client feedback

## 📚 API Documentation

### Endpoints

#### Market Overview
```
GET /api/market/overview
```
Returns global cryptocurrency market stats including total market cap, 24h volume, and BTC dominance.

#### Top Cryptocurrencies
```
GET /api/coins?limit=100
```
Returns a list of top cryptocurrencies with price, volume, and market cap data.

#### Coin Details
```
GET /api/coins/{id}
```
Returns detailed information about a specific cryptocurrency.

#### Price History
```
GET /api/coins/{id}/history?range=7d
```
Returns historical price data for a specific cryptocurrency.
Available ranges: `1d`, `7d`, `30d`, `90d`, `1y`

## 📈 Performance Optimizations

- **Server-side rendering** for initial page load performance
- **Incremental Static Regeneration** for static content
- **Multi-tiered caching** (Redis + React Query) to minimize API calls
- **Optimized image loading** with Next.js Image component
- **Efficient re-renders** with React memo and callback optimizations

## 🔒 Security Features

- **Content Security Policy** to prevent XSS attacks
- **Strict Transport Security** to enforce HTTPS
- **X-Content-Type-Options** to prevent MIME type sniffing
- **X-Frame-Options** to prevent clickjacking
- **Permissions Policy** to limit browser features

## 💡 Future Enhancements

- User authentication and personalized dashboards
- WebSocket integration for real-time price updates
- Price alerts and notifications system
- Integration with additional data sources
- Advanced analytics and portfolio tracking
- Dark mode with persistent user preferences

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Upstash](https://upstash.com/) for Redis caching
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/en-US/) for data visualization

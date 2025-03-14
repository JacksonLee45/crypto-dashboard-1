// pages/about.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen font-heading bg-gray-50">
      <Head>
        <title>About - Crypto Dashboard</title>
        <meta name="description" content="About the Crypto Dashboard project and tech stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold font-heading text-gray-800">
            <Link href="/" className="hover:text-blue-600">
              Crypto Dashboard
            </Link>
            <span className='text-sm font-normal text-gray-500'> by Jackson Lee</span>
          </h1>
          <Link href="/" className="text-blue-600 font-heading hover:text-blue-800">
            Return to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl text-black">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-heading font-bold mb-6">About This Project</h2>

          <section className="mb-8">
            <h3 className="text-2xl font-heading font-semibold mb-4">Project Overview</h3>
            <p className="mb-4">
              This Crypto Dashboard is a comprehensive full-stack application that showcases advanced API development
              and data handling techniques. The project focuses on creating robust, scalable API endpoints with
              sophisticated caching mechanisms powered by Redis to ensure optimal performance and reliability.
            </p>
            <p className="mb-4">
              The application implements several enterprise-level backend features, including IP-based rate limiting
              to prevent API abuse, granular request logging with trace IDs for debugging, and comprehensive
              security headers to protect against common web vulnerabilities.
            </p>
            <p>
              On the frontend, the dashboard presents real-time cryptocurrency data through responsive,
              interactive data visualizations, demonstrating how efficient backend systems can
              power seamless user experiences even with frequent data updates.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-heading font-semibold mb-4">Tech Stack</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-bold mb-2">Frontend</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>React with TypeScript</li>
                  <li>Next.js for server-side rendering</li>
                  <li>React Query for data fetching</li>
                  <li>Recharts for data visualization</li>
                  <li>Tailwind CSS with shadcn/ui components</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-bold mb-2">Backend</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Next.js API routes with middleware</li>
                  <li>Redis (Upstash) for distributed caching</li>
                  <li>IP-based rate limiting</li>
                  <li>Request tracing with unique IDs</li>
                  <li>CoinGecko API integration</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-heading font-semibold mb-4">Advanced API Features</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold">Redis Caching Strategy</h4>
                <p className="mb-2">
                  The application implements a sophisticated multi-level caching system using Redis to minimize
                  external API calls while ensuring data freshness. Different cache durations are applied based on:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                  <li>Data volatility (e.g., shorter TTL for price data, longer for static information)</li>
                  <li>Endpoint popularity (frequently accessed data has optimized caching)</li>
                  <li>Resource intensity (heavy computations benefit from longer cache periods)</li>
                </ul>
                <p>
                  The caching layer includes fallback mechanisms for cache misses and automatic
                  refresh strategies to provide a seamless user experience.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold">API Rate Limiting</h4>
                <p>
                  All API endpoints are protected by IP-based rate limiting to prevent abuse and ensure fair
                  usage. The system implements a sliding window algorithm with Redis to track request counts
                  per client, with different rate limits applied to various endpoints based on their resource
                  requirements. Appropriate HTTP headers are returned to inform clients about their rate limit
                  status and reset times.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold">Request Logging and Tracing</h4>
                <p>
                  A comprehensive logging system is implemented with unique request IDs that flow through
                  the entire request lifecycle, from middleware to API handlers to cache operations. This
                  enables precise debugging and performance monitoring across distributed systems. Log entries
                  include request metadata, performance metrics, and error details when applicable.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold">Security Headers</h4>
                <p>
                  The application implements industry-standard security headers through middleware, including
                  Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, and Strict-Transport-Security.
                  These measures protect against common web vulnerabilities such as XSS attacks, clickjacking,
                  and content sniffing.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-heading font-semibold mb-4">Architecture Highlights</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold">API Middleware Pipeline</h4>
                <p>
                  The application uses a flexible middleware pipeline that can be composed for different API
                  endpoints. This includes request validation, authentication (for future expansion), rate limiting,
                  and logging, creating a clean separation of concerns in the API layer.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold">Error Handling Strategy</h4>
                <p>
                  Comprehensive error handling is implemented throughout the API, with consistent error responses,
                  appropriate status codes, and detailed error information for debugging without exposing sensitive
                  details. External API failures are gracefully handled with fallback mechanisms where possible.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold">Data Transformation Layer</h4>
                <p>
                  The API includes a dedicated transformation layer that normalizes data from external sources,
                  ensuring consistent response formats regardless of upstream changes and preparing data for
                  efficient frontend rendering.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-heading font-semibold mb-4">Key Technical Decisions</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold">Next.js API Routes</h4>
                <p>
                  Next.js API routes were chosen to create a seamless full-stack application without the need
                  for separate backend services, simplifying deployment while maintaining robust API capabilities.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold">Redis with Upstash</h4>
                <p>
                  Upstash&apos;s serverless Redis solution provides a scalable, maintenance-free caching layer
                  that integrates perfectly with serverless architectures, offering persistence, low latency,
                  and cost efficiency without operational overhead.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold">React Query</h4>
                <p>
                  React Query was selected for its sophisticated client-side caching, background data fetching,
                  and stale-while-revalidate patterns, creating a responsive UI that remains in sync with
                  server-side data while minimizing unnecessary API calls.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold">TypeScript</h4>
                <p>
                  TypeScript ensures type safety throughout the codebase, providing better developer experience
                  and catching potential errors at compile time, especially important when working with complex
                  data structures from external APIs.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-heading font-semibold mb-4">Learning Outcomes</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Designing effective caching strategies with TTL-based invalidation</li>
              <li>Implementing robust API rate limiting in serverless environments</li>
              <li>Creating request tracing systems across distributed operations</li>
              <li>Building responsive data visualizations with optimized data flows</li>
              <li>Handling error states and fallbacks in real-time data applications</li>
              <li>Managing complex application state with React Query</li>
              <li>Implementing security best practices in Next.js applications</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-heading font-semibold mb-4">Future Enhancements</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Authentication system with user-specific rate limits</li>
              <li>WebSocket integration for real-time price updates</li>
              <li>Advanced analytics with time-series data processing</li>
              <li>Webhook capabilities for price alerts and notifications</li>
              <li>Integration with additional cryptocurrency data sources</li>
              <li>Expanded metrics and logging with visualization dashboards</li>
              <li>Dark mode with persistent user preferences</li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Crypto Dashboard. Built with Next.js, Redis, and CoinGecko API.</p>
          <p className="mt-2">This is a portfolio project and not intended for financial advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;

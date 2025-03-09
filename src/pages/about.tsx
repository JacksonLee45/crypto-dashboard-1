// pages/about.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>About - Crypto Dashboard</title>
        <meta name="description" content="About the Crypto Dashboard project and tech stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            <Link href="/" className="hover:text-blue-600">
              Crypto Dashboard
            </Link>
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-6">About This Project</h2>
          
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Project Overview</h3>
            <p className="mb-4">
              This Crypto Dashboard is a portfolio project designed to demonstrate full-stack development 
              skills using modern web technologies. It provides real-time cryptocurrency data, visualizations, 
              and market insights in an interactive dashboard.
            </p>
            <p>
              The application fetches data from cryptocurrency APIs, implements efficient caching strategies, 
              and renders dynamic data visualizations, all within a responsive user interface.
            </p>
          </section>
          
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Tech Stack</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-bold mb-2">Frontend</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>React with TypeScript</li>
                  <li>Next.js for server-side rendering</li>
                  <li>React Query for data fetching</li>
                  <li>Recharts for data visualization</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Shadcn UI component library</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-bold mb-2">Backend</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Next.js API routes for serverless functions</li>
                  <li>Redis (Upstash) for caching</li>
                  <li>CoinGecko API for cryptocurrency data</li>
                  <li>Axios for API requests</li>
                  <li>Vercel for hosting and deployment</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Technical Decisions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold">Why Next.js?</h4>
                <p>
                  Next.js provides server-side rendering for better SEO and initial page load performance,
                  API routes that eliminate the need for a separate backend server, and seamless deployment
                  on Vercel.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold">Why Redis?</h4>
                <p>
                  Redis caching significantly reduces the number of API calls to CoinGecko, improving 
                  application performance and ensuring compliance with API rate limits. Upstash's serverless 
                  Redis solution integrates perfectly with Next.js and Vercel.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold">Why React Query?</h4>
                <p>
                  React Query simplifies data fetching, provides built-in caching, background updates, 
                  and automatic refetching, making it ideal for real-time data that needs to stay fresh.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold">Why Tailwind CSS?</h4>
                <p>
                  Tailwind CSS enables rapid UI development with utility classes, maintains consistency
                  across components, and optimizes production builds by purging unused styles.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Learning Outcomes</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Implementing efficient API caching strategies with Redis</li>
              <li>Building responsive data visualizations with Recharts</li>
              <li>Creating serverless API endpoints with Next.js</li>
              <li>Managing complex application state with React Query</li>
              <li>Deploying a full-stack application on Vercel</li>
              <li>Working with external APIs and handling rate limiting</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-2xl font-semibold mb-4">Future Enhancements</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>User authentication for personalized portfolios</li>
              <li>Price alerts and notifications</li>
              <li>Historical data analysis and trend prediction</li>
              <li>Integration with additional data sources</li>
              <li>Dark mode toggle</li>
              <li>Mobile app version with React Native</li>
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

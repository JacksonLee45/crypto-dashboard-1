// pages/index.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MarketOverview from '../components/MarketOverview'; 
import TopCoinsTable from '../components/TopCoinsTable'; 
import PriceChart from '../components/PriceChart'; 
import MarketDominance from '../components/MarketDominance'; 
import VolumeChart from '../components/VolumeChart'; 
import NewsFeed from '../components/NewsFeed'; 
import { useMarketOverview } from '../hooks/useMarketOverview'; 
import { useTopCoins } from '../hooks/useTopCoins'; 
import { usePriceData, TimeRange } from '../hooks/usePriceData';
import { useQueryClient } from '@tanstack/react-query';

const Dashboard: React.FC = () => {
  // Get the query client instance
  const queryClient = useQueryClient();
  
  // State for timeframe selection
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  
  // Fetch market overview data
  const {
    data: marketData,
    isLoading: marketLoading
  } = useMarketOverview();

  // Fetch top coins data
  const {
    data: coinsData,
    isLoading: coinsLoading
  } = useTopCoins();

  // Fetch price data for the default coin (Bitcoin) with the selected time range
  const {
    data: priceData,
    isLoading: priceLoading
  } = usePriceData('bitcoin', timeRange);

  // Mock data for market dominance
  const dominanceData = Array.isArray(coinsData)
    ? coinsData.slice(0, 5).map(coin => ({
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        value: coin.marketCapPercentage || 0,
        color: getRandomColor(coin.id),
      }))
    : [];

  // Function to generate consistent colors based on coin ID
  function getRandomColor(id: string) {
    const colors = [
      '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF',
      '#4BC0C0', '#C084FC', '#FF6666', '#63B3ED', '#F687B3'
    ];

    // Use a simple hash function to pick a color
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  // Handle timeframe change
  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    // Prefetch the data for the new time range to reduce perceived loading time
    queryClient.prefetchQuery({
      queryKey: ['priceData', 'bitcoin', newTimeRange],
      queryFn: async () => {
        const response = await fetch(`/api/coins/bitcoin/history?range=${newTimeRange}`);
        return response.json();
      }
    });
    
    // Update the time range state
    setTimeRange(newTimeRange);
  };

  return (
    <div className="min-h-screen font-heading bg-gray-50">
      <Head>
        <title>Crypto Dashboard</title>
        <meta name="description" content="Real-time cryptocurrency dashboard with market data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold text-gray-800">
            Crypto Dashboard
            <span className='text-sm font-normal text-gray-500'> by Jackson Lee</span>
          </h1>
          <Link href="/about" className="text-blue-600 font-heading hover:text-blue-800">
            About This Project
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Market Overview Cards */}
        {marketData && (
          <MarketOverview
            totalMarketCap={marketData.totalMarketCap}
            totalVolume={marketData.totalVolume}
            btcDominance={marketData.btcDominance}
            activeCurrencies={marketData.activeCurrencies}
            marketCapChange={marketData.marketCapChange}
            isLoading={marketLoading}
          />
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 h-[410px]">
          {/* Main Price Chart - Takes 2/3 of the width on large screens */}
          <div className="lg:col-span-2 h-full">
            {priceData && (
              <PriceChart
                coinId="bitcoin"
                coinName="Bitcoin"
                priceData={priceData}
                isLoading={priceLoading}
                timeframe={timeRange}
                onTimeframeChange={handleTimeRangeChange}
              />
            )}
          </div>

          {/* Market Dominance Chart - Takes 1/3 of the width */}
          <div className='h-full'>
            <MarketDominance
              data={dominanceData}
              isLoading={coinsLoading}
            />
          </div>
        </div>

        {/* Top Coins Table */}
        <div className="mb-6">
          {/* Use the new paginated table component */}
          <TopCoinsTable
            coins={coinsData}
            isLoading={coinsLoading}
          />
        </div>

        {/* Additional Charts and News Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Volume Chart */}
          <div>
            <VolumeChart
              data={Array.isArray(coinsData)
                ? coinsData.slice(0, 8).map(coin => ({
                    name: coin.name,
                    symbol: coin.symbol.toUpperCase(),
                    volume: coin.volume,
                    color: getRandomColor(coin.id),
                  }))
                : []}
              isLoading={coinsLoading}
            />
          </div>

          {/* News Feed
          <div>
            <NewsFeed
              news={[]}
              isLoading={true}
            />
          </div> */}
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

export default Dashboard;

// pages/coins/[id].tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { PricePoint, TimeRange, usePriceData } from '@/hooks/usePriceData';
import { Coin } from '@/hooks/useTopCoins';

type CoinDetailProps = {
  initialCoinData: CoinDetail;
};

// Extended coin data type with additional fields
type CoinDetail = Coin & {
  description: string;
  marketCapRank: number;
  high24h: number;
  low24h: number;
  priceChangePercentage7d: number;
  priceChangePercentage30d: number;
  totalSupply: number | null;
  circulatingSupply: number;
  maxSupply: number | null;
  athPrice: number;
  athDate: string;
  atlPrice: number;
  atlDate: string;
  website: string;
  twitter: string | null;
  reddit: string | null;
  github: string | null;
};

const CoinDetailPage: React.FC<CoinDetailProps> = ({ initialCoinData }) => {
  const router = useRouter();
  const { id } = router.query;
  const coinId = typeof id === 'string' ? id : '';
  
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  
  // Fetch the latest price data
  const { 
    data: priceData, 
    isLoading: isPriceDataLoading 
  } = usePriceData(coinId, timeRange);
  
  // Fetch the latest coin data
  const { 
    data: coinData, 
    isLoading: isCoinDataLoading 
  } = useQuery<CoinDetail>({
    queryKey: ['coinDetail', coinId],
    queryFn: async () => {
      const response = await axios.get(`/api/coins/${coinId}`);
      return response.data;
    },
    initialData: initialCoinData,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Data is fresh for 30 seconds
  });

  // Format large numbers with appropriate suffixes
  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };
  
  const formatSupply = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return num.toLocaleString();
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    
    if (timeRange === '1d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '7d' || timeRange === '30d') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const formatPrice = (price: number) => {
    if (price > 1000) return `$${price.toLocaleString()}`;
    if (price > 1) return `$${price.toFixed(2)}`;
    if (price > 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(8)}`;
  };
  
  const calculatePriceChange = () => {
    if (!priceData || priceData.length < 2) return 0;
    const firstPrice = priceData[0].price;
    const lastPrice = priceData[priceData.length - 1].price;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };
  
  const priceChange = calculatePriceChange();
  const priceColor = priceChange >= 0 ? 'text-green-500' : 'text-red-500';
  const gradientColor = priceChange >= 0 ? '#10b981' : '#ef4444';
  
  // Create HTML from description with proper sanitization
  // Note: In a real app, you'd want to use a sanitizer like DOMPurify
  const createDescriptionMarkup = (description: string) => {
    return { __html: description };
  };
  
  return (
    <div className="min-h-screen font-heading bg-gray-50">
      <Head>
        <title>{coinData?.name || 'Loading...'} Price and Info | Crypto Dashboard</title>
        <meta 
          name="description" 
          content={`Current price, market data, and information about ${coinData?.name}`} 
        />
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
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isCoinDataLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Coin Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <img 
                  src={coinData?.image} 
                  alt={coinData?.name} 
                  className="w-12 h-12 mr-4" 
                />
                <div>
                  <h1 className="text-3xl font-bold">{coinData?.name}</h1>
                  <p className="text-gray-500">{coinData?.symbol.toUpperCase()}</p>
                </div>
                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full ml-4">
                  Rank #{coinData?.marketCapRank || coinData?.rank}
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-3xl font-bold">
                  {formatPrice(coinData?.price || 0)}
                </div>
                <div className={`flex items-center ${priceColor}`}>
                  {priceChange >= 0 ? '↑' : '↓'} 
                  {Math.abs(coinData?.priceChange24h || 0).toFixed(2)}% (24h)
                </div>
              </div>
            </div>
            
            {/* Price Chart */}
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{coinData?.name} Price Chart</CardTitle>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setTimeRange('1d')}
                    className={`px-3 py-1 text-sm rounded ${
                      timeRange === '1d' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                    }`}
                  >
                    24H
                  </button>
                  <button
                    onClick={() => setTimeRange('7d')}
                    className={`px-3 py-1 text-sm rounded ${
                      timeRange === '7d' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                    }`}
                  >
                    7D
                  </button>
                  <button
                    onClick={() => setTimeRange('30d')}
                    className={`px-3 py-1 text-sm rounded ${
                      timeRange === '30d' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                    }`}
                  >
                    30D
                  </button>
                  <button
                    onClick={() => setTimeRange('90d')}
                    className={`px-3 py-1 text-sm rounded ${
                      timeRange === '90d' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                    }`}
                  >
                    90D
                  </button>
                  <button
                    onClick={() => setTimeRange('1y')}
                    className={`px-3 py-1 text-sm rounded ${
                      timeRange === '1y' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                    }`}
                  >
                    1Y
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {isPriceDataLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={priceData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={formatDate} 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                        />
                        <YAxis 
                          dataKey="price" 
                          tickFormatter={formatPrice} 
                          tick={{ fontSize: 12 }}
                          domain={['auto', 'auto']}
                          tickMargin={10}
                        />
                        <Tooltip 
                          formatter={(value: number) => [formatPrice(value), 'Price']}
                          labelFormatter={(label: number) => new Date(label).toLocaleString()}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke={priceChange >= 0 ? '#10b981' : '#ef4444'} 
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Price Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Market Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Market Cap</p>
                      <p className="text-lg font-semibold">{formatNumber(coinData?.marketCap)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">24h Trading Volume</p>
                      <p className="text-lg font-semibold">{formatNumber(coinData?.volume)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">24h Low / 24h High</p>
                      <p className="text-lg font-semibold">
                        {formatPrice(coinData?.low24h || 0)} / {formatPrice(coinData?.high24h || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Market Cap Dominance</p>
                      <p className="text-lg font-semibold">
                        {(coinData?.marketCapPercentage || 0).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">7d Change</p>
                      <p className={`text-lg font-semibold ${coinData?.priceChangePercentage7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {(coinData?.priceChangePercentage7d || 0).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">30d Change</p>
                      <p className={`text-lg font-semibold ${coinData?.priceChangePercentage30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {(coinData?.priceChangePercentage30d || 0).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Supply Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-gray-500">Circulating Supply</p>
                        <p className="font-semibold">{formatSupply(coinData?.circulatingSupply)}</p>
                      </div>
                      {coinData?.maxSupply && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ 
                              width: `${(coinData.circulatingSupply / coinData.maxSupply) * 100}%` 
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-gray-500">Total Supply</p>
                        <p className="text-lg font-semibold">{formatSupply(coinData?.totalSupply)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Max Supply</p>
                        <p className="text-lg font-semibold">{formatSupply(coinData?.maxSupply)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">All-Time High</p>
                        <p className="text-lg font-semibold">
                          {formatPrice(coinData?.athPrice || 0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {coinData?.athDate && new Date(coinData.athDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">All-Time Low</p>
                        <p className="text-lg font-semibold">
                          {formatPrice(coinData?.atlPrice || 0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {coinData?.atlDate && new Date(coinData.atlDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* About & Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>About {coinData?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {coinData?.description ? (
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={createDescriptionMarkup(coinData.description)}
                      />
                    ) : (
                      <p className="text-gray-500">No description available.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {coinData?.website && (
                        <a 
                          href={coinData.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
                            />
                          </svg>
                          Website
                        </a>
                      )}
                      
                      {coinData?.twitter && (
                        <a 
                          href={`https://twitter.com/${coinData.twitter}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-400 hover:underline"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                          Twitter
                        </a>
                      )}
                      
                      {coinData?.reddit && (
                        <a 
                          href={coinData.reddit} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-orange-600 hover:underline"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z" />
                          </svg>
                          Reddit
                        </a>
                      )}
                      
                      {coinData?.github && (
                        <a 
                          href={coinData.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-800 hover:underline"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  
  try {
    // Fetch coin data server-side
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/coins/${id}`);
    
    return {
      props: {
        initialCoinData: response.data
      }
    };
  } catch (error) {
    console.error('Error fetching coin data:', error);
    
    return {
      notFound: true
    };
  }
};

export default CoinDetailPage;
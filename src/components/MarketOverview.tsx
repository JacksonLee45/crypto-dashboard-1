// components/MarketOverview.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type MarketOverviewProps = {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  activeCurrencies: number;
  marketCapChange: number;
  isLoading?: boolean;
};

const MarketOverview: React.FC<MarketOverviewProps> = ({
  totalMarketCap,
  totalVolume,
  btcDominance,
  activeCurrencies,
  marketCapChange,
  isLoading = false
}) => {
  // Format large numbers
  const formatLargeNumber = (num: number) => {
    if (num >= 1_000_000_000_000) return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  // Skeleton loader for cards
  const SkeletonCard = () => (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="">
          <CardTitle className="">Total Market Cap</CardTitle>
          <CardDescription className="">For all {activeCurrencies.toLocaleString()} active coins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLargeNumber(totalMarketCap)}</div>
          <div className={`text-sm ${marketCapChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {marketCapChange >= 0 ? '↑' : '↓'} {Math.abs(marketCapChange).toFixed(2)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-gray-500">24 Hour Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLargeNumber(totalVolume)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-gray-500">BTC Dominance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{btcDominance.toFixed(2)}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-gray-500">Active Currencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCurrencies.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;

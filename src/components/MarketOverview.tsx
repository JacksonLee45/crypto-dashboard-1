import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type MarketOverviewProps = {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  activeCurrencies: number;
  marketCapChange: number;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({
  totalMarketCap,
  totalVolume,
  btcDominance,
  activeCurrencies,
  marketCapChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Market Cap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalMarketCap.toLocaleString()}</div>
          <div className={`text-sm ${marketCapChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {marketCapChange >= 0 ? '↑' : '↓'} {Math.abs(marketCapChange).toFixed(2)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">24h Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">BTC Dominance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{btcDominance.toFixed(2)}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Active Currencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCurrencies.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;

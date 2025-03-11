import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeRange } from '@/hooks/usePriceData';

type PricePoint = {
  timestamp: number;
  price: number;
};

type PriceChartProps = {
  coinName: string;
  priceData: PricePoint[];
  isLoading: boolean;
  timeframe: TimeRange;
  onTimeframeChange: (timeframe: TimeRange) => void;
};

const PriceChart: React.FC<PriceChartProps> = ({ 
  coinName, 
  priceData, 
  isLoading,
  timeframe,
  onTimeframeChange
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    
    if (timeframe === '1d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '7d' || timeframe === '30d') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
    }
  };

  const formatPrice = (price: number) => {
    if (price > 1000) return `$${price.toLocaleString()}`;
    if (price > 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
  };

  const calculatePriceChange = () => {
    if (!priceData || priceData.length < 2) return 0;
    const firstPrice = priceData[0].price;
    const lastPrice = priceData[priceData.length - 1].price;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };

  const priceChange = calculatePriceChange();
  const priceColor = priceChange >= 0 ? '#10b981' : '#ef4444';

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{coinName} Price Chart</CardTitle>
        <div className="flex space-x-1">
          <button
            onClick={() => onTimeframeChange('1d')}
            className={`px-3 py-1 text-sm rounded cursor-pointer hover:bg-opacity-80 ${
              timeframe === '1d' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            24H
          </button>
          <button
            onClick={() => onTimeframeChange('7d')}
            className={`px-3 py-1 text-sm rounded cursor-pointer hover:bg-opacity-80 ${
              timeframe === '7d' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            7D
          </button>
          <button
            onClick={() => onTimeframeChange('30d')}
            className={`px-3 py-1 text-sm rounded cursor-pointer hover:bg-opacity-80 ${
              timeframe === '30d' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            30D
          </button>
          <button
            onClick={() => onTimeframeChange('90d')}
            className={`px-3 py-1 text-sm rounded cursor-pointer hover:bg-opacity-80 ${
              timeframe === '90d' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            90D
          </button>
          <button
            onClick={() => onTimeframeChange('1y')}
            className={`px-3 py-1 text-sm rounded cursor-pointer hover:bg-opacity-80 ${
              timeframe === '1y' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            1Y
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline mb-4">
          {priceData && priceData.length > 0 ? (
            <>
              <div className="text-3xl font-bold mr-3">
                {formatPrice(priceData[priceData.length - 1].price)}
              </div>
              <div className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
              </div>
            </>
          ) : (
            <div className="text-3xl font-bold text-gray-300">Loading...</div>
          )}
        </div>
        
        <div className="h-64 relative">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData || []}>
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
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={priceColor} 
                dot={false} 
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;

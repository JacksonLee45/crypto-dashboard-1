import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FearGreedIndexProps = {
  value: number;
  classification: string;
  timestamp: string;
  previousValue: number;
  previousClassification: string;
};

const FearGreedIndex: React.FC<FearGreedIndexProps> = ({
  value,
  classification,
  timestamp,
  previousValue,
  previousClassification
}) => {
  const getColor = (val: number) => {
    if (val <= 25) return '#FF4136'; // Extreme Fear - Red
    if (val <= 40) return '#FF851B'; // Fear - Orange
    if (val <= 60) return '#FFDC00'; // Neutral - Yellow
    if (val <= 75) return '#2ECC40'; // Greed - Green
    return '#B10DC9'; // Extreme Greed - Purple
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between">
          <span>Fear & Greed Index</span>
          <span className="text-sm text-gray-500">{new Date(timestamp).toLocaleDateString()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-end">
            <div className="text-4xl font-bold" style={{ color: getColor(value) }}>
              {value}
            </div>
            <div className="text-xl font-medium" style={{ color: getColor(value) }}>
              {classification}
            </div>
          </div>
          
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${value}%`, background: getColor(value) }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Extreme Fear</span>
            <span>Fear</span>
            <span>Neutral</span>
            <span>Greed</span>
            <span>Extreme Greed</span>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm">
              Yesterday: <span style={{ color: getColor(previousValue) }}>{previousValue} ({previousClassification})</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {value > previousValue ? '↑' : '↓'} {Math.abs(value - previousValue)} points from yesterday
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FearGreedIndex;

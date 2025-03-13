import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DominanceData = {
  name: string;
  symbol: string;
  value: number;
  color: string;
};

type MarketDominanceProps = {
  data: DominanceData[];
  isLoading: boolean;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4BC0C0', '#C084FC', '#FF6666'];

const MarketDominance: React.FC<MarketDominanceProps> = ({ data, isLoading }) => {
  const formatTooltip = (value: number) => [`${value.toFixed(2)}%`, 'Market Share'];

  // Calculate the total percentage represented by the provided data
  const totalPercentage = useMemo(() => {
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);

  // Create modified data with "Other" category to ensure total equals 100%
  const chartData = useMemo(() => {
    const dataWithOther = [...data];

    // Only add "Other" category if the total is less than 100%
    if (totalPercentage < 100) {
      dataWithOther.push({
        name: "Other",
        symbol: "OTHER",
        value: 100 - totalPercentage,
        color: "#808080" // Gray color for "Other" category
      });
    }

    return dataWithOther;
  }, [data, totalPercentage]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market Dominance</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="h-64 flex flex-col">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  innerRadius={40}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={false} // Remove the labels from the pie segments
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[9]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltip} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: 0, marginTop: 0 }}
                  formatter={(value, entry, index) => {
                    const item = chartData[index];
                    return (
                      <span className="text-sm">
                        {item.symbol} ({item.value.toFixed(1)}%)
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketDominance;

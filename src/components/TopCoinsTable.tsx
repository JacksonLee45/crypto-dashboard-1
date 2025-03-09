import React, { useState } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

type Coin = {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume: number;
  priceChange24h: number;
  image: string;
};

type TopCoinsTableProps = {
  coins: Coin[] | undefined;  // Make coins optional
  isLoading: boolean;
};

const TopCoinsTable: React.FC<TopCoinsTableProps> = ({ coins = [], isLoading }) => {  // Provide default empty array
  const [sortBy, setSortBy] = useState<keyof Coin>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof Coin) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Only sort if we have coins
  const sortedCoins = coins && coins.length > 0
    ? [...coins].sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        return sortDirection === 'asc'
          ? (valueA as number) - (valueB as number)
          : (valueB as number) - (valueA as number);
      })
    : [];

  const formatPrice = (price: number) => {
    if (price > 1000) return `$${price.toLocaleString()}`;
    if (price > 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatLargeNumber = (num: number) => {
    if (num > 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
    if (num > 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const renderSortIcon = (column: keyof Coin) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cryptocurrencies</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : sortedCoins.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No coin data available. Please try again later.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('rank')}
                  >
                    # {renderSortIcon('rank')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name {renderSortIcon('name')}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    Price {renderSortIcon('price')}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('priceChange24h')}
                  >
                    24h % {renderSortIcon('priceChange24h')}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort('marketCap')}
                  >
                    Market Cap {renderSortIcon('marketCap')}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden lg:table-cell"
                    onClick={() => handleSort('volume')}
                  >
                    Volume (24h) {renderSortIcon('volume')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCoins.map((coin) => (
                  <tr key={coin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coin.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/coins/${coin.id}`} className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="h-6 w-6 mr-2" />
                        <div className="font-medium text-gray-900">{coin.name}</div>
                        <div className="text-gray-500 ml-2">{coin.symbol.toUpperCase()}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {formatPrice(coin.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className={coin.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {coin.priceChange24h >= 0 ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right hidden md:table-cell">
                      {formatLargeNumber(coin.marketCap)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right hidden lg:table-cell">
                      {formatLargeNumber(coin.volume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopCoinsTable;

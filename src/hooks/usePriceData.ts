// hooks/usePriceData.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type PricePoint = {
  timestamp: number;
  price: number;
};

export type TimeRange = '1d' | '7d' | '30d' | '90d' | '1y';

export function usePriceData(coinId: string, range: TimeRange = '7d') {
  return useQuery<PricePoint[]>({
    queryKey: ['priceData', coinId, range],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/coins/${coinId}/history?range=${range}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching price data for ${coinId} with range ${range}:`, error);
        throw error;
      }
    },
    refetchInterval: range === '1d' ? 60000 : 300000, // Refetch every 60 seconds for 1d, less frequently for longer periods
    staleTime: range === '1d' ? 30000 : 60000, // Data is considered fresh based on range
    retry: 3, // If fetching fails, retry up to 3 times
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    placeholderData: (oldData) => oldData, // Use previous data while loading new data
  });
}


// hooks/useMarketOverview.ts
import { useQuery } from '@tanstack/react-query'; 
import axios from 'axios';

export type MarketOverviewData = {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  activeCurrencies: number;
  marketCapChange: number;
};

export function useMarketOverview() {
  return useQuery<MarketOverviewData>({
    queryKey: ['marketOverview'],
    queryFn: async () => {
      const response = await axios.get('/api/market/overview');
      return response.data;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Data is considered fresh for 30 seconds
    retry: 3, // If fetching fails, retry up to 3 times
    //keepPreviousData: true //Display cached data while refetching (note: renamed to placeholderData in newer versions) // TODO: uncomment this line and make it work
  });
}

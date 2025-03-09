// hooks/useTopCoins.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type Coin = {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  marketCapPercentage: number;
  volume: number;
  priceChange24h: number;
  image: string;
};

export function useTopCoins(limit = 100) {
  return useQuery<Coin[]>({
    queryKey: ['topCoins', limit],
    queryFn: async () => {
      const response = await axios.get(`/api/coins?limit=${limit}`);
      return response.data;
    },          
    refetchInterval: 60000,       // Refetch every 60 seconds    
    staleTime: 30000,             // Data is considered fresh for 30 seconds      
    retry: 3,                     // If fetching fails, retry up to 3 times
  });
}

export function usePaginatedCoins(page = 1, perPage = 25) {
  return useQuery<{coins: Coin[], totalCoins: number}>({
    queryKey: ['paginatedCoins', page, perPage],
    queryFn: async () => {
      const response = await axios.get(`/api/coins/paginated?page=${page}&perPage=${perPage}`);
      return response.data;
    },          
    refetchInterval: 60000,    
    staleTime: 30000,          
    retry: 3,
  });
}

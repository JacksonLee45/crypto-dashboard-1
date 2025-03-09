// context/CryptoContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useMarketOverview, MarketOverviewData } from '../hooks/useMarketOverview';

type Currency = 'usd' | 'eur' | 'btc' | 'eth';
type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y';

interface CryptoContextType {
  // Market data
  marketOverview: MarketOverviewData | undefined;
  isMarketLoading: boolean;
  
  // User preferences
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  
  // Other state you might need
  selectedCoinId: string | null;
  setSelectedCoinId: (id: string | null) => void;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function CryptoProvider({ children }: { children: ReactNode }) {
  // Fetch market data
  const { 
    data: marketOverview, 
    isLoading: isMarketLoading 
  } = useMarketOverview();
  
  // User preferences
  const [currency, setCurrency] = useState<Currency>('usd');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  
  const value = {
    // Market data
    marketOverview,
    isMarketLoading,
    
    // User preferences
    currency,
    setCurrency,
    timeRange,
    setTimeRange,
    
    // Other state
    selectedCoinId,
    setSelectedCoinId,
  };
  
  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
}

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}

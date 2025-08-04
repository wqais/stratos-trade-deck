import { useQuery } from '@tanstack/react-query';
import { MarketData, NewsItem } from '@shared/schema';

export function useMarketOverview() {
  return useQuery({
    queryKey: ['api', '/api/market/overview'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useSymbols() {
  return useQuery({
    queryKey: ['api', '/api/market/symbols'],
    staleTime: Infinity, // Symbols don't change often
  });
}

export function useMarketPrice(symbol: string) {
  return useQuery({
    queryKey: ['api', '/api/market/' + symbol + '/price'],
    enabled: !!symbol,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMarketHistory(symbol: string, days?: number) {
  return useQuery({
    queryKey: ['api', '/api/market/' + symbol + '/history', { days }],
    enabled: !!symbol,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMarketNews(date?: string) {
  return useQuery({
    queryKey: ['api', '/api/market/news', { date }],
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
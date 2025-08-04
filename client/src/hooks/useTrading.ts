import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { InsertOrder } from '@shared/schema';

export function usePortfolio() {
  return useQuery({
    queryKey: ['api', '/api/portfolio'],
  });
}

export function useHoldings() {
  return useQuery({
    queryKey: ['api', '/api/portfolio/holdings'],
  });
}

export function useOrders(status?: string) {
  return useQuery({
    queryKey: ['api', '/api/orders', { status }],
  });
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: (orderData: InsertOrder) =>
      apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['api', '/api/portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['api', '/api/portfolio/holdings'] });
      queryClient.invalidateQueries({ queryKey: ['api', '/api/orders'] });
    },
  });
}

export function useCancelOrder() {
  return useMutation({
    mutationFn: (orderId: number) =>
      apiRequest(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api', '/api/orders'] });
    },
  });
}
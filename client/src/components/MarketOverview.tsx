import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketOverview } from '@/hooks/useMarketData';

export function MarketOverview() {
  const { data: marketData, isLoading } = useMarketOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-300 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!marketData || !Array.isArray(marketData)) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No market data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {marketData.map((stock: any) => {
        const isPositive = (stock.change || 0) >= 0;
        
        return (
          <Card key={stock.symbol} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stock.symbol}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    ${stock.price?.toFixed(2) || '0.00'}
                  </div>
                  <div className={`flex items-center text-sm ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    <span>
                      {isPositive ? '+' : ''}{stock.change?.toFixed(2) || '0.00'} 
                      ({isPositive ? '+' : ''}{stock.changePercent?.toFixed(2) || '0.00'}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
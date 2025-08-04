import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Wallet, PieChart } from 'lucide-react';
import { usePortfolio, useHoldings } from '@/hooks/useTrading';

export function PortfolioSummary() {
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
  const { data: holdings, isLoading: holdingsLoading } = useHoldings();

  const isLoading = portfolioLoading || holdingsLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalValue = portfolio?.total_value ? parseFloat(portfolio.total_value) : 0;
  const cashBalance = portfolio?.cash_balance ? parseFloat(portfolio.cash_balance) : 0;
  const investedValue = totalValue - cashBalance;
  const dayChange = 0; // Would calculate from holdings data
  const dayChangePercent = totalValue > 0 ? (dayChange / totalValue) * 100 : 0;

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-blue-600',
    },
    {
      title: 'Cash Balance',
      value: `$${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Wallet,
      color: 'text-green-600',
    },
    {
      title: 'Invested Value',
      value: `$${investedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: PieChart,
      color: 'text-purple-600',
    },
    {
      title: 'Day Change',
      value: `${dayChange >= 0 ? '+' : ''}$${Math.abs(dayChange).toFixed(2)} (${dayChangePercent >= 0 ? '+' : ''}${dayChangePercent.toFixed(2)}%)`,
      icon: TrendingUp,
      color: dayChange >= 0 ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
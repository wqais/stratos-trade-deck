import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { usePortfolio, useOrders } from "@/hooks/useTrading"
import { useMarketOverview, useMarketNews } from "@/hooks/useMarketData"

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: portfolio } = usePortfolio();
  const { data: orders } = useOrders();
  const { data: marketData } = useMarketOverview();
  const { data: news } = useMarketNews();

  const portfolioValue = portfolio ? parseFloat(portfolio.total_value) : 0;
  const cashBalance = portfolio ? parseFloat(portfolio.cash_balance) : 0;
  const investedValue = portfolioValue - cashBalance;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trading Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.username}! Here's your portfolio overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => logout()}>
            Sign Out
          </Button>
          <Button variant="default" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Quick Trade
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="w-4 h-4 text-profit mr-1" />
              <span className="text-profit">
                $0.00 (0.00%)
              </span>
              <span className="text-muted-foreground ml-1">today</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${investedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">
                Cash: ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{orders?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {orders?.filter((o: any) => o.status === 'PENDING').length || 0} pending execution
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Status</CardTitle>
            <div className="w-2 h-2 bg-profit rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Open</div>
            <p className="text-xs text-muted-foreground">Closes in 4h 23m</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Watchlist */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Market Overview</CardTitle>
            <CardDescription>Real-time price data for key securities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketData && marketData.length > 0 ? marketData.map((stock: any) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-foreground">{stock.symbol}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-semibold text-foreground">
                      ${stock.price?.toFixed(2) || '0.00'}
                    </div>
                    <div className={`flex items-center gap-1 ${(stock.change || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {(stock.change || 0) >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {(stock.change || 0) >= 0 ? '+' : ''}{(stock.change || 0).toFixed(2)} ({(stock.changePercent || 0).toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Loading market data...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* News Feed */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Market News</CardTitle>
            <CardDescription>Latest financial news and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {news && news.length > 0 ? news.slice(0, 5).map((item: any, index: number) => (
                <div key={index} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      News
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.time_published).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground leading-tight mb-1">
                    {item.title}
                  </h4>
                  {item.summary && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.summary}
                    </p>
                  )}
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Loading market news...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Orders</CardTitle>
          <CardDescription>Your latest trading activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders && orders.length > 0 ? orders.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                <div className="flex items-center gap-4">
                  <Badge variant={order.order_type === 'BUY' ? 'default' : 'secondary'} className={order.order_type === 'BUY' ? 'bg-buy text-buy-foreground' : 'bg-sell text-sell-foreground'}>
                    {order.order_type}
                  </Badge>
                  <div>
                    <div className="font-semibold text-foreground">{order.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.quantity} shares @ {order.price_type}
                      {order.price && ` $${parseFloat(order.price).toFixed(2)}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={order.status === 'FILLED' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No recent orders</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react"

// Mock data for demonstration
const portfolioKPIs = {
  totalValue: 125340.50,
  dayChange: 1240.30,
  dayChangePercent: 0.99,
  totalReturn: 8450.20,
  totalReturnPercent: 7.24
}

const marketData = [
  { symbol: "AAPL", price: 174.50, change: 2.30, changePercent: 1.34, volume: "45.2M" },
  { symbol: "GOOGL", price: 2891.20, change: -12.80, changePercent: -0.44, volume: "28.1M" },
  { symbol: "MSFT", price: 348.10, change: 4.60, changePercent: 1.34, volume: "32.5M" },
  { symbol: "TSLA", price: 248.50, change: -5.20, changePercent: -2.05, volume: "67.8M" },
  { symbol: "NVDA", price: 445.90, change: 8.70, changePercent: 1.99, volume: "45.3M" },
]

const newsData = [
  {
    id: 1,
    headline: "Federal Reserve Holds Interest Rates Steady at 5.25-5.50%",
    summary: "The Federal Open Market Committee decided to maintain the federal funds rate at its current level...",
    time: "2 hours ago",
    category: "Economic"
  },
  {
    id: 2,
    headline: "Tech Stocks Rally as AI Spending Continues to Surge",
    summary: "Major technology companies see increased investment in artificial intelligence infrastructure...",
    time: "4 hours ago",
    category: "Technology"
  },
  {
    id: 3,
    headline: "Oil Prices Rise 3% on Middle East Supply Concerns",
    summary: "Crude oil futures climbed sharply following reports of potential supply disruptions...",
    time: "6 hours ago",
    category: "Energy"
  },
]

const recentOrders = [
  { symbol: "AAPL", type: "BUY", quantity: 100, price: 174.20, status: "Filled", time: "09:45 AM" },
  { symbol: "MSFT", type: "SELL", quantity: 50, price: 347.80, status: "Filled", time: "10:32 AM" },
  { symbol: "GOOGL", type: "BUY", quantity: 25, price: 2890.50, status: "Pending", time: "11:15 AM" },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trading Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your portfolio overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
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
              ${portfolioKPIs.totalValue.toLocaleString()}
            </div>
            <div className="flex items-center text-sm">
              {portfolioKPIs.dayChange > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-profit mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-loss mr-1" />
              )}
              <span className={portfolioKPIs.dayChange > 0 ? "text-profit" : "text-loss"}>
                ${Math.abs(portfolioKPIs.dayChange).toLocaleString()} ({portfolioKPIs.dayChangePercent}%)
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
              ${portfolioKPIs.totalReturn.toLocaleString()}
            </div>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="w-4 h-4 text-profit mr-1" />
              <span className="text-profit">
                +{portfolioKPIs.totalReturnPercent}%
              </span>
              <span className="text-muted-foreground ml-1">all time</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">3 pending execution</p>
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
              {marketData.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-foreground">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">Vol: {stock.volume}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-semibold text-foreground">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={`flex items-center gap-1 ${stock.change > 0 ? 'text-profit' : 'text-loss'}`}>
                      {stock.change > 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
              {newsData.map((news) => (
                <div key={news.id} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {news.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{news.time}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground leading-tight mb-1">
                    {news.headline}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {news.summary}
                  </p>
                </div>
              ))}
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
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                <div className="flex items-center gap-4">
                  <Badge variant={order.type === 'BUY' ? 'default' : 'secondary'} className={order.type === 'BUY' ? 'bg-buy text-buy-foreground' : 'bg-sell text-sell-foreground'}>
                    {order.type}
                  </Badge>
                  <div>
                    <div className="font-semibold text-foreground">{order.symbol}</div>
                    <div className="text-sm text-muted-foreground">{order.quantity} shares @ ${order.price}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={order.status === 'Filled' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">{order.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
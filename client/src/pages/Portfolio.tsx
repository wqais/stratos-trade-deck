import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, PieChart, BarChart3, Download, ArrowUpRight, ArrowDownRight } from "lucide-react"

// Mock portfolio data
const holdings = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 150,
    avgPrice: 168.50,
    currentPrice: 174.50,
    marketValue: 26175,
    unrealizedPL: 900,
    unrealizedPLPercent: 3.56,
    sector: "Technology"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 35,
    avgPrice: 2845.20,
    currentPrice: 2891.20,
    marketValue: 101192,
    unrealizedPL: 1610,
    unrealizedPLPercent: 1.62,
    sector: "Technology"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    quantity: 80,
    avgPrice: 342.10,
    currentPrice: 348.10,
    marketValue: 27848,
    unrealizedPL: 480,
    unrealizedPLPercent: 1.75,
    sector: "Technology"
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    quantity: 100,
    avgPrice: 255.80,
    currentPrice: 248.50,
    marketValue: 24850,
    unrealizedPL: -730,
    unrealizedPLPercent: -2.85,
    sector: "Automotive"
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    quantity: 75,
    avgPrice: 148.90,
    currentPrice: 152.30,
    marketValue: 11422.50,
    unrealizedPL: 255,
    unrealizedPLPercent: 2.28,
    sector: "Financial"
  }
]

const sectorAllocation = [
  { sector: "Technology", value: 155215, percentage: 65.2, color: "chart-1" },
  { sector: "Automotive", value: 24850, percentage: 10.4, color: "chart-2" },
  { sector: "Financial", value: 11422.50, percentage: 4.8, color: "chart-3" },
  { sector: "Healthcare", value: 28500, percentage: 12.0, color: "chart-4" },
  { sector: "Energy", value: 18000, percentage: 7.6, color: "chart-5" }
]

const performanceData = [
  { period: "1D", return: 1.24, value: 238987.50 },
  { period: "1W", return: 3.45, value: 238987.50 },
  { period: "1M", return: 8.12, value: 238987.50 },
  { period: "3M", return: 15.67, value: 238987.50 },
  { period: "1Y", return: 24.33, value: 238987.50 },
  { period: "ALL", return: 28.45, value: 238987.50 }
]

export default function Portfolio() {
  const [selectedPeriod, setSelectedPeriod] = useState("1M")

  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
  const totalUnrealizedPL = holdings.reduce((sum, holding) => sum + holding.unrealizedPL, 0)
  const totalUnrealizedPLPercent = (totalUnrealizedPL / (totalValue - totalUnrealizedPL)) * 100

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio Management</h1>
          <p className="text-muted-foreground">Monitor your holdings and track performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Rebalance
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {holdings.length} positions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unrealized P&L</CardTitle>
            {totalUnrealizedPL > 0 ? (
              <TrendingUp className="h-4 w-4 text-profit" />
            ) : (
              <TrendingDown className="h-4 w-4 text-loss" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalUnrealizedPL > 0 ? 'text-profit' : 'text-loss'}`}>
              {totalUnrealizedPL > 0 ? '+' : ''}${totalUnrealizedPL.toLocaleString()}
            </div>
            <div className="flex items-center text-sm">
              {totalUnrealizedPL > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-profit mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-loss mr-1" />
              )}
              <span className={totalUnrealizedPL > 0 ? "text-profit" : "text-loss"}>
                {totalUnrealizedPLPercent.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">
              +24.33%
            </div>
            <p className="text-xs text-muted-foreground">
              1 year return
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="holdings" className="space-y-6">
        <TabsList className="bg-accent">
          <TabsTrigger value="holdings" className="data-[state=active]:bg-background">Holdings</TabsTrigger>
          <TabsTrigger value="allocation" className="data-[state=active]:bg-background">Allocation</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-background">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-6">
          {/* Holdings Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Current Holdings</CardTitle>
              <CardDescription>Detailed view of all positions in your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding) => (
                  <div key={holding.symbol} className="grid grid-cols-6 gap-4 p-4 rounded-lg bg-accent/30 border border-border">
                    <div className="col-span-2">
                      <div className="font-semibold text-foreground">{holding.symbol}</div>
                      <div className="text-sm text-muted-foreground">{holding.name}</div>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {holding.sector}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Quantity</div>
                      <div className="font-semibold text-foreground">{holding.quantity}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Avg Price</div>
                      <div className="font-semibold text-foreground">${holding.avgPrice.toFixed(2)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Current Price</div>
                      <div className="font-semibold text-foreground">${holding.currentPrice.toFixed(2)}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Market Value</div>
                      <div className="font-semibold text-foreground">${holding.marketValue.toLocaleString()}</div>
                      <div className={`text-sm flex items-center justify-end mt-1 ${holding.unrealizedPL > 0 ? 'text-profit' : 'text-loss'}`}>
                        {holding.unrealizedPL > 0 ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {holding.unrealizedPL > 0 ? '+' : ''}${holding.unrealizedPL.toLocaleString()} ({holding.unrealizedPLPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          {/* Sector Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Sector Allocation</CardTitle>
                <CardDescription>Portfolio distribution by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sectorAllocation.map((sector) => (
                    <div key={sector.sector} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded bg-${sector.color}`}></div>
                        <span className="text-foreground">{sector.sector}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">{sector.percentage}%</div>
                        <div className="text-sm text-muted-foreground">${sector.value.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Asset Breakdown</CardTitle>
                <CardDescription>Top holdings by value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {holdings.slice(0, 5).map((holding) => {
                    const percentage = (holding.marketValue / totalValue) * 100
                    return (
                      <div key={holding.symbol} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">{holding.symbol}</span>
                          <span className="text-sm text-muted-foreground">{holding.quantity} shares</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">{percentage.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">${holding.marketValue.toLocaleString()}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Historical Performance</CardTitle>
              <CardDescription>Portfolio returns over different time periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {performanceData.map((period) => (
                    <Button
                      key={period.period}
                      variant={selectedPeriod === period.period ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period.period)}
                    >
                      {period.period}
                    </Button>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {performanceData.map((period) => (
                    <div key={period.period} className="p-4 rounded-lg bg-accent/30 border border-border">
                      <div className="text-sm text-muted-foreground">{period.period}</div>
                      <div className={`text-lg font-semibold ${period.return > 0 ? 'text-profit' : 'text-loss'}`}>
                        {period.return > 0 ? '+' : ''}{period.return}%
                      </div>
                      <div className="text-sm text-muted-foreground">${period.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                {/* Placeholder for chart */}
                <div className="h-64 bg-accent/20 rounded-lg border border-border flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p>Portfolio Performance Chart</p>
                    <p className="text-sm">Interactive chart would be displayed here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
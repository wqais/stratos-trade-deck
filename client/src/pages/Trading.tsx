import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from "lucide-react"

// Mock data for orders
const openOrders = [
  { id: "1", symbol: "AAPL", type: "BUY", quantity: 100, price: 174.00, status: "Open", time: "09:30 AM", filled: 0 },
  { id: "2", symbol: "GOOGL", type: "SELL", quantity: 50, price: 2895.00, status: "Partial", time: "10:15 AM", filled: 25 },
  { id: "3", symbol: "MSFT", type: "BUY", quantity: 75, price: 348.50, status: "Open", time: "11:20 AM", filled: 0 },
]

const executedOrders = [
  { id: "4", symbol: "TSLA", type: "SELL", quantity: 200, price: 249.80, status: "Filled", time: "08:45 AM", filled: 200 },
  { id: "5", symbol: "NVDA", type: "BUY", quantity: 150, price: 444.20, status: "Filled", time: "09:15 AM", filled: 150 },
  { id: "6", symbol: "AMD", type: "BUY", quantity: 300, price: 102.35, status: "Filled", time: "10:30 AM", filled: 300 },
]

const searchResults = [
  { symbol: "AAPL", name: "Apple Inc.", price: 174.50, change: 2.30, changePercent: 1.34 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2891.20, change: -12.80, changePercent: -0.44 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 348.10, change: 4.60, changePercent: 1.34 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: -5.20, changePercent: -2.05 },
]

export default function Trading() {
  const [selectedSymbol, setSelectedSymbol] = useState("")
  const [orderType, setOrderType] = useState("market")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleBuy = () => {
    console.log("Buy order:", { selectedSymbol, orderType, quantity, price })
    // Reset form
    setQuantity("")
    setPrice("")
  }

  const handleSell = () => {
    console.log("Sell order:", { selectedSymbol, orderType, quantity, price })
    // Reset form
    setQuantity("")
    setPrice("")
  }

  const filteredResults = searchResults.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Execution</h1>
          <p className="text-muted-foreground">Execute trades with speed and precision</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="text-muted-foreground">Market Status:</div>
          <Badge variant="default" className="bg-profit text-profit-foreground">Open</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Search & Order Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Security Search */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Security Lookup</CardTitle>
              <CardDescription>Search and select instruments to trade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search symbols or company names..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
                
                {searchTerm && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filteredResults.map((stock) => (
                      <div
                        key={stock.symbol}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedSymbol === stock.symbol 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent hover:bg-accent/80'
                        }`}
                        onClick={() => setSelectedSymbol(stock.symbol)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{stock.symbol}</div>
                            <div className="text-sm opacity-80">{stock.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${stock.price.toFixed(2)}</div>
                            <div className={`text-sm ${stock.change > 0 ? 'text-profit' : 'text-loss'}`}>
                              {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Place Order</CardTitle>
              <CardDescription>
                {selectedSymbol ? `Trading ${selectedSymbol}` : "Select a security to begin trading"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol" className="text-foreground">Symbol</Label>
                  <Input
                    id="symbol"
                    value={selectedSymbol}
                    placeholder="e.g., AAPL"
                    onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-type" className="text-foreground">Order Type</Label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                      <SelectItem value="stop">Stop Order</SelectItem>
                      <SelectItem value="stop-limit">Stop-Limit Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-foreground">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Number of shares"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                {orderType !== "market" && (
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-foreground">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="Price per share"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="buy"
                    className="flex-1"
                    onClick={handleBuy}
                    disabled={!selectedSymbol || !quantity}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    BUY
                  </Button>
                  <Button
                    variant="sell"
                    className="flex-1"
                    onClick={handleSell}
                    disabled={!selectedSymbol || !quantity}
                  >
                    <TrendingDown className="w-4 h-4 mr-2" />
                    SELL
                  </Button>
                </div>

                {selectedSymbol && quantity && (
                  <div className="p-3 bg-accent rounded-lg">
                    <div className="text-sm text-muted-foreground">Estimated Value:</div>
                    <div className="text-lg font-semibold text-foreground">
                      ${(parseInt(quantity) * (orderType === "market" ? 174.50 : parseFloat(price) || 0)).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Open Orders */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Open Orders</CardTitle>
              <CardDescription>Orders pending execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {openOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border">
                    <div className="flex items-center gap-4">
                      <Badge variant={order.type === 'BUY' ? 'default' : 'secondary'} className={order.type === 'BUY' ? 'bg-buy text-buy-foreground' : 'bg-sell text-sell-foreground'}>
                        {order.type}
                      </Badge>
                      <div>
                        <div className="font-semibold text-foreground">{order.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.quantity} shares @ ${order.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={order.status === 'Open' ? 'secondary' : 'default'} className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {order.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">{order.time}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Executed Orders */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Executions</CardTitle>
              <CardDescription>Recently filled orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {executedOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/20 border border-border">
                    <div className="flex items-center gap-4">
                      <Badge variant={order.type === 'BUY' ? 'default' : 'secondary'} className={order.type === 'BUY' ? 'bg-buy text-buy-foreground' : 'bg-sell text-sell-foreground'}>
                        {order.type}
                      </Badge>
                      <div>
                        <div className="font-semibold text-foreground">{order.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.quantity} shares @ ${order.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="bg-profit text-profit-foreground flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Filled
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">{order.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, Search } from "lucide-react"

export default function Charts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reporting & Charts</h1>
          <p className="text-muted-foreground">Detailed analysis and custom reports</p>
        </div>
        <Button variant="default" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Security Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search symbol..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Price Chart</CardTitle>
            <CardDescription>Interactive OHLC data visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-accent/20 rounded-lg border border-border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">Interactive Chart Component</p>
                <p className="text-sm">OHLC data with zoom and pan capabilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
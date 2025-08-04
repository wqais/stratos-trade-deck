import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, TrendingUp } from "lucide-react"

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Technical Analytics</h1>
          <p className="text-muted-foreground">Advanced trading tools and paper trading</p>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="bg-accent">
          <TabsTrigger value="analysis">Technical Analysis</TabsTrigger>
          <TabsTrigger value="paper">Paper Trading</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Technical Indicators</CardTitle>
              <CardDescription>Add indicators to analyze price movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-accent/20 rounded-lg border border-border flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Activity className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Technical Analysis Chart</p>
                  <p className="text-sm">Moving Averages, RSI, MACD indicators</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paper">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Paper Trading</CardTitle>
              <CardDescription>Practice trading without real money</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Paper Trading Simulator</h3>
                <p className="text-muted-foreground mb-4">Test strategies with virtual funds</p>
                <Button variant="default">Start Paper Trading</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
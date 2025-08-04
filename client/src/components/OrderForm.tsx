import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { insertOrderSchema, type InsertOrder } from '@shared/schema';
import { usePlaceOrder } from '@/hooks/useTrading';
import { useMarketPrice, useSymbols } from '@/hooks/useMarketData';
import { useToast } from '@/hooks/use-toast';

export function OrderForm() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  
  const { data: symbols } = useSymbols();
  const { data: priceData } = useMarketPrice(selectedSymbol);
  const placeOrder = usePlaceOrder();
  const { toast } = useToast();

  const form = useForm<InsertOrder>({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      symbol: '',
      order_type: 'BUY',
      price_type: 'MARKET',
      quantity: 1,
    },
  });

  const currentPrice = priceData?.price || 0;
  const watchValue = form.watch();
  const estimatedTotal = watchValue.quantity * (watchValue.price_type === 'MARKET' ? currentPrice : (watchValue.price || 0));

  const onSubmit = async (data: InsertOrder) => {
    try {
      await placeOrder.mutateAsync(data);
      toast({
        title: 'Order Placed',
        description: `${data.order_type} order for ${data.quantity} shares of ${data.symbol} has been placed.`,
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Order Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={orderType} onValueChange={(value) => {
          setOrderType(value as 'BUY' | 'SELL');
          form.setValue('order_type', value as 'BUY' | 'SELL');
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="BUY" className="text-green-600">Buy</TabsTrigger>
            <TabsTrigger value="SELL" className="text-red-600">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value={orderType} className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Select 
                  onValueChange={(value) => {
                    setSelectedSymbol(value);
                    form.setValue('symbol', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    {symbols?.map((symbol: string) => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.symbol && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.symbol.message}
                  </p>
                )}
              </div>

              {selectedSymbol && (
                <div className="text-sm text-muted-foreground">
                  Current Price: ${currentPrice.toFixed(2)}
                </div>
              )}

              <div>
                <Label htmlFor="price_type">Order Type</Label>
                <Select 
                  defaultValue="MARKET"
                  onValueChange={(value) => form.setValue('price_type', value as 'MARKET' | 'LIMIT')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MARKET">Market</SelectItem>
                    <SelectItem value="LIMIT">Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.watch('price_type') === 'LIMIT' && (
                <div>
                  <Label htmlFor="price">Limit Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...form.register('price', { valueAsNumber: true })}
                    placeholder="Enter limit price"
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...form.register('quantity', { valueAsNumber: true })}
                  placeholder="Enter quantity"
                />
                {form.formState.errors.quantity && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.quantity.message}
                  </p>
                )}
              </div>

              {estimatedTotal > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">
                    Estimated Total: ${estimatedTotal.toFixed(2)}
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className={`w-full ${orderType === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                disabled={placeOrder.isPending || !selectedSymbol}
              >
                {placeOrder.isPending ? 'Placing Order...' : `${orderType} ${watchValue.quantity || 0} Shares`}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
import { db } from './database';
import { marketDataService } from './marketDataService';
import { orders, holdings, portfolios } from './schema';
import { Order, InsertOrder, Holding, Portfolio } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

class TradingService {
  async placeOrder(userId: number, orderData: InsertOrder): Promise<Order> {
    const currentPrice = marketDataService.getCurrentPrice(orderData.symbol);
    
    if (currentPrice === 0) {
      throw new Error(`Symbol ${orderData.symbol} not found`);
    }

    // For market orders, use current price
    const orderPrice = orderData.price_type === 'MARKET' ? currentPrice : orderData.price!;

    // Check if user has sufficient funds/shares
    if (orderData.order_type === 'BUY') {
      await this.validateBuyOrder(userId, orderData.quantity, orderPrice);
    } else {
      await this.validateSellOrder(userId, orderData.symbol, orderData.quantity);
    }

    // Insert order
    const result = await db.insert(orders).values({
      user_id: userId,
      symbol: orderData.symbol,
      order_type: orderData.order_type,
      price_type: orderData.price_type,
      quantity: orderData.quantity,
      price: orderPrice.toString(),
      status: 'PENDING'
    }).returning();

    const orderId = result[0].id;

    // For market orders, execute immediately
    if (orderData.price_type === 'MARKET') {
      await this.executeOrder(orderId, currentPrice);
    }

    return this.getOrder(orderId);
  }

  private async validateBuyOrder(userId: number, quantity: number, price: number): Promise<void> {
    const totalCost = quantity * price;
    const portfolio = await this.getPortfolio(userId);
    
    if (portfolio.cash_balance < totalCost) {
      throw new Error('Insufficient funds');
    }
  }

  private async validateSellOrder(userId: number, symbol: string, quantity: number): Promise<void> {
    const holding = await this.getHolding(userId, symbol);
    
    if (!holding || holding.quantity < quantity) {
      throw new Error('Insufficient shares');
    }
  }

  async executeOrder(orderId: number, executedPrice: number): Promise<void> {
    const order = await this.getOrder(orderId);
    
    if (order.status !== 'PENDING') {
      throw new Error('Order is not pending');
    }

    const totalAmount = order.quantity * executedPrice;

    // Update order status
    await db.update(orders)
      .set({
        status: 'FILLED',
        executed_price: executedPrice.toString(),
        filled_quantity: order.quantity,
        updated_at: new Date()
      })
      .where(eq(orders.id, orderId));

    // Update portfolio and holdings
    if (order.order_type === 'BUY') {
      await this.processBuy(order.user_id, order.symbol, order.quantity, executedPrice);
    } else {
      await this.processSell(order.user_id, order.symbol, order.quantity, executedPrice);
    }
  }

  private async processBuy(userId: number, symbol: string, quantity: number, price: number): Promise<void> {
    const totalCost = quantity * price;

    // Update cash balance
    const portfolio = await this.getPortfolio(userId);
    await db.update(portfolios)
      .set({
        cash_balance: (parseFloat(portfolio.cash_balance) - totalCost).toString(),
        updated_at: new Date()
      })
      .where(eq(portfolios.user_id, userId));

    // Update or create holding
    const holding = await this.getHolding(userId, symbol);
    
    if (holding) {
      const newQuantity = holding.quantity + quantity;
      const newAveragePrice = ((holding.quantity * parseFloat(holding.average_price)) + (quantity * price)) / newQuantity;
      
      await db.update(holdings)
        .set({
          quantity: newQuantity,
          average_price: newAveragePrice.toString(),
          updated_at: new Date()
        })
        .where(and(eq(holdings.user_id, userId), eq(holdings.symbol, symbol)));
    } else {
      await db.insert(holdings).values({
        user_id: userId,
        symbol,
        quantity,
        average_price: price.toString()
      });
    }

    await this.updatePortfolioValue(userId);
  }

  private async processSell(userId: number, symbol: string, quantity: number, price: number): Promise<void> {
    const totalRevenue = quantity * price;

    // Update cash balance
    const portfolio = await this.getPortfolio(userId);
    await db.update(portfolios)
      .set({
        cash_balance: (parseFloat(portfolio.cash_balance) + totalRevenue).toString(),
        updated_at: new Date()
      })
      .where(eq(portfolios.user_id, userId));

    // Update holding
    const holding = await this.getHolding(userId, symbol);
    
    if (holding) {
      const newQuantity = holding.quantity - quantity;
      
      if (newQuantity === 0) {
        await db.delete(holdings).where(and(eq(holdings.user_id, userId), eq(holdings.symbol, symbol)));
      } else {
        await db.update(holdings)
          .set({
            quantity: newQuantity,
            updated_at: new Date()
          })
          .where(and(eq(holdings.user_id, userId), eq(holdings.symbol, symbol)));
      }
    }

    await this.updatePortfolioValue(userId);
  }

  private async updatePortfolioValue(userId: number): Promise<void> {
    const holdings = await this.getHoldings(userId);
    let totalValue = 0;

    for (const holding of holdings) {
      const currentPrice = marketDataService.getCurrentPrice(holding.symbol);
      const holdingValue = holding.quantity * currentPrice;
      totalValue += holdingValue;

      // Update holding current value
      await db.update(holdings)
        .set({ current_value: holdingValue.toString() })
        .where(eq(holdings.id, holding.id));
    }

    // Update portfolio total value
    const portfolio = await this.getPortfolio(userId);
    const newTotalValue = portfolio.cash_balance + totalValue;

    await db.update(portfolios)
      .set({
        total_value: newTotalValue.toString(),
        updated_at: new Date()
      })
      .where(eq(portfolios.user_id, userId));
  }

  async getOrder(orderId: number): Promise<Order> {
    const result = await db.select().from(orders).where(eq(orders.id, orderId));
    
    if (result.length === 0) {
      throw new Error('Order not found');
    }

    return result[0] as Order;
  }

  async getUserOrders(userId: number, status?: string): Promise<Order[]> {
    let query = db.select().from(orders).where(eq(orders.user_id, userId));

    if (status) {
      query = query.where(and(eq(orders.user_id, userId), eq(orders.status, status as any)));
    }

    const result = await query.orderBy(orders.created_at);
    return result as Order[];
  }

  async getHolding(userId: number, symbol: string): Promise<Holding | null> {
    const result = await db.select().from(holdings)
      .where(and(eq(holdings.user_id, userId), eq(holdings.symbol, symbol)));

    return result.length > 0 ? (result[0] as Holding) : null;
  }

  async getHoldings(userId: number): Promise<Holding[]> {
    const result = await db.select().from(holdings).where(eq(holdings.user_id, userId));
    return result as Holding[];
  }

  async getPortfolio(userId: number): Promise<Portfolio> {
    let result = await db.select().from(portfolios).where(eq(portfolios.user_id, userId));
    
    if (result.length === 0) {
      // Create default portfolio
      await db.insert(portfolios).values({
        user_id: userId,
        cash_balance: '100000.00',
        total_value: '100000.00'
      });
      result = await db.select().from(portfolios).where(eq(portfolios.user_id, userId));
    }

    return result[0] as Portfolio;
  }

  async cancelOrder(orderId: number, userId: number): Promise<void> {
    const order = await this.getOrder(orderId);
    
    if (order.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    if (order.status !== 'PENDING') {
      throw new Error('Order cannot be cancelled');
    }

    await db.update(orders)
      .set({
        status: 'CANCELLED',
        updated_at: new Date()
      })
      .where(eq(orders.id, orderId));
  }
}

export const tradingService = new TradingService();
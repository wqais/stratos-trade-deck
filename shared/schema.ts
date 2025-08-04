import { z } from "zod";

// User schemas
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  created_at: z.string(),
  updated_at: z.string()
});

export const insertUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

// Portfolio schemas
export const portfolioSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  cash_balance: z.number(),
  total_value: z.number(),
  created_at: z.string(),
  updated_at: z.string()
});

// Holdings schemas
export const holdingSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  symbol: z.string(),
  quantity: z.number(),
  average_price: z.number(),
  current_value: z.number(),
  created_at: z.string(),
  updated_at: z.string()
});

// Order schemas
export const orderSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  symbol: z.string(),
  order_type: z.enum(['BUY', 'SELL']),
  price_type: z.enum(['MARKET', 'LIMIT']),
  quantity: z.number(),
  price: z.number().optional(),
  filled_quantity: z.number(),
  status: z.enum(['PENDING', 'FILLED', 'CANCELLED', 'PARTIAL']),
  executed_price: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string()
});

export const insertOrderSchema = z.object({
  symbol: z.string().min(1).max(10),
  order_type: z.enum(['BUY', 'SELL']),
  price_type: z.enum(['MARKET', 'LIMIT']),
  quantity: z.number().min(1),
  price: z.number().min(0.01).optional()
}).refine((data) => {
  if (data.price_type === 'LIMIT' && !data.price) {
    return false;
  }
  return true;
}, {
  message: "Price is required for limit orders",
  path: ["price"]
});

// Market data schemas
export const marketDataSchema = z.object({
  timestamp: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number()
});

export const newsItemSchema = z.object({
  title: z.string(),
  time_published: z.string(),
  summary: z.string().optional(),
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional()
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Portfolio = z.infer<typeof portfolioSchema>;
export type Holding = z.infer<typeof holdingSchema>;
export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type MarketData = z.infer<typeof marketDataSchema>;
export type NewsItem = z.infer<typeof newsItemSchema>;

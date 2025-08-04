import { pgTable, text, serial, integer, decimal, timestamp, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const orderTypeEnum = pgEnum('order_type', ['BUY', 'SELL']);
export const priceTypeEnum = pgEnum('price_type', ['MARKET', 'LIMIT']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'FILLED', 'CANCELLED', 'PARTIAL']);

// Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  cash_balance: decimal("cash_balance", { precision: 15, scale: 2 }).default('100000.00'),
  total_value: decimal("total_value", { precision: 15, scale: 2 }).default('100000.00'),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  symbol: text("symbol").notNull(),
  quantity: integer("quantity").notNull().default(0),
  average_price: decimal("average_price", { precision: 10, scale: 4 }).notNull(),
  current_value: decimal("current_value", { precision: 15, scale: 2 }).default('0'),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  symbol: text("symbol").notNull(),
  order_type: orderTypeEnum("order_type").notNull(),
  price_type: priceTypeEnum("price_type").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 4 }),
  filled_quantity: integer("filled_quantity").default(0),
  status: orderStatusEnum("status").default('PENDING'),
  executed_price: decimal("executed_price", { precision: 10, scale: 4 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const marketDataCache = pgTable("market_data_cache", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  price: decimal("price", { precision: 10, scale: 4 }).notNull(),
  open_price: decimal("open_price", { precision: 10, scale: 4 }).notNull(),
  high_price: decimal("high_price", { precision: 10, scale: 4 }).notNull(),
  low_price: decimal("low_price", { precision: 10, scale: 4 }).notNull(),
  volume: integer("volume").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
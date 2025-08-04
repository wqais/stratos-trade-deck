import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { authService } from "./authService";
import { tradingService } from "./tradingService";
import { insertUserSchema, loginSchema, insertOrderSchema } from "@shared/schema";

// Session middleware setup
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    username?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database and services
  await storage.initialize();

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'trading-platform-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  };

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await authService.registerUser(userData);
      
      req.session.userId = user.id;
      req.session.username = user.username;
      
      res.json({ 
        message: 'Registration successful',
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await authService.loginUser(credentials);
      
      req.session.userId = user.id;
      req.session.username = user.username;
      
      res.json({ 
        message: 'Login successful',
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ message: 'Logout successful' });
    });
  });

  app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
      const user = await authService.getUserById(req.session.userId!);
      res.json({ 
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (error: any) {
      res.status(404).json({ error: 'User not found' });
    }
  });

  // Portfolio routes
  app.get('/api/portfolio', requireAuth, async (req, res) => {
    try {
      const portfolio = await tradingService.getPortfolio(req.session.userId!);
      res.json(portfolio);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/portfolio/holdings', requireAuth, async (req, res) => {
    try {
      const holdings = await tradingService.getHoldings(req.session.userId!);
      res.json(holdings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Trading routes
  app.post('/api/orders', requireAuth, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await tradingService.placeOrder(req.session.userId!, orderData);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/orders', requireAuth, async (req, res) => {
    try {
      const status = req.query.status as string;
      const orders = await tradingService.getUserOrders(req.session.userId!, status);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/orders/:id/cancel', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      await tradingService.cancelOrder(orderId, req.session.userId!);
      res.json({ message: 'Order cancelled successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Market data routes
  app.get('/api/market/overview', (req, res) => {
    try {
      const symbols = storage.getSupportedSymbols();
      const overview = symbols.map(symbol => {
        const price = storage.getCurrentPrice(symbol);
        return {
          symbol,
          price,
          change: 0, // Would calculate from historical data
          changePercent: 0
        };
      });
      res.json(overview);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/market/symbols', (req, res) => {
    try {
      const symbols = storage.getSupportedSymbols();
      res.json(symbols);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/market/:symbol/price', (req, res) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const price = storage.getCurrentPrice(symbol);
      
      if (price === 0) {
        return res.status(404).json({ error: 'Symbol not found' });
      }
      
      res.json({ symbol, price });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/market/:symbol/history', (req, res) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const days = req.query.days ? parseInt(req.query.days as string) : undefined;
      const history = storage.getHistoricalData(symbol, days);
      
      res.json({ symbol, data: history });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/market/news', (req, res) => {
    try {
      const date = req.query.date as string;
      const news = storage.getNews(date);
      res.json(news);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}

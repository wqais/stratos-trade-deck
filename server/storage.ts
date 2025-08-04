import { initializeDatabase } from "./database";
import { marketDataService } from "./marketDataService";
import { authService } from "./authService";
import { tradingService } from "./tradingService";

// Storage interface - now using database services
export interface IStorage {
  // Initialize services
  initialize(): Promise<void>;
  
  // Auth methods
  getUser(id: number): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
  
  // Trading methods
  getPortfolio(userId: number): Promise<any>;
  getHoldings(userId: number): Promise<any>;
  getOrders(userId: number): Promise<any>;
  placeOrder(userId: number, order: any): Promise<any>;
  
  // Market data methods
  getCurrentPrice(symbol: string): number;
  getHistoricalData(symbol: string, days?: number): any[];
  getNews(date?: string): any[];
  getSupportedSymbols(): string[];
}

export class DatabaseStorage implements IStorage {
  async initialize(): Promise<void> {
    try {
      await initializeDatabase();
      await marketDataService.initialize();
      console.log('Database storage initialized');
    } catch (error) {
      console.error('Failed to initialize database storage:', error);
      throw error;
    }
  }

  async getUser(id: number): Promise<any> {
    return authService.getUserById(id);
  }

  async getUserByUsername(username: string): Promise<any> {
    return authService.getUserByUsername(username);
  }

  async createUser(user: any): Promise<any> {
    return authService.registerUser(user);
  }

  async getPortfolio(userId: number): Promise<any> {
    return tradingService.getPortfolio(userId);
  }

  async getHoldings(userId: number): Promise<any> {
    return tradingService.getHoldings(userId);
  }

  async getOrders(userId: number): Promise<any> {
    return tradingService.getUserOrders(userId);
  }

  async placeOrder(userId: number, order: any): Promise<any> {
    return tradingService.placeOrder(userId, order);
  }

  getCurrentPrice(symbol: string): number {
    return marketDataService.getCurrentPrice(symbol);
  }

  getHistoricalData(symbol: string, days?: number): any[] {
    return marketDataService.getHistoricalData(symbol, days);
  }

  getNews(date?: string): any[] {
    return marketDataService.getNews(date);
  }

  getSupportedSymbols(): string[] {
    return marketDataService.getSupportedSymbols();
  }
}

export const storage = new DatabaseStorage();

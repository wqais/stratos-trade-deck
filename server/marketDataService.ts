import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { db } from './database';
import { marketDataCache } from './schema';

export interface MarketDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItem {
  title: string;
  time_published: string;
  summary?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

class MarketDataService {
  private marketData: Map<string, MarketDataPoint[]> = new Map();
  private newsData: Map<string, NewsItem[]> = new Map();
  private currentPrices: Map<string, number> = new Map();
  private dataPath = path.join(process.cwd(), 'attached_assets', 'prompt_data');

  async initialize(): Promise<void> {
    console.log('Initializing market data service...');
    await this.loadHistoricalData();
    await this.loadLiveData();
    await this.loadNewsData();
    await this.startPriceSimulation();
    console.log('Market data service initialized');
  }

  private async loadHistoricalData(): Promise<void> {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'IBM'];
    const historicalPath = path.join(this.dataPath, 'simulation_historical_data');

    for (const symbol of symbols) {
      const filename = symbol === 'AAPL' ? 'simulated_AAPL_2025_historical.csv' : `${symbol}_2025_historical.csv`;
      const filePath = path.join(historicalPath, filename);
      
      if (fs.existsSync(filePath)) {
        const data: MarketDataPoint[] = [];
        
        await new Promise<void>((resolve, reject) => {
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row: any) => {
              data.push({
                timestamp: row.timestamp,
                open: parseFloat(row.open),
                high: parseFloat(row.high),
                low: parseFloat(row.low),
                close: parseFloat(row.close),
                volume: parseInt(row.volume)
              });
            })
            .on('end', resolve)
            .on('error', reject);
        });

        this.marketData.set(symbol, data);
        console.log(`Loaded ${data.length} historical data points for ${symbol}`);
      }
    }
  }

  private async loadLiveData(): Promise<void> {
    const symbols = ['AAPL', 'GOOG', 'MSFT', 'IBM'];
    const livePath = path.join(this.dataPath, 'simulation_price_data_July_1-Aug_30');

    for (const symbol of symbols) {
      const filename = `simulated_${symbol}_live.csv`;
      const filePath = path.join(livePath, filename);
      
      if (fs.existsSync(filePath)) {
        const data: MarketDataPoint[] = [];
        
        await new Promise<void>((resolve, reject) => {
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row: any) => {
              data.push({
                timestamp: row.timestamp,
                open: parseFloat(row.open),
                high: parseFloat(row.high),
                low: parseFloat(row.low),
                close: parseFloat(row.close),
                volume: parseInt(row.volume)
              });
            })
            .on('end', resolve)
            .on('error', reject);
        });

        // Append live data to historical data or create new entry
        const symbolKey = symbol === 'GOOG' ? 'GOOGL' : symbol;
        const existingData = this.marketData.get(symbolKey) || [];
        this.marketData.set(symbolKey, [...existingData, ...data]);
        
        // Set current price from latest data point
        if (data.length > 0) {
          this.currentPrices.set(symbolKey, data[data.length - 1].close);
        }
        
        console.log(`Loaded ${data.length} live data points for ${symbolKey}`);
      }
    }
  }

  private async loadNewsData(): Promise<void> {
    const newsPath = path.join(this.dataPath, 'simulation_news_data_July_1-Aug_30');
    const files = ['simulated_July_news_2025.json', 'simulated_August_news_2025.json'];

    for (const filename of files) {
      const filePath = path.join(newsPath, filename);
      
      if (fs.existsSync(filePath)) {
        try {
          const newsJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          
          // Process news data by date
          for (const [date, newsItems] of Object.entries(newsJson)) {
            if (Array.isArray(newsItems)) {
              this.newsData.set(date, newsItems as NewsItem[]);
            }
          }
          
          console.log(`Loaded news data from ${filename}`);
        } catch (error) {
          console.error(`Error loading news data from ${filename}:`, error);
        }
      }
    }
  }

  private async startPriceSimulation(): Promise<void> {
    // Simulate real-time price updates every 30 seconds
    setInterval(() => {
      this.updatePrices();
    }, 30000);
  }

  private updatePrices(): void {
    for (const [symbol, currentPrice] of this.currentPrices.entries()) {
      // Simulate price movement with random walk
      const volatility = 0.02; // 2% volatility
      const randomChange = (Math.random() - 0.5) * volatility;
      const newPrice = currentPrice * (1 + randomChange);
      
      this.currentPrices.set(symbol, Math.max(0.01, newPrice)); // Ensure price doesn't go negative
    }
  }

  getCurrentPrice(symbol: string): number {
    return this.currentPrices.get(symbol) || 0;
  }

  getHistoricalData(symbol: string, days?: number): MarketDataPoint[] {
    const data = this.marketData.get(symbol) || [];
    if (days) {
      return data.slice(-days);
    }
    return data;
  }

  getNews(date?: string): NewsItem[] {
    if (date) {
      return this.newsData.get(date) || [];
    }
    
    // Return recent news from all dates
    const allNews: NewsItem[] = [];
    for (const newsItems of this.newsData.values()) {
      allNews.push(...newsItems);
    }
    
    return allNews.slice(0, 50); // Return last 50 news items
  }

  getSupportedSymbols(): string[] {
    return Array.from(this.currentPrices.keys());
  }

  async cacheMarketData(symbol: string, data: MarketDataPoint): Promise<void> {
    try {
      await db.insert(marketDataCache).values({
        symbol,
        price: data.close.toString(),
        open_price: data.open.toString(),
        high_price: data.high.toString(),
        low_price: data.low.toString(),
        volume: data.volume,
        timestamp: new Date(data.timestamp)
      }).onConflictDoUpdate({
        target: [marketDataCache.symbol, marketDataCache.timestamp],
        set: {
          price: data.close.toString(),
          open_price: data.open.toString(),
          high_price: data.high.toString(),
          low_price: data.low.toString(),
          volume: data.volume
        }
      });
    } catch (error) {
      console.error('Error caching market data:', error);
    }
  }
}

export const marketDataService = new MarketDataService();
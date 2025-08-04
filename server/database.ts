import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { neon } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Initialize the database connection based on environment
function createDatabase() {
  const dbType = process.env.DB_TYPE || 'postgresql';
  
  if (dbType === 'sqlite') {
    // SQLite for local development
    const dbPath = process.env.DB_PATH || './local.db';
    const sqlite = new Database(path.resolve(dbPath));
    
    // Enable foreign keys for SQLite
    sqlite.pragma('foreign_keys = ON');
    
    return drizzleSqlite(sqlite, { schema });
  } else {
    // PostgreSQL for production/Replit
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required for PostgreSQL');
    }
    const sql = neon(process.env.DATABASE_URL);
    return drizzleNeon(sql, { schema });
  }
}

export const db = createDatabase();

export async function initializeDatabase() {
  try {
    const dbType = process.env.DB_TYPE || 'postgresql';
    
    if (dbType === 'sqlite') {
      console.log('Database connection established with SQLite');
      
      // Create tables for SQLite if they don't exist
      await createSqliteTables();
    } else {
      console.log('Database connection established with Neon PostgreSQL');
    }
    
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

async function createSqliteTables() {
  try {
    // For SQLite, we need to create tables manually since Drizzle push doesn't work the same way
    const sqlite = (db as any).driver;
    
    // Create users table
    sqlite.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Create portfolios table
    sqlite.prepare(`
      CREATE TABLE IF NOT EXISTS portfolios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cash_balance REAL DEFAULT 100000.00,
        total_value REAL DEFAULT 100000.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Create holdings table
    sqlite.prepare(`
      CREATE TABLE IF NOT EXISTS holdings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        symbol TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        average_price REAL NOT NULL,
        current_value REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, symbol)
      )
    `).run();

    // Create orders table
    sqlite.prepare(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        symbol TEXT NOT NULL,
        order_type TEXT NOT NULL CHECK (order_type IN ('BUY', 'SELL')),
        price_type TEXT NOT NULL CHECK (price_type IN ('MARKET', 'LIMIT')),
        quantity INTEGER NOT NULL,
        price REAL,
        executed_price REAL,
        filled_quantity INTEGER DEFAULT 0,
        status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'FILLED', 'CANCELLED')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    console.log('SQLite tables created successfully');
  } catch (error) {
    console.error('Error creating SQLite tables:', error);
    throw error;
  }
}
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export async function initializeDatabase() {
  try {
    console.log('Database connection established with Neon PostgreSQL');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
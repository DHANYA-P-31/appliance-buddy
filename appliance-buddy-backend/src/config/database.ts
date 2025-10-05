import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import { Client } from 'pg';
import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';
import { env } from './env';
import * as schema from '../db/schema';

// Supabase client (for additional features if needed)
export const supabase = env.SUPABASE_URL && env.SUPABASE_ANON_KEY 
  ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  : null;

// Database type detection
const isDevelopment = env.NODE_ENV === 'development';
const usePostgreSQL = env.DATABASE_URL || (!env.RAILWAY_ENVIRONMENT && isDevelopment);

// Database connection variables
let client: Client | null = null;
let sqliteDb: Database.Database | null = null;

// PostgreSQL client configuration
const getPostgreSQLConfig = () => {
  // Use Supabase DATABASE_URL if available
  if (env.DATABASE_URL) {
    return {
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }
  
  // Fallback to legacy configuration
  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
};

// Initialize database connection based on environment
if (usePostgreSQL) {
  // PostgreSQL/Supabase for development
  client = new Client(getPostgreSQLConfig());
  console.log('🐘 Using PostgreSQL/Supabase database');
} else {
  // SQLite for Railway deployment
  sqliteDb = new Database('appliance-buddy.db');
  console.log('🗃️ Using SQLite database');
}

// Initialize Drizzle ORM with appropriate driver
export const db = usePostgreSQL 
  ? drizzle(client!, schema)
  : drizzleSQLite(sqliteDb!, { schema });

// Database connection utility
export const connectDB = async (): Promise<void> => {
  try {
    if (usePostgreSQL && client) {
      await client.connect();
      const connectionType = env.DATABASE_URL ? 'Supabase' : 'Local PostgreSQL';
      console.log(`✅ Connected to ${connectionType} database`);
      
      if (env.DATABASE_URL) {
        console.log('🔗 Using Supabase connection string');
      } else {
        console.log(`📍 Connected to ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
      }
    } else if (sqliteDb) {
      // SQLite connection is synchronous, just log
      console.log('✅ Connected to SQLite database');
      console.log('📁 Database file: appliance-buddy.db');
    }
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    console.error('💡 Make sure your database credentials are correct in .env file');
    
    if (env.DATABASE_URL) {
      console.error('🔍 Check your Supabase DATABASE_URL format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres');
    }
    
    process.exit(1);
  }
};

// Graceful shutdown
export const disconnectDB = async (): Promise<void> => {
  try {
    if (client) {
      await client.end();
      console.log('✅ Disconnected from PostgreSQL database');
    } else if (sqliteDb) {
      sqliteDb.close();
      console.log('✅ Disconnected from SQLite database');
    }
  } catch (error) {
    console.error('❌ Error during database disconnection:', error);
  }
};
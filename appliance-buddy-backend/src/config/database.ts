import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Supabase client (for additional features if needed)
export const supabase = env.SUPABASE_URL && env.SUPABASE_ANON_KEY 
  ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  : null;

// PostgreSQL client configuration
const getClientConfig = () => {
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

// Create PostgreSQL client
const client = new Client(getClientConfig());

// Initialize Drizzle ORM
export const db = drizzle(client);

// Database connection utility
export const connectDB = async (): Promise<void> => {
  try {
    await client.connect();
    const connectionType = env.DATABASE_URL ? 'Supabase' : 'Local PostgreSQL';
    console.log(`✅ Connected to ${connectionType} database`);
    
    if (env.DATABASE_URL) {
      console.log('🔗 Using Supabase connection string');
    } else {
      console.log(`📍 Connected to ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
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
    await client.end();
    console.log('✅ Disconnected from database');
  } catch (error) {
    console.error('❌ Error during database disconnection:', error);
  }
};
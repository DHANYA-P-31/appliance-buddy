import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000'), // Railway provides PORT, default to 3000
  
  // Railway Environment Detection
  RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || '',
  
  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // Legacy PostgreSQL Configuration (fallback)
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_NAME: process.env.DB_NAME || 'appliance_buddy',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_for_development',
} as const;

export const validateEnv = (): void => {
  // Railway deployment - skip strict validation in production
  if (env.NODE_ENV === 'production' && env.RAILWAY_ENVIRONMENT) {
    console.log('🚂 Railway production environment detected - skipping strict validation');
    return;
  }
  
  // Check if using Supabase or legacy PostgreSQL for development
  const usingSupabase = env.DATABASE_URL || (env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
  
  if (usingSupabase) {
    // Validate Supabase configuration
    if (!env.DATABASE_URL && (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY)) {
      console.warn('⚠️  Warning: Missing Supabase environment variables, using fallback configuration');
    }
  } else {
    // Validate legacy PostgreSQL configuration
    if (!env.DB_PASSWORD && env.NODE_ENV !== 'production') {
      console.warn('⚠️  Warning: Missing DB_PASSWORD environment variable');
    }
  }
  
  if (!env.JWT_SECRET || env.JWT_SECRET === 'fallback_jwt_secret_for_development') {
    console.warn('⚠️  Warning: Using default JWT_SECRET. Please set a secure JWT_SECRET in production.');
  }
};
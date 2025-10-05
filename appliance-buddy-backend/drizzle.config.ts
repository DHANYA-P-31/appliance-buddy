import type { Config } from 'drizzle-kit';
import { env } from './src/config/env';

// Determine database type based on environment
const isRailway = env.RAILWAY_ENVIRONMENT;
const usePostgreSQL = env.DATABASE_URL || (!isRailway && env.NODE_ENV === 'development');

const config: Config = {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: usePostgreSQL ? 'postgresql' : 'sqlite',
  dbCredentials: usePostgreSQL
    ? env.DATABASE_URL 
      ? { url: env.DATABASE_URL }
      : {
          host: env.DB_HOST,
          port: env.DB_PORT,
          user: env.DB_USER,
          password: env.DB_PASSWORD,
          database: env.DB_NAME,
        }
    : { url: 'appliance-buddy.db' }
};

export default config;
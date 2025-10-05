import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, validateEnv } from './config/env';
import { connectDB, disconnectDB } from './config/database';
import { getSupabaseInfo } from './config/supabase';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

// Validate environment variables
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
  process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [env.CORS_ORIGIN, 'https://healthcheck.railway.app'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Simple ping endpoint for basic connectivity
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    const supabaseInfo = getSupabaseInfo();
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      port: env.PORT,
      database: {
        type: env.DATABASE_URL ? 'Supabase' : 'PostgreSQL',
        supabase: supabaseInfo
      }
    });
  } catch (error) {
    // Still return 200 for basic health check even if database info fails
    console.warn('Health check warning:', error);
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      port: env.PORT,
      note: 'Basic health check - some features may be unavailable'
    });
  }
});

// API routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Server startup
const startServer = async () => {
  try {
    // Start server first, then connect to database
    const server = app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`📊 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 CORS origin: ${env.CORS_ORIGIN}`);
      console.log(`🏥 Health endpoint: http://0.0.0.0:${env.PORT}/health`);
    });

    // Connect to database after server is listening (non-blocking for health checks)
    connectDB().catch(err => {
      console.warn('Database connection warning:', err.message);
      console.log('Server will continue running for health checks');
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export default app;

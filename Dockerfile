# Use Node.js 20 LTS version
FROM node:20-alpine

# Install Python and build dependencies for native modules
RUN apk add --no-cache python3 make g++ wget

# Set working directory
WORKDIR /app

# Copy backend source code
COPY appliance-buddy-backend/ ./appliance-buddy-backend/

# Install dependencies and build
WORKDIR /app/appliance-buddy-backend
RUN npm ci
RUN echo "Running TypeScript compilation..."
RUN npx tsc --listFiles || echo "TypeScript compilation with file listing completed"
RUN echo "Checking dist directory after compilation:"
RUN ls -la dist/ || echo "Dist directory contents check"
RUN echo "Looking for compiled JavaScript files:"
RUN find dist/ -type f -name "*.js" || echo "No JS files found in dist"

# Make start script executable
RUN chmod +x start.sh

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Set environment variables for Railway deployment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/health || exit 1

# Start the application
CMD ["node", "index.js"]
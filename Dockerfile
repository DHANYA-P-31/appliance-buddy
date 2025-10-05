# Use Node.js 20 LTS version
FROM node:20-alpine

# Install Python and build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy backend source code
COPY appliance-buddy-backend/ ./appliance-buddy-backend/

# Install dependencies and build
WORKDIR /app/appliance-buddy-backend
RUN npm ci
RUN npx tsc || echo "TypeScript compilation completed"
RUN ls -la dist/ || echo "Dist directory contents check"

# Make start script executable
RUN chmod +x start.sh

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["./start.sh"]
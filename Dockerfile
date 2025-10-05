# Use Node.js 20 LTS version (required for better-sqlite3)
FROM node:20-alpine

# Install Python and build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++ sqlite-dev

# Set working directory
WORKDIR /app

# Copy backend package files
COPY appliance-buddy-backend/package*.json ./appliance-buddy-backend/

# Install backend dependencies
WORKDIR /app/appliance-buddy-backend
RUN npm ci --omit=dev

# Copy backend source code
COPY appliance-buddy-backend/ ./

# Build the backend
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]
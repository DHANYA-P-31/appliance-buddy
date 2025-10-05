#!/bin/sh
echo "Starting Appliance Buddy Backend..."
echo "Current directory: $(pwd)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "Contents of dist directory:"
ls -la dist/ || echo "No dist directory found"

# Set default environment variables if not provided
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}

# Try to start the application
if [ -f "dist/app.js" ]; then
    echo "Starting from compiled JavaScript..."
    node dist/app.js
elif [ -f "src/app.ts" ]; then
    echo "Starting from TypeScript source..."
    npx ts-node src/app.ts
else
    echo "Error: No application entry point found"
    echo "Checking for alternative entry points..."
    find . -name "*.js" -type f | head -10
    exit 1
fi
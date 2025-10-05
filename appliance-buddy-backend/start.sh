#!/bin/sh
echo "Starting Appliance Buddy Backend..."
echo "Current directory: $(pwd)"
echo "Contents of dist directory:"
ls -la dist/ || echo "No dist directory found"

# Try to start the application
if [ -f "dist/app.js" ]; then
    echo "Starting from compiled JavaScript..."
    node dist/app.js
elif [ -f "src/app.ts" ]; then
    echo "Starting from TypeScript source..."
    npx ts-node src/app.ts
else
    echo "Error: No application entry point found"
    exit 1
fi
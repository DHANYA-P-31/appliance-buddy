// Simple Node.js entry point for Railway deployment
console.log('🚀 Starting Appliance Buddy Backend...');

// Check if we have compiled JavaScript
const fs = require('fs');
const path = require('path');

const distAppPath = path.join(__dirname, 'dist', 'app.js');
const srcAppPath = path.join(__dirname, 'src', 'app.ts');

if (fs.existsSync(distAppPath)) {
  console.log('📦 Using compiled JavaScript from dist/app.js');
  require('./dist/app.js');
} else if (fs.existsSync(srcAppPath)) {
  console.log('📝 Using TypeScript source with ts-node');
  // Set up ts-node for TypeScript execution
  require('ts-node').register({
    project: path.join(__dirname, 'tsconfig.json')
  });
  require('./src/app.ts');
} else {
  console.error('❌ No application entry point found!');
  console.log('📂 Current directory:', __dirname);
  console.log('📁 Directory contents:', fs.readdirSync(__dirname));
  process.exit(1);
}
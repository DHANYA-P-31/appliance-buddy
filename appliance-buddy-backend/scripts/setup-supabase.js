#!/usr/bin/env node

/**
 * Supabase Setup Helper Script
 * Run with: npm run setup:supabase
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupSupabase() {
  console.log('\n🚀 Supabase Setup Helper for Appliance Buddy\n');
  console.log('This script will help you configure your .env file for Supabase.\n');
  
  try {
    console.log('Please gather the following information from your Supabase dashboard:\n');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to Settings → API\n');
    
    const supabaseUrl = await question('Enter your Supabase Project URL: ');
    const anonKey = await question('Enter your Supabase anon public key: ');
    
    console.log('\nNow go to Settings → Database and copy your connection string:');
    const databaseUrl = await question('Enter your Database URL (connection string): ');
    
    const corsOrigin = await question('Enter your frontend URL (default: http://localhost:5173): ') || 'http://localhost:5173';
    const port = await question('Enter your backend port (default: 3001): ') || '3001';
    
    // Create .env content
    const envContent = `# Supabase Configuration
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${anonKey}
DATABASE_URL=${databaseUrl}

# Server Configuration
PORT=${port}
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=${corsOrigin}

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_here

# Legacy Database Configuration (fallback - not used when DATABASE_URL is set)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appliance_buddy
DB_USER=postgres
DB_PASSWORD=password
`;

    // Write to .env file
    const envPath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ .env file created successfully!');
    console.log('\nNext steps:');
    console.log('1. npm run db:generate  # Generate database schema');
    console.log('2. npm run db:push      # Push schema to Supabase');
    console.log('3. npm run db:seed      # Seed with sample data');
    console.log('4. npm run dev          # Start development server');
    console.log('\n🎉 Your backend is ready to connect to Supabase!');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  setupSupabase();
}
# Supabase Integration Guide

This guide will help you set up your Appliance Buddy backend with Supabase.

## Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter:
   - **Name**: `appliance-buddy`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create new project" and wait for setup to complete (~2 minutes)

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public key** (starts with `eyJhbGc...`)

3. Go to **Settings → Database** 
4. Copy the **Connection string** and replace `[YOUR-PASSWORD]` with your database password

### 3. Configure Your Backend

Run the setup helper:
```bash
npm run setup:supabase
```

Or manually create `.env` file:
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_secure_jwt_secret_here
```

### 4. Set Up Database Schema

```bash
# Generate migration files
npm run db:generate

# Push schema to Supabase
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start Your Backend

```bash
npm run dev
```

Your backend will be available at `http://localhost:3001`

Check the health endpoint: `http://localhost:3001/health`

## Features You Get with Supabase

- ✅ **Hosted PostgreSQL** - No local database setup needed
- ✅ **Automatic Backups** - Your data is safe
- ✅ **Dashboard** - Visual database management
- ✅ **Scalability** - Handles growth automatically
- ✅ **Security** - Built-in security features
- ✅ **API** - Auto-generated REST API (optional)
- ✅ **Real-time** - Live updates (future feature)
- ✅ **Auth** - User authentication (future feature)

## Troubleshooting

### Connection Issues
- Verify your DATABASE_URL is correct
- Check that your password doesn't contain special characters that need URL encoding
- Ensure your Supabase project is running (not paused)

### Schema Issues
- Make sure `npm run db:push` completed successfully
- Check the Supabase SQL Editor for any errors
- Verify tables were created in the database

### Environment Variables
- Double-check all values in `.env` are correct
- No quotes needed around values in `.env`
- Restart your dev server after changing `.env`

## Next Steps

1. **Frontend Integration**: Update your React app to use `http://localhost:3001/api` instead of localStorage
2. **Production Deployment**: Deploy to Vercel, Railway, or similar platform
3. **Environment Variables**: Set production environment variables in your hosting platform

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- Check the `README.md` for full setup instructions
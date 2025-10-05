# Railway Deployment Guide

This guide will help you deploy the Appliance Buddy application to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Railway CLI installed (optional but recommended)
3. A GitHub repository with your code

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

1. **Connect Repository**
   - Go to [railway.app](https://railway.app) and log in
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `appliance-buddy` repository

2. **Configure Environment Variables**
   Set the following environment variables in Railway:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=appliance-buddy.db
   JWT_SECRET=[Generate a secure 32+ character string]
   CORS_ORIGIN=*
   ```

3. **Database Setup**
   - The application uses SQLite database which is included in the deployment
   - No external database service needed
   - Database file will be created automatically on first run
   - Migrations run automatically on startup

4. **Deploy**
   - Railway will automatically detect the configuration and deploy
   - The deployment uses the `nixpacks.toml` configuration

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

## Configuration Files

The following files have been created for Railway deployment:

- `railway.json` - Railway service configuration
- `nixpacks.toml` - Nixpacks build configuration (alternative)
- `Dockerfile` - Docker configuration (alternative)
- `.railwayignore` - Files to exclude from deployment
- `appliance-buddy-backend/healthcheck.js` - Health check script

## Database Setup

The application uses SQLite as its database, which simplifies deployment:

1. **No External Database Required**: SQLite runs as an embedded database
2. **Automatic Migration**: Database migrations run automatically on startup
3. **Data Persistence**: Database file persists with Railway's volume mounting
4. **Development/Production Parity**: Same database technology in all environments

## Monitoring

- Health check endpoint: `/health`
- Railway provides built-in monitoring and logs
- Check deployment status in the Railway dashboard

## Environment Variables Needed

```bash
# Required
NODE_ENV=production
PORT=3000
DATABASE_URL=appliance-buddy.db
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters

# Optional
CORS_ORIGIN=* # Or your frontend domain
```

## Troubleshooting

1. **Build Failures**: Check the build logs in Railway dashboard
2. **Native Module Issues**: Ensure Node.js 20+ is used for better-sqlite3 compatibility
3. **Database Issues**: SQLite database will be created automatically
4. **Port Issues**: Make sure PORT environment variable is set to 3000
5. **CORS Issues**: Update CORS_ORIGIN to match your frontend domain

## Local Testing

Test the production build locally:

```bash
cd appliance-buddy-backend
npm run build
npm start
```

Visit `http://localhost:3000/health` to verify the server is running.
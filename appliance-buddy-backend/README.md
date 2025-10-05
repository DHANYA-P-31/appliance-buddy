# Appliance Buddy Backend

Express.js backend API for the Appliance Buddy home appliance management system.

## Features

- REST API for appliance CRUD operations
- Maintenance task scheduling and tracking
- Warranty status monitoring
- Support contact management
- Document linking
- **Supabase Integration** - PostgreSQL database with additional features
- PostgreSQL database with Drizzle ORM

## Prerequisites

- Node.js 18+
- Supabase account (recommended) OR local PostgreSQL database
- npm or yarn

## Setup Instructions

### Option 1: Using Supabase (Recommended)

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be ready

2. **Get your Supabase credentials:**
   - Go to Settings → API in your Supabase dashboard
   - Copy your Project URL and anon public key
   - Go to Settings → Database and copy the connection string

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
   ```

5. **Generate and push database schema:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

6. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

7. **Start the development server:**
   ```bash
   npm run dev
   ```

### Option 2: Using Local PostgreSQL

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up local PostgreSQL:**
   - Install PostgreSQL locally
   - Create a database named `appliance_buddy`

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your local database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=appliance_buddy
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

4. **Generate and push database schema:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## Supabase Benefits

When using Supabase, you get additional features:
- **Hosted PostgreSQL**: No need to manage your own database
- **Real-time subscriptions**: For live updates (future feature)
- **Built-in authentication**: Easy user management (future feature)
- **Row Level Security**: Database-level security policies
- **Automatic backups**: Built-in backup and restore
- **Dashboard**: Visual database management
- **API**: Auto-generated REST and GraphQL APIs

## API Endpoints

### Appliances
- `GET /api/appliances` - List all appliances
- `GET /api/appliances/:id` - Get single appliance
- `POST /api/appliances` - Create new appliance
- `PUT /api/appliances/:id` - Update appliance
- `DELETE /api/appliances/:id` - Delete appliance
- `GET /api/appliances/stats` - Get warranty statistics

### Maintenance
- `GET /api/appliances/:id/maintenance` - Get maintenance tasks for appliance
- `POST /api/appliances/:id/maintenance` - Create maintenance task
- `PUT /api/maintenance/:taskId` - Update maintenance task
- `DELETE /api/maintenance/:taskId` - Delete maintenance task
- `POST /api/maintenance/:taskId/complete` - Mark task as completed
- `GET /api/maintenance/upcoming` - Get upcoming tasks
- `GET /api/maintenance/overdue` - Get overdue tasks

## Frontend Integration

The backend is designed to work with the React frontend. Update your frontend API calls to point to `http://localhost:3001/api` instead of using localStorage.

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## Database Management

- `npm run db:generate` - Generate migration files
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data
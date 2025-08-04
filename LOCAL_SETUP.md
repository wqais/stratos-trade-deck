# Local Development Setup

## Prerequisites
1. Node.js (version 18 or higher)
2. npm or yarn package manager

## Setup Instructions

### 1. Clone/Download the Project
```bash
git clone <your-repo-url>
cd trading-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the `.env.local` file to `.env`:
```bash
cp .env.local .env
```

The `.env` file should contain:
```env
# Local Development Environment
DB_TYPE=sqlite
DB_PATH=./local.db
SESSION_SECRET=local-development-secret-key-123
NODE_ENV=development
PORT=5000
MARKET_DATA_UPDATE_INTERVAL=30000
```

### 4. Database Setup
The SQLite database will be automatically created when you first run the application. The database file will be created as `local.db` in your project root.

### 5. Run the Application

For local development with SQLite, run:
```bash
DB_TYPE=sqlite DB_PATH=./local.db npm run dev
```

Or on Windows:
```cmd
set DB_TYPE=sqlite && set DB_PATH=./local.db && npm run dev
```

The application will be available at: http://localhost:5000

**Alternative**: You can also create a local start script by creating a file called `start-local.sh`:
```bash
#!/bin/bash
export DB_TYPE=sqlite
export DB_PATH=./local.db
export SESSION_SECRET=local-development-secret-key-123
export NODE_ENV=development
export PORT=5000
npm run dev
```

Or `start-local.bat` for Windows:
```batch
@echo off
set DB_TYPE=sqlite
set DB_PATH=./local.db
set SESSION_SECRET=local-development-secret-key-123
set NODE_ENV=development
set PORT=5000
npm run dev
```

### 6. First Time Usage
1. Open http://localhost:5000 in your browser
2. Click "Create Account" to register a new user
3. You'll start with $100,000 in virtual cash
4. Begin trading with the available stocks: AAPL, GOOGL, MSFT, IBM

## Database Differences

### SQLite (Local Development)
- File-based database (local.db)
- Automatically created on first run
- Perfect for local development and testing
- No external dependencies

### PostgreSQL (Production/Replit)
- Used in the Replit environment
- Requires DATABASE_URL environment variable
- More robust for production use

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Troubleshooting

### Database Issues
If you encounter database errors:
1. Delete the `local.db` file
2. Restart the application - it will recreate the database

### Port Issues
If port 5000 is already in use:
1. Change the PORT in your `.env` file
2. Restart the application

### Missing Dependencies
If you get import errors:
```bash
npm install better-sqlite3 @types/better-sqlite3
```

## Project Structure
```
├── client/              # Frontend React application
├── server/              # Backend Express server
├── shared/              # Shared types and schemas
├── attached_assets/     # Market data CSV files
├── .env                 # Environment variables (create from .env.local)
├── local.db            # SQLite database (auto-created)
└── package.json        # Project dependencies
```

## Market Data
The application uses real historical market data from CSV files in the `attached_assets` folder:
- Historical price data for backtesting
- Simulated live data for real-time trading
- News events that affect market movements

## Features
- User authentication and registration
- Portfolio management with $100,000 starting balance
- Real-time stock trading simulation
- Order management (Market and Limit orders)
- Live price updates
- Trading history and portfolio tracking
- Market news integration
# How to Download and Run This Trading Platform Locally

## Quick Start Guide

### 1. Download the Project
You can download this project in several ways:
- **From Replit**: Use the export/download feature
- **Git Clone**: If you have a repository URL
- **Manual Download**: Download individual files

### 2. Required Files for Local Setup
Make sure you have these essential files:

**Core Application Files:**
- `package.json` - Dependencies and scripts
- `package-lock.json` - Dependency versions
- All files in `client/` folder - Frontend React app
- All files in `server/` folder - Backend Express server
- All files in `shared/` folder - Shared types and schemas
- All files in `attached_assets/` folder - Market data CSV files

**Configuration Files:**
- `.env.local` - Local environment variables (copy to `.env`)
- `drizzle.config.local.ts` - SQLite database config
- `LOCAL_SETUP.md` - Setup instructions
- `start-local.sh` - Linux/Mac startup script
- `start-local.bat` - Windows startup script

### 3. Installation Steps

1. **Extract/Copy all files** to a new folder on your computer

2. **Install Node.js** (version 18 or higher) from https://nodejs.org

3. **Open terminal/command prompt** in the project folder

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Set up environment:**
   ```bash
   # Copy the local environment file
   cp .env.local .env
   ```

6. **Start the application:**
   
   **Option A - Using the start script (recommended):**
   ```bash
   # Linux/Mac
   ./start-local.sh
   
   # Windows
   start-local.bat
   ```
   
   **Option B - Manual command:**
   ```bash
   # Linux/Mac/WSL
   DB_TYPE=sqlite DB_PATH=./local.db npm run dev
   
   # Windows Command Prompt
   set DB_TYPE=sqlite && set DB_PATH=./local.db && npm run dev
   
   # Windows PowerShell
   $env:DB_TYPE="sqlite"; $env:DB_PATH="./local.db"; npm run dev
   ```

7. **Open your browser** to http://localhost:5000

### 4. First Time Usage
1. Click "Create Account" to register
2. You'll start with $100,000 virtual cash
3. Trade stocks: AAPL, GOOGL, MSFT, IBM
4. Your data is saved in `local.db` file

### 5. Key Differences from Replit Version
- **Database**: Uses SQLite instead of PostgreSQL
- **File Storage**: Local `local.db` file instead of cloud database
- **Environment**: All environment variables in `.env` file
- **Market Data**: Same CSV files with real historical data

### 6. Troubleshooting

**"Cannot find module" errors:**
```bash
npm install
```

**Port 5000 already in use:**
Change PORT in `.env` file to a different number (e.g., 3000)

**Database errors:**
Delete `local.db` and restart - it will recreate automatically

**Permission denied on start-local.sh:**
```bash
chmod +x start-local.sh
```

### 7. Development Features
- **Auto-reload**: Changes to code automatically restart the server
- **SQLite Browser**: You can view the database with tools like DB Browser for SQLite
- **Logs**: All activity is logged in the terminal
- **Market Data**: Real historical data from July-August 2025

### 8. Production Deployment
For production deployment, you can:
- Use the PostgreSQL configuration
- Deploy to services like Vercel, Heroku, or DigitalOcean
- Set up environment variables on your hosting platform

The application is fully functional locally and provides the same trading simulation experience as the Replit version!
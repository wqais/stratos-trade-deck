@echo off
REM Local development script for SQLite setup (Windows)

echo Starting Trading Platform with SQLite database...
echo Database will be created as ./local.db

set DB_TYPE=sqlite
set DB_PATH=./local.db
set SESSION_SECRET=local-development-secret-key-123
set NODE_ENV=development
set PORT=5000
set MARKET_DATA_UPDATE_INTERVAL=30000

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Start the application
npm run dev
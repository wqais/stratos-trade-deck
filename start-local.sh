#!/bin/bash
# Local development script for SQLite setup

echo "Starting Trading Platform with SQLite database..."
echo "Database will be created as ./local.db"

export DB_TYPE=sqlite
export DB_PATH=./local.db
export SESSION_SECRET=local-development-secret-key-123
export NODE_ENV=development
export PORT=5000
export MARKET_DATA_UPDATE_INTERVAL=30000

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the application
npm run dev
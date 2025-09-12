#!/bin/bash

# OptiMind AI Ecosystem - Lightning-Fast Startup Script
# Premium Diamond Grade Performance Optimization

echo "⚡ Starting OptiMind AI Ecosystem - Lightning Mode..."

# Set environment variables for maximum performance
export NODE_ENV=development
export NODE_OPTIONS="--max-old-space-size=2048"
export NEXT_TELEMETRY_DISABLED=1
export TURBOPACK=0

# Clean up any existing processes
echo "🔄 Cleaning up existing processes..."
pkill -f "next.*dev" || true
pkill -f "tsx.*server" || true
sleep 1

# Start lightning server
echo "⚡ Starting Lightning Server..."
npx tsx server-lightning.ts &

# Wait for server to start (max 10 seconds)
echo "⏳ Waiting for server to initialize..."
timeout 10 bash -c 'until curl -s http://localhost:3000 > /dev/null; do sleep 1; done' || {
    echo "❌ Server startup timeout"
    exit 1
}

echo "✅ OptiMind AI Ecosystem Lightning Ready!"
echo "📍 Access: http://localhost:3000"
echo "⚡ Performance: Lightning Mode Active"

# Keep script running
wait
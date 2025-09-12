#!/bin/bash

# OptiMind AI Ecosystem - Optimized Server Startup Script
# Premium Diamond Grade Performance Optimization

set -e

echo "🚀 Starting OptiMind AI Ecosystem with Ultra-Fast Optimization..."

# Environment setup
export NODE_ENV=development
export NODE_OPTIONS="--max-old-space-size=4096"
export NEXT_TELEMETRY_DISABLED=1
export TURBOPACK=1

# Performance optimizations
export NODE_NO_WARNINGS=1
export NODE_PENDING_DEPRECATION=0
export NODE_PENDING_PIPE_UNCAUGHT=0

# Clean up any existing processes
echo "🔄 Cleaning up existing processes..."
pkill -f "next.*dev" || true
pkill -f "tsx.*server" || true
sleep 2

# Start optimized server
echo "⚡ Starting Ultra-Fast Server..."
npx tsx server-ultra-fast.ts &

# Wait for server to start
echo "⏳ Waiting for server to initialize..."
timeout 30 bash -c 'until curl -s http://localhost:3000 > /dev/null; do sleep 1; done' || {
    echo "❌ Server startup timeout"
    exit 1
}

echo "✅ OptiMind AI Ecosystem Ready!"
echo "📍 Access: http://localhost:3000"
echo "⚡ Performance: Ultra-Fast Mode Active"

# Keep script running
wait
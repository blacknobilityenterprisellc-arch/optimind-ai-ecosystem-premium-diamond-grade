#!/bin/bash

# Ultra-fast startup script for OptiMind AI Ecosystem
echo "⚡ OptiMind AI Ecosystem - Ultra Fast Mode"

# Clean up any existing processes
echo "🔄 Cleaning up..."
pkill -f "next dev" 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true
sleep 1

# Start with optimized Next.js dev server
echo "🚀 Starting server..."
NODE_ENV=development next dev --port 3000 --hostname 0.0.0.0
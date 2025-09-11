#!/bin/bash

# OptiMind AI Ecosystem - Simple Fixed Server Startup
# This script starts the server with a simple, reliable approach

echo "🚀 OptiMind AI Ecosystem - Simple Fixed Server Startup"
echo "====================================================="

# Kill any existing processes on ports 3000-3007
echo "🧹 Cleaning up existing processes..."
for port in 3000 3001 3002 3003 3004 3005 3006 3007; do
    pid=$(lsof -ti :$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "🛑 Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
    fi
done

# Wait for processes to terminate
sleep 2

# Start the nano server on port 3007
echo "🚀 Starting OptiMind AI Ecosystem on port 3007..."
cd /home/z/my-project
npx tsx server-nano.ts &

# Wait a moment for server to start
sleep 8

# Check if server is running
if curl -s http://localhost:3007 > /dev/null 2>&1; then
    echo "✅ OptiMind AI Ecosystem started successfully!"
    echo "🌐 Access: http://localhost:3007"
    echo "📋 Server running in nano mode on port 3007"
else
    echo "⚠️ Server may not have started properly, checking processes..."
    ps aux | grep -E "(node|next|tsx)" | grep -v grep
fi

echo "🎉 OptiMind AI Ecosystem - Server Startup Complete!"
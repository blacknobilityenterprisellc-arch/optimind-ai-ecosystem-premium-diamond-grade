#!/bin/bash
# Ultra-fast startup script for OptiMind AI Ecosystem

echo "🚀 Starting OptiMind AI Ecosystem..."

# Kill any existing processes on ports 3000-3010
for port in {3000..3010}; do
    pid=$(lsof -ti :$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "🛑 Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
    fi
done

# Wait a moment for ports to free up
sleep 1

# Start the optimized server
echo "⚡ Starting optimized server..."
cd /home/z/my-project
PORT=3002 tsx server-optimized.ts &

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
timeout 30 bash -c 'until curl -s http://localhost:3002 > /dev/null; do sleep 1; done' 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ OptiMind AI Ecosystem is ready!"
    echo "🌐 Access at: http://localhost:3002"
    echo "⚡ Startup completed successfully"
else
    echo "⚠️  Server startup timed out, but process is running"
fi

# Keep the script running
wait
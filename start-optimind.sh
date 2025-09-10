#!/bin/bash

# OptiMind AI Ecosystem - Multi-Mode Startup Script
# Provides different startup speeds based on your needs

echo "🚀 OptiMind AI Ecosystem - Startup Options"
echo "=========================================="

# Function to kill processes on a port
kill_port() {
    local port=$1
    local pid=$(lsof -ti :$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "🛑 Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
        sleep 1
    fi
}

# Parse startup mode
MODE=${1:-nano}
echo "🎯 Selected mode: $MODE"

# Kill existing processes based on mode
case $MODE in
    "nano")
        PORT=3007
        kill_port $PORT
        echo "⚡ Starting in NANO mode (Fastest - <1s)..."
        cd /home/z/my-project
        PORT=$PORT npx tsx /home/z/my-project/server-nano.ts
        ;;
    "micro")
        PORT=3006
        kill_port $PORT
        echo "⚡ Starting in MICRO mode (Fastest - ~1-2s)..."
        cd /home/z/my-project
        PORT=$PORT npx tsx /home/z/my-project/server-micro.ts
        ;;
    "ultra")
        PORT=3005
        kill_port $PORT
        echo "🚀 Starting in ULTRA mode (Very Fast - ~2-3s)..."
        cd /home/z/my-project
        PORT=$PORT npx tsx /home/z/my-project/server-optimized.ts
        ;;
    "fast")
        PORT=3004
        kill_port $PORT
        echo "⚡ Starting in FAST mode (Balanced - ~3-5s)..."
        cd /home/z/my-project
        PORT=$PORT npm run dev:ultra
        ;;
    "normal")
        PORT=3002
        kill_port $PORT
        echo "🔧 Starting in NORMAL mode (Full Features - ~5-10s)..."
        cd /home/z/my-project
        PORT=$PORT npx tsx /home/z/my-project/server.ts --turbo --premium
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [nano|micro|ultra|fast|normal|help]"
        echo ""
        echo "Startup Modes:"
        echo "  nano    - Fastest startup (<1s), minimal features"
        echo "  micro   - Fast startup (~1-2s), minimal features"
        echo "  ultra   - Very fast (~2-3s), most features"
        echo "  fast    - Fast (~3-5s), balanced features"
        echo "  normal  - Full features (~5-10s), all capabilities"
        echo ""
        echo "Examples:"
        echo "  $0          # Start fastest (nano mode)"
        echo "  $0 nano     # Start fastest"
        echo "  $0 micro    # Start fast"
        echo "  $0 ultra    # Start very fast"
        echo "  $0 normal   # Start with all features"
        exit 0
        ;;
    *)
        echo "❌ Unknown mode: $MODE"
        echo "Use '$0 help' to see available options"
        exit 1
        ;;
esac
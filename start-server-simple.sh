#!/bin/bash

# OptiMind AI Ecosystem - Simple Reliable Server Management
# Ensures only one server runs at a time with optimal configuration

echo "🚀 OptiMind AI Ecosystem - Simple Server Management"
echo "==================================================="

# Function to kill all existing processes
cleanup_processes() {
    echo "🧹 Cleaning up all existing processes..."
    
    # Kill all Node.js, Next.js, and TSX processes
    pkill -9 -f "node|next|tsx" 2>/dev/null || true
    pkill -9 -f "postcss" 2>/dev/null || true
    
    # Kill processes on all OptiMind ports
    for port in 3000 3002 3004 3005 3006 3007; do
        pid=$(lsof -ti :$port 2>/dev/null)
        if [ ! -z "$pid" ]; then
            echo "🛑 Killed process on port $port (PID: $pid)"
            kill -9 $pid 2>/dev/null
        fi
    done
    
    # Wait for processes to fully terminate
    sleep 3
    echo "✅ All processes cleaned up"
}

# Function to check system resources and determine optimal mode
determine_optimal_mode() {
    echo "📊 Checking system resources..."
    
    # Get CPU and Memory usage (simplified)
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}' 2>/dev/null || echo "50")
    MEMORY_INFO=$(free -m | grep Mem 2>/dev/null)
    if [ ! -z "$MEMORY_INFO" ]; then
        TOTAL_MEM=$(echo $MEMORY_INFO | awk '{print $2}')
        USED_MEM=$(echo $MEMORY_INFO | awk '{print $3}')
        MEMORY_USAGE=$(echo "scale=1; $USED_MEM * 100 / $TOTAL_MEM" | bc 2>/dev/null || echo "50")
    else
        MEMORY_USAGE="50"
    fi
    
    echo "📈 System Resources - CPU: ${CPU_USAGE}%, Memory: ${MEMORY_USAGE}%"
    
    # Determine optimal mode
    if (( $(echo "$CPU_USAGE < 30" | bc -l) )) && (( $(echo "$MEMORY_USAGE < 50" | bc -l) )); then
        MODE="normal"
        PORT="3002"
        echo "🎯 System has plenty of resources - using NORMAL mode"
    elif (( $(echo "$CPU_USAGE < 60" | bc -l) )) && (( $(echo "$MEMORY_USAGE < 70" | bc -l) )); then
        MODE="fast"
        PORT="3004"
        echo "🎯 System has moderate resources - using FAST mode"
    elif (( $(echo "$CPU_USAGE < 80" | bc -l) )) && (( $(echo "$MEMORY_USAGE < 85" | bc -l) )); then
        MODE="ultra"
        PORT="3005"
        echo "🎯 System has limited resources - using ULTRA mode"
    else
        MODE="nano"
        PORT="3007"
        echo "🎯 System has very limited resources - using NANO mode"
    fi
}

# Function to start the selected server
start_server() {
    echo "🚀 Starting $MODE server on port $PORT..."
    
    cd /home/z/my-project
    
    case $MODE in
        "nano")
            PORT=$PORT npx tsx server-nano.ts &
            ;;
        "micro")
            PORT=$PORT npx tsx server-micro.ts &
            ;;
        "ultra")
            PORT=$PORT npx tsx server-optimized.ts &
            ;;
        "fast")
            PORT=$PORT npm run dev:ultra &
            ;;
        "normal")
            PORT=$PORT npx tsx server.ts --turbo &
            ;;
        *)
            echo "❌ Unknown mode: $MODE"
            exit 1
            ;;
    esac
    
    # Wait a moment for server to start
    sleep 5
    
    # Check if server is running
    if curl -s http://localhost:$PORT > /dev/null 2>&1; then
        echo "✅ $MODE server started successfully on port $PORT"
        echo "🌐 Access: http://localhost:$PORT"
    else
        echo "⚠️ Server may not have started properly, checking processes..."
        ps aux | grep -E "(node|next|tsx)" | grep -v grep
    fi
}

# Main execution
echo "🔍 Starting OptiMind AI Ecosystem server..."

# Step 1: Clean up existing processes
cleanup_processes

# Step 2: Determine optimal mode
determine_optimal_mode

# Step 3: Start the server
start_server

echo "🎉 OptiMind AI Ecosystem - Server Management Complete!"
echo "📋 Server running in $MODE mode on port $PORT"
echo "💡 Use 'ps aux | grep -E \"(node|next|tsx)\"' to check running processes"
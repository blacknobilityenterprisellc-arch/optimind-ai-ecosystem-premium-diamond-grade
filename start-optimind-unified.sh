#!/bin/bash

# OptiMind AI Ecosystem - Unified Server Management
# AI-Powered Server Optimization and Conflict Resolution

echo "🚀 OptiMind AI Ecosystem - Unified Server Management"
echo "====================================================="

# Function to kill all processes
kill_all_processes() {
    echo "🧹 Killing all existing processes..."
    
    # Kill all Node.js, Next.js, and TSX processes
    pkill -9 -f "node|next|tsx" 2>/dev/null || true
    pkill -9 -f "postcss" 2>/dev/null || true
    
    # Kill processes on all OptiMind ports
    for port in 3000 3002 3004 3005 3006 3007; do
        pid=$(lsof -ti :$port 2>/dev/null)
        if [ ! -z "$pid" ]; then
            echo "🛑 Killing process on port $port (PID: $pid)"
            kill -9 $pid 2>/dev/null
        fi
    done
    
    # Wait for processes to fully terminate
    sleep 3
    echo "✅ All processes cleaned up"
}

# Function to check system resources
check_system_resources() {
    echo "📊 Checking system resources..."
    
    # Get CPU usage
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    
    # Get memory usage
    MEMORY_INFO=$(free -m | grep Mem)
    TOTAL_MEM=$(echo $MEMORY_INFO | awk '{print $2}')
    USED_MEM=$(echo $MEMORY_INFO | awk '{print $3}')
    MEMORY_USAGE=$(echo "scale=1; $USED_MEM * 100 / $TOTAL_MEM" | bc)
    
    echo "📈 System Resources - CPU: ${CPU_USAGE}%, Memory: ${MEMORY_USAGE}%"
    
    # Determine optimal mode based on resources
    if (( $(echo "$CPU_USAGE < 30" | bc -l) )) && (( $(echo "$MEMORY_USAGE < 50" | bc -l) )); then
        MODE="normal"
        echo "🎯 System has plenty of resources - using NORMAL mode"
    elif (( $(echo "$CPU_USAGE < 60" | bc -l) )) && (( $(echo "$MEMORY_USAGE < 70" | bc -l) )); then
        MODE="fast"
        echo "🎯 System has moderate resources - using FAST mode"
    elif (( $(echo "$CPU_USAGE < 80" | bc -l) )) && (( $(echo "$MEMORY_USAGE < 85" | bc -l) )); then
        MODE="ultra"
        echo "🎯 System has limited resources - using ULTRA mode"
    else
        MODE="nano"
        echo "🎯 System has very limited resources - using NANO mode"
    fi
}

# Function to start the intelligent server
start_intelligent_server() {
    echo "🤖 Starting OptiMind AI Intelligent Server Manager..."
    
    # Change to project directory
    cd /home/z/my-project
    
    # Start the intelligent server manager
    npx tsx server-intelligent.ts
    
    echo "✅ Intelligent server started successfully"
}

# Function to start fallback server
start_fallback_server() {
    echo "🔄 Starting fallback server..."
    
    # Change to project directory
    cd /home/z/my-project
    
    # Start nano server as fallback
    PORT=3007 npx tsx server-nano.ts &
    
    echo "✅ Fallback server started on port 3007"
}

# Main execution
echo "🔍 Analyzing system requirements..."

# Kill all existing processes
kill_all_processes

# Check system resources
check_system_resources

# Try to start intelligent server first
if [ -f "/home/z/my-project/server-intelligent.ts" ]; then
    echo "🤖 Using AI-powered intelligent server management..."
    start_intelligent_server
else
    echo "⚠️ Intelligent server not found, using fallback..."
    start_fallback_server
fi

echo "🎉 OptiMind AI Ecosystem - Server Management Complete!"
echo "🌐 Server should be accessible shortly"
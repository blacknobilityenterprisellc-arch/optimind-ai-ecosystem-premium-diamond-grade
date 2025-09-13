#!/bin/bash

# OptiMind AI Ecosystem - Enterprise Server Manager
# Professional process management for development and production

set -e

# Colors for professional output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[0;37m'
NC='\033[0m' # No Color

# Professional logging function
log() {
    echo -e "${GREEN}[OPTIMIND]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to cleanup existing processes
cleanup_processes() {
    log "🧹 Cleaning up existing processes..."
    
    # Kill any existing processes on port 3000
    lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true
    
    # Kill any existing tsx/nodemon processes
    pkill -9 -f "tsx.*server.ts" 2>/dev/null || true
    pkill -9 -f "nodemon.*server" 2>/dev/null || true
    pkill -9 -f "npm.*exec.*tsx" 2>/dev/null || true
    
    # Wait a moment for processes to terminate
    sleep 2
    
    # Verify cleanup
    local remaining=$(ps aux | grep -E "(tsx|nodemon)" | grep -v grep | wc -l)
    if [ "$remaining" -gt 0 ]; then
        warn "Found $remaining remaining processes, attempting force cleanup..."
        pkill -9 -f "node" 2>/dev/null || true
        sleep 1
    fi
    
    success "✅ Process cleanup completed"
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -ti:$port >/dev/null 2>&1; then
        error "❌ Port $port is already in use"
        return 1
    fi
    return 0
}

# Function to start development server
start_dev_server() {
    log "🚀 Starting OptiMind AI Ecosystem Development Server..."
    
    # Check port availability
    if ! check_port 3000; then
        error "❌ Port 3000 is not available. Please check running processes."
        exit 1
    fi
    
    # Set environment variables for development
    export NODE_ENV="development"
    export DEBUG="optimind:*"
    export TURBOPACK="1"
    
    # Create a clean log file
    mkdir -p logs
    local log_file="logs/dev-$(date +%Y%m%d_%H%M%S).log"
    
    info "📝 Logging to: $log_file"
    
    # Start server with professional monitoring
    log "⚡ Starting server with premium diamond-grade configuration..."
    
    # Use single process approach with proper monitoring
    nohup tsx server.ts --turbo --premium > "$log_file" 2>&1 &
    local server_pid=$!
    
    # Store PID for management
    echo "$server_pid" > ".server.pid"
    
    # Wait for server to start
    local max_wait=30
    local wait_count=0
    
    while [ $wait_count -lt $max_wait ]; do
        if curl -s http://localhost:3000 >/dev/null 2>&1; then
            success "✅ Server started successfully on http://localhost:3000"
            info "📊 Dashboard: http://localhost:3000/dashboard"
            info "🔌 Socket.IO initialized"
            info "📋 Process ID: $server_pid"
            info "📝 Log file: $log_file"
            return 0
        fi
        
        sleep 1
        wait_count=$((wait_count + 1))
        
        # Check if process is still running
        if ! ps -p $server_pid >/dev/null 2>&1; then
            error "❌ Server process died unexpectedly"
            error "💀 Check log file: $log_file"
            exit 1
        fi
        
        echo -n "."
    done
    
    echo ""
    error "❌ Server failed to start within $max_wait seconds"
    error "💀 Check log file: $log_file"
    exit 1
}

# Function to stop server
stop_server() {
    log "🛑 Stopping OptiMind AI Ecosystem Server..."
    
    if [ -f ".server.pid" ]; then
        local pid=$(cat ".server.pid")
        if ps -p $pid >/dev/null 2>&1; then
            kill -TERM $pid
            sleep 2
            
            if ps -p $pid >/dev/null 2>&1; then
                kill -KILL $pid
            fi
            
            success "✅ Server stopped successfully"
        else
            warn "⚠️ Server process not found"
        fi
        
        rm -f ".server.pid"
    else
        warn "⚠️ No PID file found, attempting port-based cleanup"
        cleanup_processes
    fi
}

# Function to restart server
restart_server() {
    log "🔄 Restarting OptiMind AI Ecosystem Server..."
    stop_server
    sleep 2
    start_dev_server
}

# Function to show server status
show_status() {
    log "📊 OptiMind AI Ecosystem Server Status"
    
    if [ -f ".server.pid" ]; then
        local pid=$(cat ".server.pid")
        if ps -p $pid >/dev/null 2>&1; then
            success "✅ Server is running (PID: $pid)"
            
            # Check if server is responding
            if curl -s http://localhost:3000 >/dev/null 2>&1; then
                success "✅ Server is responding on http://localhost:3000"
            else
                warn "⚠️ Server is running but not responding"
            fi
        else
            error "❌ Server is not running"
        fi
    else
        error "❌ No server PID file found"
    fi
    
    # Check for any orphaned processes
    local orphaned=$(ps aux | grep -E "(tsx|nodemon)" | grep -v grep | wc -l)
    if [ "$orphaned" -gt 0 ]; then
        warn "⚠️ Found $orphaned orphaned processes"
        ps aux | grep -E "(tsx|nodemon)" | grep -v grep
    else
        success "✅ No orphaned processes found"
    fi
}

# Function to show logs
show_logs() {
    if [ -f ".server.pid" ]; then
        local pid=$(cat ".server.pid")
        if ps -p $pid >/dev/null 2>&1; then
            log "📋 Showing server logs (Ctrl+C to exit)..."
            tail -f logs/dev-*.log 2>/dev/null || echo "No log files found"
        else
            error "❌ Server is not running"
        fi
    else
        error "❌ No server PID file found"
    fi
}

# Main script logic
case "${1:-start}" in
    "start")
        cleanup_processes
        start_dev_server
        ;;
    "stop")
        stop_server
        ;;
    "restart")
        restart_server
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "cleanup")
        cleanup_processes
        ;;
    "help"|"-h"|"--help")
        echo "OptiMind AI Ecosystem - Enterprise Server Manager"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start     Start the development server (default)"
        echo "  stop      Stop the running server"
        echo "  restart   Restart the server"
        echo "  status    Show server status"
        echo "  logs      Show server logs"
        echo "  cleanup   Clean up all processes"
        echo "  help      Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 start          # Start server"
        echo "  $0 status         # Check status"
        echo "  $0 logs           # View logs"
        echo "  $0 stop           # Stop server"
        ;;
    *)
        error "❌ Unknown command: $1"
        echo "Use '$0 help' to see available commands"
        exit 1
        ;;
esac
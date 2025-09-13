#!/bin/bash

# OptiMind Process Cleanup Script - Enterprise-Grade Process Management
# This script systematically cleans up processes and prepares for fresh server startup

echo "🧹 OptiMind Process Cleanup - Enterprise-Grade Process Management"
echo "============================================================"

# Function to kill processes by pattern
kill_processes_by_pattern() {
    local pattern="$1"
    local description="$2"
    
    echo "🔍 Searching for $description processes..."
    
    local pids=$(pgrep -f "$pattern" 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo "📋 Found $description processes:"
        echo "$pids" | while read pid; do
            if [ -n "$pid" ]; then
                local process_info=$(ps -p "$pid" -o pid,ppid,cmd --no-headers 2>/dev/null)
                echo "   PID $pid: $process_info"
            fi
        done
        
        echo "⚠️  Terminating $description processes..."
        echo "$pids" | xargs -r kill -TERM 2>/dev/null
        
        # Wait for graceful termination
        sleep 2
        
        # Force kill if still running
        local remaining_pids=$(pgrep -f "$pattern" 2>/dev/null)
        if [ -n "$remaining_pids" ]; then
            echo "🔨 Force killing remaining $description processes..."
            echo "$remaining_pids" | xargs -r kill -KILL 2>/dev/null
        fi
        
        echo "✅ $description processes cleaned up"
    else
        echo "✅ No $description processes found"
    fi
    echo ""
}

# Function to free up ports
free_up_ports() {
    local ports=("3000" "3001" "3002" "3003" "3004" "3005")
    
    echo "🔌 Checking and freeing up ports..."
    
    for port in "${ports[@]}"; do
        echo "📡 Checking port $port..."
        
        # Try to find what's using the port
        if command -v lsof &> /dev/null; then
            local port_users=$(lsof -ti :"$port" 2>/dev/null)
            if [ -n "$port_users" ]; then
                echo "   Port $port is in use by PIDs: $port_users"
                echo "   Terminating processes using port $port..."
                echo "$port_users" | xargs -r kill -TERM 2>/dev/null
                sleep 1
                echo "$port_users" | xargs -r kill -KILL 2>/dev/null
                echo "   ✅ Port $port freed"
            else
                echo "   ✅ Port $port is free"
            fi
        elif command -v netstat &> /dev/null; then
            local port_info=$(netstat -tulpn 2>/dev/null | grep ":$port ")
            if [ -n "$port_info" ]; then
                echo "   Port $port info: $port_info"
                # Extract PID from netstat output
                local pid=$(echo "$port_info" | awk '{print $7}' | cut -d'/' -f1)
                if [ -n "$pid" ] && [ "$pid" != "-" ]; then
                    echo "   Terminating PID $pid using port $port..."
                    kill -TERM "$pid" 2>/dev/null
                    sleep 1
                    kill -KILL "$pid" 2>/dev/null
                    echo "   ✅ Port $port freed"
                fi
            else
                echo "   ✅ Port $port is free"
            fi
        else
            echo "   ⚠️  Cannot check port $port - neither lsof nor netstat available"
        fi
    done
    echo ""
}

# Function to clean up temporary files
cleanup_temp_files() {
    echo "🗑️  Cleaning up temporary files..."
    
    local temp_patterns=(
        "*.log"
        "*.tmp"
        ".next/cache"
        "node_modules/.cache"
        ".eslintcache"
        "*.tsbuildinfo"
    )
    
    for pattern in "${temp_patterns[@]}"; do
        echo "📂 Cleaning $pattern files..."
        find . -name "$pattern" -type f -delete 2>/dev/null || true
        find . -name "$pattern" -type d -exec rm -rf {} + 2>/dev/null || true
    done
    
    echo "✅ Temporary files cleaned up"
    echo ""
}

# Function to clean up node processes
cleanup_node_processes() {
    echo "🟢 Cleaning up Node.js processes..."
    
    # Kill npm processes
    kill_processes_by_pattern "npm" "npm"
    
    # Kill node processes related to our project
    kill_processes_by_pattern "next-server" "Next.js Server"
    kill_processes_by_pattern "tsx.*server" "TSX Server"
    kill_processes_by_pattern "node.*server" "Node Server"
    kill_processes_by_pattern "eslint" "ESLint"
    
    echo "✅ Node.js processes cleaned up"
    echo ""
}

# Function to reset database connections
reset_database_connections() {
    echo "🗄️  Resetting database connections..."
    
    # Kill any database-related processes
    kill_processes_by_pattern "prisma" "Prisma"
    kill_processes_by_pattern "sqlite" "SQLite"
    
    # Check for database locks
    local db_files=("*.db" "*.sqlite" "*.sqlite3")
    for db_pattern in "${db_files[@]}"; do
        find . -name "$db_pattern" -type f -exec sh -c '
            echo "Checking database file: $1"
            if [ -f "$1-journal" ]; then
                echo "Removing journal file: $1-journal"
                rm -f "$1-journal"
            fi
            if [ -f "$1-wal" ]; then
                echo "Removing WAL file: $1-wal"
                rm -f "$1-wal"
            fi
            if [ -f "$1-shm" ]; then
                echo "Removing SHM file: $1-shm"
                rm -f "$1-shm"
            fi
        ' _ {} \;
    done
    
    echo "✅ Database connections reset"
    echo ""
}

# Function to verify cleanup
verify_cleanup() {
    echo "🔍 Verifying cleanup completion..."
    
    local checks_passed=0
    local total_checks=0
    
    # Check for remaining processes
    total_checks=$((total_checks + 1))
    local remaining_processes=$(pgrep -f "next-server\|tsx.*server\|node.*server\|eslint" 2>/dev/null | wc -l)
    if [ "$remaining_processes" -eq 0 ]; then
        echo "✅ No remaining server processes found"
        checks_passed=$((checks_passed + 1))
    else
        echo "⚠️  Found $remaining_processes remaining processes"
    fi
    
    # Check ports
    total_checks=$((total_checks + 1))
    local ports_in_use=0
    for port in 3000 3001 3002 3003; do
        if command -v lsof &> /dev/null && lsof -i :"$port" &>/dev/null; then
            ports_in_use=$((ports_in_use + 1))
        elif command -v netstat &> /dev/null && netstat -tulpn 2>/dev/null | grep -q ":$port "; then
            ports_in_use=$((ports_in_use + 1))
        fi
    done
    
    if [ "$ports_in_use" -eq 0 ]; then
        echo "✅ All required ports are free"
        checks_passed=$((checks_passed + 1))
    else
        echo "⚠️  $ports_in_use ports still in use"
    fi
    
    # Check disk space
    total_checks=$((total_checks + 1))
    local disk_usage=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 90 ]; then
        echo "✅ Disk space is sufficient (${disk_usage}% used)"
        checks_passed=$((checks_passed + 1))
    else
        echo "⚠️  Disk space is low (${disk_usage}% used)"
    fi
    
    # Check memory
    total_checks=$((total_checks + 1))
    local memory_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
    if [ "$memory_usage" -lt 90 ]; then
        echo "✅ Memory is sufficient (${memory_usage}% used)"
        checks_passed=$((checks_passed + 1))
    else
        echo "⚠️  Memory usage is high (${memory_usage}% used)"
    fi
    
    echo ""
    echo "📊 Cleanup Verification: $checks_passed/$total_checks checks passed"
    
    if [ "$checks_passed" -eq "$total_checks" ]; then
        echo "🎉 Cleanup completed successfully!"
        return 0
    else
        echo "⚠️  Some issues remain - manual intervention may be required"
        return 1
    fi
}

# Main cleanup execution
echo "🚀 Starting comprehensive process cleanup..."
echo ""

# Execute cleanup steps
cleanup_node_processes
free_up_ports
cleanup_temp_files
reset_database_connections

# Verify cleanup
if verify_cleanup; then
    echo ""
    echo "🎯 System is ready for fresh server startup"
    echo "💡 Next steps:"
    echo "   1. Run: npm run dev"
    echo "   2. Or use: ./robust-startup.sh"
    echo "   3. Monitor logs for any issues"
    exit 0
else
    echo ""
    echo "❌ Cleanup completed with some issues"
    echo "🔧 You may need to manually resolve remaining issues"
    exit 1
fi
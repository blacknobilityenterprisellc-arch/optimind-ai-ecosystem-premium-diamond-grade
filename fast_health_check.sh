#!/bin/bash

# ⚡ Fast System Health Check - 30s Maximum Timeout
echo "🚀 Starting Fast System Health Check..."
echo "⏱️  Timeout: 30 seconds maximum"
echo "=================================="

# Set timeout
TIMEOUT=30
START_TIME=$(date +%s)

# Function to check if timeout exceeded
check_timeout() {
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - START_TIME))
    if [ $ELAPSED -gt $TIMEOUT ]; then
        echo "⏰ TIMEOUT EXCEEDED ($ELAPSED seconds)"
        echo "❌ Health check aborted due to timeout"
        exit 1
    fi
}

# Function to run command with timeout
run_with_timeout() {
    local cmd="$1"
    local name="$2"
    
    check_timeout
    
    echo "🔍 Checking $name..."
    
    # Run command with timeout
    timeout 5s bash -c "$cmd" >/dev/null 2>&1
    local result=$?
    
    if [ $result -eq 0 ]; then
        echo "✅ $name: OK"
    elif [ $result -eq 124 ]; then
        echo "⚠️  $name: TIMEOUT (5s)"
    else
        echo "❌ $name: FAILED"
    fi
}

# Function to check API endpoint
check_api() {
    local endpoint="$1"
    local name="$2"
    
    check_timeout
    
    echo "🌐 Testing $name..."
    
    # Test API endpoint with timeout
    timeout 3s curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$endpoint 2>/dev/null
    local http_code=$?
    
    if [ $http_code -eq 0 ]; then
        local status_code=$(timeout 3s curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$endpoint 2>/dev/null)
        if [ "$status_code" = "200" ]; then
            echo "✅ $name: OK (200)"
        else
            echo "⚠️  $name: HTTP $status_code"
        fi
    elif [ $http_code -eq 124 ]; then
        echo "⚠️  $name: TIMEOUT (3s)"
    else
        echo "❌ $name: FAILED"
    fi
}

# Function to check database
check_database() {
    check_timeout
    
    echo "🗄️  Checking Database..."
    
    # Check if database file exists
    if [ -f "prisma/dev.db" ]; then
        echo "✅ Database file exists"
        
        # Check database size
        local db_size=$(ls -lah prisma/dev.db | awk '{print $5}')
        echo "📊 Database size: $db_size"
        
        # Try to access database (may not work in Termux)
        timeout 3s sqlite3 prisma/dev.db ".tables" >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "✅ Database accessible"
        else
            echo "⚠️  Database not accessible via CLI (normal in Termux)"
        fi
    else
        echo "❌ Database file not found"
    fi
}

# Function to check Node.js process
check_nodejs() {
    check_timeout
    
    echo "🟢 Checking Node.js..."
    
    # Check if Node.js is running
    if pgrep -f "node.*next" >/dev/null 2>&1; then
        echo "✅ Node.js process running"
        
        # Check memory usage
        local memory=$(ps aux | grep "node.*next" | grep -v grep | awk '{print $4}')
        echo "💾 Memory usage: ${memory}%"
    else
        echo "❌ Node.js process not running"
    fi
}

# Function to check port availability
check_port() {
    local port="$1"
    local service="$2"
    
    check_timeout
    
    echo "🔌 Checking $service (port $port)..."
    
    if timeout 2s nc -z localhost $port 2>/dev/null; then
        echo "✅ Port $port: OPEN"
    else
        echo "❌ Port $port: CLOSED"
    fi
}

# Function to check file system
check_filesystem() {
    check_timeout
    
    echo "💾 Checking File System..."
    
    # Check available disk space
    local disk_usage=$(df . | tail -1 | awk '{print $5}')
    echo "💿 Disk usage: $disk_usage"
    
    # Check if we can write to filesystem
    if touch /tmp/test_write_$$ 2>/dev/null; then
        rm -f /tmp/test_write_$$
        echo "✅ File system: WRITABLE"
    else
        echo "❌ File system: NOT WRITABLE"
    fi
}

# Function to check environment variables
check_environment() {
    check_timeout
    
    echo "🔧 Checking Environment..."
    
    # Check critical environment variables
    local env_vars=("NODE_ENV" "PORT" "DATABASE_URL")
    
    for var in "${env_vars[@]}"; do
        if [ -n "${!var}" ]; then
            echo "✅ $var: SET"
        else
            echo "⚠️  $var: NOT SET"
        fi
    done
}

# Function to check network connectivity
check_network() {
    check_timeout
    
    echo "🌐 Checking Network..."
    
    # Check basic internet connectivity
    if timeout 3s ping -c 1 8.8.8.8 >/dev/null 2>&1; then
        echo "✅ Internet connectivity: OK"
    else
        echo "⚠️  Internet connectivity: LIMITED"
    fi
    
    # Check DNS resolution
    if timeout 3s nslookup google.com >/dev/null 2>&1; then
        echo "✅ DNS resolution: OK"
    else
        echo "⚠️  DNS resolution: FAILED"
    fi
}

# Function to check Prisma
check_prisma() {
    check_timeout
    
    echo "🔮 Checking Prisma..."
    
    # Check if Prisma client exists
    if [ -d "node_modules/.prisma" ]; then
        echo "✅ Prisma client: EXISTS"
        
        # Try to validate Prisma schema
        if timeout 5s npx prisma validate >/dev/null 2>&1; then
            echo "✅ Prisma schema: VALID"
        else
            echo "⚠️  Prisma schema: INVALID"
        fi
    else
        echo "❌ Prisma client: NOT FOUND"
    fi
}

# Function to check npm packages
check_npm() {
    check_timeout
    
    echo "📦 Checking NPM Packages..."
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        echo "✅ Node modules: EXISTS"
        
        # Check package count
        local package_count=$(ls node_modules | wc -l)
        echo "📦 Packages installed: $package_count"
        
        # Check for critical packages
        local critical_packages=("next" "react" "react-dom" "@prisma/client")
        
        for pkg in "${critical_packages[@]}"; do
            if [ -d "node_modules/$pkg" ]; then
                echo "✅ $pkg: INSTALLED"
            else
                echo "❌ $pkg: MISSING"
            fi
        done
    else
        echo "❌ Node modules: NOT FOUND"
    fi
}

# Function to check git status
check_git() {
    check_timeout
    
    echo "📝 Checking Git..."
    
    # Check if this is a git repository
    if [ -d ".git" ]; then
        echo "✅ Git repository: DETECTED"
        
        # Check git status
        local status=$(git status --porcelain 2>/dev/null | wc -l)
        if [ "$status" -eq 0 ]; then
            echo "✅ Git status: CLEAN"
        else
            echo "⚠️  Git status: $status uncommitted files"
        fi
        
        # Check remote connection
        if timeout 3s git ls-remote origin >/dev/null 2>&1; then
            echo "✅ Git remote: CONNECTED"
        else
            echo "⚠️  Git remote: DISCONNECTED"
        fi
    else
        echo "❌ Git repository: NOT FOUND"
    fi
}

# Main health check execution
echo "🚀 Starting comprehensive health check..."
echo ""

# Run all health checks
check_filesystem
check_network
check_environment
check_nodejs
check_port 3000 "Next.js Server"
check_port 4001 "Alternative Server"
check_database
check_prisma
check_npm
check_git

# Check critical API endpoints
echo ""
echo "🌐 Testing Critical API Endpoints..."
check_api "/api/health" "Health API"
check_api "/api/hello" "Hello API"
check_api "/" "Root API"

# Calculate total time
END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

echo ""
echo "=================================="
echo "⏱️  Total time: $TOTAL_TIME seconds"
if [ $TOTAL_TIME -le $TIMEOUT ]; then
    echo "✅ Health check completed within timeout"
else
    echo "⚠️  Health check exceeded timeout"
fi
echo "🚀 Fast System Health Check Complete!"
echo "=================================="

# Exit with appropriate code
if [ $TOTAL_TIME -le $TIMEOUT ]; then
    exit 0
else
    exit 1
fi

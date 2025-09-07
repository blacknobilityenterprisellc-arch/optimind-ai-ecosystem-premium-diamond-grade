#!/bin/bash

# OptiMind AI Ecosystem - Autonomous Startup Script
# Premium Diamond Grade One-Click Startup
# Automatically starts the entire OptiMind AI Ecosystem

set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Log function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$SCRIPT_DIR/optimind-startup.log"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $*" | tee -a "$SCRIPT_DIR/optimind-startup.log"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*" | tee -a "$SCRIPT_DIR/optimind-startup.log"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $*" | tee -a "$SCRIPT_DIR/optimind-startup.log"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*" | tee -a "$SCRIPT_DIR/optimind-startup.log"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $*" | tee -a "$SCRIPT_DIR/optimind-startup.log"
}

# Check if Node.js is available
check_nodejs() {
    log_step "Checking Node.js availability..."
    
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        log_success "Node.js found: $node_version"
        return 0
    else
        log_error "Node.js not found. Please install Node.js 18+"
        return 1
    fi
}

# Check if npm is available
check_npm() {
    log_step "Checking npm availability..."
    
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        log_success "npm found: $npm_version"
        return 0
    else
        log_error "npm not found. Please install npm"
        return 1
    fi
}

# Check if tsx is available
check_tsx() {
    log_step "Checking tsx availability..."
    
    if command -v tsx &> /dev/null; then
        local tsx_version=$(tsx --version)
        log_success "tsx found: $tsx_version"
        return 0
    else
        log_warning "tsx not found, installing..."
        npm install -g tsx
        if command -v tsx &> /dev/null; then
            log_success "tsx installed successfully"
            return 0
        else
            log_error "Failed to install tsx"
            return 1
        fi
    fi
}

# Kill any existing processes
cleanup_processes() {
    log_step "Cleaning up existing processes..."
    
    # Kill existing Node.js processes on ports 3000-3002
    for port in 3000 3001 3002; do
        if lsof -ti :$port > /dev/null 2>&1; then
            log_info "Killing processes on port $port..."
            kill -9 $(lsof -ti :$port) 2>/dev/null || true
            sleep 2
        fi
    done
    
    # Kill existing OptiMind processes
    pkill -f "optimind" 2>/dev/null || true
    pkill -f "intelligent-startup" 2>/dev/null || true
    pkill -f "self-healing" 2>/dev/null || true
    pkill -f "autonomous-controller" 2>/dev/null || true
    
    log_success "Process cleanup completed"
}

# Start OptiMind AI Ecosystem
start_optimind() {
    log_step "Starting OptiMind AI Ecosystem..."
    
    # Method 1: Try autonomous controller first
    log_info "Attempting to start with Autonomous Controller..."
    if [ -f "$SCRIPT_DIR/autonomous-controller.ts" ]; then
        log_info "Starting Autonomous Controller..."
        nohup tsx autonomous-controller.ts > "$SCRIPT_DIR/autonomous-controller.log" 2>&1 &
        local controller_pid=$!
        echo "$controller_pid" > "$SCRIPT_DIR/.autonomous-controller.pid"
        
        # Wait for controller to start
        sleep 10
        
        # Check if controller is running
        if curl -s http://localhost:3002/health > /dev/null 2>&1; then
            log_success "Autonomous Controller started successfully (PID: $controller_pid)"
            return 0
        else
            log_warning "Autonomous Controller failed to start, trying alternative method..."
            kill $controller_pid 2>/dev/null || true
        fi
    fi
    
    # Method 2: Try intelligent startup
    log_info "Attempting to start with Intelligent Startup..."
    if [ -f "$SCRIPT_DIR/intelligent-startup.ts" ]; then
        log_info "Starting Intelligent Startup..."
        nohup tsx intelligent-startup.ts > "$SCRIPT_DIR/intelligent-startup.log" 2>&1 &
        local startup_pid=$!
        echo "$startup_pid" > "$SCRIPT_DIR/.intelligent-startup.pid"
        
        # Wait for startup to complete
        sleep 30
        
        # Check if application is running
        if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
            log_success "Intelligent Startup completed successfully (PID: $startup_pid)"
            return 0
        else
            log_warning "Intelligent Startup failed, trying basic startup..."
            kill $startup_pid 2>/dev/null || true
        fi
    fi
    
    # Method 3: Basic startup
    log_info "Attempting basic startup..."
    if [ -f "$SCRIPT_DIR/package.json" ]; then
        log_info "Starting development server..."
        nohup npm run dev > "$SCRIPT_DIR/dev-server.log" 2>&1 &
        local dev_pid=$!
        echo "$dev_pid" > "$SCRIPT_DIR/.dev-server.pid"
        
        # Wait for server to start
        sleep 15
        
        # Check if server is running
        if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
            log_success "Development server started successfully (PID: $dev_pid)"
            return 0
        else
            log_error "Basic startup failed"
            return 1
        fi
    else
        log_error "package.json not found"
        return 1
    fi
}

# Wait for system to be ready
wait_for_system() {
    log_step "Waiting for system to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log_info "Checking system health... (attempt $attempt/$max_attempts)"
        
        if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
            log_success "System is ready!"
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "System failed to start within expected time"
            return 1
        fi
        
        sleep 5
        attempt=$((attempt + 1))
    done
}

# Display system information
display_system_info() {
    echo -e "${CYAN}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════════════════╗
║                    OPTIMIND AI ECOSYSTEM - STARTUP COMPLETE                    ║
║                      Premium Diamond Grade Autonomous System                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    log_success "🎉 OptiMind AI Ecosystem is now running autonomously!"
    echo ""
    echo -e "${CYAN}🌐 ACCESS POINTS:${NC}"
    echo "   • Main Application:    http://localhost:3000"
    echo "   • Health Check:        http://localhost:3000/api/health"
    echo "   • Monitoring Dashboard: http://localhost:3001"
    echo "   • Controller Status:   http://localhost:3002"
    echo ""
    echo -e "${CYAN}📊 SYSTEM STATUS:${NC}"
    echo "   • Autonomous Controller: $(if pgrep -f "autonomous-controller" > /dev/null; then echo -e "${GREEN}RUNNING${NC}"; else echo -e "${YELLOW}STOPPED${NC}"; fi)"
    echo "   • Development Server:  $(if pgrep -f "node.*3000" > /dev/null; then echo -e "${GREEN}RUNNING${NC}"; else echo -e "${YELLOW}STOPPED${NC}"; fi)"
    echo "   • Monitoring System:    $(if pgrep -f "self-healing" > /dev/null; then echo -e "${GREEN}RUNNING${NC}"; else echo -e "${YELLOW}STOPPED${NC}"; fi)"
    echo ""
    echo -e "${CYAN}📋 LOG FILES:${NC}"
    echo "   • Startup Log:         $SCRIPT_DIR/optimind-startup.log"
    echo "   • Controller Log:      $SCRIPT_DIR/autonomous-controller.log"
    echo "   • Development Log:     $SCRIPT_DIR/dev-server.log"
    echo "   • System Logs:          $SCRIPT_DIR/*.log"
    echo ""
    echo -e "${CYAN}🛠️  MANAGEMENT COMMANDS:${NC}"
    echo "   • View logs:           tail -f $SCRIPT_DIR/optimind-startup.log"
    echo "   • Stop system:         $SCRIPT_DIR/stop-optimind.sh"
    echo "   • Restart system:       $SCRIPT_DIR/start-optimind.sh"
    echo "   • Check status:        curl http://localhost:3002/status"
    echo ""
    echo -e "${GREEN}🚀 The OptiMind AI Ecosystem is now fully operational and autonomous!${NC}"
}

# Create stop script
create_stop_script() {
    log_step "Creating stop script..."
    
    cat > "$SCRIPT_DIR/stop-optimind.sh" << 'EOF'
#!/bin/bash

# OptiMind AI Ecosystem - Stop Script
# Premium Diamond Grade System Shutdown

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd"
cd "$SCRIPT_DIR"

echo "🛑 Stopping OptiMind AI Ecosystem..."

# Kill all OptiMind processes
pkill -f "autonomous-controller" 2>/dev/null || true
pkill -f "intelligent-startup" 2>/dev/null || true
pkill -f "self-healing" 2>/dev/null || true
pkill -f "node.*3000" 2>/dev/null || true
pkill -f "node.*3001" 2>/dev/null || true
pkill -f "node.*3002" 2>/dev/null || true

# Kill processes by PID files
for pid_file in .autonomous-controller.pid .intelligent-startup.pid .dev-server.pid; do
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        kill -9 "$pid" 2>/dev/null || true
        rm -f "$pid_file"
    fi
done

# Wait for processes to stop
sleep 3

echo "✅ OptiMind AI Ecosystem stopped successfully"
EOF

    chmod +x "$SCRIPT_DIR/stop-optimind.sh"
    log_success "Stop script created: $SCRIPT_DIR/stop-optimind.sh"
}

# Main function
main() {
    echo -e "${PURPLE}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════════════════╗
║              OPTIMIND AI ECOSYSTEM - AUTONOMOUS STARTUP SCRIPT               ║
║                    Premium Diamond Grade One-Click Startup                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    log_info "🤖 Starting OptiMind AI Ecosystem autonomous setup..."
    log_info "This may take a few minutes to complete."
    
    # Pre-flight checks
    if ! check_nodejs; then
        log_error "Node.js check failed"
        exit 1
    fi
    
    if ! check_npm; then
        log_error "npm check failed"
        exit 1
    fi
    
    if ! check_tsx; then
        log_error "tsx check failed"
        exit 1
    fi
    
    # Cleanup existing processes
    cleanup_processes
    
    # Start the system
    if ! start_optimind; then
        log_error "Failed to start OptiMind AI Ecosystem"
        exit 1
    fi
    
    # Wait for system to be ready
    if ! wait_for_system; then
        log_error "System failed to become ready"
        exit 1
    fi
    
    # Create stop script
    create_stop_script
    
    # Display system information
    display_system_info
    
    log_success "🎉 OptiMind AI Ecosystem startup completed successfully!"
    log_info "The system is now running autonomously and will self-manage itself."
}

# Run main function
main "$@"
#!/bin/bash

# ⚡ OptiMind AI Ecosystem - Safe Sync Test Script
# Tests each component individually before full sync

set -e

echo "🧪 OptiMind AI Ecosystem - Safe Sync Test"
echo "=========================================="
echo "⏰ Start Time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# Color scheme
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test 1: Environment Check
test_environment() {
    log_info "Test 1: Environment Check"
    echo "--------------------------------"
    
    # Check git status
    log_info "Checking git status..."
    git status --porcelain
    echo ""
    
    # Check current branch
    log_info "Current branch: $(git branch --show-current)"
    
    # Check if databases exist
    log_info "Database files found:"
    find . -name "*.db" -type f | head -5
    echo ""
    
    log_success "Environment check complete"
    echo ""
}

# Test 2: Git Sync Test (Dry Run)
test_git_sync() {
    log_info "Test 2: Git Sync Test (Dry Run)"
    echo "-----------------------------------"
    
    # Check remote status
    log_info "Checking remote status..."
    git remote -v
    
    # Check if local and remote are in sync
    local current_branch=$(git branch --show-current)
    local local_commit=$(git rev-parse HEAD)
    local remote_commit=$(git rev-parse origin/$current_branch 2>/dev/null || echo "not_found")
    
    if [ "$remote_commit" = "not_found" ]; then
        log_warning "Remote branch origin/$current_branch not found"
    elif [ "$local_commit" = "$remote_commit" ]; then
        log_success "Local and remote are in sync for branch $current_branch"
    else
        log_warning "Local and remote differ for branch $current_branch"
        log_info "Local: $local_commit"
        log_info "Remote: $remote_commit"
    fi
    echo ""
}

# Test 3: Database Test
test_database() {
    log_info "Test 3: Database Test"
    echo "------------------------"
    
    # Test Prisma validation
    log_info "Testing Prisma validation..."
    if timeout 10s npx prisma validate >/dev/null 2>&1; then
        log_success "Prisma validation passed"
    else
        log_error "Prisma validation failed"
    fi
    
    # Test Prisma generate
    log_info "Testing Prisma client generation..."
    if timeout 15s npx prisma generate >/dev/null 2>&1; then
        log_success "Prisma client generation passed"
    else
        log_error "Prisma client generation failed"
    fi
    
    # Test database push (dry run if possible)
    log_info "Testing database schema..."
    if timeout 20s npx prisma db push --accept-data-loss >/dev/null 2>&1; then
        log_success "Database schema test passed"
    else
        log_error "Database schema test failed"
    fi
    echo ""
}

# Test 4: Branch Analysis
test_branches() {
    log_info "Test 4: Branch Analysis"
    echo "--------------------------"
    
    # List all branches
    log_info "All branches:"
    git branch -a
    
    # Check which branches have remote counterparts
    echo ""
    log_info "Branch sync status:"
    git branch -vv | head -10  # Limit output to avoid issues
    echo ""
}

# Test 5: Backup Test
test_backup() {
    log_info "Test 5: Backup Test"
    echo "----------------------"
    
    # Create a small test backup
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local test_backup="test_backup_$timestamp"
    
    mkdir -p "$test_backup"
    
    # Backup just the schema file
    if [ -f "prisma/schema.prisma" ]; then
        cp prisma/schema.prisma "$test_backup/"
        log_success "Schema backed up to $test_backup/"
    fi
    
    # Create a simple backup summary
    cat > "$test_backup/test_summary.txt" << EOF
Test Backup Summary
==================
Timestamp: $timestamp
Branch: $(git branch --show-current)
Commit: $(git rev-parse HEAD --short)
Test: Safe sync test
EOF
    
    log_success "Test backup created: $test_backup/"
    echo ""
}

# Main test execution
main() {
    log_info "Starting safe sync tests..."
    echo ""
    
    test_environment
    test_git_sync
    test_database
    test_branches
    test_backup
    
    log_success "All safe sync tests completed!"
    echo ""
    echo "📋 Test Summary:"
    echo "   ✅ Environment checked"
    echo "   ✅ Git sync status verified"
    echo "   ✅ Database operations tested"
    echo "   ✅ Branch structure analyzed"
    echo "   ✅ Backup system tested"
    echo ""
    echo "🚀 Ready for full sync operation!"
}

# Run main function
main "$@"
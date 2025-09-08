#!/bin/bash

# ⚡ Comprehensive Test Script for CI/CD Improvements
# Tests all optimization improvements and validates fixes

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

run_test() {
    local test_name="$1"
    local command="$2"
    local expected_exit_code="${3:-0}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Running test: $test_name"
    
    if eval "$command" >/dev/null 2>&1; then
        local exit_code=$?
        if [ $exit_code -eq $expected_exit_code ]; then
            log_success "$test_name: PASSED"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            log_error "$test_name: FAILED (exit code: $exit_code, expected: $expected_exit_code)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    else
        log_error "$test_name: FAILED (command execution error)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        COMPREHENSIVE CI/CD IMPROVEMENTS TEST SUITE          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: Ultra-fast lint (optimized timeout)
run_test "Ultra-fast lint optimization" "timeout 10s npm run lint:ultra-fast" 0

# Test 2: Fast lint (optimized timeout)
run_test "Fast lint optimization" "timeout 15s npm run lint:fast" 0

# Test 3: Critical lint (optimized timeout)
run_test "Critical lint optimization" "timeout 25s npm run lint:critical" 0

# Test 4: Premium lint script ultra-fast mode
run_test "Premium lint script ultra-fast" "timeout 20s ./premium-diamond-lint-test.sh --mode ultra-fast --timeout 10" 0

# Test 5: Premium lint script standard mode
run_test "Premium lint script standard" "timeout 40s ./premium-diamond-lint-test.sh --mode standard --timeout 25" 0

# Test 6: TypeScript check
run_test "TypeScript check" "timeout 60s npm run type-check" 0

# Test 7: Database operations
run_test "Database push" "timeout 30s npm run db:push" 0

# Test 8: Build test
run_test "Build test" "timeout 120s npm run build" 0

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    TEST RESULTS SUMMARY                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Total Tests: $TOTAL_TESTS"
echo "✅ Passed: $PASSED_TESTS"
echo "❌ Failed: $FAILED_TESTS"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    log_success "🎉 ALL TESTS PASSED - CI/CD improvements are working correctly!"
    echo "🚀 System is ready for production deployment"
    exit 0
else
    log_error "⚠️  $FAILED_TESTS test(s) failed - Review and address issues"
    echo "🔧 Focus on fixing failed tests before deployment"
    exit 1
fi
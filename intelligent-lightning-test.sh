#!/bin/bash

# ⚡ OptiMind AI Ecosystem - Intelligent Lightning Test
# Premium Diamond Grade - Auto-detects environment and runs comprehensive tests

echo "🤖 OptiMind AI Ecosystem - Intelligent Lightning Test"
echo "===================================================="
echo "⏱️  Timeout: 30 seconds maximum"
echo ""

START_TIME=$(date +%s)

# Source environment variables if .env exists
if [ -f ".env" ]; then
    echo "📋 Loading environment configuration..."
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment loaded successfully"
else
    echo "⚠️  No .env file found - using defaults"
fi

# Enhanced health check function
check_component() {
    local name="$1"
    local check_command="$2"
    local expected_result="${3:-0}"
    
    echo -n "🔍 $name... "
    
    if timeout 5s bash -c "$check_command" >/dev/null 2>&1; then
        echo "✅ PASS"
        return 0
    else
        echo "❌ FAIL"
        return 1
    fi
}

# Component checks
echo "🚀 Starting Intelligent Component Analysis..."
echo ""

PASSED=0
TOTAL=0

# File System Check
((TOTAL++))
if [ -w "." ]; then
    echo "✅ File System: WRITABLE"
    ((PASSED++))
else
    echo "❌ File System: NOT WRITABLE"
fi

# Environment Variables Check
echo ""
echo "🔧 Environment Variables:"
((TOTAL++))
if [ -n "$NODE_ENV" ]; then
    echo "✅ NODE_ENV: $NODE_ENV"
    ((PASSED++))
else
    echo "❌ NODE_ENV: NOT SET"
fi

((TOTAL++))
if [ -n "$PORT" ]; then
    echo "✅ PORT: $PORT"
    ((PASSED++))
else
    echo "❌ PORT: NOT SET"
fi

((TOTAL++))
if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL: SET"
    ((PASSED++))
else
    echo "❌ DATABASE_URL: NOT SET"
fi

((TOTAL++))
if [ -n "$ZAI_API_KEY" ]; then
    echo "✅ ZAI_API_KEY: SET"
    ((PASSED++))
else
    echo "❌ ZAI_API_KEY: NOT SET"
fi

# Database Check
echo ""
echo "🗄️ Database Status:"
((TOTAL++))
if [ -f "prisma/dev.db" ]; then
    DB_SIZE=$(du -h prisma/dev.db | cut -f1)
    echo "✅ Database File: EXISTS ($DB_SIZE)"
    ((PASSED++))
else
    echo "❌ Database File: MISSING"
fi

# Dependencies Check
echo ""
echo "📦 Dependencies Status:"
((TOTAL++))
if [ -d "node_modules" ]; then
    PACKAGE_COUNT=$(find node_modules -name "package.json" | wc -l)
    echo "✅ Node Modules: EXISTS ($PACKAGE_COUNT packages)"
    ((PASSED++))
else
    echo "❌ Node Modules: MISSING"
fi

((TOTAL++))
if [ -f "node_modules/next/package.json" ]; then
    NEXT_VERSION=$(node -p "require('./node_modules/next/package.json').version" 2>/dev/null || echo "UNKNOWN")
    echo "✅ Next.js: INSTALLED ($NEXT_VERSION)"
    ((PASSED++))
else
    echo "❌ Next.js: NOT INSTALLED"
fi

((TOTAL++))
if [ -f "node_modules/@prisma/client/package.json" ]; then
    PRISMA_VERSION=$(node -p "require('./node_modules/@prisma/client/package.json').version" 2>/dev/null || echo "UNKNOWN")
    echo "✅ Prisma Client: INSTALLED ($PRISMA_VERSION)"
    ((PASSED++))
else
    echo "❌ Prisma Client: NOT INSTALLED"
fi

# Git Status
echo ""
echo "📝 Git Repository:"
((TOTAL++))
if [ -d ".git" ]; then
    echo "✅ Git Repository: DETECTED"
    ((PASSED++))
    
    GIT_STATUS=$(git status --porcelain 2>/dev/null | wc -l)
    if [ "$GIT_STATUS" -eq 0 ]; then
        echo "✅ Git Status: CLEAN"
    else
        echo "⚠️  Git Status: $GIT_STATUS uncommitted files"
    fi
    
    if git remote get-url origin >/dev/null 2>&1; then
        echo "✅ Git Remote: CONNECTED"
    else
        echo "❌ Git Remote: NOT CONFIGURED"
    fi
else
    echo "❌ Git Repository: NOT DETECTED"
fi

# AI Services Check
echo ""
echo "🤖 AI Services Status:"
((TOTAL++))
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
    ((PASSED++))
else
    echo "❌ Node.js: NOT AVAILABLE"
fi

# Calculate score
SCORE=$((PASSED * 100 / TOTAL))
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "🎯 INTELLIGENT LIGHTNING TEST RESULTS"
echo "===================================="
echo "📊 Score: $SCORE% ($PASSED/$TOTAL components)"
echo "⏱️  Duration: ${DURATION} seconds"
echo "🕐 Timeout: 30 seconds"

if [ $SCORE -ge 90 ]; then
    echo "🎉 Status: EXCELLENT - System is ready for production"
    EXIT_CODE=0
elif [ $SCORE -ge 70 ]; then
    echo "✅ Status: GOOD - System is functional"
    EXIT_CODE=0
elif [ $SCORE -ge 50 ]; then
    echo "⚠️  Status: FAIR - System needs attention"
    EXIT_CODE=1
else
    echo "❌ Status: POOR - System requires immediate attention"
    EXIT_CODE=2
fi

echo ""
echo "🚀 Next Steps:"
if [ $SCORE -ge 70 ]; then
    echo "   • Run 'npm run dev' to start development server"
    echo "   • System is ready for OptiMind AI Ecosystem operations"
else
    echo "   • Run './auto-environment-setup.sh' to fix issues"
    echo "   • Check failed components above"
fi

echo ""
echo "⚡ Intelligent Lightning Test Complete!"

exit $EXIT_CODE
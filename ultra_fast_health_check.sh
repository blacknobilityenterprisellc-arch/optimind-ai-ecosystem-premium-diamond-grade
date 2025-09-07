#!/bin/bash

# ⚡ Ultra-Fast Health Check - Under 5 seconds
echo "⚡ Ultra-Fast Health Check..."
echo "=================================="

START_TIME=$(date +%s)

# Quick checks only
echo "🟢 Node.js process..."
pgrep -f "node.*next" >/dev/null 2>&1 && echo "✅ Running" || echo "❌ Not running"

echo "🌐 Port 3000..."
nc -z localhost 3000 2>/dev/null && echo "✅ Open" || echo "❌ Closed"

echo "🗄️  Database..."
[ -f "prisma/dev.db" ] && echo "✅ Exists" || echo "❌ Missing"

echo "📦 Node modules..."
[ -d "node_modules" ] && echo "✅ Present" || echo "❌ Missing"

echo "🔧 Environment..."
[ -n "$NODE_ENV" ] && echo "✅ NODE_ENV set" || echo "❌ NODE_ENV missing"

# Test API
echo "🌐 Health API..."
timeout 2s curl -s http://localhost:3000/api/health-fast >/dev/null 2>&1 && echo "✅ Responding" || echo "❌ No response"

END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

echo ""
echo "⏱️  Total time: ${TOTAL_TIME}s"
echo "⚡ Ultra-Fast Health Check Complete!"

# Exit with status
[ $TOTAL_TIME -le 5 ] && exit 0 || exit 1

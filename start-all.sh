#!/bin/bash
echo "🚀 Starting OptiMind AI Premium Diamond-Grade Ecosystem..."

# Start the main Next.js app
echo "🌐 Starting Next.js app..."
npm run dev &
NEXT_PID=$!

# Start the premium features service
echo "💎 Starting premium features service..."
npx tsx premium-features.ts &
PREMIUM_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "🔄 Shutting down services..."
    kill $NEXT_PID 2>/dev/null
    kill $PREMIUM_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script termination
trap cleanup SIGINT SIGTERM

# Wait for services
echo "✅ All services started. Press Ctrl+C to stop."
wait

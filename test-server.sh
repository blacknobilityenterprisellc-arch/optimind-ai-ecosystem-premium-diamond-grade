#!/bin/bash
echo "🧪 Testing OptiMind AI Premium Diamond-Grade Server"
echo "==============================================="

# Start the server
echo "🚀 Starting server..."
npm run dev:custom &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server process is running"
    
    # Test server response
    echo "🧪 Testing server response..."
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Server is responding at http://localhost:3000"
        
        # Test API
        echo "📊 Testing API endpoint..."
        API_RESPONSE=$(curl -s http://localhost:3000/api/status)
        echo "API Response: $API_RESPONSE"
        
        echo "🎉 Server test successful!"
        echo "🌐 You can access your ecosystem at: http://localhost:3000"
    else
        echo "❌ Server is not responding to requests"
    fi
else
    echo "❌ Server process is not running"
fi

# Stop the server
echo "🛑 Stopping server..."
kill $SERVER_PID 2>/dev/null

echo "✅ Test complete"

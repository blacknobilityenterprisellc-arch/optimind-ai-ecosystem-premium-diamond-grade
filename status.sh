#!/bin/bash
echo "🔍 OptiMind AI Premium Diamond-Grade Ecosystem Status Check"
echo "======================================================"
echo ""

# Check if the server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running on http://localhost:3000"
    
    # Check API status
    api_status=$(curl -s http://localhost:3000/api/status 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "✅ API endpoint is accessible"
        echo "   Status: $(echo $api_status | grep -o '"status":"[^"]*' | cut -d'"' -f4)"
    else
        echo "⚠️ API endpoint not accessible"
    fi
else
    echo "❌ Server is not running on http://localhost:3000"
fi

echo ""
echo "🚀 To start the server, run: ./start.sh"

#!/bin/bash

# OptiMind AI Ecosystem - Quick System Validation
# 
# Comprehensive validation using curl commands
# 
# @author: Enterprise Architecture Team
# @version: 2.0.0

BASE_URL="http://localhost:3000"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo "🚀 OptiMind AI Ecosystem - Quick System Validation"
echo "================================================"

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="$4"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "🔍 Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" -o /tmp/response_body.json 2>/dev/null)
    else
        response=$(curl -s -w "%{http_code}" "$url" -o /tmp/response_body.json 2>/dev/null)
    fi
    
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "✅ PASS ($http_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        
        # Show some response details
        if [ -f /tmp/response_body.json ]; then
            local size=$(wc -c < /tmp/response_body.json)
            echo "   Response size: $size bytes"
        fi
    else
        echo "❌ FAIL ($http_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        
        # Show error details if available
        if [ -f /tmp/response_body.json ] && [ -s /tmp/response_body.json ]; then
            echo "   Error: $(cat /tmp/response_body.json | head -c 100)..."
        fi
    fi
    echo ""
}

# Test Health Endpoints
echo "🏥 Testing Health Endpoints..."
echo "---------------------------"
test_endpoint "Basic Health" "$BASE_URL/api/health"
test_endpoint "V2 Health" "$BASE_URL/api/v2/health"
test_endpoint "Database Health" "$BASE_URL/api/v2/database/health"

# Test AI Models
echo "🤖 Testing AI Models..."
echo "--------------------"
test_endpoint "Models List" "$BASE_URL/api/models"
test_endpoint "Chat Functionality" "$BASE_URL/api/chat" "POST" \
    '{"model":"glm-45-flagship","messages":[{"role":"user","content":"Validation test"}]}'

# Test Testing Capabilities
echo "🧪 Testing Testing Capabilities..."
echo "-----------------------------"
test_endpoint "Testing API Info" "$BASE_URL/api/testing/multi-dimensional"
test_endpoint "Multi-Dimensional Testing" "$BASE_URL/api/testing/multi-dimensional" "POST" \
    '{"testSuite":{"name":"Validation","dimensions":["integration"],"targetCoverage":90,"priority":"high"},"configuration":{"environment":"validation","parallelExecution":false,"timeout":60000,"retryAttempts":1,"reportingLevel":"basic"},"context":{"applicationType":"AI Ecosystem","framework":"Next.js","criticalPaths":["API"],"riskAreas":["performance"]}}'

# Test Security Features
echo "🔒 Testing Security Features..."
echo "--------------------------"
test_endpoint "Quantum Security" "$BASE_URL/api/v2/quantum-security/key-pair" "POST" \
    '{"algorithm":"quantum-resistant","keySize":2048}'

# Test Database Operations
echo "🗄️ Testing Database Operations..."
echo "---------------------------"
test_endpoint "Database Manager" "$BASE_URL/api/v2/database-manager" "POST" \
    '{"operation":"health-check"}'

# Test API Endpoints
echo "🌐 Testing API Endpoints..."
echo "----------------------"
test_endpoint "Users API" "$BASE_URL/api/users"
test_endpoint "Projects API" "$BASE_URL/api/projects"
test_endpoint "Content API" "$BASE_URL/api/content"
test_endpoint "Settings API" "$BASE_URL/api/settings"
test_endpoint "Analytics API" "$BASE_URL/api/analytics"

# Test Advanced Features
echo "🚀 Testing Advanced Features..."
echo "--------------------------"
test_endpoint "Predictive Analytics" "$BASE_URL/api/v2/predictive-analytics/predict" "POST" \
    '{"model":"ensemble","data":{"validation":true},"horizon":7}'

# Generate Report
echo ""
echo "📋 VALIDATION REPORT"
echo "=================="
SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo "📊 Overall Results: $PASSED_TESTS/$TOTAL_TESTS tests passed ($SUCCESS_RATE% success rate)"
echo "⚠️  Failed: $FAILED_TESTS"

echo ""
echo "🏆 System Status:"
if [ $SUCCESS_RATE -ge 90 ]; then
    echo "🎉 EXCELLENT: OptiMind AI Ecosystem is operating at peak performance!"
elif [ $SUCCESS_RATE -ge 75 ]; then
    echo "👍 GOOD: OptiMind AI Ecosystem is performing well."
elif [ $SUCCESS_RATE -ge 50 ]; then
    echo "⚠️  WARNING: OptiMind AI Ecosystem requires attention."
else
    echo "🚨 CRITICAL: OptiMind AI Ecosystem requires immediate attention."
fi

echo ""
echo "💡 Next Steps:"
if [ $FAILED_TESTS -gt 0 ]; then
    echo "   - Investigate and fix $FAILED_TESTS failed components"
    echo "   - Check server logs for detailed error information"
    echo "   - Verify all services are running properly"
fi

if [ $SUCCESS_RATE -ge 90 ]; then
    echo "   - Continue monitoring system performance"
    echo "   - Consider load testing for production readiness"
fi

echo ""
echo "🎯 Validation completed at: $(date)"
echo "================================================"

# Cleanup
rm -f /tmp/response_body.json

exit $FAILED_TESTS
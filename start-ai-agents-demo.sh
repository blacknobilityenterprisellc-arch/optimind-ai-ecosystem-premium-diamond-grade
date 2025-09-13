#!/bin/bash

# OptiMind AI Agents Quick Start Demo Script
# This script demonstrates how to leverage the OptiMind Super AI Agents

echo "🚀 OptiMind AI Agents Quick Start Demo"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if the server is running
echo "🔍 Checking if OptiMind server is running..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ OptiMind server is running"
else
    echo "❌ OptiMind server is not running. Please start it first:"
    echo "   npm run dev"
    exit 1
fi

# Check if AI Agents endpoint is available
echo "🔍 Checking AI Agents endpoint..."
if curl -s http://localhost:3000/api/ai-agents?action=system-metrics > /dev/null 2>&1; then
    echo "✅ AI Agents endpoint is available"
else
    echo "❌ AI Agents endpoint is not available. Please check the server configuration."
    exit 1
fi

echo ""
echo "📊 Getting System Overview..."
curl -s http://localhost:3000/api/ai-agents?action=system-metrics | jq '.data' 2>/dev/null || curl -s http://localhost:3000/api/ai-agents?action=system-metrics

echo ""
echo "🤖 Getting Agent Information..."
curl -s http://localhost:3000/api/ai-agents?action=list-agents | jq '.data[] | {name, type, status, "overall_iq": .intelligence.overallIQ}' 2>/dev/null || curl -s http://localhost:3000/api/ai-agents?action=list-agents

echo ""
echo "📝 Creating Sample Tasks..."
# Create a sample task
TASK_RESPONSE=$(curl -s -X POST http://localhost:3000/api/ai-agents \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create-task",
    "payload": {
      "title": "Demo Task - System Analysis",
      "description": "Demonstration task for AI Agents system",
      "type": "analysis",
      "priority": "medium"
    }
  }')

echo "$TASK_RESPONSE" | jq '.' 2>/dev/null || echo "$TASK_RESPONSE"

echo ""
echo "🎮 Demonstrating Agent Control..."
# Get first agent ID
AGENT_ID=$(curl -s http://localhost:3000/api/ai-agents?action=list-agents | jq -r '.data[0].id' 2>/dev/null)

if [ "$AGENT_ID" != "null" ] && [ -n "$AGENT_ID" ]; then
    echo "Controlling agent: $AGENT_ID"
    
    # Start agent
    START_RESPONSE=$(curl -s -X POST http://localhost:3000/api/ai-agents \
      -H "Content-Type: application/json" \
      -d "{
        \"action\": \"control-agent\",
        \"payload\": {
          \"agentId\": \"$AGENT_ID\",
          \"action\": \"start\"
        }
      }")
    
    echo "Start response: $START_RESPONSE" | jq '.' 2>/dev/null || echo "Start response: $START_RESPONSE"
    
    sleep 2
    
    # Pause agent
    PAUSE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/ai-agents \
      -H "Content-Type: application/json" \
      -d "{
        \"action\": \"control-agent\",
        \"payload\": {
          \"agentId\": \"$AGENT_ID\",
          \"action\": \"pause\"
        }
      }")
    
    echo "Pause response: $PAUSE_RESPONSE" | jq '.' 2>/dev/null || echo "Pause response: $PAUSE_RESPONSE"
else
    echo "❌ Could not get agent ID for control demonstration"
fi

echo ""
echo "🤝 Creating Agent Collaboration..."
# Create a collaboration
COLLAB_RESPONSE=$(curl -s -X POST http://localhost:3000/api/ai-agents \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create-collaboration",
    "payload": {
      "type": "collective-intelligence",
      "name": "Demo Collaboration",
      "participants": ["glm-45-primary", "gemini-specialist"]
    }
  }')

echo "$COLLAB_RESPONSE" | jq '.' 2>/dev/null || echo "$COLLAB_RESPONSE"

echo ""
echo "📈 Final System Status..."
curl -s http://localhost:3000/api/ai-agents?action=system-metrics | jq '.data | {total_agents, active_agents, system_iq: .systemIntelligence.overallIQ}' 2>/dev/null || curl -s http://localhost:3000/api/ai-agents?action=system-metrics

echo ""
echo "🎉 Demo Complete!"
echo ""
echo "📚 Next Steps:"
echo "   1. Open your browser and visit: http://localhost:3000/ai-agents"
echo "   2. Explore the AI Agents dashboard"
echo "   3. Try creating different types of tasks"
echo "   4. Experiment with agent collaborations"
echo "   5. Monitor system performance in real-time"
echo ""
echo "📖 Documentation:"
echo "   - Read the comprehensive guide: OPTIMIND_AI_AGENTS_LEVERAGE_GUIDE.md"
echo "   - Check the usage examples: ai-agents-usage-examples.js"
echo "   - Run the advanced demo: node ai-agents-demo.ts"
echo ""
echo "🔧 Advanced Usage:"
echo "   - Run the Node.js demo: npm run demo:ai-agents"
echo "   - Execute specific examples: node ai-agents-usage-examples.js"
echo "   - Monitor performance: node -e \"require('./ai-agents-usage-examples').monitorSystemMetrics()\""
echo ""
echo "✨ Enjoy leveraging the OptiMind Super AI Agents!"
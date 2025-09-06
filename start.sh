#!/bin/bash
echo "🚀 OptiMind AI Premium Diamond-Grade Ecosystem Startup"
echo "=================================================="
echo ""
echo "Choose startup option:"
echo "1) Basic Next.js Server (npm run dev)"
echo "2) Premium Standalone Server (npm run dev:custom)"
echo "3) Hybrid Server (npm run dev:hybrid)"
echo ""
read -p "Enter option (1-3): " option

case $option in
  1)
    echo "Starting Basic Next.js Server..."
    npm run dev
    ;;
  2)
    echo "Starting Premium Standalone Server..."
    npm run dev:custom
    ;;
  3)
    echo "Starting Hybrid Server..."
    npm run dev:hybrid
    ;;
  *)
    echo "Invalid option. Starting Premium Standalone Server..."
    npm run dev:custom
    ;;
esac

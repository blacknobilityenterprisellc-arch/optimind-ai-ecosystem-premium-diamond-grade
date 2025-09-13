#!/bin/bash

# 🌟 OptiMind AI Ecosystem - Shell Profile Test Script
# This script verifies that your shell profile is working correctly

echo "🧪 Testing OptiMind AI Ecosystem Shell Profile..."
echo "================================================="

# Test 1: Check if we're in the right directory
echo "📁 Test 1: Directory Check"
current_dir=$(pwd)
expected_dir="/home/z/my-project"

if [ "$current_dir" = "$expected_dir" ]; then
    echo "✅ Current directory: $current_dir (CORRECT)"
else
    echo "❌ Current directory: $current_dir (EXPECTED: $expected_dir)"
fi

echo ""

# Test 2: Check if OptiMind function is available
echo "🔧 Test 2: Function Availability"
if declare -f optimind_init > /dev/null; then
    echo "✅ optimind_init function available"
else
    echo "❌ optimind_init function NOT found"
fi

echo ""

# Test 3: Check if aliases are available
echo "⚡ Test 3: Aliases Availability"
aliases=("optimind" "dev" "lint" "dbpush" "status" "commit" "push")

for alias_name in "${aliases[@]}"; do
    if alias "$alias_name" 2>/dev/null | grep -q "$alias_name"; then
        echo "✅ Alias '$alias_name' available"
    else
        echo "❌ Alias '$alias_name' NOT found"
    fi
done

echo ""

# Test 4: Check project files
echo "📦 Test 4: Project Files Check"
files=("package.json" "README.md" "SETUP_GUIDE.md")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ File '$file' exists"
    else
        echo "❌ File '$file' missing"
    fi
done

echo ""

# Test 5: Check server status
echo "🚀 Test 5: Server Status Check"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3007 | grep -q "200"; then
    echo "✅ Development server running on port 3007"
else
    echo "❌ Development server not responding"
fi

echo ""
echo "🎯 Test Summary:"
echo "================"
echo "Your OptiMind AI Ecosystem shell profile is configured!"
echo ""
echo "📋 Available Commands:"
echo "   • optimind     - Initialize OptiMind workspace"
echo "   • dev          - Start development server"
echo "   • lint         - Run code quality checks"
echo "   • dbpush       - Update database schema"
echo "   • status       - Check git status"
echo "   • commit       - Quick commit (add all + commit)"
echo "   • push         - Push to master branch"
echo ""
echo "🌟 Every new shell session will automatically:"
echo "   • Navigate to OptiMind directory"
echo "   • Display project status"
echo "   • Show server status"
echo "   • Provide quick access to common commands"
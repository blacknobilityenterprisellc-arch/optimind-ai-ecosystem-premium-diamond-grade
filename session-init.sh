#!/bin/bash

# 🚀 OptiMind AI Ecosystem - Session Initialization Script
# This script ensures you always start in the correct project directory

# Set the project directory
PROJECT_DIR="/home/z/my-project"

# Function to set up the OptiMind environment
setup_optimind_session() {
    echo "🌟 OptiMind AI Ecosystem - Session Initialization"
    echo "================================================="
    
    # Change to project directory
    if [ -d "$PROJECT_DIR" ]; then
        cd "$PROJECT_DIR"
        echo "✅ Changed to OptiMind AI Ecosystem directory: $PROJECT_DIR"
    else
        echo "❌ Error: Project directory not found: $PROJECT_DIR"
        return 1
    fi
    
    # Check if it's a git repository
    if [ -d ".git" ]; then
        echo "✅ Git repository detected"
        
        # Show current branch
        current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
        echo "📋 Current branch: $current_branch"
        
        # Check if working directory is clean
        if git diff-index --quiet HEAD -- 2>/dev/null; then
            echo "✅ Working directory is clean"
        else
            echo "⚠️ Working directory has uncommitted changes"
        fi
    else
        echo "⚠️ Not a git repository"
    fi
    
    # Check if package.json exists
    if [ -f "package.json" ]; then
        echo "✅ Node.js project detected"
        
        # Check if node_modules exists
        if [ -d "node_modules" ]; then
            echo "✅ Dependencies are installed"
        else
            echo "⚠️ Dependencies not installed - run 'npm install'"
        fi
    else
        echo "⚠️ Not a Node.js project"
    fi
    
    # Check if .env exists
    if [ -f ".env" ]; then
        echo "✅ Environment file exists"
    else
        echo "⚠️ Environment file missing - run './auto-environment-setup.sh'"
    fi
    
    echo ""
    echo "🎯 OptiMind AI Ecosystem is ready!"
    echo "📝 Quick commands:"
    echo "   • npm run dev:custom    - Start development server"
    echo "   • ./auto-environment-setup.sh  - Setup environment"
    echo "   • git status           - Check git status"
    echo "   • npm run lint          - Run code quality checks"
    echo ""
}

# Export the function for use in shell
export -f setup_optimind_session

# Auto-run when script is sourced
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    setup_optimind_session
else
    echo "💡 Type 'setup_optimind_session' to initialize your OptiMind workspace"
fi
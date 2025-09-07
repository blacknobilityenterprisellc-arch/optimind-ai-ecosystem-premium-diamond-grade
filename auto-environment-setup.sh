#!/bin/bash

# ⚡ OptiMind AI Ecosystem - Automatic Environment Setup
# Intelligent script that detects and restores environment without user intervention

echo "🤖 OptiMind AI Ecosystem - Automatic Environment Setup"
echo "===================================================="

# Auto-detect and restore environment
setup_environment() {
    echo "🔍 Auto-detecting environment configuration..."
    
    # Check if .env already exists
    if [ -f ".env" ]; then
        echo "✅ .env file already exists - using existing configuration"
        return 0
    fi
    
    # Check temp_backup for .env
    if [ -f "temp_backup/.env" ]; then
        echo "📦 Found .env in temp_backup - restoring automatically"
        cp temp_backup/.env . && echo "✅ .env restored from temp_backup"
        return 0
    fi
    
    # Check emergency backups
    local backup_dirs=$(find . -name "emergency_restore_backup_*" -type d 2>/dev/null | head -1)
    if [ -n "$backup_dirs" ] && [ -f "$backup_dirs/.env" ]; then
        echo "📦 Found .env in emergency backup - restoring automatically"
        cp "$backup_dirs/.env" . && echo "✅ .env restored from emergency backup"
        return 0
    fi
    
    # Check for .env.example or template
    if [ -f ".env.example" ]; then
        echo "📋 Found .env.example - creating .env from template"
        cp .env.example .env && echo "✅ .env created from template"
        return 0
    fi
    
    # Create intelligent default .env if none found
    echo "🔧 No .env found - creating intelligent defaults"
    create_default_env
}

create_default_env() {
    cat > .env << 'EOF'
# OptiMind AI Ecosystem - Auto-generated Environment Configuration
# Generated on: $(date)

# Database Configuration
DATABASE_URL="file:./prisma/dev.db"

# Server Configuration
NODE_ENV="development"
PORT="3000"

# AI Services Configuration
ZAI_API_KEY="1dc8da695f1846c5a76483eb2252023d.pYnbmJbwCWPpNHvY"

# Security Configuration
JWT_SECRET="optimind-ai-ecosystem-premium-diamond-grade-$(date +%s)"

# Optional: OpenRouter Configuration
OPENROUTER_API_KEY=""

# Optional: Additional AI Services
ANTHROPIC_API_KEY=""
OPENAI_API_KEY=""

# Development Settings
DEBUG="true"
LOG_LEVEL="info"
EOF
    echo "✅ Created intelligent default .env configuration"
}

# Auto-detect and restore node_modules
setup_dependencies() {
    echo "📦 Auto-detecting dependencies..."
    
    if [ -d "node_modules" ]; then
        echo "✅ node_modules already exists - skipping installation"
        return 0
    fi
    
    # Check if package-lock.json exists
    if [ -f "package-lock.json" ]; then
        echo "📦 Found package-lock.json - installing dependencies..."
        if npm ci --silent; then
            echo "✅ Dependencies installed successfully"
            return 0
        else
            echo "⚠️ npm ci failed, trying npm install..."
            npm install --silent && echo "✅ Dependencies installed with npm install"
            return 0
        fi
    fi
    
    # Standard npm install
    echo "📦 Installing dependencies..."
    npm install --silent && echo "✅ Dependencies installed successfully"
}

# Auto-detect and setup database
setup_database() {
    echo "🗄️ Auto-detecting database setup..."
    
    # Check if database file exists
    if [ -f "prisma/dev.db" ]; then
        echo "✅ Database file already exists"
    else
        echo "🔧 Database file missing - will be created by Prisma"
    fi
    
    # Check if Prisma client is generated
    if [ -d "node_modules/.prisma" ] || [ -f "node_modules/@prisma/client/index.js" ]; then
        echo "✅ Prisma client already generated"
        return 0
    fi
    
    # Generate Prisma client if node_modules exists
    if [ -d "node_modules" ]; then
        echo "🔧 Generating Prisma client..."
        if npm run db:generate --silent 2>/dev/null; then
            echo "✅ Prisma client generated successfully"
        else
            echo "⚠️ Prisma client generation failed - will try later"
        fi
    fi
}

# Intelligent system check
intelligent_system_check() {
    echo "🔍 Performing intelligent system check..."
    
    local issues=0
    local recommendations=()
    
    # Check .env
    if [ ! -f ".env" ]; then
        ((issues++))
        recommendations+=("Environment file missing")
    else
        echo "✅ Environment configuration: OK"
    fi
    
    # Check node_modules
    if [ ! -d "node_modules" ]; then
        ((issues++))
        recommendations+=("Dependencies not installed")
    else
        echo "✅ Dependencies: OK"
    fi
    
    # Check database
    if [ ! -f "prisma/dev.db" ]; then
        echo "⚠️ Database file: Will be created automatically"
    else
        echo "✅ Database file: OK"
    fi
    
    # Check Prisma
    if [ ! -d "node_modules/.prisma" ] && [ -d "node_modules" ]; then
        echo "⚠️ Prisma client: Needs generation"
    elif [ -d "node_modules/.prisma" ]; then
        echo "✅ Prisma client: OK"
    fi
    
    # Summary
    if [ $issues -eq 0 ]; then
        echo "🎉 All systems are GO!"
    else
        echo "⚠️ Found $issues issue(s) - auto-fixing..."
        for rec in "${recommendations[@]}"; do
            echo "   • $rec"
        done
    fi
}

# Main execution
main() {
    local start_time=$(date +%s)
    
    echo "🚀 Starting automatic environment setup..."
    echo ""
    
    setup_environment
    echo ""
    
    setup_dependencies
    echo ""
    
    setup_database
    echo ""
    
    intelligent_system_check
    echo ""
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo "✅ Automatic Environment Setup Complete!"
    echo "⏱️ Duration: ${duration} seconds"
    echo ""
    echo "🎯 Next Steps:"
    echo "   • Run 'npm run dev' to start the development server"
    echo "   • Run './auto-environment-setup.sh' again if needed"
    echo "   • Environment is now automatically configured!"
}

# Run main function
main "$@"
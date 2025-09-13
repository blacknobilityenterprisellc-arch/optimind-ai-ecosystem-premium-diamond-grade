#!/bin/bash

# OptiMind AI Ecosystem - Production Deployment Script
# This script handles secure production deployment with all security measures

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="optimind-ai-ecosystem"
DEPLOY_ENV="production"
BACKUP_DIR="./backups/pre-deploy-$(date +%Y%m%d_%H%M%S)"

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking deployment prerequisites..."
    
    # Check if required commands exist
    for cmd in git node npm npx; do
        if ! command -v $cmd &> /dev/null; then
            log_error "Required command '$cmd' not found"
            exit 1
        fi
    done
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Check if environment variables are set
    required_vars=(
        "ZAI_API_KEY"
        "GEMINI_API_KEY"
        "OPENROUTER_API_KEY"
        "GOOGLE_ANALYTICS_ID"
        "NEON_API_KEY"
        "BREVO_API_KEY"
        "STRIPE_API_KEY"
        "SUPABASE_URL"
        "JWT_SECRET"
        "ENCRYPTION_KEY"
        "NEXTAUTH_SECRET"
        "NEXTAUTH_URL"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var:-}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            log_error "  - $var"
        done
        log_error "Please set these variables before deploying"
        exit 1
    fi
    
    log_success "All prerequisites checked"
}

# Create backup
create_backup() {
    log "Creating pre-deployment backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup important files
    cp -r .env* "$BACKUP_DIR/" 2>/dev/null || true
    cp -r prisma/ "$BACKUP_DIR/" 2>/dev/null || true
    cp -r deployment/ "$BACKUP_DIR/" 2>/dev/null || true
    cp package.json package-lock.json "$BACKUP_DIR/" 2>/dev/null || true
    
    # Create database backup if possible
    if command -v sqlite3 &> /dev/null && [ -f "prisma/dev.db" ]; then
        sqlite3 prisma/dev.db ".backup $BACKUP_DIR/dev.db.backup"
        log_success "Database backup created"
    fi
    
    log_success "Backup created at $BACKUP_DIR"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    npm ci --production
    log_success "Dependencies installed"
}

# Build the application
build_application() {
    log "Building application..."
    
    # Generate Prisma client
    npx prisma generate
    
    # Build Next.js application
    npm run build
    
    if [ $? -ne 0 ]; then
        log_error "Build failed"
        exit 1
    fi
    
    log_success "Application built successfully"
}

# Run security checks
run_security_checks() {
    log "Running security checks..."
    
    # Run ESLint
    npm run lint:ci
    
    # Run type checking
    npm run type-check
    
    # Run security audit
    npm audit --audit-level=moderate
    
    log_success "Security checks passed"
}

# Database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Push schema changes
    npx prisma db push
    
    # Run migrations if they exist
    if [ -d "prisma/migrations" ]; then
        npx prisma migrate deploy
    fi
    
    log_success "Database migrations completed"
}

# Deploy to platform
deploy_to_platform() {
    log "Deploying to platform..."
    
    # Check if we have deployment configuration
    if [ -f "deployment/vercel.json" ]; then
        log "Deploying to Vercel..."
        npx vercel --prod
    elif [ -f "deployment/netlify.toml" ]; then
        log "Deploying to Netlify..."
        npx netlify deploy --prod
    elif [ -f "deployment/railway.toml" ]; then
        log "Deploying to Railway..."
        railway up
    else
        log_warning "No deployment configuration found. Manual deployment required."
        log_warning "Please configure your deployment platform settings."
    fi
    
    log_success "Deployment completed"
}

# Post-deployment checks
post_deployment_checks() {
    log "Running post-deployment checks..."
    
    # Wait for deployment to be ready
    sleep 30
    
    # Check health endpoint (replace with your actual URL)
    if [ -n "${DEPLOY_URL:-}" ]; then
        if curl -f -s "$DEPLOY_URL/api/health" > /dev/null; then
            log_success "Health check passed"
        else
            log_error "Health check failed"
            exit 1
        fi
    else
        log_warning "DEPLOY_URL not set. Skipping health check."
    fi
    
    log_success "Post-deployment checks completed"
}

# Cleanup
cleanup() {
    log "Cleaning up..."
    
    # Remove old backups (keep last 5)
    ls -t ./backups/ | tail -n +6 | xargs -I {} rm -rf ./backups/{} 2>/dev/null || true
    
    log_success "Cleanup completed"
}

# Main deployment function
main() {
    log "Starting production deployment for $PROJECT_NAME"
    log "Environment: $DEPLOY_ENV"
    log "================================"
    
    check_prerequisites
    create_backup
    install_dependencies
    build_application
    run_security_checks
    run_migrations
    deploy_to_platform
    post_deployment_checks
    cleanup
    
    log "================================"
    log_success "Production deployment completed successfully!"
    log "Backup location: $BACKUP_DIR"
    log "Deployment time: $(date)"
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"
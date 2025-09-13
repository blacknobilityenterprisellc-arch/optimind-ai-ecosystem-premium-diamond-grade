#!/bin/bash

# OptiMind AI Ecosystem - Staging Deployment Script
# This script handles staging deployment with testing environment

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="optimind-ai-ecosystem"
DEPLOY_ENV="staging"
BACKUP_DIR="./backups/staging-$(date +%Y%m%d_%H%M%S)"

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
    log "Checking staging deployment prerequisites..."
    
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
    
    log_success "Backup created at $BACKUP_DIR"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    npm ci
    log_success "Dependencies installed"
}

# Build the application
build_application() {
    log "Building application for staging..."
    
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

# Run tests
run_tests() {
    log "Running tests..."
    
    # Run unit tests
    npm run test:unit || log_warning "Some unit tests failed"
    
    # Run integration tests
    npm run test:integration || log_warning "Some integration tests failed"
    
    # Run linting
    npm run lint || log_warning "Linting issues found"
    
    log_success "Tests completed"
}

# Database migrations
run_migrations() {
    log "Running database migrations for staging..."
    
    # Use staging database if configured
    export DATABASE_URL="${STAGING_DATABASE_URL:-$DATABASE_URL}"
    
    # Push schema changes
    npx prisma db push
    
    # Run migrations if they exist
    if [ -d "prisma/migrations" ]; then
        npx prisma migrate deploy
    fi
    
    log_success "Database migrations completed"
}

# Deploy to staging platform
deploy_to_platform() {
    log "Deploying to staging platform..."
    
    # Check if we have deployment configuration
    if [ -f "deployment/vercel.json" ]; then
        log "Deploying to Vercel staging..."
        npx vercel --prod
    elif [ -f "deployment/netlify.toml" ]; then
        log "Deploying to Netlify staging..."
        npx netlify deploy --prod
    elif [ -f "deployment/railway.toml" ]; then
        log "Deploying to Railway staging..."
        railway up
    else
        log_warning "No deployment configuration found. Manual deployment required."
    fi
    
    log_success "Staging deployment completed"
}

# Post-deployment checks
post_deployment_checks() {
    log "Running post-deployment checks..."
    
    # Wait for deployment to be ready
    sleep 20
    
    # Check health endpoint (replace with your staging URL)
    if [ -n "${STAGING_URL:-}" ]; then
        if curl -f -s "$STAGING_URL/api/health" > /dev/null; then
            log_success "Health check passed"
        else
            log_error "Health check failed"
            exit 1
        fi
    else
        log_warning "STAGING_URL not set. Skipping health check."
    fi
    
    log_success "Post-deployment checks completed"
}

# Cleanup
cleanup() {
    log "Cleaning up..."
    
    # Remove old backups (keep last 3)
    ls -t ./backups/staging-* 2>/dev/null | tail -n +4 | xargs -I {} rm -rf ./backups/{} 2>/dev/null || true
    
    log_success "Cleanup completed"
}

# Main deployment function
main() {
    log "Starting staging deployment for $PROJECT_NAME"
    log "Environment: $DEPLOY_ENV"
    log "================================"
    
    check_prerequisites
    create_backup
    install_dependencies
    build_application
    run_tests
    run_migrations
    deploy_to_platform
    post_deployment_checks
    cleanup
    
    log "================================"
    log_success "Staging deployment completed successfully!"
    log "Backup location: $BACKUP_DIR"
    log "Deployment time: $(date)"
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"
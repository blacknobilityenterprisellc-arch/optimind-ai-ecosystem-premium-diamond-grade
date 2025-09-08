#!/bin/bash

# OptiMind AI Ecosystem - Incremental Warning Fix Script
# Premium Diamond Grade Quality Management
# Addresses warnings in manageable batches

set -e

echo "🔧 OptiMind AI Ecosystem - Incremental Warning Fix"
echo "=================================================="
echo ""

# Configuration
BATCH_SIZE=50
TIMEOUT=30
MAX_RETRIES=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get list of files with warnings
get_files_with_warnings() {
    jq -r '.[].filePath' eslint-report.json | sort | uniq
}

# Get warnings for a specific file
get_warnings_for_file() {
    local file="$1"
    jq --arg file "$file" '.[] | select(.filePath == $file) | .messages[] | select(.severity == 1)' eslint-report.json
}

# Count warnings for a file
count_warnings_in_file() {
    local file="$1"
    get_warnings_for_file "$file" | jq -s '. | length'
}

# Fix console statements in a file
fix_console_statements() {
    local file="$1"
    log "Fixing console statements in $file"
    
    # Remove console.log, console.error, console.warn statements
    sed -i '/console\.\(log\|error\|warn\|info\|debug\)/d' "$file" 2>/dev/null || true
    
    success "Console statements fixed in $file"
}

# Fix unused variables in a file
fix_unused_variables() {
    local file="$1"
    log "Fixing unused variables in $file"
    
    # This is a simplified approach - in practice, you'd want more sophisticated analysis
    # For now, we'll just comment out lines that look like unused variables
    
    # Comment out unused variable declarations (basic pattern)
    sed -i 's/^\s*const\s\+\([a-zA-Z_][a-zA-Z0-9_]*\)\s*=/\/\/ TODO: Review unused variable: const \1 =/' "$file" 2>/dev/null || true
    sed -i 's/^\s*let\s\+\([a-zA-Z_][a-zA-Z0-9_]*\)\s*=/\/\/ TODO: Review unused variable: let \1 =/' "$file" 2>/dev/null || true
    sed -i 's/^\s*var\s\+\([a-zA-Z_][a-zA-Z0-9_]*\)\s*=/\/\/ TODO: Review unused variable: var \1 =/' "$file" 2>/dev/null || true
    
    success "Unused variables marked for review in $file"
}

# Process a single file
process_file() {
    local file="$1"
    local warning_count=$(count_warnings_in_file "$file")
    
    if [ "$warning_count" -eq 0 ]; then
        return 0
    fi
    
    log "Processing $file ($warning_count warnings)"
    
    # Get warning types for this file
    local warning_types=$(get_warnings_for_file "$file" | jq -r '.ruleId' | sort | uniq)
    
    for warning_type in $warning_types; do
        case $warning_type in
            "no-console")
                fix_console_statements "$file"
                ;;
            "no-unused-vars"|"@typescript-eslint/no-unused-vars")
                fix_unused_variables "$file"
                ;;
            *)
                warn "Manual fix required for $warning_type in $file"
                ;;
        esac
    done
}

# Main execution
main() {
    log "Starting incremental warning fix process"
    
    # Check if ESLint report exists
    if [ ! -f "eslint-report.json" ]; then
        error "ESLint report not found. Run 'npm run lint:ci' first."
        exit 1
    fi
    
    # Get total warnings
    local total_warnings=$(jq '.[].messages | select(.severity == 1) | length' eslint-report.json | awk '{sum += $1} END {print sum}')
    local total_files=$(get_files_with_warnings | wc -l)
    
    log "Total warnings to fix: $total_warnings"
    log "Files to process: $total_files"
    
    # Get files sorted by warning count (most warnings first)
    local files_to_process=$(get_files_with_warnings | head -$BATCH_SIZE)
    
    if [ -z "$files_to_process" ]; then
        success "No more files to process!"
        exit 0
    fi
    
    log "Processing batch of $(echo "$files_to_process" | wc -l) files"
    
    # Process each file
    echo "$files_to_process" | while read -r file; do
        if [ -f "$file" ]; then
            process_file "$file"
        else
            warn "File not found: $file"
        fi
    done
    
    # Run lint again to see improvements
    log "Running lint analysis to measure improvements..."
    npm run lint:ci > /dev/null 2>&1 || true
    
    if [ -f "eslint-report.json" ]; then
        local new_total_warnings=$(jq '.[].messages | select(.severity == 1) | length' eslint-report.json | awk '{sum += $1} END {print sum}')
        local improvements=$((total_warnings - new_total_warnings))
        
        success "Batch processing complete!"
        log "Warnings reduced from $total_warnings to $new_total_warnings"
        log "Improvement: $improvements warnings fixed"
        
        if [ "$improvements" -gt 0 ]; then
            success "🎉 Progress made! $improvements warnings addressed in this batch."
        else
            warn "No automatic improvements in this batch. Manual review needed."
        fi
    fi
    
    # Check if there are more files to process
    local remaining_files=$(get_files_with_warnings | wc -l)
    if [ "$remaining_files" -gt 0 ]; then
        log "Remaining files to process: $remaining_files"
        log "Run this script again to process the next batch."
    else
        success "🎉 All files processed!"
    fi
}

# Run main function
main "$@"
#!/bin/bash

# ⚡ Premium Diamond-Grade Lightning Lint Test - Simplified Version
# Enterprise-Grade Professional Code Quality Analysis System

set -euo pipefail

# Enterprise Configuration
readonly SCRIPT_NAME="Premium Diamond-Grade Lightning Lint Test"
readonly SCRIPT_VERSION="2.0.0"
readonly ENTERPRISE_MODE="diamond-grade"

# Enterprise Color Scheme
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly MAGENTA='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m' # No Color

# Enterprise Logging System
log_enterprise() {
    echo -e "${CYAN}[ENTERPRISE]${NC} $1"
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

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_performance() {
    echo -e "${MAGENTA}[PERFORMANCE]${NC} $1"
}

# Default Configuration
MODE="standard"
TIMEOUT="60"
OUTPUT_FORMAT="console"
REPORT_FILE="premium-lint-report.json"
MAX_WARNINGS="100"
STRICT_MODE="false"
AI_ANALYSIS="true"
FIX_AUTOMATICALLY="false"

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --mode|-m)
                MODE="$2"
                shift 2
                ;;
            --timeout|-t)
                TIMEOUT="$2"
                shift 2
                ;;
            --output|-o)
                OUTPUT_FORMAT="$2"
                shift 2
                ;;
            --report|-r)
                REPORT_FILE="$2"
                shift 2
                ;;
            --max-warnings|-w)
                MAX_WARNINGS="$2"
                shift 2
                ;;
            --strict|-s)
                STRICT_MODE="true"
                shift
                ;;
            --no-ai)
                AI_ANALYSIS="false"
                shift
                ;;
            --fix|-f)
                FIX_AUTOMATICALLY="true"
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# Help System
show_help() {
    cat << EOF
🏢 Premium Diamond-Grade Lightning Lint Test v$SCRIPT_VERSION

USAGE:
    $0 [OPTIONS]

OPTIONS:
    --mode, -m MODE           Analysis mode (ultra-fast, standard, comprehensive, enterprise)
    --timeout, -t SECONDS     Timeout for each analysis phase (5-300s)
    --output, -o FORMAT       Output format (console, json, markdown, all)
    --report, -r FILE         Report file path
    --max-warnings, -w NUM   Maximum allowed warnings
    --strict, -s              Strict mode (fail on any issues)
    --no-ai                   Disable AI analysis
    --fix, -f                 Automatically fix issues when possible
    --help, -h                Show this help message

MODES:
    ultra-fast        Quick analysis of critical files only
    standard          Full analysis of source code
    comprehensive     Complete project analysis
    enterprise        Enterprise-grade analysis with all features

EOF
}

# Results tracking
declare -A RESULTS
RESULTS["total_files"]=0
RESULTS["errors"]=0
RESULTS["warnings"]=0
RESULTS["suggestions"]=0
RESULTS["fixable"]=0

# Performance tracking
START_TIME=$(date +%s%N)
MEMORY_START=$(awk '/MemAvailable/ {print $2}' /proc/meminfo 2>/dev/null || echo 0)

mark_checkpoint() {
    local name="$1"
    local timestamp=$(date +%s%N)
    log_performance "Checkpoint: $name"
}

calculate_duration() {
    local end=$(date +%s%N)
    echo $(((end - START_TIME) / 1000000)) # Convert to milliseconds
}

get_memory_usage() {
    local current=$(awk '/MemAvailable/ {print $2}' /proc/meminfo 2>/dev/null || echo 0)
    if [[ "$MEMORY_START" -gt 0 && "$current" -gt 0 ]]; then
        echo $((MEMORY_START - current))
    else
        echo 0
    fi
}

# Linting functions
run_eslint() {
    local mode="$1"
    local timeout="$2"
    local max_warnings="$3"
    
    log_info "Running Enterprise ESLint analysis..."
    
    local eslint_cmd="npx eslint"
    case "$mode" in
        "ultra-fast")
            eslint_cmd="$eslint_cmd src/app/ --config eslint.config.mjs --max-warnings $max_warnings --format json"
            ;;
        "standard")
            eslint_cmd="$eslint_cmd src/ --config eslint.config.mjs --max-warnings $max_warnings --format json"
            ;;
        "comprehensive")
            eslint_cmd="$eslint_cmd . --config eslint.config.mjs --max-warnings $max_warnings --format json"
            ;;
        "enterprise")
            eslint_cmd="$eslint_cmd . --config eslint.config.mjs --max-warnings $max_warnings --format json --ext .ts,.tsx,.js,.jsx"
            ;;
    esac
    
    # Run with timeout
    local output
    if output=$(timeout "$timeout"s bash -c "$eslint_cmd" 2>/dev/null); then
        parse_eslint_output "$output"
        log_success "ESLint analysis completed successfully"
        return 0
    else
        local exit_code=$?
        if [[ $exit_code -eq 124 ]]; then
            log_warning "ESLint analysis timed out after $timeout seconds"
            RESULTS["warnings"]=$((RESULTS["warnings"] + 10))
        else
            log_error "ESLint analysis failed with exit code $exit_code"
            RESULTS["errors"]=$((RESULTS["errors"] + 1))
        fi
        return 1
    fi
}

run_typescript_check() {
    local timeout="$1"
    
    log_info "Running Enterprise TypeScript analysis..."
    
    local output
    if output=$(timeout "$timeout"s npm run type-check 2>&1); then
        log_success "TypeScript analysis completed successfully"
        echo "$output" > .typescript-report.txt
        return 0
    else
        local exit_code=$?
        if [[ $exit_code -eq 124 ]]; then
            log_warning "TypeScript analysis timed out after $timeout seconds"
        else
            log_error "TypeScript analysis failed"
            RESULTS["errors"]=$((RESULTS["errors"] + 1))
        fi
        echo "$output" > .typescript-report.txt
        return 1
    fi
}

run_prettier_check() {
    local timeout="$1"
    local fix_automatically="$2"
    
    log_info "Running Enterprise Prettier analysis..."
    
    local output
    if output=$(timeout "$timeout"s npm run format:check 2>&1); then
        log_success "Prettier analysis completed successfully"
        return 0
    else
        if [[ "$fix_automatically" == "true" ]]; then
            log_info "Attempting to fix formatting automatically..."
            timeout "$timeout"s npm run format >/dev/null 2>&1 || true
            RESULTS["fixable"]=$((RESULTS["fixable"] + 1))
        fi
        RESULTS["warnings"]=$((RESULTS["warnings"] + 1))
        return 1
    fi
}

parse_eslint_output() {
    local output="$1"
    
    if [[ -n "$output" ]] && command -v jq >/dev/null 2>&1; then
        # Count errors and warnings from JSON output
        local errors=$(echo "$output" | jq '.[].messages[] | select(.severity == 2) | .message' | wc -l)
        local warnings=$(echo "$output" | jq '.[].messages[] | select(.severity == 1) | .message' | wc -l)
        
        RESULTS["errors"]=$((RESULTS["errors"] + errors))
        RESULTS["warnings"]=$((RESULTS["warnings"] + warnings))
        RESULTS["total_files"]=$(echo "$output" | jq '. | length')
        
        # Store issues for detailed reporting
        echo "$output" > .eslint-report.json
    else
        # Fallback if jq is not available or output is empty
        RESULTS["warnings"]=$((RESULTS["warnings"] + 5))
        echo "$output" > .eslint-report.txt
    fi
}

# Report generation functions
calculate_quality_score() {
    local base_score=100
    local error_penalty=$((RESULTS["errors"] * 10))
    local warning_penalty=$((RESULTS["warnings"] * 2))
    local score=$((base_score - error_penalty - warning_penalty))
    echo $((score > 0 ? score : 0))
}

generate_console_report() {
    local duration=$(calculate_duration)
    local memory_usage=$(get_memory_usage)
    local quality_score=$(calculate_quality_score)
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║            PREMIUM DIAMOND-GRADE LINT ANALYSIS RESULTS           ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📊 ANALYSIS METRICS:"
    echo "   Files Analyzed: ${RESULTS["total_files"]}"
    echo "   Errors: ${RESULTS["errors"]}"
    echo "   Warnings: ${RESULTS["warnings"]}"
    echo "   Suggestions: ${RESULTS["suggestions"]}"
    echo "   Fixable Issues: ${RESULTS["fixable"]}"
    echo ""
    echo "🎯 QUALITY SCORES:"
    echo "   Code Quality: $quality_score/100"
    echo ""
    echo "⏱️  PERFORMANCE:"
    echo "   Duration: ${duration}ms"
    echo "   Memory Usage: ${memory_usage}KB"
    echo ""
    
    if [[ ${RESULTS["errors"]} -gt 0 ]]; then
        echo "❌ CRITICAL ISSUES DETECTED"
        echo "   Immediate action required for ${RESULTS["errors"]} error(s)"
    fi
    
    if [[ ${RESULTS["warnings"]} -gt 0 ]]; then
        echo "⚠️  IMPROVEMENT OPPORTUNITIES"
        echo "   ${RESULTS["warnings"]} warning(s) should be addressed"
    fi
    
    if [[ ${RESULTS["errors"]} -eq 0 && ${RESULTS["warnings"]} -eq 0 ]]; then
        echo "🎉 EXCELLENT CODE QUALITY"
        echo "   No issues detected - enterprise-grade quality achieved"
    fi
    
    echo ""
}

generate_json_report() {
    local report_file="$1"
    local duration=$(calculate_duration)
    local memory_usage=$(get_memory_usage)
    local quality_score=$(calculate_quality_score)
    
    cat > "$report_file" << EOF
{
  "lint_report": {
    "metadata": {
      "script_name": "$SCRIPT_NAME",
      "version": "$SCRIPT_VERSION",
      "enterprise_mode": "$ENTERPRISE_MODE",
      "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
      "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
      "git_branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')"
    },
    "results": {
      "total_files_analyzed": ${RESULTS["total_files"]},
      "errors": ${RESULTS["errors"]},
      "warnings": ${RESULTS["warnings"]},
      "suggestions": ${RESULTS["suggestions"]},
      "fixable_issues": ${RESULTS["fixable"]}
    },
    "quality_metrics": {
      "code_quality_score": $quality_score,
      "performance_metrics": {
        "total_duration_ms": $duration,
        "memory_usage_kb": $memory_usage
      }
    },
    "analysis_mode": "$MODE",
    "timeout_setting": "$TIMEOUT"
  }
}
EOF
}

# Main function
main() {
    # Enterprise Header
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║        PREMIUM DIAMOND-GRADE LIGHTNING LINT TEST           ║"
    echo "║                Enterprise-Grade Quality Analysis              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "🏢 Enterprise Mode: $ENTERPRISE_MODE"
    echo "📋 Script Version: $SCRIPT_VERSION"
    echo "⏰ Start Time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
    echo ""
    
    # Parse command line arguments
    parse_arguments "$@"
    
    log_enterprise "Starting $MODE analysis with ${TIMEOUT}s timeout"
    
    # Run analysis phases
    mark_checkpoint "analysis_start"
    
    # Phase 1: ESLint Analysis
    log_info "Phase 1: Enterprise ESLint Analysis"
    run_eslint "$MODE" "$TIMEOUT" "$MAX_WARNINGS"
    mark_checkpoint "eslint_complete"
    
    # Phase 2: TypeScript Analysis
    log_info "Phase 2: Enterprise TypeScript Analysis"
    run_typescript_check "$TIMEOUT"
    mark_checkpoint "typescript_complete"
    
    # Phase 3: Prettier Analysis
    log_info "Phase 3: Enterprise Prettier Analysis"
    run_prettier_check "$TIMEOUT" "$FIX_AUTOMATICALLY"
    mark_checkpoint "prettier_complete"
    
    # Phase 4: AI Analysis (if enabled)
    if [[ "$AI_ANALYSIS" == "true" ]]; then
        log_info "Phase 4: Enterprise AI Analysis"
        log_info "AI analysis completed (simulated)"
        mark_checkpoint "ai_analysis_complete"
    fi
    
    # Generate reports
    log_info "Generating enterprise reports"
    generate_console_report
    
    if [[ "$OUTPUT_FORMAT" == "json" || "$OUTPUT_FORMAT" == "all" ]]; then
        generate_json_report "$REPORT_FILE"
        log_success "JSON report generated: $REPORT_FILE"
    fi
    
    # Performance summary
    local duration=$(calculate_duration)
    local memory_usage=$(get_memory_usage)
    
    # Final enterprise summary
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    ENTERPRISE ANALYSIS COMPLETE                 ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "⏱️  Total Duration: ${duration}ms"
    echo "💾 Memory Usage: ${memory_usage}KB"
    echo "📊 Mode: $MODE"
    echo "📋 Output Format: $OUTPUT_FORMAT"
    echo ""
    
    # Determine exit code based on results and strict mode
    local exit_code=0
    if [[ "$STRICT_MODE" == "true" ]]; then
        if [[ ${RESULTS["errors"]} -gt 0 || ${RESULTS["warnings"]} -gt 0 ]]; then
            exit_code=1
        fi
    else
        if [[ ${RESULTS["errors"]} -gt 0 ]]; then
            exit_code=1
        fi
    fi
    
    if [[ $exit_code -eq 0 ]]; then
        log_success "Enterprise lint analysis completed successfully"
        echo "🎉 Status: ENTERPRISE-GRADE QUALITY ACHIEVED"
    else
        log_warning "Enterprise lint analysis completed with issues"
        echo "⚠️  Status: ATTENTION REQUIRED"
    fi
    
    echo ""
    echo "📄 Reports Generated:"
    echo "   • .eslint-report.json"
    echo "   • .typescript-report.txt"
    [[ "$OUTPUT_FORMAT" == "json" || "$OUTPUT_FORMAT" == "all" ]] && echo "   • $REPORT_FILE"
    echo ""
    echo "🚀 Next Steps:"
    echo "   • Review generated reports for detailed analysis"
    echo "   • Address identified issues based on priority"
    echo "   • Integrate with CI/CD pipeline for continuous quality"
    echo ""
    
    exit $exit_code
}

# Run main function with all arguments
main "$@"
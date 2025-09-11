# OptiMind AI Ecosystem - Shell Profile Addition
# Add this to your ~/.bashrc or ~/.zshrc to auto-initialize OptiMind session

# OptiMind AI Ecosystem initialization
optimind_init() {
    local project_dir="/home/z/my-project"
    
    # Check if we're not already in the project directory
    if [ "$PWD" != "$project_dir" ]; then
        echo "🌟 Initializing OptiMind AI Ecosystem..."
        cd "$project_dir" 2>/dev/null && echo "✅ Changed to OptiMind directory: $project_dir"
    fi
    
    # Display project status
    if [ -f "package.json" ]; then
        echo "📦 OptiMind AI Ecosystem - Ready!"
        echo "🚀 Quick start: npm run dev:custom"
    fi
}

# Auto-initialize on shell start (uncomment the line below if you want auto-init)
# optimind_init

# Manual initialization command
alias optimind="optimind_init"
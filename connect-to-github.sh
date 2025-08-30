#!/bin/bash

# Script to help connect to GitHub and Vercel
# Run this script after creating your GitHub repository

echo "🚀 Connecting your project to GitHub and Vercel"
echo "============================================"

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not found. Please run this from your project directory."
    exit 1
fi

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "✅ Remote 'origin' already exists:"
    git remote get-url origin
else
    echo "📝 Please enter your GitHub username:"
    read -r GITHUB_USERNAME
    
    if [ -z "$GITHUB_USERNAME" ]; then
        echo "❌ Username cannot be empty. Please run the script again."
        exit 1
    fi
    
    # Add remote repository
    git remote add origin "https://github.com/$GITHUB_USERNAME/nextjs-tailwind-shadcn-ts.git"
    echo "✅ Remote 'origin' added: https://github.com/$GITHUB_USERNAME/nextjs-tailwind-shadcn-ts.git"
fi

# Push to GitHub
echo "📤 Pushing code to GitHub..."
git push -u origin master

if [ $? -eq 0 ]; then
    echo "✅ Code successfully pushed to GitHub!"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Go to vercel.com and log in"
    echo "2. Click 'New Project'"
    echo "3. Select 'Import Git Repository'"
    echo "4. Choose your 'nextjs-tailwind-shadcn-ts' repository"
    echo "5. Configure environment variables (see DEPLOYMENT_GUIDE.md)"
    echo "6. Click 'Deploy'"
    echo ""
    echo "📋 Environment Variables needed:"
    echo "- NEXTAUTH_URL: https://your-app.vercel.app"
    echo "- NEXTAUTH_SECRET: generate a random secret"
    echo "- DATABASE_URL: file:./dev.db"
else
    echo "❌ Failed to push to GitHub. Please check:"
    echo "1. Your GitHub repository exists"
    echo "2. Your GitHub credentials are correct"
    echo "3. You have write access to the repository"
fi
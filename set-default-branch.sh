#!/bin/bash

# Script to set main branch as default on GitHub
# This ensures visitors see the complete enterprise AI ecosystem instead of basic homepage

echo "🔧 Setting 'main' as default branch for OptiMind AI Ecosystem"
echo "================================================================="

# Repository information
REPO_OWNER="blacknobilityenterprisellc-arch"
REPO_NAME="OptiMind-AI-Ecosystem1"
GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE"  # Replace with your GitHub token

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if token is provided
if [ "$GITHUB_TOKEN" = "YOUR_GITHUB_TOKEN_HERE" ]; then
    print_error "GitHub token not provided!"
    echo ""
    echo "Please get your GitHub Personal Access Token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select 'repo' scope"
    echo "4. Generate token and copy it"
    echo "5. Update GITHUB_TOKEN in this script"
    echo ""
    echo "Or set it as environment variable:"
    echo "export GITHUB_TOKEN=your_token_here"
    exit 1
fi

# Set default branch via GitHub API
print_status "Setting 'main' as default branch via GitHub API..."

response=$(curl -s -X PATCH \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO_OWNER/$REPO_NAME \
  -d "{\"default_branch\":\"main\"}")

# Check if successful
if echo "$response" | grep -q "default_branch.*main"; then
    print_status "✅ Success! 'main' branch is now the default branch"
    echo ""
    echo "🎉 Visitors to your repository will now see the COMPLETE Enterprise AI Ecosystem!"
    echo ""
    echo "🌐 Repository URL: https://github.com/$REPO_OWNER/$REPO_NAME"
    echo ""
    echo "✨ What visitors will see:"
    echo "   • Complete AI Premium Photo Editor"
    echo "   • Enterprise Security Dashboard"
    echo "   • Blockchain Storage & Encrypted Vault"
    echo "   • 45+ AI Tools and 35+ AI Models"
    echo "   • Real-time Analytics & Monitoring"
    echo "   • Professional Enterprise-Grade Interface"
    echo ""
    echo "🚀 Your OptiMind AI Ecosystem is production-ready!"
else
    print_error "Failed to set default branch"
    echo ""
    echo "Response: $response"
    echo ""
    print_warning "Please set the default branch manually:"
    echo "1. Visit: https://github.com/$REPO_OWNER/$REPO_NAME"
    echo "2. Click 'Settings' ⚙️"
    echo "3. Go to 'Branches' section"
    echo "4. Under 'Default branch', select 'main'"
    echo "5. Click 'Update'"
    exit 1
fi

echo ""
echo "🎯 VERIFICATION:"
echo "Visit your repository to confirm the change:"
echo "https://github.com/$REPO_OWNER/$REPO_NAME"
echo ""
echo "You should see the complete enterprise application, not the basic homepage!"
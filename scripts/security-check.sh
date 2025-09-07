#!/bin/bash

# OptiMind AI Ecosystem - Security Verification Script
# Prevents .env file exposure and ensures proper configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Security checks
echo -e "${BLUE}🔒 Running OptiMind AI Ecosystem Security Checks...${NC}"

# Check 1: .gitignore contains .env
echo -e "${YELLOW}📋 Checking .gitignore configuration...${NC}"
if grep -q "\.env" .gitignore; then
    echo -e "${GREEN}✅ .env is properly ignored in .gitignore${NC}"
else
    echo -e "${RED}❌ CRITICAL: .env is NOT in .gitignore${NC}"
    echo -e "${RED}   Adding .env to .gitignore now...${NC}"
    echo -e "\n# Environment files\n.env*" >> .gitignore
    echo -e "${GREEN}✅ Added .env to .gitignore${NC}"
fi

# Check 2: .env file exists
echo -e "${YELLOW}📁 Checking .env file existence...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
else
    echo -e "${YELLOW}⚠️ .env file missing${NC}"
    if [ -f ".env.example" ]; then
        echo -e "${BLUE}📄 Creating .env from .env.example...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env from template${NC}"
    else
        echo -e "${RED}❌ No .env.example found - creating minimal .env${NC}"
        cat > .env << EOF
# Open Router Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# ZAI SDK Configuration
ZAI_API_KEY=your_zai_api_key_here
ZAI_BASE_URL=https://api.z-ai.com/v1

# Database Configuration
DATABASE_URL="file:./dev.db"

# Application Configuration
NODE_ENV=development
PORT=3000
EOF
        echo -e "${GREEN}✅ Created minimal .env file${NC}"
    fi
fi

# Check 3: Git is actually ignoring .env
echo -e "${YELLOW}🔍 Verifying Git ignore status...${NC}"
if git check-ignore .env 2>/dev/null; then
    echo -e "${GREEN}✅ Git is correctly ignoring .env${NC}"
else
    echo -e "${RED}❌ CRITICAL: Git is NOT ignoring .env${NC}"
    echo -e "${RED}   This could expose sensitive data!${NC}"
    exit 1
fi

# Check 4: No .env files are staged
echo -e "${YELLOW}🚫 Checking for staged .env files...${NC}"
if git diff --cached --name-only | grep -q "\.env"; then
    echo -e "${RED}❌ CRITICAL: .env files are staged for commit!${NC}"
    echo -e "${RED}   Unstaging .env files...${NC}"
    git diff --cached --name-only | grep "\.env" | xargs git reset HEAD --
    echo -e "${GREEN}✅ Unstaged .env files${NC}"
else
    echo -e "${GREEN}✅ No .env files staged${NC}"
fi

# Check 5: Verify required environment variables are present
echo -e "${YELLOW}🔑 Checking required environment variables...${NC}"
required_vars=("OPENROUTER_API_KEY" "ZAI_API_KEY" "DATABASE_URL")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All required environment variables are present${NC}"
else
    echo -e "${YELLOW}⚠️ Missing environment variables: ${missing_vars[*]}${NC}"
    echo -e "${BLUE}📝 Adding missing variables to .env...${NC}"
    
    for var in "${missing_vars[@]}"; do
        case $var in
            "OPENROUTER_API_KEY")
                echo "OPENROUTER_API_KEY=your_openrouter_api_key_here" >> .env
                ;;
            "ZAI_API_KEY")
                echo "ZAI_API_KEY=your_zai_api_key_here" >> .env
                ;;
            "DATABASE_URL")
                echo 'DATABASE_URL="file:./dev.db"' >> .env
                ;;
        esac
    done
    
    echo -e "${GREEN}✅ Added missing environment variables${NC}"
fi

# Check 6: File permissions
echo -e "${YELLOW}🔐 Checking .env file permissions...${NC}"
if [ -f ".env" ]; then
    current_perms=$(stat -f "%Lp" .env 2>/dev/null || stat -c "%a" .env 2>/dev/null)
    if [ "$current_perms" = "600" ] || [ "$current_perms" = "640" ]; then
        echo -e "${GREEN}✅ .env has secure permissions ($current_perms)${NC}"
    else
        echo -e "${YELLOW}🔒 Setting secure permissions for .env...${NC}"
        chmod 600 .env
        echo -e "${GREEN}✅ Set .env permissions to 600${NC}"
    fi
fi

echo -e "${GREEN}🎉 All security checks passed!${NC}"
echo -e "${BLUE}📊 Security Summary:${NC}"
echo -e "${GREEN}  ✅ .gitignore configured properly${NC}"
echo -e "${GREEN}  ✅ .env file exists and is secure${NC}"
echo -e "${GREEN}  ✅ Git is ignoring .env files${NC}"
echo -e "${GREEN}  ✅ No .env files staged for commit${NC}"
echo -e "${GREEN}  ✅ Required environment variables present${NC}"
echo -e "${GREEN}  ✅ Secure file permissions set${NC}"
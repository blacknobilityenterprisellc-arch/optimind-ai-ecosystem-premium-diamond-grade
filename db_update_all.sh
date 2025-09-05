#!/bin/bash

echo "🗄️ Database Update for All Branches"
echo "=================================="

# Function to update database on current branch
update_database() {
    echo "🔄 Updating database on current branch..."
    npx prisma db push
    npx prisma migrate dev
    npx prisma generate
    npx prisma validate
    echo "✅ Database updated on current branch"
}

# Function to commit and push changes
commit_push() {
    local branch=$1
    echo "📝 Committing and pushing $branch branch..."
    git add .
    git commit -m "🗄️ Database updates - $branch branch

- Updated database schema via Prisma
- Pushed schema changes to database
- Generated Prisma client
- Validated schema integrity

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    git push origin $branch
    echo "✅ $branch branch updated and pushed"
}

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Update current branch
update_database
commit_push $CURRENT_BRANCH

# List of branches to update
BRANCHES="develop main"

for branch in $BRANCHES; do
    echo "🔄 Processing branch: $branch"
    
    # Checkout branch
    git checkout $branch 2>/dev/null || {
        echo "⚠️ Branch $branch not found, skipping..."
        continue
    }
    
    # Pull latest changes
    git pull origin $branch 2>/dev/null || {
        echo "⚠️ Could not pull $branch, continuing..."
    }
    
    # Update database
    update_database
    
    # Commit and push
    commit_push $branch
    
    echo "✅ Branch $branch completed"
done

# Return to original branch
echo "🔄 Returning to original branch: $CURRENT_BRANCH"
git checkout $CURRENT_BRANCH

echo "🎉 All database updates completed!"

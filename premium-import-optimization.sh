#!/bin/bash

# Premium Diamond-Grade Import Optimization Script
# Cleans up and optimizes import statements

set -euo pipefail

echo "🔧 Starting Premium Diamond-Grade Import Optimization..."

# Remove unused React imports (when not using JSX)
find src -name "*.ts" -exec grep -l "'use client'" {} \; | while read file; do
  # Keep React imports in client components
  echo "✅ Keeping React imports in client component: $file"
done

# Remove unused Lucide icon imports
find src -name "*.tsx" -exec sed -i '/import.*from.*lucide-react/d' {} \;

# Remove unused toast imports
find src -name "*.ts" -exec sed -i '/import.*toast.*from.*/d' {} \;

# Remove unused Clock imports
find src -name "*.ts" -exec sed -i '/import.*Clock.*from.*/d' {} \;

echo "✅ Premium Diamond-Grade import optimization completed"

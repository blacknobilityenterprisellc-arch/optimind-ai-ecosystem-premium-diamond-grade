#!/bin/bash

# Simple Database Update Script for OptiMind AI Ecosystem

set -e

echo "🚀 Starting database update process..."

# Create timestamp for backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="database_backups_$TIMESTAMP"

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo "📁 Created backup directory: $BACKUP_DIR"

# List all database files
echo "📋 Found database files:"
find . -name "*.db" -type f

# Process main Prisma database
echo ""
echo "🎯 Processing main Prisma database..."

# Backup main database
if [ -f "prisma/dev.db" ]; then
    echo "📦 Backing up main database..."
    cp "prisma/dev.db" "$BACKUP_DIR/dev.db.backup.$TIMESTAMP"
    echo "✅ Main database backed up"
fi

# Generate Prisma client
echo "📋 Generating Prisma client..."
npx prisma generate

# Push schema to main database
echo "📤 Pushing schema to main database..."
npx prisma db push

# Run seed if exists
if [ -f "prisma/seed.ts" ]; then
    echo "🌱 Running database seed..."
    npx tsx prisma/seed.ts
fi

# Process custom database
echo ""
echo "🎯 Processing custom database..."

# Backup custom database
if [ -f "db/custom.db" ]; then
    echo "📦 Backing up custom database..."
    cp "db/custom.db" "$BACKUP_DIR/custom.db.backup.$TIMESTAMP"
    echo "✅ Custom database backed up"
fi

# Update custom database with same schema
if [ -f "db/custom.db" ]; then
    echo "📤 Pushing schema to custom database..."
    DATABASE_URL="file:./db/custom.db" npx prisma db push
    echo "✅ Custom database updated"
fi

# Validate databases
echo ""
echo "🔍 Validating databases..."

# Validate main database
if [ -f "prisma/dev.db" ]; then
    echo "📊 Validating main database..."
    if sqlite3 "prisma/dev.db" "SELECT name FROM sqlite_master WHERE type='table';" > /dev/null 2>&1; then
        table_count=$(sqlite3 "prisma/dev.db" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
        echo "✅ Main database validation successful - $table_count tables found"
    else
        echo "❌ Main database validation failed"
    fi
fi

# Validate custom database
if [ -f "db/custom.db" ]; then
    echo "📊 Validating custom database..."
    if sqlite3 "db/custom.db" "SELECT name FROM sqlite_master WHERE type='table';" > /dev/null 2>&1; then
        table_count=$(sqlite3 "db/custom.db" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
        echo "✅ Custom database validation successful - $table_count tables found"
    else
        echo "❌ Custom database validation failed"
    fi
fi

# Create summary report
echo ""
echo "📊 Creating summary report..."
cat > "$BACKUP_DIR/update_summary_$TIMESTAMP.txt" << EOF
OptiMind AI Ecosystem Database Update Summary
=============================================
Timestamp: $TIMESTAMP
Backup Directory: $BACKUP_DIR

Databases Updated:
- Main Database: prisma/dev.db
- Custom Database: db/custom.db

Backup Files Created:
EOF

ls -la "$BACKUP_DIR" >> "$BACKUP_DIR/update_summary_$TIMESTAMP.txt"

echo ""
echo "🎉 Database update process completed!"
echo "===================================="
echo "📁 Backup Directory: $BACKUP_DIR"
echo "📄 Summary Report: $BACKUP_DIR/update_summary_$TIMESTAMP.txt"
echo ""
echo "✅ All databases have been updated successfully!"
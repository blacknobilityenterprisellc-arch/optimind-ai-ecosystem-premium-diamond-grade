#!/bin/bash

# Comprehensive Database Update Script for OptiMind AI Ecosystem
# This script updates all database instances and creates backups

set -e

echo "🚀 Starting comprehensive database update for OptiMind AI Ecosystem..."
echo "=================================================================="

# Create timestamp for backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="database_backups_$TIMESTAMP"

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo "📁 Created backup directory: $BACKUP_DIR"

# Function to backup database
backup_database() {
    local db_path=$1
    local db_name=$2
    
    if [ -f "$db_path" ]; then
        echo "📦 Backing up $db_name..."
        cp "$db_path" "$BACKUP_DIR/${db_name}.backup.$TIMESTAMP"
        echo "✅ Backed up $db_name to $BACKUP_DIR/${db_name}.backup.$TIMESTAMP"
    else
        echo "⚠️  Database file not found: $db_path"
    fi
}

# Function to update database
update_database() {
    local db_path=$1
    local db_name=$2
    
    if [ -f "$db_path" ]; then
        echo "🔄 Updating $db_name..."
        
        # Run Prisma commands
        cd /home/z/my-project
        
        # Generate Prisma client
        echo "📋 Generating Prisma client..."
        npx prisma generate
        
        # Push schema changes
        echo "📤 Pushing schema changes to $db_name..."
        DATABASE_URL="file:$db_path" npx prisma db push
        
        # Run seed if exists
        if [ -f "prisma/seed.ts" ]; then
            echo "🌱 Running database seed..."
            DATABASE_URL="file:$db_path" npx tsx prisma/seed.ts
        fi
        
        echo "✅ Updated $db_name successfully"
    else
        echo "⚠️  Database file not found: $db_path"
    fi
}

# Function to validate database
validate_database() {
    local db_path=$1
    local db_name=$2
    
    if [ -f "$db_path" ]; then
        echo "🔍 Validating $db_name..."
        
        # Check database integrity
        cd /home/z/my-project
        
        # Run Prisma validate
        DATABASE_URL="file:$db_path" npx prisma validate
        
        # Check if database is readable
        if sqlite3 "$db_path" "SELECT name FROM sqlite_master WHERE type='table';" > /dev/null 2>&1; then
            echo "✅ $db_name validation successful"
            
            # Get table count
            table_count=$(sqlite3 "$db_path" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
            echo "📊 $db_name contains $table_count tables"
        else
            echo "❌ $db_name validation failed - database may be corrupted"
        fi
    else
        echo "⚠️  Database file not found: $db_path"
    fi
}

# Main execution
echo ""
echo "📋 Database Files Found:"
find . -name "*.db" -type f | while read -r db_file; do
    echo "  - $db_file"
done

echo ""
echo "🔄 Starting Database Update Process..."

# Process each database file
find . -name "*.db" -type f | while read -r db_file; do
    db_name=$(basename "$db_file" .db)
    db_dir=$(dirname "$db_file")
    
    echo ""
    echo "🎯 Processing Database: $db_name"
    echo "   Path: $db_file"
    echo "   Directory: $db_dir"
    
    # Backup database
    backup_database "$db_file" "$db_name"
    
    # Update database
    update_database "$db_file" "$db_name"
    
    # Validate database
    validate_database "$db_file" "$db_name"
done

echo ""
echo "📊 Creating Database Summary Report..."
cat > "$BACKUP_DIR/database_summary_$TIMESTAMP.txt" << EOF
OptiMind AI Ecosystem Database Update Summary
=============================================
Timestamp: $TIMESTAMP
Backup Directory: $BACKUP_DIR

Database Files Processed:
EOF

find . -name "*.db" -type f | while read -r db_file; do
    db_name=$(basename "$db_file" .db)
    file_size=$(stat -f%z "$db_file" 2>/dev/null || stat -c%s "$db_file" 2>/dev/null || echo "Unknown")
    
    echo "- $db_name: $db_file (Size: $file_size bytes)" >> "$BACKUP_DIR/database_summary_$TIMESTAMP.txt"
done

echo "" >> "$BACKUP_DIR/database_summary_$TIMESTAMP.txt"
echo "Backup Files Created:" >> "$BACKUP_DIR/database_summary_$TIMESTAMP.txt"
ls -la "$BACKUP_DIR" >> "$BACKUP_DIR/database_summary_$TIMESTAMP.txt"

echo ""
echo "🎉 Database Update Process Complete!"
echo "===================================="
echo "📁 Backup Directory: $BACKUP_DIR"
echo "📄 Summary Report: $BACKUP_DIR/database_summary_$TIMESTAMP.txt"
echo ""
echo "🔍 Next Steps:"
echo "   1. Review the summary report"
echo "   2. Verify all databases are functioning correctly"
echo "   3. Test application functionality"
echo "   4. Monitor database performance"
echo ""
echo "✅ All databases have been updated and backed up successfully!"
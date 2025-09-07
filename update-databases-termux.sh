#!/bin/bash
echo "🔄 Updating OptiMind AI Premium Diamond-Grade Databases..."

# Stop any running server processes
echo "🛑 Stopping server processes..."
pkill -f "tsx server.ts"
pkill -f "nodemon"

# Wait for processes to terminate
sleep 2

# Create database directory if it doesn't exist
mkdir -p prisma

# Create or update the database
echo "🔄 Updating SQLite database..."
sqlite3 prisma/dev.db "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);"

sqlite3 prisma/dev.db "CREATE TABLE IF NOT EXISTS ai_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, session_data TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id));"

sqlite3 prisma/dev.db "CREATE TABLE IF NOT EXISTS premium_features (id INTEGER PRIMARY KEY AUTOINCREMENT, feature_name TEXT NOT NULL, is_active BOOLEAN DEFAULT 1, config TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);"

sqlite3 prisma/dev.db "CREATE TABLE IF NOT EXISTS system_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, log_level TEXT, message TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);"

# Insert or update premium features
sqlite3 prisma/dev.db "INSERT OR IGNORE INTO premium_features (feature_name, config) VALUES ('ai_engine', '{\"model\": \"gpt-4\", \"max_tokens\": 2000}');"
sqlite3 prisma/dev.db "INSERT OR IGNORE INTO premium_features (feature_name, config) VALUES ('security_layer', '{\"encryption\": \"aes-256\", \"auth_required\": true}');"
sqlite3 prisma/dev.db "INSERT OR IGNORE INTO premium_features (feature_name, config) VALUES ('analytics_engine', '{\"tracking_enabled\": true, \"retention_days\": 30}');"
sqlite3 prisma/dev.db "INSERT OR IGNORE INTO premium_features (feature_name, config) VALUES ('performance_optimizer', '{\"caching\": true, \"compression\": true}');"

# Update existing features
sqlite3 prisma/dev.db "UPDATE premium_features SET is_active = 1 WHERE feature_name IN ('ai_engine', 'security_layer', 'analytics_engine', 'performance_optimizer');"

# Show database status
echo "📊 Database status:"
sqlite3 prisma/dev.db "SELECT COUNT(*) as total_tables FROM sqlite_master WHERE type='table';"
sqlite3 prisma/dev.db "SELECT COUNT(*) as total_features FROM premium_features;"

echo "✅ Database updates complete!"
echo "🚀 You can now restart your server with: npm run dev:custom"

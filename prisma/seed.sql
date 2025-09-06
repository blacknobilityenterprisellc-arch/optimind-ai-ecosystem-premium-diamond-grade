-- OptiMind AI Premium Diamond-Grade Database Seed
-- This script populates the database with initial data

-- Insert default admin user
INSERT OR IGNORE INTO users (email, name) VALUES ('admin@optimind.ai', 'OptiMind Admin');

-- Insert additional premium features configurations
INSERT OR IGNORE INTO premium_features (feature_name, config) VALUES 
('ai_engine', '{"model": "gpt-4-turbo", "max_tokens": 4000, "temperature": 0.7}'),
('security_layer', '{"encryption": "aes-256-gcm", "auth_required": true, "mfa_enabled": true}'),
('analytics_engine', '{"tracking_enabled": true, "retention_days": 90, "real_time_processing": true}'),
('performance_optimizer', '{"caching": true, "compression": true, "cdn_enabled": true}'),
('real_time_updates', '{"websocket_enabled": true, "update_frequency": 1000}'),
('ai_insights', '{"auto_generate": true, "confidence_threshold": 0.85}');

-- Insert sample AI sessions
INSERT OR IGNORE INTO ai_sessions (user_id, session_data) VALUES 
(1, '{"session_type": "ai_query", "query": "Initialize OptiMind AI", "response": "OptiMind AI initialized successfully"}'),
(1, '{"session_type": "system_check", "query": "Run diagnostics", "response": "All systems operational"}');

-- Insert system logs
INSERT OR IGNORE INTO system_logs (log_level, message) VALUES 
('INFO', 'OptiMind AI Premium Diamond-Grade Ecosystem initialized'),
('INFO', 'Database seeded successfully'),
('INFO', 'All premium features activated'),
('INFO', 'Security layer enabled'),
('INFO', 'Performance optimizer active');

-- Update premium features to active status
UPDATE premium_features SET is_active = 1;

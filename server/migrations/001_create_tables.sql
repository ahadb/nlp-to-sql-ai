-- Create tables for NLP SQL application
-- This migration creates all necessary tables for the application

-- Schemas table (matches current local structure)
CREATE TABLE IF NOT EXISTS schemas (
    schema_id VARCHAR(255) PRIMARY KEY,
    schema_type VARCHAR(50) NOT NULL,
    namespace VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    schema_data JSONB NOT NULL
);

-- Tables table (for tracking individual tables within schemas)
CREATE TABLE IF NOT EXISTS tables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name VARCHAR(255) NOT NULL,
    schema_id VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    description TEXT,
    row_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insights table
CREATE TABLE IF NOT EXISTS insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    metric VARCHAR(255) NOT NULL,
    change VARCHAR(50),
    description TEXT,
    trend VARCHAR(20) CHECK (trend IN ('up', 'down', 'stable')),
    data_points JSONB,
    insight_type VARCHAR(50) DEFAULT 'insight',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat History table
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    response JSONB,
    is_user BOOLEAN DEFAULT true,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Upload History table
CREATE TABLE IF NOT EXISTS upload_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'processing',
    table_name VARCHAR(255),
    schema_id VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schemas_schema_id ON schemas(schema_id);
CREATE INDEX IF NOT EXISTS idx_tables_schema_id ON tables(schema_id);
CREATE INDEX IF NOT EXISTS idx_insights_table_name ON insights(table_name);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_upload_history_user_id ON upload_history(user_id);

-- Enable Row Level Security (RLS) - we'll configure policies later
ALTER TABLE schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_history ENABLE ROW LEVEL SECURITY;

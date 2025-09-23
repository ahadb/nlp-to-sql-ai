"""
Migration: Create upload_history table for tracking file uploads
"""

def up():
    """Create upload_history table"""
    return """
    CREATE TABLE IF NOT EXISTS upload_history (
        id SERIAL PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_size BIGINT,
        file_type VARCHAR(50) NOT NULL,
        upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'processing',
        records_processed INTEGER DEFAULT 0,
        error_message TEXT,
        schema_id VARCHAR(255),
        processing_time_ms INTEGER,
        user_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create index for better query performance
    CREATE INDEX IF NOT EXISTS idx_upload_history_timestamp ON upload_history(upload_timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_upload_history_status ON upload_history(status);
    CREATE INDEX IF NOT EXISTS idx_upload_history_schema_id ON upload_history(schema_id);
    """

def down():
    """Drop upload_history table"""
    return """
    DROP TABLE IF EXISTS upload_history;
    """

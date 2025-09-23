# server/migrations/002_add_insights_table.py
from datetime import datetime

def upgrade():
    return """
    CREATE TABLE insights (
        id SERIAL PRIMARY KEY,
        schema_id VARCHAR(255) NOT NULL,
        insight_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        confidence_score FLOAT DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX idx_insights_schema_id ON insights(schema_id);
    CREATE INDEX idx_insights_type ON insights(insight_type);
    """

def downgrade():
    return """
    DROP TABLE IF EXISTS insights;
    """
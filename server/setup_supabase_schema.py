#!/usr/bin/env python3
"""Setup Supabase database schema"""

import asyncio
import sys
sys.path.append('.')

from app.services.supabase_service import supabase_service
from app.env_config import env_config

async def setup_schema():
    """Create database tables in Supabase"""
    print("=== Supabase Schema Setup ===")
    print(f"Environment: {env_config.environment}")
    print(f"Supabase URL: {env_config.supabase_url}")
    
    if not supabase_service.is_available():
        print("❌ Supabase not available - check your credentials")
        return False
    
    # Test connection first
    print("Testing connection...")
    if not await supabase_service.test_connection():
        print("❌ Connection test failed")
        return False
    
    print("✅ Connection successful")
    
    # Read SQL migration file
    try:
        with open('migrations/001_create_tables.sql', 'r') as f:
            sql_content = f.read()
        print("✅ SQL migration file loaded")
    except Exception as e:
        print(f"❌ Failed to read migration file: {e}")
        return False
    
    # Execute SQL in Supabase
    try:
        print("Creating tables...")
        # Note: Supabase Python client doesn't have direct SQL execution
        # We'll need to use the REST API or create tables through the client
        print("⚠️  Note: SQL execution through Python client is limited")
        print("📝 Please run the SQL migration manually in your Supabase dashboard:")
        print("   1. Go to your Supabase project dashboard")
        print("   2. Navigate to SQL Editor")
        print("   3. Copy and paste the contents of migrations/001_create_tables.sql")
        print("   4. Execute the SQL")
        return True
    except Exception as e:
        print(f"❌ Failed to execute SQL: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(setup_schema())

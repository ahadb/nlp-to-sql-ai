#!/usr/bin/env python3
"""Test Supabase connection"""

import asyncio
import sys
sys.path.append('.')

from app.services.supabase_service import supabase_service
from app.env_config import env_config

async def test_supabase():
    print("=== Supabase Connection Test ===")
    print(f"Environment: {env_config.environment}")
    print(f"Supabase URL: {env_config.supabase_url}")
    print(f"Supabase available: {supabase_service.is_available()}")
    
    if supabase_service.is_available():
        print("Testing connection...")
        success = await supabase_service.test_connection()
        print(f"Connection test: {'✅ Success' if success else '❌ Failed'}")
    else:
        print("❌ Supabase not available - check your credentials")
    
    print("=" * 40)

if __name__ == "__main__":
    asyncio.run(test_supabase())

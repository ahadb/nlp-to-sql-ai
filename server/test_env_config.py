#!/usr/bin/env python3
"""Test script to verify environment configuration"""

import os
import sys
sys.path.append('.')

from app.env_config import env_config

def test_environment_config():
    print("=== Environment Configuration Test ===")
    print(f"Current environment: {env_config.environment}")
    print(f"Is development: {env_config.is_dev}")
    print(f"Is production: {env_config.is_prod}")
    print(f"Debug mode: {env_config.debug}")
    print(f"Database URL: {env_config.database_url}")
    print(f"Supabase URL: {env_config.supabase_url}")
    print(f"OpenAI API Key: {'Set' if env_config.openai_api_key else 'Not set'}")
    print("=" * 40)

if __name__ == "__main__":
    test_environment_config()

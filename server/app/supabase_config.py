import os
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Optional

# Load environment variables
if (os.getenv("RAILWAY_ENVIRONMENT") or 
    os.getenv("RAILWAY_PROJECT_ID") or 
    os.getenv("SUPABASE_URL")):
    # In production (Railway), don't load .env files
    pass
else:
    # In development, load .env files
    load_dotenv()

class SupabaseConfig:
    """Supabase configuration and client management"""
    
    def __init__(self):
        self.url: str = os.getenv("SUPABASE_URL", "")
        self.anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
        self.service_role_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        
        # Only validate if Supabase is being used
        self.is_configured = bool(self.url and self.anon_key)
    
    def get_client(self, use_service_role: bool = False) -> Client:
        """Get Supabase client with appropriate key"""
        if not self.is_configured:
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")
            
        key = self.service_role_key if use_service_role else self.anon_key
        
        if use_service_role and not self.service_role_key:
            raise ValueError("SUPABASE_SERVICE_ROLE_KEY must be set to use service role")
        
        return create_client(self.url, key)
    
    def test_connection(self) -> bool:
        """Test Supabase connection"""
        try:
            client = self.get_client()
            # Simple test query
            result = client.table("documents").select("count").limit(1).execute()
            return True
        except Exception as e:
            print(f"Supabase connection test failed: {e}")
            return False

# Global configuration instance (only create if configured)
try:
    supabase_config = SupabaseConfig()
except ValueError:
    supabase_config = None

# Convenience function to get client
def get_supabase_client(use_service_role: bool = False) -> Client:
    """Get Supabase client instance"""
    if supabase_config is None:
        raise ValueError("Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.")
    return supabase_config.get_client(use_service_role)

from supabase import create_client, Client
from typing import Dict, List, Optional, Any
import logging
from app.env_config import env_config

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.client: Optional[Client] = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Supabase client"""
        try:
            if not env_config.supabase_url or not env_config.supabase_anon_key:
                logger.warning("Supabase credentials not found, using fallback database")
                return
            
            self.client = create_client(
                env_config.supabase_url,
                env_config.supabase_anon_key
            )
            logger.info(f"Supabase client initialized successfully for {env_config.environment} environment")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            self.client = None
    
    def is_available(self) -> bool:
        """Check if Supabase is available"""
        return self.client is not None
    
    # Schemas Operations
    async def get_schemas(self) -> List[Dict[str, Any]]:
        """Get all schemas"""
        if not self.is_available():
            return []
        
        try:
            response = self.client.table("schemas").select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching schemas: {e}")
            return []
    
    async def create_schema(self, schema_id: str, schema_type: str, namespace: str, file_name: str, description: str = "", schema_data: dict = None) -> Optional[Dict[str, Any]]:
        """Create a new schema"""
        if not self.is_available():
            return None
        
        try:
            data = {
                "schema_id": schema_id,
                "schema_type": schema_type,
                "namespace": namespace,
                "file_name": file_name,
                "description": description,
                "schema_data": schema_data or {}
            }
            response = self.client.table("schemas").insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error creating schema: {e}")
            return None
    
    # Tables Operations
    async def get_tables(self) -> List[Dict[str, Any]]:
        """Get all tables"""
        if not self.is_available():
            return []
        
        try:
            response = self.client.table("tables").select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching tables: {e}")
            return []
    
    async def create_table(self, table_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new table"""
        if not self.is_available():
            return None
        
        try:
            response = self.client.table("tables").insert(table_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error creating table: {e}")
            return None
    
    # Test connection
    async def test_connection(self) -> bool:
        """Test Supabase connection"""
        if not self.is_available():
            return False
        
        try:
            # Test basic connection by checking if we can access the client
            # This will fail if credentials are wrong, but succeed if connection is good
            # even if tables don't exist yet
            self.client.auth.get_user()
            logger.info("Supabase connection test successful")
            return True
        except Exception as e:
            logger.error(f"Supabase connection test failed: {e}")
            return False

# Global Supabase service instance
supabase_service = SupabaseService()

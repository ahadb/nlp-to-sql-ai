"""
Hybrid service that can work with both Supabase and local PostgreSQL
"""
import logging
from typing import Dict, List, Optional, Any
from app.services.supabase_service import supabase_service
from app.database import get_db_connection
from app.env_config import env_config

logger = logging.getLogger(__name__)

class HybridService:
    """Service that uses Supabase when available, falls back to local database only when Supabase is unavailable"""
    
    def __init__(self):
        self.use_supabase = supabase_service.is_available()
        if self.use_supabase:
            logger.info("Hybrid service initialized - Using Supabase for data operations")
        else:
            logger.warning("Hybrid service initialized - Supabase unavailable, falling back to Local PostgreSQL")
    
    async def create_schema(self, schema_id: str, schema_type: str, namespace: str, 
                          file_name: str, description: str = "", schema_data: dict = None):
        """Create a schema in either Supabase or local database"""
        if self.use_supabase:
            return await supabase_service.create_schema(
                schema_id, schema_type, namespace, file_name, description, schema_data
            )
        else:
            return await self._create_schema_local(schema_id, schema_type, namespace, file_name, description, schema_data)
    
    async def get_schemas(self) -> List[Dict[str, Any]]:
        """Get all schemas from either Supabase or local database"""
        if self.use_supabase:
            return await supabase_service.get_schemas()
        else:
            return await self._get_schemas_local()
    
    async def create_table(self, table_data: Dict[str, Any]):
        """Create a table in either Supabase or local database"""
        if self.use_supabase:
            return await supabase_service.create_table(table_data)
        else:
            return await self._create_table_local(table_data)
    
    async def get_tables(self) -> List[Dict[str, Any]]:
        """Get all tables from either Supabase or local database"""
        if self.use_supabase:
            return await supabase_service.get_tables()
        else:
            return await self._get_tables_local()
    
    # Local database methods
    async def _create_schema_local(self, schema_id: str, schema_type: str, namespace: str, 
                                 file_name: str, description: str = "", schema_data: dict = None):
        """Create schema in local PostgreSQL"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO schemas (schema_id, schema_type, namespace, file_name, description, schema_data)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (schema_id) DO UPDATE SET
                        schema_type = EXCLUDED.schema_type,
                        namespace = EXCLUDED.namespace,
                        file_name = EXCLUDED.file_name,
                        description = EXCLUDED.description,
                        schema_data = EXCLUDED.schema_data,
                        created_at = CURRENT_TIMESTAMP
                """, (schema_id, schema_type, namespace, file_name, description, json.dumps(schema_data or {})))
                conn.commit()
                return {"schema_id": schema_id, "status": "created"}
        except Exception as e:
            logger.error(f"Error creating schema locally: {e}")
            return None
        finally:
            conn.close()
    
    async def _get_schemas_local(self) -> List[Dict[str, Any]]:
        """Get schemas from local PostgreSQL"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM schemas ORDER BY created_at DESC")
                columns = [desc[0] for desc in cur.description]
                rows = cur.fetchall()
                return [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            logger.error(f"Error getting schemas locally: {e}")
            return []
        finally:
            conn.close()
    
    async def _create_table_local(self, table_data: Dict[str, Any]):
        """Create table in local PostgreSQL"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO tables (table_name, schema_id, display_name, description, row_count)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (table_name, schema_id) DO UPDATE SET
                        display_name = EXCLUDED.display_name,
                        description = EXCLUDED.description,
                        row_count = EXCLUDED.row_count,
                        updated_at = CURRENT_TIMESTAMP
                """, (
                    table_data.get('table_name'),
                    table_data.get('schema_id'),
                    table_data.get('display_name'),
                    table_data.get('description'),
                    table_data.get('row_count', 0)
                ))
                conn.commit()
                return {"table_name": table_data.get('table_name'), "status": "created"}
        except Exception as e:
            logger.error(f"Error creating table locally: {e}")
            return None
        finally:
            conn.close()
    
    async def _get_tables_local(self) -> List[Dict[str, Any]]:
        """Get tables from local PostgreSQL"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM tables ORDER BY created_at DESC")
                columns = [desc[0] for desc in cur.description]
                rows = cur.fetchall()
                return [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            logger.error(f"Error getting tables locally: {e}")
            return []
        finally:
            conn.close()

# Global hybrid service instance
hybrid_service = HybridService()

"""
Upload History Service - Track and manage file upload history
"""
import time
from datetime import datetime
from typing import List, Optional, Dict, Any
from app.database import get_connection

class UploadHistoryService:
    """Service for tracking upload history and analytics"""
    
    @staticmethod
    async def log_upload_start(
        file_name: str,
        file_size: int,
        file_type: str,
        user_id: str = "demo_user"
    ) -> int:
        """Log the start of an upload process"""
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO upload_history (
                        file_name, file_size, file_type, status, user_id
                    ) VALUES (%s, %s, %s, 'processing', %s)
                    RETURNING id
                """, (file_name, file_size, file_type, user_id))
                
                upload_id = cur.fetchone()[0]
                conn.commit()
                return upload_id
        finally:
            conn.close()
    
    @staticmethod
    async def log_upload_success(
        upload_id: int,
        schema_id: str,
        records_processed: int,
        processing_time_ms: int
    ):
        """Log successful upload completion"""
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE upload_history 
                    SET status = 'success',
                        schema_id = %s,
                        records_processed = %s,
                        processing_time_ms = %s,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (schema_id, records_processed, processing_time_ms, upload_id))
                conn.commit()
        finally:
            conn.close()
    
    @staticmethod
    async def log_upload_error(
        upload_id: int,
        error_message: str,
        processing_time_ms: int = 0
    ):
        """Log upload failure"""
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE upload_history 
                    SET status = 'failed',
                        error_message = %s,
                        processing_time_ms = %s,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (error_message, processing_time_ms, upload_id))
                conn.commit()
        finally:
            conn.close()
    
    @staticmethod
    async def get_upload_history(
        limit: int = 50,
        user_id: str = "demo_user"
    ) -> List[Dict[str, Any]]:
        """Get upload history for a user"""
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT 
                        id,
                        file_name,
                        file_size,
                        file_type,
                        upload_timestamp,
                        status,
                        records_processed,
                        error_message,
                        schema_id,
                        processing_time_ms
                    FROM upload_history 
                    WHERE user_id = %s
                    ORDER BY upload_timestamp DESC 
                    LIMIT %s
                """, (user_id, limit))
                
                columns = [desc[0] for desc in cur.description]
                results = []
                
                for row in cur.fetchall():
                    row_dict = dict(zip(columns, row))
                    # Format the timestamp for display
                    if row_dict['upload_timestamp']:
                        row_dict['upload_timestamp'] = row_dict['upload_timestamp'].strftime("%b %d, %Y %I:%M %p")
                    
                    # Format file size for display
                    if row_dict['file_size']:
                        size_bytes = row_dict['file_size']
                        if size_bytes < 1024:
                            row_dict['size_display'] = f"{size_bytes} B"
                        elif size_bytes < 1024 * 1024:
                            row_dict['size_display'] = f"{size_bytes / 1024:.1f} KB"
                        else:
                            row_dict['size_display'] = f"{size_bytes / (1024 * 1024):.1f} MB"
                    else:
                        row_dict['size_display'] = "Unknown"
                    
                    results.append(row_dict)
                
                return results
        finally:
            conn.close()

# Create service instance
upload_history_service = UploadHistoryService()

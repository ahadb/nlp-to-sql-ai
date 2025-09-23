# app/services/insights_service.py
from app.database import get_db_connection
from app.services.openai_service import OpenAIService
from app.config import settings
from app.data.mock_insights import get_mock_dashboard_insights
import json
import os
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

class InsightsService:
    def __init__(self):
        self.openai = OpenAIService()
    
    async def get_schema_info(self, schema_id: str):
        """Get all tables and their schemas for a given schema_id"""
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # First, find the actual schema name
                cur.execute("""
                    SELECT schema_name 
                    FROM information_schema.schemata 
                    WHERE schema_name LIKE %s
                """, (f"%{schema_id}%",))
                
                schema_name = cur.fetchone()
                if not schema_name:
                    return {"schema_id": schema_id, "tables": {}}
                
                schema_name = schema_name[0]
                
                # Get all tables in this schema
                cur.execute("""
                    SELECT table_name, column_name, data_type
                    FROM information_schema.columns
                    WHERE table_schema = %s
                    ORDER BY table_name, ordinal_position
                """, (schema_name,))
                
                tables = {}
                for row in cur.fetchall():
                    table_name = row[0]
                    if table_name not in tables:
                        tables[table_name] = []
                    tables[table_name].append({
                        "column": row[1],
                        "type": row[2]
                    })
                
                return {"schema_id": schema_id, "schema_name": schema_name, "tables": tables}
    
    # app/services/insights_service.py
    async def get_sample_data(self, schema_name: str, table_name: str, limit: int = 10):
        """Get sample data from a specific table in a specific schema"""
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(f"""
                    SELECT * FROM {schema_name}.{table_name} 
                    LIMIT %s
                """, (limit,))
                
                columns = [desc[0] for desc in cur.description]
                rows = cur.fetchall()
                
                # Convert Decimal to float for JSON serialization
                def convert_decimals(obj):
                    if hasattr(obj, 'quantize'):  # Decimal object
                        return float(obj)
                    return obj
                
                # Convert each row, handling Decimal types
                converted_rows = []
                for row in rows:
                    converted_row = []
                    for value in row:
                        converted_row.append(convert_decimals(value))
                    converted_rows.append(converted_row)
                
                return {
                    "table_name": table_name,
                    "columns": columns,
                    "data": [dict(zip(columns, row)) for row in converted_rows]
                }
    
    async def get_all_sample_data(self, schema_id: str):
        """Get sample data from all tables in schema"""
        schema_info = await self.get_schema_info(schema_id)
        sample_data = {}
        
        if not schema_info["tables"]:
            return schema_info, sample_data
        
        schema_name = schema_info["schema_name"]
        
        for table_name in schema_info["tables"]:
            sample_data[table_name] = await self.get_sample_data(schema_name, table_name)
        
        return schema_info, sample_data
    
    # app/services/insights_service.py
    async def generate_cross_table_insights(self, schema_info: dict, sample_data: dict):
        """Generate insights across all tables using AI"""
    
    # Insights prompt (Business Value) - Updated for structured data
        insights_prompt = f"""
        Analyze this business dataset and provide 2 key business insights with structured data for dashboard cards.
        
        Schema: {json.dumps(schema_info, indent=2, cls=DecimalEncoder)}
        Sample Data: {json.dumps(sample_data, indent=2, cls=DecimalEncoder)}
        
        For each insight, return JSON with:
        - title: Short, catchy title (max 3 words)
        - metric: Key number/value (e.g., "$1.2M", "23%", "150")
        - change: Change indicator (e.g., "+15%", "-5%", "↗️", "↘️")
        - description: Brief explanation (max 15 words)
        - trend: "up", "down", "stable"
        - data_points: Array of 5-7 numbers for sparkline chart
        
        Return JSON format:
        {{"insights": [{{"title": "Revenue Growth", "metric": "$1.2M", "change": "+15%", "description": "Quarterly revenue increase", "trend": "up", "data_points": [100, 120, 135, 142, 158]}}]}}
        """
        
        # Patterns prompt (Data Trends) - Updated for structured data
        patterns_prompt = f"""
        Identify 2 interesting data patterns with structured data for dashboard cards.
        
        Schema: {json.dumps(schema_info, indent=2, cls=DecimalEncoder)}
        Sample Data: {json.dumps(sample_data, indent=2, cls=DecimalEncoder)}
        
        For each pattern, return JSON with:
        - title: Short, catchy title (max 3 words)
        - metric: Key number/value (e.g., "23%", "150", "Weekend")
        - change: Change indicator (e.g., "+15%", "-5%", "↗️", "↘️")
        - description: Brief explanation (max 15 words)
        - trend: "up", "down", "stable"
        - data_points: Array of 5-7 numbers for sparkline chart
        
        Return JSON format:
        {{"patterns": [{{"title": "Weekend Peak", "metric": "23%", "change": "+15%", "description": "Higher sales on weekends", "trend": "up", "data_points": [45, 52, 48, 67, 71]}}]}}
        """
        
        try:
            # Generate insights and patterns
            print(f" Sending insights prompt to AI...")
            insights_response = await self.openai.generate_response(insights_prompt)
            print(f" AI insights response: {insights_response}")
            
            print(f" Sending patterns prompt to AI...")
            patterns_response = await self.openai.generate_response(patterns_prompt)
            print(f" AI patterns response: {patterns_response}")

            # Extract JSON from markdown code blocks
            def extract_json_from_markdown(text):
            # Remove markdown code blocks
                if "```json" in text:
                    start = text.find("```json") + 7
                    end = text.find("```", start)
                    return text[start:end].strip()
                elif "```" in text:
                    start = text.find("```") + 3
                    end = text.find("```", start)
                    return text[start:end].strip()
                else:
                    return text.strip()
            
            # Parse JSON responses
            insights_json = extract_json_from_markdown(insights_response)
            patterns_json = extract_json_from_markdown(patterns_response)
        
            insights_data = json.loads(insights_json)
            patterns_data = json.loads(patterns_json)
            
            return {
                "insights": insights_data,
                "patterns": patterns_data
            }
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON decode error: {e}")
            print(f"❌ Insights response: {insights_response}")
            print(f"❌ Patterns response: {patterns_response}")
            raise Exception(f"Failed to parse AI response as JSON: {e}")
        except Exception as e:
            print(f"❌ Error generating insights: {e}")
            raise Exception(f"Failed to generate insights: {e}")
    
    async def save_insights_to_db(self, schema_id: str, insights: list, patterns: list):
        """Save generated insights to database"""
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Save insights
                for insight in insights:
                    cur.execute("""
                        INSERT INTO insights (schema_id, insight_type, title, description, confidence_score)
                        VALUES (%s, 'insight', %s, %s, %s)
                    """, (
                        schema_id,
                        insight["title"],
                        insight["description"],
                        0.85  # Default confidence
                    ))
                
                # Save patterns
                for pattern in patterns:
                    cur.execute("""
                        INSERT INTO insights (schema_id, insight_type, title, description, confidence_score)
                        VALUES (%s, 'pattern', %s, %s, %s)
                    """, (
                        schema_id,
                        pattern["title"],
                        pattern["description"],
                        0.80  # Default confidence
                    ))
                
                conn.commit()
    
    async def generate_dashboard_insights(self, schema_id: str):
        print(f"🔧 INSIGHTS SETTINGS:")
        print(f"   DEMO_MODE: {settings.DEMO_MODE}")
        print(f"   DEMO_MODE type: {type(settings.DEMO_MODE)}")
        print(f"   Schema ID: {schema_id}")
        print(f"   Environment: {settings.ENVIRONMENT}")
        print(f"   Debug: {settings.DEBUG}")
        print(f"   Raw DEMO_MODE env: {os.getenv('DEMO_MODE', 'NOT_SET')}")
        print("=" * 50)
        
        """Complete flow: fetch data, generate insights, save to DB"""
        try:
            # Check if demo mode is enabled
            if settings.DEMO_MODE:
                print("🎭 Using MOCK insights for demo mode")
                # Return mock insights for demo
                return get_mock_dashboard_insights()
            
            # Real mode - use actual AI
            # Handle 'all' vs specific schema
            if schema_id == "all":
                schema_info = await self.get_all_org_schemas()
            else:
                schema_info = await self.get_single_schema(schema_id)
        
            if not schema_info["tables"]:
                return {"status": "error", "message": f"No tables found for schema_id: {schema_id}"}
        
            # Get sample data from all schemas/tables
            sample_data = await self.get_all_sample_data_flexible(schema_info)

            print(sample_data)
            
            # Generate insights using AI
            ai_results = await self.generate_cross_table_insights(schema_info, sample_data)
            
            # Save to database
            await self.save_insights_to_db(
                schema_id, 
                ai_results["insights"]["insights"], 
                ai_results["patterns"]["patterns"]
            )
            
            return {
                "status": "success",
                "insights": ai_results["insights"]["insights"],
                "patterns": ai_results["patterns"]["patterns"]
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}

    # app/services/insights_service.py
    async def get_all_org_schemas(self) -> dict:
        """Get all custom schemas and their data for organization-wide insights"""
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Get all custom schemas
                cur.execute("""
                    SELECT schema_name 
                    FROM information_schema.schemata 
                    WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'public')
                    ORDER BY schema_name
                """)
                
                schemas = [row[0] for row in cur.fetchall()]
                
                if not schemas:
                    return {"all_schemas": True, "schemas": [], "tables": {}}
                
                # Get all tables from all schemas
                all_tables = {}
                for schema_name in schemas:
                    cur.execute("""
                        SELECT table_name, column_name, data_type
                        FROM information_schema.columns
                        WHERE table_schema = %s
                        ORDER BY table_name, ordinal_position
                    """, (schema_name,))
                    
                    tables = {}
                    for row in cur.fetchall():
                        table_name = row[0]
                        if table_name not in tables:
                            tables[table_name] = []
                        tables[table_name].append({
                            "column": row[1],
                            "type": row[2]
                        })
                    
                    all_tables[schema_name] = tables
                
                return {
                    "all_schemas": True,
                    "schemas": schemas,
                    "tables": all_tables
                }

    async def get_single_schema(self, schema_id: str) -> dict:
        """Get specific schema and its data for single-schema insights"""
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Find the actual schema name
                cur.execute("""
                    SELECT schema_name 
                    FROM information_schema.schemata 
                    WHERE schema_name LIKE %s
                """, (f"%{schema_id}%",))
                
                schema_name = cur.fetchone()
                if not schema_name:
                    return {"all_schemas": False, "schemas": [], "tables": {}}
                
                schema_name = schema_name[0]
                
                # Get all tables in this schema
                cur.execute("""
                    SELECT table_name, column_name, data_type
                    FROM information_schema.columns
                    WHERE table_schema = %s
                    ORDER BY table_name, ordinal_position
                """, (schema_name,))
                
                tables = {}
                for row in cur.fetchall():
                    table_name = row[0]
                    if table_name not in tables:
                        tables[table_name] = []
                    tables[table_name].append({
                        "column": row[1],
                        "type": row[2]
                    })
                
                return {
                    "all_schemas": False,
                    "schemas": [schema_name],
                    "tables": {schema_name: tables}
                }

    async def get_all_sample_data_flexible(self, schema_info: dict) -> dict:
        """Get sample data from all schemas/tables based on schema_info"""
        sample_data = {}
        
        for schema_name, tables in schema_info["tables"].items():
            sample_data[schema_name] = {}
            for table_name in tables:
                sample_data[schema_name][table_name] = await self.get_sample_data(schema_name, table_name)
        
        return sample_data
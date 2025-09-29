# server/app/services/chat_service.py
import asyncio
import json
from typing import Dict, List, Optional, Any
from datetime import datetime
# from app.services.openai_service import OpenAIService
# from app.database import get_db_connection
# from app.services.insights_service import InsightsService
# from app.config import settings
from app.data.mock_responses import get_mock_response

class ChatService:
    def __init__(self):
        # self.openai_service = OpenAIService()
        # self.insights_service = InsightsService()
        pass
    
    async def process_message(self, message: str, schema_id: str = "all") -> Dict[str, Any]:
        """Process user message and generate AI response with SQL and insights"""
        try:
            # Always use mock responses for simplified demo
            await asyncio.sleep(4.0)  # Simulate AI thinking time
            
            # Return mock response
            mock_response = get_mock_response(message)
            return {
                "status": "success",
                "message": mock_response["ai_response"],
                "query_results": mock_response["query_results"],
                "sql_query": mock_response["sql_query"],
                "response_type": mock_response.get("response_type", "top-customers"),
                "context": {"demo_mode": True},
                "timestamp": datetime.now().isoformat()
            }
            
            # COMMENTED OUT - Real mode logic (can be uncommented later)
            # # Check if demo mode is enabled
            # if settings.DEMO_MODE:
            #     # Add realistic delay to simulate AI thinking
            #     await asyncio.sleep(4.0)
            #     
            #     # Return mock response
            #     mock_response = get_mock_response(message)
            #     return {
            #         "status": "success",
            #         "message": mock_response["ai_response"],
            #         "sql_query": mock_response["sql_query"],
            #         "query_results": mock_response["query_results"],
            #         "context": {"demo_mode": True},
            #         "timestamp": datetime.now().isoformat()
            #     }
            # 
            # # Real mode - use actual AI
            # # Get current data context
            # context = await self._get_data_context(schema_id)
            # 
            # # Generate SQL from natural language
            # sql_query = await self._generate_sql(message, context)
            # 
            # # Execute SQL if valid
            # query_results = await self._execute_sql(sql_query)
            # 
            # # Generate AI response with insights
            # ai_response = await self._generate_ai_response(message, sql_query, query_results, context)
            # 
            # return {
            #     "status": "success",
            #     "message": ai_response,
            #     "sql_query": sql_query,
            #     "query_results": query_results,
            #     "context": context,
            #     "timestamp": datetime.now().isoformat()
            # }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"Error processing message: {str(e)}",
                "sql_query": None,
                "query_results": None,
                "context": None,
                "timestamp": datetime.now().isoformat()
            }    
    # COMMENTED OUT - All the complex methods (can be uncommented later)
    # async def _get_data_context(self, schema_id: str) -> Dict[str, Any]:
    #     """Get current data context including schemas, tables, and sample data"""
    #     try:
    #         if schema_id == "all":
    #             # Get all organization schemas
    #             schema_info = await self.insights_service.get_all_org_schemas()
    #         else:
    #             # Get specific schema
    #             schema_info = await self.insights_service.get_single_schema(schema_id)
    #         
    #         return {
    #             "schema_id": schema_id,
    #             "schemas": schema_info,
    #             "available_tables": list(schema_info.keys()) if schema_info else []
    #         }
    #     except Exception as e:
    #         return {"error": f"Failed to get context: {str(e)}"}
    # 
    # async def _generate_sql(self, message: str, context: Dict[str, Any]) -> str:
    #     """Generate SQL query from natural language using OpenAI"""
    #     try:
    #         # Enhance context with detailed schema information
    #         enhanced_context = context.copy()
    #         enhanced_context["schema_details"] = self._get_schema_context_for_sql(context)
    #         
    #         # Add specific instructions for data type handling
    #         enhanced_context["data_type_notes"] = """
    #         IMPORTANT DATA TYPE NOTES:
    #         - signup_date, last_order_date, created_date, resolved_date, invoice_date, due_date, payment_date are stored as 'character varying' (text)
    #         - When comparing these date columns, use: column_name::date or CAST(column_name AS date)
    #         - For date arithmetic, use: column_name::date >= CURRENT_DATE - INTERVAL '6 months'
    #         - revenue, amount, total_amount, tax_amount, discount_applied are stored as 'numeric'
    #         - employees, units, total_orders, days_open, satisfaction_rating, response_time_hours are stored as 'integer' or 'numeric'
    #         - Always cast date columns to proper date type before comparison
    #         """
    #         
    #         # Use existing OpenAI service for SQL generation
    #         sql_query = await self.openai_service.convert_nlp_to_sql(message, enhanced_context)
    #         
    #         # Clean up SQL query - extract only the SQL part
    #         sql_query = self._extract_sql_from_response(sql_query)
    #         
    #         return sql_query
    #     except Exception as e:
    #         return f"Error generating SQL: {str(e)}"
    # 
    # def _extract_sql_from_response(self, response: str) -> str:
    #     """Extract clean SQL query from AI response"""
    #     import re
    #     
    #     # Remove markdown code blocks
    #     if "```sql" in response:
    #         # Extract content between ```sql and ```
    #         match = re.search(r'```sql\s*(.*?)\s*```', response, re.DOTALL)
    #         if match:
    #             return match.group(1).strip()
    #     elif "```" in response:
    #         # Extract content between ``` and ```
    #         match = re.search(r'```\s*(.*?)\s*```', response, re.DOTALL)
    #         if match:
    #             return match.group(1).strip()
    #     
    #     # If no code blocks, look for SQL keywords
    #     lines = response.split('\n')
    #     sql_lines = []
    #     in_sql = False
    #     
    #     for line in lines:
    #         line = line.strip()
    #         # Check if line starts with SQL keywords
    #         if re.match(r'^\s*(SELECT|WITH|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)', line, re.IGNORECASE):
    #             in_sql = True
    #             sql_lines.append(line)
    #         elif in_sql and line and not line.startswith('--'):
    #             # Continue SQL if we're in a SQL block and line is not empty or comment
    #             sql_lines.append(line)
    #         elif in_sql and not line:
    #             # Empty line in SQL block, continue
    #             sql_lines.append(line)
    #         elif in_sql and line.startswith('--'):
    #             # Comment in SQL, continue
    #             sql_lines.append(line)
    #         elif in_sql and not re.match(r'^\s*(SELECT|WITH|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE|GROUP|ORDER|HAVING|LIMIT|UNION|JOIN)', line, re.IGNORECASE):
    #             # End of SQL block
    #             break
    #     
    #     if sql_lines:
    #         return '\n'.join(sql_lines).strip()
    #     
    #     # If no SQL found, return the original response
    #     return response.strip()
    # 
    # async def _execute_sql(self, sql_query: str) -> Dict[str, Any]:
    #     """Execute SQL query and return results"""
    #     try:
    #         if not sql_query or "Error" in sql_query:
    #             return {"error": "Invalid SQL query"}
    #         
    #         # Clean the SQL query one more time before execution
    #         sql_query = sql_query.strip()
    #         
    #         # Execute query using existing database connection
    #         conn = get_db_connection()
    #         cursor = conn.cursor()
    #         
    #         cursor.execute(sql_query)
    #         results = cursor.fetchall()
    #         columns = [desc[0] for desc in cursor.description] if cursor.description else []
    #         
    #         # Format results
    #         formatted_results = []
    #         for row in results:
    #             formatted_row = {}
    #             for i, value in enumerate(row):
    #                 # Convert Decimal to float for JSON serialization
    #                 if hasattr(value, 'to_eng_string'):
    #                     formatted_row[columns[i]] = float(value)
    #                 else:
    #                     formatted_row[columns[i]] = value
    #             formatted_results.append(formatted_row)
    #         
    #         cursor.close()
    #         conn.close()
    #         
    #         return {
    #             "columns": columns,
    #             "data": formatted_results,
    #             "row_count": len(formatted_results)
    #         }
    #         
    #     except Exception as e:
    #         error_msg = str(e)
    #         # Provide more helpful error messages
    #         if "syntax error" in error_msg.lower():
    #             return {"error": f"SQL syntax error: {error_msg}. Please check the query format."}
    #         elif "relation" in error_msg.lower() and "does not exist" in error_msg.lower():
    #             return {"error": f"Table not found: {error_msg}. Please check table names."}
    #         elif "column" in error_msg.lower() and "does not exist" in error_msg.lower():
    #             return {"error": f"Column not found: {error_msg}. Please check column names."}
    #         else:
    #             return {"error": f"SQL execution failed: {error_msg}"}
    # 
    # async def _generate_ai_response(self, message: str, sql_query: str, query_results: Dict[str, Any], context: Dict[str, Any]) -> str:
    #     """Generate AI response with insights and explanations"""
    #     try:
    #         # Create comprehensive prompt for AI response with markdown formatting
    #         prompt = f"""
    #         You are a business intelligence AI assistant. The user asked: "{message}"
    #         
    #         SQL Query Generated: {sql_query}
    #         
    #         Query Results: {json.dumps(query_results, indent=2)}
    #         
    #         Data Context: {json.dumps(context, indent=2)}
    #         
    #         Please provide a comprehensive response in markdown format. Start with a brief, natural opening like "Your query executed successfully" or "Here's what I found" and then include:
    #         
    #         ## Key Insights
    #         - Bullet points of key findings from the data
    #         - Important patterns or trends identified
    #         - Statistical highlights (if applicable)
    #         
    #         ## Business Recommendations
    #         - Actionable recommendations based on the results
    #         - Strategic insights for decision making
    #         - Risk considerations or opportunities
    #         
    #         ## Next Steps
    #         - Suggested follow-up questions
    #         - Related analyses that might be valuable
    #         - Data exploration recommendations
    #         
    #         Use markdown formatting with:
    #         - Headers (##, ###)
    #         - Bullet points (-)
    #         - **Bold text** for emphasis
    #         - *Italic text* for highlights
    #         - `code snippets` for technical terms
    #         - Tables if data comparison is helpful
    #         - > Blockquotes for important insights
    #         
    #         Be conversational, helpful, and focus on business value. Make it visually appealing and easy to scan.
    #         """
    #         
    #         # Generate AI response
    #         ai_response = await self.openai_service.generate_response(prompt)
    #         return ai_response
    #         
    #     except Exception as e:
    #         return f"Error generating AI response: {str(e)}"
    # 
    # def _get_schema_context_for_sql(self, context: Dict[str, Any]) -> str:
    #     """Get detailed schema context for SQL generation"""
    #     schema_info = ""
    #     
    #     if context.get("schemas"):
    #         schemas = context["schemas"]
    #         if isinstance(schemas, dict) and "tables" in schemas:
    #             tables = schemas["tables"]
    #             for schema_name, schema_tables in tables.items():
    #                 schema_info += f"\n\nSchema: {schema_name}\n"
    #                 for table_name, columns in schema_tables.items():
    #                     schema_info += f"Table: {schema_name}.{table_name}\n"
    #                     schema_info += "Columns:\n"
    #                     for col in columns:
    #                         col_name = col.get("column", "")
    #                         col_type = col.get("type", "")
    #                         schema_info += f"  - {col_name} ({col_type})\n"
    #     
    #     return schema_info
    # 
    # async def get_chat_history(self, user_id: str = "default") -> List[Dict[str, Any]]:
    #     """Get chat history for a user"""
    #     # TODO: Implement chat history storage
    #     return []
    # 
    # async def save_chat_message(self, user_id: str, message: str, response: Dict[str, Any]) -> bool:
    #     """Save chat message and response"""
    #     # TODO: Implement chat history storage
    #     return True

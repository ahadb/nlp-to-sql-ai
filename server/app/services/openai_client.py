import openai
from typing import Dict, Any, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class OpenAIClient:
    """OpenAI client for SQL query generation and processing"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize OpenAI client
        
        Args:
            api_key: OpenAI API key (optional, can use environment variable)
        """
        api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY in .env file or pass as parameter.")
        
        self.client = openai.OpenAI(api_key=api_key)
        self.model = "gpt-3.5-turbo"  # Default model
    
    def generate_sql_query(self, user_question: str, schema: str) -> str:
        """
        Generate SQL query from natural language question
        
        Args:
            user_question: Natural language question from user
            schema: Database schema string
            
        Returns:
            Generated SQL query as string
        """
        try:
            prompt = f"""
            You are a SQL expert. Given this database schema:
            
            {schema}
            
            Convert this natural language question to SQL:
            "{user_question}"
            
            Return ONLY the SQL query, no explanations or additional text.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a SQL expert. Return only SQL queries, no explanations."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.1
            )
            
            sql_query = response.choices[0].message.content.strip()
            
            # Clean up the response (remove markdown code blocks if present)
            if sql_query.startswith("```sql"):
                sql_query = sql_query[6:]
            if sql_query.endswith("```"):
                sql_query = sql_query[:-3]
            
            return sql_query.strip()
            
        except Exception as e:
            print(f"Error generating SQL query: {e}")
            # Fallback to a simple query
            return "SELECT * FROM products LIMIT 10"
    
    def get_query_response(self, sql_query: str) -> Dict[str, Any]:
        """
        Execute SQL query and return formatted response
        
        Args:
            sql_query: SQL query to execute
            
        Returns:
            Dictionary containing query results and metadata
        """
        # TODO: Implement database execution and response formatting
        # This is a placeholder implementation
        return {
            "sql_query": sql_query,
            "results": [
                {"product_id": 1, "product_name": "Chai", "unit_price": 18.00},
                {"product_id": 2, "product_name": "Chang", "unit_price": 19.00}
            ],
            "row_count": 2,
            "execution_time": 0.05
        }
    
    def process_natural_language_query(self, question: str, schema: str) -> Dict[str, Any]:
        """
        End-to-end processing: natural language → SQL → results
        
        Args:
            question: Natural language question
            schema: Database schema
            
        Returns:
            Complete response with SQL and results
        """
        # Generate SQL from natural language
        sql_query = self.generate_sql_query(question, schema)
        
        # Execute SQL and get results
        response = self.get_query_response(sql_query)
        
        # Add original question to response
        response["original_question"] = question
        
        return response
    
    def set_model(self, model: str) -> None:
        """
        Set the OpenAI model to use
        
        Args:
            model: Model name (e.g., "gpt-3.5-turbo", "gpt-4")
        """
        self.model = model
    
    def get_model_info(self) -> Dict[str, str]:
        """
        Get information about the current model
        
        Returns:
            Dictionary with model information
        """
        return {
            "model": self.model,
            "provider": "OpenAI",
            "status": "configured"
        }

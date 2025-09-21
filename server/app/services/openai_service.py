"""
OpenAI GPT integration service for QuantumSQL
Simple, direct API calls without unnecessary abstractions
"""
from openai import AsyncOpenAI
from typing import Optional, Tuple
from app.config import settings


class OpenAIService:
    """Simple OpenAI service for NLP-to-SQL conversion"""
    
    def __init__(self):
        """Initialize OpenAI client with API key from settings"""
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def generate_sql_from_natural_language(
        self, 
        natural_query: str, 
        schema_context: str,
        include_explanation: bool = True
    ) -> Tuple[str, Optional[str], float]:
        """
        Convert natural language to SQL query
        
        Args:
            natural_query: User's question in plain English
            schema_context: Database schema information
            include_explanation: Whether to include query explanation
            
        Returns:
            Tuple of (sql_query, explanation, confidence_score)
        """
        system_prompt = self._build_system_prompt(schema_context, include_explanation)
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": natural_query}
                ],
                temperature=0.1,  # Low temperature for consistent SQL generation
                max_tokens=1000
            )
            
            content = response.choices[0].message.content.strip()
            sql_query, explanation = self._parse_response(content, include_explanation)
            confidence_score = self._calculate_confidence(response)
            
            return sql_query, explanation, confidence_score
            
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    def _build_system_prompt(self, schema_context: str, include_explanation: bool) -> str:
        """Build the system prompt for SQL generation"""
        base_prompt = f"""
You are an expert SQL query generator. Convert natural language questions into precise SQL queries.

Database Schema:
{schema_context}

Rules:
1. Generate ONLY valid SQL queries
2. Use proper table and column names from the schema
3. Include appropriate WHERE clauses, JOINs, and aggregations
4. Limit results to 100 rows unless specified otherwise
5. Use standard SQL syntax (PostgreSQL compatible)
"""
        
        if include_explanation:
            base_prompt += """
6. After the SQL query, provide a brief explanation starting with "EXPLANATION:"

Format your response as:
SQL: [your query here]
EXPLANATION: [brief explanation here]
"""
        else:
            base_prompt += """
6. Return ONLY the SQL query, no explanations or additional text
"""
        
        return base_prompt
    
    def _parse_response(self, content: str, include_explanation: bool) -> Tuple[str, Optional[str]]:
        """Parse OpenAI response to extract SQL and explanation"""
        if not include_explanation:
            return content.strip(), None
        
        # Split response into SQL and explanation
        if "EXPLANATION:" in content:
            parts = content.split("EXPLANATION:", 1)
            sql_part = parts[0].replace("SQL:", "").strip()
            explanation_part = parts[1].strip() if len(parts) > 1 else None
        else:
            sql_part = content.replace("SQL:", "").strip()
            explanation_part = None
        
        return sql_part, explanation_part
    
    def _calculate_confidence(self, response) -> float:
        """Calculate confidence score based on response metadata"""
        # Simple confidence calculation based on response structure
        # In production, you might use more sophisticated methods
        try:
            finish_reason = response.choices[0].finish_reason
            if finish_reason == "stop":
                return 0.9  # High confidence for complete responses
            elif finish_reason == "length":
                return 0.7  # Medium confidence for truncated responses
            else:
                return 0.5  # Lower confidence for other cases
        except:
            return 0.5  # Default confidence
    
    async def validate_sql_syntax(self, sql_query: str) -> Tuple[bool, Optional[str]]:
        """
        Validate SQL syntax using OpenAI
        
        Args:
            sql_query: SQL query to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        validation_prompt = f"""
Analyze this SQL query for syntax errors and potential issues:

{sql_query}

Respond with either:
- "VALID" if the query is syntactically correct
- "INVALID: [specific error description]" if there are issues
"""
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a SQL syntax validator."},
                    {"role": "user", "content": validation_prompt}
                ],
                temperature=0,
                max_tokens=200
            )
            
            result = response.choices[0].message.content.strip()
            
            if result.startswith("VALID"):
                return True, None
            elif result.startswith("INVALID:"):
                return False, result.replace("INVALID:", "").strip()
            else:
                return False, "Unknown validation error"
                
        except Exception as e:
            return False, f"Validation service error: {str(e)}"


# Global service instance
openai_service = OpenAIService()

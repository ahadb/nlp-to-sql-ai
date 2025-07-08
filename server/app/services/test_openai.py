#!/usr/bin/env python3
"""
Simple test for OpenAI client
"""

import sys
import os

# Add the app directory to the path
sys.path.append('..')

from openai_client import OpenAIClient
from db.get_db_schema import get_db_schema

def test_openai_client():
    """Test the OpenAI client with a simple example"""
    
    # Simple database schema
    # schema = """
    # products(product_id smallint, product_name varchar, unit_price real, category_id smallint)
    # categories(category_id smallint, category_name varchar, description text)
    # """

    schema = get_db_schema()
    
    # Test question
    question = "Show me all orders"
    
    try:
        print("🤖 Testing OpenAI Client...")
        print(f"Question: {question}")
        # print(f"Schema: {schema}")
        print("-" * 50)
        
        # Create client
        client = OpenAIClient()
        
        # Generate SQL
        sql_query = client.generate_sql_query(question, schema)
        
        print(f"Generated SQL: {sql_query}")
        print("✅ Test completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure you have OPENAI_API_KEY in your .env file")

if __name__ == "__main__":
    test_openai_client()
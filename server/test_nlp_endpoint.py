#!/usr/bin/env python3
"""
Quick test script for the NLP-to-SQL endpoint
Run this after starting the server with: uvicorn app.main:app --reload
"""
import requests
import json

# Test queries to try
test_queries = [
    "Show me all customers",
    "What are the top 5 products by price?",
    "How many orders were placed last month?",
    "Show me customers who have spent more than $500",
    "What are the most popular product categories?"
]

def test_nlp_endpoint():
    url = "http://localhost:8000/test-nlp"
    
    print("🚀 Testing QuantumSQL NLP-to-SQL Endpoint")
    print("=" * 50)
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n{i}. Testing: '{query}'")
        print("-" * 40)
        
        payload = {
            "natural_query": query,
            "include_explanation": True
        }
        
        try:
            response = requests.post(url, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Status: {result['status']}")
                print(f"🔮 Confidence: {result['confidence_score']:.2f}")
                print(f"📝 SQL: {result['generated_sql']}")
                if result['explanation']:
                    print(f"💡 Explanation: {result['explanation']}")
            else:
                print(f"❌ Error {response.status_code}: {response.text}")
                
        except Exception as e:
            print(f"❌ Request failed: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎯 Test complete! Check the results above.")

if __name__ == "__main__":
    test_nlp_endpoint()

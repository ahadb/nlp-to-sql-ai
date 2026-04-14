#!/usr/bin/env python3
"""
Test samples and script for Schema Service
Run this after starting the server with: uvicorn app.main:app --reload
"""
import requests
import json

# Sample SQL schema
SAMPLE_SQL = """
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);
"""

# Sample CSV data
SAMPLE_CSV = """name,email,age,city,salary,department
John Doe,john@company.com,28,New York,75000,Engineering
Jane Smith,jane@company.com,32,San Francisco,85000,Marketing
Mike Johnson,mike@company.com,25,Chicago,65000,Sales
Sarah Wilson,sarah@company.com,29,Boston,70000,Engineering
Tom Brown,tom@company.com,35,Seattle,90000,Marketing
Lisa Davis,lisa@company.com,27,Austin,68000,Sales
"""

def test_sql_schema():
    """Test SQL schema processing"""
    print("🔧 Testing SQL Schema Processing...")
    print("-" * 50)
    
    payload = {
        "file_name": "ecommerce_database.sql",
        "file_content": SAMPLE_SQL,
        "schema_type": "SQL_SCHEMA",
        "description": "E-commerce database with customers, products, orders"
    }
    
    try:
        response = requests.post("http://localhost:8000/test-schema", json=payload)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Status: {result['status']}")
            print(f"🆔 Schema ID: {result['schema']['schema_id']}")
            print(f"📊 Tables: {result['schema']['tables_count']}")
            print(f"🔗 Relationships: {result['schema']['relationships_count']}")
            print(f"📝 Namespace: {result['schema']['namespace']}")
            
            print("\n📋 Tables Detected:")
            for table in result['schema']['tables']:
                print(f"  - {table['name']} ({table['columns_count']} columns)")
                for col in table['columns'][:3]:  # Show first 3 columns
                    markers = []
                    if col['is_primary_key']:
                        markers.append("PK")
                    if col['is_foreign_key']:
                        markers.append(f"FK -> {col['foreign_key_reference']}")
                    marker_str = f" [{', '.join(markers)}]" if markers else ""
                    print(f"    • {col['name']} {col['data_type']}{marker_str}")
                if len(table['columns']) > 3:
                    print(f"    ... and {len(table['columns']) - 3} more columns")
            
            print("\n🔗 Relationships:")
            for rel in result['schema']['relationships']:
                print(f"  - {rel['from']} -> {rel['to']} ({rel['type']})")
            
            return result['schema']['schema_id']
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return None

def test_csv_schema():
    """Test CSV schema processing"""
    print("\n📊 Testing CSV Schema Processing...")
    print("-" * 50)
    
    payload = {
        "file_name": "employee_data.csv",
        "file_content": SAMPLE_CSV,
        "schema_type": "CSV_FILE",
        "description": "Employee data with demographics and salary info"
    }
    
    try:
        response = requests.post("http://localhost:8000/test-schema", json=payload)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Status: {result['status']}")
            print(f"🆔 Schema ID: {result['schema']['schema_id']}")
            print(f"📊 Tables: {result['schema']['tables_count']}")
            print(f"📝 Namespace: {result['schema']['namespace']}")
            
            print("\n📋 CSV Table Structure:")
            for table in result['schema']['tables']:
                print(f"  Table: {table['name']}")
                for col in table['columns']:
                    print(f"    • {col['name']} - {col['data_type']}")
            
            return result['schema']['schema_id']
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return None

def test_multi_schema_context(schema_ids):
    """Test multi-schema AI context generation"""
    print("\n🤖 Testing Multi-Schema AI Context...")
    print("-" * 50)
    
    try:
        response = requests.post("http://localhost:8000/test-multi-schema-context", json=schema_ids)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Status: {result['status']}")
            print(f"📋 Schema IDs: {result['schema_ids']}")
            print(f"\n🤖 AI Context Generated:")
            print(result['ai_context'])
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")

def list_all_schemas():
    """List all processed schemas"""
    print("\n📋 Listing All Schemas...")
    print("-" * 50)
    
    try:
        response = requests.get("http://localhost:8000/test-schemas")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Total Schemas: {result['total_schemas']}")
            
            for schema in result['schemas']:
                print(f"\n🔹 {schema['schema_id']}")
                print(f"   Type: {schema['schema_type']}")
                print(f"   File: {schema['file_name']}")
                print(f"   Tables: {schema['tables_count']}, Relationships: {schema['relationships_count']}")
                print(f"   Created: {schema['created_at']}")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")

def main():
    """Run all schema tests"""
    print("🚀 Testing QuantumSQL Schema Service")
    print("=" * 60)
    
    # Test SQL schema
    sql_schema_id = test_sql_schema()
    
    # Test CSV schema
    csv_schema_id = test_csv_schema()
    
    # List all schemas
    list_all_schemas()
    
    # Test multi-schema context if both schemas were created
    if sql_schema_id and csv_schema_id:
        test_multi_schema_context([sql_schema_id, csv_schema_id])
    
    print("\n" + "=" * 60)
    print("🎯 Schema Service Test Complete!")
    print("✨ Check the results above to verify schema processing works correctly.")

if __name__ == "__main__":
    main()

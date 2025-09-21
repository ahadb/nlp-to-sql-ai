"""
Simple test script to verify PostgreSQL connection
Run this first to make sure everything is working
"""
import psycopg
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_connection():
    """Test PostgreSQL connection"""
    
    # Database settings
    DB_NAME = os.getenv("DB_NAME", "quantumsql")
    DB_USER = os.getenv("DB_USER", "dev_user") 
    DB_PASS = os.getenv("DB_PASS", "dev123")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    
    database_url = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    print("🔗 Testing PostgreSQL connection...")
    print(f"📊 Database: {DB_NAME}")
    print(f"👤 User: {DB_USER}")
    print(f"🏠 Host: {DB_HOST}:{DB_PORT}")
    print()
    
    try:
        # Test connection
        conn = psycopg.connect(database_url)
        print("✅ Connection successful!")
        
        # Test query
        with conn.cursor() as cur:
            cur.execute("SELECT version();")
            version = cur.fetchone()[0]
            print(f"✅ PostgreSQL version: {version}")
            
        # Test database creation
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS test_table (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
            print("✅ Test table created successfully")
            
            # Insert test data
            cur.execute("INSERT INTO test_table (name) VALUES (%s)", ("Test User",))
            conn.commit()
            print("✅ Test data inserted")
            
            # Query test data
            cur.execute("SELECT * FROM test_table LIMIT 1")
            result = cur.fetchone()
            print(f"✅ Test query result: {result}")
            
            # Clean up
            cur.execute("DROP TABLE test_table")
            conn.commit()
            print("✅ Test cleanup completed")
        
        conn.close()
        print("\n🚀 Database is ready for QuantumSQL!")
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\n💡 Make sure:")
        print("   1. PostgreSQL is running: brew services start postgresql@15")
        print("   2. Database exists: createdb quantumsql")
        print("   3. User exists: createuser -s dev_user")
        print("   4. Check your .env file settings")
        return False

if __name__ == "__main__":
    test_connection()

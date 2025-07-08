import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os

load_dotenv()

class BaseSeeder:
    """Base class for all database seeders"""
    
    def __init__(self):
        self.connection = None
        self.cursor = None
    
    def connect(self):
        """Establish database connection"""
        try:
            self.connection = psycopg2.connect(
                dbname=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASS"),
                host=os.getenv("DB_HOST"),
                port=os.getenv("DB_PORT")
            )
            self.cursor = self.connection.cursor(cursor_factory=RealDictCursor)
            print("✅ Database connected successfully")
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            raise
    
    def disconnect(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        print("🔌 Database connection closed")
    
    def execute(self, query, params=None):
        """Execute a query with optional parameters"""
        try:
            self.cursor.execute(query, params)
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print(f"❌ Query execution failed: {e}")
            return False
    
    def fetch_one(self, query, params=None):
        """Fetch a single record"""
        self.cursor.execute(query, params)
        return self.cursor.fetchone()
    
    def fetch_all(self, query, params=None):
        """Fetch all records"""
        self.cursor.execute(query, params)
        return self.cursor.fetchall()
    
    def table_exists(self, table_name):
        """Check if a table exists"""
        query = """
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = %s
            );
        """
        result = self.fetch_one(query, (table_name,))
        return result['exists'] if result else False
    
    def table_is_empty(self, table_name):
        """Check if a table is empty"""
        query = f"SELECT COUNT(*) as count FROM {table_name};"
        result = self.fetch_one(query)
        return result['count'] == 0 if result else True
    
    def run(self):
        """Main method to run the seeder - override in child classes"""
        raise NotImplementedError("Subclasses must implement run() method")
    
    def seed(self):
        """Main entry point for seeding"""
        try:
            self.connect()
            self.run()
            print("✅ Seeding completed successfully")
        except Exception as e:
            print(f"❌ Seeding failed: {e}")
            raise
        finally:
            self.disconnect() 
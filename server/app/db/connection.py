# need to add this to remote server
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def get_connection():
    """Get database connection"""
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

def get_cursor(connection):
    """Get cursor from connection"""
    return connection.cursor()# Test comment

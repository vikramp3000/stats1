import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from contextlib import contextmanager

load_dotenv()

@contextmanager
def get_db_connection():
    """
    Get a database connection that auto-closes
    Usage: with get_db_connection() as conn:
    """
    conn = psycopg2.connect(
        host=os.getenv('DATABASE_HOST'),
        database=os.getenv('DATABASE_NAME'),
        user=os.getenv('DATABASE_USER'),
        password=os.getenv('DATABASE_PASSWORD'),
        port=os.getenv('DATABASE_PORT')
    )
    try:
        yield conn  # Give the connection to whoever asked
    finally:
        conn.close()  # Always close, even if there's an error

@contextmanager
def get_db_cursor(conn):
    """Get a cursor that returns dictionaries and auto-closes"""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        yield cursor
    finally:
        cursor.close()
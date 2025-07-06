#!/usr/bin/env python3

import os
import sys
import psycopg
import time
from pathlib import Path

def wait_for_database(database_url, max_attempts=30):
    """Wait for the database to be ready"""
    print("Waiting for database to be ready...")
    
    for attempt in range(max_attempts):
        try:
            with psycopg.connect(database_url) as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")
                    print("✅ Database is ready!")
                    return True
        except Exception as e:
            print(f"Attempt {attempt + 1}: Database not ready ({e}), waiting 2 seconds...")
            time.sleep(2)
    
    print(f"❌ Database failed to become ready after {max_attempts} attempts")
    return False

def run_migrations(database_url, sql_dir):
    """Run SQL migrations from the sql directory"""
    print(f"Running migrations from {sql_dir}...")
    
    sql_path = Path(sql_dir)
    if not sql_path.exists():
        print(f"❌ SQL directory not found: {sql_dir}")
        return False
    
    # Get all .sql files sorted by name
    sql_files = sorted(sql_path.glob("*.sql"))
    if not sql_files:
        print("No SQL migration files found")
        return True
    
    try:
        with psycopg.connect(database_url) as conn:
            with conn.cursor() as cur:
                # Create migrations tracking table if it doesn't exist
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS _migrations (
                        filename VARCHAR(255) PRIMARY KEY,
                        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                
                for sql_file in sql_files:
                    filename = sql_file.name
                    
                    # Check if migration already applied
                    cur.execute("SELECT 1 FROM _migrations WHERE filename = %s", (filename,))
                    if cur.fetchone():
                        print(f"⏭️  Migration {filename} already applied, skipping")
                        continue
                    
                    print(f"🔄 Applying migration: {filename}")
                    
                    # Read and execute the SQL file
                    sql_content = sql_file.read_text()
                    cur.execute(sql_content)
                    
                    # Record that migration was applied
                    cur.execute("INSERT INTO _migrations (filename) VALUES (%s)", (filename,))
                    
                    print(f"✅ Applied migration: {filename}")
                
                conn.commit()
                print("✅ All migrations completed successfully!")
                return True
                
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

def main():
    """Main migration function"""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL environment variable not set")
        sys.exit(1)
    
    sql_dir = "/migration/sql"
    
    print("🚀 Starting database migration...")
    
    # Wait for database to be ready
    if not wait_for_database(database_url):
        sys.exit(1)
    
    # Run migrations
    if not run_migrations(database_url, sql_dir):
        sys.exit(1)
    
    print("🎉 Migration completed successfully!")

if __name__ == "__main__":
    main()
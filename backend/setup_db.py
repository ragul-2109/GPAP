import sys
import os
import pymysql

from config import settings

# Create Database if it doesn't exist
try:
    connection = pymysql.connect(host=settings.MYSQL_HOST, user=settings.MYSQL_USER, password=settings.MYSQL_PASSWORD, port=settings.MYSQL_PORT)
    cursor = connection.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings.MYSQL_DB}")
    connection.commit()
    cursor.close()
    connection.close()
    print(f"Database {settings.MYSQL_DB} verified/created successfully.")
except Exception as e:
    print(f"Error creating database: {e}")
    sys.exit(1)

# Now, use SQLAlchemy to create tables
try:
    from database import get_engine, Base
    from models import * # Ensure all models are imported so Base knows about them
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")
except Exception as e:
    print(f"Error creating tables: {e}")
    sys.exit(1)

# Now run the seeder
try:
    from scripts.seed_database import seed_database
    seed_database()
    print("Seeding completed.")
except Exception as e:
    print(f"Error running seeder: {e}")

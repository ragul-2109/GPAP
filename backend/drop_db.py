import pymysql
from config import settings

connection = pymysql.connect(host=settings.MYSQL_HOST, user=settings.MYSQL_USER, password=settings.MYSQL_PASSWORD, port=settings.MYSQL_PORT)
cursor = connection.cursor()

# Drop database
cursor.execute(f"DROP DATABASE IF EXISTS {settings.MYSQL_DB}")
print(f"Dropped database {settings.MYSQL_DB}")

cursor.close()
connection.close()

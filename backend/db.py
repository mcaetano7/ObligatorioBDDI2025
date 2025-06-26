from dotenv import load_dotenv
import os
import mysql.connector

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        database='cafes_marloy'
    )

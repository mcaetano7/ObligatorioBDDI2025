import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='JuliOliv2024',
        database='cafes_marloy'
    )
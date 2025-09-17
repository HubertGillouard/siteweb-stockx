# test_conn.py
import psycopg2

DB_CONFIG = {
    "dbname": "sneakers",
    "user": "postgres",
    "password": "postgres123",
    "host": "localhost",
    "port": 5432
}

try:
    conn = psycopg2.connect(**DB_CONFIG)
    print("Connexion réussie !")
    conn.close()
except Exception as e:
    print("Erreur de connexion :", e)

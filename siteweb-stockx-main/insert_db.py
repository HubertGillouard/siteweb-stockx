import psycopg2
from psycopg2.extras import execute_values
from config import DB_CONFIG

def batch_insert(table, columns, data):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    query = f"INSERT INTO {table} ({','.join(columns)}) VALUES %s"
    execute_values(cur, query, data)
    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    # Exemple : insérer des marques
    marques = [("Nike",), ("Adidas",), ("Puma",), ("New Balance",), ("Jordan",)]
    batch_insert("marques", ["name"], marques)

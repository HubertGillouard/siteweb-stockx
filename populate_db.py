import requests
import random
from faker import Faker
import psycopg2
from psycopg2.extras import execute_values

fake = Faker()

# ---------------------------
# 0️⃣ Configuration
# ---------------------------
DB_CONFIG = {
    "dbname": "sneakers",
    "user": "hubert",
    "password": "motdepasse",  # mot de passe simple, sans accent
    "host": "localhost",
    "port": 5432
}


RAPIDAPI_KEY = "8b37448eb5msha9535bea6f1a7efp111c55jsne56cc943e962"
RAPIDAPI_HOST = "the-sneaker-database.p.rapidapi.com"

# ---------------------------
# 1️⃣ Connexion PostgreSQL
# ---------------------------
def get_conn():
    return psycopg2.connect(**DB_CONFIG, client_encoding='UTF8')

# ---------------------------
# 2️⃣ Récupération sneakers API (max 50)
# ---------------------------
def fetch_sneakers(limit=100):
    url = f"https://{RAPIDAPI_HOST}/sneakers"
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    }
    params = {"limit": str(limit)}
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code != 200:
            print(f"Erreur API {response.status_code}: {response.text}")
            return []
        data = response.json()
        return data.get("results", [])
    except requests.exceptions.RequestException as e:
        print("Erreur de connexion à l'API:", e)
        return []

# ---------------------------
# 3️⃣ Génération de produits mock
# ---------------------------
def generate_mock_products(n):
    return [
        {
            "name": f"Sneaker {i+1}",
            "brand": random.choice(["Nike","Adidas","Puma","Jordan","New Balance"]),
            "type": random.choice(["Running","Basketball","Lifestyle","Skate"]),
            "retailPrice": random.randint(80, 200),
            "sku": f"SKU{i+1}",
            "media": {"imageUrl": f"https://example.com/sneaker{i+1}.jpg"}
        }
        for i in range(n)
    ]

# ---------------------------
# 4️⃣ Variants, Images, Users, Orders
# ---------------------------
def generate_variants(products, sizes=[40,41,42,43,44,45], colors=None):
    if colors is None:
        colors = ["Red", "Blue", "Black", "White", "Green"]
    variants = []
    variant_id = 1
    for idx, product in enumerate(products, start=1):
        for _ in range(5):  # 5 variantes par produit
            size = str(random.choice(sizes))
            color = random.choice(colors)
            stock = random.randint(1, 20)
            price = float(product.get('retailPrice') or 100)
            variants.append({
                "id": variant_id,
                "product_id": idx,
                "size": size,
                "color": color,
                "stock": stock,
                "price": price
            })
            variant_id += 1
    return variants

def generate_images(products):
    images = []
    for idx, product in enumerate(products, start=1):
        img_urls = product.get('media', {}).get('imageUrl', None)
        if img_urls:
            for url in ([img_urls] if isinstance(img_urls, str) else img_urls)[:3]:
                images.append({"product_id": idx, "url": url})
    return images

def generate_users(n=50):
    users = []
    for _ in range(n):
        users.append({
            "email": fake.email(),
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "password_hash": fake.password(length=12),
            "role": "customer"
        })
    users.append({
        "email": "admin@example.com",
        "first_name": "Admin",
        "last_name": "Root",
        "password_hash": "admin_pwd",
        "role": "admin"
    })
    return users

def generate_orders(users, variants):
    orders = []
    order_items = []
    order_id = 1
    for user_id in range(1, len(users)+1):
        for _ in range(10):  # 10 commandes par utilisateur
            total = 0
            sample_size = min(3, len(variants))
            items = random.sample(variants, sample_size)
            for item in items:
                quantity = random.randint(1, 2)
                order_items.append({
                    "order_id": order_id,
                    "variant_id": item['id'],
                    "quantity": quantity,
                    "price": item['price']
                })
                total += item['price'] * quantity
            orders.append({
                "id": order_id,
                "user_id": user_id,
                "total": total,
                "status": random.choice(["paid","pending"])
            })
            order_id += 1
    return orders, order_items

# ---------------------------
# 5️⃣ Batch insert
# ---------------------------
def batch_insert(table, columns, data):
    conn = get_conn()
    cur = conn.cursor()
    query = f"INSERT INTO {table} ({','.join(columns)}) VALUES %s"
    values = [tuple(d[col] for col in columns) for d in data]
    execute_values(cur, query, values)
    conn.commit()
    cur.close()
    conn.close()
    print(f"{len(data)} rows inserted into {table}")

# ---------------------------
# 6️⃣ Exécution principale
# ---------------------------
if __name__ == "__main__":
    print("Fetching sneakers from API...")
    sneakers_api = fetch_sneakers(limit=50)

    # Compléter avec des produits mock pour atteindre 500
    needed = 500 - len(sneakers_api)
    print(f"Generating {needed} mock products to reach 500...")
    sneakers_mock = generate_mock_products(needed)

    sneakers = sneakers_api + sneakers_mock

    print("Generating variants and images...")
    variants = generate_variants(sneakers)
    images = generate_images(sneakers)

    print("Generating users and orders...")
    users = generate_users(50)
    orders, order_items = generate_orders(users, variants)

    print("Preparing unique brands and categories...")
    brands = list({s.get('brand','Unknown') for s in sneakers})
    brand_map = {name: idx+1 for idx, name in enumerate(brands)}
    categories = list({s.get('type','Unknown') for s in sneakers})
    category_map = {name: idx+1 for idx, name in enumerate(categories)}

    print("Inserting into database...")
    batch_insert("users", ["email","password_hash","first_name","last_name","role"], users)
    batch_insert("marques", ["name"], [{"name":b} for b in brands])
    batch_insert("categories", ["name"], [{"name":c} for c in categories])
    batch_insert(
        "products",
        ["name","description","price","brand_id","category_id","sku"],
        [
            {
                "name": s['name'],
                "description": s.get('description',''),
                "price": float(s.get('retailPrice',100)),
                "brand_id": brand_map.get(s.get('brand','Unknown')),
                "category_id": category_map.get(s.get('type','Unknown')),
                "sku": s.get('sku', f'SKU-{idx}')
            } for idx, s in enumerate(sneakers)
        ]
    )
    batch_insert("variantes", ["id","product_id","size","color","stock","price"], variants)
    batch_insert("images", ["product_id","url"], images)
    batch_insert("orders", ["id","user_id","total","status"], orders)
    batch_insert("order_items", ["order_id","variant_id","quantity","price"], order_items)

    print("Database populated successfully!")

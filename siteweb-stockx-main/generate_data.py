from faker import Faker
import random

fake = Faker()

def generate_variants(products, sizes=[40,41,42,43,44,45], colors=None):
    if colors is None:
        colors = ["Red", "Blue", "Black", "White", "Green"]
    variants = []
    for product in products:
        for _ in range(5):  # 5 variantes par produit
            size = str(random.choice(sizes))
            color = random.choice(colors)
            stock = random.randint(1, 20)
            price = product['price']
            variants.append({
                "product_id": product['id'],
                "size": size,
                "color": color,
                "stock": stock,
                "price": price
            })
    return variants

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
    return users

def generate_orders(users, variants):
    orders = []
    order_items = []
    order_id = 1
    for user in users:
        for _ in range(10):  # 10 commandes par utilisateur
            order_total = 0
            items = random.sample(variants, 3)
            for item in items:
                quantity = random.randint(1, 2)
                order_items.append({
                    "order_id": order_id,
                    "variant_id": item['product_id'],  # simplification
                    "quantity": quantity,
                    "price": item['price']
                })
                order_total += item['price'] * quantity
            orders.append({
                "id": order_id,
                "user_email": user['email'],
                "total": order_total,
                "status": random.choice(["paid", "pending"])
            })
            order_id += 1
    return orders, order_items

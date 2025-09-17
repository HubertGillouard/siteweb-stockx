def fetch_sneakers(limit_total=500):
    """
    Récupère jusqu'à `limit_total` sneakers depuis The Sneaker Database API.
    L'API accepte `limit` entre 10 et 100 par requête.
    """
    url = f"https://{RAPIDAPI_HOST}/sneakers"
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    }

    sneakers = []
    offset = 0
    limit_per_request = 50  # valide entre 10 et 100

    while len(sneakers) < limit_total:
        params = {"limit": str(limit_per_request), "offset": str(offset)}
        response = requests.get(url, headers=headers, params=params, timeout=10)

        if response.status_code != 200:
            print(f"Erreur API {response.status_code} : {response.text}")
            break

        data = response.json()
        results = data.get("results", [])
        if not results:
            print("Aucune sneaker trouvée à cet offset.")
            break

        sneakers.extend(results)
        offset += limit_per_request

    # tronquer à `limit_total` si besoin
    return sneakers[:limit_total]
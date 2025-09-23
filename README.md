# ChatIRC

Spécification fonctionnelle (extrait)

Gestion des stocks : CRUD produit, variantes par taille, catégorie (hommes, femmes, enfants, sport, ville), mise à jour en temps réel via SSE.

Rôles & droits :

Admin : CRUD produits, suppression, vision globale des commandes, changement de statut.

Vendeur : MAJ stocks, changement de statut commande.

Client : parcours d’achat, historique.

Processus d’achat : panier → paiement fictif → création commande → confirmation (email simulé en log) → suivi statut.

IU & accessibilité : navigation claire, boutons, contrastes, texte alternatif des images (fallback).

RGPD : bandeau cookies, endpoints privacy (/privacy), export (/gdpr/export), suppression (/gdpr/delete), sécurité (helmet, rate-limit, validation).



Spécification technique (extrait)

Backend : Node/Express, JSON store (data/products.json), SSE /api/stocks/stream, auth JWT, CORS sécurisé, Helmet, Rate Limit.

Endpoints clés :

GET /api/products[?category=&size=], GET /api/products/:id

POST /api/products (admin/seller), PUT /api/products/:id (admin/seller), DELETE /api/products/:id (admin), PATCH /api/products/:id/stock

POST /api/auth/login, POST /api/auth/register

POST /api/payments (fictif)

POST /api/orders, GET /api/orders, PATCH /api/orders/:id/status

GET /api/privacy, POST /api/gdpr/export, POST /api/gdpr/delete

Frontend : React (routes, context panier), axios, pages Admin/Seller/Checkout/Login, placeholder images, baseURL configurable.

Déploiement : Docker (api sur 5050, web sur 80) ou Render/Netlify.
# Sneakiz - Site E-commerce Sneakers

Un site e-commerce moderne et complet pour la vente de sneakers avec authentification, gestion des rôles et plus de 100 produits.

## Fonctionnalités

### 🛍️ E-commerce
- Catalogue de 100+ sneakers avec 500+ références
- Système de panier avec gestion des quantités
- Filtres avancés (marque, prix, taille, catégorie)
- Recherche en temps réel
- Pages produit détaillées

### 🔐 Authentification & Sécurité
- Inscription/Connexion sécurisée avec Supabase Auth
- Système de rôles (utilisateur/admin)
- Profils utilisateurs personnalisés
- Sécurité au niveau des lignes (RLS)

### 📱 Interface Utilisateur
- Design responsive moderne
- Animations et micro-interactions
- Interface inspirée des leaders du marché
- Navigation intuitive
- Panier latéral coulissant

### 🛡️ Administration
- Dashboard admin pour la gestion des produits
- Gestion des commandes
- Gestion des utilisateurs
- Statistiques de vente

## Technologies

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Icons**: Lucide React
- **Build**: Vite

## Démarrage Rapide

1. Clonez le projet
2. Configurez Supabase (cliquez sur "Connect to Supabase")
3. Copiez `.env.example` vers `.env` et configurez vos variables
4. Installez les dépendances: `npm install`
5. Lancez le projet: `npm run dev`

## Comptes de Test

- **Admin**: admin@Sneakiz.com / admin123
- **Utilisateur**: user@Sneakiz.com / user123

## Structure du Projet

```
src/
├── components/         # Composants réutilisables
├── hooks/             # Hooks personnalisés
├── lib/               # Utilitaires et configuration
├── types/             # Types TypeScript
└── App.tsx           # Composant principal

supabase/
└── migrations/        # Migrations de base de données
```

## Base de Données

Le schéma inclut :
- **brands**: Marques de sneakers
- **categories**: Catégories de produits
- **products**: Produits principaux
- **product_variants**: Variantes (tailles, couleurs)
- **product_images**: Images des produits
- **user_profiles**: Profils utilisateurs
- **orders**: Commandes
- **order_items**: Articles des commandes
- **cart_items**: Panier utilisateur

Toutes les tables sont sécurisées avec RLS (Row Level Security).
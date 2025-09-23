/*
# Mise à jour pour le rôle vendeur et fonctionnalités RGPD

## Modifications

1. Nouveaux rôles et statuts
   - Ajout du rôle `vendor` pour les vendeurs
   - Nouveaux statuts de commande et paiement

2. Nouvelles tables
   - `stock_movements` - Historique des mouvements de stock
   - `consent_records` - Enregistrement des consentements RGPD

3. Modifications des tables existantes
   - Mise à jour du type `user_role` 
   - Mise à jour du type `order_status`
   - Ajout du statut de paiement aux commandes

4. Sécurité
   - Politiques RLS pour les nouveaux rôles
   - Politiques pour la gestion des stocks par les vendeurs
*/

-- Mise à jour des types ENUM existants
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('user', 'admin', 'vendor');

DROP TYPE IF EXISTS order_status CASCADE;
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Mise à jour de la table user_profiles pour supporter le nouveau rôle
ALTER TABLE user_profiles 
DROP COLUMN IF EXISTS role CASCADE;

ALTER TABLE user_profiles 
ADD COLUMN role user_role DEFAULT 'user';

-- Ajouter la colonne status si elle n’existe pas
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS status order_status DEFAULT 'pending';

-- Ajouter la colonne payment_status si elle n’existe pas
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT 'pending';

-- Table des mouvements de stock
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity integer NOT NULL,
  reason text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Table des consentements RGPD
CREATE TABLE IF NOT EXISTS consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  analytics_consent boolean DEFAULT false,
  marketing_consent boolean DEFAULT false,
  functional_consent boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS pour les nouvelles tables
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour stock_movements
CREATE POLICY "Admins and vendors can view all stock movements"
  ON stock_movements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'vendor')
    )
  );

CREATE POLICY "Admins and vendors can create stock movements"
  ON stock_movements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'vendor')
    )
    AND auth.uid() = user_id
  );

-- Politiques RLS pour consent_records
CREATE POLICY "Users can view own consent records"
  ON consent_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create consent records"
  ON consent_records FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update own consent records"
  ON consent_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Mise à jour des politiques existantes pour supporter le rôle vendor

-- Politiques pour les produits (vendors peuvent les voir)
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- S'assurer que RLS est activé
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Supprimer d'anciennes policies potentielles
DROP POLICY IF EXISTS "Only admins can modify products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;

-- Admins peuvent supprimer (DELETE)
CREATE POLICY "Only admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
  );

-- Admins peuvent insérer (INSERT) — CHECK sur la ligne insérée
CREATE POLICY "Only admins can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
  );

-- Admins peuvent modifier (UPDATE) — both USING (can see row) et WITH CHECK (nouvelle ligne valide)
CREATE POLICY "Only admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
  );

-- Politiques pour les variantes de produits (vendors peuvent les modifier)
DROP POLICY IF EXISTS "Only admins can modify product variants" ON product_variants;
CREATE POLICY "Admins and vendors can modify product variants"
  ON product_variants FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'vendor')
    )
  );

-- Supprimer l'ancienne policy si elle existe
DROP POLICY IF EXISTS "Only admins can create/delete product variants" ON product_variants;

-- Policy pour INSERT
CREATE POLICY "Only admins can insert product variants"
  ON product_variants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy pour DELETE
CREATE POLICY "Only admins can delete product variants"
  ON product_variants
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );


-- Politiques pour les commandes (vendors peuvent les voir et les modifier)
DROP POLICY IF EXISTS "Only admins can update orders" ON orders;
CREATE POLICY "Admins and vendors can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'vendor')
    )
  );

-- Fonction pour calculer automatiquement le total d'une commande
CREATE OR REPLACE FUNCTION calculate_order_total(order_id uuid)
RETURNS decimal AS $$
DECLARE
  total_amount decimal(10,2);
BEGIN
  SELECT SUM(total_price)
  INTO total_amount
  FROM order_items
  WHERE order_items.order_id = calculate_order_total.order_id;
  
  RETURN COALESCE(total_amount, 0);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le stock après une commande
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS trigger AS $$
BEGIN
  -- Diminuer le stock quand une commande est confirmée
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    UPDATE product_variants
    SET stock_quantity = stock_quantity - order_items.quantity
    FROM order_items
    WHERE order_items.order_id = NEW.id
    AND product_variants.id = order_items.product_variant_id;
    
    -- Enregistrer les mouvements de stock
    INSERT INTO stock_movements (product_variant_id, type, quantity, reason, user_id)
    SELECT 
      order_items.product_variant_id,
      'out',
      order_items.quantity,
      'Order confirmed: ' || NEW.order_number,
      NEW.user_id
    FROM order_items
    WHERE order_items.order_id = NEW.id;
  END IF;
  
  -- Remettre le stock si la commande est annulée
  IF NEW.status = 'cancelled' AND OLD.status IN ('confirmed', 'processing') THEN
    UPDATE product_variants
    SET stock_quantity = stock_quantity + order_items.quantity
    FROM order_items
    WHERE order_items.order_id = NEW.id
    AND product_variants.id = order_items.product_variant_id;
    
    -- Enregistrer les mouvements de stock
    INSERT INTO stock_movements (product_variant_id, type, quantity, reason, user_id)
    SELECT 
      order_items.product_variant_id,
      'in',
      order_items.quantity,
      'Order cancelled: ' || NEW.order_number,
      NEW.user_id
    FROM order_items
    WHERE order_items.order_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour la mise à jour automatique du stock
DROP TRIGGER IF EXISTS on_order_status_change ON orders;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_after_order();

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_variant_id ON stock_movements(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_session_id ON consent_records(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Mise à jour de la fonction handle_new_user pour les nouveaux champs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    'user'::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
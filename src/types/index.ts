export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  brand_id: string;
  category_id?: string;
  base_price: number;
  sku: string;
  is_featured: boolean;
  is_active: boolean;
  release_date?: string;
  created_at: string;
  updated_at: string;
  brand?: Brand;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  price: number;
  stock_quantity: number;
  sku: string;
  is_available: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin' | 'vendor';
  phone?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: ShippingAddress;
  billing_address: BillingAddress;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_variant_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product_variant?: ProductVariant & {
    product?: Product;
  };
}

export interface CartItem {
  id: string;
  user_id: string;
  product_variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product_variant?: ProductVariant & {
    product?: Product & {
      brand?: Brand;
      images?: ProductImage[];
    };
  };
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  card_last_four?: string;
  card_brand?: string;
  email?: string;
}

export interface StockMovement {
  id: string;
  product_variant_id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  user_id: string;
  created_at: string;
}

export interface ConsentRecord {
  id: string;
  user_id?: string;
  session_id: string;
  analytics_consent: boolean;
  marketing_consent: boolean;
  functional_consent: boolean;
  created_at: string;
  updated_at: string;
}
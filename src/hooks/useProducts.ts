import { useState, useEffect } from 'react';
import { Product, Brand, Category } from '../types';
import productsJson from '../data/products_with_images.json';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data: Product[] = productsJson;

      setProducts(data);

      const brandList: Brand[] = Array.from(new Map(data.map(p => [p.brand.id, p.brand])).values());
      const categoryList: Category[] = Array.from(
        new Map(data.map(p => [p.category?.id, p.category])).values()
      ).filter(Boolean) as Category[];

      setBrands(brandList);
      setCategories(categoryList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = (filters: {
    brands?: string[];
    categories?: string[];
    priceRange?: [number, number];
    search?: string;
  }) => {
    return products.filter(product => {
      if (filters.brands?.length && !filters.brands.includes(product.brand.id)) return false;
      if (filters.categories?.length && product.category && !filters.categories.includes(product.category.id)) return false;

      if (filters.priceRange) {
        const minPrice = product.variants?.reduce((min, v) => Math.min(min, v.price), product.base_price) || product.base_price;
        if (minPrice < filters.priceRange[0] || minPrice > filters.priceRange[1]) return false;
      }

      if (filters.search) {
        const term = filters.search.toLowerCase();
        if (!product.name.toLowerCase().includes(term) &&
            !product.brand.name.toLowerCase().includes(term) &&
            !(product.description?.toLowerCase().includes(term))) return false;
      }

      return true;
    });
  };

  // Décrémenter le stock
  const decrementStock = (productId: string, variantId: string, quantity: number = 1) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants?.map(v => 
            v.id === variantId ? { ...v, stock: Math.max(v.stock - quantity, 0) } : v
          ),
        };
      })
    );
  };

  return {
    products,
    brands,
    categories,
    loading,
    error,
    filteredProducts,
    refetch: fetchData,
    decrementStock,
  };
}

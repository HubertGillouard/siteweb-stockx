import React from 'react';
import  Hero  from '../components/Hero';
import { FeaturedSection } from '../components/FeaturedSection';
import { BrandSection } from '../components/BrandSection';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { products, brands, loading } = useProducts();
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (productId: string) => {
    if (!user) return alert('Connecte-toi d’abord');
    const product = products.find(p => p.id === productId);
    const firstVariant = product?.variants?.[0];
    if (firstVariant) await addItem(firstVariant.id);
  };

  return (
    <div>
      <Hero />
      <FeaturedSection
        products={products}
        loading={loading}
        onAddToCart={handleAddToCart}
      />
      <BrandSection brands={brands} onBrandClick={(id) => console.log(id)} />
    </div>
  );
};

export default HomePage;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import productsData from "../data/products_with_images.json";
import ProductGrid from "../components/ProductGrid";
import { Filters } from "../components/Filters";
import { useCart } from "../hooks/useCart";
import { Product } from "../types";

export default function ShopPage() {
  const location = useLocation();
  const { addItem } = useCart();

  const [products, setProducts] = useState<Product[]>(productsData);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Lit la catégorie depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) setSelectedCategories([category]);
  }, [location.search]);

  // Filtrage des produits
  const filteredProducts = products.filter((product) => {
    const brandName = product.brand?.name || "";
    const categoryName = product.category?.name || "";

    if (selectedBrands.length && !selectedBrands.includes(brandName)) return false;
    if (selectedCategories.length && !selectedCategories.includes(categoryName)) return false;
    if (product.base_price < priceRange[0] || product.base_price > priceRange[1]) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!product.name.toLowerCase().includes(term) && !brandName.toLowerCase().includes(term)) {
        return false;
      }
    }

    // Filtrage par tailles
    if (selectedSizes.length && product.variants) {
      const availableSizes = product.variants.map((v) => v.size);
      if (!selectedSizes.some((size) => availableSizes.includes(size))) return false;
    }

    return true;
  });

  // Listes uniques pour les filtres
  const brands = [...new Set(products.map((p) => p.brand?.name))];
  const categories = [...new Set(products.map((p) => p.category?.name))];
  const sizes = [...new Set(products.flatMap((p) => p.variants?.map((v) => v.size) || []))];

  const handleAddToCart = (productId: string, variantId: string) => {
    addItem(productId, variantId, 1);
  };

  const handleBrandChange = (brand: string) =>
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));

  const handleCategoryChange = (category: string) =>
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));

  const handleSizeChange = (size: string) =>
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setPriceRange([0, 500]);
    setSearchTerm("");
  };

  return (
    <div className="flex">
      <Filters
        brands={brands.map((b) => ({ id: b, name: b }))}
        categories={categories.map((c) => ({ id: c, name: c }))}
        sizes={sizes.map((s) => ({ id: s, name: s }))}
        selectedBrands={selectedBrands}
        selectedCategories={selectedCategories}
        selectedSizes={selectedSizes}
        priceRange={priceRange}
        onBrandChange={handleBrandChange}
        onCategoryChange={handleCategoryChange}
        onSizeChange={handleSizeChange}
        onPriceChange={setPriceRange}
        onClearFilters={handleClearFilters}
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />

      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Toutes les Sneakers</h1>
            <p className="text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="lg:hidden bg-black text-white px-4 py-2 rounded-md"
            >
              Filtres
            </button>
          </div>
        </div>

        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onProductClick={(id) => console.log("Produit cliqué", id)}
        />
      </main>
    </div>
  );
}

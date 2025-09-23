import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import productsData from "../data/products_with_images.json"; // ton JSON exporté
import { Filters } from "../components/Filters";

export default function ShopPage() {
  const location = useLocation();

  const [products, setProducts] = useState(productsData);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Lit category depuis URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) setSelectedCategories([category]);
  }, [location.search]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 500]);
    setSearchTerm("");
  };

  const filteredProducts = products.filter((product) => {
  const brandName = typeof product.brand === "string" ? product.brand : product.brand?.name;
  const categoryName = typeof product.category === "string" ? product.category : product.category?.name;

  const filtered = products.filter((product) => {
  const name = product.name || "";
  return name.toLowerCase().includes(searchTerm.toLowerCase());
});

  if (selectedBrands.length && !selectedBrands.includes(brandName)) return false;
  if (selectedCategories.length && !selectedCategories.includes(categoryName)) return false;

  if (product.base_price < priceRange[0] || product.base_price > priceRange[1]) return false;

  if (
    searchTerm &&
    !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !brandName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) return false;

  return true;
});

  // Listes uniques pour les filtres
  const brands = [...new Set(products.map((p) => p.brand))];
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="flex">
      <Filters
        brands={brands.map((b) => ({ id: b, name: b }))}
        categories={categories.map((c) => ({ id: c, name: c }))}
        selectedBrands={selectedBrands}
        selectedCategories={selectedCategories}
        priceRange={priceRange}
        onBrandChange={handleBrandChange}
        onCategoryChange={handleCategoryChange}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => (
            <div
              key={idx}
              className="border rounded-md p-2 flex flex-col items-center"
            >
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src={product.images?.[0]?.url || "/placeholder.png"} // placeholder si pas d'image
                  alt={product.name}
                  className="object-contain h-full"
                />
              </div>
              <p className="mt-2 font-medium text-center">{product.name}</p>
              <p className="text-sm text-gray-500">{product.brand}</p>
              <p className="text-lg font-semibold">{product.base_price.toFixed(2)}€</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

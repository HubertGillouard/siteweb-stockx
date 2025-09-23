import React from 'react';
import { Filter, X } from 'lucide-react';
import { Brand, Category } from '../types';

interface FiltersProps {
  brands: Brand[];
  categories: Category[];
  selectedBrands: string[];
  selectedCategories: string[];
  priceRange: [number, number];
  onBrandChange: (brandId: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Filters({
  brands,
  categories,
  selectedBrands,
  selectedCategories,
  priceRange,
  onBrandChange,
  onCategoryChange,
  onPriceChange,
  onClearFilters,
  isOpen,
  onClose,
}: FiltersProps) {

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 500;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Filters Panel */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <h2 className="font-semibold text-lg">Filtres</h2>
            </div>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Effacer tout
                </button>
              )}
              <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-medium mb-4">Prix</h3>
            <div className="space-y-3">
              <input
                type="range"
                min={0}
                max={500}
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceChange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>€0</span>
                <span>€{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Brands */}
          <div className="mb-8">
            <h3 className="font-medium mb-4">Marques</h3>
            <div className="space-y-2">
              {brands?.map(
                (brand) =>
                  brand?.id && (
                    <label key={brand.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => onBrandChange(brand.id)}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-sm">{brand.name}</span>
                    </label>
                  )
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-medium mb-4">Catégories</h3>
            <div className="space-y-2">
              {categories?.map(
                (category) =>
                  category?.id && (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => onCategoryChange(category.id)}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-sm">{category.name}</span>
                    </label>
                  )
              )}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className="font-medium mb-4">Tailles</h3>
            <div className="grid grid-cols-3 gap-2">
              {['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'].map((size) => (
                <button
                  key={size}
                  className="border border-gray-300 rounded-md py-2 text-sm hover:border-black transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

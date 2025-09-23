import React from 'react';
import { Brand } from '../types';

interface BrandSectionProps {
  brands: Brand[];
  onBrandClick: (brandId: string) => void;
}

export function BrandSection({ brands, onBrandClick }: BrandSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Marques
          </h2>
          <p className="text-lg text-gray-600">
            Les plus grandes marques de sneakers au monde
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => onBrandClick(brand.id)}
              className="group p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="aspect-square mb-3 bg-white rounded-md overflow-hidden">
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {brand.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="font-medium text-sm text-gray-900 group-hover:text-orange-500 transition-colors">
                {brand.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
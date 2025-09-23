import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[70vh] bg-gradient-to-r from-black to-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Hero sneakers"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Step Into
            <span className="block text-orange-500">Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Découvrez notre collection exclusive de sneakers authentiques des plus grandes marques
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="group bg-orange-500 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/new-release')}
              className="border-2 border-white text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-white hover:text-black transition-colors"
            >
              Découvrir les nouveautés
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-orange-500/20 to-transparent"></div>
    </div>
  );
}

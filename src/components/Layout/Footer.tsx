import React from 'react';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

type Page =
  | 'home'
  | 'shop'
  | 'new-releases'
  | 'profile'
  | 'orders'
  | 'checkout'
  | 'privacy-policy'
  | 'admin-dashboard'
  | 'admin-products'
  | 'vendor-dashboard';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Sneakiz</h3>
            <p className="text-gray-400 mb-4">
              La destination ultime pour les sneakers authentiques et les dernières sorties.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => onNavigate('new-releases')}
                  className="hover:text-white transition-colors"
                >
                  New Releases
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors"
                >
                  Men
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors"
                >
                  Women
                </button>
              </li>
              <li className="hover:text-white transition-colors">Kids</li>
              <li className="hover:text-white transition-colors">Sale</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Restez informé des dernières sorties et offres exclusives.
            </p>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-500 px-4 py-2 rounded-r-md hover:bg-orange-600 transition-colors">
                OK
              </button>
            </div>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> <span>contact@sneakiz.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" /> 
                <span>123 rue de la Sneaker<br />75001 Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm mb-4 md:mb-0">&copy; 2024 Sneakiz. Tous droits réservés.</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <button
                onClick={() => onNavigate('privacy-policy')}
                className="hover:text-white transition-colors"
              >
                Politique de confidentialité
              </button>
              <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <button
                onClick={() => {
                  localStorage.removeItem('cookie-consent');
                  window.location.reload();
                }}
                className="hover:text-white transition-colors"
              >
                Gestion des cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

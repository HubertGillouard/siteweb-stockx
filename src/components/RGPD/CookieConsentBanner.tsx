import React, { useState, useEffect } from 'react';
import { X, Settings, Shield, BarChart3, Mail } from 'lucide-react';

interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieConsentBannerProps {
  onAcceptAll: (consents: ConsentSettings) => void;
  onRejectAll: (consents: ConsentSettings) => void;
  onCustomize: (consents: ConsentSettings) => void;
}

export default function CookieConsentBanner({ 
  onAcceptAll, 
  onRejectAll, 
  onCustomize 
}: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consents, setConsents] = useState<ConsentSettings>({
    analytics: false,
    marketing: false,
    functional: true, // Toujours activé par défaut
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      // Délai pour laisser la page se charger
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsents = { analytics: true, marketing: true, functional: true };
    localStorage.setItem('cookie-consent', JSON.stringify(allConsents));
    onAcceptAll(allConsents);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const minimalConsents = { analytics: false, marketing: false, functional: true };
    localStorage.setItem('cookie-consent', JSON.stringify(minimalConsents));
    onRejectAll(minimalConsents);
    setShowBanner(false);
  };

  const handleCustomize = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(consents));
    onCustomize(consents);
    setShowBanner(false);
  };

  const handleConsentChange = (type: keyof ConsentSettings, value: boolean) => {
    if (type === 'functional') return; // Ne peut pas être désactivé
    setConsents(prev => ({ ...prev, [type]: value }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Gestion des cookies</h2>
          </div>
          <button 
            onClick={handleRejectAll}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenu principal */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic 
            et personnaliser le contenu. Vous pouvez choisir quels cookies vous acceptez.
          </p>

          {!showDetails ? (
            // Vue simplifiée
            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Accepter tous les cookies
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Rejeter tout
                </button>
              </div>
              <button
                onClick={() => setShowDetails(true)}
                className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 py-2"
              >
                <Settings className="h-4 w-4" />
                Personnaliser mes choix
              </button>
            </div>
          ) : (
            // Vue détaillée
            <div className="space-y-6">
              {/* Cookies fonctionnels */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Cookies fonctionnels</h3>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Obligatoire
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Nécessaires au fonctionnement du site (authentification, panier, préférences).
                </p>
              </div>

              {/* Cookies analytiques */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Cookies analytiques</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.analytics}
                      onChange={(e) => handleConsentChange('analytics', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Nous aident à comprendre comment vous utilisez le site pour l'améliorer.
                </p>
              </div>

              {/* Cookies marketing */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">Cookies marketing</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.marketing}
                      onChange={(e) => handleConsentChange('marketing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Permettent de vous proposer des publicités personnalisées.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCustomize}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Enregistrer mes préférences
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-3 text-gray-600 hover:text-gray-800"
                >
                  Retour
                </button>
              </div>
            </div>
          )}

          {/* Liens légaux */}
          <div className="mt-6 pt-4 border-t text-sm text-gray-500">
            <p>
              En continuant à naviguer, vous acceptez notre{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:underline">
                politique de confidentialité
              </a>{' '}
              et nos{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                conditions d'utilisation
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
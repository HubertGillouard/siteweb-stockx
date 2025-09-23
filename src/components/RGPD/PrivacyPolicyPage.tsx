import React from 'react';
import { Shield, User, Database, Cookie, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Politique de Confidentialité</h1>
              <p className="text-gray-600 mt-2">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Chez Sneakiz, nous nous engageons à protéger votre vie privée et vos données personnelles. 
            Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Données collectées */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Database className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">Données que nous collectons</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">Informations d'identification</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Date de naissance (optionnel)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Informations de commande</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Adresses de livraison et de facturation</li>
                  <li>Historique des commandes</li>
                  <li>Préférences de paiement</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Données techniques</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Adresse IP</li>
                  <li>Type de navigateur et version</li>
                  <li>Pages visitées et durée de visite</li>
                  <li>Cookies et technologies similaires</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Utilisation des données */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">Comment nous utilisons vos données</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Services essentiels</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Traitement et livraison de vos commandes</li>
                  <li>Gestion de votre compte utilisateur</li>
                  <li>Service client et support technique</li>
                  <li>Prévention de la fraude et sécurité</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Amélioration du service</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Analyse du comportement utilisateur</li>
                  <li>Personnalisation de l'expérience</li>
                  <li>Développement de nouveaux produits</li>
                  <li>Marketing et communications (avec votre consentement)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Cookie className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">Gestion des Cookies</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Nous utilisons différents types de cookies pour améliorer votre expérience :
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Cookies essentiels</h4>
                  <p className="text-sm text-gray-600">
                    Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Cookies analytiques</h4>
                  <p className="text-sm text-gray-600">
                    Nous aident à comprendre comment vous utilisez notre site.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Cookies marketing</h4>
                  <p className="text-sm text-gray-600">
                    Permettent de personnaliser les publicités que vous voyez.
                  </p>
                </div>
              </div>
              <p className="text-gray-700">
                Vous pouvez modifier vos préférences de cookies à tout moment via notre 
                gestionnaire de consentement.
              </p>
            </div>
          </section>

          {/* Vos droits */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">Vos droits RGPD</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Droit d'accès</h4>
                    <p className="text-sm text-gray-600">
                      Obtenir une copie de vos données personnelles
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Droit de rectification</h4>
                    <p className="text-sm text-gray-600">
                      Corriger des données inexactes ou incomplètes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Droit à l'effacement</h4>
                    <p className="text-sm text-gray-600">
                      Demander la suppression de vos données
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Droit de portabilité</h4>
                    <p className="text-sm text-gray-600">
                      Récupérer vos données dans un format utilisable
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Droit d'opposition</h4>
                    <p className="text-sm text-gray-600">
                      Vous opposer au traitement de vos données
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Droit de limitation</h4>
                    <p className="text-sm text-gray-600">
                      Limiter le traitement de vos données
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">Nous contacter</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Pour exercer vos droits ou poser des questions</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">privacy@sneakiz.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">01 23 45 67 89</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4">Délégué à la Protection des Données</h3>
                <p className="text-gray-700">
                  Notre DPO est disponible pour répondre à toutes vos questions 
                  concernant le traitement de vos données personnelles.
                </p>
                <div className="mt-2">
                  <span className="text-blue-600">dpo@sneakiz.com</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 p-6 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">
            Cette politique de confidentialité peut être modifiée. Nous vous informerons 
            de tout changement significatif par email ou via une notification sur le site.
          </p>
        </div>
      </div>
    </div>
  );
}
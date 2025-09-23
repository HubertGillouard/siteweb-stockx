import React, { useState } from 'react';
import { 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Shield,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { ShippingAddress, BillingAddress, PaymentMethod } from '../../types';

interface CheckoutFormProps {
  cartTotal: number;
  onSubmitOrder: (orderData: OrderData) => void;
  loading?: boolean;
}

interface OrderData {
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod;
  sameBillingAddress: boolean;
  notes?: string;
}

export default function CheckoutForm({ cartTotal, onSubmitOrder, loading = false }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postal_code: '',
    country: 'France',
    phone: ''
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postal_code: '',
    country: 'France',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'credit_card'
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [notes, setNotes] = useState('');

  const shippingCost = 5.99;
  const totalWithShipping = cartTotal + shippingCost;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Validation adresse de livraison
      if (!shippingAddress.first_name) newErrors.shipping_first_name = 'Prénom requis';
      if (!shippingAddress.last_name) newErrors.shipping_last_name = 'Nom requis';
      if (!shippingAddress.address_line_1) newErrors.shipping_address = 'Adresse requise';
      if (!shippingAddress.city) newErrors.shipping_city = 'Ville requise';
      if (!shippingAddress.postal_code) newErrors.shipping_postal = 'Code postal requis';
      if (shippingAddress.postal_code && !/^\d{5}$/.test(shippingAddress.postal_code)) {
        newErrors.shipping_postal = 'Code postal invalide';
      }
    }

    if (step === 2 && !sameBillingAddress) {
      // Validation adresse de facturation
      if (!billingAddress.first_name) newErrors.billing_first_name = 'Prénom requis';
      if (!billingAddress.last_name) newErrors.billing_last_name = 'Nom requis';
      if (!billingAddress.address_line_1) newErrors.billing_address = 'Adresse requise';
      if (!billingAddress.city) newErrors.billing_city = 'Ville requise';
      if (!billingAddress.postal_code) newErrors.billing_postal = 'Code postal requis';
    }

    if (step === 3 && paymentMethod.type === 'credit_card') {
      // Validation paiement
      if (!paymentDetails.cardNumber) newErrors.card_number = 'Numéro de carte requis';
      if (!paymentDetails.expiryDate) newErrors.expiry_date = 'Date d\'expiration requise';
      if (!paymentDetails.cvv) newErrors.cvv = 'CVV requis';
      if (!paymentDetails.cardName) newErrors.card_name = 'Nom sur la carte requis';
      
      if (paymentDetails.cardNumber && !/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) {
        newErrors.card_number = 'Numéro de carte invalide';
      }
      if (paymentDetails.cvv && !/^\d{3,4}$/.test(paymentDetails.cvv)) {
        newErrors.cvv = 'CVV invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitOrder = () => {
    if (validateStep(3)) {
      const orderData: OrderData = {
        shippingAddress,
        billingAddress: sameBillingAddress ? shippingAddress : billingAddress,
        paymentMethod: {
          ...paymentMethod,
          ...(paymentMethod.type === 'credit_card' && {
            card_last_four: paymentDetails.cardNumber.slice(-4),
            card_brand: getCardBrand(paymentDetails.cardNumber)
          })
        },
        sameBillingAddress,
        notes: notes || undefined
      };
      onSubmitOrder(orderData);
    }
  };

  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Inconnue';
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const steps = [
    { number: 1, title: 'Livraison', icon: MapPin },
    { number: 2, title: 'Facturation', icon: User },
    { number: 3, title: 'Paiement', icon: CreditCard },
    { number: 4, title: 'Confirmation', icon: CheckCircle }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Indicateur d'étapes */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-gray-400 mx-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire principal */}
        <div className="lg:col-span-2">
          {/* Étape 1: Adresse de livraison */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Adresse de livraison</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.first_name}
                    onChange={(e) => setShippingAddress({...shippingAddress, first_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.shipping_first_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Jean"
                  />
                  {errors.shipping_first_name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.shipping_first_name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.last_name}
                    onChange={(e) => setShippingAddress({...shippingAddress, last_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.shipping_last_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Dupont"
                  />
                  {errors.shipping_last_name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.shipping_last_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  value={shippingAddress.address_line_1}
                  onChange={(e) => setShippingAddress({...shippingAddress, address_line_1: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.shipping_address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="123 rue de la Paix"
                />
                {errors.shipping_address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.shipping_address}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complément d'adresse
                </label>
                <input
                  type="text"
                  value={shippingAddress.address_line_2}
                  onChange={(e) => setShippingAddress({...shippingAddress, address_line_2: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Appartement, étage, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.shipping_city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Paris"
                  />
                  {errors.shipping_city && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.shipping_city}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postal_code}
                    onChange={(e) => setShippingAddress({...shippingAddress, postal_code: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.shipping_postal ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="75001"
                  />
                  {errors.shipping_postal && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.shipping_postal}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Continuer
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Étape 2: Adresse de facturation */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Adresse de facturation</h2>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={sameBillingAddress}
                    onChange={(e) => setSameBillingAddress(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Utiliser la même adresse que la livraison</span>
                </label>
              </div>

              {!sameBillingAddress && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.first_name}
                        onChange={(e) => setBillingAddress({...billingAddress, first_name: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.billing_first_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Jean"
                      />
                      {errors.billing_first_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.billing_first_name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.last_name}
                        onChange={(e) => setBillingAddress({...billingAddress, last_name: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.billing_last_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Dupont"
                      />
                      {errors.billing_last_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.billing_last_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Autres champs similaires à l'adresse de livraison */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.address_line_1}
                      onChange={(e) => setBillingAddress({...billingAddress, address_line_1: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.billing_address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123 rue de la Paix"
                    />
                    {errors.billing_address && (
                      <p className="mt-1 text-sm text-red-600">{errors.billing_address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.billing_city ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Paris"
                      />
                      {errors.billing_city && (
                        <p className="mt-1 text-sm text-red-600">{errors.billing_city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.postal_code}
                        onChange={(e) => setBillingAddress({...billingAddress, postal_code: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.billing_postal ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="75001"
                      />
                      {errors.billing_postal && (
                        <p className="mt-1 text-sm text-red-600">{errors.billing_postal}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pays
                      </label>
                      <select
                        value={billingAddress.country}
                        onChange={(e) => setBillingAddress({...billingAddress, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Luxembourg">Luxembourg</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevStep}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Continuer
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Étape 3: Paiement */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Mode de paiement</h2>
              </div>

              {/* Sélection du mode de paiement */}
              <div className="space-y-4 mb-6">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod.type === 'credit_card'}
                    onChange={(e) => setPaymentMethod({ type: e.target.value as any })}
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium">Carte bancaire</span>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    disabled
                    className="mr-3"
                  />
                  <Mail className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium">PayPal (bientôt disponible)</span>
                </label>
              </div>

              {/* Formulaire de paiement par carte */}
              {paymentMethod.type === 'credit_card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de carte *
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({
                        ...paymentDetails, 
                        cardNumber: formatCardNumber(e.target.value)
                      })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.card_number ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.card_number && (
                      <p className="mt-1 text-sm text-red-600">{errors.card_number}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      💳 Utilisez 4242 4242 4242 4242 pour un paiement de test
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'expiration *
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setPaymentDetails({...paymentDetails, expiryDate: value});
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.expiry_date ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.expiry_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.expiry_date}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({
                          ...paymentDetails, 
                          cvv: e.target.value.replace(/\D/g, '')
                        })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cvv ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom sur la carte *
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cardName}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.card_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Jean Dupont"
                    />
                    {errors.card_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.card_name}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes de commande */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes de commande (optionnel)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Instructions spéciales pour la livraison..."
                  rows={3}
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevStep}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Finaliser la commande
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Étape 4: Confirmation */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Commande confirmée !
              </h2>
              <p className="text-gray-600 mb-6">
                Votre commande a été prise en compte. Vous allez recevoir un email de confirmation 
                dans quelques instants avec tous les détails.
              </p>
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  Numéro de commande : <span className="font-mono">ORD-2024-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </p>
              </div>
              <button 
                onClick={() => window.location.href = '/orders'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir mes commandes
              </button>
            </div>
          )}
        </div>

        {/* Résumé de commande */}
        <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">Résumé de la commande</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>€{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span>€{shippingCost.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>€{totalWithShipping.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Paiement sécurisé</span>
            </div>
            <p className="text-sm text-blue-600">
              Vos données sont protégées par le cryptage SSL et ne sont jamais stockées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
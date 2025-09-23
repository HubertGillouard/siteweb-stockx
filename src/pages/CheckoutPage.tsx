import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import { Navigate } from 'react-router-dom';
import { ShippingAddress, BillingAddress, PaymentMethod } from '../types';

interface OrderData {
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod;
  sameBillingAddress: boolean;
  notes?: string;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  // Rediriger si pas connecté ou panier vide
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/shop" replace />;
  }

  const handleSubmitOrder = async (orderData: OrderData) => {
    setLoading(true);
    
    try {
      // Simulation du traitement de commande
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simuler l'envoi de l'email de confirmation
      console.log('Commande créée:', {
        userId: user.id,
        items: items.map(item => ({
          productVariantId: item.product_variant_id,
          quantity: item.quantity,
          unitPrice: item.product_variant?.price || 0,
          totalPrice: (item.product_variant?.price || 0) * item.quantity
        })),
        totalAmount: total,
        ...orderData,
        orderNumber: `ORD-2024-${Date.now()}`,
        status: 'pending',
        paymentStatus: 'paid'
      });

      // Simuler l'email de confirmation
      console.log('Email de confirmation envoyé à:', user.email);
      
      // Vider le panier
      clearCart();
      
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      alert('Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finaliser votre commande</h1>
          <p className="text-gray-600 mt-2">
            Quelques informations pour finaliser votre achat
          </p>
        </div>

        <CheckoutForm 
          cartTotal={total}
          onSubmitOrder={handleSubmitOrder}
          loading={loading}
        />
      </div>
    </div>
  );
}
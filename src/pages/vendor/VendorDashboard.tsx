import React, { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

interface VendorStats {
  todayOrders: number;
  pendingOrders: number;
  lowStockItems: number;
  totalRevenue: number;
}

export default function VendorDashboard() {
  const [stats] = useState<VendorStats>({
    todayOrders: 8,
    pendingOrders: 15,
    lowStockItems: 12,
    totalRevenue: 4567.89
  });

  const [recentOrders] = useState([
    { id: '1', orderNumber: 'ORD-2024-001', customer: 'Jean Dupont', total: 159.99, status: 'pending', date: '2024-01-15', items: 2 },
    { id: '2', orderNumber: 'ORD-2024-002', customer: 'Marie Martin', total: 89.99, status: 'processing', date: '2024-01-15', items: 1 },
    { id: '3', orderNumber: 'ORD-2024-003', customer: 'Pierre Bernard', total: 199.99, status: 'confirmed', date: '2024-01-14', items: 1 },
    { id: '4', orderNumber: 'ORD-2024-004', customer: 'Sophie Dubois', total: 119.99, status: 'pending', date: '2024-01-14', items: 1 },
    { id: '5', orderNumber: 'ORD-2024-005', customer: 'Lucas Moreau', total: 179.99, status: 'shipped', date: '2024-01-13', items: 3 }
  ]);

  const [lowStockProducts] = useState([
    { id: '1', name: 'Nike Air Force 1', variant: 'Blanc - Taille 42', stock: 2, threshold: 10, image: 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: '2', name: 'Adidas Stan Smith', variant: 'Vert - Taille 40', stock: 1, threshold: 10, image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: '3', name: 'Jordan 1 High', variant: 'Rouge - Taille 44', stock: 0, threshold: 5, image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: '4', name: 'New Balance 990v5', variant: 'Gris - Taille 41', stock: 3, threshold: 8, image: 'https://images.pexels.com/photos/1464624/pexels-photo-1464624.jpeg?auto=compress&cs=tinysrgb&w=100' }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmée', icon: CheckCircle },
      processing: { color: 'bg-purple-100 text-purple-800', label: 'En traitement', icon: Package },
      shipped: { color: 'bg-green-100 text-green-800', label: 'Expédiée', icon: TrendingUp },
      delivered: { color: 'bg-emerald-100 text-emerald-800', label: 'Livrée', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Annulée', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const getStockSeverity = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600 bg-red-50', label: 'Rupture' };
    if (stock <= 2) return { color: 'text-red-600 bg-red-50', label: 'Critique' };
    if (stock <= 5) return { color: 'text-orange-600 bg-orange-50', label: 'Faible' };
    return { color: 'text-yellow-600 bg-yellow-50', label: 'Attention' };
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    // Simulation de la mise à jour
    console.log(`Mise à jour de la commande ${orderId} vers le statut ${newStatus}`);
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    // Simulation de la mise à jour du stock
    console.log(`Mise à jour du stock pour le produit ${productId}: ${newStock} unités`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Espace Vendeur</h1>
              <p className="text-gray-600">Gérez vos commandes et votre stock</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Dernière connexion : {new Date().toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Commandes aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
                <p className="text-blue-600 text-sm mt-1">À traiter</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Commandes en attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                <p className="text-yellow-600 text-sm mt-1">Nécessitent une action</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Stock critique</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
                <p className="text-red-600 text-sm mt-1">Produits concernés</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">CA aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}€</p>
                <p className="text-green-600 text-sm mt-1">+15% vs hier</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Commandes récentes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Commandes à traiter</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Voir toutes les commandes
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">
                      Commande
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">
                      Client
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">
                      Montant
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">
                      Statut
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{order.date} • {order.items} article(s)</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{order.customer}</td>
                      <td className="py-4 px-6 font-medium text-gray-900">{order.total}€</td>
                      <td className="py-4 px-6">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                              className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs hover:bg-green-200"
                            >
                              Confirmer
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200"
                            >
                              Expédier
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alertes stock */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Stock critique
              </h2>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {lowStockProducts.map((product) => {
                const severity = getStockSeverity(product.stock);
                return (
                  <div key={product.id} className={`p-3 rounded-lg border ${severity.color.includes('red') ? 'border-red-200' : severity.color.includes('orange') ? 'border-orange-200' : 'border-yellow-200'}`}>
                    <div className="flex items-start gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${severity.color}`}>
                            {severity.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.variant}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : 'text-gray-700'}`}>
                            Stock: {product.stock} / Seuil: {product.threshold}
                          </span>
                          <button 
                            onClick={() => {
                              const newStock = prompt(`Nouveau stock pour ${product.name}:`, product.stock.toString());
                              if (newStock && !isNaN(parseInt(newStock))) {
                                handleStockUpdate(product.id, parseInt(newStock));
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Mettre à jour
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2 border-t">
                Gérer tout le stock
              </button>
            </div>
          </div>
        </div>

        {/* Actions rapides pour vendeurs */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <Package className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Gérer le stock</h3>
              <p className="text-sm text-gray-600">Mettre à jour les quantités disponibles</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
              <ShoppingCart className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Traiter les commandes</h3>
              <p className="text-sm text-gray-600">Confirmer et expédier les commandes</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
              <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Voir les rapports</h3>
              <p className="text-sm text-gray-600">Analyser les ventes et performances</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  lowStockCount: number;
  todayOrders: number;
  weekRevenue: number;
  monthRevenue: number;
}

export default function AdminDashboard() {
  const [stats] = useState<DashboardStats>({
    totalOrders: 1284,
    totalRevenue: 89456.78,
    totalProducts: 156,
    totalUsers: 2341,
    lowStockCount: 23,
    todayOrders: 12,
    weekRevenue: 15678.90,
    monthRevenue: 45234.56
  });

  const [recentOrders] = useState([
    { id: '1', orderNumber: 'ORD-2024-001', customer: 'Jean Dupont', total: 159.99, status: 'processing', date: '2024-01-15' },
    { id: '2', orderNumber: 'ORD-2024-002', customer: 'Marie Martin', total: 89.99, status: 'shipped', date: '2024-01-15' },
    { id: '3', orderNumber: 'ORD-2024-003', customer: 'Pierre Bernard', total: 199.99, status: 'delivered', date: '2024-01-14' },
    { id: '4', orderNumber: 'ORD-2024-004', customer: 'Sophie Dubois', total: 119.99, status: 'pending', date: '2024-01-14' },
    { id: '5', orderNumber: 'ORD-2024-005', customer: 'Lucas Moreau', total: 179.99, status: 'confirmed', date: '2024-01-13' }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmée' },
      processing: { color: 'bg-purple-100 text-purple-800', label: 'En traitement' },
      shipped: { color: 'bg-green-100 text-green-800', label: 'Expédiée' },
      delivered: { color: 'bg-emerald-100 text-emerald-800', label: 'Livrée' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Annulée' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
              <p className="text-gray-600">Gérez votre boutique et suivez les performances</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
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
                <p className="text-gray-600 text-sm">Commandes totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                <p className="text-green-600 text-sm mt-1">+{stats.todayOrders} aujourd'hui</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}€</p>
                <p className="text-green-600 text-sm mt-1">+{stats.monthRevenue.toLocaleString()}€ ce mois</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Produits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-orange-600 text-sm mt-1">{stats.lowStockCount} stock faible</p>
              </div>
              <Package className="h-10 w-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-green-600 text-sm mt-1">+12% ce mois</p>
              </div>
              <Users className="h-10 w-10 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Commandes récentes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Commandes récentes</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Voir tout
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
                          <div className="text-sm text-gray-500">{order.date}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{order.customer}</td>
                      <td className="py-4 px-6 font-medium text-gray-900">{order.total}€</td>
                      <td className="py-4 px-6">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 px-6">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alertes et actions rapides */}
          <div className="space-y-6">
            {/* Alertes stock */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Alertes stock
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">Nike Air Force 1</p>
                    <p className="text-sm text-red-600">Stock critique : 2 unités</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-900">Adidas Stan Smith</p>
                    <p className="text-sm text-orange-600">Stock faible : 5 unités</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-900">Jordan 1 High</p>
                    <p className="text-sm text-yellow-600">Stock faible : 8 unités</p>
                  </div>
                </div>
                <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2">
                  Voir tous les alertes
                </button>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Actions rapides</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Ajouter un produit</p>
                      <p className="text-sm text-blue-600">Créer un nouveau produit</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Voir les rapports</p>
                      <p className="text-sm text-green-600">Analyser les performances</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-900">Gérer les utilisateurs</p>
                      <p className="text-sm text-purple-600">Permissions et rôles</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques de performance */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Évolution du chiffre d'affaires
            </h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Graphique des ventes (à intégrer)</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Top produits
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Nike Air Force 1</span>
                <span className="font-medium">156 ventes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Adidas Stan Smith</span>
                <span className="font-medium">134 ventes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Jordan 1 High</span>
                <span className="font-medium">112 ventes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Nike Air Max 90</span>
                <span className="font-medium">98 ventes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Converse Chuck Taylor</span>
                <span className="font-medium">87 ventes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
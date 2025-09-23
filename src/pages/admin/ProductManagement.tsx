import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Filter, 
  Search,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  totalStock: number;
  variants: number;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  createdAt: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Nike Air Force 1',
      brand: 'Nike',
      category: 'Lifestyle',
      basePrice: 119.99,
      totalStock: 156,
      variants: 8,
      status: 'active',
      image: 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=100',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      name: 'Adidas Stan Smith',
      brand: 'Adidas',
      category: 'Lifestyle',
      basePrice: 89.99,
      totalStock: 89,
      variants: 6,
      status: 'active',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=100',
      createdAt: '2024-01-08'
    },
    {
      id: '3',
      name: 'Jordan 1 High OG',
      brand: 'Jordan',
      category: 'Basketball',
      basePrice: 169.99,
      totalStock: 23,
      variants: 4,
      status: 'active',
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=100',
      createdAt: '2024-01-05'
    },
    {
      id: '4',
      name: 'New Balance 990v5',
      brand: 'New Balance',
      category: 'Running',
      basePrice: 184.99,
      totalStock: 67,
      variants: 5,
      status: 'active',
      image: 'https://images.pexels.com/photos/1464624/pexels-photo-1464624.jpeg?auto=compress&cs=tinysrgb&w=100',
      createdAt: '2024-01-03'
    },
    {
      id: '5',
      name: 'Vans Old Skool',
      brand: 'Vans',
      category: 'Skateboarding',
      basePrice: 64.99,
      totalStock: 0,
      variants: 7,
      status: 'inactive',
      image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=100',
      createdAt: '2024-01-01'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
      inactive: { color: 'bg-red-100 text-red-800', label: 'Inactif' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Brouillon' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', icon: <AlertTriangle className="h-4 w-4" /> };
    if (stock < 20) return { color: 'text-orange-600', icon: <AlertTriangle className="h-4 w-4" /> };
    return { color: 'text-green-600', icon: null };
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const toggleProductStatus = (id: string) => {
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' as any }
        : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
                <p className="text-gray-600">{products.length} produits au total</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="draft">Brouillon</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{filteredProducts.length} produit(s) affiché(s)</span>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">
                    Produit
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">
                    Marque
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">
                    Catégorie
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">
                    Prix de base
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">
                    Stock total
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">
                    Variantes
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.totalStock);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{product.brand}</td>
                      <td className="py-4 px-6 text-gray-900">{product.category}</td>
                      <td className="py-4 px-6 font-medium text-gray-900">€{product.basePrice}</td>
                      <td className="py-4 px-6">
                        <div className={`flex items-center gap-1 ${stockStatus.color}`}>
                          {stockStatus.icon}
                          <span className="font-medium">{product.totalStock}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{product.variants}</td>
                      <td className="py-4 px-6">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Modifier"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => toggleProductStatus(product.id)}
                            className="text-orange-600 hover:text-orange-800 p-1"
                            title={product.status === 'active' ? 'Désactiver' : 'Activer'}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Commencez par ajouter votre premier produit.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un produit
                </button>
              )}
            </div>
          )}
        </div>

        {/* Statistiques rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Produits actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Stock total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {products.reduce((sum, p) => sum + p.totalStock, 0)}
                </p>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Stock critique</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.totalStock < 20).length}
                </p>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Valeur du stock</p>
                <p className="text-2xl font-bold text-purple-600">
                  €{products.reduce((sum, p) => sum + (p.basePrice * p.totalStock), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import apiClient from '@/lib/api';
import { formatPrice } from '@/utils/helpers';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    cuisineType: '',
    deliveryFee: '',
    minOrder: '',
    deliveryTime: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    featured: false,
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await apiClient.get('/restaurants');
      setRestaurants(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        cuisineType: formData.cuisineType.split(',').map(c => c.trim()),
        deliveryFee: parseFloat(formData.deliveryFee),
        minOrder: parseFloat(formData.minOrder),
      };

      if (editingRestaurant) {
        await apiClient.put(`/restaurants/${editingRestaurant._id}`, dataToSend);
        toast.success('Restaurant updated successfully!');
      } else {
        await apiClient.post('/restaurants', dataToSend);
        toast.success('Restaurant created successfully!');
      }

      setShowModal(false);
      resetForm();
      fetchRestaurants();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await apiClient.delete(`/restaurants/${id}`);
      toast.success('Restaurant deleted successfully!');
      fetchRestaurants();
    } catch (error) {
      toast.error('Failed to delete restaurant');
    }
  };

  const handleEdit = (restaurant: any) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      image: restaurant.image,
      cuisineType: restaurant.cuisineType.join(', '),
      deliveryFee: restaurant.deliveryFee.toString(),
      minOrder: restaurant.minOrder.toString(),
      deliveryTime: restaurant.deliveryTime,
      address: restaurant.address,
      featured: restaurant.featured,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingRestaurant(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      cuisineType: '',
      deliveryFee: '',
      minOrder: '',
      deliveryTime: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      featured: false,
    });
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
            <p className="text-gray-600 mt-1">Manage all restaurants</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Restaurant</span>
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Restaurants Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                  {restaurant.featured && (
                    <div className="absolute top-2 right-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{restaurant.cuisineType.join(', ')}</span>
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-600">
                        Min: {formatPrice(restaurant.minOrder)}
                      </p>
                      <p className="text-gray-600">
                        Delivery: {formatPrice(restaurant.deliveryFee)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/foods?restaurantId=${restaurant._id}`}>
                        <button
                          className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                          title="Manage Menu"
                        >
                          <UtensilsCrossed className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleEdit(restaurant)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit Restaurant"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant._id, restaurant.name)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Restaurant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL (Right click image &rarr; Copy Image Address)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuisine Type (comma separated)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cuisineType}
                        onChange={(e) =>
                          setFormData({ ...formData, cuisineType: e.target.value })
                        }
                        placeholder="Italian, Pizza"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Fee
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.deliveryFee}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryFee: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Order
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.minOrder}
                        onChange={(e) =>
                          setFormData({ ...formData, minOrder: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Time
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.deliveryTime}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryTime: e.target.value })
                        }
                        placeholder="25-35 mins"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData({ ...formData, featured: e.target.checked })
                          }
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Featured Restaurant
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {editingRestaurant ? 'Update Restaurant' : 'Create Restaurant'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

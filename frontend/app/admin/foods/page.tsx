'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/api';
import { formatPrice } from '@/utils/helpers';
import { Plus, Edit, Trash2, Search, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';

import { Suspense } from 'react';

function AdminFoodsContent() {
  // Query param for restaurant filtering
  const searchParams = useSearchParams();
  const restaurantIdParam = searchParams.get('restaurantId');

  const [foods, setFoods] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRestaurant, setFilterRestaurant] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    restaurant: '',
    isVegetarian: false,
    isAvailable: true,
  });

  // Apply restaurantId from URL if present
  useEffect(() => {
    if (restaurantIdParam) {
      setFilterRestaurant(restaurantIdParam);
    }
  }, [restaurantIdParam]);

  // Initial data fetch
  useEffect(() => {
    fetchFoods();
    fetchRestaurants();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await apiClient.get('/foods');
      setFoods(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await apiClient.get('/restaurants');
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Failed to fetch restaurants');
    }
  };

  const resetForm = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      restaurant: filterRestaurant || '',
      isVegetarian: false,
      isAvailable: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        available: formData.isAvailable,
      };

      if (editingFood) {
        await apiClient.put(`/foods/${editingFood._id}`, dataToSend);
        toast.success('Food item updated successfully!');
      } else {
        await apiClient.post('/foods', dataToSend);
        toast.success('Food item created successfully!');
      }

      setShowModal(false);
      resetForm();
      fetchFoods();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await apiClient.delete(`/foods/${id}`);
      toast.success('Food item deleted successfully!');
      fetchFoods();
    } catch (error) {
      toast.error('Failed to delete food item');
    }
  };

  const handleEdit = (food: any) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price.toString(),
      image: food.image,
      category: food.category,
      restaurant: (food.restaurant && typeof food.restaurant === 'object') ? food.restaurant._id : (food.restaurant || ''),
      isVegetarian: !!food.isVegetarian,
      isAvailable: food.available !== undefined ? food.available : true,
    });
    setShowModal(true);
  };

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRestaurant = !filterRestaurant ||
      (food.restaurant && typeof food.restaurant === 'object' && food.restaurant._id === filterRestaurant);
    return matchesSearch && matchesRestaurant;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600 mt-1">Manage your restaurant menus</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Menu Item</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterRestaurant}
            onChange={(e) => setFilterRestaurant(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="">All Restaurants</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Foods Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <div key={food._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <Image src={food.image} alt={food.name} fill className="object-cover" />
                  {!food.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold">Unavailable</span>
                    </div>
                  )}
                  {food.isVegetarian && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                      VEG
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{food.name}</h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {food.restaurant && typeof food.restaurant === 'object' ? food.restaurant.name : 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{food.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 capitalize">{food.category}</span>
                    <span className="text-lg font-bold text-orange-600">{formatPrice(food.price)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(food)}
                      className="flex-1 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleDelete(food._id, food.name)}
                      className="flex-1 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
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
                  {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Right click image → Copy Image Address)</label>
                      <input
                        type="text"
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
  <select
    required
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
  >
    <option value="">Select Category</option>
    <option value="Pizza">Pizza</option>
    <option value="Burger">Burger</option>
    <option value="Sushi">Sushi</option>
    <option value="Pasta">Pasta</option>
    <option value="Salad">Salad</option>
    <option value="Dessert">Dessert</option>
    <option value="Drinks">Drinks</option>
    <option value="Appetizers">Appetizers</option>
    <option value="Main Course">Main Course</option>
    <option value="Asian">Asian</option>
    <option value="Mexican">Mexican</option>
    <option value="Indian">Indian</option>
    <option value="Italian">Italian</option>
    <option value="American">American</option>
    <option value="Vegetarian">Vegetarian</option>
    <option value="Vegan">Vegan</option>
    <option value="Other">Other</option>
  </select>
</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant</label>
                    <select
                      required
                      value={formData.restaurant}
                      onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Restaurant</option>
                      {restaurants.map((restaurant) => (
                        <option key={restaurant._id} value={restaurant._id}>
                          {restaurant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-6 pt-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isVegetarian}
                        onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Vegetarian</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isAvailable}
                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Available</span>
                    </label>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {editingFood ? 'Update Food Item' : 'Create Food Item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowModal(false); resetForm(); }}
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

export default function AdminFoods() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    }>
      <AdminFoodsContent />
    </Suspense>
  );
}

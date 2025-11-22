'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

import RestaurantCard from '@/components/features/RestaurantCard';
import { Restaurant } from '@/types';
import apiClient from '@/lib/api';
import { Loader2, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

function RestaurantsPageContent() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        
        let url = '/restaurants?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `cuisine=${encodeURIComponent(category)}&`;
        
        const response = await apiClient.get(url);
        setRestaurants(response.data.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/restaurants?search=${encodeURIComponent(searchQuery)}`
      );
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Error searching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Restaurants</span>
            </h1>
            
            {/* Search Bar */}
            <div className="flex items-center bg-white rounded-full shadow-lg p-2 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search restaurants or cuisine..."
                className="flex-1 px-4 py-2 outline-none"
              />
              <button
                onClick={handleSearch}
                className="p-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full hover:shadow-lg transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
            </div>
          ) : restaurants.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No restaurants found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </main>
    }>
      <RestaurantsPageContent />
    </Suspense>
  );
}

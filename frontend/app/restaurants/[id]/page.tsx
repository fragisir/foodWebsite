'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

import FoodCard from '@/components/features/FoodCard';
import ReviewSection from '@/components/features/ReviewSection';
import { Restaurant, FoodItem } from '@/types';
import apiClient from '@/lib/api';
import { Loader2, Star, Clock, DollarSign, MapPin } from 'lucide-react';
import { formatPrice } from '@/utils/helpers';

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, foodsRes] = await Promise.all([
          apiClient.get(`/restaurants/${resolvedParams.id}`),
          apiClient.get(`/foods?restaurant=${resolvedParams.id}`),
        ]);
        setRestaurant(restaurantRes.data.data);
        setFoodItems(foodsRes.data.data);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Restaurant not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <Navbar />

      <div className="pt-20">
        {/* Restaurant Header */}
        <div className="relative h-96 overflow-hidden">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white"
              >
                {restaurant.featured && (
                  <span className="inline-block px-3 py-1 bg-orange-500 rounded-full text-sm font-semibold mb-3">
                    Featured
                  </span>
                )}
                <h1 className="text-5xl font-bold mb-4">{restaurant.name}</h1>
                <p className="text-xl text-gray-200 mb-4 max-w-3xl">
                  {restaurant.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{restaurant.rating}</span>
                    <span className="text-gray-300">({restaurant.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>{formatPrice(restaurant.deliveryFee)} delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{restaurant.address.city}, {restaurant.address.state}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {restaurant.cuisineType.map((cuisine) => (
                    <span
                      key={cuisine}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Menu
          </h2>
          
          {foodItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {foodItems.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-12">
              No menu items available yet
            </p>
          )}
        </div>

        <ReviewSection restaurantId={restaurant._id} />
      </div>

      <Footer />
    </main>
  );
}

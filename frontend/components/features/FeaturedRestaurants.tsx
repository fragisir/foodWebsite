'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '@/types';
import apiClient from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        const response = await apiClient.get('/restaurants?featured=true');
        setRestaurants(response.data.data);
      } catch (error) {
        console.error('Error fetching featured restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Restaurants</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Top-rated restaurants loved by our customers
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {restaurants.map((restaurant) => (
              <motion.div key={restaurant._id} variants={itemVariants}>
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, DollarSign } from 'lucide-react';
import { Restaurant } from '@/types';
import { formatPrice } from '@/utils/helpers';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant._id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden cursor-pointer group"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {restaurant.featured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Closed</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {restaurant.description}
          </p>

          {/* Cuisine Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {restaurant.cuisineType.slice(0, 3).map((cuisine) => (
              <span
                key={cuisine}
                className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full font-medium"
              >
                {cuisine}
              </span>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">
                {restaurant.rating}
              </span>
              <span>({restaurant.reviewCount})</span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>

            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatPrice(restaurant.deliveryFee)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

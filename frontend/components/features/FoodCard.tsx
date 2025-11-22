'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Plus, Leaf, Flame } from 'lucide-react';
import { FoodItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface FoodCardProps {
  food: FoodItem;
}

export default function FoodCard({ food }: FoodCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(food, 1);
    toast.success(`${food.name} added to cart!`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-shadow"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={food.image}
          alt={food.name}
          fill
          className="object-cover"
        />
        {food.popular && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Popular
          </div>
        )}
        {!food.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{food.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {food.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-3">
          {food.isVegetarian && (
            <span className="flex items-center text-green-600 text-xs">
              <Leaf className="w-3 h-3 mr-1" />
              Veg
            </span>
          )}
          {food.spicyLevel > 0 && (
            <span className="flex items-center text-red-500 text-xs">
              <Flame className="w-3 h-3 mr-1" />
              {Array(food.spicyLevel).fill('🌶️').join('')}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{food.rating}</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(food.price)}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={!food.available}
            className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

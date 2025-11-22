'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  image: string;
  count?: number;
  onClick?: () => void;
}

export default function CategoryCard({
  name,
  image,
  count,
  onClick,
}: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 cursor-pointer shadow-md hover:shadow-xl transition-shadow"
    >
      <div className="relative w-20 h-20 mx-auto mb-4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-center font-semibold text-gray-900 mb-1">{name}</h3>
      {count !== undefined && (
        <p className="text-center text-sm text-gray-600">{count} items</p>
      )}
    </motion.div>
  );
}

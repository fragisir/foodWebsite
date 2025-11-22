'use client';

import { motion } from 'framer-motion';
import CategoryCard from './CategoryCard';
import { useRouter } from 'next/navigation';

const categories = [
  {
    name: 'Pizza',
    image: 'https://cdn-icons-png.flaticon.com/512/3132/3132529.png',
    count: 45,
  },
  {
    name: 'Burger',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
    count: 38,
  },
  {
    name: 'Sushi',
    image: 'https://cdn-icons-png.flaticon.com/512/2252/2252065.png',
    count: 28,
  },
  {
    name: 'Pasta',
    image: 'https://cdn-icons-png.flaticon.com/512/3480/3480618.png',
    count: 32,
  },
  {
    name: 'Dessert',
    image: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
    count: 56,
  },
  {
    name: 'Indian',
    image: 'https://cdn-icons-png.flaticon.com/512/1728/1728398.png',
    count: 24,
  },
];

export default function PopularCategories() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Popular <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Categories</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Explore our wide variety of cuisines
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <CategoryCard
                {...category}
                onClick={() => {
                  router.push(
                    `/restaurants?category=${encodeURIComponent(category.name)}`
                  );
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

import Hero from '@/components/features/Hero';
import PopularCategories from '@/components/features/PopularCategories';
import FeaturedRestaurants from '@/components/features/FeaturedRestaurants';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <Navbar />
      
      <Hero />
      <PopularCategories />
      <FeaturedRestaurants />
      
      <Footer />
    </main>
  );
}

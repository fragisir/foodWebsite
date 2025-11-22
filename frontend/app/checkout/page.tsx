'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

import ProtectedRoute from '@/components/features/ProtectedRoute';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/helpers';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { CreditCard, Wallet } from 'lucide-react';

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getSubtotal, restaurant, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const deliveryFee = restaurant?.deliveryFee || 2.99;
  const subtotal = getSubtotal();
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!restaurant) {
      toast.error('No restaurant selected');
      setIsProcessing(false);
      return;
    }

    try {
      const orderData = {
        restaurant: restaurant._id,
        items: items.map((item) => ({
          foodItem: item.foodItem._id,
          name: item.foodItem.name,
          price: item.foodItem.price,
          quantity: item.quantity,
        })),
        deliveryAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        total,
        specialInstructions,
      };

      const response = await apiClient.post('/orders', orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      router.push(`/orders`);
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <Navbar />

        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Checkout</span>
            </h1>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress.street}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress.state}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, state: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress.zipCode}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-semibold">Card</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Wallet className="w-6 h-6" />
                    <span className="font-semibold">Cash</span>
                  </motion.button>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Special Instructions
                </h2>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={3}
                  placeholder="Add any special requests or delivery instructions..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.foodItem._id}
                      className="flex justify-between text-gray-600"
                    >
                      <span>
                        {item.quantity}x {item.foodItem.name}
                      </span>
                      <span>{formatPrice(item.foodItem.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
              </motion.button>
            </form>
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}

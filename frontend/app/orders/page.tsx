'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

import ProtectedRoute from '@/components/features/ProtectedRoute';
import { Order } from '@/types';
import apiClient from '@/lib/api';
import { formatPrice, formatDate, getOrderStatusColor } from '@/utils/helpers';
import { Loader2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const prevOrdersRef = useRef<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/orders/myorders');
        const newOrders = response.data.data;

        // Check for status updates
        if (prevOrdersRef.current.length > 0) {
          newOrders.forEach((newOrder: Order) => {
            const oldOrder = prevOrdersRef.current.find((o) => o._id === newOrder._id);
            if (oldOrder && oldOrder.status !== newOrder.status) {
              toast.success(`Order #${newOrder._id.substring(0, 8)} is now ${newOrder.status}!`, {
                icon: '🚀',
                duration: 5000,
              });
            }
          });
        }
        prevOrdersRef.current = newOrders;
        setOrders(newOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <Navbar />

        <div className="pt-24 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              My <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Orders</span>
            </h1>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No orders yet
                </h2>
                <p className="text-gray-600">
                  Start ordering delicious food!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => {
                  const statusColors = getOrderStatusColor(order.status);
                  const restaurant =
                    typeof order.restaurant === 'object'
                      ? order.restaurant
                      : null;

                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-md p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {restaurant?.name || 'Restaurant'}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Ordered on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${statusColors.bg} ${statusColors.text}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-gray-600"
                            >
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Delivery Address:</span>{' '}
                            {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                            {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                          </p>
                          {order.specialInstructions && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-semibold">Special Instructions:</span>{' '}
                              {order.specialInstructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}

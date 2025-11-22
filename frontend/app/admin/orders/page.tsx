'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import apiClient from '@/lib/api';
import { formatPrice } from '@/utils/helpers';
import { Search, Eye, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const prevOrdersRef = useRef<any[]>([]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/admin/orders');
      const newOrders = response.data.data;

      if (prevOrdersRef.current.length > 0 && newOrders.length > prevOrdersRef.current.length) {
        toast.success('New order received!', { icon: '🔔' });
      }
      prevOrdersRef.current = newOrders;
      setOrders(newOrders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated!');
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((order.user?.name ?? 'N/A').toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-600';
      case 'preparing':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-yellow-100 text-yellow-600';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage all orders</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-black font-bold">Order ID</th>
                    <th className="text-left p-4 text-black font-bold">Customer</th>
                    <th className="text-left p-4 text-black font-bold">Restaurant</th>
                    <th className="text-left p-4 text-black font-bold">Items</th>
                    <th className="text-left p-4 text-black font-bold">Total</th>
                    <th className="text-left p-4 text-black font-bold">Status</th>
                    <th className="text-left p-4 text-black font-bold">Date</th>
                    <th className="text-center p-4 text-black font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-mono text-sm text-black">
                        #{order._id.substring(0, 8)}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-black">
                            {order.user?.name ?? 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.user?.email ?? ''}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-black">
                        {order.restaurant?.name ?? 'N/A'}
                      </td>
                      <td className="p-4 text-black">{order.items.length} items</td>
                      <td className="p-4 font-semibold text-black">
                        {formatPrice(order.total)}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold outline-none cursor-pointer ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-black">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(
            (status) => (
              <div key={status} className="bg-white rounded-xl shadow-md p-4">
                <p className="text-gray-600 text-xs font-medium capitalize">
                  {status.replace('_', ' ')}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {orders.filter((o) => o.status === status).length}
                </p>
              </div>
            )
          )}
        </div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {showModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Details #{selectedOrder._id.substring(0, 8)}
                </h2>

                {/* Customer Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Name:</span>{' '}
                      {selectedOrder.user?.name ?? 'N/A'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Email:</span>{' '}
                      {selectedOrder.user?.email ?? 'N/A'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Phone:</span>{' '}
                      {selectedOrder.user?.phone ?? 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Delivery Address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      {selectedOrder.deliveryAddress.street},{' '}
                      {selectedOrder.deliveryAddress.city},{' '}
                      {selectedOrder.deliveryAddress.state}{' '}
                      {selectedOrder.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Order Summary
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Fee:</span>
                      <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax:</span>
                      <span>{formatPrice(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment & Status */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.specialInstructions && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Special Instructions
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">
                        {selectedOrder.specialInstructions}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

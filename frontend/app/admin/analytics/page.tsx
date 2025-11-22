'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import apiClient from '@/lib/api';
import { formatPrice } from '@/utils/helpers';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.get('/admin/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed business insights and metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
              <DollarSign className="w-8 h-8 opacity-75" />
            </div>
            <p className="text-3xl font-bold mb-2">
              {formatPrice(analytics?.stats?.totalRevenue || 0)}
            </p>
            <div className="flex items-center text-sm opacity-90">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12.5% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Total Orders</h3>
              <Package className="w-8 h-8 opacity-75" />
            </div>
            <p className="text-3xl font-bold mb-2">
              {analytics?.stats?.totalOrders || 0}
            </p>
            <div className="flex items-center text-sm opacity-90">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8.3% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Avg Order Value</h3>
              <DollarSign className="w-8 h-8 opacity-75" />
            </div>
            <p className="text-3xl font-bold mb-2">
              {formatPrice(
                (analytics?.stats?.totalRevenue || 0) / (analytics?.stats?.totalOrders || 1)
              )}
            </p>
            <div className="flex items-center text-sm opacity-90">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span>-2.1% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Active Users</h3>
              <TrendingUp className="w-8 h-8 opacity-75" />
            </div>
            <p className="text-3xl font-bold mb-2">
              {analytics?.stats?.totalUsers || 0}
            </p>
            <div className="flex items-center text-sm opacity-90">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+15.7% from last month</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Revenue & Orders Trend (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.ordersPerDay || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F97316"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue ($)"
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Food Items */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Top Selling Items
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.topFoodItems || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSold" fill="#F97316" name="Sold" />
                <Bar dataKey="revenue" fill="#EC4899" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Restaurants Performance */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Restaurant Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(analytics?.topRestaurants || []).map((restaurant: any, index: number) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white flex items-center justify-center font-bold text-lg">
                    #{index + 1}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {restaurant.name}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Orders:</span>
                    <span className="font-semibold text-gray-900">
                      {restaurant.orderCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-semibold text-green-600">
                      {formatPrice(restaurant.revenue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Order:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(restaurant.revenue / restaurant.orderCount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Status Distribution
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(analytics?.ordersByStatus || []).map((item: any, index: number) => {
              const colors = [
                'from-yellow-400 to-amber-500',
                'from-purple-400 to-purple-600',
                'from-blue-400 to-blue-600',
                'from-green-400 to-green-600',
                'from-red-400 to-red-600',
              ];
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${
                    colors[index % colors.length]
                  } rounded-lg p-6 text-white`}
                >
                  <p className="text-sm opacity-90 mb-2 capitalize">
                    {item._id.replace('_', ' ')}
                  </p>
                  <p className="text-4xl font-bold">{item.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

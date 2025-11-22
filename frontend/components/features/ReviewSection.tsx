'use client';

import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { Review } from '@/types';
import { motion } from 'framer-motion';

interface ReviewSectionProps {
  restaurantId: string;
}

export default function ReviewSection({ restaurantId }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  useEffect(() => {
    if (user && reviews.length > 0) {
      const userReview = reviews.find((r) => r.user._id === user._id);
      if (userReview) {
        setHasReviewed(true);
      }
    }
  }, [user, reviews]);

  const fetchReviews = async () => {
    try {
      const res = await apiClient.get(`/reviews/${restaurantId}`);
      setReviews(res.data.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/reviews', {
        restaurant: restaurantId,
        rating,
        comment,
      });

      setReviews([res.data.data, ...reviews]);
      setHasReviewed(true);
      setComment('');
      setRating(5);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Reviews</h2>

      {/* Review Form or Status Message */}
      {isAuthenticated ? (
        <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {hasReviewed ? (
            <div className="text-center py-8 bg-green-50 rounded-lg border border-green-100">
              <p className="text-green-800 font-medium text-lg">
                You have already reviewed this restaurant.
              </p>
              <p className="text-green-600 mt-1">
                Thank you for your feedback!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 rounded-full transition-colors ${
                        rating >= star ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  placeholder="Share your experience..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="mb-12 p-8 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600">
            Please login to write a review.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={review._id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">
                    {review.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                  <span className="font-bold text-yellow-700">{review.rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

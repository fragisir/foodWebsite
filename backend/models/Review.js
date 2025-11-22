import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent user from submitting more than one review per restaurant
reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function (restaurantId) {
  const obj = await this.aggregate([
    {
      $match: { restaurant: restaurantId },
    },
    {
      $group: {
        _id: '$restaurant',
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model('Restaurant').findByIdAndUpdate(restaurantId, {
      rating: obj[0]?.averageRating || 0,
      reviewCount: obj[0]?.numOfReviews || 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.restaurant);
});

// Call getAverageRating before remove
reviewSchema.post('remove', function () {
  this.constructor.getAverageRating(this.restaurant);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;

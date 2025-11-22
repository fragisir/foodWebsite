import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/:restaurantId
// @access  Public
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate({
        path: 'user',
        select: 'name avatar',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const restaurantId = req.body.restaurant;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      restaurant: restaurantId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this restaurant',
      });
    }

    const review = await Review.create(req.body);
    
    await review.populate({
      path: 'user',
      select: 'name avatar',
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    // Handle duplicate key error if race condition occurs
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this restaurant',
      });
    }
    next(error);
  }
};

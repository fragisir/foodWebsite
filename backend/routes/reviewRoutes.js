import express from 'express';
import { getReviews, createReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createReview);
router.route('/:restaurantId').get(getReviews);

export default router;

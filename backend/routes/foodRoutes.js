import express from 'express';
import {
  getFoodItems,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from '../controllers/foodController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getFoodItems).post(protect, admin, createFoodItem);

router
  .route('/:id')
  .get(getFoodItem)
  .put(protect, admin, updateFoodItem)
  .delete(protect, admin, deleteFoodItem);

export default router;

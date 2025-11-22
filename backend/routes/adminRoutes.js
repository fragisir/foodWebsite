import express from 'express';
import {
  getDashboardAnalytics,
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(admin);

// Analytics
router.get('/analytics', getDashboardAnalytics);

// Users
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle', toggleUserStatus);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;

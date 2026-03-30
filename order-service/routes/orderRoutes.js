const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderDetails,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

/**
 * ORDER SERVICE — Route Map
 *
 * GET    /api/orders             → Get all orders
 * POST   /api/orders             → Create a new order
 *
 * GET    /api/orders/:id         → Get one order by ID
 * PUT    /api/orders/:id         → Update order details (items/totalAmount)
 *                                  ⚠ Only allowed when status = 'Pending'
 * DELETE /api/orders/:id         → Delete order
 *                                  ⚠ Only allowed when status = 'Pending'
 *
 * PUT    /api/orders/:id/status  → Update order status (kitchen workflow)
 *                                  Pending → Preparing → Ready → Delivered | Cancelled
 */

// Collection routes
router.route('/')
  .get(getAllOrders)
  .post(createOrder);

// IMPORTANT: /status route must be defined BEFORE /:id
// Otherwise Express will treat "status" as an :id value
router.route('/:id/status')
  .put(updateOrderStatus);

// Single order routes
router.route('/:id')
  .get(getOrderById)
  .put(updateOrderDetails)   // Edit items — Pending only
  .delete(deleteOrder);      // Delete order — Pending only

module.exports = router;
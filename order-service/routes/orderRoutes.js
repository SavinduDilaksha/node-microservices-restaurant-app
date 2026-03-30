const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getOrderById,
} = require('../controllers/orderController');

// GET    /api/orders           → Fetch all orders
// POST   /api/orders           → Create a new order
router.route('/').get(getAllOrders).post(createOrder);

// GET    /api/orders/:id       → Get one order by ID
router.route('/:id').get(getOrderById);

// PUT    /api/orders/:id/status → Update order status (Pending → Preparing → Ready → Delivered)
router.route('/:id/status').put(updateOrderStatus);

module.exports = router;

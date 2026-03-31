const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  createPayment,
  getPaymentById,
  updatePaymentStatus,
} = require('../controllers/paymentController');

// GET    /api/payments       → Fetch all payments
// POST   /api/payments       → Create a new payment record
router.route('/').get(getAllPayments).post(createPayment);

// GET    /api/payments/:id          → Get one payment
// PUT    /api/payments/:id/status   → Update payment status
router.route('/:id').get(getPaymentById);
router.route('/:id/status').put(updatePaymentStatus);

module.exports = router;

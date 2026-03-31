const Payment = require('../models/Payment');

/**
 * @desc    Get all payments
 * @route   GET /api/payments
 * @access  Public
 */
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Create a new payment record
 * @route   POST /api/payments
 * @access  Public
 */
const createPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    if (!orderId || amount === undefined || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: 'orderId, amount, and paymentMethod are required.',
      });
    }

    const payment = await Payment.create({ orderId, amount, paymentMethod });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: 'Validation Error', details: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Get a payment by ID
 * @route   GET /api/payments/:id
 * @access  Public
 */
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid payment ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Update payment status by ID
 * @route   PUT /api/payments/:id/status
 * @access  Public
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Completed', 'Failed', 'Refunded'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: `status must be one of: ${allowed.join(', ')}`,
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid payment ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

module.exports = {
  getAllPayments,
  createPayment,
  getPaymentById,
  updatePaymentStatus,
};

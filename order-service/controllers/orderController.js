const Order = require('../models/Order');

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Public
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res) => {
  try {
    const { customerId, items, totalAmount } = req.body;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0 || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: 'customerId, items (array), and totalAmount are required.',
      });
    }

    const order = await Order.create({ customerId, items, totalAmount });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: 'Validation Error', details: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Update order status by ID
 * @route   PUT /api/orders/:id/status
 * @access  Public
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: `status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid order ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Get a single order by ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid order ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getOrderById,
};

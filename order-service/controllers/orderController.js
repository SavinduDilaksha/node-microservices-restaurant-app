const Order = require('../models/Order');

// Orders that are editable/cancellable only while still Pending
const EDITABLE_STATUSES = ['Pending'];
const NON_EDITABLE_STATUSES = ['Preparing', 'Ready', 'Delivered', 'Cancelled'];

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
 * @desc    Update order details (items & totalAmount) — only allowed when status is 'Pending'
 * @route   PUT /api/orders/:id
 * @access  Public
 *
 * Business Rule:
 *   Once the kitchen has started preparing the order (status != 'Pending'),
 *   the customer can no longer change what they ordered.
 *   Only the 'items' array and 'totalAmount' can be updated here.
 *   To change the status, use PUT /api/orders/:id/status instead.
 */
const updateOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Block edit if order is already being processed
    if (!EDITABLE_STATUSES.includes(order.status)) {
      return res.status(409).json({
        success: false,
        error: 'Order Cannot Be Modified',
        details: `Order details can only be changed while status is 'Pending'. Current status is '${order.status}'.`,
      });
    }

    const { items, totalAmount } = req.body;

    // Validate at least one updatable field is provided
    if (!items && totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: 'Provide at least one field to update: items or totalAmount.',
      });
    }

    // Validate items array if provided
    if (items !== undefined) {
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          details: 'items must be a non-empty array.',
        });
      }
    }

    // Apply only the allowed updatable fields
    const updatedFields = {};
    if (items) updatedFields.items = items;
    if (totalAmount !== undefined) updatedFields.totalAmount = totalAmount;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Order updated successfully.',
      data: updatedOrder,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid order ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Update order status — moves order through the kitchen workflow
 * @route   PUT /api/orders/:id/status
 * @access  Public
 *
 * Status Flow:
 *   Pending → Preparing → Ready → Delivered
 *                               ↘ Cancelled  (only from Pending or Preparing)
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

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }


    order.status = status;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid order ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Delete an order — only allowed when status is 'Pending'
 * @route   DELETE /api/orders/:id
 * @access  Public
 *
 * Business Rule:
 *   Once the restaurant has started preparing the order, it cannot be deleted
 *   from the system. The customer can only cancel it via the status endpoint.
 *   Deletion is a hard-remove and is only safe before kitchen processing begins.
 */
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Block deletion if order is already being processed
    if (!EDITABLE_STATUSES.includes(order.status)) {
      return res.status(409).json({
        success: false,
        error: 'Order Cannot Be Deleted',
        details: `Order can only be deleted while status is 'Pending'. Current status is '${order.status}'. Use the status endpoint to cancel instead.`,
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully.',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid order ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderDetails,
  updateOrderStatus,
  deleteOrder,
};
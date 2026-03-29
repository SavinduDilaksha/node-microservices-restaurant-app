const MenuItem = require('../models/MenuItem');

/**
 * @desc    Get all menu items
 * @route   GET /api/menu
 * @access  Public
 */
const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Create a new menu item
 * @route   POST /api/menu
 * @access  Public
 */
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: 'name and price are required fields.',
      });
    }

    const item = await MenuItem.create({ name, description, price, category, isAvailable });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: 'Validation Error', details: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Get a single menu item by ID
 * @route   GET /api/menu/:id
 * @access  Public
 */
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid menu item ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Update a menu item by ID
 * @route   PUT /api/menu/:id
 * @access  Public
 */
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid menu item ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Delete a menu item by ID
 * @route   DELETE /api/menu/:id
 * @access  Public
 */
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid menu item ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};

const Customer = require('../models/Customer');

/**
 * @desc    Get all customers
 * @route   GET /api/customers
 * @access  Public
 */
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Create a new customer
 * @route   POST /api/customers
 * @access  Public
 */
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: 'name, email, and phone are required fields.',
      });
    }

    const customer = await Customer.create({ name, email, phone, address });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
  
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        details: 'A customer with this email already exists.',
      });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Get a single customer by ID
 * @route   GET /api/customers/:id
 * @access  Public
 */
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid customer ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Update a customer by ID
 * @route   PUT /api/customers/:id
 * @access  Public
 */
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,            
      runValidators: true,  
    });

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid customer ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Delete a customer by ID
 * @route   DELETE /api/customers/:id
 * @access  Public
 */
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid customer ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

module.exports = {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};

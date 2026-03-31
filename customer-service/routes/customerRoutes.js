const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');


router.route('/').get(getAllCustomers).post(createCustomer);


router.route('/:id').get(getCustomerById).put(updateCustomer).delete(deleteCustomer);

module.exports = router;
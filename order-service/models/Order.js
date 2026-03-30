const mongoose = require('mongoose');

/**
 * Order Model
 * Represents a customer's food order with associated items and total.
 */
const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Customer ID is required'],
      ref: 'Customer', // Logical reference (cross-service; no Mongoose populate used)
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, 'Menu item ID is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);

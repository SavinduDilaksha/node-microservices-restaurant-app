const mongoose = require('mongoose');

/**
 * Reservation Model
 * Represents a table reservation made by a customer.
 */
const reservationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Customer ID is required'],
      ref: 'Customer',
    },
    date: {
      type: String,
      required: [true, 'Reservation date is required'],
      // Expected format: YYYY-MM-DD
    },
    time: {
      type: String,
      required: [true, 'Reservation time is required'],
      // Expected format: HH:MM (24-hour)
    },
    noOfPeople: {
      type: Number,
      required: [true, 'Number of people is required'],
      min: [1, 'At least 1 person required'],
      max: [50, 'Cannot exceed 50 people per reservation'],
    },
    tableNumber: {
      type: Number,
      required: [true, 'Table number is required'],
      min: [1, 'Table number must be at least 1'],
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);

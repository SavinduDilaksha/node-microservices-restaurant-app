const Reservation = require('../models/Reservation');

/**
 * @desc    Get all reservations
 * @route   GET /api/reservations
 * @access  Public
 */
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: 1, time: 1 });
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Create a new reservation
 * @route   POST /api/reservations
 * @access  Public
 */
const createReservation = async (req, res) => {
  try {
    const { customerId, date, time, noOfPeople, tableNumber } = req.body;

    if (!customerId || !date || !time || !noOfPeople || !tableNumber) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: 'customerId, date, time, noOfPeople, and tableNumber are all required.',
      });
    }

    const reservation = await Reservation.create({
      customerId,
      date,
      time,
      noOfPeople,
      tableNumber,
    });

    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: 'Validation Error', details: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Get a single reservation by ID
 * @route   GET /api/reservations/:id
 * @access  Public
 */
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid reservation ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Update reservation status by ID
 * @route   PUT /api/reservations/:id/status
 * @access  Public
 */
const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Confirmed', 'Pending', 'Cancelled', 'Completed'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: `status must be one of: ${allowed.join(', ')}`,
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid reservation ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

/**
 * @desc    Delete a reservation by ID
 * @route   DELETE /api/reservations/:id
 * @access  Public
 */
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    res.status(200).json({ success: true, message: 'Reservation deleted successfully', data: {} });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid reservation ID format' });
    }
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

module.exports = {
  getAllReservations,
  createReservation,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
};

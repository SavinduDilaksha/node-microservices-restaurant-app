const express = require('express');
const router = express.Router();
const {
  getAllReservations,
  createReservation,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
} = require('../controllers/reservationController');

// GET    /api/reservations       → Fetch all reservations
// POST   /api/reservations       → Create a new reservation
router.route('/').get(getAllReservations).post(createReservation);

// GET    /api/reservations/:id   → Get one reservation
// DELETE /api/reservations/:id   → Delete a reservation
router.route('/:id').get(getReservationById).delete(deleteReservation);
router.route('/:id/status').put(updateReservationStatus);

module.exports = router;

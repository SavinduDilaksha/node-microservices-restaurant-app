require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
const PORT = process.env.PORT || 5005;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/reservations', reservationRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Reservation Service is running', port: PORT });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Reservation Service Error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// ─── Database Connection ──────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Reservation Service: Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Reservation Service running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Reservation Service: MongoDB connection failed:', err.message);
    process.exit(1);
  });

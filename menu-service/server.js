require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const menuRoutes = require('./routes/menuRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/menu', menuRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Menu Service is running', port: PORT });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Menu Service Error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// ─── Database Connection ──────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Menu Service: Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Menu Service running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Menu Service: MongoDB connection failed:', err.message);
    process.exit(1);
  });

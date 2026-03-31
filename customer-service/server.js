require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/customers', customerRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Customer Service is running', port: PORT });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('[Customer Service Error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Customer Service: Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Customer Service running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Customer Service: MongoDB connection failed:', err.message);
    process.exit(1);
  });

/**
 * API Gateway - Restaurant Management System
 *
 * The API Gateway is the single entry point for all client requests.
 * It runs on PORT 5000 and routes traffic to the appropriate microservice.
 *
 * WHY AN API GATEWAY? (Avoiding Multiple Ports)
 * With the API Gateway the client calls ONE port (5000) for everything.
 * Internal services on ports 5001-5005 are never exposed to the client.
 * CORS and logging are configured once here centrally.
 *
 * ROUTING TABLE
 *   /api/customers    → Customer Service    (http://localhost:5001)
 *   /api/menu         → Menu Service        (http://localhost:5002)
 *   /api/orders       → Order Service       (http://localhost:5003)
 *   /api/payments     → Payment Service     (http://localhost:5004)
 *   /api/reservations → Reservation Service (http://localhost:5005)
 *
 * NOTE on http-proxy-middleware v3:
 * Using pathFilter so Express does NOT strip the /api/... prefix.
 * The full request path is forwarded as-is to the downstream service.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Restaurant Management API Gateway is running',
    version: '1.0.0',
    routes: {
      customers:    'http://localhost:5000/api/customers',
      menu:         'http://localhost:5000/api/menu',
      orders:       'http://localhost:5000/api/orders',
      payments:     'http://localhost:5000/api/payments',
      reservations: 'http://localhost:5000/api/reservations',
    },
  });
});

// ─── Proxy Configuration ──────────────────────────────────────────────────────
// Using pathFilter (http-proxy-middleware v3 API) — Express does NOT strip the
// path prefix, so /api/customers/123 is forwarded intact to localhost:5001.

// Customer Service Proxy
app.use(
  createProxyMiddleware({
    pathFilter: '/api/customers',
    target: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:5001',
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error('[Gateway] Customer Service Error:', err.message);
        res.status(502).json({ error: 'Customer Service unavailable' });
      },
    },
  })
);

// Menu Service Proxy
app.use(
  createProxyMiddleware({
    pathFilter: '/api/menu',
    target: process.env.MENU_SERVICE_URL || 'http://localhost:5002',
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error('[Gateway] Menu Service Error:', err.message);
        res.status(502).json({ error: 'Menu Service unavailable' });
      },
    },
  })
);

// Order Service Proxy
app.use(
  createProxyMiddleware({
    pathFilter: '/api/orders',
    target: process.env.ORDER_SERVICE_URL || 'http://localhost:5003',
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error('[Gateway] Order Service Error:', err.message);
        res.status(502).json({ error: 'Order Service unavailable' });
      },
    },
  })
);

// Payment Service Proxy
app.use(
  createProxyMiddleware({
    pathFilter: '/api/payments',
    target: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004',
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error('[Gateway] Payment Service Error:', err.message);
        res.status(502).json({ error: 'Payment Service unavailable' });
      },
    },
  })
);

// Reservation Service Proxy
app.use(
  createProxyMiddleware({
    pathFilter: '/api/reservations',
    target: process.env.RESERVATION_SERVICE_URL || 'http://localhost:5005',
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error('[Gateway] Reservation Service Error:', err.message);
        res.status(502).json({ error: 'Reservation Service unavailable' });
      },
    },
  })
);

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found on gateway` });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nAPI Gateway running on http://localhost:${PORT}`);
  console.log('Routing table:');
  console.log(`  /api/customers    -> http://localhost:5001`);
  console.log(`  /api/menu         -> http://localhost:5002`);
  console.log(`  /api/orders       -> http://localhost:5003`);
  console.log(`  /api/payments     -> http://localhost:5004`);
  console.log(`  /api/reservations -> http://localhost:5005\n`);
});

# 🍽️ Restaurant Management System — Microservices Backend

A production-ready **microservices backend** for a Restaurant Management System built with **Node.js**, **Express**, and **MongoDB**. The system uses an **API Gateway** as the single entry point, routing all client requests to the appropriate internal microservice.

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT  (Browser / Postman)                   │
│                      calls ONE port: 5000                        │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY  :5000                        │
│             express  +  http-proxy-middleware  +  cors           │
│                                                                  │
│  /api/customers    ──►  Customer Service       :5001             │
│  /api/menu         ──►  Menu Service           :5002             │
│  /api/orders       ──►  Order Service          :5003             │
│  /api/payments     ──►  Payment Service        :5004             │
│  /api/reservations ──►  Reservation Service    :5005             │
└─────────────────────────────────────────────────────────────────┘
         │          │          │         │           │
         ▼          ▼          ▼         ▼           ▼
   MongoDB:27017  (5 separate databases, one per service)
```

### Why an API Gateway?

Without a gateway, a client must know and call **five different ports** (5001–5005). This is insecure and tightly coupled. The API Gateway solves this by:

| Without Gateway | With API Gateway |
|---|---|
| Client calls 5 different ports | Client calls **one port (5000)** |
| CORS must be set on every service | CORS configured **once** at the gateway |
| All 5 ports must be publicly open | Only **port 5000** is publicly accessible |
| Auth must be duplicated everywhere | Auth/logging lives **centrally** in the gateway |

---

## 📁 Folder Structure

```
restaurant-management-backend/
│
├── .gitignore
├── README.md
│
├── api-gateway/                  # Port 5000 — Reverse Proxy Entry Point
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── customer-service/             # Port 5001
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   │   └── Customer.js
│   ├── controllers/
│   │   └── customerController.js
│   └── routes/
│       └── customerRoutes.js
│
├── menu-service/                 # Port 5002
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── models/MenuItem.js
│   ├── controllers/menuController.js
│   └── routes/menuRoutes.js
│
├── order-service/                # Port 5003
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── models/Order.js
│   ├── controllers/orderController.js
│   └── routes/orderRoutes.js
│
├── payment-service/              # Port 5004
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── models/Payment.js
│   ├── controllers/paymentController.js
│   └── routes/paymentRoutes.js
│
└── reservation-service/          # Port 5005
    ├── server.js
    ├── package.json
    ├── .env.example
    ├── models/Reservation.js
    ├── controllers/reservationController.js
    └── routes/reservationRoutes.js
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (local) |
| ODM | Mongoose |
| API Gateway | http-proxy-middleware v3 |
| Cross-Origin | cors |
| Config | dotenv |
| HTTP Logging | morgan |

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally)
- npm v9+

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/restaurant-management-backend.git
cd restaurant-management-backend
```

### 2. Install Dependencies for All Services

Run `npm install` inside each service folder:

```bash
cd api-gateway && npm install && cd ..
cd customer-service && npm install && cd ..
cd menu-service && npm install && cd ..
cd order-service && npm install && cd ..
cd payment-service && npm install && cd ..
cd reservation-service && npm install && cd ..
```

### 3. Configure Environment Variables

Each service has a `.env.example` file. Copy it to `.env` and update if needed:

```bash
# Repeat for each service folder:
cp api-gateway/.env.example api-gateway/.env
cp customer-service/.env.example customer-service/.env
cp menu-service/.env.example menu-service/.env
cp order-service/.env.example order-service/.env
cp payment-service/.env.example payment-service/.env
cp reservation-service/.env.example reservation-service/.env
```

Default `.env` values work out-of-the-box for a local MongoDB setup.

### 4. Start MongoDB

Ensure MongoDB is running locally:

```bash
# Windows (as a service)
net start MongoDB

# macOS/Linux
mongod
```

### 5. Start All Services

Open **6 separate terminals** and run one command in each:

```bash
# Terminal 1 — Customer Service
cd customer-service && node server.js

# Terminal 2 — Menu Service
cd menu-service && node server.js

# Terminal 3 — Order Service
cd order-service && node server.js

# Terminal 4 — Payment Service
cd payment-service && node server.js

# Terminal 5 — Reservation Service
cd reservation-service && node server.js

# Terminal 6 — API Gateway (start LAST)
cd api-gateway && node server.js
```

You should see:
```
API Gateway running on http://localhost:5000
  /api/customers    -> http://localhost:5001
  /api/menu         -> http://localhost:5002
  ...
```

---

## 📡 API Reference

> All endpoints are called through the **API Gateway on port 5000**.

### 👤 Customer Service — `/api/customers`

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/api/customers` | Get all customers | — |
| `POST` | `/api/customers` | Create a customer | `name, email, phone, address` |
| `GET` | `/api/customers/:id` | Get customer by ID | — |
| `PUT` | `/api/customers/:id` | Update customer | any fields |
| `DELETE` | `/api/customers/:id` | Delete customer | — |

**POST Body Example:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "9876543210",
  "address": "221B Baker Street"
}
```

---

### 🍕 Menu Service — `/api/menu`

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/api/menu` | Get all menu items | — |
| `POST` | `/api/menu` | Create a menu item | `name, price, category, ...` |
| `GET` | `/api/menu/:id` | Get item by ID | — |
| `PUT` | `/api/menu/:id` | Update item | any fields |
| `DELETE` | `/api/menu/:id` | Delete item | — |

**POST Body Example:**
```json
{
  "name": "Grilled Salmon",
  "description": "Atlantic salmon with lemon butter sauce",
  "price": 1850,
  "category": "Main Course",
  "isAvailable": true
}
```
**Category options:** `Starter` | `Main Course` | `Dessert` | `Beverage` | `Side Dish` | `Special`

---

### 📦 Order Service — `/api/orders`

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/api/orders` | Get all orders | — |
| `POST` | `/api/orders` | Create an order | `customerId, items[], totalAmount` |
| `GET` | `/api/orders/:id` | Get order by ID | — |
| `PUT` | `/api/orders/:id/status` | Update order status | `status` |

**POST Body Example:**
```json
{
  "customerId": "665f1234abcd5678ef901234",
  "items": [
    { "menuItemId": "665f5678abcd1234ef567890", "quantity": 2 },
    { "menuItemId": "665f9999abcd0000ef112233", "quantity": 1 }
  ],
  "totalAmount": 5550
}
```
**Status flow:** `Pending` → `Preparing` → `Ready` → `Delivered` | `Cancelled`

---

### 💳 Payment Service — `/api/payments`

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/api/payments` | Get all payments | — |
| `POST` | `/api/payments` | Record a payment | `orderId, amount, paymentMethod` |
| `GET` | `/api/payments/:id` | Get payment by ID | — |
| `PUT` | `/api/payments/:id/status` | Update status | `status` |

**POST Body Example:**
```json
{
  "orderId": "665fabc123def456789abc12",
  "amount": 5550,
  "paymentMethod": "Credit Card"
}
```
**Payment methods:** `Cash` | `Credit Card` | `Debit Card` | `UPI` | `Online`

---

### 📅 Reservation Service — `/api/reservations`

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/api/reservations` | Get all reservations | — |
| `POST` | `/api/reservations` | Make a reservation | `customerId, date, time, noOfPeople, tableNumber` |
| `GET` | `/api/reservations/:id` | Get by ID | — |
| `PUT` | `/api/reservations/:id/status` | Update status | `status` |

**POST Body Example:**
```json
{
  "customerId": "665f1234abcd5678ef901234",
  "date": "2026-04-15",
  "time": "19:30",
  "noOfPeople": 4,
  "tableNumber": 7
}
```
**Status options:** `Pending` | `Confirmed` | `Cancelled` | `Completed`

---

## 🗄️ MongoDB Databases

Each microservice uses its **own isolated database** (Database-per-Service pattern):

| Service | Database |
|---|---|
| customer-service | `restaurant_customers` |
| menu-service | `restaurant_menu` |
| order-service | `restaurant_orders` |
| payment-service | `restaurant_payments` |
| reservation-service | `restaurant_reservations` |

> MongoDB automatically creates each database on first data insert — no manual setup needed.

---

## 🧪 Quick Test with curl

```bash
# Test gateway is running
curl http://localhost:5000

# Create a customer
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","phone":"1234567890"}'

# Get all customers
curl http://localhost:5000/api/customers

# Create a menu item
curl -X POST http://localhost:5000/api/menu \
  -H "Content-Type: application/json" \
  -d '{"name":"Grilled Salmon","price":1850,"category":"Main Course"}'
```

---

## 🔒 Environment Variables

| Variable | Service | Description |
|---|---|---|
| `PORT` | All | Port the service listens on |
| `MONGO_URI` | Microservices | MongoDB connection string |
| `CUSTOMER_SERVICE_URL` | api-gateway | URL of customer service |
| `MENU_SERVICE_URL` | api-gateway | URL of menu service |
| `ORDER_SERVICE_URL` | api-gateway | URL of order service |
| `PAYMENT_SERVICE_URL` | api-gateway | URL of payment service |
| `RESERVATION_SERVICE_URL` | api-gateway | URL of reservation service |

> ⚠️ **Never commit your `.env` files.** They are excluded by `.gitignore`. Use `.env.example` as a template.

---

## 📄 License

This project is for academic purposes — **MTIT Assignment 2**.

---

## 👤 Author

Built with Node.js, Express, MongoDB, and love for clean microservice architecture.

# ShopMERN – Full-Stack MERN Ecommerce

A complete ecommerce platform built with MongoDB, Express, React, and Node.js.

## Project Structure

```
ecommerce/
├── api/          ← Express REST API (port 5000)
├── front-ui/     ← Customer storefront (port 5173)
└── cms-ui/       ← Admin/Staff panel (port 5174)
```

## Features

### Storefront (front-ui)
- 🏠 Home with hero carousel, featured/latest/top-selling product sections
- 🔍 Product search and category filtering
- 📦 Product detail with image gallery, reviews, qty selector
- 🛒 Cart with quantity management and persistent storage (Redux + localStorage)
- 💳 eSewa payment integration
- 👤 Auth (register/login), profile editing, order history

### CMS (cms-ui)
- 📊 Dashboard with stats (products, orders, customers, revenue)
- 📦 Products CRUD with image upload, featured flag, discounts
- 🏷️ Categories & Brands CRUD
- 📋 Orders management with status updates and detail view
- 👥 Customer management (activate/deactivate)
- ⭐ Review moderation (approve/hide/delete)
- 👔 Staff management (Admin only)

### API
- JWT Authentication (register/login)
- Role-based access control (Admin, Staff, Customer)
- File uploads via Multer
- eSewa payment gateway (sandbox)
- Full CRUD for all resources

---

## Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- MongoDB running locally (or Atlas connection string)

### 2. API Setup
```bash
cd api
cp .env.example .env        # edit MONGO_URL and JWT_SECRET
npm install
npm run dev                 # runs on http://localhost:5000
```

### 3. Storefront Setup
```bash
cd front-ui
npm install
npm run dev                 # runs on http://localhost:5173
```

### 4. CMS Setup
```bash
cd cms-ui
npm install
npm run dev                 # runs on http://localhost:5174
```

---

## Seeding an Admin User

Run this once in MongoDB shell or Compass to create your first admin:

```js
// In mongosh:
use ecommerce
db.users.insertOne({
  name: "Super Admin",
  email: "admin@shopmern.com",
  password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: "password"
  phone: "9800000000",
  address: "Kathmandu",
  role: "Admin",
  status: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```
> Or register via the front-ui and then manually set the role to `Admin` in MongoDB.

---

## Environment Variables (api/.env)

| Variable       | Description                         | Default                  |
|----------------|-------------------------------------|--------------------------|
| `MONGO_URL`    | MongoDB connection string           | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET`   | Secret for signing JWTs             | *(required)*             |
| `PORT`         | API port                            | `5000`                   |
| `ESEWA_SECRET` | eSewa HMAC secret (sandbox)         | `8gBm/:&EnhH.1/q`        |
| `FRONTEND_URL` | Storefront URL for payment redirect | `http://localhost:5173`  |

---

## API Endpoints Summary

### Auth
| Method | Path              | Description        |
|--------|-------------------|--------------------|
| POST   | /auth/register    | Register customer  |
| POST   | /auth/login       | Login (any role)   |

### Profile (auth required)
| Method | Path                    | Description         |
|--------|-------------------------|---------------------|
| GET    | /profile                | Get my profile      |
| PUT    | /profile                | Update profile      |
| PUT    | /profile/change-password| Change password     |
| GET    | /profile/orders         | My order history    |
| POST   | /profile/reviews        | Submit a review     |

### Front (public)
| Method | Path                      | Description             |
|--------|---------------------------|-------------------------|
| GET    | /products/featured        | Featured products       |
| GET    | /products/latest          | Latest products         |
| GET    | /products/top-selling     | Top selling products    |
| GET    | /products                 | All products (paginated)|
| GET    | /products/:id             | Product detail + reviews|
| GET    | /products/category/:id    | By category             |
| GET    | /mix/categories           | All active categories   |
| GET    | /mix/brands               | All active brands       |

### CMS (auth + staff/admin)
| Method | Path                      | Description         |
|--------|---------------------------|---------------------|
| GET/POST        | /cms/categories  | List / Create       |
| GET/PUT/DELETE  | /cms/categories/:id | Get/Update/Delete|
| GET/POST        | /cms/brands      | List / Create       |
| GET/PUT/DELETE  | /cms/brands/:id  | Get/Update/Delete   |
| GET/POST        | /cms/products    | List / Create       |
| GET/PUT/DELETE  | /cms/products/:id| Get/Update/Delete   |
| GET/PUT/DELETE  | /cms/customers/:id | Manage customers  |
| GET/PUT/DELETE  | /cms/staffs/:id  | Manage staffs (Admin)|
| GET             | /cms/orders      | All orders          |
| PUT             | /cms/orders/:id/status | Update status |
| GET/PUT/DELETE  | /cms/reviews/:id | Manage reviews      |

### Checkout & Payment
| Method | Path                  | Description             |
|--------|-----------------------|-------------------------|
| POST   | /api/checkout         | Create order from cart  |
| POST   | /api/payment/initiate | Get eSewa payment data  |
| GET    | /api/payment/verify   | Verify after redirect   |

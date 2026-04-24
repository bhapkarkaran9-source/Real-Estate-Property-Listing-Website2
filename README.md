# 🏠 Real Estate India — Full-Stack Property Listing Website

A production-grade Real Estate Property Listing Website for the Indian market built with **React + Vite**, **Node.js / Express**, and **MySQL**.

---

## 📁 Folder Structure

```
real-estate-india/
├── backend/                    # Express.js API server
│   ├── config/db.js            # MySQL connection pool
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── favoriteController.js
│   │   ├── contactController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + role authorise
│   │   └── upload.js           # Multer image uploads
│   ├── routes/                 # Express routers
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── favorites.js
│   │   ├── contact.js
│   │   └── admin.js
│   ├── uploads/                # Uploaded property images
│   ├── .env                    # Environment variables (edit this)
│   ├── package.json
│   └── server.js               # Entry point
│
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── api/api.js          # Axios instance + JWT interceptor
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx / .css
│   │   │   ├── Footer.jsx / .css
│   │   │   ├── PropertyCard.jsx / .css
│   │   │   ├── SearchBar.jsx / .css
│   │   │   ├── EMICalculator.jsx / .css
│   │   │   └── LoadingSpinner.jsx / .css
│   │   ├── pages/
│   │   │   ├── Home.jsx / .css
│   │   │   ├── Properties.jsx / .css
│   │   │   ├── PropertyDetail.jsx / .css
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Auth.css        (shared by Login + Signup)
│   │   │   ├── SellProperty.jsx / .css
│   │   │   ├── AdminPanel.jsx / .css
│   │   │   ├── Favorites.jsx / .css
│   │   │   ├── About.jsx / .css
│   │   │   ├── Contact.jsx / .css
│   │   │   └── Agents.jsx / .css
│   │   ├── App.jsx
│   │   ├── index.css           # Global design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql              # Full MySQL schema + seed data
└── README.md
```

---

## ⚙️ Prerequisites

| Tool        | Version  |
|-------------|----------|
| Node.js     | v18+     |
| npm         | v9+      |
| MySQL       | v8+      |

---

## 🚀 Setup Instructions

### Step 1 — MySQL Database

1. Open MySQL Workbench or your MySQL client.
2. Run the schema file:

```sql
source /path/to/database/schema.sql
```

Or paste the contents of `database/schema.sql` directly into your MySQL client.

This creates the `real_estate_india` database with all tables and seed data.

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Edit `.env` with your MySQL password:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE    ← change this
DB_NAME=real_estate_india

JWT_SECRET=realestate_india_super_secret_key_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
# Server running on http://localhost:5000
```

---

### Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```

---

## 🔐 Demo Login Credentials

| Role   | Email                          | Password   |
|--------|--------------------------------|------------|
| Admin  | admin@realestateindia.com      | password   |
| Seller | rajesh@example.com             | password   |

> **Note:** The seed data uses bcrypt hash for `password`. The demo buttons on the Login page auto-fill these credentials.

---

## 🌐 Pages & Features

| Route            | Page                  | Access       |
|------------------|-----------------------|--------------|
| `/`              | Home                  | Public       |
| `/buy`           | Buy Properties        | Public       |
| `/rent`          | Rent Properties       | Public       |
| `/properties`    | All Properties        | Public       |
| `/properties/:id`| Property Detail       | Public       |
| `/about`         | About Us              | Public       |
| `/contact`       | Contact Us            | Public       |
| `/agents`        | Agents & Builders     | Public       |
| `/login`         | Login                 | Guest only   |
| `/signup`        | Sign Up               | Guest only   |
| `/sell`          | List Property         | Seller/Admin |
| `/favorites`     | My Favorites          | Logged in    |
| `/admin`         | Admin Panel           | Admin only   |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint                  | Description        |
|--------|---------------------------|--------------------|
| POST   | `/api/auth/register`      | Register user      |
| POST   | `/api/auth/login`         | Login              |
| GET    | `/api/auth/me`            | Get profile        |
| PUT    | `/api/auth/profile`       | Update profile     |
| PUT    | `/api/auth/change-password` | Change password  |

### Properties
| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| GET    | `/api/properties`             | List with filters/sort   |
| GET    | `/api/properties/featured`    | Featured properties      |
| GET    | `/api/properties/my`          | My listings              |
| GET    | `/api/properties/:id`         | Property detail          |
| POST   | `/api/properties`             | Create (seller/admin)    |
| PUT    | `/api/properties/:id`         | Update (owner/admin)     |
| DELETE | `/api/properties/:id`         | Delete (owner/admin)     |

### Favorites
| Method | Endpoint                          | Description        |
|--------|-----------------------------------|--------------------|
| GET    | `/api/favorites`                  | Get my favorites   |
| POST   | `/api/favorites/:propertyId`      | Toggle favorite    |
| GET    | `/api/favorites/check/:propertyId`| Check if favorited |

### Contact
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | `/api/contact`        | Submit enquiry     |
| GET    | `/api/contact`        | All enquiries (admin) |
| PUT    | `/api/contact/:id/respond` | Mark responded (admin) |

### Admin
| Method | Endpoint                          | Description           |
|--------|-----------------------------------|-----------------------|
| GET    | `/api/admin/stats`                | Dashboard stats       |
| GET    | `/api/admin/properties`           | All properties        |
| PUT    | `/api/admin/properties/:id/status`| Approve/reject        |
| DELETE | `/api/admin/properties/:id`       | Delete property       |
| GET    | `/api/admin/users`                | All users             |
| PUT    | `/api/admin/users/:id/toggle`     | Toggle active status  |
| DELETE | `/api/admin/users/:id`            | Delete user           |

---

## 🗄️ Database Schema

```
users              → id, name, email, password, phone, role, is_active
properties         → id, title, price, price_type, property_type, bhk, area_sqft,
                      location_city, location_area, amenities(JSON), status, owner_id
property_images    → id, property_id, image_url, is_primary
favorites          → id, user_id, property_id
contact_requests   → id, user_id, property_id, name, email, phone, message, status
```

---

## ✨ Key Features

- 🇮🇳 **Indian Market** — Prices in ₹ (Lakh/Crore), 12 major cities
- 🔐 **JWT Auth** — Secure token-based auth with role-based guards
- 👑 **3 Roles** — Buyer, Seller, Admin with separate access
- 🧮 **EMI Calculator** — Real-time with sliders (price, down payment, rate, tenure)
- 📸 **Image Upload** — Multer-powered with previews, 5 MB limit
- ❤️ **Favorites** — Wishlist with toggle
- ⚙️ **Admin Panel** — Stats dashboard, approve/reject listings, manage users
- 🔍 **Dynamic Search** — Filter by city, type, BHK, price range, keyword
- 📱 **Responsive** — Mobile-first design with hamburger nav
- 🌙 **Dark Theme** — Premium navy + gold design system
- ⚡ **Loading States** — Spinners on all async operations

---

## 🛠️ Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, React Router v6 |
| Styling   | Vanilla CSS3 (design tokens)  |
| HTTP      | Axios with JWT interceptor    |
| Backend   | Node.js, Express.js           |
| Database  | MySQL 8 with mysql2/promise   |
| Auth      | JWT + bcryptjs                |
| Upload    | Multer (disk storage)         |
| Toasts    | react-hot-toast               |
#   R e a l - E s t a t e - P r o p e r t y - L i s t i n g - P r o j e c t  
 
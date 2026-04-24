// server.js — Entry point for the Real Estate India API
const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const authRoutes      = require('./routes/auth');
const propertyRoutes  = require('./routes/properties');
const favoriteRoutes  = require('./routes/favorites');
const contactRoutes   = require('./routes/contact');
const adminRoutes     = require('./routes/admin');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites',  favoriteRoutes);
app.use('/api/contact',    contactRoutes);
app.use('/api/admin',      adminRoutes);

// Health-check
app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', message: 'Real Estate India API is running 🚀' })
);

// ── Global error handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🏠 Real Estate India API running on http://localhost:${PORT}`)
);

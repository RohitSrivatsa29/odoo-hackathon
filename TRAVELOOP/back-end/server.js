const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const photoRoutes = require('./routes/photos');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware — allow both localhost and 127.0.0.1 on any dev port
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3005',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3005',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman) or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true
}));
app.use(express.json());

// Ensure upload directory exists
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from uploads folder
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/photos', photoRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TRAVELOOP API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

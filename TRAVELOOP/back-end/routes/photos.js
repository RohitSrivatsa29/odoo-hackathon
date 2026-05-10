const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ─── Multer Storage Config ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File type validation - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// All photo routes require authentication
router.use(authenticate);

// ─── POST /api/photos/upload ─────────────────────────────────────────────────
router.post('/upload', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  const { caption } = req.body;
  const photo_url = `/uploads/${req.file.filename}`;

  try {
    const result = await pool.query(
      `INSERT INTO uploaded_photos (user_id, photo_url, file_size_bytes, content_type, caption)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, photo_url, req.file.size, req.file.mimetype, caption || '']
    );
    res.status(201).json({ photo: result.rows[0] });
  } catch (err) {
    console.error('Photo upload error:', err.message);
    res.status(500).json({ error: 'Could not save photo record.' });
  }
});

// ─── GET /api/photos ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM uploaded_photos WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [req.user.id]
    );
    res.json({ photos: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch photos.' });
  }
});

// ─── DELETE /api/photos/:id ───────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM uploaded_photos WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Photo not found.' });
    res.json({ message: 'Photo deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete photo.' });
  }
});

module.exports = router;

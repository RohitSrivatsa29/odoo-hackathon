const express = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All trip routes require authentication
router.use(authenticate);

// ─── GET /api/trips ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ trips: result.rows });
  } catch (err) {
    console.error('Get trips error:', err.message);
    res.status(500).json({ error: 'Could not fetch trips.' });
  }
});

// ─── GET /api/trips/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Trip not found.' });
    res.json({ trip: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch trip.' });
  }
});

// ─── POST /api/trips ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, description, start_date, end_date, cover_image, status, budget } = req.body;

  if (!name) return res.status(400).json({ error: 'Trip name is required.' });

  try {
    const result = await pool.query(
      `INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image, status, budget)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user.id, name, description || '', start_date, end_date, cover_image || '', status || 'planning', budget || null]
    );
    res.status(201).json({ trip: result.rows[0] });
  } catch (err) {
    console.error('Create trip error:', err.message);
    res.status(500).json({ error: 'Could not create trip.' });
  }
});

// ─── PUT /api/trips/:id ──────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { name, description, start_date, end_date, cover_image, status, budget } = req.body;

  try {
    const result = await pool.query(
      `UPDATE trips
       SET name=$1, description=$2, start_date=$3, end_date=$4,
           cover_image=$5, status=$6, budget=$7, updated_at=CURRENT_TIMESTAMP
       WHERE id=$8 AND user_id=$9
       RETURNING *`,
      [name, description, start_date, end_date, cover_image, status, budget, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Trip not found.' });
    res.json({ trip: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Could not update trip.' });
  }
});

// ─── DELETE /api/trips/:id ───────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Trip not found.' });
    res.json({ message: 'Trip deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete trip.' });
  }
});

module.exports = router;

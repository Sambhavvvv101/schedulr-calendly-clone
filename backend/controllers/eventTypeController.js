const pool = require('../db/connection');

// GET /api/event-types — list all event types
const getAll = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM event_types ORDER BY created_at ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/event-types/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM event_types WHERE id = $1', [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/event-types/slug/:slug — used by public booking page
const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      'SELECT * FROM event_types WHERE slug = $1 AND is_active = true', [slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Event type not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/event-types — create new event type
const create = async (req, res) => {
  try {
    const { name, duration, slug, description, color } = req.body;
    if (!name || !duration || !slug) {
      return res.status(400).json({ error: 'name, duration, and slug are required' });
    }
    const result = await pool.query(
      `INSERT INTO event_types (name, duration, slug, description, color)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, duration, slug, description || '', color || '#0069ff']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/event-types/:id — update event type
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, slug, description, color, is_active } = req.body;
    const result = await pool.query(
      `UPDATE event_types
       SET name=$1, duration=$2, slug=$3, description=$4, color=$5, is_active=$6
       WHERE id=$7 RETURNING *`,
      [name, duration, slug, description, color, is_active, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/event-types/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM event_types WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, getBySlug, create, update, remove };

const pool = require('../db/connection');

// GET /api/meetings?status=upcoming|past|cancelled
const getAll = async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT m.*, e.name as event_name, e.color, e.duration
      FROM meetings m
      JOIN event_types e ON m.event_type_id = e.id
    `;
    const params = [];
    if (status) {
      query += ' WHERE m.status = $1';
      params.push(status);
    }
    query += ' ORDER BY m.start_time ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/meetings/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT m.*, e.name as event_name, e.color, e.duration
       FROM meetings m JOIN event_types e ON m.event_type_id = e.id
       WHERE m.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/meetings/:id/cancel
const cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancel_reason } = req.body;
    const result = await pool.query(
      `UPDATE meetings SET status='cancelled', cancel_reason=$1
       WHERE id=$2 AND status='upcoming' RETURNING *`,
      [cancel_reason || '', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting not found or already cancelled' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, cancel };

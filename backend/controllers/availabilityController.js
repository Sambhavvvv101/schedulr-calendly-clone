const pool = require('../db/connection');

// GET /api/availability
const getAll = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM availability ORDER BY day_of_week ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/availability — update full weekly schedule (array of all 7 days)
const updateAll = async (req, res) => {
  const client = await pool.connect();
  try {
    const { schedule, timezone } = req.body;
    // schedule = [{ day_of_week, start_time, end_time, is_active }]
    await client.query('BEGIN');
    for (const day of schedule) {
      await client.query(
        `UPDATE availability
         SET start_time=$1, end_time=$2, is_active=$3, timezone=$4
         WHERE day_of_week=$5`,
        [day.start_time, day.end_time, day.is_active, timezone || 'Asia/Kolkata', day.day_of_week]
      );
    }
    await client.query('COMMIT');
    const result = await pool.query('SELECT * FROM availability ORDER BY day_of_week ASC');
    res.json(result.rows);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

module.exports = { getAll, updateAll };

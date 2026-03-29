const pool = require('../db/connection');

// GET /api/book/:slug/slots?date=YYYY-MM-DD
// Returns available time slots for a given date and event type
const getSlots = async (req, res) => {
  try {
    const { slug } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: 'date query param required (YYYY-MM-DD)' });

    // 1. Get event type
    const etResult = await pool.query(
      'SELECT * FROM event_types WHERE slug=$1 AND is_active=true', [slug]
    );
    if (etResult.rows.length === 0) return res.status(404).json({ error: 'Event type not found' });
    const eventType = etResult.rows[0];

    // 2. Get availability for this day of week
    const dateObj = new Date(date + 'T00:00:00');
    const dow = dateObj.getDay();
    const availResult = await pool.query(
      'SELECT * FROM availability WHERE day_of_week=$1 AND is_active=true', [dow]
    );
    if (availResult.rows.length === 0) return res.json([]);
    const avail = availResult.rows[0];

    // 3. Get existing bookings for this date
    const bookingsResult = await pool.query(
      `SELECT start_time, end_time FROM meetings
       WHERE DATE(start_time) = $1 AND status != 'cancelled'`,
      [date]
    );
    const bookedSlots = bookingsResult.rows;

    // 4. Generate slots
    const slots = [];
    const [startH, startM] = avail.start_time.split(':').map(Number);
    const [endH, endM] = avail.end_time.split(':').map(Number);

    let current = new Date(date + 'T00:00:00');
    current.setHours(startH, startM, 0, 0);
    const endLimit = new Date(date + 'T00:00:00');
    endLimit.setHours(endH, endM, 0, 0);

    const now = new Date();

    while (current < endLimit) {
      const slotEnd = new Date(current.getTime() + eventType.duration * 60000);
      if (slotEnd > endLimit) break;

      // Skip past slots
      const isPast = current <= now;

      // Check for double booking
      const isBooked = bookedSlots.some(b => {
        const bStart = new Date(b.start_time);
        const bEnd = new Date(b.end_time);
        return current < bEnd && slotEnd > bStart;
      });

      slots.push({
        start: current.toISOString(),
        end: slotEnd.toISOString(),
        available: !isPast && !isBooked,
      });

      current = new Date(current.getTime() + eventType.duration * 60000);
    }

    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/book/:slug — confirm a booking
const confirmBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    const { slug } = req.params;
    const { invitee_name, invitee_email, start_time } = req.body;

    if (!invitee_name || !invitee_email || !start_time) {
      return res.status(400).json({ error: 'invitee_name, invitee_email, start_time required' });
    }

    // Get event type
    const etResult = await pool.query(
      'SELECT * FROM event_types WHERE slug=$1 AND is_active=true', [slug]
    );
    if (etResult.rows.length === 0) return res.status(404).json({ error: 'Event type not found' });
    const eventType = etResult.rows[0];

    const startDt = new Date(start_time);
    const endDt = new Date(startDt.getTime() + eventType.duration * 60000);

    await client.query('BEGIN');

    // Double-booking check (with row lock)
    const conflict = await client.query(
      `SELECT id FROM meetings
       WHERE status != 'cancelled'
       AND start_time < $1 AND end_time > $2
       FOR UPDATE`,
      [endDt.toISOString(), startDt.toISOString()]
    );
    if (conflict.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'This slot is already booked' });
    }

    // Create booking
    const result = await client.query(
      `INSERT INTO meetings (event_type_id, invitee_name, invitee_email, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [eventType.id, invitee_name, invitee_email, startDt.toISOString(), endDt.toISOString()]
    );

    await client.query('COMMIT');
    res.status(201).json({ ...result.rows[0], event_name: eventType.name });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

module.exports = { getSlots, confirmBooking };

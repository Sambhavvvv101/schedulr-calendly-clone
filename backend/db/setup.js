// Auto-runs on server start — creates tables and seeds data if they don't exist yet.
// Safe to run multiple times (uses IF NOT EXISTS).
const pool = require('./connection');

const setup = async () => {
  const client = await pool.connect();
  try {
    console.log('🔧 Running database setup...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS event_types (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100)  NOT NULL,
        duration    INTEGER       NOT NULL CHECK (duration > 0),
        slug        VARCHAR(100)  UNIQUE NOT NULL,
        description TEXT,
        color       VARCHAR(20)   DEFAULT '#0069ff',
        is_active   BOOLEAN       DEFAULT true,
        created_at  TIMESTAMP     DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS availability (
        id           SERIAL PRIMARY KEY,
        day_of_week  INTEGER  NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
        start_time   TIME     NOT NULL,
        end_time     TIME     NOT NULL,
        timezone     VARCHAR(60) DEFAULT 'Asia/Kolkata',
        is_active    BOOLEAN  DEFAULT true,
        UNIQUE (day_of_week)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS meetings (
        id              SERIAL PRIMARY KEY,
        event_type_id   INTEGER REFERENCES event_types(id) ON DELETE CASCADE,
        invitee_name    VARCHAR(100) NOT NULL,
        invitee_email   VARCHAR(100) NOT NULL,
        start_time      TIMESTAMP    NOT NULL,
        end_time        TIMESTAMP    NOT NULL,
        status          VARCHAR(20)  DEFAULT 'upcoming'
                        CHECK (status IN ('upcoming', 'past', 'cancelled')),
        cancel_reason   TEXT,
        created_at      TIMESTAMP    DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_meetings_start  ON meetings(start_time);
      CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
    `);

    // Seed event types only if table is empty
    const { rows: etRows } = await client.query('SELECT COUNT(*) FROM event_types');
    if (parseInt(etRows[0].count) === 0) {
      await client.query(`
        INSERT INTO event_types (name, duration, slug, description, color) VALUES
          ('Quick Chat',     15, 'quick-chat',     'A short 15-minute introductory call',  '#0069ff'),
          ('30 Min Meeting', 30, '30-min-meeting', 'Standard 30-minute discussion',        '#7c3aed'),
          ('1 Hour Session', 60, '1-hour-session', 'In-depth 60-minute deep dive session', '#00a96e');
      `);
      console.log('Event types seeded');
    }

    // Seed availability only if table is empty
    const { rows: avRows } = await client.query('SELECT COUNT(*) FROM availability');
    if (parseInt(avRows[0].count) === 0) {
      await client.query(`
        INSERT INTO availability (day_of_week, start_time, end_time, is_active) VALUES
          (0, '09:00', '17:00', false),
          (1, '09:00', '17:00', true),
          (2, '09:00', '17:00', true),
          (3, '09:00', '17:00', true),
          (4, '09:00', '17:00', true),
          (5, '09:00', '17:00', true),
          (6, '09:00', '17:00', false);
      `);
      console.log('Availability seeded');
    }

    // Seed meetings only if table is empty
    const { rows: mRows } = await client.query('SELECT COUNT(*) FROM meetings');
    if (parseInt(mRows[0].count) === 0) {
      await client.query(`
        INSERT INTO meetings (event_type_id, invitee_name, invitee_email, start_time, end_time, status) VALUES
          (1, 'Rahul Sharma',  'rahul@example.com',  NOW() + INTERVAL '1 day'  + TIME '10:00', NOW() + INTERVAL '1 day'  + TIME '10:15', 'upcoming'),
          (2, 'Priya Mehta',   'priya@example.com',  NOW() + INTERVAL '2 days' + TIME '14:00', NOW() + INTERVAL '2 days' + TIME '14:30', 'upcoming'),
          (3, 'Amit Kumar',    'amit@example.com',   NOW() - INTERVAL '3 days' + TIME '11:00', NOW() - INTERVAL '3 days' + TIME '12:00', 'past'),
          (1, 'Neha Singh',    'neha@example.com',   NOW() - INTERVAL '1 day'  + TIME '09:00', NOW() - INTERVAL '1 day'  + TIME '09:15', 'past'),
          (2, 'Vikram Patel',  'vikram@example.com', NOW() + INTERVAL '4 days' + TIME '15:00', NOW() + INTERVAL '4 days' + TIME '15:30', 'cancelled');
      `);
      console.log('Sample meetings seeded');
    }

    console.log('Database setup complete!');
  } catch (err) {
    console.error('Database setup error:', err.message);
  } finally {
    client.release();
  }
};

module.exports = setup;
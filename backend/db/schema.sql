-- ============================================================
-- Schedulr Database Schema
-- Run: psql -U postgres -f backend/db/schema.sql
-- ============================================================

-- Create database
CREATE DATABASE calendly_clone;
\c calendly_clone;

-- ─── EVENT TYPES ──────────────────────────────────────────────
-- Stores the types of meetings the host offers (e.g. "30 Min Call")
CREATE TABLE event_types (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  duration    INTEGER       NOT NULL CHECK (duration > 0),   -- minutes
  slug        VARCHAR(100)  UNIQUE NOT NULL,                 -- used in public URL
  description TEXT,
  color       VARCHAR(20)   DEFAULT '#0069ff',
  is_active   BOOLEAN       DEFAULT true,
  created_at  TIMESTAMP     DEFAULT NOW()
);

-- ─── AVAILABILITY ─────────────────────────────────────────────
-- Stores the host's recurring weekly schedule
CREATE TABLE availability (
  id           SERIAL PRIMARY KEY,
  day_of_week  INTEGER  NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  start_time   TIME     NOT NULL,
  end_time     TIME     NOT NULL,
  timezone     VARCHAR(60) DEFAULT 'Asia/Kolkata',
  is_active    BOOLEAN  DEFAULT true,
  UNIQUE (day_of_week)
);

-- ─── MEETINGS ─────────────────────────────────────────────────
-- Stores confirmed bookings made by invitees
CREATE TABLE meetings (
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

-- Index to speed up double-booking checks
CREATE INDEX idx_meetings_start ON meetings(start_time);
CREATE INDEX idx_meetings_status ON meetings(status);

-- ─── SEED DATA ────────────────────────────────────────────────

-- Event Types
INSERT INTO event_types (name, duration, slug, description, color) VALUES
  ('Quick Chat',      15, 'quick-chat',      'A short 15-minute introductory call',   '#0069ff'),
  ('30 Min Meeting',  30, '30-min-meeting',  'Standard 30-minute discussion',         '#7c3aed'),
  ('1 Hour Session',  60, '1-hour-session',  'In-depth 60-minute deep dive session',  '#00a96e');

-- Availability (Mon–Fri, 9 AM – 5 PM IST)
INSERT INTO availability (day_of_week, start_time, end_time, is_active) VALUES
  (0, '09:00', '17:00', false),  -- Sunday  (off)
  (1, '09:00', '17:00', true),   -- Monday
  (2, '09:00', '17:00', true),   -- Tuesday
  (3, '09:00', '17:00', true),   -- Wednesday
  (4, '09:00', '17:00', true),   -- Thursday
  (5, '09:00', '17:00', true),   -- Friday
  (6, '09:00', '17:00', false);  -- Saturday (off)

-- Sample Meetings (relative to current date)
INSERT INTO meetings (event_type_id, invitee_name, invitee_email, start_time, end_time, status) VALUES
  (1, 'Rahul Sharma',  'rahul@example.com',  NOW() + INTERVAL '1 day'  + TIME '10:00', NOW() + INTERVAL '1 day'  + TIME '10:15', 'upcoming'),
  (2, 'Priya Mehta',   'priya@example.com',  NOW() + INTERVAL '2 days' + TIME '14:00', NOW() + INTERVAL '2 days' + TIME '14:30', 'upcoming'),
  (3, 'Amit Kumar',    'amit@example.com',   NOW() - INTERVAL '3 days' + TIME '11:00', NOW() - INTERVAL '3 days' + TIME '12:00', 'past'),
  (1, 'Neha Singh',    'neha@example.com',   NOW() - INTERVAL '1 day'  + TIME '09:00', NOW() - INTERVAL '1 day'  + TIME '09:15', 'past'),
  (2, 'Vikram Patel',  'vikram@example.com', NOW() + INTERVAL '4 days' + TIME '15:00', NOW() + INTERVAL '4 days' + TIME '15:30', 'cancelled');

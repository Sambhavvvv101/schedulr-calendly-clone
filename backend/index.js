require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const setup   = require('./db/setup'); // auto-creates tables + seeds data

const eventTypeRoutes    = require('./routes/eventTypes');
const availabilityRoutes = require('./routes/availability');
const meetingRoutes      = require('./routes/meetings');
const bookingRoutes      = require('./routes/booking');

const app = express();

// CORS — allow Vercel frontend + local dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/event-types', eventTypeRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/meetings',     meetingRoutes);
app.use('/api/book',         bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Schedulr API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Run DB setup first, then start server
setup().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Schedulr API running on port ${PORT}`);
  });
});

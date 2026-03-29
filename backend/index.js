require('dotenv').config();
const express = require('express');
const cors = require('cors');

const eventTypeRoutes = require('./routes/eventTypes');
const availabilityRoutes = require('./routes/availability');
const meetingRoutes = require('./routes/meetings');
const bookingRoutes = require('./routes/booking');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/event-types', eventTypeRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/book', bookingRoutes);

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
app.listen(PORT, () => {
  console.log(`Schedulr API running on http://localhost:${PORT}`);
});

# Schedulr – Calendly Clone

A full-stack scheduling/booking web application built as part of the Scaler SDE Intern Fullstack Assignment.

## Tech Stack

| Layer      | Technology                     |
|------------|-------------------------------|
| Frontend   | React.js (Vite)                |
| Backend    | Node.js + Express.js           |
| Database   | PostgreSQL                     |
| Styling    | Plain CSS (no framework)       |

## Project Structure

```
calendly-clone/
├── frontend/          # React.js SPA
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page-level components
│   │   ├── context/      # Global state (AppContext)
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Helper functions
│   └── public/
├── backend/           # Node.js + Express API
│   ├── routes/        # Route definitions
│   ├── controllers/   # Business logic
│   ├── db/            # DB connection + schema
│   └── middleware/    # Express middleware
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- npm

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/calendly-clone.git
cd calendly-clone
```

### 2. Database Setup
```bash
# Open PostgreSQL
psql -U postgres

# Run the schema file
\i backend/db/schema.sql
```

### 3. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your PostgreSQL credentials

npm run dev
# Runs on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## Environment Variables

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calendly_clone
DB_USER=postgres
DB_PASSWORD=yourpassword
PORT=5000
```

## Assumptions Made

- A single default user ("John Smith") is always logged in on the admin side — no authentication required.
- The public booking page is accessible to anyone via `/book/:slug`.
- Timezone is stored as a string (e.g., `Asia/Kolkata`) and all times are stored in UTC in the database.
- Slot generation is done on the backend based on availability settings and existing bookings.
- Email notifications are not implemented (bonus feature — marked as future scope).

## Core Features Implemented

- [x] Event Types — Create, Edit, Delete, List
- [x] Availability Settings — Days + Time ranges + Timezone
- [x] Public Booking Page — Calendar, Slots, Form, Confirmation
- [x] Meetings Page — Upcoming, Past, Cancel
- [x] Seed Data — Sample event types and meetings
- [x] Prevent Double Booking
- [x] Responsive Design (mobile + desktop)

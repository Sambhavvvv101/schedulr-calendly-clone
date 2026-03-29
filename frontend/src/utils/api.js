const BASE_URL = "https://schedulr-backend-e8nt.onrender.com";

// Event Types
export const getEventTypes = async () => {
  const res = await fetch(`${BASE_URL}/api/event-types`);
  return res.json();
};

// Availability
export const getAvailability = async () => {
  const res = await fetch(`${BASE_URL}/api/availability`);
  return res.json();
};

export const updateAvailability = async (data) => {
  const res = await fetch(`${BASE_URL}/api/availability`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Bookings
export const getBookings = async () => {
  const res = await fetch(`${BASE_URL}/api/meetings`);
  return res.json();
};

export const createBooking = async (data) => {
  const res = await fetch(`${BASE_URL}/api/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
const BASE_URL = "https://schedulr-backend-e8nt.onrender.com";

// ===== MEETINGS =====
export const getMeetings = async () => {
  const res = await fetch(`${BASE_URL}/meetings`);
  if (!res.ok) throw new Error("Failed to fetch meetings");
  return res.json();
};

// ===== EVENT TYPES =====
export const getEventTypes = async () => {
  const res = await fetch(`${BASE_URL}/event-types`);
  if (!res.ok) throw new Error("Failed to fetch event types");
  return res.json();
};

// ===== AVAILABILITY =====
export const getAvailability = async () => {
  const res = await fetch(`${BASE_URL}/availability`);
  if (!res.ok) throw new Error("Failed to fetch availability");
  return res.json();
};

// ===== UPDATE AVAILABILITY =====
export const updateAvailability = async (data) => {
  const res = await fetch(`${BASE_URL}/availability`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ===== CREATE BOOKING =====
export const createBooking = async (data) => {
  const res = await fetch(`${BASE_URL}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
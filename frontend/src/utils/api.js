const BASE_URL = "https://schedulr-backend-e8nt.onrender.com";

// ===== EVENT TYPES =====
export const getEventTypes = async () => {
  const res = await fetch(`${BASE_URL}/api/event-types`);
  if (!res.ok) throw new Error("Failed to fetch event types");
  return res.json();
};

// ===== AVAILABILITY =====
export const getAvailability = async () => {
  const res = await fetch(`${BASE_URL}/api/availability`);
  if (!res.ok) throw new Error("Failed to fetch availability");
  return res.json();
};

export const updateAvailability = async (data) => {
  const res = await fetch(`${BASE_URL}/api/availability`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update availability");
  return res.json();
};

// ===== MEETINGS =====
export const getMeetings = async () => {
  const res = await fetch(`${BASE_URL}/api/meetings`);
  if (!res.ok) throw new Error("Failed to fetch meetings");
  return res.json();
};

// ===== BOOKING =====
export const createBooking = async (data) => {
  const res = await fetch(`${BASE_URL}/api/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json();
};
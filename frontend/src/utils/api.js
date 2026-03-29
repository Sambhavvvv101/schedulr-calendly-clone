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
  if (!res.ok) throw new Error("Failed to update availability");
  return res.json();
};

// ===== GET SLOTS =====
export const getSlots = async (date) => {
  const res = await fetch(`${BASE_URL}/slots?date=${date}`);
  if (!res.ok) throw new Error("Failed to fetch slots");
  return res.json();
};

// ===== CONFIRM BOOKING =====
export const confirmBooking = async (data) => {
  const res = await fetch(`${BASE_URL}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to confirm booking");
  return res.json();
};

// ===== CREATE EVENT TYPE =====
export const createEventType = async (data) => {
  const res = await fetch(`${BASE_URL}/event-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create event type");
  return res.json();
};

// ===== UPDATE EVENT TYPE =====
export const updateEventType = async (id, data) => {
  const res = await fetch(`${BASE_URL}/event-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update event type");
  return res.json();
};

// ===== DELETE EVENT TYPE =====
export const deleteEventType = async (id) => {
  const res = await fetch(`${BASE_URL}/event-types/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete event type");
  return res.json();
};
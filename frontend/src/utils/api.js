const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── Event Types ──────────────────────────────────────────
export const getEventTypes    = ()           => request('/event-types');
export const getEventBySlug   = (slug)       => request(`/event-types/slug/${slug}`);
export const createEventType  = (body)       => request('/event-types', { method: 'POST', body: JSON.stringify(body) });
export const updateEventType  = (id, body)   => request(`/event-types/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteEventType  = (id)         => request(`/event-types/${id}`, { method: 'DELETE' });

// ── Availability ─────────────────────────────────────────
export const getAvailability    = ()         => request('/availability');
export const updateAvailability = (body)     => request('/availability', { method: 'PUT', body: JSON.stringify(body) });

// ── Meetings ─────────────────────────────────────────────
export const getMeetings  = (status)         => request(`/meetings${status ? `?status=${status}` : ''}`);
export const cancelMeeting = (id, body = {}) => request(`/meetings/${id}/cancel`, { method: 'PATCH', body: JSON.stringify(body) });

// ── Public Booking ────────────────────────────────────────
export const getSlots      = (slug, date)    => request(`/book/${slug}/slots?date=${date}`);
export const confirmBooking = (slug, body)   => request(`/book/${slug}`, { method: 'POST', body: JSON.stringify(body) });

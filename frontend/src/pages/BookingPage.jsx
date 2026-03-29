import { useEffect, useState } from 'react';
import { getAvailability, getSlots, confirmBooking } from '../utils/api';
import { Icon } from '../components/Icons';
import Calendar from '../components/Calendar';
import { fmtTime, fmtDate, toYMD } from '../utils/dateUtils';

export default function BookingPage({ eventType, onBack }) {
  const [step,         setStep]         = useState(1); // 1=pick date/time, 2=fill form, 3=confirmed
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots,        setSlots]        = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form,         setForm]         = useState({ name: '', email: '' });
  const [booking,      setBooking]      = useState(null);
  const [submitting,   setSubmitting]   = useState(false);

  // Load availability once
  useEffect(() => { getAvailability().then(setAvailability); }, []);

  // Load time slots whenever date changes
  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    getSlots(eventType.slug, toYMD(selectedDate))
      .then(setSlots)
      .finally(() => setSlotsLoading(false));
  }, [selectedDate]);

  const handleDateSelect = (d) => {
    setSelectedDate(d);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!form.name || !form.email) return;
    setSubmitting(true);
    try {
      const result = await confirmBooking(eventType.slug, {
        invitee_name:  form.name,
        invitee_email: form.email,
        start_time:    selectedSlot.start,
      });
      setBooking(result);
      setStep(3);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step 3: Confirmation ──────────────────────────────────
  if (step === 3) return (
    <div className="public-page">
      <PublicHeader onBack={onBack} />
      <div className="public-content">
        <div className="booking-form-wrap" style={{ textAlign: 'center' }}>
          <div className="success-icon">
            <Icon name="check" size={36} style={{ color: 'var(--green)' }} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>You're scheduled!</h2>
          <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 24 }}>
            A calendar invite has been sent to <strong>{form.email}</strong>
          </p>

          <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: 20, textAlign: 'left', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{eventType.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--gray-600)' }}>
                <Icon name="calendar" size={16} /> {fmtDate(booking.start_time)}
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--gray-600)' }}>
                <Icon name="clock" size={16} /> {fmtTime(booking.start_time)} – {fmtTime(booking.end_time)}
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--gray-600)' }}>
                <Icon name="user" size={16} /> {form.name}
              </div>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onBack}>
            Back to Event Types
          </button>
        </div>
      </div>
    </div>
  );

  // ── Step 2: Booking Form ──────────────────────────────────
  if (step === 2) return (
    <div className="public-page">
      <PublicHeader onBack={onBack} />
      <div className="public-content">
        <div className="booking-form-wrap">
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setStep(1)}>
            <Icon name="chevLeft" size={14} /> Back
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{eventType.name}</h2>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--gray-500)' }}>
              <Icon name="calendar" size={14} /> {fmtDate(selectedSlot.start)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--gray-500)' }}>
              <Icon name="clock" size={14} /> {fmtTime(selectedSlot.start)} · {eventType.duration} min
            </span>
          </div>

          <div className="divider" />

          <div className="form-group">
            <label className="form-label">Your Name <span className="required">*</span></label>
            <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter your full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address <span className="required">*</span></label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: 12 }}
            onClick={handleConfirm}
            disabled={!form.name || !form.email || submitting}
          >
            {submitting ? 'Confirming…' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── Step 1: Calendar + Slots ──────────────────────────────
  return (
    <div className="public-page">
      <PublicHeader onBack={onBack} />
      <div className="public-content" style={{ alignItems: 'flex-start' }}>
        <div className="booking-layout" style={{ width: '100%', maxWidth: 900 }}>
          {/* Left: event info */}
          <div className="booking-info">
            <div className="booking-host">
              <div className="avatar" style={{ width: 48, height: 48, fontSize: 16 }}>SB</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Sambhav</div>
                <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>@Sambhav</div>
              </div>
            </div>
            <div className="booking-event-name">{eventType.name}</div>
            <div className="booking-meta">
              <div className="booking-meta-item"><Icon name="clock" size={16} /> {eventType.duration} minutes</div>
              <div className="booking-meta-item"><Icon name="video" size={16} /> Google Meet</div>
              <div className="booking-meta-item"><Icon name="globe" size={16} /> Asia/Kolkata</div>
            </div>
            {eventType.description && (
              <p style={{ marginTop: 16, fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 }}>
                {eventType.description}
              </p>
            )}
          </div>

          {/* Middle: calendar */}
          <div className="cal-section">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--gray-700)' }}>
              Select a Date &amp; Time
            </h3>
            <Calendar selectedDate={selectedDate} onSelect={handleDateSelect} availability={availability} />
          </div>

          {/* Right: time slots */}
          {selectedDate && (
            <div className="time-slots-col">
              <div className="time-slots-title">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              {slotsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                  <div className="loader" />
                </div>
              ) : slots.filter(s => s.available).length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>No slots available</p>
              ) : (
                <div className="time-slot-list">
                  {slots.map((s, i) => (
                    <div
                      key={i}
                      className={`time-slot${!s.available ? ' booked' : ''}`}
                      onClick={() => handleSlotClick(s)}
                    >
                      {fmtTime(s.start)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PublicHeader({ onBack }) {
  return (
    <div className="public-header">
      <button
        className="btn btn-ghost btn-sm"
        onClick={onBack}
        style={{ marginRight: 8 }}
      >
        <Icon name="chevLeft" size={16} /> Back
      </button>

      {/* Custom Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "14px"
          }}
        >
          SB
        </div>

        <span style={{ fontWeight: "700", fontSize: "18px" }}>
          Sambhav Scheduler
        </span>
      </div>
    </div>
  );
}
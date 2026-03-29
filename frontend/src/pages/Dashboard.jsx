import { useEffect, useState } from 'react';
import { getMeetings, getEventTypes } from '../utils/api';
import { Icon } from '../components/Icons';
import { fmtTime, fmtShortDate, MONTHS } from '../utils/dateUtils';

export default function Dashboard({ onBook }) {
  const [meetings,    setMeetings]    = useState([]);
  const [eventTypes,  setEventTypes]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getMeetings('upcoming'), getEventTypes()])
      .then(([m, e]) => { setMeetings(m); setEventTypes(e); })
      .finally(() => setLoading(false));
  }, []);

  const upcoming  = meetings.filter(m => m.status === 'upcoming').slice(0, 5);
  const totalAll  = meetings.length;

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <div>
      <div className="topbar">
        <span className="topbar-title">Dashboard</span>
        <div className="topbar-actions">
          <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
            Welcome back, <strong>Sambhav</strong>
          </span>
        </div>
      </div>

      <div className="content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Upcoming Meetings</div>
            <div className="stat-value">{upcoming.length}</div>
            <div className="stat-sub">Scheduled ahead</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Event Types</div>
            <div className="stat-value">{eventTypes.length}</div>
            <div className="stat-sub">Active templates</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value">{totalAll}</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Event Types Active</div>
            <div className="stat-value">{eventTypes.filter(e => e.is_active).length}</div>
            <div className="stat-sub">Available to book</div>
          </div>
        </div>

        {/* Two-column: upcoming meetings + event types */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Upcoming meetings */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Upcoming Meetings</h3>
            </div>
            <div style={{ padding: '8px 0' }}>
              {upcoming.length === 0
                ? <p style={{ padding: '16px 24px', fontSize: 14, color: 'var(--gray-400)' }}>No upcoming meetings</p>
                : upcoming.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="calendar" size={18} style={{ color: 'var(--blue)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.event_name} · {m.invitee_name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                        {fmtShortDate(m.start_time)} · {fmtTime(m.start_time)}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Event types */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Your Event Types</h3>
            </div>
            <div style={{ padding: '8px 0' }}>
              {eventTypes.slice(0, 5).map(et => (
                <div
                  key={et.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer' }}
                  onClick={() => onBook(et)}
                >
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: et.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>{et.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{et.duration} min</div>
                  </div>
                  <Icon name="chevRight" size={14} style={{ color: 'var(--gray-400)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getAvailability, updateAvailability } from '../utilshttps://schedulr-backend-e8nt.onrender.com';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/Icons';

const TIMEZONES = [
  'Asia/Kolkata','America/New_York','America/Los_Angeles','America/Chicago',
  'Europe/London','Europe/Paris','Asia/Tokyo','Asia/Singapore','Australia/Sydney',
];

const DAY_LABELS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// Generate time options every 30 minutes
function getTimes() {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return times;
}
const TIMES = getTimes();

export default function AvailabilityPage() {
  const { showToast } = useApp();
  const [schedule,  setSchedule]  = useState([]);
  const [timezone,  setTimezone]  = useState('Asia/Kolkata');
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    getAvailability().then(data => {
      setSchedule(data);
      if (data[0]?.timezone) setTimezone(data[0].timezone);
    }).finally(() => setLoading(false));
  }, []);

  const toggle = (i) => setSchedule(s => s.map((d, j) => j === i ? { ...d, is_active: !d.is_active } : d));
  const setTime = (i, key, val) => setSchedule(s => s.map((d, j) => j === i ? { ...d, [key]: val } : d));

  const save = async () => {
    setSaving(true);
    try {
      await updateAvailability({ schedule, timezone });
      showToast('Availability saved!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <div>
      <div className="topbar">
        <span className="topbar-title">Availability</span>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            <Icon name="check" size={16} /> {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="content">
        <div className="card" style={{ maxWidth: 720 }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Weekly Hours</h3>
              <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Set your recurring weekly availability</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="globe" size={16} style={{ color: 'var(--gray-400)' }} />
              <select className="time-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>

          <div className="card-body">
            {schedule.map((day, i) => (
              <div className="avail-row" key={day.day_of_week}>
                {/* Toggle */}
                <label className="toggle-wrap">
                  <input type="checkbox" checked={!!day.is_active} onChange={() => toggle(i)} />
                  <div className="toggle-track" />
                  <div className="toggle-thumb" />
                </label>

                {/* Day label */}
                <span className="avail-day" style={{ color: day.is_active ? 'var(--gray-900)' : 'var(--gray-400)' }}>
                  {DAY_LABELS[day.day_of_week]}
                </span>

                {/* Time pickers */}
                {day.is_active ? (
                  <div className="time-range">
                    <select className="time-select" value={day.start_time} onChange={e => setTime(i, 'start_time', e.target.value)}>
                      {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span style={{ color: 'var(--gray-400)', fontSize: 13 }}>–</span>
                    <select className="time-select" value={day.end_time} onChange={e => setTime(i, 'end_time', e.target.value)}>
                      {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ) : (
                  <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>Unavailable</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

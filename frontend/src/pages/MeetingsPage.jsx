import { useEffect, useState } from 'react';
import { getMeetings, cancelMeeting } from '../utilshttps://schedulr-backend-e8nt.onrender.com';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/Icons';
import ConfirmModal from '../components/ConfirmModal';
import { fmtTime, MONTHS } from '../utils/dateUtils';

const TABS = ['upcoming', 'past', 'cancelled'];

export default function MeetingsPage() {
  const { showToast } = useApp();
  const [tab,         setTab]         = useState('upcoming');
  const [meetings,    setMeetings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);

  const load = (status) => {
    setLoading(true);
    getMeetings(status).then(setMeetings).finally(() => setLoading(false));
  };

  useEffect(() => { load(tab); }, [tab]);

  const handleCancel = async () => {
    try {
      await cancelMeeting(cancelTarget.id);
      showToast('Meeting cancelled', 'error');
      setCancelTarget(null);
      load(tab);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div className="topbar"><span className="topbar-title">Meetings</span></div>

      <div className="content">
        {/* Tabs */}
        <div className="meetings-tabs">
          {TABS.map(t => (
            <div key={t} className={`meetings-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : meetings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="meetings" size={28} /></div>
            <div className="empty-title">No {tab} meetings</div>
            <div className="empty-desc">
              {tab === 'upcoming' ? 'Your upcoming meetings will appear here.'
                : tab === 'past'  ? 'Completed meetings will show here.'
                : 'No cancelled meetings.'}
            </div>
          </div>
        ) : (
          <div className="meeting-list">
            {meetings.map(m => (
              <div key={m.id} className={`meeting-card${m.status === 'cancelled' ? ' cancelled' : ''}`}>
                {/* Date block */}
                <div className="meeting-date-block">
                  <div className="meeting-date-day">{new Date(m.start_time).getDate()}</div>
                  <div className="meeting-date-mon">{MONTHS[new Date(m.start_time).getMonth()].slice(0, 3)}</div>
                </div>

                {/* Info */}
                <div className="meeting-info">
                  <div className="meeting-title">{m.event_name} with {m.invitee_name}</div>
                  <div className="meeting-meta">
                    <div className="meeting-meta-item">
                      <Icon name="clock" size={13} /> {fmtTime(m.start_time)} – {fmtTime(m.end_time)}
                    </div>
                    <div className="meeting-meta-item">
                      <Icon name="mail" size={13} /> {m.invitee_email}
                    </div>
                  </div>
                </div>

                {/* Status + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span className={`status-badge status-${m.status}`}>{m.status}</span>
                  {m.status === 'upcoming' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--red)', borderColor: 'var(--red-light)' }}
                      onClick={() => setCancelTarget(m)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cancelTarget && (
        <ConfirmModal
          title="Cancel Meeting"
          message={<>Cancel <strong>{cancelTarget.event_name}</strong> with <strong>{cancelTarget.invitee_name}</strong>? This cannot be undone.</>}
          confirmLabel="Cancel Meeting"
          danger
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getEventTypes, createEventType, updateEventType, deleteEventType } from '../utilshttps://schedulr-backend-e8nt.onrender.com';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/Icons';
import EventTypeModal from '../components/EventTypeModal';
import ConfirmModal from '../components/ConfirmModal';

export default function EventTypesPage({ onBook }) {
  const { showToast } = useApp();
  const [eventTypes, setEventTypes] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null); // null | 'new' | eventType object
  const [delTarget,  setDelTarget]  = useState(null);

  const load = () => getEventTypes().then(setEventTypes).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    try {
      if (modal === 'new') {
        await createEventType(form);
        showToast('Event type created!');
      } else {
        await updateEventType(modal.id, { ...modal, ...form });
        showToast('Event type updated!');
      }
      setModal(null);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEventType(delTarget.id);
      showToast('Event type deleted', 'error');
      setDelTarget(null);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`schedulr.app/${slug}`);
    showToast('Link copied!');
  };

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <div>
      <div className="topbar">
        <span className="topbar-title">Event Types</span>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => setModal('new')}>
            <Icon name="plus" size={16} /> New Event Type
          </button>
        </div>
      </div>

      <div className="content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value">{eventTypes.length}</div>
            <div className="stat-sub">Event types</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active</div>
            <div className="stat-value">{eventTypes.filter(e => e.is_active).length}</div>
            <div className="stat-sub">Available to book</div>
          </div>
        </div>

        {eventTypes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="calendar" size={28} /></div>
            <div className="empty-title">No event types yet</div>
            <div className="empty-desc">Create your first event type to start accepting bookings.</div>
            <button className="btn btn-primary" onClick={() => setModal('new')}>
              <Icon name="plus" size={16} /> New Event Type
            </button>
          </div>
        ) : (
          <div className="event-grid">
            {eventTypes.map(et => (
              <div key={et.id} className="event-card">
                <div className="event-card-accent" style={{ background: et.color }} />
                <div className="event-card-body">
                  <div className="event-card-name">{et.name}</div>
                  <div className="event-card-dur">
                    <Icon name="clock" size={14} /> {et.duration} min
                  </div>
                  <div className="event-card-link">
                    <Icon name="link" size={13} />
                    <span>schedulr.app/{et.slug}</span>
                    <button
                      className="btn btn-icon"
                      style={{ padding: 4, marginLeft: 'auto' }}
                      onClick={() => copyLink(et.slug)}
                    >
                      <Icon name="copy" size={13} />
                    </button>
                  </div>
                </div>
                <div className="event-card-footer">
                  <span className={`badge ${et.is_active ? 'badge-active' : 'badge-inactive'}`}>
                    {et.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="event-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => onBook(et)}>
                      <Icon name="link" size={13} /> View
                    </button>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setModal(et)}>
                      <Icon name="edit" size={15} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm btn-icon"
                      style={{ color: 'var(--red)' }}
                      onClick={() => setDelTarget(et)}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <EventTypeModal
          eventType={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {delTarget && (
        <ConfirmModal
          title="Delete Event Type"
          message={<>Are you sure you want to delete <strong>{delTarget.name}</strong>? This action cannot be undone.</>}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onClose={() => setDelTarget(null)}
        />
      )}
    </div>
  );
}

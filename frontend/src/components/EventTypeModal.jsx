import { useState } from 'react';
import { Icon } from './Icons';

const COLORS = ['#0069ff','#7c3aed','#00a96e','#f59e0b','#ef4444','#ec4899','#06b6d4','#84cc16'];
const DURATIONS = [15, 20, 30, 45, 60, 90, 120];

export default function EventTypeModal({ eventType, onSave, onClose }) {
  const [form, setForm] = useState(
    eventType || { name: '', duration: 30, slug: '', description: '', color: '#0069ff' }
  );

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  // Auto-generate slug from name when creating new
  const handleName = (v) => {
    set('name')(v);
    if (!eventType) {
      set('slug')(v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.slug.trim()) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{eventType ? 'Edit Event Type' : 'New Event Type'}</h3>
          <button className="modal-close" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Event Name <span className="required">*</span></label>
            <input className="form-input" value={form.name} onChange={e => handleName(e.target.value)} placeholder="e.g. 30 Min Meeting" />
          </div>

          <div className="form-group">
            <label className="form-label">Duration</label>
            <select className="form-input form-select" value={form.duration} onChange={e => set('duration')(+e.target.value)}>
              {DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug <span className="required">*</span></label>
            <div style={{ display: 'flex', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <span style={{ padding: '10px 12px', background: 'var(--gray-50)', color: 'var(--gray-400)', fontSize: 13, borderRight: '1px solid var(--gray-200)', whiteSpace: 'nowrap' }}>
                schedulr.app/
              </span>
              <input
                className="form-input"
                style={{ border: 'none', borderRadius: 0 }}
                value={form.slug}
                onChange={e => set('slug')(e.target.value)}
                placeholder="your-meeting-slug"
              />
            </div>
            <div className="form-hint">Used in your public booking link</div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} value={form.description} onChange={e => set('description')(e.target.value)} placeholder="What is this event about?" />
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-options">
              {COLORS.map(c => (
                <div
                  key={c}
                  className={`color-opt${form.color === c ? ' selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => set('color')(c)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!form.name || !form.slug}>
            {eventType ? 'Save Changes' : 'Create Event Type'}
          </button>
        </div>
      </div>
    </div>
  );
}

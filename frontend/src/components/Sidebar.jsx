import { Icon } from './Icons';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: 'home' },
  { id: 'events',       label: 'Event Types',  icon: 'calendar' },
  { id: 'availability', label: 'Availability', icon: 'avail' },
  { id: 'meetings',     label: 'Meetings',     icon: 'meetings' },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      
      {/* 🔥 NEW CUSTOM LOGO (NO OLD CLASSES USED) */}
      <div className="sidebar-logo">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          
          {/* Logo Box */}
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "10px",
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

          {/* Name */}
          <span style={{ fontWeight: "700", fontSize: "18px" }}>
            Sambhav
          </span>

        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        <div className="nav-label">Navigation</div>
        {NAV.map(n => (
          <div
            key={n.id}
            className={`nav-item${page === n.id ? ' active' : ''}`}
            onClick={() => setPage(n.id)}
          >
            <Icon name={n.icon} size={18} />
            {n.label}
          </div>
        ))}
      </nav>

      {/* USER CARD */}
      <div className="sidebar-footer">
        <div className="user-card">
          <img 
            src="https://ui-avatars.comhttps://schedulr-backend-e8nt.onrender.com/?name=SB&background=6366f1&color=fff" 
            alt="avatar"
            className="avatar"
          />
          <div>
            <div className="user-name">Sambhav</div>
            <div className="user-handle">@sambhav</div>
          </div>
        </div>
      </div>

    </aside>
  );
}
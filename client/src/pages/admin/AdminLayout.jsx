import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const navItems = [
  { to: '/admin/dashboard', icon: '🏠', label: 'לוח בקרה' },
  { to: '/admin/posts', icon: '📝', label: 'ניהול פוסטים' },
  { to: '/admin/new-post', icon: '➕', label: 'פוסט חדש' },
  { to: '/admin/images', icon: '🖼️', label: 'ניהול תמונות' },
  { to: '/admin/registrations', icon: '📋', label: 'רישומים' },
  { to: '/admin/slider', icon: '🖼️', label: 'סלאידר תמונות' },
  { to: '/admin/inbox', icon: '📬', label: 'הודעות צור קשר' },
  { to: '/admin/settings', icon: '⚙️', label: 'הגדרות אתר' },
];

export default function AdminLayout({ children }) {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">ב"ש</div>
          <span>פאנל ניהול</span>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <span className="admin-avatar">👤</span>
            <span>{username}</span>
          </div>
          <button className="btn btn-sm btn-danger" onClick={handleLogout}>התנתק</button>
          <Link to="/" target="_blank" className="btn btn-sm btn-ghost" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
            🌐 צפה באתר
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}

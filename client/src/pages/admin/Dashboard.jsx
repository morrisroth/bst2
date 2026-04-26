import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';

export default function Dashboard() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/posts/admin/all', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setPosts(r.data));
  }, [token]);

  const published = posts.filter(p => p.published === 1).length;
  const featured = posts.filter(p => p.featured === 1).length;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>🏠 לוח בקרה</h1>
        <Link to="/admin/new-post" className="btn btn-primary">+ פוסט חדש</Link>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-num">{posts.length}</div>
          <div className="stat-card-label">סה"כ פוסטים</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-num">{published}</div>
          <div className="stat-card-label">פוסטים מפורסמים</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-num">{featured}</div>
          <div className="stat-card-label">פוסטים מומלצים</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-num">{posts.length - published}</div>
          <div className="stat-card-label">טיוטות</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 16 }}>פוסטים אחרונים</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>כותרת</th>
                <th>קטגוריה</th>
                <th>תאריך</th>
                <th>סטטוס</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {posts.slice(0, 8).map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td><span className="badge badge-gold">{p.category}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.date}</td>
                  <td>
                    <span className={`badge ${p.published ? 'badge-green' : ''}`} style={!p.published ? { background: '#fef3f2', color: '#c0392b' } : {}}>
                      {p.published ? 'מפורסם' : 'טיוטה'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/posts/${p.id}/edit`} className="btn btn-sm btn-ghost">עריכה</Link>
                      <Link to={`/blog/${p.id}`} target="_blank" className="btn btn-sm btn-ghost">צפה</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16 }}>
          <Link to="/admin/posts" className="btn btn-outline-dark btn-sm">לכל הפוסטים</Link>
        </div>
      </div>
    </AdminLayout>
  );
}

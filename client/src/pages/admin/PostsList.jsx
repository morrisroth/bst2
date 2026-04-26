import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';

export default function PostsList() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    axios.get('/api/posts/admin/all', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setPosts(r.data); setLoading(false); });
  };

  useEffect(load, [token]);

  const deletePost = async id => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק פוסט זה?')) return;
    await axios.delete(`/api/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const toggleFeatured = async (post) => {
    await axios.put(`/api/posts/${post.id}`, {
      ...post, featured: post.featured ? 0 : 1
    }, { headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>📝 ניהול פוסטים</h1>
        <Link to="/admin/new-post" className="btn btn-primary">+ פוסט חדש</Link>
      </div>

      {loading ? <div className="loading">טוען...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>תמונה</th>
                <th>כותרת</th>
                <th>קטגוריה</th>
                <th>תאריך</th>
                <th>מומלץ</th>
                <th>סטטוס</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image
                      ? <img src={p.image} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                      : <div style={{ width: 56, height: 40, background: 'var(--cream)', borderRadius: 6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📰</div>
                    }
                  </td>
                  <td style={{ fontWeight: 600, maxWidth: 220 }}>{p.title}</td>
                  <td><span className="badge badge-gold">{p.category}</span></td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.date}</td>
                  <td>
                    <button
                      onClick={() => toggleFeatured(p)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}
                      title={p.featured ? 'הסר מומלץ' : 'סמן כמומלץ'}
                    >{p.featured ? '⭐' : '☆'}</button>
                  </td>
                  <td>
                    <span className={`badge ${p.published ? 'badge-green' : ''}`}
                      style={!p.published ? { background: '#fef3f2', color: '#c0392b' } : {}}>
                      {p.published ? 'מפורסם' : 'טיוטה'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/posts/${p.id}/edit`} className="btn btn-sm btn-ghost">✏️ עריכה</Link>
                      <button onClick={() => deletePost(p.id)} className="btn btn-sm btn-danger">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

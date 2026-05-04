import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import './AdminUsers.css';

export default function AdminUsers() {
  const { token, username: currentUser } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ email: '', password: '' });

  const fetchUsers = () =>
    axios.get('/api/admins', { headers })
      .then(r => setUsers(r.data))
      .catch(() => setError('שגיאה בטעינה'))
      .finally(() => setLoading(false));

  useEffect(() => { fetchUsers(); }, []);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
  };

  const addUser = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/admins', form, { headers });
      setForm({ username: '', email: '', password: '' });
      await fetchUsers();
      flash('המשתמש נוסף בהצלחה');
    } catch (err) {
      flash(err.response?.data?.error || 'שגיאה בהוספה', true);
    }
    setSaving(false);
  };

  const saveEdit = async id => {
    try {
      await axios.patch(`/api/admins/${id}`, editForm, { headers });
      setEditingId(null);
      await fetchUsers();
      flash('המשתמש עודכן בהצלחה');
    } catch (err) {
      flash(err.response?.data?.error || 'שגיאה בעדכון', true);
    }
  };

  const removeUser = async id => {
    if (!confirm('האם למחוק את המשתמש?')) return;
    try {
      await axios.delete(`/api/admins/${id}`, { headers });
      await fetchUsers();
      flash('המשתמש נמחק');
    } catch (err) {
      flash(err.response?.data?.error || 'שגיאה במחיקה', true);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>👥 ניהול משתמשי מנהל</h1>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
      {success && <div className="form-success">{success}</div>}

      {loading ? <div className="loading">טוען...</div> : (
        <div className="admin-users-grid">
          {/* Existing users */}
          <div className="users-box">
            <h3>משתמשים קיימים</h3>
            <div className="users-list">
              {users.map(u => (
                <div key={u.id} className="user-row">
                  {editingId === u.id ? (
                    <div className="user-edit-form">
                      <div className="form-group">
                        <label>אימייל</label>
                        <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" dir="ltr" />
                      </div>
                      <div className="form-group">
                        <label>סיסמה חדשה (השאר ריק לאי-שינוי)</label>
                        <input type="password" value={editForm.password} onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} placeholder="לפחות 6 תווים" />
                      </div>
                      <div className="user-edit-actions">
                        <button className="btn btn-sm btn-primary" onClick={() => saveEdit(u.id)}>שמור</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>ביטול</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="user-info">
                        <span className="user-name">{u.username}</span>
                        <span className="user-email">{u.email || 'אין אימייל'}</span>
                        {u.username === currentUser && <span className="user-badge">אתה</span>}
                      </div>
                      <div className="user-actions">
                        <button className="btn btn-sm btn-ghost" onClick={() => { setEditingId(u.id); setEditForm({ email: u.email || '', password: '' }); }}>עריכה</button>
                        {u.username !== currentUser && (
                          <button className="btn btn-sm btn-danger" onClick={() => removeUser(u.id)}>מחק</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add new user */}
          <div className="users-box">
            <h3>הוסף משתמש חדש</h3>
            <form onSubmit={addUser}>
              <div className="form-group">
                <label>שם משתמש *</label>
                <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required placeholder="admin2" dir="ltr" />
              </div>
              <div className="form-group">
                <label>אימייל (לאיפוס סיסמה)</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" dir="ltr" />
              </div>
              <div className="form-group">
                <label>סיסמה *</label>
                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} placeholder="לפחות 6 תווים" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
                {saving ? 'מוסיף...' : '+ הוסף משתמש'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import './EmailSettings.css';

export default function EmailSettings() {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('/api/notify-emails', { headers })
      .then(r => setEmails(r.data))
      .catch(() => setError('שגיאה בטעינת הרשימה'))
      .finally(() => setLoading(false));
  }, []);

  const add = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!newEmail) return;
    setSaving(true);
    try {
      await axios.post('/api/notify-emails', { email: newEmail, label: newLabel }, { headers });
      const r = await axios.get('/api/notify-emails', { headers });
      setEmails(r.data);
      setNewEmail(''); setNewLabel('');
      setSuccess('האימייל נוסף בהצלחה');
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה בהוספה');
    }
    setSaving(false);
  };

  const remove = async id => {
    setError(''); setSuccess('');
    try {
      await axios.delete(`/api/notify-emails/${id}`, { headers });
      setEmails(emails.filter(e => e.id !== id));
      setSuccess('האימייל הוסר');
    } catch {
      setError('שגיאה בהסרה');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>📧 הגדרות אימייל</h1>
      </div>

      <div className="email-settings-box">
        <p className="email-settings-desc">
          כל האימיילים ברשימה יקבלו התראה בכל פנייה חדשה מצור קשר ובכל הרשמה חדשה.
        </p>

        {loading ? <div className="loading">טוען...</div> : (
          <>
            <div className="email-list">
              {emails.length === 0 && <p className="no-emails">אין כתובות אימייל ברשימה</p>}
              {emails.map(e => (
                <div key={e.id} className="email-row">
                  <div className="email-info">
                    <span className="email-address">{e.email}</span>
                    {e.label && <span className="email-label">{e.label}</span>}
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(e.id)}>הסר</button>
                </div>
              ))}
            </div>

            <form className="email-add-form" onSubmit={add}>
              <h3>הוסף כתובת אימייל</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>כתובת אימייל *</label>
                  <input
                    type="email" value={newEmail} dir="ltr"
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="example@gmail.com" required
                  />
                </div>
                <div className="form-group">
                  <label>תיאור (אופציונלי)</label>
                  <input
                    type="text" value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    placeholder="למשל: מנהל ראשי"
                  />
                </div>
              </div>
              {error && <div className="form-error">{error}</div>}
              {success && <div className="form-success">{success}</div>}
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'מוסיף...' : '+ הוסף אימייל'}
              </button>
            </form>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

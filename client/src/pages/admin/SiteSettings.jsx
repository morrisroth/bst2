import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';

export default function SiteSettings() {
  const { token } = useAuth();
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPwd, setNewPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  useEffect(() => {
    axios.get('/api/settings').then(r => setSettings(r.data));
  }, []);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    await axios.put('/api/settings', settings, { headers: { Authorization: `Bearer ${token}` } });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handle = e => setSettings(s => ({ ...s, [e.target.name]: e.target.value }));

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>⚙️ הגדרות אתר</h1>
        {saved && <span style={{ background: '#e8f5ee', color: 'var(--green-mid)', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>✅ נשמר!</span>}
      </div>

      <form onSubmit={save}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20 }}>מידע כללי</h2>
          <div className="form-group">
            <label>שם האתר</label>
            <input name="site_name" value={settings.site_name || ''} onChange={handle} />
          </div>
          <div className="form-group">
            <label>סלוגן</label>
            <input name="site_tagline" value={settings.site_tagline || ''} onChange={handle} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20 }}>דף הבית – Hero</h2>
          <div className="form-group">
            <label>כותרת ראשית</label>
            <input name="hero_title" value={settings.hero_title || ''} onChange={handle} />
          </div>
          <div className="form-group">
            <label>תת-כותרת</label>
            <input name="hero_subtitle" value={settings.hero_subtitle || ''} onChange={handle} />
          </div>
          <div className="form-group">
            <label>URL תמונת Hero</label>
            <input name="hero_image" value={settings.hero_image || ''} onChange={handle} dir="ltr" placeholder="/uploads/..." />
          </div>
          <div className="form-group">
            <label>URL תמונת אודות</label>
            <input name="about_image" value={settings.about_image || ''} onChange={handle} dir="ltr" placeholder="/uploads/..." />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'שומר...' : 'שמור הגדרות'}</button>
      </form>

      <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow-sm)', marginTop: 24 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 16 }}>🔒 שינוי סיסמה</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>שינוי סיסמת מנהל (יש לפנות למפתח)</p>
        {pwdMsg && <p style={{ color: 'var(--green-mid)', fontWeight: 600 }}>{pwdMsg}</p>}
      </div>
    </AdminLayout>
  );
}

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import './ImagesManager.css';

const SECTION_KEYS = [
  { key: 'hero_image', label: 'תמונת Hero (דף הבית)', desc: 'התמונה הראשית שמוצגת בכניסה לאתר' },
  { key: 'about_image', label: 'תמונת "אודות" (דף הבית)', desc: 'התמונה בסקציית אודות בדף הבית' },
];

const VIDEO_SECTIONS = [
  { key: 'hero_video', label: 'סרטון ראשי (דף הבית)', desc: 'סרטון שיוצג בסקציית ה-Hero בדף הבית' },
];

export default function ImagesManager() {
  const { token } = useAuth();
  const [settings, setSettings] = useState({});
  const [uploading, setUploading] = useState({});
  const [uploadingVideo, setUploadingVideo] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get('/api/settings').then(r => setSettings(r.data));
  }, []);

  const uploadFor = async (key, file) => {
    const fd = new FormData();
    fd.append('image', file);
    setUploading(u => ({ ...u, [key]: true }));
    try {
      const { data } = await axios.post('/api/upload', fd, { headers: { Authorization: `Bearer ${token}` } });
      const newSettings = { ...settings, [key]: data.url };
      setSettings(newSettings);
      await axios.put('/api/settings', newSettings, { headers: { Authorization: `Bearer ${token}` } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { alert('שגיאה בהעלאה'); }
    setUploading(u => ({ ...u, [key]: false }));
  };

  const uploadVideoFor = async (key, file) => {
    const fd = new FormData();
    fd.append('video', file);
    setUploadingVideo(u => ({ ...u, [key]: true }));
    try {
      const { data } = await axios.post('/api/upload/video', fd, { headers: { Authorization: `Bearer ${token}` } });
      const newSettings = { ...settings, [key]: data.url };
      setSettings(newSettings);
      await axios.put('/api/settings', newSettings, { headers: { Authorization: `Bearer ${token}` } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { alert('שגיאה בהעלאת הסרטון'); }
    setUploadingVideo(u => ({ ...u, [key]: false }));
  };

  const removeFor = async key => {
    const newSettings = { ...settings, [key]: '' };
    setSettings(newSettings);
    await axios.put('/api/settings', newSettings, { headers: { Authorization: `Bearer ${token}` } });
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>🖼️ ניהול תמונות</h1>
        {saved && <span className="save-badge">✅ נשמר בהצלחה!</span>}
      </div>

      <div className="images-grid">
        {SECTION_KEYS.map(({ key, label, desc }) => (
          <div className="image-section-card" key={key}>
            <div className="isc-header">
              <div>
                <h3>{label}</h3>
                <p>{desc}</p>
              </div>
            </div>
            <div className="isc-preview">
              {settings[key]
                ? <img src={settings[key]} alt={label} />
                : <div className="img-placeholder isc-placeholder"><span>🖼️</span><small>אין תמונה</small></div>
              }
            </div>
            <div className="isc-actions">
              <label className="upload-btn-label">
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => e.target.files[0] && uploadFor(key, e.target.files[0])} />
                <span className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                  {uploading[key] ? 'מעלה...' : settings[key] ? '🔄 החלף תמונה' : '📤 העלה תמונה'}
                </span>
              </label>
              {settings[key] && (
                <button className="btn btn-danger btn-sm" onClick={() => removeFor(key)}>🗑️ הסר</button>
              )}
            </div>
            {settings[key] && (
              <div style={{ marginTop: 8 }}>
                <input
                  value={settings[key]} dir="ltr"
                  onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                  onBlur={async () => {
                    await axios.put('/api/settings', settings, { headers: { Authorization: `Bearer ${token}` } });
                  }}
                  style={{ width: '100%', fontSize: 12, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'monospace' }}
                  placeholder="https://... או /uploads/..."
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Video sections */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 16 }}>🎥 ניהול סרטונים</h2>
        <div className="images-grid">
          {VIDEO_SECTIONS.map(({ key, label, desc }) => (
            <div className="image-section-card" key={key}>
              <div className="isc-header">
                <div><h3>{label}</h3><p>{desc}</p></div>
              </div>
              <div className="isc-preview">
                {settings[key]
                  ? <video src={settings[key]} controls style={{ width: '100%', borderRadius: 8, background: '#000', maxHeight: 220 }} />
                  : <div className="img-placeholder isc-placeholder"><span>🎥</span><small>אין סרטון</small></div>
                }
              </div>
              <div className="isc-actions">
                <label className="upload-btn-label">
                  <input type="file" accept="video/*" style={{ display: 'none' }}
                    onChange={e => e.target.files[0] && uploadVideoFor(key, e.target.files[0])} />
                  <span className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                    {uploadingVideo[key] ? 'מעלה סרטון...' : settings[key] ? '🔄 החלף סרטון' : '🎥 העלה סרטון'}
                  </span>
                </label>
                {settings[key] && (
                  <button className="btn btn-danger btn-sm" onClick={() => removeFor(key)}>🗑️ הסר</button>
                )}
              </div>
              {settings[key] && (
                <div style={{ marginTop: 8 }}>
                  <input value={settings[key]} dir="ltr"
                    onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                    onBlur={async () => { await axios.put('/api/settings', settings, { headers: { Authorization: `Bearer ${token}` } }); }}
                    style={{ width: '100%', fontSize: 12, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'monospace' }}
                    placeholder="/uploads/..." />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Site text settings */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow-sm)', marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20 }}>⚙️ תוכן דף הבית</h2>
        <div className="form-group">
          <label>כותרת Hero</label>
          <input value={settings.hero_title || ''} onChange={e => setSettings(s => ({ ...s, hero_title: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>תת-כותרת Hero</label>
          <input value={settings.hero_subtitle || ''} onChange={e => setSettings(s => ({ ...s, hero_subtitle: e.target.value }))} />
        </div>
        <button className="btn btn-primary" onClick={async () => {
          await axios.put('/api/settings', settings, { headers: { Authorization: `Bearer ${token}` } });
          setSaved(true); setTimeout(() => setSaved(false), 2500);
        }}>שמור הגדרות</button>
      </div>
    </AdminLayout>
  );
}

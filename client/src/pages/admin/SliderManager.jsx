import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './SliderManager.css';

export default function SliderManager() {
  const [slides, setSlides] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', caption: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState('');

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchSlides(); }, []);

  async function fetchSlides() {
    const { data } = await axios.get('/api/slider');
    setSlides(data);
  }

  function pickFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function addSlide(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('title', form.title);
      fd.append('caption', form.caption);
      const { data } = await axios.post('/api/slider', fd, { headers });
      setSlides(s => [...s, data]);
      setForm({ title: '', caption: '' });
      setFile(null);
      setPreview(null);
      flash('✅ תמונה נוספה');
    } finally { setUploading(false); }
  }

  async function deleteSlide(id) {
    if (!confirm('למחוק תמונה זו?')) return;
    await axios.delete(`/api/slider/${id}`, { headers });
    setSlides(s => s.filter(x => x.id !== id));
    flash('🗑️ נמחק');
  }

  async function saveEdit(id) {
    const { data } = await axios.patch(`/api/slider/${id}`, editing, { headers });
    setSlides(s => s.map(x => x.id === id ? data : x));
    setEditing(null);
    flash('✅ נשמר');
  }

  function flash(msg) { setSaved(msg); setTimeout(() => setSaved(''), 2500); }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>🖼️ ניהול סלאידר – לימודי תורה</h1>
        {saved && <span className="save-badge">{saved}</span>}
      </div>

      {/* Add form */}
      <div className="slider-add-card">
        <h3>הוסף תמונה חדשה</h3>
        <form onSubmit={addSlide} className="slider-add-form">
          <label className="slider-file-label">
            <input type="file" accept="image/*" onChange={pickFile} style={{ display: 'none' }} />
            <div className="slider-file-drop">
              {preview
                ? <img src={preview} alt="preview" />
                : <><span className="slider-file-icon">📷</span><span>לחץ לבחירת תמונה</span></>
              }
            </div>
          </label>
          <div className="slider-add-fields">
            <div className="form-group">
              <label>כותרת (אופציונלי)</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="הווי רוחני מעצב" />
            </div>
            <div className="form-group">
              <label>תיאור (אופציונלי)</label>
              <textarea rows={2} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="תיאור קצר של התמונה..." />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!file || uploading}>
              {uploading ? 'מעלה...' : '➕ הוסף תמונה'}
            </button>
          </div>
        </form>
      </div>

      {/* Slides grid */}
      <div className="slider-grid">
        {slides.length === 0 && <p style={{ color: 'var(--text-muted)', padding: 24 }}>אין תמונות עדיין</p>}
        {slides.map(slide => (
          <div className="slider-card" key={slide.id}>
            <div className="slider-card-img">
              <img src={slide.image} alt={slide.title} />
            </div>
            {editing?.id === slide.id ? (
              <div className="slider-card-edit">
                <input value={editing.title} onChange={e => setEditing(ed => ({ ...ed, title: e.target.value }))} placeholder="כותרת" />
                <textarea rows={2} value={editing.caption} onChange={e => setEditing(ed => ({ ...ed, caption: e.target.value }))} placeholder="תיאור" />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => saveEdit(slide.id)}>שמור</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>ביטול</button>
                </div>
              </div>
            ) : (
              <div className="slider-card-info">
                <strong>{slide.title || <em style={{ color: 'var(--text-muted)' }}>ללא כותרת</em>}</strong>
                {slide.caption && <p>{slide.caption}</p>}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing({ ...slide })}>✏️ ערוך</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteSlide(slide.id)}>🗑️ מחק</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

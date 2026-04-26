import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import './PostForm.css';

const empty = { title: '', excerpt: '', content: '', image: '', video: '', category: 'כללי', date: '', featured: false, published: true };
const CATEGORIES = ['כללי', 'אירועים', 'טיולים', 'שבתות', 'לימוד'];

export default function PostForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/posts/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => {
          const post = r.data.find(p => p.id === parseInt(id));
          if (post) setForm({ ...post, featured: !!post.featured, published: !!post.published });
        });
    }
  }, [id, isEdit, token]);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const uploadImage = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload', fd, { headers: { Authorization: `Bearer ${token}` } });
      setForm(f => ({ ...f, image: data.url }));
    } catch { setError('שגיאה בהעלאת התמונה'); }
    setUploading(false);
  };

  const removeImage = () => setForm(f => ({ ...f, image: '' }));

  const uploadVideo = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('video', file);
    setUploadingVideo(true);
    try {
      const { data } = await axios.post('/api/upload/video', fd, { headers: { Authorization: `Bearer ${token}` } });
      setForm(f => ({ ...f, video: data.url }));
    } catch { setError('שגיאה בהעלאת הסרטון'); }
    setUploadingVideo(false);
  };

  const removeVideo = () => setForm(f => ({ ...f, video: '' }));

  const submit = async e => {
    e.preventDefault();
    if (!form.title) { setError('יש למלא כותרת'); return; }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await axios.put(`/api/posts/${id}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/posts', form, { headers: { Authorization: `Bearer ${token}` } });
      }
      navigate('/admin/posts');
    } catch { setError('שגיאה בשמירה'); }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>{isEdit ? '✏️ עריכת פוסט' : '➕ פוסט חדש'}</h1>
      </div>

      <form onSubmit={submit} className="post-form">
        <div className="post-form-layout">
          <div className="post-form-main">
            <div className="form-card">
              <div className="form-group">
                <label>כותרת *</label>
                <input name="title" value={form.title} onChange={handle} required placeholder="כותרת הפוסט" />
              </div>
              <div className="form-group">
                <label>תקציר</label>
                <textarea name="excerpt" value={form.excerpt} onChange={handle} rows={2} placeholder="תיאור קצר של הפוסט (יופיע בתצוגת הכרטיסייה)" />
              </div>
              <div className="form-group">
                <label>תוכן מלא (HTML)</label>
                <textarea name="content" value={form.content} onChange={handle} rows={14} placeholder="<p>תוכן הפוסט...</p>" style={{ fontFamily: 'monospace', fontSize: 13 }} />
              </div>
            </div>
          </div>

          <div className="post-form-side">
            <div className="form-card">
              <h3>פרסום</h3>
              <div className="form-group">
                <label>קטגוריה</label>
                <select name="category" value={form.category} onChange={handle}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>תאריך</label>
                <input name="date" value={form.date} onChange={handle} placeholder='ניסן תשפ"ו' />
              </div>
              <div className="check-row">
                <label><input type="checkbox" name="published" checked={form.published} onChange={handle} /> מפורסם</label>
              </div>
              <div className="check-row">
                <label><input type="checkbox" name="featured" checked={form.featured} onChange={handle} /> מומלץ (יופיע בדף הבית)</label>
              </div>
              <div className="form-actions">
                {error && <div className="form-error">{error}</div>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
                  {saving ? 'שומר...' : isEdit ? 'שמור שינויים' : 'פרסם פוסט'}
                </button>
                <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={() => navigate('/admin/posts')}>ביטול</button>
              </div>
            </div>

            <div className="form-card">
              <h3>סרטון</h3>
              {form.video && (
                <div className="image-preview">
                  <video src={form.video} controls style={{ width: '100%', borderRadius: 6, background: '#000' }} />
                  <button type="button" className="remove-img-btn" onClick={removeVideo}>✕ הסר סרטון</button>
                </div>
              )}
              <label className="upload-label">
                <input type="file" accept="video/*" onChange={uploadVideo} style={{ display: 'none' }} />
                <span className="btn btn-ghost btn-sm" style={{ display: 'block', textAlign: 'center', cursor: 'pointer' }}>
                  {uploadingVideo ? 'מעלה סרטון...' : form.video ? '🔄 החלף סרטון' : '🎥 העלה סרטון'}
                </span>
              </label>
              {form.video && (
                <div className="form-group" style={{ marginTop: 8 }}>
                  <label style={{ fontSize: 12 }}>URL ישיר</label>
                  <input value={form.video} onChange={e => setForm(f => ({ ...f, video: e.target.value }))} style={{ fontSize: 12 }} dir="ltr" />
                </div>
              )}
            </div>

            <div className="form-card">
              <h3>תמונה ראשית</h3>
              {form.image && (
                <div className="image-preview">
                  <img src={form.image} alt="תצוגה מקדימה" />
                  <button type="button" className="remove-img-btn" onClick={removeImage}>✕ הסר תמונה</button>
                </div>
              )}
              <label className="upload-label">
                <input type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} />
                <span className="btn btn-ghost btn-sm" style={{ display: 'block', textAlign: 'center', cursor: 'pointer' }}>
                  {uploading ? 'מעלה...' : form.image ? '🔄 החלף תמונה' : '📤 העלה תמונה'}
                </span>
              </label>
              {form.image && (
                <div className="form-group" style={{ marginTop: 8 }}>
                  <label style={{ fontSize: 12 }}>URL ישיר</label>
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} style={{ fontSize: 12 }} dir="ltr" />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

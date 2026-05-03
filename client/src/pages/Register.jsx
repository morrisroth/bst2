import { useState } from 'react';
import axios from 'axios';
import './Register.css';

const INITIAL = {
  lastName: '', firstName: '', idNumber: '',
  hebrewDob: '', gregorianDob: '',
  address: '', homePhone: '', currentSchool: '',
};

export default function Register() {
  const [form, setForm] = useState(INITIAL);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('photo', photo);
      await axios.post('/api/register', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה בשליחת הטופס');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page page-content">
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><a href="/">ראשי</a> › הרשמה</div>
          <h1>טופס רישום</h1>
          <p>חדר בעל שם טוב – בית שמש רמה ד – שנת הלימודים תשפ"ז</p>
        </div>
      </div>

      <section className="register-section">
        <div className="container">
          <div className="register-box">
            {sent ? (
              <div className="success-msg">
                <div className="success-icon">✅</div>
                <h3>הטופס נשלח בהצלחה!</h3>
                <p>קיבלנו את פרטי הרישום שלך. נחזור אליך בהקדם.</p>
                <button className="btn btn-primary mt-1" onClick={() => { setSent(false); setForm(INITIAL); setPhoto(null); setPhotoPreview(null); }}>
                  שלח טופס נוסף
                </button>
              </div>
            ) : (
              <form onSubmit={submit} encType="multipart/form-data">
                <h2 className="section-title">פרטים אישיים של התלמיד</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>שם משפחה *</label>
                    <input name="lastName" value={form.lastName} onChange={handle} required placeholder="כהן" />
                  </div>
                  <div className="form-group">
                    <label>שם פרטי *</label>
                    <input name="firstName" value={form.firstName} onChange={handle} required placeholder="ישראל" />
                  </div>
                </div>

                <div className="form-group">
                  <label>תעודת זהות *</label>
                  <input name="idNumber" value={form.idNumber} onChange={handle} required placeholder="000000000" dir="ltr" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>תאריך לידה עברי *</label>
                    <input name="hebrewDob" value={form.hebrewDob} onChange={handle} required placeholder='א׳ תשרי תשפ"ז' />
                  </div>
                  <div className="form-group">
                    <label>תאריך לידה לועזי *</label>
                    <input type="date" name="gregorianDob" value={form.gregorianDob} onChange={handle} required dir="ltr" />
                  </div>
                </div>

                <div className="form-group">
                  <label>תמונת התלמיד (אופציונלי)</label>
                  <div className="photo-upload">
                    {photoPreview && <img src={photoPreview} alt="תצוגה מקדימה" className="photo-preview" />}
                    <label className="photo-label">
                      <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                      <span className="btn btn-outline">📷 {photo ? 'החלף תמונה' : 'העלה תמונה'}</span>
                    </label>
                    {photo && <span className="photo-name">{photo.name}</span>}
                  </div>
                </div>

                <h2 className="section-title" style={{ marginTop: 32 }}>פרטי התלמיד</h2>

                <div className="form-group">
                  <label>כתובת מגורים *</label>
                  <input name="address" value={form.address} onChange={handle} required placeholder="רחוב, עיר" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>מספר טלפון בבית *</label>
                    <input name="homePhone" value={form.homePhone} onChange={handle} required placeholder="02-0000000" dir="ltr" />
                  </div>
                  <div className="form-group">
                    <label>מקום לימודים נוכחי *</label>
                    <input name="currentSchool" value={form.currentSchool} onChange={handle} required placeholder="שם המוסד" />
                  </div>
                </div>

                {error && <div className="form-error">{error}</div>}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} disabled={loading}>
                  {loading ? 'שולח...' : 'שלח טופס רישום'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

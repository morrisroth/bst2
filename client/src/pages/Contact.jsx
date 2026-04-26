import { useState } from 'react';
import axios from 'axios';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/contact', form);
      setSent(true);
    } catch { setError('שגיאה בשליחה, נסה שוב'); }
    setLoading(false);
  };

  return (
    <div className="contact-page page-content">
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><a href="/">ראשי</a> › צור קשר</div>
          <h1>צור קשר</h1>
          <p>חדר בעל שם טוב – בית שמש רמה ד</p>
        </div>
      </div>

      <section className="contact-section">
        <div className="container">
          <div className="contact-layout">
            {/* Info */}
            <div className="contact-info">
              <h2 className="section-title">פרטי יצירת קשר</h2>
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">📍</div>
                  <div>
                    <h4>כתובת</h4>
                    <p>רחוב המנונא 12<br />בית שמש, רמה ד</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">💬</div>
                  <div>
                    <h4>וואטסאפ</h4>
                    <a href="https://wa.me/972522433693" style={{ color: 'var(--green-mid)' }}>052-2433693</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrapper">
              <h2 className="section-title">שלחו הודעה</h2>
              {sent ? (
                <div className="success-msg">
                  <div className="success-icon">✅</div>
                  <h3>ההודעה נשלחה בהצלחה!</h3>
                  <p>נחזור אליכם בהקדם האפשרי. תודה על פנייתכם.</p>
                  <button className="btn btn-primary mt-1" onClick={() => setSent(false)}>שלח הודעה נוספת</button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={submit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>שם מלא *</label>
                      <input name="name" value={form.name} onChange={handle} required placeholder="ישראל ישראלי" />
                    </div>
                    <div className="form-group">
                      <label>טלפון</label>
                      <input name="phone" value={form.phone} onChange={handle} placeholder="050-0000000" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>דואר אלקטרוני *</label>
                    <input type="email" name="email" value={form.email} onChange={handle} required placeholder="your@email.com" dir="ltr" />
                  </div>
                  <div className="form-group">
                    <label>נושא</label>
                    <select name="subject" value={form.subject} onChange={handle}>
                      <option value="">בחר נושא</option>
                      <option value="הצטרפות">הצטרפות לישיבה</option>
                      <option value="שיעורים">שאלה על שיעורים</option>
                      <option value="תרומה">תרומה</option>
                      <option value="אחר">אחר</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>הודעה *</label>
                    <textarea name="message" value={form.message} onChange={handle} required placeholder="כתבו את הודעתכם כאן..." rows={5} />
                  </div>
                  {error && <div className="form-error">{error}</div>}
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'שולח...' : 'שלח הודעה'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

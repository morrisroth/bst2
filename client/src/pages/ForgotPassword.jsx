import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('שגיאה בשליחה, נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-circle">🔑</div>
          <h2>שכחתי סיסמה</h2>
          <p>חדר בעל שם טוב</p>
        </div>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
            <p style={{ color: 'var(--text-light)', marginBottom: 20 }}>
              אם כתובת האימייל קיימת במערכת, נשלח אליה קישור לאיפוס הסיסמה.
            </p>
            <Link to="/admin" className="btn btn-primary" style={{ display: 'inline-block' }}>חזרה להתחברות</Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="form-group">
              <label>כתובת אימייל</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" dir="ltr" />
            </div>
            {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'שולח...' : 'שלח קישור לאיפוס'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/admin" style={{ fontSize: 13, color: 'var(--green-mid)' }}>חזרה להתחברות</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

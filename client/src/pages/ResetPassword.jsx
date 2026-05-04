import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('הסיסמאות אינן תואמות');
    if (password.length < 6) return setError('הסיסמה חייבת להכיל לפחות 6 תווים');
    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { token, password });
      setDone(true);
      setTimeout(() => navigate('/admin'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה באיפוס הסיסמה');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return (
    <div className="admin-login-page">
      <div className="login-box" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-light)', marginBottom: 16 }}>קישור לא תקף</p>
        <Link to="/admin/forgot-password" className="btn btn-primary">בקש קישור חדש</Link>
      </div>
    </div>
  );

  return (
    <div className="admin-login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-circle">🔐</div>
          <h2>איפוס סיסמה</h2>
          <p>חדר בעל שם טוב</p>
        </div>
        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ color: 'var(--text-light)' }}>הסיסמה אופסה בהצלחה! מועבר להתחברות...</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="form-group">
              <label>סיסמה חדשה</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="לפחות 6 תווים" />
            </div>
            <div className="form-group">
              <label>אישור סיסמה</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="חזור על הסיסמה" />
            </div>
            {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'מאפס...' : 'אפס סיסמה'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

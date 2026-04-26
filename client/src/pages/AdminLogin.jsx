import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { username, password });
      login(data.token, data.username);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-circle">ב"ש</div>
          <h2>כניסת מנהל</h2>
          <p>חדר בעל שם טוב</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>שם משתמש</label>
            <input value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
          </div>
          <div className="form-group">
            <label>סיסמה</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" style={{ paddingLeft: 36 }} />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#666', fontSize: 18 }} aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>
        <p className="login-hint">ברירת מחדל: admin / admin123</p>
      </div>
    </div>
  );
}

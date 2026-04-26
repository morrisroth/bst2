import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">חדר בעל שם טוב</div>
            <p>חינוך תורני חסידי לדור הבא – בית שמש רמה ד</p>
          </div>

          <div className="footer-col">
            <h5>ניווט</h5>
            <ul>
              <li><Link to="/">ראשי</Link></li>
              <li><Link to="/about">אודות החדר</Link></li>
              <li><Link to="/torah-study">לימודי תורה</Link></li>
              <li><Link to="/lectures">שיעורים</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>מידע</h5>
            <ul>
              <li><Link to="/blog">חדשות ואירועים</Link></li>
              <li><Link to="/register">הרשמה</Link></li>
              <li><Link to="/contact">צור קשר</Link></li>
              <li><Link to="/admin">כניסת מנהל</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>יצירת קשר</h5>
            <p>📍 רחוב המנונא 12</p>
            <p>בית שמש, רמה ד</p>
            <a href="https://wa.me/972522433693" style={{ color: 'inherit' }}>
              <p>💬 וואטסאפ: 052-2433693</p>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} חדר בעל שם טוב. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}

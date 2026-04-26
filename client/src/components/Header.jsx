import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const navLinks = [
  { to: '/', label: 'ראשי' },
  { to: '/torah-study', label: 'לימודי תורה' },
  { to: '/about', label: 'אודות החדר' },
  { to: '/lectures', label: 'שיעורים' },
  { to: '/blog', label: 'חדשות ואירועים' },
  { to: '/contact', label: 'צור קשר' },
  { to: '/register', label: 'הרשמה' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-main">
        <div className="container">
          <div className="header-inner">
            <Link to="/" className="logo">
              <div className="logo-circle">ב"ש</div>
              <div className="logo-text">
                <span className="logo-title">בעל שם טוב</span>
                <span className="logo-sub">חדר – בית שמש רמה ד</span>
              </div>
            </Link>

            <nav className={`main-nav ${open ? 'open' : ''}`}>
              <ul>
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) => isActive ? 'active' : ''}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <button className="menu-toggle" onClick={() => setOpen(o => !o)} aria-label="תפריט">
              <span className={`hamburger${open ? ' open' : ''}`}>
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

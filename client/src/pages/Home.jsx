import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import TypingEffect from '../components/TypingEffect';
import AnimatedCounter from '../components/AnimatedCounter';
import useScrollReveal from '../hooks/useScrollReveal';
import './Home.css';

const PHRASES = ['בחינוך לדורות', 'בתורה בשמחה', 'בדרך הבעל שם טוב', 'בבית חם לכל ילד'];

const pillars = [
  { icon: '📖', title: 'לימוד תורה', desc: 'לימוד מעמיק של תורה, גמרא ומחשבת ישראל בדרך החסידות' },
  { icon: '🕍', title: 'עבודת ה׳', desc: 'תפילה בכוונה וחיבור אמיתי לבורא עולם' },
  { icon: '🤝', title: 'חברות ואחווה', desc: 'קהילה חמה, ילדים שגדלים יחד כאחים' },
  { icon: '🌱', title: 'חינוך אישי', desc: 'ליווי אישי וקשוב לכל ילד לפי דרכו' },
];

const stats = [
  { num: 200, suffix: '+', label: 'תלמידים' },
  { num: 15, suffix: '+', label: 'שנות ניסיון' },
  { num: 98, suffix: '%', label: 'שביעות רצון הורים' },
  { num: 12, suffix: '', label: 'כיתות לימוד' },
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  const [muted, setMuted] = useState(true);
  const [popupClosed, setPopupClosed] = useState(false);
  const [loading, setLoading] = useState(true);

  const pillarsRef = useScrollReveal();
  const aboutRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const newsRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  useEffect(() => {
    Promise.all([
      axios.get('/api/posts?featured=1').then(r => setPosts(r.data.slice(0, 3))),
      axios.get('/api/settings').then(r => setSettings(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const heroStyle = settings.hero_image && !settings.hero_video
    ? { backgroundImage: `url(${settings.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero" style={heroStyle}>
        {settings.hero_video && (
          <>
            <video autoPlay muted={muted} loop playsInline className="hero-video" src={settings.hero_video} />
            <button className="hero-mute-btn" onClick={() => setMuted(m => !m)}>{muted ? '🔇' : '🔊'}</button>
          </>
        )}
        <div className="hero-gradient" />
        <div className="hero-particles">
          {[...Array(12)].map((_, i) => <div key={i} className="hero-particle" style={{ '--i': i }} />)}
        </div>
        <div className="hero-content">
          <div className="hero-badge">חדר בעל שם טוב · בית שמש רמה ד</div>
          <h1 className="hero-title">
            אנחנו מאמינים
            <br />
            <TypingEffect phrases={PHRASES} speed={75} pause={2200} />
          </h1>
          <p className="hero-sub">מוסד חינוכי חסידי מוביל ברמה ד' בית שמש · רחוב המנונא 12</p>
          <div className="hero-ctas">
            <Link to="/register" className="hero-btn hero-btn-primary">
              <span>הרשמה לשנת תשפ"ז</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/about" className="hero-btn hero-btn-outline">אודות החדר</Link>
          </div>
          <div className="hero-scroll-hint">
            <div className="hero-scroll-dot" />
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="pillars-section">
        <div className="container">
          <div className="section-header reveal-up" ref={pillarsRef}>
            <span className="section-tag">ערכי הבית</span>
            <h2 className="section-heading">ארבעת עמודי החדר</h2>
            <p className="section-desc">הערכים המרכזיים שמנחים כל צעד בחינוך ילדינו</p>
          </div>
          <div className="pillars-grid">
            {pillars.map((p, i) => (
              <div className="pillar-card reveal-up" style={{ '--delay': `${i * 0.1}s` }} key={i}>
                <div className="pillar-icon-wrap"><span className="pillar-icon">{p.icon}</span></div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="pillar-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-inner">
          <div className="container">
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div className="stat-item reveal-up" style={{ '--delay': `${i * 0.1}s` }} key={i}>
                  <div className="stat-num">
                    <AnimatedCounter target={s.num} suffix={s.suffix} />
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid reveal-up" ref={aboutRef}>
            <div className="about-image-wrap">
              {settings.about_image
                ? <img src={settings.about_image} alt="אודות החדר" className="about-img" />
                : <div className="about-img-placeholder"><span>🏛️</span></div>
              }
              <div className="about-badge-float">
                <span>חדר בעל שם טוב</span>
                <small>בית שמש רמה ד</small>
              </div>
            </div>
            <div className="about-text">
              <span className="section-tag">מי אנחנו</span>
              <h2 className="section-heading">חינוך שמגיע מהלב</h2>
              <p>חדר בעל שם טוב ממוקם בלב שכונת רמה ד' בבית שמש, ומחנך דורות של ילדים בדרך החסידות והתורה.</p>
              <p>אנו שואפים לתת לכל ילד חינוך מלא של הגוף והנשמה, בסביבה חמה, בטוחה ומלאת אהבה.</p>
              <div className="about-features">
                {['חינוך חסידי אמיתי', 'מורים מנוסים ומסורים', 'סביבה חמה ובטוחה', 'קשר אישי עם כל משפחה'].map((f, i) => (
                  <div className="about-feature" key={i}>
                    <span className="about-check">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn btn-primary mt-1">קרא עוד</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      {(loading || posts.length > 0) && (
        <section className="news-section">
          <div className="container">
            <div className="section-header reveal-up" ref={newsRef}>
              <span className="section-tag">מה חדש</span>
              <h2 className="section-heading">חדשות ואירועים</h2>
              <p className="section-desc">עדכונים אחרונים מחיי החדר</p>
            </div>
            <div className="posts-grid">
              {loading
                ? [1, 2, 3].map(i => <div key={i} className="post-skeleton" />)
                : posts.map(p => <PostCard key={p.id} post={p} />)
              }
            </div>
            {!loading && posts.length > 0 && (
              <div className="news-more">
                <Link to="/blog" className="btn btn-outline-dark">לכל החדשות ←</Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="cta-section" ref={ctaRef}>
        <div className="cta-glow" />
        <div className="container">
          <div className="cta-inner reveal-up">
            <div className="cta-icon">🎓</div>
            <h2>מעוניין לרשום את ילדכם?</h2>
            <p>הירשמו עכשיו לשנת הלימודים תשפ"ז · מקומות מוגבלים</p>
            <div className="cta-actions">
              <Link to="/register" className="hero-btn hero-btn-primary">להרשמה מיידית</Link>
              <Link to="/contact" className="hero-btn hero-btn-outline">צרו קשר</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── REGISTER POPUP ── */}
      {!popupClosed && (
        <div className="register-popup">
          <button className="register-popup-close" onClick={() => setPopupClosed(true)}>✕</button>
          <div className="register-popup-icon">🎓</div>
          <h4>הרשמה לשנת תשפ"ז</h4>
          <p>מקומות מוגבלים – הירשם עכשיו!</p>
          <Link to="/register" className="btn btn-primary btn-sm" style={{ width: '100%', textAlign: 'center' }}>
            להרשמה &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

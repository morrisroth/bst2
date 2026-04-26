import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BannerSlider from '../components/BannerSlider';
import './TorahStudy.css';

export default function TorahStudy() {
  const [slides, setSlides] = useState([]);
  useEffect(() => { axios.get('/api/slider').then(r => setSlides(r.data)); }, []);

  return (
    <div className="torah-page page-content">
      {/* Banner Slider */}
      {slides.length > 0
        ? <BannerSlider slides={slides} />
        : (
          <div className="page-hero">
            <div className="container">
              <div className="breadcrumb"><a href="/">ראשי</a> › לימודי תורה</div>
              <h1>לימודי תורה</h1>
              <p>תכנית הלימודים בחדר בעל שם טוב</p>
            </div>
          </div>
        )
      }

      {/* Intro */}
      <section className="torah-intro">
        <div className="container">
          <div className="intro-box">
            <p>בחדר בעל שם טוב, הלימוד אינו רק חובה – הוא אורח חיים. אנו מאמינים שתורה לשמה היא המפתח לחיים מלאי משמעות, ולכן משקיעים את כל מרצנו בהעמקת הלימוד ובחיבור כל ילד לתורת ישראל.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--cream)', padding: '64px 0' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--green-dark)', marginBottom: 12 }}>רוצה להצטרף לחדר?</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>צור קשר ונשמח לשוחח איתך</p>
          <Link to="/contact" className="btn btn-primary">צור קשר</Link>
        </div>
      </section>
    </div>
  );
}

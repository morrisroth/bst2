import './About.css';

const values = [
  { icon: '📚', title: 'מצוינות תורנית', desc: 'שאיפה לרמה הגבוהה ביותר בלימוד התורה' },
  { icon: '❤️', title: 'אהבת הזולת', desc: 'כיבוד כל אדם כצלם אלוהים' },
  { icon: '🏠', title: 'בית חם', desc: 'יצירת סביבה חמה ובטוחה לכל ילד' },
  { icon: '🤲', title: 'ענווה', desc: 'חינוך לדרך ארץ ולמידות טובות' },
];

export default function About() {
  return (
    <div className="about-page page-content">
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><a href="/">ראשי</a> › אודות</div>
          <h1>אודות חדר בעל שם טוב</h1>
          <p>הכירו את החדר והערכים המנחים אותנו</p>
        </div>
      </div>

      {/* About */}
      <section className="about-history">
        <div className="container">
          <div className="history-inner">
            <div className="history-text">
              <h2 className="section-title">החדר שלנו</h2>
              <p>חדר בעל שם טוב ממוקם בבית שמש, רמה ד, רחוב המנונא 12.</p>
              <p>אנו מחנכים ילדים בדרך החסידות והתורה, תוך מתן תשומת לב אישית לכל תלמיד.</p>
              <p>החדר שם דגש על חינוך מלא – לימוד תורה, מידות טובות ואהבת ישראל.</p>
            </div>
            <div className="history-image img-placeholder" style={{ height: 320, borderRadius: 'var(--radius)', fontSize: 60 }}>
              <span>🏛️</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <h2 className="section-title centered">הערכים שלנו</h2>
          <p className="section-subtitle centered">הנחות היסוד שמנחות את החינוך בחדר</p>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card" key={i}>
                <div className="value-icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

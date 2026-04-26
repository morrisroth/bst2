import './Lectures.css';

export default function Lectures() {
  return (
    <div className="lectures-page page-content">
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><a href="/">ראשי</a> › שיעורים</div>
          <h1>שיעורים וחוגים</h1>
          <p>לוח שיעורים – חדר בעל שם טוב</p>
        </div>
      </div>

      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 className="section-title">לוח שיעורים</h2>
          <p className="section-subtitle">רחוב המנונא 12, בית שמש רמה ד</p>

          <div className="lectures-note" style={{ marginTop: 40 }}>
            <p>✅ לוח השיעורים יעודכן בקרוב</p>
            <p>📞 לפרטים נוספים צרו קשר עמנו</p>
          </div>
        </div>
      </section>
    </div>
  );
}

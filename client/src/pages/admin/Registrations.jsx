import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './Registrations.css';

const STATUS_LABEL = { pending: 'ממתין', accepted: 'התקבל', rejected: 'נדחה' };
const STATUS_CLASS = { pending: 'badge-pending', accepted: 'badge-accepted', rejected: 'badge-rejected' };

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Registrations() {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchRegs(); }, []);

  async function fetchRegs() {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/register', { headers });
      setRegs(data.reverse());
    } finally {
      setLoading(false);
    }
  }

  function openDetail(reg) {
    setSelected(reg);
    setNotes(reg.notes || '');
  }

  function closeDetail() { setSelected(null); }

  async function updateStatus(id, status) {
    setSaving(true);
    try {
      const { data } = await axios.patch(`/api/register/${id}`, { status }, { headers });
      setRegs(r => r.map(x => x.id === id ? data : x));
      if (selected?.id === id) setSelected(data);
    } finally {
      setSaving(false);
    }
  }

  async function saveNotes(id) {
    setSaving(true);
    try {
      const { data } = await axios.patch(`/api/register/${id}`, { notes }, { headers });
      setRegs(r => r.map(x => x.id === id ? data : x));
      if (selected?.id === id) setSelected(data);
    } finally {
      setSaving(false);
    }
  }

  async function deleteReg(id) {
    if (!confirm('האם למחוק רישום זה?')) return;
    await axios.delete(`/api/register/${id}`, { headers });
    setRegs(r => r.filter(x => x.id !== id));
    if (selected?.id === id) closeDetail();
  }

  const counts = {
    all: regs.length,
    pending: regs.filter(r => r.status === 'pending').length,
    accepted: regs.filter(r => r.status === 'accepted').length,
    rejected: regs.filter(r => r.status === 'rejected').length,
  };

  const filtered = filter === 'all' ? regs : regs.filter(r => r.status === filter);

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>ניהול רישומים</h1>
        <button className="btn btn-sm btn-ghost" onClick={fetchRegs}>↻ רענן</button>
      </div>

      {/* Stats */}
      <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        <div className="stat-card" onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-num">{counts.all}</div>
          <div className="stat-card-label">סה"כ רישומים</div>
        </div>
        <div className="stat-card" onClick={() => setFilter('pending')} style={{ cursor: 'pointer', borderRightColor: '#f59e0b' }}>
          <div className="stat-card-num" style={{ color: '#f59e0b' }}>{counts.pending}</div>
          <div className="stat-card-label">ממתינים לאישור</div>
        </div>
        <div className="stat-card" onClick={() => setFilter('accepted')} style={{ cursor: 'pointer', borderRightColor: '#10b981' }}>
          <div className="stat-card-num" style={{ color: '#10b981' }}>{counts.accepted}</div>
          <div className="stat-card-label">התקבלו</div>
        </div>
        <div className="stat-card" onClick={() => setFilter('rejected')} style={{ cursor: 'pointer', borderRightColor: '#ef4444' }}>
          <div className="stat-card-num" style={{ color: '#ef4444' }}>{counts.rejected}</div>
          <div className="stat-card-label">נדחו</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="reg-tabs">
        {['all', 'pending', 'accepted', 'rejected'].map(f => (
          <button key={f} className={`reg-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'הכל' : STATUS_LABEL[f]}
            <span className="reg-tab-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="reg-empty">טוען...</div>
        ) : filtered.length === 0 ? (
          <div className="reg-empty">אין רישומים להצגה</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>תמונה</th>
                <th>שם מלא</th>
                <th>ת.ז.</th>
                <th>תאריך לידה</th>
                <th>טלפון</th>
                <th>תאריך הגשה</th>
                <th>סטטוס</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(reg => (
                <tr key={reg.id} className="reg-row" onClick={() => openDetail(reg)}>
                  <td>
                    {reg.photo
                      ? <img src={reg.photo} alt="" className="reg-thumb" />
                      : <div className="reg-thumb-placeholder">👤</div>}
                  </td>
                  <td><strong>{reg.lastName} {reg.firstName}</strong></td>
                  <td dir="ltr">{reg.idNumber}</td>
                  <td>{reg.gregorianDob}</td>
                  <td dir="ltr">{reg.homePhone}</td>
                  <td>{formatDate(reg.submittedAt)}</td>
                  <td><span className={`badge ${STATUS_CLASS[reg.status]}`}>{STATUS_LABEL[reg.status]}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="table-actions">
                      <button className="btn btn-sm btn-success" disabled={saving} onClick={() => updateStatus(reg.id, 'accepted')}>✓</button>
                      <button className="btn btn-sm btn-danger" disabled={saving} onClick={() => updateStatus(reg.id, 'rejected')}>✗</button>
                      <button className="btn btn-sm btn-ghost" onClick={() => openDetail(reg)}>פרטים</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="reg-overlay" onClick={closeDetail}>
          <div className="reg-drawer" onClick={e => e.stopPropagation()}>
            <div className="reg-drawer-header">
              <h2>פרטי רישום</h2>
              <button className="reg-close" onClick={closeDetail}>✕</button>
            </div>

            <div className="reg-drawer-body">
              <div className="reg-profile">
                {selected.photo
                  ? <img src={selected.photo} alt="" className="reg-photo" />
                  : <div className="reg-photo-placeholder">👤</div>}
                <div>
                  <h3>{selected.lastName} {selected.firstName}</h3>
                  <span className={`badge ${STATUS_CLASS[selected.status]}`}>{STATUS_LABEL[selected.status]}</span>
                </div>
              </div>

              <div className="reg-fields">
                <div className="reg-field"><label>תעודת זהות</label><span dir="ltr">{selected.idNumber}</span></div>
                <div className="reg-field"><label>תאריך לידה עברי</label><span>{selected.hebrewDob}</span></div>
                <div className="reg-field"><label>תאריך לידה לועזי</label><span dir="ltr">{selected.gregorianDob}</span></div>
                <div className="reg-field"><label>כתובת</label><span>{selected.address}</span></div>
                <div className="reg-field"><label>טלפון בבית</label><span dir="ltr">{selected.homePhone}</span></div>
                <div className="reg-field"><label>מוסד לימודים נוכחי</label><span>{selected.currentSchool}</span></div>
                <div className="reg-field"><label>תאריך הגשה</label><span>{formatDate(selected.submittedAt)}</span></div>
              </div>


              {/* Status buttons */}
              <div className="reg-status-actions">
                <span style={{ fontWeight: 700, fontSize: 14 }}>שינוי סטטוס:</span>
                <button className={`btn btn-sm ${selected.status === 'accepted' ? 'btn-success' : 'btn-ghost'}`} disabled={saving} onClick={() => updateStatus(selected.id, 'accepted')}>✓ התקבל</button>
                <button className={`btn btn-sm ${selected.status === 'pending' ? 'btn-warning' : 'btn-ghost'}`} disabled={saving} onClick={() => updateStatus(selected.id, 'pending')}>⏳ ממתין</button>
                <button className={`btn btn-sm ${selected.status === 'rejected' ? 'btn-danger' : 'btn-ghost'}`} disabled={saving} onClick={() => updateStatus(selected.id, 'rejected')}>✗ נדחה</button>
              </div>

              {/* Notes */}
              <div className="reg-notes-section">
                <label className="reg-notes-label">הערות מנהל</label>
                <textarea className="reg-notes-input" rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="הוסף הערות על המועמד..." />
                <button className="btn btn-primary btn-sm" disabled={saving} onClick={() => saveNotes(selected.id)}>
                  {saving ? 'שומר...' : 'שמור הערות'}
                </button>
              </div>

              <div className="reg-drawer-footer">
                <button className="btn btn-sm btn-danger" onClick={() => deleteReg(selected.id)}>🗑️ מחק רישום</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

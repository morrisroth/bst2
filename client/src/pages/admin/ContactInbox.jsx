import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './ContactInbox.css';

function fmt(iso) {
  return new Date(iso).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ContactInbox() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const { data } = await axios.get('/api/contact', { headers });
    setContacts(data);
  }

  async function open(c) {
    setSelected(c);
    if (!c.read) {
      await axios.patch(`/api/contact/${c.id}`, { read: true }, { headers });
      setContacts(cs => cs.map(x => x.id === c.id ? { ...x, read: true } : x));
    }
  }

  async function del(id) {
    if (!confirm('למחוק הודעה זו?')) return;
    await axios.delete(`/api/contact/${id}`, { headers });
    setContacts(cs => cs.filter(x => x.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  const unread = contacts.filter(c => !c.read).length;
  const filtered = filter === 'unread' ? contacts.filter(c => !c.read) : contacts;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>📬 תיבת הודעות</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {unread > 0 && <span className="unread-badge">{unread} חדשות</span>}
          <button className={`reg-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>הכל ({contacts.length})</button>
          <button className={`reg-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>לא נקראו ({unread})</button>
        </div>
      </div>

      <div className="inbox-layout">
        {/* List */}
        <div className="inbox-list">
          {filtered.length === 0 && <div className="inbox-empty">אין הודעות</div>}
          {filtered.map(c => (
            <div key={c.id} className={`inbox-item ${!c.read ? 'unread' : ''} ${selected?.id === c.id ? 'active' : ''}`} onClick={() => open(c)}>
              <div className="inbox-item-top">
                <strong>{c.name}</strong>
                <span className="inbox-date">{fmt(c.submittedAt)}</span>
              </div>
              <div className="inbox-item-sub">{c.email}</div>
              {c.subject && <div className="inbox-subject-tag">{c.subject}</div>}
              <div className="inbox-preview">{c.message?.slice(0, 80)}{c.message?.length > 80 ? '...' : ''}</div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="inbox-detail">
          {!selected ? (
            <div className="inbox-empty" style={{ padding: 60 }}>בחר הודעה לצפייה</div>
          ) : (
            <>
              <div className="inbox-detail-header">
                <div>
                  <h2>{selected.name}</h2>
                  <div className="inbox-detail-meta">
                    <a href={`mailto:${selected.email}`}>{selected.email}</a>
                    {selected.phone && <span> · {selected.phone}</span>}
                    {selected.subject && <span className="inbox-subject-tag">{selected.subject}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{fmt(selected.submittedAt)}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={`mailto:${selected.email}`} className="btn btn-primary btn-sm">↩ השב במייל</a>
                  <a href={`https://wa.me/${selected.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ background: '#25d366', color: '#fff', border: 'none' }}>💬 וואטסאפ</a>
                  <button className="btn btn-danger btn-sm" onClick={() => del(selected.id)}>🗑️</button>
                </div>
              </div>
              <div className="inbox-message">{selected.message}</div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

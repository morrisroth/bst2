const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const { sendMail } = require('../mailer');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'contacts.json');

function load() {
  if (!fs.existsSync(FILE)) { fs.writeFileSync(FILE, '[]'); return []; }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}
function save(data) { fs.writeFileSync(FILE, JSON.stringify(data, null, 2)); }

// Public – submit
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'שדות חובה חסרים' });
  const contacts = load();
  contacts.unshift({ id: Date.now(), name, email, phone, subject, message, read: false, submittedAt: new Date().toISOString() });
  save(contacts);

  sendMail({
    subject: `פנייה חדשה מהאתר – ${name}`,
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px">
        <h2 style="color:#1b4a5c">פנייה חדשה מהאתר</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">שם</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">אימייל</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">טלפון</td><td style="padding:8px;border:1px solid #ddd">${phone || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">נושא</td><td style="padding:8px;border:1px solid #ddd">${subject || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">הודעה</td><td style="padding:8px;border:1px solid #ddd;white-space:pre-wrap">${message}</td></tr>
        </table>
      </div>
    `,
  }).catch(err => console.error('Contact email error:', err.message));

  res.json({ success: true });
});

// Admin – get all
router.get('/', auth, (req, res) => res.json(load()));

// Admin – mark read
router.patch('/:id', auth, (req, res) => {
  const contacts = load();
  const idx = contacts.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  contacts[idx] = { ...contacts[idx], ...req.body };
  save(contacts);
  res.json(contacts[idx]);
});

// Admin – delete
router.delete('/:id', auth, (req, res) => {
  save(load().filter(c => c.id !== parseInt(req.params.id)));
  res.json({ success: true });
});

module.exports = router;

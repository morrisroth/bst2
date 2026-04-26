const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'contacts.json');

function load() {
  if (!fs.existsSync(FILE)) { fs.writeFileSync(FILE, '[]'); return []; }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}
function save(data) { fs.writeFileSync(FILE, JSON.stringify(data, null, 2)); }

// Public – submit
router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'שדות חובה חסרים' });
  const contacts = load();
  contacts.unshift({ id: Date.now(), name, email, phone, subject, message, read: false, submittedAt: new Date().toISOString() });
  save(contacts);
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

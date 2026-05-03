const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

const FILE = path.join(__dirname, '..', 'data', 'notify-emails.json');

function load() {
  if (!fs.existsSync(FILE)) {
    const def = [{ id: 1, email: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || '', label: 'ברירת מחדל' }];
    fs.writeFileSync(FILE, JSON.stringify(def, null, 2));
    return def;
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}
function save(data) { fs.writeFileSync(FILE, JSON.stringify(data, null, 2)); }

router.get('/', auth, (req, res) => res.json(load()));

router.post('/', auth, (req, res) => {
  const { email, label } = req.body;
  if (!email) return res.status(400).json({ error: 'אימייל חסר' });
  const list = load();
  if (list.find(e => e.email === email)) return res.status(400).json({ error: 'האימייל כבר קיים' });
  list.push({ id: Date.now(), email, label: label || '' });
  save(list);
  res.json({ success: true });
});

router.delete('/:id', auth, (req, res) => {
  const list = load().filter(e => e.id !== parseInt(req.params.id));
  save(list);
  res.json({ success: true });
});

module.exports = router;

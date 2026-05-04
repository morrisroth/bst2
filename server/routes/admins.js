const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db');

router.get('/', auth, (req, res) => res.json(db.getAllAdmins()));

router.post('/', auth, (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'שם משתמש וסיסמה חובה' });
  if (password.length < 6) return res.status(400).json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' });
  try {
    const admin = db.addAdmin({ username, email, password });
    res.json(admin);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.patch('/:id', auth, (req, res) => {
  const { email, password } = req.body;
  const updates = {};
  if (email !== undefined) updates.email = email;
  if (password) {
    if (password.length < 6) return res.status(400).json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' });
    updates.password = password;
  }
  const updated = db.updateAdmin(req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'משתמש לא נמצא' });
  res.json(updated);
});

router.delete('/:id', auth, (req, res) => {
  if (parseInt(req.params.id) === req.admin.id) {
    return res.status(400).json({ error: 'לא ניתן למחוק את המשתמש הנוכחי' });
  }
  db.removeAdmin(req.params.id);
  res.json({ success: true });
});

module.exports = router;

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET = process.env.JWT_SECRET || 'nishmat-hatorah-secret-2026';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.getAdmin(username);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
  }
  const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET, { expiresIn: '8h' });
  res.json({ token, username: admin.username });
});

module.exports = router;

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const { sendMail } = require('../mailer');

const SECRET = process.env.JWT_SECRET || 'nishmat-hatorah-secret-2026';

// in-memory reset tokens: { token -> { adminId, expiresAt } }
const resetTokens = new Map();

// Login with username OR email + password
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = username.includes('@')
    ? db.getAdminByEmail(username)
    : db.getAdmin(username);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: 'פרטי התחברות שגויים' });
  }
  const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET, { expiresIn: '8h' });
  res.json({ token, username: admin.username });
});

// Forgot password – sends reset link to admin email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'אימייל חסר' });

  const admin = db.getAdminByEmail(email);
  // Always respond success to avoid user enumeration
  if (!admin) return res.json({ success: true });

  const token = crypto.randomBytes(32).toString('hex');
  resetTokens.set(token, { adminId: admin.id, expiresAt: Date.now() + 60 * 60 * 1000 }); // 1 hour

  const siteUrl = process.env.SITE_URL || 'http://localhost:4000';
  const resetLink = `${siteUrl}/admin/reset-password?token=${token}`;

  sendMail({
    subject: 'איפוס סיסמה – חדר בעל שם טוב',
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:500px">
        <h2 style="color:#1b4a5c">איפוס סיסמה</h2>
        <p>קיבלנו בקשה לאיפוס הסיסמה שלך. לחץ על הכפתור למטה להמשך:</p>
        <a href="${resetLink}" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#e8a020;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">איפוס סיסמה</a>
        <p style="color:#888;font-size:13px">הקישור בתוקף לשעה אחת. אם לא ביקשת זאת, התעלם מהודעה זו.</p>
      </div>
    `,
  }).catch(err => console.error('Reset email error:', err.message));

  res.json({ success: true });
});

// Reset password with token
router.post('/reset-password', (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'נתונים חסרים' });
  if (password.length < 6) return res.status(400).json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' });

  const entry = resetTokens.get(token);
  if (!entry || entry.expiresAt < Date.now()) {
    return res.status(400).json({ error: 'הקישור לא תקף או שפג תוקפו' });
  }

  db.updateAdmin(entry.adminId, { password });
  resetTokens.delete(token);
  res.json({ success: true });
});

module.exports = router;

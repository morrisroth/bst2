const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  res.json(db.getSettings());
});

router.put('/', auth, (req, res) => {
  db.setSettings(req.body);
  res.json({ success: true });
});

module.exports = router;

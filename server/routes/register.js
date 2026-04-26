const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const DATA_DIR = path.join(__dirname, '..', 'data');
const REG_FILE = path.join(DATA_DIR, 'registrations.json');

function loadRegs() {
  if (!fs.existsSync(REG_FILE)) { fs.writeFileSync(REG_FILE, '[]'); return []; }
  return JSON.parse(fs.readFileSync(REG_FILE, 'utf8'));
}
function saveRegs(data) {
  fs.writeFileSync(REG_FILE, JSON.stringify(data, null, 2));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `reg-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|gif|webp/;
    const videoTypes = /mp4|mov|avi|mkv|webm/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    const okImage = imageTypes.test(ext) && mime.startsWith('image/');
    const okVideo = videoTypes.test(ext) && mime.startsWith('video/');
    if (okImage || okVideo) return cb(null, true);
    cb(new Error('סוג קובץ לא נתמך'), false);
  }
});

// Public: submit registration
router.post('/', (req, res) => {
  upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }])(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    const { lastName, firstName, idNumber, hebrewDob, gregorianDob, address, homePhone, currentSchool } = req.body;
    if (!lastName || !firstName || !idNumber || !hebrewDob || !gregorianDob || !address || !homePhone || !currentSchool) {
      return res.status(400).json({ error: 'יש למלא את כל השדות החובה' });
    }
    if (!req.files?.photo?.[0]) return res.status(400).json({ error: 'יש להעלות תמונה' });
    try {
      const regs = loadRegs();
      regs.push({
        id: Date.now(),
        lastName, firstName, idNumber, hebrewDob, gregorianDob,
        address, homePhone, currentSchool,
        photo: `/uploads/${req.files.photo[0].filename}`,
        video: req.files?.video?.[0] ? `/uploads/${req.files.video[0].filename}` : null,
        status: 'pending',
        notes: '',
        submittedAt: new Date().toISOString()
      });
      saveRegs(regs);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'שגיאה בשמירת הנתונים: ' + e.message });
    }
  });
});

// Admin: get all registrations
router.get('/', auth, (req, res) => {
  try {
    res.json(loadRegs());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: update status / notes
router.patch('/:id', auth, (req, res) => {
  try {
    const regs = loadRegs();
    const idx = regs.findIndex(r => r.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'לא נמצא' });
    const { status, notes } = req.body;
    if (status !== undefined) regs[idx].status = status;
    if (notes !== undefined) regs[idx].notes = notes;
    saveRegs(regs);
    res.json(regs[idx]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: delete registration
router.delete('/:id', auth, (req, res) => {
  try {
    let regs = loadRegs();
    regs = regs.filter(r => r.id !== parseInt(req.params.id));
    saveRegs(regs);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

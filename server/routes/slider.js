const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'slider.json');

function load() {
  if (!fs.existsSync(FILE)) { fs.writeFileSync(FILE, '[]'); return []; }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}
function save(data) { fs.writeFileSync(FILE, JSON.stringify(data, null, 2)); }

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `slide-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype.startsWith('image/');
    cb(ok ? null : new Error('Images only'), ok);
  }
});

// Public
router.get('/', (req, res) => res.json(load()));

// Admin – add slide
router.post('/', auth, (req, res) => {
  upload.single('image')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No image' });
    const slides = load();
    const slide = {
      id: Date.now(),
      image: `/uploads/${req.file.filename}`,
      title: req.body.title || '',
      caption: req.body.caption || '',
      order: slides.length
    };
    slides.push(slide);
    save(slides);
    res.json(slide);
  });
});

// Admin – update title/caption/order
router.patch('/:id', auth, (req, res) => {
  const slides = load();
  const idx = slides.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  slides[idx] = { ...slides[idx], ...req.body, id: slides[idx].id };
  save(slides);
  res.json(slides[idx]);
});

// Admin – delete
router.delete('/:id', auth, (req, res) => {
  let slides = load();
  slides = slides.filter(s => s.id !== parseInt(req.params.id));
  save(slides);
  res.json({ success: true });
});

module.exports = router;

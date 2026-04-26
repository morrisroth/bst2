const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadFile(name, defaultVal) {
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2));
    return defaultVal;
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveFile(name, data) {
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

// ── admins ──
let admins = loadFile('admins', []);
if (!admins.find(a => a.username === 'admin')) {
  admins.push({ id: 1, username: 'admin', password_hash: bcrypt.hashSync('admin123', 10) });
  saveFile('admins', admins);
}

// ── settings ──
let settings = loadFile('settings', {
  hero_title: 'ברוכים הבאים לחדר בעל שם טוב',
  hero_subtitle: 'חינוך תורני חסידי – בית שמש רמה ד',
  hero_image: '',
  hero_video: '',
  about_image: '',
  site_name: 'חדר בעל שם טוב',
  site_tagline: 'חינוך תורני חסידי – בית שמש',
});

// ── posts ──
let posts = loadFile('posts', []);
if (posts.length === 0) {
  posts = [
    { id: 1, title: 'פתיחת שנת הלימודים תשפ"ז', excerpt: 'בשעה טובה ומוצלחת נפתחה שנת הלימודים בחדר בעל שם טוב', content: '<p>בשעה טובה ומוצלחת נפתחה שנת הלימודים תשפ"ז בחדר בעל שם טוב, בית שמש רמה ד.</p>', image: '', category: 'כללי', date: 'תשרי תשפ"ז', featured: 1, published: 1, created_at: new Date().toISOString() },
  ];
  saveFile('posts', posts);
}

let nextPostId = posts.reduce((max, p) => Math.max(max, p.id), 0) + 1;

// ── DB API ──
const db = {
  // admins
  getAdmin: (username) => admins.find(a => a.username === username) || null,

  // settings
  getSettings: () => ({ ...settings }),
  setSettings: (updates) => {
    settings = { ...settings, ...updates };
    saveFile('settings', settings);
  },

  // posts
  getAllPosts: () => [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  getPublishedPosts: (featuredOnly = false) => {
    return posts
      .filter(p => p.published === 1 && (!featuredOnly || p.featured === 1))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  getPost: (id) => posts.find(p => p.id === parseInt(id)) || null,
  createPost: (data) => {
    const post = { ...data, id: nextPostId++, created_at: new Date().toISOString() };
    posts.push(post);
    saveFile('posts', posts);
    return post;
  },
  updatePost: (id, data) => {
    const idx = posts.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return null;
    posts[idx] = { ...posts[idx], ...data, id: parseInt(id) };
    saveFile('posts', posts);
    return posts[idx];
  },
  deletePost: (id) => {
    posts = posts.filter(p => p.id !== parseInt(id));
    saveFile('posts', posts);
  },
};

module.exports = db;

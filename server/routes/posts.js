const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Public: list published posts
router.get('/', (req, res) => {
  const { featured } = req.query;
  res.json(db.getPublishedPosts(featured === '1'));
});

// Admin: all posts — must be before /:id
router.get('/admin/all', auth, (req, res) => {
  res.json(db.getAllPosts());
});

// Public: single post
router.get('/:id', (req, res) => {
  const post = db.getPost(req.params.id);
  if (!post || !post.published) return res.status(404).json({ error: 'לא נמצא' });
  res.json(post);
});

// Admin: create post
router.post('/', auth, (req, res) => {
  const { title, excerpt, content, image, category, date, featured, published } = req.body;
  const post = db.createPost({
    title, excerpt, content,
    image: image || '',
    category: category || 'כללי',
    date: date || '',
    featured: featured ? 1 : 0,
    published: published !== false ? 1 : 0,
  });
  res.json({ id: post.id });
});

// Admin: update post
router.put('/:id', auth, (req, res) => {
  const { title, excerpt, content, image, category, date, featured, published } = req.body;
  const post = db.updatePost(req.params.id, {
    title, excerpt, content,
    image: image || '',
    category: category || 'כללי',
    date: date || '',
    featured: featured ? 1 : 0,
    published: published ? 1 : 0,
  });
  if (!post) return res.status(404).json({ error: 'לא נמצא' });
  res.json({ success: true });
});

// Admin: delete post
router.delete('/:id', auth, (req, res) => {
  db.deletePost(req.params.id);
  res.json({ success: true });
});

module.exports = router;

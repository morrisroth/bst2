import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import './Blog.css';

const CATEGORIES = ['הכל', 'אירועים', 'טיולים', 'שבתות', 'כללי'];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('הכל');

  useEffect(() => {
    axios.get('/api/posts').then(r => { setPosts(r.data); setLoading(false); });
  }, []);

  const filtered = category === 'הכל' ? posts : posts.filter(p => p.category === category);

  return (
    <div className="blog-page page-content">
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><a href="/">ראשי</a> › חדשות ואירועים</div>
          <h1>חדשות ואירועים</h1>
          <p>עדכונים ואירועים מחיי החדר</p>
        </div>
      </div>

      <section className="blog-section">
        <div className="container">
          <div className="blog-filters">
            {CATEGORIES.map(cat => (
              <button key={cat} className={`filter-btn ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>{cat}</button>
            ))}
          </div>
          {loading
            ? <div className="loading">טוען...</div>
            : filtered.length === 0
              ? <div className="loading">לא נמצאו פוסטים</div>
              : <div className="blog-grid">{filtered.map(p => <PostCard key={p.id} post={p} />)}</div>
          }
        </div>
      </section>
    </div>
  );
}

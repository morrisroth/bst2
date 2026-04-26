import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './BlogPost.css';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`/api/posts/${id}`)
      .then(r => { setPost(r.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) return <div className="loading">טוען...</div>;
  if (error || !post) return (
    <div className="page-content" style={{ padding: '80px 0', textAlign: 'center' }}>
      <h2>הפוסט לא נמצא</h2>
      <Link to="/blog" className="btn btn-primary mt-2">חזרה לחדשות</Link>
    </div>
  );

  return (
    <div className="blog-post-page page-content">
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">ראשי</Link> › <Link to="/blog">חדשות</Link> › {post.title}
          </div>
          <h1>{post.title}</h1>
          <div className="post-hero-meta">
            <span className="badge badge-gold">{post.category}</span>
            <span style={{ color: 'var(--gold-light)', fontSize: 14 }}>{post.date}</span>
          </div>
        </div>
      </div>

      <div className="post-body">
        <div className="container">
          <div className="post-layout">
            <article className="post-article">
              {post.image && (
                <div className="post-featured-image">
                  <img src={post.image} alt={post.title} />
                </div>
              )}
              <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <div className="post-footer">
                <Link to="/blog" className="btn btn-outline-dark btn-sm">← חזרה לחדשות</Link>
              </div>
            </article>

            <aside className="post-sidebar">
              <div className="sidebar-box">
                <h4>קטגוריה</h4>
                <span className="badge badge-gold">{post.category}</span>
              </div>
              <div className="sidebar-box">
                <h4>תאריך</h4>
                <p>{post.date}</p>
              </div>
              <div className="sidebar-box">
                <h4>שיתוף</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>שתפו את הפוסט הזה עם חברים</p>
              </div>
              <Link to="/contact" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>צור קשר</Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

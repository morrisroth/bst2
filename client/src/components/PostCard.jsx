import { Link } from 'react-router-dom';
import './PostCard.css';

export default function PostCard({ post }) {
  return (
    <div className="post-card card">
      <div className="post-card-image">
        {post.image
          ? <img src={post.image} alt={post.title} />
          : <div className="img-placeholder post-img-placeholder"><span>📰</span></div>
        }
        {post.featured === 1 && <span className="featured-badge">מומלץ</span>}
      </div>
      <div className="post-card-body">
        <div className="post-card-meta">
          <span className="badge badge-gold">{post.category}</span>
          <span className="post-date">{post.date}</span>
        </div>
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <Link to={`/blog/${post.id}`} className="btn btn-primary btn-sm">קרא עוד</Link>
      </div>
    </div>
  );
}

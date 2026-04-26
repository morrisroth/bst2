import { useEffect, useState, useCallback } from 'react';
import './BannerSlider.css';

export default function BannerSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback(idx => {
    if (animating) return;
    setAnimating(true);
    setCurrent((idx + slides.length) % slides.length);
    setTimeout(() => setAnimating(false), 600);
  }, [animating, slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => go(current + 1), 4500);
    return () => clearInterval(t);
  }, [current, slides.length, go]);

  if (!slides.length) return null;

  return (
    <div className="banner-slider">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div key={slide.id} className={`bs-slide ${i === current ? 'active' : ''}`}>
          <img src={slide.image} alt={slide.title} />
          <div className="bs-overlay" />
        </div>
      ))}

      {/* Text */}
      <div className="bs-content">
        {slides[current].title && <h2 className="bs-title">{slides[current].title}</h2>}
        {slides[current].caption && <p className="bs-caption">{slides[current].caption}</p>}
      </div>

      {/* Arrows */}
      {slides.length > 1 && <>
        <button className="bs-arrow bs-prev" onClick={() => go(current - 1)}>&#8250;</button>
        <button className="bs-arrow bs-next" onClick={() => go(current + 1)}>&#8249;</button>
      </>}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="bs-dots">
          {slides.map((_, i) => (
            <button key={i} className={`bs-dot ${i === current ? 'active' : ''}`} onClick={() => go(i)} />
          ))}
        </div>
      )}

      {/* Thumbnails strip */}
      {slides.length > 1 && (
        <div className="bs-thumbs">
          {slides.map((slide, i) => (
            <div key={slide.id} className={`bs-thumb ${i === current ? 'active' : ''}`} onClick={() => go(i)}>
              <img src={slide.image} alt="" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

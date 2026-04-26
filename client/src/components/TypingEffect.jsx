import { useState, useEffect } from 'react';

export default function TypingEffect({ phrases, speed = 80, pause = 2000 }) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timeout;
    if (!deleting && charIdx <= current.length) {
      setText(current.slice(0, charIdx));
      timeout = setTimeout(() => setCharIdx(i => i + 1), charIdx === current.length ? pause : speed);
    } else if (!deleting && charIdx > current.length) {
      setDeleting(true);
    } else if (deleting && charIdx >= 0) {
      setText(current.slice(0, charIdx));
      timeout = setTimeout(() => setCharIdx(i => i - 1), speed / 2);
    } else {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % phrases.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return (
    <span className="typing-text">
      {text}
      <span className="typing-cursor">|</span>
    </span>
  );
}

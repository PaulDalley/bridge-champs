'use client';
import { useEffect, useState } from 'react';

export default function HomeAuth({ children, recentArticles }) {
  const [isMember, setIsMember] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const loggedIn = Object.keys(localStorage).some((k) =>
        k.startsWith('firebase:authUser:')
      );
      setIsMember(loggedIn);
    } catch (_) {}
    setReady(true);
  }, []);

  // During SSR and first paint: show the guest hero (no layout shift)
  if (!ready || !isMember) {
    return children;
  }

  return (
    <section className="hp-member">
      <h1 className="hp-member-title">Welcome back</h1>

      {recentArticles.length > 0 && (
        <div className="hp-member-section">
          <p className="hp-member-label">Recently added</p>
          <ul className="hp-member-list">
            {recentArticles.map((a) => (
              <li key={a.href} className="hp-member-item">
                <a href={a.href} className="hp-member-article-link">{a.title}</a>
                <span className="hp-member-tag">{a.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="hp-member-section">
        <p className="hp-member-label">Practice</p>
        <div className="hp-member-shortcuts">
          <a href="/practice" className="hp-member-shortcut">Trainers</a>
          <a href="/just-play" className="hp-member-shortcut">Just Play</a>
          <a href="/learn" className="hp-member-shortcut">All lessons</a>
        </div>
      </div>
    </section>
  );
}

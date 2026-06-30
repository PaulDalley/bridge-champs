'use client';
import { useEffect, useState } from 'react';
import { detectMember } from '../lib/detectMember';

export default function HomeAuth({ children }) {
  const [isMember, setIsMember] = useState(false);
  const [ready, setReady] = useState(false);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let alive = true;
    detectMember().then((m) => {
      if (!alive) return;
      setIsMember(m);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Recent articles are fetched client-side (not baked into the static homepage):
  // the build has no Firestore creds, so a server-rendered list would intermittently
  // come back empty and get cached. Members only — fetched once membership is known.
  useEffect(() => {
    if (!isMember) return;
    let alive = true;
    fetch('/api/recent-articles')
      .then((r) => (r.ok ? r.json() : { recent: [] }))
      .then((d) => {
        if (alive && Array.isArray(d.recent)) setRecent(d.recent);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [isMember]);

  // During SSR and first paint: show the guest hero (no layout shift)
  if (!ready || !isMember) {
    return children;
  }

  return (
    <section className="hp-member">
      <h1 className="hp-member-title">Welcome back</h1>

      {recent.length > 0 && (
        <div className="hp-member-section">
          <p className="hp-member-label">Recently added</p>
          <ul className="hp-member-list">
            {recent.map((a) => (
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

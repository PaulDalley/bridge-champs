'use client';
import { useEffect, useState } from 'react';

// Guest-hero welcome video, fetched at runtime (see /api/welcome-video) so it is
// never baked empty into the static homepage build. Renders nothing until a URL
// comes back (and nothing at all if no video is set).
export default function WelcomeVideo() {
  const [embed, setEmbed] = useState('');

  useEffect(() => {
    let alive = true;
    fetch('/api/welcome-video')
      .then((r) => (r.ok ? r.json() : { embed: '' }))
      .then((d) => {
        if (alive && d && d.embed) setEmbed(d.embed);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!embed) return null;

  return (
    <div className="hp-hero-video">
      <span className="hp-hero-video-label">Welcome video</span>
      <div className="hp-hero-video-frame">
        <iframe
          src={embed}
          title="Welcome to Bridge Champions"
          loading="lazy"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

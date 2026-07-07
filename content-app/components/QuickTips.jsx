'use client';
import { useEffect, useState } from 'react';
import { QUICK_TIPS } from '../lib/quickTips';
import { resolveResume, watchedCountAllTime, reelPercent } from '../lib/reelsProgress';
import SuitText from './SuitText';

// Homepage "Reels" section — a SINGLE tile (not a rail). It opens the reel player at
// the reel you left off on and resumes it from the exact spot. The resume target and
// watched count come from localStorage, so they're read AFTER mount (SSR renders the
// neutral default) to avoid a hydration mismatch.

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function QuickTips() {
  const [resume, setResume] = useState({ index: 0, resuming: false });
  const [watched, setWatched] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setResume(resolveResume(QUICK_TIPS));
    setWatched(watchedCountAllTime(QUICK_TIPS));
    setReady(true);
  }, []);

  const total = QUICK_TIPS.length;
  const reel = QUICK_TIPS[resume.index] || QUICK_TIPS[0];
  const pct = ready ? reelPercent(reel.slug) : 0;
  const allDone = ready && watched >= total;

  const kicker = !ready
    ? 'Watch reels'
    : resume.resuming
    ? 'Continue watching'
    : allDone
    ? 'Watch again'
    : watched > 0
    ? 'Watch the next reel'
    : 'Start watching';

  return (
    <section className="hp-reels">
      <div className="hp-reels-head">
        <h2 className="hp-sec-label">Reels</h2>
        <p className="hp-reels-note">Quick video tips</p>
      </div>

      <a href={`/tips/${reel.slug}`} className="hp-reels-tile">
        <div
          className="hp-reels-thumb"
          style={{ backgroundImage: `url(https://i.ytimg.com/vi/${reel.videoId}/hqdefault.jpg)` }}
        >
          <span className="hp-reels-play"><PlayIcon /></span>
          {ready && pct > 0 && pct < 100 && (
            <span className="hp-reels-track" aria-hidden="true">
              <span className="hp-reels-bar" style={{ width: pct + '%' }} />
            </span>
          )}
        </div>

        <div className="hp-reels-body">
          <span className="hp-reels-kicker">{kicker}</span>
          <span className="hp-reels-title"><SuitText>{reel.title}</SuitText></span>
          <span className="hp-reels-meta">
            {ready ? `${watched} of ${total} watched` : `${total} reels`}
            {reel.cat ? ` · ${reel.cat}` : ''}
          </span>
          <span className="hp-reels-cta">{resume.resuming ? 'Resume' : 'Play'} <span aria-hidden="true">▸</span></span>
        </div>
      </a>
    </section>
  );
}

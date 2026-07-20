'use client';
import { useEffect, useState } from 'react';
import { QUICK_TIPS } from '../lib/quickTips';
import { resolveResume, watchedCountAllTime, reelPercent, isReelWatched } from '../lib/reelsProgress';
import SuitText from './SuitText';

// Homepage "Reels" showcase — a set-apart panel with a featured tile ("Today's
// reel", or "Continue watching" when a reel is mid-watch) beside a scrollable rail
// of the latest reels. Everything personal (resume target, watched ticks, streak,
// NEW badges) is read AFTER mount so SSR renders a neutral default with no
// hydration mismatch.

const NEW_WINDOW_DAYS = 10; // reels published within this window get a NEW badge
const RAIL_MAX = 12;

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

function readStreak() {
  try {
    const s = JSON.parse(localStorage.getItem('bc_reels_streak') || '{}');
    return s && typeof s.n === 'number' ? s.n : 0;
  } catch (_) {
    return 0;
  }
}

function isNew(pub, now) {
  if (!pub) return false;
  const t = new Date(pub + 'T00:00:00Z').getTime();
  return now - t < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

export default function QuickTips() {
  const [resume, setResume] = useState({ index: 0, resuming: false });
  const [watched, setWatched] = useState(0);
  const [streak, setStreak] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setResume(resolveResume(QUICK_TIPS));
    setWatched(watchedCountAllTime(QUICK_TIPS));
    setStreak(readStreak());
    setReady(true);
  }, []);

  const total = QUICK_TIPS.length;
  const now = ready ? Date.now() : 0;

  // Daily pick rotates through the library; SSR default = the newest reel.
  const daily = ready ? QUICK_TIPS[Math.floor(now / 86400000) % total] : QUICK_TIPS[total - 1];
  const resuming = ready && resume.resuming;
  const feat = resuming ? QUICK_TIPS[resume.index] || daily : daily;
  const pct = ready ? reelPercent(feat.slug) : 0;
  const kicker = resuming ? 'Continue watching' : "Today's reel";

  // Rail: newest first, without the featured reel.
  const rail = [...QUICK_TIPS].reverse().filter((t) => t.slug !== feat.slug).slice(0, RAIL_MAX);

  return (
    <section className="hp-reels">
      <div className="hp-rs-head">
        <div>
          <h2 className="hp-sec-label">Reels</h2>
          <p className="hp-rs-sub">Quick video tips</p>
        </div>
        <div className="hp-rs-right">
          <span className="hp-rs-pill">{total} reels</span>
          <a href="/tips" className="hp-rs-see">See all →</a>
        </div>
      </div>

      <div className="hp-rs-grid">
        <a href={`/tips/${feat.slug}`} className="hp-rs-feat" aria-label={`${kicker}: ${feat.title}`}>
          <span
            className="hp-rs-fthumb"
            style={{ backgroundImage: `url(https://i.ytimg.com/vi/${feat.videoId}/hqdefault.jpg)` }}
          >
            {feat.cat && <span className="hp-rs-chip">{feat.cat}</span>}
            <span className="hp-rs-play"><PlayIcon /></span>
            {ready && pct > 0 && pct < 100 && (
              <span className="hp-rs-track" aria-hidden="true">
                <span className="hp-rs-bar" style={{ width: pct + '%' }} />
              </span>
            )}
          </span>
          <span className="hp-rs-over">
            <span className="hp-rs-k">▶ {kicker}</span>
            <span className="hp-rs-t"><SuitText>{feat.title}</SuitText></span>
            <span className="hp-rs-m">
              {ready ? `${watched} of ${total} watched` : `${total} quick video tips`}
              {ready && streak >= 2 ? ` · 🔥 ${streak}-day streak` : ''}
            </span>
          </span>
        </a>

        <div className="hp-rs-railwrap">
          <div className="hp-rs-rail">
            {rail.map((t) => {
              const done = ready && isReelWatched(t.slug);
              const fresh = ready && !done && isNew(t.pub, now);
              return (
                <a key={t.slug} href={`/tips/${t.slug}`} className="hp-rs-card">
                  <span
                    className="hp-rs-cthumb"
                    style={{ backgroundImage: `url(https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg)` }}
                  >
                    {t.cat && <span className={`hp-rs-chip${t.cat === 'Defence' ? ' hp-rs-chip--def' : ''}`}>{t.cat}</span>}
                    {fresh && <span className="hp-rs-new">NEW</span>}
                    {done && <span className="hp-rs-tick" aria-label="Watched">✓</span>}
                    <span className="hp-rs-cplay"><PlayIcon /></span>
                    <span className="hp-rs-lbl"><SuitText>{t.title}</SuitText></span>
                  </span>
                </a>
              );
            })}
            <a href="/tips" className="hp-rs-card hp-rs-card--all">
              <span className="hp-rs-cthumb hp-rs-cthumb--all">
                <span className="hp-rs-all">All {total} →</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

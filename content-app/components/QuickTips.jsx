'use client';
import { useRef } from 'react';
import { QUICK_TIPS } from '../lib/quickTips';

// Homepage "Quick tips" rail — 30-second tip videos linking to their /tips watch
// pages. (Free/members gating display was removed per Paul; any gate mechanism, if
// re-enabled later, lives on the watch page.)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: dir === 'left' ? 'rotate(180deg)' : 'none' }}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export default function QuickTips() {
  const railRef = useRef(null);

  const scroll = (dir) => {
    if (railRef.current) railRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <section className="hp-tips">
      <div className="hp-tips-head">
        <div>
          <h2 className="hp-sec-label">Quick tips</h2>
          <p className="hp-tips-note">30-second video tips</p>
        </div>
        <div className="hp-tips-head-right">
          <button className="hp-tips-arrow" aria-label="Scroll left" onClick={() => scroll(-1)}>
            <Chevron dir="left" />
          </button>
          <button className="hp-tips-arrow" aria-label="Scroll right" onClick={() => scroll(1)}>
            <Chevron dir="right" />
          </button>
          <a href="/tips" className="hp-tips-see">See all →</a>
        </div>
      </div>

      <div className="hp-tips-rail" ref={railRef}>
        {QUICK_TIPS.map((t) => {
          const catMod = t.cat === 'Bidding' ? 'bid' : 'conv';
          return (
            <a key={t.slug} href={`/tips/${t.slug}`} className="hp-tips-card">
              <div className="hp-tips-thumb" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <span className={`hp-tips-cat hp-tips-cat--${catMod}`}>{t.cat}</span>
                <span className="hp-tips-icon"><PlayIcon /></span>
                {t.dur && <span className="hp-tips-dur">{t.dur}</span>}
              </div>
              <p className="hp-tips-card-title">{t.title}</p>
            </a>
          );
        })}

        <a href="/tips" className="hp-tips-card hp-tips-card--all">
          <div className="hp-tips-all-inner">
            <span className="hp-tips-all-arrow" aria-hidden="true">→</span>
            <span>See all tips</span>
          </div>
        </a>
      </div>
    </section>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { QUICK_TIPS } from '../lib/quickTips';
import { isReelWatched, reelPercent } from '../lib/reelsProgress';
import SuitText from './SuitText';

// Category filter + grid for the /tips listing. Chips are derived from the data,
// so new categories (Declarer play, Defence, ...) appear automatically. Clicking a
// chip filters client-side and updates the URL (?category=) so the view is
// shareable; landing on /tips?category=X pre-selects that chip via initialCategory.
const CATS = ['All', ...Array.from(new Set(QUICK_TIPS.map((t) => t.cat)))];

const PlayGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
);
const CheckGlyph = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
);

export default function TipsBrowser({ initialCategory = 'All' }) {
  const [active, setActive] = useState(CATS.includes(initialCategory) ? initialCategory : 'All');
  // Watched ticks / resume bars read localStorage — reveal only after mount so the
  // server-rendered markup and the first client render match (no hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function choose(cat) {
    setActive(cat);
    try {
      window.history.replaceState(null, '', cat === 'All' ? '/tips' : `/tips?category=${encodeURIComponent(cat)}`);
    } catch (e) {}
  }

  const shown = active === 'All' ? QUICK_TIPS : QUICK_TIPS.filter((t) => t.cat === active);

  return (
    <>
      <div className="tw-filters" role="tablist" aria-label="Filter tips by category">
        {CATS.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={active === c}
            className={'tw-filter' + (active === c ? ' is-active' : '')}
            onClick={() => choose(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="tw-list">
        {shown.map((t) => {
          const watched = mounted && isReelWatched(t.slug);
          const pct = mounted && !watched ? reelPercent(t.slug) : 0;
          return (
            <a key={t.slug} href={`/tips/${t.slug}`} className={'tw-list-card' + (watched ? ' is-watched' : '')}>
              <div className="tw-list-thumb" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <span className="tw-list-play"><PlayGlyph /></span>
                {watched && <span className="tw-list-tick"><CheckGlyph /> Watched</span>}
                {t.dur && <span className="tw-list-dur">{t.dur}</span>}
                {pct > 0 && <span className="tw-list-track" aria-hidden="true"><span className="tw-list-bar" style={{ width: pct + '%' }} /></span>}
              </div>
              <p className="tw-list-title"><SuitText>{t.title}</SuitText></p>
              <p className="tw-list-cat">{t.cat}</p>
            </a>
          );
        })}
      </div>
    </>
  );
}

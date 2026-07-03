'use client';
import { useState } from 'react';
import { QUICK_TIPS } from '../lib/quickTips';

// Category filter + grid for the /tips listing. Chips are derived from the data,
// so new categories (Declarer play, Defence, ...) appear automatically. Clicking a
// chip filters client-side and updates the URL (?category=) so the view is
// shareable; landing on /tips?category=X pre-selects that chip via initialCategory.
const CATS = ['All', ...Array.from(new Set(QUICK_TIPS.map((t) => t.cat)))];

const PlayGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
);

export default function TipsBrowser({ initialCategory = 'All' }) {
  const [active, setActive] = useState(CATS.includes(initialCategory) ? initialCategory : 'All');

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
        {shown.map((t) => (
          <a key={t.slug} href={`/tips/${t.slug}`} className="tw-list-card">
            <div className="tw-list-thumb" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <span className="tw-list-play"><PlayGlyph /></span>
              {t.dur && <span className="tw-list-dur">{t.dur}</span>}
            </div>
            <p className="tw-list-title">{t.title}</p>
            <p className="tw-list-cat">{t.cat}</p>
          </a>
        ))}
      </div>
    </>
  );
}

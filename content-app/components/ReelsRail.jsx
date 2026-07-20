import { QUICK_TIPS } from '../lib/quickTips';
import SuitText from './SuitText';

// Compact server-rendered Reels rail for the /learn hub — newest reels first,
// linking into the /tips watch pages. No client state (ticks/streak live on the
// homepage showcase and the watch pages).

const NEW_WINDOW_DAYS = 10;
const COUNT = 8;

export default function ReelsRail() {
  const now = Date.now();
  const reels = [...QUICK_TIPS].reverse().slice(0, COUNT);
  return (
    <section className="lrr" aria-label="Reels">
      <div className="lrr-head">
        <span className="lrr-title">Reels · quick video tips</span>
        <a href="/tips" className="lrr-all">All {QUICK_TIPS.length} →</a>
      </div>
      <div className="lrr-rail">
        {reels.map((t) => {
          const fresh = t.pub && now - new Date(t.pub + 'T00:00:00Z').getTime() < NEW_WINDOW_DAYS * 864e5;
          return (
            <a key={t.slug} href={`/tips/${t.slug}`} className="lrr-card">
              <span
                className="lrr-thumb"
                style={{ backgroundImage: `url(https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg)` }}
              >
                {fresh && <span className="lrr-new">NEW</span>}
                <span className="lrr-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </span>
                <span className="lrr-lbl"><SuitText>{t.title}</SuitText></span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

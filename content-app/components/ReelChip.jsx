import SuitText from './SuitText';

// "Watch the reel" chip on article pages that have a paired reel (lib/articleReels.js).
// Server-rendered, links into the /tips watch page.
export default function ReelChip({ reel }) {
  return (
    <a className="bc-reelchip" href={`/tips/${reel.slug}`}>
      <span
        className="bc-reelchip-thumb"
        style={{ backgroundImage: `url(https://i.ytimg.com/vi/${reel.videoId}/hqdefault.jpg)` }}
        aria-hidden="true"
      >
        <span className="bc-reelchip-play">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
      </span>
      <span className="bc-reelchip-txt">
        <span className="bc-reelchip-k">▶ Watch the reel</span>
        <span className="bc-reelchip-t"><SuitText>{reel.title}</SuitText></span>
        <span className="bc-reelchip-m">Quick video tip</span>
      </span>
    </a>
  );
}

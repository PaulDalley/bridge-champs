// Article → reel pairings (approved by Paul 2026-07-20): articles that have a
// matching reel show a "Watch the reel" chip above their Read-next footer.
// Keys are the article's final URL slug (/learn/<cat>/<slug>); values are reel
// slugs from quickTips.js.
import { getTip } from './quickTips';

const ARTICLE_TO_REEL = {
  'trump-lead-kills-ruffing-plans': 'lead-trumps-2',
  'misfit-auctions-put-brakes-early': 'misfit-dont-compete',
  'takeout-doubles-bridge-complete-guide': 'normal-takeout-double',
  'kiss-1-do-not-double': 'try-not-to-double',
  'opening-2c-avoid-whenever-possible': '2c-opening',
  'preempting-first-seat-bold': 'open-or-preempt',
  'bridge-signals-beginners-attitude-count': 'signals-opening-lead',
  'opening-1nt-beginners-open-not': '1nt-with-5422',
  'system-over-1nt-conventions': 'transfer-to-5-card-major',
  'favourable-vulnerability': 'competing-not-vulnerable',
};

export function reelForArticle(slug) {
  const reelSlug = ARTICLE_TO_REEL[slug];
  return reelSlug ? getTip(reelSlug) : null;
}

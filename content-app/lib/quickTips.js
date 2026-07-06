// Shared data for the Quick Tips feature (homepage rail + /tips watch pages).
// Real launch videos (YouTube Shorts). `note`/`hand` = the under-video content
// Paul will supply (empty for now). `cat` is a BEST-GUESS classification pending
// Paul's confirmation. Titles are Paul's verbatim labels. `dur` unset until known.
export const FREE_LIMIT = 2;

export const QUICK_TIPS = [
  { slug: 'signals-opening-lead', title: 'The most important signals', cat: 'Bidding', videoId: 'AMsj_mVrYCg', dur: '', note: "Two most important signals\n\n1. On Partner's opening lead\n2. When you or partner make your FIRST discard - When you don't follow suit for the first time.\n\nI recommend playing attitude on both of those discards. (Encourage or Discourage, so either low encourage or high encourage, whichever you and your partner prefer)." },
  { slug: '5-card-major-dont-double', title: 'Double or bid?', cat: 'Bidding', videoId: 'pzUyb0cAkuc', dur: '', note: '', hand: { boardType: 'single', position: 'South', South: '*S-5*H-AK1084*D-K54*C-KQ54', bidding: '_/_/2♠/3♥' } },
  { slug: 'bid-as-high-as-possible', title: 'Bid as high as possible!', cat: 'Bidding', videoId: 'FF6XLHrYQwg', dur: '', note: 'Under pressure the opponents will make more mistakes, that is why in competition we "Bid our hand as high as possible at our first opportunity".', hand: { boardType: 'full', North: '*S-AK75*H-73*D-AJ962*C-73', West: '*S-J106*H-A642*D-*C-AJ10654', East: '*S-9842*H-J85*D-K8*C-KQ82', South: '*S-Q3*H-KQ109*D-Q107543*C-9', bidding: '1♣/1♦/1♥/5♦/5♠/X/P/P/P' } },
  { slug: 'multi-2d', title: 'Defending against a multi 2D', cat: 'Bidding', videoId: 'kf9srFsXjHw', dur: '', note: "The opponents open 2D multi, we must make a double that shows 12-14 points and balanced (with a 5 card major just keep it simple and bid the major rather than double), don't worry about your shape, you don't need both majors to double a multi. Do NOT pass with an opening hand or else it will lead to uncomfortable auctions and bad results.", hand: { boardType: 'single', position: 'South', South: '*S-AK104*H-76*D-KQ54*C-Q103', bidding: '_/_/2♦/X' } },
  { slug: 'transfer-to-5-card-major', title: 'Transfer or not?', cat: 'Bidding', videoId: 'fkyG6l6oHPY', dur: '', note: "Always transfer rather than pass 1NT, reasons such as balanced hand or bad major suit shouldn't stop you from transferring.", hand: { boardType: 'single', position: 'South', South: '*S-97654*H-J7*D-K54*C-1053', bidding: '_/1NT/P/?' } },
  { slug: 'competing-not-vulnerable', title: 'Nv compete', cat: 'Bidding', videoId: '0q9YYDGJccY', dur: '', note: "Vulnerability is one of the biggest factors to consider when competing. Especially when the opponents are in a fit.\n\nWe can certainly compete on a hand like this, not worrying that we only have 8 points.", hand: { boardType: 'single', position: 'South', South: '*S-54*H-A2*D-KJ1054*C-10976', bidding: '_/_/1♠/P/2♠/P/P/?' } },
  { slug: 'bidding-vulnerable', title: 'How strong vulnerable?', cat: 'Bidding', videoId: 'xYFrlo8on_s', dur: '', note: "We do not need more than 11-12 points as a starting point for bidding vulnerable. The biggest reason in favour of bidding is distribution - think singletons as a starting point.", hand: { boardType: 'single', position: 'South', South: '*S-K1084*H-5*D-AJ109*C-K1072', bidding: '_/_/3♥/?', vul: 'NS' } },
  { slug: 'vulnerable-preempt', title: 'Preempt suit quality', cat: 'Bidding', videoId: '2LJPXOxAZHE', dur: '', note: "Have 2 of the top 3 honors typically. Mostly because we want partner to be able to raise our suit and make game, when we preempt vulnerable we are doing 2 things\na. Getting in the way\nb. Letting partner know we have a good 6-7 card suit, and may have game on." },
  { slug: 'bad-shape-6322-7222', title: '6322 and 7222', cat: 'Bidding', videoId: 'FlZ3GlL27UQ', dur: '', note: "6322 and 7222 is bad shape, never get carried away with those. Pretend they are 5 and 6 card suits, not 6 and 7.", hand: { boardType: 'single', position: 'South', South: '*S-K10*H-Q4*D-AK76542*C-J4', bidding: '_/_/1♠/2♦/2♠/3♦/4♠/P/P/P' } },
];

export function getTip(slug) {
  return QUICK_TIPS.find((t) => t.slug === slug) || null;
}

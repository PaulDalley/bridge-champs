// Shared data for the Quick Tips feature (homepage rail + /tips watch pages).
// Real launch videos (YouTube Shorts). `note`/`hand` = the under-video content
// Paul will supply (empty for now). `cat` is a BEST-GUESS classification pending
// Paul's confirmation. Titles are Paul's verbatim labels. `dur` unset until known.
export const FREE_LIMIT = 2;

export const QUICK_TIPS = [
  { slug: 'signals-opening-lead', title: 'The most important signals', cat: 'Bidding', videoId: 'AMsj_mVrYCg', dur: '', note: "Two most important signals\n\n1. On Partner's opening lead\n2. When you or partner make your FIRST discard - When you don't follow suit for the first time.\n\nI recommend playing attitude on both of those discards. (Encourage or Discourage, so either low encourage or high encourage, whichever you and your partner prefer)." },
  { slug: '5-card-major-dont-double', title: 'Double or bid?', cat: 'Bidding', videoId: 'pzUyb0cAkuc', dur: '', note: '', hand: { boardType: 'single', position: 'South', South: '*S-5*H-AK1084*D-K54*C-KQ54', bidding: '_/_/2♠/3♥' } },
  { slug: 'bid-as-high-as-possible', title: 'Bid as high as possible!', cat: 'Bidding', videoId: 'FF6XLHrYQwg', dur: '', note: 'Under pressure the opponents will make more mistakes, that is why in competition we "Bid our hand as high as possible at our first opportunity".', hand: { boardType: 'full', North: '*S-AK75*H-73*D-AJ962*C-73', West: '*S-J106*H-A642*D-*C-AJ10654', East: '*S-9842*H-J85*D-K8*C-KQ82', South: '*S-Q3*H-KQ109*D-Q107543*C-9', bidding: '1♣/1♦/1♥/5♦/5♠/X/P/P/P' } },
  { slug: 'multi-2d', title: 'Defending against a multi 2♦', cat: 'Bidding', videoId: 'kf9srFsXjHw', dur: '', note: "The opponents open 2♦ multi, we must make a double that shows 12-14 points and balanced (with a 5 card major just keep it simple and bid the major rather than double), don't worry about your shape, you don't need both majors to double a multi. Do NOT pass with an opening hand or else it will lead to uncomfortable auctions and bad results.", hand: { boardType: 'single', position: 'South', South: '*S-AK104*H-76*D-KQ54*C-Q103', bidding: '_/_/2♦/X' } },
  { slug: 'transfer-to-5-card-major', title: 'Transfer or not?', cat: 'Bidding', videoId: 'fkyG6l6oHPY', dur: '', note: "Always transfer rather than pass 1NT, reasons such as balanced hand or bad major suit shouldn't stop you from transferring.", hand: { boardType: 'single', position: 'South', South: '*S-97654*H-J7*D-K54*C-1053', bidding: '_/1NT/P/?' } },
  { slug: 'competing-not-vulnerable', title: 'Nv compete', cat: 'Bidding', videoId: '0q9YYDGJccY', dur: '', note: "Vulnerability is one of the biggest factors to consider when competing. Especially when the opponents are in a fit.\n\nWe can certainly compete on a hand like this, not worrying that we only have 8 points.", hand: { boardType: 'single', position: 'South', South: '*S-54*H-A2*D-KJ1054*C-10976', bidding: '_/_/1♠/P/2♠/P/P/?' } },
  { slug: 'bidding-vulnerable', title: 'How strong vulnerable?', cat: 'Bidding', videoId: 'xYFrlo8on_s', dur: '', note: "We do not need more than 11-12 points as a starting point for bidding vulnerable. The biggest reason in favour of bidding is distribution - think singletons as a starting point.", hand: { boardType: 'single', position: 'South', South: '*S-K1084*H-5*D-AJ109*C-K1072', bidding: '_/_/3♥/?', vul: 'NS' } },
  { slug: 'vulnerable-preempt', title: 'Preempt suit quality', cat: 'Bidding', videoId: '2LJPXOxAZHE', dur: '', note: "Have 2 of the top 3 honors typically. Mostly because we want partner to be able to raise our suit and make game, when we preempt vulnerable we are doing 2 things\na. Getting in the way\nb. Letting partner know we have a good 6-7 card suit, and may have game on." },
  { slug: 'bad-shape-6322-7222', title: '6322 and 7222', cat: 'Bidding', videoId: 'FlZ3GlL27UQ', dur: '', note: "6322 and 7222 is bad shape, never get carried away with those. Pretend they are 5 and 6 card suits, not 6 and 7.", hand: { boardType: 'single', position: 'South', South: '*S-K10*H-Q4*D-AK76542*C-J4', bidding: '_/_/1♠/2♦/2♠/3♦/4♠/P/P/P' } },
  { slug: '2c-opening', title: '2♣ opening', cat: 'Bidding', videoId: 'Lf6ZDDC9ep4', dur: '', blocks: [
    { t: "Basically never open 2♣ with a 2 or 3 suiter hand. Shapes like 5440, 5-5, 6-5 etc. For example\n\nIn the below hand, take a small risk, open 1♣. If it doesn't get passed out, you're in a much better position to bid your hand naturally, for example" },
    { board: { boardType: 'single', position: 'South', South: '*S-A*H-5*D-AKQ102*C-AKJ1043', bidding: '_/_/_/1♣/P/1♥/P/2♦/P/2NT/P/3♦' } },
    { t: "You've bid your 6-5 shape already by making 3 bids by the time you hit the 3 level, and you've shown a forcing strong hand. Whereas if you open 2♣, your first natural bid will be on the 3 level! You will never have the room to show this hand." },
  ] },
  { slug: 'doubleton-lead', title: 'Doubleton lead', cat: 'Defence', videoId: '-IE850HwLQQ', dur: '', blocks: [
    { t: "Singletons are best, then doubletons." },
    { board: { boardType: 'single', position: 'South', South: '*S-K103*H-A54*D-K10842*C-73', bidding: '_/_/1NT/P/2♥/P/2♠/P/3NT/P/4♠/P/P/P' } },
    { t: "In an ordinary auction like this, the doubleton club lead is our best prospect." },
  ] },
  { slug: 'passive-lead', title: 'Passive lead', cat: 'Defence', videoId: '-CRdDPTgvfs', dur: '', blocks: [
    { t: "In general it is not a good idea to lead from a random honor such as Kxxx, Qxxx or Jxxx (exceptions are when the auction calls for it). It is much better to lead a doubleton or singleton if you have one, but otherwise leads from passive holdings are fine, such as three small (the club suit)" },
    { board: { boardType: 'single', position: 'South', South: '*S-K103*H-A54*D-Q1082*C-743', bidding: '_/_/1NT/P/2♥/P/2♠/P/3NT/P/4♠/P/P/P' } },
    { t: "\"there is no reason to think diamonds are our suit\" - these type of leads give away more than they gain." },
  ] },
  { slug: 'when-to-lead-active', title: 'When to lead active', cat: 'Defence', videoId: 'TrSWkul6BxU', dur: '', blocks: [
    { t: "Active leads are sometimes called for, one reasonably common scenario is where we know the opponents have a long side suit - so we might need to set up our tricks in a hurry. For example" },
    { board: { boardType: 'single', bidding: '_/_/1♠/P/2♦/P/2♠/P/4♠/P/P/P' } },
    { t: "Here we should try to get the sense that dummy will have a 5+ card diamond suit. Also with our hand we can see the diamond suit is probably breaking well and the finesse is on. We need to attack our trick source asap. The full hand" },
    { board: { boardType: 'full', North: '*S-632*H-Q96*D-106*C-A10752', East: '*S-AKQ1097*H-J32*D-82*C-KQ', South: '*S-54*H-K1084*D-K73*C-J943', West: '*S-J8*H-A75*D-AQJ954*C-86', bidding: '_/_/1♠/P/2♦/P/2♠/P/4♠/P/P/P' } },
  ] },
  { slug: '1nt-with-5422', title: '1N with 5422', cat: 'Bidding', videoId: 'SOVktJ7TOqs', dur: '', blocks: [
    { t: "Opening 1NT with 5422 shape will often be right when you have plenty of points in the doubletons, a rough guide is 7+ points. The below hand is best opening 1NT rather than 1♦." },
    { board: { boardType: 'single', position: 'South', South: '*S-K10*H-AQ*D-A8543*C-Q1043' } },
  ] },
];

export function getTip(slug) {
  return QUICK_TIPS.find((t) => t.slug === slug) || null;
}

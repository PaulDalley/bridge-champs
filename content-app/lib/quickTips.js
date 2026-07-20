// Shared data for the Quick Tips feature (homepage rail + /tips watch pages).
// Real launch videos (YouTube Shorts). `note`/`hand` = the under-video content
// Paul will supply (empty for now). `cat` is a BEST-GUESS classification pending
// Paul's confirmation. Titles are Paul's verbatim labels. `dur` unset until known.
export const FREE_LIMIT = 2;

export const QUICK_TIPS = [
  { slug: 'signals-opening-lead', title: 'The most important signals', cat: 'Bidding', videoId: 'AMsj_mVrYCg', dur: '', pub: '2026-07-02', note: "Two most important signals\n\n1. On Partner's opening lead\n2. When you or partner make your FIRST discard - When you don't follow suit for the first time.\n\nI recommend playing attitude on both of those discards. (Encourage or Discourage, so either low encourage or high encourage, whichever you and your partner prefer)." },
  { slug: '5-card-major-dont-double', title: 'Double or bid?', cat: 'Bidding', videoId: 'pzUyb0cAkuc', dur: '', pub: '2026-07-02', note: '', hand: { boardType: 'single', position: 'South', South: '*S-5*H-AK1084*D-K54*C-KQ54', bidding: '_/_/2♠/3♥' } },
  { slug: 'bid-as-high-as-possible', title: 'Bid as high as possible!', cat: 'Bidding', videoId: 'FF6XLHrYQwg', dur: '', pub: '2026-07-02', note: 'Under pressure the opponents will make more mistakes, that is why in competition we "Bid our hand as high as possible at our first opportunity".', hand: { boardType: 'full', North: '*S-AK75*H-73*D-AJ962*C-73', West: '*S-J106*H-A642*D-*C-AJ10654', East: '*S-9842*H-J85*D-K8*C-KQ82', South: '*S-Q3*H-KQ109*D-Q107543*C-9', bidding: '1♣/1♦/1♥/5♦/5♠/X/P/P/P' } },
  { slug: 'multi-2d', title: 'Defending against a multi 2♦', cat: 'Bidding', videoId: 'kf9srFsXjHw', dur: '', pub: '2026-07-02', note: "The opponents open 2♦ multi, we must make a double that shows 12-14 points and balanced (with a 5 card major just keep it simple and bid the major rather than double), don't worry about your shape, you don't need both majors to double a multi. Do NOT pass with an opening hand or else it will lead to uncomfortable auctions and bad results.", hand: { boardType: 'single', position: 'South', South: '*S-AK104*H-76*D-KQ54*C-Q103', bidding: '_/_/2♦/X' } },
  { slug: 'transfer-to-5-card-major', title: 'Transfer or not?', cat: 'Bidding', videoId: 'fkyG6l6oHPY', dur: '', pub: '2026-07-02', note: "Always transfer rather than pass 1NT, reasons such as balanced hand or bad major suit shouldn't stop you from transferring.", hand: { boardType: 'single', position: 'South', South: '*S-97654*H-J7*D-K54*C-1053', bidding: '_/1NT/P/?' } },
  { slug: 'competing-not-vulnerable', title: 'Nv compete', cat: 'Bidding', videoId: '0q9YYDGJccY', dur: '', pub: '2026-07-06', note: "Vulnerability is one of the biggest factors to consider when competing. Especially when the opponents are in a fit.\n\nWe can certainly compete on a hand like this, not worrying that we only have 8 points.", hand: { boardType: 'single', position: 'South', South: '*S-54*H-A2*D-KJ1054*C-10976', bidding: '_/_/1♠/P/2♠/P/P/?' } },
  { slug: 'bidding-vulnerable', title: 'How strong vulnerable?', cat: 'Bidding', videoId: 'xYFrlo8on_s', dur: '', pub: '2026-07-06', note: "We do not need more than 11-12 points as a starting point for bidding vulnerable. The biggest reason in favour of bidding is distribution - think singletons as a starting point.", hand: { boardType: 'single', position: 'South', South: '*S-K1084*H-5*D-AJ109*C-K1072', bidding: '_/_/3♥/?', vul: 'NS' } },
  { slug: 'vulnerable-preempt', title: 'Preempt suit quality', cat: 'Bidding', videoId: '2LJPXOxAZHE', dur: '', pub: '2026-07-06', blocks: [
    { t: "Have 2 of the top 3 honors typically. Mostly because we want partner to be able to raise our suit and make game, when we preempt vulnerable we are doing 2 things\na. Getting in the way\nb. Letting partner know we have a good 6-7 card suit, and may have game on.\n\nWe can make game on this hand" },
    { board: { boardType: 'double', position: 'South/North', South: '*S-KQ108432*H-762*D-5*C-K4', North: '*S-A5*H-9*D-AK876*C-108532', bidding: '_/_/_/3♠/P/4♠/P/P/P' } },
  ] },
  { slug: 'bad-shape-6322-7222', title: '6322 and 7222', cat: 'Bidding', videoId: 'FlZ3GlL27UQ', dur: '', pub: '2026-07-06', note: "6322 and 7222 is bad shape, never get carried away with those. Pretend they are 5 and 6 card suits, not 6 and 7.", hand: { boardType: 'single', position: 'South', South: '*S-K10*H-Q4*D-AK76542*C-J4', bidding: '_/_/1♠/2♦/2♠/3♦/4♠/P/P/P' } },
  { slug: '2c-opening', title: '2♣ opening', cat: 'Bidding', videoId: 'Lf6ZDDC9ep4', dur: '', pub: '2026-07-07', blocks: [
    { t: "Basically never open 2♣ with a 2 or 3 suiter hand. Shapes like 5440, 5-5, 6-5 etc. For example\n\nIn the below hand, take a small risk, open 1♣. If it doesn't get passed out, you're in a much better position to bid your hand naturally, for example" },
    { board: { boardType: 'single', position: 'South', South: '*S-A*H-5*D-AKJ102*C-AKJ1043', bidding: '_/_/_/1♣/P/1♥/P/2♦/P/2NT/P/3♦' } },
    { t: "You've bid your 6-5 shape already by making 3 bids by the time you hit the 3 level, and you've shown a forcing strong hand. Whereas if you open 2♣, your first natural bid will be on the 3 level! You will never have the room to show this hand." },
  ] },
  { slug: 'doubleton-lead', title: 'Doubleton lead', cat: 'Defence', videoId: '-IE850HwLQQ', dur: '', pub: '2026-07-07', blocks: [
    { t: "Singletons are best, then doubletons." },
    { board: { boardType: 'single', position: 'South', South: '*S-K103*H-A54*D-K10842*C-73', bidding: '_/_/1NT/P/2♥/P/2♠/P/3NT/P/4♠/P/P/P' } },
    { t: "In an ordinary auction like this, the doubleton club lead is our best prospect." },
  ] },
  { slug: 'passive-lead', title: 'Passive lead', cat: 'Defence', videoId: '-CRdDPTgvfs', dur: '', pub: '2026-07-07', blocks: [
    { t: "In general it is not a good idea to lead from a random honor such as Kxxx, Qxxx or Jxxx (exceptions are when the auction calls for it). It is much better to lead a doubleton or singleton if you have one, but otherwise leads from passive holdings are fine, such as three small (the club suit)" },
    { board: { boardType: 'single', position: 'South', South: '*S-K103*H-A54*D-Q1082*C-743', bidding: '_/_/1NT/P/2♥/P/2♠/P/3NT/P/4♠/P/P/P' } },
    { t: "\"there is no reason to think diamonds are our suit\" - these type of leads give away more than they gain." },
  ] },
  { slug: 'when-to-lead-active', title: 'When to lead active', cat: 'Defence', videoId: 'TrSWkul6BxU', dur: '', pub: '2026-07-07', blocks: [
    { t: "Active leads are sometimes called for, one reasonably common scenario is where we know the opponents have a long side suit - so we might need to set up our tricks in a hurry. For example" },
    { board: { boardType: 'single', bidding: '_/_/1♠/P/2♦/P/2♠/P/4♠/P/P/P' } },
    { t: "Here we should try to get the sense that dummy will have a 5+ card diamond suit. Also with our hand we can see the diamond suit is probably breaking well and the finesse is on. We need to attack our trick source asap. The full hand" },
    { board: { boardType: 'full', North: '*S-632*H-Q96*D-106*C-A10752', East: '*S-AKQ1097*H-J32*D-82*C-KQ', South: '*S-54*H-K1084*D-K73*C-J943', West: '*S-J8*H-A75*D-AQJ954*C-86', bidding: '_/_/1♠/P/2♦/P/2♠/P/4♠/P/P/P' } },
  ] },
  { slug: '1nt-with-5422', title: '1N with 5422', cat: 'Bidding', videoId: 'SOVktJ7TOqs', dur: '', pub: '2026-07-07', blocks: [
    { t: "Opening 1NT with 5422 shape will often be right when you have plenty of points in the doubletons, a rough guide is 7+ points. The below hand is best opening 1NT rather than 1♦." },
    { board: { boardType: 'single', position: 'South', South: '*S-K10*H-AQ*D-A8543*C-Q1043' } },
  ] },
  { slug: 'normal-takeout-double', title: 'Takeout double', cat: 'Bidding', videoId: 'zqGZq4DDZRM', dur: '', pub: '2026-07-08', note: "It is completely fine to make a takeout double with a 3 card major. The double says that we have points, and 3-4 of each major typically. Partner can easily have 5+ hearts.", hand: { boardType: 'single', position: 'South', South: '*S-AQ83*H-KQ4*D-102*C-K1054', bidding: '_/_/1♦/X' } },
  { slug: 'negative-double-partner-opens', title: 'Negative double', cat: 'Bidding', videoId: 'iZwXg9dWamk', dur: '', pub: '2026-07-08', note: "\"Negative double\" is a name people often use to refer to the double made after partner has made an opening bid - which is different to a \"takeout double\" which is made when partner has not yet bid.\n\nIn this context, where partner has opened a minor, we should just simply bid our 4 card suits. Double would be wrong, playing standard methods double should show both majors exactly 4 cards.\n\nCONTRAST that with the previous video, when partner opens 1 minor, just bid your 4 card suits, or double to show exactly 4 cards in each suit.\n\nThese situations are very commonly confused and people overlap the meaning. Keep them separate, they have different meanings.", hand: { boardType: 'single', position: 'South', South: '*S-K1084*H-K103*D-54*C-J542', bidding: '_/1♣/1♦/1♠' } },
  { slug: 'splinters', title: 'Splinters', cat: 'Bidding', videoId: 'fDj0cB-yz-4', dur: '', pub: '2026-07-08', blocks: [
    { t: "A splinter should have sharp cards, Kings and Aces, Queen of trumps. It should be about 9-11 points filled with those cards. Without those cards, don't splinter, for example" },
    { board: { boardType: 'single', position: 'South', South: '*S-J842*H-QJ95*D-AQ83*C-4', bidding: '_/1♠/P/?' } },
    { t: "I would not splinter on this hand. You can just bid 4♠ unless your system has a different way of treating the hand, for example if you play Bergen raises you can bid this as a strong Bergen - but don't upgrade it to a splinter which needs to have a certain character (Aces and Kings), not just a set amount of points." },
  ] },
  { slug: 'competing-partscore', title: 'Competing partscore', cat: 'Bidding', videoId: 'lvVDV4jDsV4', dur: '', pub: '2026-07-08', blocks: [
    { t: "I've said that one of the most profitable habits in bridge is to compete and not allow the opponents to sit on the 2 level in a fit. But two of the more important reasons to think twice\nIf we have a lot of points in their suit - it will mean that we will struggle to declare a different suit, our loser count could get very high\nIf we are vulnerable, point 1 matters even more." },
    { board: { boardType: 'single', position: 'South', South: '*S-AK*H-10843*D-Q105*C-9542', bidding: '_/_/1♠/P/2♠/P/P/P', vul: 'NS' } },
    { t: "For me this hand would be a clear pass. I have all my points in their suit, even though I would like to compete, my suits are too bid and being vulnerable it is not the time to risk going 2 or 3 off for a terrible score." },
  ] },
  { slug: 'try-not-to-double', title: 'Try not double', cat: 'Bidding', videoId: 'wCYXAc8_rrY', dur: '', pub: '2026-07-08', blocks: [
    { t: "Doubling with a distributional hand is generally a bad idea. With these two hands for example, its not a good idea to double" },
    { board: { boardType: 'single', position: 'South', South: '*S-54*H-A*D-K1084*C-AQ10832', bidding: '1♥/P/1♠/2♣' } },
    { t: "Don't double with a 6 card suit, just bid it naturally (rare exception in a completely different situation - as responder when bidding the suit would be forcing)" },
    { board: { boardType: 'single', position: 'South', South: '*S-KQ1084*H-AQ1072*D-54*C-3', bidding: '1♣/P/1♦/1♠' } },
    { t: "It's true you have both the other suits, but a double does not convey 5-5 in those suits. With 5-5 shape, try to just bid naturally, don't double. (or if available, bid michaels cue bid showing 5-5 in both majors)" },
  ] },
  { slug: 'ace-ace-king', title: 'Ace Ace King', cat: 'Bidding', videoId: 'QeiE_dsOZjo', dur: '', pub: '2026-07-08', note: "For me this hand is a clear cut opening bid at all vulnerabilities. The question is whether you open a 4-3-3-3 or not, discuss with partner. I recommend opening.", hand: { boardType: 'single', position: 'South', South: '*S-K104*H-A54*D-72*C-A9854' } },
  { slug: 'two-level-overcall', title: '2 level overcall', cat: 'Bidding', videoId: 'oYgAgYtmy8o', dur: '', pub: '2026-07-08', blocks: [
    { t: "The better the suit = the more likely I am to overcall\n\nThe more distributional = the more likely I am to overcall\n\nExample 1" },
    { board: { boardType: 'single', position: 'South', South: '*S-9*H-A32*D-J102*C-KQ10842', bidding: '_/_/1♠/2♣' } },
    { t: "I would certainly overcall 2♣ here.\n\nExample 2" },
    { board: { boardType: 'single', position: 'South', South: '*S-KQ2*H-A32*D-72*C-K8432', bidding: '_/_/1♠/P' } },
    { t: "In this example I am balanced and I have a very poor club suit. 5332 shape is balanced, typically not suitable for a 2 level overcall.\n\nAlthough I don't like passing at my first opportunity with opening strength, I would because the alternative of bidding 2♣ is too unattractive." },
  ] },
  // ── Batch added 2026-07-20 (videoIds auto-filled from the channel via scripts/_youtube-latest.js) ──
  { slug: 'lead-trumps-2', title: 'Lead Trumps #1', cat: 'Defence', videoId: 'DsYf-6rHo90', dur: '', pub: '2026-07-20', blocks: [
    { t: "To illustrate the example again," },
    { board: { boardType: 'single', position: 'South', South: '*S-A982*H-AJ754*D-1063*C-6', bidding: '_/_/_/P/P/*2♦/3♣/3♥/4♣/4♥/5♣/X/P/P/P', vul: 'All' } },
    { t: "2♦ bid showed 18-19 balanced. You have 27-28 of the points and your opponents are declaring on the 5 level. They will be heavily relying on trumps to make tricks, so cut down their ruffing power immediately with a trump lead." },
    { key: "It makes a big difference, 2 trick difference!" },
    { t: "The full deal is" },
    { board: { boardType: 'full', North: '*S-K1075*H-2*D-2*C-Q1075432', West: '*S-QJ63*H-KQ93*D-AK7*C-KJ', East: '*S-A982*H-AJ754*D-1063*C-6', South: '*S-4*H-1086*D-QJ9854*C-A98', bidding: '_/_/P/P/*2♦/3♣/3♥/4♣/4♥/5♣/X/P/P/P', vul: 'All' } },
  ] },
  { slug: 'lead-trumps-vs-sacrifice', title: 'Lead Trumps #2', cat: 'Defence', videoId: 'RJgp-Nk6ICI', dur: '', pub: '2026-07-20', blocks: [
    { t: "When your side has about 25+ points, normally you want to bid game. Sometimes the opponents sacrifice." },
    { rule: "When the opponents don't have many points, lead trumps." },
    { t: "Why? They will normally rely on ruffing as much as possible, in order to make tricks (since they are lacking high card points).\n\nLet's take an example from recent play" },
    { board: { boardType: 'single', position: 'South', South: '*S-62*H-10964*D-AJ862*C-Q2', bidding: '1♦/1♠/*2♥/P/3♥/3♠/4♥/4♠/P/P/5♥/X/P/P/P' } },
    { t: "In the bidding 2♥ was alerted as not forcing. Partners bid of 2♠ and then 3♠ shows a good hand, probably 14 or 15+ points and a good suit with a distributional hand." },
    { callout: "In summary, the opponents have less than half the points in the pack but are declaring on the 5 level - they will be relying on ruffs for tricks, lead a trump and hopefully get in again to lead another trump. Each trump lead is 1 less trick for the opponents on this deal.", label: 'Summary' },
  ] },
  { slug: '7-card-good-suit', title: '7 card GOOD suit', cat: 'Bidding', videoId: 'TKJ3cskhVZI', dur: '', pub: '2026-07-20', blocks: [
    { t: "A 7 card GOOD suit is typically trumps. Don't get carried away with a 7 card bad suit.\n\nLets compare two hands." },
    { board: { boardType: 'full', North: '*S-8752*H-K*D-KQ10*C-A10763', West: '*S-K9*H-AQ842*D-95*C-QJ54', East: '*S-AQJ10643*H-J95*D-7*C-92', South: '*S-*H-10763*D-AJ86432*C-K8', bidding: '_/_/_/P/1♥/X/4♠/P/P/P', vul: 'All' } },
    { t: "Despite having a heart fit, you have a 7 card suit which is a 1 loser suit, that should be trumps." },
    { rule: "a 0-1 loser 7 card suit should (almost) always be trumps. Even if you have another fit." },
    { t: "Example hand 2 - a bad 7 card suit." },
    { board: { boardType: 'full', North: '*S-A4*H-A1087653*D-A*C-K74', West: '*S-7*H-KQ9*D-952*C-AQ9652', East: '*S-9852*H-J42*D-10864*C-J8', South: '*S-KQJ1063*H-*D-KQJ73*C-103', bidding: '_/_/P/1♠/2♣/2♥/P/2♠/P/?', vul: 'All' } },
    { t: "For this pair, 2♠ showed a 6th spade. What would you do from there?\n\nAs for making contracts - 6♠ makes whereas 4♥ is one off." },
    { key: "It is important to not get carried away with a bad suit." },
  ] },
  { slug: 'open-or-preempt', title: 'To open or not, pre-empt or not', cat: 'Bidding', videoId: '5XVYILI19ig', dur: '', pub: '2026-07-20', blocks: [
    { t: "My opponent was dealt this hand. Vulnerable, as dealer." },
    { board: { boardType: 'single', position: 'South', South: '*S-*H-10763*D-AJ86432*C-K8', vul: 'NS' } },
    { t: "Opening the bidding and preempting are both good things if you can." },
    { list: { tone: 'con', title: "There are select reasons I sometimes choose not to preempt.", items: [
      "A decent spade suit, can be 3 cards.",
      "Balanced hand - \"do less with balanced hands\" 6322 for example is balanced.",
      "A bad long suit.",
    ] } },
    { list: { tone: 'pro', title: "Reasons I love to open and/or preempt", items: [
      "Distributional hands - Do more with these, voids are reasons to do more, not less.",
      "Not Vulnerable, especially versus Vulnerable (also called favourable vulnerability). This is the time to be most aggressive, don't talk yourself out of preempting or opening here, if it looks at all like a preempt - it is a preempt! Don't worry about suit quality, etc etc.",
    ] } },
    { t: "To me the void is EXTRA reason to bid. It makes the hand quite special. If the hand had 4 card spades I may be concerned that our side has 4♠ contract on. However, the heart suit is not nearly as relevant because, even if we have 4♥ on, the opponents are probably going to have a 9-10 card spade fit (or more!), and be able to out bid us.\n\nFor me this is a 4♦ opening bid" },
    { rule: "Do 1 more with a void. So, if you would open 3♦ without it, open 4♦ with it." },
    { t: "Don't talk yourself into passing or find reasons to not preempt such as \"I had a 4 card major so I didn't bid\"." },
  ] },
  { slug: 'misfit-dont-compete', title: "Let the opponents play when they are misfitting", cat: 'Bidding', videoId: 'qUH1oJCHPRY', dur: '', pub: '2026-07-20', blocks: [
    { t: "In the semi finals of the Spingold, which is world class standard, both South players got this wrong." },
    { rule: "Let the opponents play when they are misfitting, don't compete!" },
    { board: { boardType: 'single', position: 'South', South: '*S-J6*H-742*D-AKJ4*C-Q965', bidding: '1♠/P/*1NT/P/2♥/P/2♠/X/P/3♦/P/P/P', vul: 'EW' } },
    { quote: "Both south's thought: I am not vulnerable, I have both of the other suits, this should be fine." },
    { t: "However, it is a very big mistake to bid - the bidding suggests that the opponents are in a misfit. In 2♠ the opponents are in a 7 card fit. The decision to compete put NS into a 7 card fit of their own, on the 3 level. This was doubled for -500." },
    { board: { boardType: 'full', North: '*S-9743*H-AJ106*D-963*C-K3', West: '*S-AQ852*H-K983*D-Q*C-J74', East: '*S-K10*H-Q5*D-108752*C-A1082', South: '*S-J6*H-742*D-AKJ4*C-Q965', bidding: '1♠/P/*1NT/P/2♥/P/2♠/X/P/3♦/P/P/P', vul: 'EW' } },
    { key: "when the opponents are in a fit, it is good time to compete. When the opponents are not in a fit, it is best to just defend." },
  ] },
  { slug: 'the-strongest-hand', title: 'The strongest hand', cat: 'Bidding', videoId: 'kR5sMchpf_0', dur: '', pub: '2026-07-20', blocks: [
    { t: "This was the strongest hand I think I've ever seen." },
    { board: { boardType: 'full', North: '*S-QJ86*H-QJ*D-J108643*C-2', West: '*S-94*H-1087543*D-Q7*C-1094', East: '*S-AK105*H-AK62*D-AK*C-AKQ', South: '*S-732*H-9*D-952*C-J87653', bidding: 'P/P/2♣/P/2♦/P/2NT/P/3♦/P/3♥/P/4♥/P/7NT/P/P/P' } },
    { t: "I opened 2♣ and rebid 2♦ showing 23+ points. Partners 3♦ is a transfer to hearts.\n\nInterestingly, if you super accept - you will never work out that your partner had 6 hearts!\n\nBy quietly bidding 3♥, partner was able to show the 6th heart by bidding 4♥." },
    { t: "I could now count 13 tricks, I have 7 top tricks outside of hearts, and can expect 6 heart tricks opposite 6 bad hearts, if they break if they don't break 3-0." },
    { t: "Over 4♥, I just bid 7NT - slightly safer than 7♥ in case there is a ruff on the opening lead." },
  ] },
  { slug: 'be-practical', title: 'Be practical', cat: 'Bidding', videoId: 'iq2IPnA9Qlw', dur: '', pub: '2026-07-20', blocks: [
    { list: { tone: 'pro', title: "A successful bridge player will be a combination of these characteristics", items: [
      "Realistic",
      "Practical",
      "Appropriately optimistic",
    ] } },
    { board: { boardType: 'single', position: 'South', South: '*S-A654*H-A8*D-AK65*C-AQ7', bidding: '_/P/P/1♦/1♥/P/2♥/X/P/3♦/P/?', vul: 'NS' } },
    { t: "In this pairs system, 3♦ showed 0-6 points, because otherwise they would have bid over 1♥ - they have the bid of 1♠ as artificial and to show 7+ points (not recommended)." },
    { t: "At the table the player reasoned that partner could have 0 points and 3NT may have no chance. In practice, slight optimism here pays off.\n\nIt's important to note that the opponents were not vulnerable and you are vulnerable - at such vulnerability often the opponents have very little for their bids and raises" },
    { board: { boardType: 'full', North: '*S-983*H-J96*D-Q873*C-K63', West: '*S-KQ*H-KQ732*D-92*C-J1054', East: '*S-J1072*H-1054*D-J104*C-982', South: '*S-A654*H-A8*D-AK65*C-AQ7', bidding: '_/P/P/1♦/1♥/P/2♥/X/P/3♦/P/?', vul: 'NS' } },
    { rule: "Be practical and a little optimistic rather than pessimistic, especially when it comes to chasing those vulnerable games." },
    { rule: "When the opponents are not vulnerable, they sometimes bid without having much at all - don't get discouraged." },
  ] },
];

export function getTip(slug) {
  return QUICK_TIPS.find((t) => t.slug === slug) || null;
}

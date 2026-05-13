/**
 * Card Rush — seed puzzle pool.
 *
 * Add one entry per puzzle to the exported array below. The trainer reads from
 * this list, picks a random sequence each run, and accepts any card listed in
 * `correctCards`.
 *
 * ─── Author orientation ──────────────────────────────────────────────────────
 * **The user always sits South in the trainer.** When you have a puzzle from
 * a screenshot or a book where someone else is South, rotate every hand and
 * every play 180° so that:
 *    original N → S, original S → N, original E → W, original W → E.
 * Set `declarerCompass` and `viewerCompass` to the rotated seats.
 *
 * ─── Card encoding ────────────────────────────────────────────────────────────
 * Each card is a 2-char string: <suit><rank>.
 *   Suits: S H D C
 *   Ranks: 2 3 4 5 6 7 8 9 T J Q K A   (T = ten)
 *   Examples: "SA" = ♠A, "HT" = ♥T, "C2" = ♣2
 *
 * ─── Seats ────────────────────────────────────────────────────────────────────
 * All seats are compass only: N / E / S / W (per repo rule).
 * `declarerCompass` and `viewerCompass` must be set explicitly.
 *
 * ─── Whose turn ──────────────────────────────────────────────────────────────
 * `toPlaySeat` is the seat that owns the card the user clicks on.
 *  - For declarer puzzles `toPlaySeat` may be the declarer OR dummy
 *    (declarer plays from both hands).
 *  - For defender puzzles `toPlaySeat` equals `viewerCompass`.
 *
 * ─── Visible hands ───────────────────────────────────────────────────────────
 * `visibleHands` is the FULL deal in compass form (all four hands when known).
 * Always include the seat that is `toPlaySeat`. Include all four hands when
 * available so the review modal can show the complete deal post-run; the
 * trainer hides the right ones during play (see `playRevealSeats`).
 *
 * ─── Which hands the player sees DURING play ─────────────────────────────────
 * `playRevealSeats` is REQUIRED for every new puzzle. It lists the compass
 * seats whose cards are face-up while the puzzle is being solved. Everything
 * else renders face-down on the green felt — exactly what the player would
 * see at the real table.
 *
 *  Examples:
 *    Declarer puzzle (you = S, dummy = N):  playRevealSeats: ["S", "N"]
 *    Defender puzzle (you = S, dummy = N):  playRevealSeats: ["S", "N"]
 *
 * The review modal always reveals every seat in `visibleHands`, regardless of
 * `playRevealSeats`.
 *
 * ─── Tricks ──────────────────────────────────────────────────────────────────
 * `currentTrick` is the trick the user is about to play INTO. Omit `plays`
 * (or set it to `[]`) for an opening-lead-style puzzle. For mid-trick puzzles
 * include the cards already on the table in playing order.
 *
 * `lastTrick` is OPTIONAL. Use it for "lead to the next trick" style puzzles —
 * the table will display the just-completed trick (with the winning card
 * highlighted and a "Won by …" badge) so the user can see the trick they
 * just observed before they pick a card to lead the next one. When you set
 * `lastTrick`, set `currentTrick.plays = []` and `currentTrick.leader` to the
 * winner of the last trick.
 *
 * ─── Correct answer ──────────────────────────────────────────────────────────
 * `correctCards` is an array of every card that counts as correct (typically
 * one, but include touching equivalents when both achieve the goal). The
 * trainer also requires that the chosen card is legal (must follow suit if
 * the seat has any of the led suit) — illegal cards are disabled in the UI.
 *
 * ─── Explanation formatting ──────────────────────────────────────────────────
 * `explanation` is plain text. Inline card chips are auto-rendered when you
 * write a unicode suit glyph followed by a rank, e.g.:
 *    "the ♠J is the entry"      → "the [♠J] is the entry"
 *    "lead the ♥10 next"        → "lead the [♥10] next"
 * Suits: ♠ ♥ ♦ ♣ ; ranks: 2-9, T (or 10), J, Q, K, A.
 *
 * ─── Title ───────────────────────────────────────────────────────────────────
 * `title` is OPTIONAL — leave it off and the review modal uses `topic`
 * instead. Add a title only when it materially improves the review.
 */

/**
 * @typedef {"S"|"H"|"D"|"C"} Suit
 * @typedef {"N"|"E"|"S"|"W"} Compass
 * @typedef {string} Card  // e.g. "SA", "HT", "C2"
 *
 * @typedef {Object} CardRushPuzzle
 * @property {string} id                  Unique short id (e.g. "cr-001").
 * @property {string} [topic]             Short tag used in the review header (e.g. "Knock out the Ace").
 *                                        NOT shown during play (no hints).
 * @property {string} [title]             Optional one-line title for the review modal.
 * @property {string} contract            Contract text (e.g. "4S", "3NT", "4HX").
 * @property {Compass} declarerCompass    Who declares.
 * @property {Compass} viewerCompass      Whose perspective the user plays from (almost always "S").
 * @property {Suit} [trumpSuit]           Omit for NT.
 * @property {{ leader: Compass, plays: { seat: Compass, card: Card }[] }} [currentTrick]
 *                                        In-progress trick (set `plays = []` for a lead).
 * @property {{ leader: Compass, plays: { seat: Compass, card: Card }[], winner: Compass }} [lastTrick]
 *                                        Optional just-completed trick to display for context.
 * @property {Compass} toPlaySeat         Seat the user is playing from.
 * @property {Partial<Record<Compass, Card[]>>} visibleHands
 *                                        Full deal (all four hands when known). Drives the review reveal.
 * @property {Compass[]} playRevealSeats  Required. Seats face-up during play; other seats render face-down.
 * @property {Card[]} correctCards        Cards counted as correct (include touching equivalents).
 * @property {string} [explanation]       Free-text shown in the review modal (supports ♠J, ♥10 chips).
 * @property {1|2|3} [difficulty]         Optional difficulty band.
 * @property {boolean} [includeInPool]    When false, puzzle is excluded from normal random runs
 *                                        and can be tested via preview-only URL mode.
 */

/** @type {CardRushPuzzle[]} */
export const CARD_RUSH_SEED_PUZZLES = [
  {
    id: "cr-001",
    topic: "Knock out the Ace",
    contract: "4S",
    declarerCompass: "S",
    viewerCompass: "S",
    trumpSuit: "S",
    // Trick 1 (already played): W led ♠5, dummy ♠A wins, E ♠9, declarer ♠2.
    lastTrick: {
      leader: "W",
      plays: [
        { seat: "W", card: "S5" },
        { seat: "N", card: "SA" },
        { seat: "E", card: "S9" },
        { seat: "S", card: "S2" },
      ],
      winner: "N",
    },
    // Trick 2: dummy on lead. User clicks a card from dummy.
    currentTrick: { leader: "N", plays: [] },
    toPlaySeat: "N",
    // During play the user only sees their own hand (S) and dummy (N) — opponents face-down.
    // Review modal reveals all four hands.
    playRevealSeats: ["S", "N"],
    visibleHands: {
      // Dummy (rotated from original North): ♠AJ ♥KJ87 ♣QJ7 ♦KJT4 — minus ♠A played at trick 1.
      N: ["SJ", "HK", "HJ", "H8", "H7", "CQ", "CJ", "C7", "DK", "DJ", "DT", "D4"],
      // Declarer / you (rotated from original South): ♠KQ8642 ♥Q3 ♣A52 ♦82 — minus ♠2 played at trick 1.
      S: ["SK", "SQ", "S8", "S6", "S4", "HQ", "H3", "CA", "C5", "C2", "D8", "D2"],
      // West (rotated from original East): ♠75 ♥96 ♣K943 ♦AQ753 — minus ♠5 played at trick 1.
      W: ["S7", "H9", "H6", "CK", "C9", "C4", "C3", "DA", "DQ", "D7", "D5", "D3"],
      // East (rotated from original West): ♠T93 ♥AT542 ♣T86 ♦96 — minus ♠9 played at trick 1.
      E: ["ST", "S3", "HA", "HT", "H5", "H4", "H2", "CT", "C8", "C6", "D9", "D6"],
    },
    correctCards: ["H7", "H8"],
    explanation:
      "Declarer wants to set up a useful source of tricks immediately by knocking out the ace. Only winners are created, no losers (you have to lose the ace anyway). It is very natural to do at trick 2 because there is still a quick and sure entry to dummy — the ♠J.",
    difficulty: 1,
  },

  {
    id: "cr-002",
    topic: "Draw trumps",
    contract: "4H",
    declarerCompass: "S",
    viewerCompass: "S",
    trumpSuit: "H",
    // Trick 1: W led ♣4, dummy ♣A wins, E ♣8, declarer ♣7.
    lastTrick: {
      leader: "W",
      plays: [
        { seat: "W", card: "C4" },
        { seat: "N", card: "CA" },
        { seat: "E", card: "C8" },
        { seat: "S", card: "C7" },
      ],
      winner: "N",
    },
    // Trick 2: dummy on lead. User clicks ♥Q from dummy to start drawing trumps.
    currentTrick: { leader: "N", plays: [] },
    toPlaySeat: "N",
    playRevealSeats: ["S", "N"],
    visibleHands: {
      // Dummy (N): ♥Q7 ♠AQ72 ♦9852 ♣A92 — minus ♣A played at trick 1.
      N: ["HQ", "H7", "SA", "SQ", "S7", "S2", "D9", "D8", "D5", "D2", "C9", "C2"],
      // Declarer / you (S): ♥AJ109432 ♠94 ♦Q6 ♣T7 — minus ♣7 played at trick 1.
      S: ["HA", "HJ", "HT", "H9", "H4", "H3", "H2", "S9", "S4", "DQ", "D6", "CT"],
      // West: ♥K ♠KJT3 ♦KJ73 ♣J543 — minus ♣4 played at trick 1.
      W: ["HK", "SK", "SJ", "ST", "S3", "DK", "DJ", "D7", "D3", "CJ", "C5", "C3"],
      // East: ♥865 ♠865 ♦AT4 ♣KQ86 — minus ♣8 played at trick 1.
      E: ["H8", "H6", "H5", "S8", "S6", "S5", "DA", "DT", "D4", "CK", "CQ", "C6"],
    },
    correctCards: ["HQ"],
    explanation: "In this hand there is no reason to delay drawing trumps.",
    difficulty: 1,
  },

  {
    id: "cr-003",
    topic: "Recognising dummy types",
    contract: "2S",
    declarerCompass: "W",
    viewerCompass: "S",
    trumpSuit: "S",
    // Defence 1-1 context: partner leads ♣2, dummy ♣7, you win ♣A, declarer ♣3.
    lastTrick: {
      leader: "N",
      plays: [
        { seat: "N", card: "C2" },
        { seat: "E", card: "C7" },
        { seat: "S", card: "CA" },
        { seat: "W", card: "C3" },
      ],
      winner: "S",
    },
    // You (South) are on lead at trick 2.
    currentTrick: { leader: "S", plays: [] },
    toPlaySeat: "S",
    // Limit reveal exactly to what Defence 1-1 gives: you + dummy only.
    playRevealSeats: ["S", "E"],
    visibleHands: {
      // Dummy hand from Defence 1-1, minus the ♣7 played at trick 1.
      E: ["SJ", "S7", "S2", "H2", "DA", "D7", "D6", "D5", "D4", "D3", "CJ", "C2"],
      // Your (RHO) hand from Defence 1-1, minus the ♣A played at trick 1.
      S: ["SA", "S2", "HK", "HJ", "H3", "H2", "DQ", "DT", "D2", "CQ", "C9", "C2"],
    },
    // Correct play requested: cash the ♠A.
    correctCards: ["SA"],
    explanation:
      "This type of dummy is one which is only useful to declarer for its ruffing value.\n\nDummy is\n\n✓ weak\n✓ has a shortage\n✓ has trumps\n\nTherefore it’s the duty of the defence to remove dummy’s trumps — confidently play a trump!",
    difficulty: 1,
  },

  {
    id: "cr-004",
    topic: "Recognising dummy types",
    contract: "2S",
    declarerCompass: "S",
    viewerCompass: "S",
    trumpSuit: "S",
    // Declarer stage 1, problem 2:
    // show first two tricks, then ask for trick 3 play.
    replayControl: "click",
    replayTricks: [
      {
        leader: "W",
        plays: [
          { seat: "W", card: "C7" },
          { seat: "N", card: "C3" },
          { seat: "E", card: "CA" },
          { seat: "S", card: "C2" },
        ],
        winner: "E",
      },
      {
        leader: "E",
        plays: [
          { seat: "E", card: "C9" },
          { seat: "S", card: "CK" },
          { seat: "W", card: "C5" },
          { seat: "N", card: "C4" },
        ],
        winner: "S",
      },
    ],
    currentTrick: { leader: "S", plays: [] },
    toPlaySeat: "S",
    // Limit reveal to what Declarer stage 1, problem 2 provides.
    playRevealSeats: ["S", "N"],
    visibleHands: {
      // Dummy (N), minus ♣3 and ♣4 from first 2 tricks.
      N: ["SJ", "S7", "S2", "H2", "DA", "D7", "D6", "D4", "D3", "C7", "C6"],
      // You (S), minus ♣2 and ♣K from first 2 tricks.
      S: ["SA", "SK", "S9", "S5", "S3", "HA", "H9", "H8", "H3", "DQ", "D2"],
    },
    correctCards: ["HA"],
    explanation:
      "With this type of dummy it is typically best to go after ruffs, because\n\n✓ Dummy is weaker than opening values\n✓ Dummy has a shortage\n✓ Dummy has trumps\n\nIt is worth noting — it’s typically not of much use to try setup a long suit in such a weak dummy.",
    difficulty: 1,
  },

  {
    id: "cr-005",
    topic: "Knock out the Ace",
    contract: "3NT",
    declarerCompass: "S",
    viewerCompass: "S",
    // No trumpSuit — 3NT.
    // Trick 1: W led ♠8, dummy ♠3, E ♠4, declarer ♠J wins.
    lastTrick: {
      leader: "W",
      plays: [
        { seat: "W", card: "S8" },
        { seat: "N", card: "S3" },
        { seat: "E", card: "S4" },
        { seat: "S", card: "SJ" },
      ],
      winner: "S",
    },
    // Trick 2: declarer (you, S) on lead. Lead the ♠10 to drive out East's ♠A.
    currentTrick: { leader: "S", plays: [] },
    toPlaySeat: "S",
    playRevealSeats: ["S", "N"],
    visibleHands: {
      // Dummy (N): ♠KQ73 ♥AK4 ♣K74 ♦K65 — minus ♠3 played at trick 1.
      N: ["SK", "SQ", "S7", "HA", "HK", "H4", "CK", "C7", "C4", "DK", "D6", "D5"],
      // Declarer / you (S): ♠J102 ♥Q62 ♣A932 ♦832 — minus ♠J played at trick 1.
      S: ["ST", "S2", "HQ", "H6", "H2", "CA", "C9", "C3", "C2", "D8", "D3", "D2"],
      // West: ♠9865 ♥T97 ♣QT8 ♦A97 — minus ♠8 played at trick 1.
      W: ["S9", "S6", "S5", "HT", "H9", "H7", "CQ", "CT", "C8", "DA", "D9", "D7"],
      // East: ♠A4 ♥J853 ♣J65 ♦QJT4 — minus ♠4 played at trick 1.
      E: ["SA", "HJ", "H8", "H5", "H3", "CJ", "C6", "C5", "DQ", "DJ", "DT", "D4"],
    },
    correctCards: ["ST"],
    explanation:
      "Declarer needs to set up the spade suit for tricks. With ♠KQ7 in dummy and ♠102 in hand, lead the ♠10 from the short side to drive out East's ♠A. Whether East ducks or wins the ace, dummy's ♠K, ♠Q, and ♠7 are all winners — four spade tricks established alongside the ♠J already won at trick 1.",
    difficulty: 1,
  },
  {
    id: "cr-006",
    topic: "Knock out the Ace",
    contract: "4H",
    declarerCompass: "S",
    viewerCompass: "S",
    trumpSuit: "H",
    // Declarer level 1, problem 3 (cp1-3):
    // Trick 1 is completed (diamond lead won by declarer's ace),
    // then declarer chooses the trick-2 lead.
    lastTrick: {
      leader: "W",
      plays: [
        { seat: "W", card: "DQ" },
        { seat: "N", card: "D2" },
        { seat: "E", card: "D3" },
        { seat: "S", card: "DA" },
      ],
      winner: "S",
    },
    currentTrick: { leader: "S", plays: [] },
    toPlaySeat: "S",
    playRevealSeats: ["S", "N"],
    visibleHands: {
      // Dummy (North): ♠QJ3 ♥Q53 ♦82 ♣T8642, minus ♦2 played to trick 1.
      N: ["SQ", "SJ", "S3", "HQ", "H5", "H3", "D8", "CT", "C8", "C6", "C4", "C2"],
      // Declarer / you (South): ♠K4 ♥AK9862 ♦A94 ♣A7, minus ♦A played to trick 1.
      S: ["SK", "S4", "HA", "HK", "H9", "H8", "H6", "H2", "D9", "D4", "CA", "C7"],
    },
    // Correct answer requested: lead the king of spades at trick 2.
    correctCards: ["SK"],
    explanation: "Its a good idea to knock out the Ace and setup a useful trick source.",
    difficulty: 1,
  },
  {
    id: "cr-007",
    topic: "Knock out the Ace",
    contract: "3NT",
    declarerCompass: "S",
    viewerCompass: "S",
    // Declarer level 1, problem 6 (cp1-6):
    // Show first two tricks with manual click-to-advance replay.
    replayControl: "click",
    replayTricks: [
      {
        leader: "W",
        plays: [
          { seat: "W", card: "H5" },
          { seat: "N", card: "H6" },
          { seat: "E", card: "HA" },
          { seat: "S", card: "H4" },
        ],
        winner: "E",
      },
      {
        leader: "E",
        plays: [
          { seat: "E", card: "H9" },
          { seat: "S", card: "HK" },
          { seat: "W", card: "H3" },
          { seat: "N", card: "H7" },
        ],
        winner: "S",
      },
    ],
    // Trick 3 lead from declarer after replaying tricks 1 and 2.
    currentTrick: { leader: "S", plays: [] },
    toPlaySeat: "S",
    playRevealSeats: ["S", "N"],
    visibleHands: {
      // Dummy (N): ♠K92 ♥76 ♦762 ♣AJT84, minus ♥6 and ♥7 from tricks 1-2.
      N: ["SK", "S9", "S2", "D7", "D6", "D2", "CA", "CJ", "CT", "C8", "C4"],
      // Declarer (S): ♠AQ32 ♥K4 ♦KQJT ♣K93, minus ♥4 and ♥K from tricks 1-2.
      S: ["SA", "SQ", "S3", "S2", "DK", "DQ", "DJ", "DT", "CK", "C9", "C3"],
      // West (W): ♠876 ♥9532 ♦985 ♣Q76, minus ♥5 and ♥3 from tricks 1-2.
      W: ["S8", "S7", "S6", "H9", "H2", "D9", "D8", "D5", "CQ", "C7", "C6"],
      // East (E): ♠JT5 ♥AQ982 ♦A43 ♣98, minus ♥A and ♥9 from tricks 1-2.
      E: ["SJ", "ST", "S5", "HQ", "H8", "H2", "DA", "D4", "D3", "C9", "C8"],
    },
    // Any club card is accepted.
    correctCards: ["CK", "C9", "C3"],
    explanation:
      "Unfortunately we can't play diamonds even though it looks natural to do so, the opponents have too many heart winners if we lose the lead, so we have to go after clubs.",
    difficulty: 1,
  },

];

export default CARD_RUSH_SEED_PUZZLES;

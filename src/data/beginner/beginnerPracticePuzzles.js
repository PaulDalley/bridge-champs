import { BDECL1_7_CUSTOM_PROMPTS } from "./bdecl1-7Rich";

/**
 * Beginner practical library — ONLY used by /beginner/practice/* routes.
 * Ids are beginner-only (bdecl…) so they never collide with main trainers.
 *
 * `playEngine: "compassClockwise"` — auto-follow uses true compass order (N→E→S→W) from the trick leader;
 * `playCardAutoFollowBySuit` keys must be N, E, S, W only. Legacy counting/defence puzzles stay unchanged.
 */

export const BEGINNER_DECLARER_PUZZLES = [
  {
    id: "bdecl1-1",
    difficulty: 1,
    playEngine: "compassClockwise",
    /** New puzzles: compass seats in data; converted to legacy seats at runtime (see CountingTrumpsTrainer). */
    seatMode: "compass",
    title: "Stage 1 — Three cards: win a trick, lead, win again",
    trumpSuit: "S",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    preserveEndStateAtDone: true,
    promptOptions: {
      contractLabel: "Introduction to Bridge",
      contractLabelBeforeStartOnly: true,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      hideAuction: true,
      customPrompts: [
        {
          id: "bdecl1-1-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "A bridge hand starts with 13 cards each, but we're just going to play with 3 for this hand, to get used to the flow of the game.",
        },
        {
          id: "bdecl1-1-trick1-beat-king",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText:
            "Let's win this trick — which card do you have that can beat the King?",
          playCardKeepExistingTrickCards: true,
          playCardRequireCorrect: true,
          expectedSuit: "S",
          expectedRank: "A",
          playCardContinueThroughRoundIdx: 0,
          playCardShowNextCustomPromptOnContinue: true,
          correctRevealText: "Nice — the Ace wins the trick.",
          wrongTryText: "Try again — you need a card higher than the King.",
          wrongRevealText: "The Ace is the only card here that beats the King.",
        },
        {
          id: "bdecl1-1-after-win-lead-info",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            'Great — now that you have won that trick, it\'s time for you to lead a card to the next trick. You can play either of your remaining cards.',
        },
        {
          id: "bdecl1-1-trick2-you-lead",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "Your lead — click a card to start the trick.",
          // Clear trick 1 from the table; learner starts a fresh trick (handled in PLAY_CARD effect when `before` is empty).
          playCardKeepExistingTrickCards: false,
          playCardRequireCorrect: false,
          playCardKeepStateOnContinue: true,
          playCardShowNextCustomPromptOnContinue: true,
          /** ms between each auto-played follow card (West → North → East) after your lead. */
          playCardAutoFollowStaggerMs: 580,
          playCardAutoFollowBySuit: {
            W: {
              S: { rank: "Q", suit: "S" },
            },
            N: {
              S: { rank: "6", suit: "S" },
            },
            E: {
              S: { rank: "9", suit: "S" },
            },
          },
          correctRevealText: "West takes the trick with the Queen.",
          wrongRevealText: "",
        },
        {
          id: "bdecl1-1-west-won-info",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "West won that trick with the Queen. It's now West's turn to lead — click ##Continue##, then use ##Next →## when you're ready to see the next trick.",
        },
        {
          id: "bdecl1-1-trick3-win-last",
          type: "PLAY_CARD",
          atRoundIdx: 1,
          promptText:
            "Your last card is about to win this trick — it's higher than the other cards on the table. Go ahead and play it!",
          playCardKeepExistingTrickCards: true,
          playCardRequireCorrect: true,
          expectedSuit: "S",
          correctRevealText: "Well done — you just played some bridge!",
          wrongTryText: "Play your last spade — it's your only card left.",
          wrongRevealText: "Play your remaining card to win the trick.",
          noContinue: true,
        },
      ],
    },
    shownHands: {
      south: { S: "AJT" },
      west: { S: "KQ2" },
    },
    rounds: [
      {
        label:
          "Trick 1 — West leads the ♠K; North plays low, East plays low (♠4 and ♠5)",
        // Omit South's card — learner plays the ♠A via PLAY_CARD (see bdecl1-1-trick1-beat-king).
        plays: [
          { seat: "W", card: { rank: "K", suit: "S" } },
          { seat: "N", card: { rank: "4", suit: "S" } },
          { seat: "E", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label:
          "Trick 3 — West leads a low spade; North plays low, East plays low",
        plays: [
          { seat: "W", card: { rank: "2", suit: "S" } },
          { seat: "N", card: { rank: "3", suit: "S" } },
          { seat: "E", card: { rank: "8", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "bdecl1-2",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "Stage 1 — Follow suit, then trump",
    trumpSuit: "H",
    contract: "1♥",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south"],
    preserveEndStateAtDone: true,
    promptOptions: {
      contractLabel: "Following suit",
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      hideAuction: true,
      customPrompts: [
        {
          id: "bdecl1-2-contract-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "In this hand, hearts are trumps.\n\nHow do we decide which suit is trumps? We will look at that very soon..",
        },
        {
          id: "bdecl1-2-trick1-follow-suit",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText:
            "[[ALERT]]Please play a card - one of the rules of bridge is that you must follow suit.[[/ALERT]]\n\nSince a spade was led, you must play a spade.",
          playCardKeepExistingTrickCards: true,
          playCardRequireCorrect: true,
          playCardContinueThroughRoundIdx: 0,
          expectedSuit: "S",
          correctRevealText: "Correct. You followed suit.",
          wrongTryText: "Try again - you must follow suit and play a spade.",
          wrongRevealText: "On this trick, you must follow suit and play a spade.",
        },
        {
          id: "bdecl1-2-trick2-trump",
          type: "PLAY_CARD",
          atRoundIdx: 1,
          promptText:
            "[[ALERT]]You do not have any more spades left. When that happens, you are allowed to play any card in your hand.[[/ALERT]]\n\nTry trumping this trick - trumps beat everything, except higher trumps.\n\n##Hint: hearts are trumps.##",
          playCardKeepExistingTrickCards: true,
          playCardRequireCorrect: true,
          playCardKeepStateOnContinue: true,
          playCardContinueThroughRoundIdx: 1,
          playCardShowNextCustomPromptOnContinue: true,
          expectedSuit: "H",
          correctRevealText: "Well done, you trumped it! You won the trick.\n\nExcellent play.",
          wrongTryText: "Try again - play a heart to trump this trick.",
          wrongRevealText: "Good try. Here, use a heart to trump and win the trick.",
        },
        {
          id: "bdecl1-2-lead-rule-info",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "This brings us to another important idea in bridge: whoever wins a trick plays first to the next one, and may start that trick with any card in their hand.\n\nAnd once again, everyone has to follow suit, if they can!",
        },
        {
          id: "bdecl1-2-lead-any-card",
          type: "PLAY_CARD",
          atRoundIdx: 1,
          promptText: "Your lead now - click any card in your hand to start the next trick.",
          playCardRequireCorrect: false,
          /** Match problem 1 — staggered follow; avoid duplicating the learner's card (e.g. no 5♦ if they lead 5♦). */
          playCardAutoFollowStaggerMs: 580,
          playCardAutoFollowBySuit: {
            W: {
              H: { rank: "5", suit: "H" },
              D: { rank: "3", suit: "D" },
              C: { rank: "5", suit: "C" },
              ANY: { rank: "5", suit: "C" },
            },
            N: {
              H: { rank: "2", suit: "H" },
              D: { rank: "2", suit: "D" },
              C: { rank: "2", suit: "C" },
              ANY: { rank: "2", suit: "C" },
            },
            E: {
              H: { rank: "4", suit: "H" },
              D: { rank: "4", suit: "D" },
              C: { rank: "4", suit: "C" },
              ANY: { rank: "4", suit: "C" },
            },
          },
          correctRevealText: "Well done — everyone followed suit.",
          noContinue: true,
        },
      ],
    },
    shownHands: {
      south: { S: "2", H: "AKQ987", D: "975", C: "864" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♠A)",
        plays: [
          { seat: "W", card: { rank: "A", suit: "S" } },
          { seat: "N", card: { rank: "6", suit: "S" } },
          { seat: "E", card: { rank: "4", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (West leads ♠K)",
        plays: [
          { seat: "W", card: { rank: "K", suit: "S" } },
          { seat: "N", card: { rank: "7", suit: "S" } },
          { seat: "E", card: { rank: "3", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "bdecl1-3",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "Stage 1 — Thanks, Dummy!",
    trumpSuit: "S",
    contract: "1♠",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["south", "north"],
    /** At DONE, keep the same two hands visible (do not expand to all four). */
    revealFullHandsAtEnd: ["south", "north"],
    preserveEndStateAtDone: true,
    promptOptions: {
      contractLabel: "Thanks Dummy!",
      contractLabelBeforeStartOnly: true,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      hideAuction: true,
      customPrompts: [
        {
          id: "bdecl1-3-dummy-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "In this problem you can click all the cards in your two hands.\n\n" +
            "In bridge there is a Dummy! Dummy puts their hand on the table for everyone to see.\n\n" +
            "Dummy sits there while their partner does all the work, choosing every card they play.",
        },
        {
          id: "bdecl1-3-play-king-dummy",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "Let's play the King from dummy.",
          playCardKeepExistingTrickCards: true,
          playCardNextClickFromDummy: true,
          playCardRequireCorrect: true,
          expectedSuit: "S",
          expectedRank: "K",
          wrongTryText: "Play the King from the dummy hand (North).",
          playCardAutoPlaysAfterDummy: [{ seat: "E", card: { rank: "7", suit: "S" } }],
          playCardAdvanceToNextCustomAfterDummyFollow: true,
        },
        {
          id: "bdecl1-3-partnership",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "In bridge we are working together with our partner — we are on the same team. " +
            "So far, partner's King is winning this trick — it's the highest card on the table.",
        },
        {
          id: "bdecl1-3-beat-partner-ace",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Is there any need to beat our partner's card by playing the Ace?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          revealText:
            "We are on the same team: we work together and share our winning trick count. " +
            "There is no need to beat partner's trick.\n\n" +
            "So let's just throw our lowest spade on this trick.",
        },
        {
          id: "bdecl1-3-south-follow",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "Please play a card.",
          playCardKeepExistingTrickCards: true,
          playCardRequireCorrect: true,
          expectedSuit: "S",
          expectedRank: "5",
          wrongTryText:
            "Try again — play your lowest spade. The King is winning this trick; save the Ace and Queen for later.",
          playCardKeepStateOnContinue: true,
          playCardShowNextCustomPromptOnContinue: true,
          correctRevealText: "Good — that completes the trick.",
        },
        {
          id: "bdecl1-3-trick2-from-dummy",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText:
            "Since dummy won this trick, the next trick starts from dummy.\n\n" +
            "Choose a card from dummy to lead.",
          playCardPromptTextDeclarerTurn: "Choose a card from your hand to play.",
          playCardKeepExistingTrickCards: false,
          playCardNextClickFromDummy: true,
          playCardRequireCorrect: false,
          playCardAutoPlaysAfterDummy: [{ seat: "E", card: { rank: "T", suit: "S" } }],
          playCardAutoPlayAfter: { seat: "W", card: { rank: "3", suit: "S" } },
          correctRevealText: "Nice work — you just played cards from dummy.",
          playCardEndHandAfterContinue: true,
        },
      ],
    },
    shownHands: {
      north: { S: "K98" },
      south: { S: "AQ5" },
      west: { S: "432" },
      east: { S: "JT7" },
    },
    rounds: [
      {
        label: "Trick 1 — West leads a spade",
        plays: [{ seat: "W", card: { rank: "4", suit: "S" } }],
      },
    ],
  },
  {
    id: "bdecl1-4",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "Stage 1 — The Bidding",
    trumpSuit: null,
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "?",
    visibleFullHandSeats: ["south"],
    preserveEndStateAtDone: true,
    rounds: [],
    shownHands: {
      south: { S: "AKQT98", H: "2", D: "KT9", C: "A87" },
    },
    promptOptions: {
      contractLabel: "The Bidding",
      contractLabelBeforeStartOnly: true,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      hideAuction: false,
      auctionResolvedText: "1S 2H P P P",
      auctionShowResolvedDuringInfoPromptId: "bdecl1-4-west-2h",
      auctionHighlightCall: { row: 1, seat: "W" },
      customPrompts: [
        {
          id: "bdecl1-4-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "Before we play any cards, the table has a discussion about what the trump suit will be. This is called the ##bidding##.",
        },
        {
          id: "bdecl1-4-we-bid",
          type: "INFO",
          atRoundIdx: -1,
          promptText: 'We don\'t just talk, discuss, or argue — we ##bid##!',
        },
        {
          id: "bdecl1-4-trump-think",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "Let's first ask: what do I ##want## the trump suit to be? Have a think.",
        },
        {
          id: "bdecl1-4-trump-count",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do you think it's good for you to have lots of trumps, or not many trumps?",
          options: [
            { id: "trumps_lots", label: "Lots" },
            { id: "trumps_few", label: "Not many" },
          ],
          expectedChoice: "trumps_lots",
          revealText:
            "The more trumps we have, along with our partner, the better. Trumps are great!",
        },
        {
          id: "bdecl1-4-choose-suit",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "So — what would you like the trump suit to be?",
        },
        {
          id: "bdecl1-4-dealer",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "In bridge, the ##dealer## has the right to bid first. You are dealer this hand.\n\n" +
            "Look at the ##Bidding## panel: there's a ##?## in your (South) column — that marks your first call. Let's make your first bid!",
        },
        {
          id: "bdecl1-4-opening-bid",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What is your first bid?",
          options: [
            { id: "open_1c", label: "1♣" },
            { id: "open_1d", label: "1♦" },
            { id: "open_1h", label: "1♥" },
            { id: "open_1s", label: "1♠" },
          ],
          expectedChoice: "open_1s",
          revealText:
            "##1♠## — with a long, strong spade suit, opening 1♠ is a natural way to start telling your story.",
        },
        {
          id: "bdecl1-4-west-2h",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##West## (the player on your left) has bid [[RING]]##2♥##[[/RING]]! He wants hearts to be trumps.\n\n" +
            "Your partner and the player on your right have ##passed## — follow the full auction in the panel (same call circled in West’s column).",
        },
        {
          id: "bdecl1-4-fight-or-pass",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Should we bid again, or pass?##\n\n" +
            "You'd like ##spades## to be trumps — but are you going to keep fighting for the contract? " +
            "And what happens when the bidding goes higher and higher? — to the two level, three level or further!\n\n" +
            "We'll keep exploring bidding in the next problems.",
        },
        {
          id: "bdecl1-4-outro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "There are a few more things to learn about the auction — but very soon you'll be ready to dive right in.",
        },
      ],
    },
  },
  {
    id: "bdecl1-5",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "Stage 1 — To bid or not to bid",
    trumpSuit: null,
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: null,
    visibleFullHandSeats: ["south"],
    preserveEndStateAtDone: true,
    rounds: [],
    shownHands: {
      south: { S: "A854", H: "K107", D: "Q32", C: "J54" },
    },
    promptOptions: {
      contractLabel: "To bid or not to bid",
      contractLabelBeforeStartOnly: true,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      hideAuction: true,
      customPrompts: [
        {
          id: "bdecl1-5-maths",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "If you don't like maths, don't worry: bridge doesn't have to feel very mathematical.\n\n" +
            "You ##do## need to be able to add up your points—but for most hands, that's as easy as counting to ##10##.",
        },
        {
          id: "bdecl1-5-hcp-scale",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Ace## — ##4## points\n\n" +
            "##King## — ##3## points\n\n" +
            "##Queen## — ##2## points\n\n" +
            "##Jack## — ##1## point",
        },
        {
          id: "bdecl1-5-count-points",
          type: "SINGLE_NUMBER",
          atRoundIdx: -1,
          promptText: "##How many HCP is this hand?##",
          expectedAnswer: 10,
          autoContinueOnCorrect: true,
          wrongTryText: "Not quite — try again.",
        },
        {
          id: "bdecl1-5-done",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Nice work## — that's ##10 HCP## in total. You're getting the hang of it, and you're ##almost ready to bid##.\n\n" +
            "Next, we'll look at ##what we do## with that point count.",
        },
      ],
    },
  },
  {
    id: "bdecl1-6",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "Stage 1 — What can I bid?",
    trumpSuit: null,
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: null,
    visibleFullHandSeats: ["south"],
    preserveEndStateAtDone: true,
    rounds: [],
    shownHands: {
      south: { S: "AK5", H: "QJ4", D: "T92", C: "8763" },
    },
    promptOptions: {
      contractLabel: "What can I bid?",
      contractLabelBeforeStartOnly: true,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      hideAuction: true,
      hidePlayDecisionHeading: true,
      customPrompts: [
        {
          id: "bdecl1-6-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "You probably already know most of the bidding rules from real life — we’ll connect them to the table step by step.\n\n" +
            "Picture a house auction: bidding opens at $1 million and climbs to $7 million. (Must be a nice house!)\n\n" +
            "[[ALERT]]\n" +
            "In bridge: the auction starts at the one level (your lowest bids) and runs up to the seven level — that’s the top of the auction.\n" +
            "[[/ALERT]]",
        },
        {
          id: "bdecl1-6-up-pass",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "In a house auction, if someone bids $2 million, you can’t go backwards to $1 million — the price only goes up until everyone stops.\n\n" +
            "[[ALERT]]\n" +
            "In bridge you can pass at any time — even before you’ve bid once. Pass simply means you are not bidding on this round.\n" +
            "[[/ALERT]]",
        },
        {
          id: "bdecl1-6-one-level",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "Back to the house: the auction might start at $1 million, but the next bid doesn’t have to be $2 million — it might be $1.1 million.\n\n" +
            "On the one level in bridge there are several different calls, not just one next step. They run from lowest ranking to highest — clubs first, then diamonds, hearts, spades, then no trumps:\n\n" +
            "1♣ → 1♦ → 1♥ → 1♠ → 1NT\n\n" +
            "[[ALERT]]\n" +
            "Clubs rank lowest, then diamonds, hearts, spades — so 1♣ is the lowest one-level suit bid, and 1♠ is the highest suit bid on that level. 1NT ranks higher than all the suits.\n" +
            "[[/ALERT]]",
        },
        {
          id: "bdecl1-6-two-level",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "If someone bids 1NT, any competing bids need to move to the 2 level or higher — you can’t stay on the one level forever.\n\n" +
            "[[ALERT]]\n" +
            "House analogy: if the bidding is near $1.9 million, the next serious offer might need to cross $2 million to stay in the fight.\n" +
            "[[/ALERT]]",
        },
        {
          id: "bdecl1-6-q1-1d-after-1h",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "If someone bids 1♥, can you now bid 1♦?",
          options: [
            { id: "Yes", label: "Yes" },
            { id: "No", label: "No" },
          ],
          expectedChoice: "No",
          wrongTryText: "Not quite — try again.",
          revealText:
            "No — remember the order is ♣ → ♦ → ♥ → ♠.\n\n" +
            "If you would like to bid diamonds, you can — but you will need to bid 2♦!",
        },
        {
          id: "bdecl1-6-q2-nt-vs-suits",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Does 1NT rank higher or lower than 1♣, 1♦, 1♥ and 1♠?",
          options: [
            { id: "Higher", label: "Higher" },
            { id: "Lower", label: "Lower" },
          ],
          expectedChoice: "Higher",
          wrongTryText: "Not quite — try again.",
          revealText:
            "Higher. No-trump outranks all the suits, so the highest bid on the one level is 1NT.",
        },
        {
          id: "bdecl1-6-q3-after-2nt",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What is the next highest bid after 2NT?",
          options: [
            { id: "2♠", label: "A. 2♠" },
            { id: "3♣", label: "B. 3♣" },
            { id: "1NT", label: "C. 1NT" },
          ],
          expectedChoice: "3♣",
          wrongTryText: "Not quite — try again.",
          revealText:
            "3♣ is the next highest bid. On the three level, the order is 3♣, 3♦, 3♥, 3♠, then 3NT.",
        },
        {
          id: "bdecl1-6-q4-win-auction",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "Is it always good to win the auction? (This hasn’t been covered yet — just take a guess.)",
          options: [
            { id: "Yes", label: "Yes" },
            { id: "No", label: "No" },
          ],
          expectedChoice: "No",
          wrongTryText: "Not quite — try again.",
          revealText:
            "No — just like in real life, you can bid too high. More on this to come, but remember: if you want to stop bidding, you can always pass.",
        },
      ],
    },
  },
  {
    id: "bdecl1-7",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "Stage 1 — The opening bid",
    trumpSuit: null,
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: null,
    visibleFullHandSeats: ["south"],
    preserveEndStateAtDone: true,
    rounds: [],
    shownHands: {
      south: { S: "642", H: "85", D: "AK1083", C: "KQ4" },
    },
    promptOptions: {
      contractLabel: "The opening bid",
      contractLabelBeforeStartOnly: true,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      hideAuction: true,
      hidePlayDecisionHeading: true,
      customPrompts: BDECL1_7_CUSTOM_PROMPTS,
    },
  },
];

export const BEGINNER_DEFENCE_PUZZLES = [];

export const BEGINNER_COUNTING_PUZZLES = [];

export const BEGINNER_BIDDING_PUZZLES = [];

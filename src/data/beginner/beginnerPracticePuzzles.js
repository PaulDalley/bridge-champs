/**
 * Beginner practical library — ONLY used by /beginner/practice/* routes.
 * Ids are beginner-only (bdecl…) so they never collide with main trainers.
 */

export const BEGINNER_DECLARER_PUZZLES = [
  {
    id: "bdecl1-1",
    difficulty: 1,
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
      contractLabel: "Introduction to Bridge — you are South (declarer)",
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
          playCardKeepExistingTrickCards: true,
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
              S: { rank: "5", suit: "S" },
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
            "West won that trick with the Queen. It's now West's turn to lead — click **Continue**, then use **Next →** when you're ready to see the next trick.",
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
        plays: [
          { seat: "W", card: { rank: "K", suit: "S" } },
          { seat: "N", card: { rank: "4", suit: "S" } },
          { seat: "E", card: { rank: "5", suit: "S" } },
          { seat: "S", card: { rank: "A", suit: "S" } },
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
    title: "Stage 1 — Follow suit, then trump",
    trumpSuit: "H",
    contract: "1♥",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    preserveEndStateAtDone: true,
    promptOptions: {
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      hideAuction: true,
      customPrompts: [
        {
          id: "bdecl1-2-contract-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "##Contract: 1 Heart##",
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
            "This leads us to another interesting thing about bridge - whoever wins the trick gets to lead to the next trick. That means they can play any card in their hand to start the next trick.\n\nAnd once again, everyone has to follow suit, if they can!",
        },
        {
          id: "bdecl1-2-lead-any-card",
          type: "PLAY_CARD",
          atRoundIdx: 1,
          promptText: "Your lead now - click any card in your hand to start the next trick.",
          playCardRequireCorrect: false,
          playCardAutoFollowBySuit: {
            DUMMY: {
              H: { rank: "2", suit: "H" },
              D: { rank: "2", suit: "D" },
              C: { rank: "2", suit: "C" },
              ANY: { rank: "2", suit: "C" },
            },
            LHO: {
              H: { rank: "4", suit: "H" },
              D: { rank: "4", suit: "D" },
              C: { rank: "4", suit: "C" },
              ANY: { rank: "4", suit: "C" },
            },
            RHO: {
              H: { rank: "5", suit: "H" },
              D: { rank: "5", suit: "D" },
              C: { rank: "5", suit: "C" },
              ANY: { rank: "5", suit: "C" },
            },
          },
          correctRevealText: "Great lead. Everyone followed suit.",
          noContinue: true,
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "2", H: "AKQ987", D: "975", C: "864" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♠A)",
        plays: [
          { seat: "RHO", card: { rank: "A", suit: "S" } },
          { seat: "DUMMY", card: { rank: "6", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (West leads ♠K)",
        plays: [
          { seat: "RHO", card: { rank: "K", suit: "S" } },
          { seat: "DUMMY", card: { rank: "7", suit: "S" } },
          { seat: "LHO", card: { rank: "3", suit: "S" } },
        ],
      },
    ],
  },
];

export const BEGINNER_DEFENCE_PUZZLES = [];

export const BEGINNER_COUNTING_PUZZLES = [];

export const BEGINNER_BIDDING_PUZZLES = [];

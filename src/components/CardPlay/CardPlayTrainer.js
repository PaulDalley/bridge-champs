import React from "react";
import CountingTrumpsTrainer from "../Counting/CountingTrumpsTrainer";

const CARDPLAY_PUZZLES_ALL = [
  {
    id: "cp1-1",
    difficulty: 1,
    title: "4♠: spade lead — ruffs or long suit?",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "E",
    declarerCompass: "E",
    viewerCompass: "E", // you are East, declaring
    // (auction hidden for this puzzle)
    auction: "1D P 1S P 1N P 2D P 2S P 4S P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/FFURF5yHtCs",
      customPrompts: [
        {
          id: "cp1-1-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This is pattern recognition practice. We won't play the hand out — we're just using the layout to train your eye. Take a good look at dummy and come up with an impression of the main theme.",
        },
        {
          id: "cp1-1-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "Is this the type of hand where you try to ruff stuff in dummy, or set up dummy’s long suit?",
          options: [
            { id: "ruffs", label: "Try to ruff stuff in dummy" },
            { id: "setup", label: "Set up dummy’s long suit" },
          ],
          expectedChoice: "setup",
          noContinue: true,
          revealText:
            "This meets the conditions for setting up a long suit.\n\n✓ Dummy has opening strength values\n✓ Dummy has a long suit\n\nIn these type of hands it is preferable to go after the long suit rather than look for ruffs.",
          videoUrl: "",
        },
      ],
    },
    // East/West cards only (You + Dummy).
    shownHands: {
      // East (You / Declarer)
      DECLARER: { S: "AQJ74", H: "532", D: "Q7", C: "A53" },
      // West (Dummy)
      DUMMY: { S: "K92", H: "Q7", D: "KJ652", C: "K84" },
    },
    // Question-only exercise: no animated play.
    rounds: [],
  },
  {
    id: "cp1-2",
    difficulty: 1,
    title: "2♠: plan after two club leads",
    trumpSuit: "S",
    contract: "2♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S", // you are South, declaring
    auction: "2♠",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "https://www.youtube.com/embed/ym_K5LU58P8",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-2-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "We'll look at a couple of tricks only. The main aim is again to build an impression of the main themes — pattern recognition. When you're ready, continue to the play.",
        },
        {
          id: "cp1-2-plan",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "At this point, what is your plan?",
          options: [
            { id: "setup_diamonds", label: "Try setup dummy’s long diamond suit" },
            { id: "draw_trumps", label: "Draw trumps" },
            { id: "ruff_hearts", label: "Ruff hearts" },
          ],
          expectedChoice: "ruff_hearts",
          noContinue: true,
          motivationText: "Nice work — keep practising these patterns. Reps build instincts.",
          videoUrl: "",
          revealText:
            "With this type of dummy it is typically best to go after ruffs, because\n\n✓ Dummy is weaker than opening values\n✓ Dummy has a shortage\n\nIt is worth noting — it’s typically not of much use to try setup a long suit in such a weak dummy.",
        },
      ],
    },
    shownHands: {
      // Dummy (North)
      DUMMY: { S: "J72", H: "2", D: "A7643", C: "7643" },
      // You (South)
      DECLARER: { S: "AK953", H: "A983", D: "Q2", C: "K2" },
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "LHO", card: { rank: "7", suit: "C" } },
          { seat: "DUMMY", card: { rank: "3", suit: "C" } },
          { seat: "RHO", card: { rank: "A", suit: "C" } }, // club to the Ace
          { seat: "DECLARER", card: { rank: "2", suit: "C" } }, // you play low
        ],
      },
      {
        label: "Trick 2",
        plays: [
          // RHO won Trick 1 with the Ace and continues clubs back.
          { seat: "RHO", card: { rank: "9", suit: "C" } },
          { seat: "DECLARER", card: { rank: "K", suit: "C" } }, // you win with the King
          { seat: "LHO", card: { rank: "5", suit: "C" } },
          { seat: "DUMMY", card: { rank: "4", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp1-3",
    difficulty: 1,
    title: "4♥: diamond lead — what at trick 2?",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1♥ P 2♥ P 4♥ P P P",
    promptOptions: {
      promptThemeTint: "knockAce",
      themeLabel: "Theme: Knocking out the Ace",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/ss01mt3cHmk",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-3-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "We'll only play out one trick here. The goal is to build your pattern recognition — get an impression of the main themes, then we'll ask what you'd do next.",
        },
        {
          id: "cp1-3-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "We won the first trick. What do we do at trick 2?",
          options: [
            { id: "spades", label: "Play spades" },
            { id: "hearts", label: "Play hearts" },
            { id: "diamonds", label: "Play diamonds" },
            { id: "clubs", label: "Play clubs" },
          ],
          expectedChoice: "spades",
          noContinue: true,
          wrongTryText: "Good try! Think about setting up your trick source first.",
          motivationText: "Well done — setting up your trick source first is a key habit.",
          revealText:
            "The right idea is to set up your trick source in spades first. Trick sources like that are often our #1 priority. We will try to get a ruff in dummy as well, but step 1 is often to set up your trick source.\n\nThis also lines up with the idea of \"drawing the ace\" — do not create any additional losers; just lose the ace you were always going to lose anyway.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "QJ3", H: "Q53", D: "82", C: "T8642" },
      DECLARER: { S: "K4", H: "AK9862", D: "A94", C: "A7" },
    },
    rounds: [
      {
        label: "Trick 1 (Q♦ lead)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp1-4",
    difficulty: 1,
    newUntil: "2026-03-25",
    title: "1NT: which suit creates no extra losers?",
    trumpSuit: "NT",
    contract: "1NT",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1NT P P P",
    promptOptions: {
      promptThemeTint: "knockAce",
      themeLabel: "Theme: Knocking out the Ace",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/Swmhaela-Ic",
      focusNote: "We are just looking at 2 suits for this question.",
      customPrompts: [
        {
          id: "cp1-4-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "This is a quick visual puzzle. Glance at the hand and decide which suit you can aim to play without creating extra losers.",
        },
        {
          id: "cp1-4-suit",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Which suit can you aim to play without creating extra losers?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
          ],
          expectedChoice: "spades",
          noContinue: true,
          revealText:
            "Spades.\n\nThis is a classic case of \"knocking out the Ace\". In spades you only lose the Ace you were always going to lose. In hearts, by contrast, you risk losing the Queen — which the defence otherwise have no chance of scoring on their own if you do not play the suit.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "KQJ2", H: "AJ543", D: "", C: "" },
      DECLARER: { S: "876", H: "KT9", D: "", C: "" },
    },
    rounds: [],
  },
  {
    id: "cp1-5",
    difficulty: 1,
    title: "1NT: focus on spades — knock out the Ace and King",
    newUntil: "2026-03-25",
    trumpSuit: "NT",
    contract: "1NT",
    auction: "1NT P P P",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    promptOptions: {
      promptThemeTint: "knockAce",
      themeLabel: "Theme: Knocking out the Ace",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-5-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "Before we play the hand, let's get our pattern recognition going. We first want to consider playing a suit that does NOT create any extra losers.",
        },
        {
          id: "cp1-5-suit",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Which suit is that?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "spades",
          noContinue: false,
          motivationText: "Exactly! Well done.",
          revealText:
            "Spades! Our eyes need to first focus on spades. We would like to \"knock out the Ace\" and king, thereby opening up a trick source.",
          videoUrl: "",
        },
        {
          id: "cp1-5-now-1",
          type: "PLAY_DECISION",
          atRoundIdx: 4,
          promptText: "What do we play now?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "spades",
          noContinue: false,
          wrongTryText:
            "If we had played diamonds, we may have lost to the Queen and gone down. By playing spades we ensure our contract.",
          motivationText: "Spades — we need to knock out the Ace and King.",
          revealText: "Spades! We need to knock out the Ace and King to set up our trick source.",
        },
        {
          id: "cp1-5-now-2",
          type: "PLAY_DECISION",
          atRoundIdx: 6,
          promptText: "So what do we play now?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "spades",
          noContinue: true,
          revealText:
            "We need to keep going with spades — we have almost created those two extra tricks, without creating any extra losers. Well done!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "QJT9", H: "8765", D: "KT2", C: "32" },
      DECLARER: { S: "76", H: "5432", D: "AJ98", C: "AKQ" },
      LHO: { S: "A54", H: "AKQJ", D: "Q43", C: "8765" },
      RHO: { S: "K832", H: "9", D: "7652", C: "JT94" },
    },
    rounds: [
      {
        label: "Trick 1 (West cashes ♥A)",
        plays: [
          { seat: "LHO", card: { rank: "A", suit: "H" } },
          { seat: "DUMMY", card: { rank: "8", suit: "H" } },
          { seat: "RHO", card: { rank: "9", suit: "H" } },
          { seat: "DECLARER", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (West cashes ♥K)",
        plays: [
          { seat: "LHO", card: { rank: "K", suit: "H" } },
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "8", suit: "S" }, showOut: true },
          { seat: "DECLARER", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (West cashes ♥Q)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "H" } },
          { seat: "DUMMY", card: { rank: "6", suit: "H" } },
          { seat: "RHO", card: { rank: "3", suit: "S" }, showOut: true },
          { seat: "DECLARER", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (West cashes ♥J)",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "H" } },
          { seat: "DUMMY", card: { rank: "5", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "S" }, showOut: true },
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (West plays a club, South wins)",
        plays: [
          { seat: "LHO", card: { rank: "8", suit: "C" } },
          { seat: "DUMMY", card: { rank: "3", suit: "C" } },
          { seat: "RHO", card: { rank: "J", suit: "C" } },
          { seat: "DECLARER", card: { rank: "A", suit: "C" } },
        ],
      },
      {
        label: "Trick 6 (We play a spade, they win)",
        plays: [
          { seat: "DECLARER", card: { rank: "7", suit: "S" } },
          { seat: "LHO", card: { rank: "5", suit: "S" } },
          { seat: "DUMMY", card: { rank: "9", suit: "S" } },
          { seat: "RHO", card: { rank: "K", suit: "S" } },
        ],
      },
      {
        label: "Trick 7 (They play a club, South wins)",
        plays: [
          { seat: "RHO", card: { rank: "T", suit: "C" } },
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
          { seat: "LHO", card: { rank: "7", suit: "C" } },
          { seat: "DUMMY", card: { rank: "2", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp1-6",
    difficulty: 1,
    title: "3NT: heart lead — what suit do you play?",
    newUntil: "2026-04-15",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    promptOptions: {
      promptThemeTint: "knockAce",
      themeLabel: "Theme: Knocking out the Ace",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-6-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This is also a quick problem that combines pattern recognition along with some simple counting.",
        },
        {
          id: "cp1-6-suit",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "What suit do you play?",
          options: [
            { id: "hearts", label: "Hearts" },
            { id: "spades", label: "Spades" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "clubs",
          noContinue: true,
          revealText:
            "It is correct to play Clubs. Bridge is a game that changes from hand to hand. The diamond suit is an excellent candidate for setting up tricks without creating extra losers.\n\nUnfortunately we do not have the luxury of \"time\". If we lose the lead, the opponents will cash 4 hearts (as well as the Ace of diamonds) and we will go 1 down.\n\nSo cash the ♣ King and then take the club finesse — hope it works. If it doesn't, at least you gave yourself a chance!\n\nYou plan to make 3 spade tricks, 1 heart, 5 clubs for a total of 9 tricks.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "K92", H: "76", D: "762", C: "AJT84" },
      DECLARER: { S: "AQ32", H: "K4", D: "KQJT", C: "K93" },
      LHO: { S: "876", H: "9532", D: "985", C: "Q76" },
      RHO: { S: "JT5", H: "AQ982", D: "A43", C: "98" },
    },
    rounds: [
      {
        label: "Trick 1 (♥5 lead to the Ace)",
        plays: [
          { seat: "LHO", card: { rank: "5", suit: "H" } },
          { seat: "DUMMY", card: { rank: "6", suit: "H" } },
          { seat: "RHO", card: { rank: "A", suit: "H" } },
          { seat: "DECLARER", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (Heart back, your King wins)",
        plays: [
          { seat: "RHO", card: { rank: "9", suit: "H" } },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp1-7",
    difficulty: 1,
    newUntil: "2026-04-30",
    title: "2♠: ruff in dummy before drawing trumps",
    trumpSuit: "S",
    contract: "2♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    promptOptions: {
      promptThemeTint: "drawTrumps",
      themeLabel: "Theme: Drawing and not drawing trumps",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      startAutoPlayThroughRoundIdx: 0,
      watchNote: "Watch what happens if we try to cross to dummy in order to play a heart to our King. To get the play going",
      watchNoteOnlyAfterPlayCardReveal: true,
      customPrompts: [
        {
          id: "cp1-7-trick2",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "Please play your trick 2 card by clicking on it.",
          expectedSuit: "H",
          correctRevealText: "Well done!",
          wrongRevealText: "Good try, that looks logical but it doesn't work.",
          revealText:
            "We must get our heart ruffs going straight away by playing a heart at trick 2!\n\nThis is a typical \"ruff stuff in dummy before drawing trumps\".\n\nIt is important to do that before drawing ANY trumps.\n\nWere you thinking of crossing to dummy with a spade to play a heart up to the King?\n\nWatch what happens if we do that.",
          noContinue: false,
          motivationText: "",
        },
        {
          id: "cp1-7-note",
          type: "INFO",
          atRoundIdx: 5,
          promptText:
            "Now we don't get any ruffs! The defenders drew the rest of our trumps.\n\nPlaying even one trump is an error. When we say \"ruff in dummy before drawing trumps\", we often mean before drawing any trumps.\n\nKeep going — you're building good habits.",
        },
      ],
    },
    shownHands: {
      LHO: { S: "854", H: "AQ10", D: "J1098", C: "J96" },
      DUMMY: { S: "AK2", H: "43", D: "Q432", C: "Q432" },
      RHO: { S: "653", H: "9872", D: "A76", C: "AKT8" },
      DECLARER: { S: "QJT97", H: "K432", D: "A2", C: "32" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (J♦ lead, low from dummy, low from East — you win the Ace)",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Spade to the Ace)",
        plays: [
          { seat: "DECLARER", card: { rank: "7", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "S" } },
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (Heart to the King — loses to West's Ace)",
        plays: [
          { seat: "DUMMY", card: { rank: "3", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "H" } },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "A", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (West leads another spade — you win with the Queen)",
        plays: [
          { seat: "LHO", card: { rank: "5", suit: "S" } },
          { seat: "DUMMY", card: { rank: "2", suit: "S" } },
          { seat: "RHO", card: { rank: "6", suit: "S" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (You play another heart — West wins)",
        plays: [
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
          { seat: "LHO", card: { rank: "Q", suit: "H" } },
          { seat: "DUMMY", card: { rank: "4", suit: "H" } },
          { seat: "RHO", card: { rank: "7", suit: "H" } },
        ],
      },
      {
        label: "Trick 6 (West leads third spade — East discards a club)",
        plays: [
          { seat: "LHO", card: { rank: "8", suit: "S" } },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "2", suit: "C" }, showOut: true },
          { seat: "DECLARER", card: { rank: "9", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "cp1-8",
    difficulty: 1,
    newUntil: "2026-04-30",
    title: "6♠: club lead — what at trick 2?",
    trumpSuit: "S",
    contract: "6♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "drawTrumps",
      themeLabel: "Theme: Drawing and not drawing trumps",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-8-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "You pick up a beautiful 23 point hand, and end up in the contract of 6♠.",
        },
        {
          id: "cp1-8-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What is our plan?",
          options: [
            { id: "setup_clubs", label: "Setup the long clubs" },
            { id: "ruff_stuff", label: "Ruff stuff in dummy" },
            { id: "draw_trumps", label: "Just draw trumps" },
          ],
          expectedChoice: "ruff_stuff",
          noContinue: false,
          revealText:
            "It's too weak for setting up the club suit, but it is useful for ruffing stuff!",
        },
        {
          id: "cp1-8-ruff-what",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What are we going to ruff?",
          options: [
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "diamonds",
          noContinue: false,
          revealText:
            "We will aim to ruff a diamond. On this hand we will \"create a shortage\" in dummy, by pitching dummy's diamonds on our setup heart tricks.",
        },
        {
          id: "cp1-8-draw-trumps",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Finally, last piece of the puzzle. Can we start by drawing any trumps?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: false,
          continueButtonLabel: "Show me the play",
          revealText:
            "No — if we draw a trump, the opponents can draw a second trump after we knock out the ♥A. So, we table a heart at trick 2, and follow the rule \"Ruff stuff in dummy BEFORE drawing trumps\".",
        },
        {
          id: "cp1-8-shortage-message",
          type: "INFO",
          atRoundIdx: 4,
          promptText: "This is the key, \"creating a shortage\" in diamonds.",
        },
        {
          id: "cp1-8-draw-trumps-done",
          type: "INFO",
          atRoundIdx: 8,
          promptText: "Now we just draw trumps, making our contract.",
        },
      ],
    },
    shownHands: {
      LHO: { S: "854", H: "A862", D: "864", C: "JT9" },
      DUMMY: { S: "82", H: "43", D: "A32", C: "J98765" },
      RHO: { S: "63", H: "9875", D: "9752", C: "876" },
      DECLARER: { S: "AKQJT9", H: "KQJ", D: "K32", C: "A" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    // RULE: Every trick's plays array MUST be in clockwise order: leader first, then next player clockwise (N→E→S→W). Leader = who won previous trick (trick 1 = opening leader).
    rounds: [
      {
        label: "Trick 1 (Club lead, you win with the Ace)",
        plays: [
          { seat: "LHO", card: { rank: "9", suit: "C" } },
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
          { seat: "RHO", card: { rank: "6", suit: "C" } },
          { seat: "DECLARER", card: { rank: "A", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (Heart lead, Ace wins)",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "A", suit: "H" } },
          { seat: "DUMMY", card: { rank: "3", suit: "H" } },
          { seat: "RHO", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (Spade back, you win Ace, dummy plays 2♠)",
        plays: [
          { seat: "LHO", card: { rank: "4", suit: "S" } },
          { seat: "DUMMY", card: { rank: "2", suit: "S" } },
          { seat: "RHO", card: { rank: "6", suit: "S" } },
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (Queen of hearts, both follow)",
        plays: [
          { seat: "DECLARER", card: { rank: "Q", suit: "H" } },
          { seat: "LHO", card: { rank: "6", suit: "H" } },
          { seat: "DUMMY", card: { rank: "4", suit: "H" } },
          { seat: "RHO", card: { rank: "7", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (Jack of hearts, both follow, pitch diamond from dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "J", suit: "H" } },
          { seat: "LHO", card: { rank: "2", suit: "H" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "8", suit: "H" } },
        ],
      },
      {
        label: "Trick 6 (South leads diamond, dummy wins with Ace)",
        plays: [
          { seat: "DECLARER", card: { rank: "2", suit: "D" } },
          { seat: "LHO", card: { rank: "4", suit: "D" } },
          { seat: "DUMMY", card: { rank: "A", suit: "D" } },
          { seat: "RHO", card: { rank: "5", suit: "D" } },
        ],
      },
      {
        label: "Trick 7 (Dummy leads 3♦, declarer wins K♦)",
        plays: [
          { seat: "DUMMY", card: { rank: "3", suit: "D" } },
          { seat: "RHO", card: { rank: "7", suit: "D" } },
          { seat: "DECLARER", card: { rank: "K", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
        ],
      },
      {
        label: "Trick 8 (Diamond ruffed with 8♠ in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "3", suit: "D" } },
          { seat: "LHO", card: { rank: "8", suit: "D" } },
          { seat: "DUMMY", card: { rank: "8", suit: "S" } },
          { seat: "RHO", card: { rank: "9", suit: "D" } },
        ],
      },
      {
        label: "Trick 9 (Club from dummy, spade from hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "6", suit: "C" } },
          { seat: "RHO", card: { rank: "7", suit: "C" } },
          { seat: "DECLARER", card: { rank: "9", suit: "S" } },
          { seat: "LHO", card: { rank: "T", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp2-2",
    difficulty: 2,
    title: "4♠: diamond lead — goal and trick 2",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1♠ P 2♠ P 4♠ P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-2-goal",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What is your main goal?",
          options: [
            { id: "ruff_diamonds", label: "To ruff diamonds in dummy" },
            { id: "setup_hearts", label: "To set up hearts" },
          ],
          expectedChoice: "setup_hearts",
          motivationText: "Right — dummy has opening values and a long suit. Go after the long suit!",
          revealText:
            "Set up hearts. Since dummy has opening values and a long suit (5+ cards), it's very often a good idea to go after the long suit!",
          videoUrl: "",
        },
        {
          id: "cp2-2-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "At trick 2, should we draw some trumps or go after hearts before drawing any trumps?",
          options: [
            { id: "draw_trumps", label: "Draw some trumps" },
            { id: "play_heart", label: "Play a heart" },
          ],
          expectedChoice: "play_heart",
          noContinue: true,
          motivationText: "Using entries productively is a key habit.",
          revealText:
            "Play a heart. There are two very good reasons for this.\n\nReason 1 — We often set up our long suits before drawing trumps. More than 50% of the time we delay drawing trumps for this reason. If in doubt, go after the long suit first.\n\nReason 2 — We want to use our entries productively. We are in dummy and poised to play a heart towards the Jack. Let's not squander that entry by playing a trump — which is something we can do from either hand. Put simply, use our entries productively: do something from hand that we can't do from the other hand — play a heart!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "KQJT", H: "AJT92", D: "2", C: "654" },
      DECLARER: { S: "A987", H: "653", D: "A43", C: "A32" },
    },
    rounds: [
      {
        label: "Trick 1 (Q♦ lead)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp2-1",
    difficulty: 2,
    title: "3NT: club lead — hearts or spades?",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S", // you are South, declaring
    auction: "1N P 3N P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-1-hearts",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText:
            "That heart suit looks very tempting. Are you going to play it",
          options: [
            { id: "immediately", label: "1. Immediately" },
            { id: "next_trick_or_two", label: "2. Within the next trick or 2" },
            { id: "not_at_all", label: "3. Not at all" },
          ],
          expectedChoice: "not_at_all",
          noContinue: true,
          motivationText: "Nice work — keep practising these patterns.",
          revealText:
            "Not at all. The key concept is to not create any extra losers. Knock out the aces and kings in the correct order: start with diamonds, then spades. Play your 3–2 spade fit, not your 5–3 heart fit — spades don’t create extra losers, whereas hearts might.\n\nIn the end you make 3 clubs, 3 diamonds, 2 hearts (A and K), 1 spade. You lose the A and K of spades, A of diamonds, A of clubs.",
        },
      ],
    },
    shownHands: {
      // North (Dummy): Qxx AJ8xx K10x xx
      DUMMY: { S: "Q32", H: "AJ876", D: "KT2", C: "65" },
      // South (You / Declarer): J10 K109 QJxx KQJx
      DECLARER: { S: "JT", H: "KT9", D: "QJ98", C: "KQJ7" },
    },
    rounds: [
      {
        label: "Trick 1 (2♣ to the Ace)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "C" } },
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
          { seat: "RHO", card: { rank: "A", suit: "C" } },
          { seat: "DECLARER", card: { rank: "7", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (club back)",
        plays: [
          { seat: "RHO", card: { rank: "3", suit: "C" } },
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
          { seat: "LHO", card: { rank: "4", suit: "C" } },
          { seat: "DUMMY", card: { rank: "6", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp2-3",
    difficulty: 2,
    title: "4♥: diamond lead — what at trick 2?",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1♥ 2♦ 4♥ P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-3-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Lead is queen of diamonds, won by the ace. What do you play at trick 2?",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "club",
          noContinue: true,
          wrongTryText: "Good try! Think about where your tricks will come from — the long club suit is the key.",
          revealText:
            "Play a club. Is ruffing a tempting idea? It shouldn't be — go for the long club suit; that's what yields the best results.\n\nIs drawing trumps the obvious move? Even with 9 trumps, we should lay off the trumps till we have set up the clubs, or at least started them. Trumps are also entries, which you may need to either hand. Laying off trumps keeps you flexible to begin with.\n\nFire off a club, confidently begin to set up your long suit!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "Q2", H: "A432", D: "2", C: "KT9876" },
      DECLARER: { S: "A32", H: "KT987", D: "AK2", C: "32" },
    },
    rounds: [
      {
        label: "Trick 1 (Q♦ lead)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp2-4",
    difficulty: 2,
    title: "4♠: club lead — what's the key theme?",
    newUntil: "2026-04-01",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1♠ P 2♠ P 4♠ P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-4-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This was a hand from recent play where a top international expert went wrong.\n\nThis is a quick problem, to help improve your pattern recognition, we won't play the hand out.",
        },
        {
          id: "cp2-4-theme",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Glance at dummy and try to figure out what the key theme is.",
          options: [
            { id: "setup_side", label: "Setup side suit" },
            { id: "draw_trumps", label: "Draw trumps" },
            { id: "setup_tricks", label: "Setup trick sources" },
            { id: "ruff_dummy", label: "Ruff stuff in dummy" },
          ],
          expectedChoice: "ruff_dummy",
          noContinue: true,
          revealText:
            "Ruff stuff in dummy. This hand is all about ruffing a diamond in dummy. Cash ♦A and ♦K, then play a diamond and ruff in dummy. Don't draw any trumps first — if you do, the defence can continue trumps and prevent you getting the ruff.\n\nRuff stuff in dummy does not always mean a singleton or doubleton in dummy!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "A98", H: "AQT", D: "762", C: "AT84" },
      DECLARER: { S: "QJT73", H: "43", D: "AKJ4", C: "K3" },
      LHO: { S: "652", H: "986", D: "QT98", C: "762" },
      RHO: { S: "K4", H: "KJ752", D: "53", C: "QJ98" },
    },
    rounds: [
      {
        label: "Trick 1 (2♣ lead, East plays 9, you play the K)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "C" } },
          { seat: "DUMMY", card: { rank: "4", suit: "C" } },
          { seat: "RHO", card: { rank: "9", suit: "C" } },
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp2-5",
    difficulty: 2,
    title: "3NT: use your entries productively",
    newUntil: "2026-04-30",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "W",
    declarerCompass: "W",
    viewerCompass: "W",
    auction: "1NT P 3NT P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "",
      startAutoPlayThroughRoundIdx: 1,
      customPrompts: [
        {
          id: "cp2-5-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This was a hand from the 2026 US National in St Louis. One player made it while the other didn't.\n\nThe key theme is — always use your entries productively. When you are in a hand, ask yourself: what can I do from this hand that I can't do from the other hand?",
        },
        {
          id: "cp2-5-trick3",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "What do we play now?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "hearts",
          noContinue: true,
          wrongTryText: "Think: what suit can we play to good effect from dummy that we can't play from our own hand?",
          motivationText: "",
          revealText:
            "Hearts. Lead low from dummy towards your QJx — you may need to do it twice. Use this entry while you have it; treat every entry like gold!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "AT6", H: "9874", D: "AT72", C: "T5" },
      DECLARER: { S: "QJ85", H: "QJ3", D: "84", C: "AKQJ" },
    },
    rounds: [
      {
        label: "Trick 1 (King of diamonds, all small)",
        plays: [
          { seat: "LHO", card: { rank: "K", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "4", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Queen of diamonds, Ace wins)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "A", suit: "D" } },
          { seat: "RHO", card: { rank: "6", suit: "D" } },
          { seat: "DECLARER", card: { rank: "8", suit: "D" } },
        ],
      },
    ],
  },
];

const CARDPLAY_PUZZLES = CARDPLAY_PUZZLES_ALL;

function isPuzzleNew(puzzle) {
  return !!(puzzle && puzzle.newUntil && new Date() < new Date(puzzle.newUntil));
}

export const CARDPLAY_HAS_NEW = CARDPLAY_PUZZLES.some(isPuzzleNew);

function CardPlayTrainer() {
  return <CountingTrumpsTrainer puzzlesOverride={CARDPLAY_PUZZLES} trainerLabel="Declarer Play" categoryKey="declarer" />;
}

export default CardPlayTrainer;


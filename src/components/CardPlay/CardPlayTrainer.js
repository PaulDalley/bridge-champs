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
      videoUrlBeforeStart: "https://youtube.com/shorts/TtJjusUvE1k",
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
      videoUrlBeforeStart: "https://youtube.com/shorts/lf4rid34UWI",
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
      videoUrlBeforeStart: "https://youtube.com/shorts/_wLCdwVH2Ro",
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
      LHO: { S: "865", H: "AQJT", D: "KJ9", C: "AT8" },
      DUMMY: { S: "AK2", H: "97", D: "Q864", C: "Q732" },
      RHO: { S: "43", H: "652", D: "T532", C: "KJ96" },
      DECLARER: { S: "QJT97", H: "K843", D: "A7", C: "54" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (J♦ lead, low from dummy, low from East — you win the Ace)",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "D" } },
          { seat: "DUMMY", card: { rank: "4", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Spade to the Ace)",
        plays: [
          { seat: "DECLARER", card: { rank: "7", suit: "S" } },
          { seat: "LHO", card: { rank: "8", suit: "S" } },
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (Heart to the King — loses to West's Ace)",
        plays: [
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
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
          { seat: "RHO", card: { rank: "4", suit: "S" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (You play another heart — West wins)",
        plays: [
          { seat: "DECLARER", card: { rank: "4", suit: "H" } },
          { seat: "LHO", card: { rank: "Q", suit: "H" } },
          { seat: "DUMMY", card: { rank: "9", suit: "H" } },
          { seat: "RHO", card: { rank: "6", suit: "H" } },
        ],
      },
      {
        label: "Trick 6 (West leads third spade — East discards a club)",
        plays: [
          { seat: "LHO", card: { rank: "6", suit: "S" } },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "9", suit: "C" }, showOut: true },
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
      videoUrlBeforeStart: "https://youtube.com/shorts/lIEdLDG0Yyw",
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
      LHO: { S: "754", H: "AT62", D: "864", C: "JT9" },
      DUMMY: { S: "82", H: "43", D: "AT3", C: "85432" },
      RHO: { S: "63", H: "9875", D: "Q975", C: "KQ76" },
      DECLARER: { S: "AKQJT9", H: "KQJ", D: "KJ2", C: "A" },
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
          { seat: "DUMMY", card: { rank: "3", suit: "D" } },
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
        label: "Trick 7 (Dummy leads 10♦, declarer wins K♦)",
        plays: [
          { seat: "DUMMY", card: { rank: "T", suit: "D" } },
          { seat: "RHO", card: { rank: "7", suit: "D" } },
          { seat: "DECLARER", card: { rank: "K", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
        ],
      },
      {
        label: "Trick 8 (Diamond ruffed with 8♠ in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "J", suit: "D" } },
          { seat: "LHO", card: { rank: "8", suit: "D" } },
          { seat: "DUMMY", card: { rank: "8", suit: "S" } },
          { seat: "RHO", card: { rank: "9", suit: "D" } },
        ],
      },
      {
        label: "Trick 9 (Club from dummy, spade from hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "8", suit: "C" } },
          { seat: "RHO", card: { rank: "7", suit: "C" } },
          { seat: "DECLARER", card: { rank: "9", suit: "S" } },
          { seat: "LHO", card: { rank: "T", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp1-9",
    difficulty: 1,
    newUntil: "2026-04-30",
    title: "6♣: diamond lead — can we just draw trumps?",
    trumpSuit: "C",
    contract: "6♣",
    dealerCompass: "S",
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
      videoUrlBeforeStart: "https://youtube.com/shorts/Y0b3rq-rKtQ",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-9-intro-1",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "This is a hand from the 2023 Gold Coast round of 4, where a player from the team that won the entire event managed to go down in 6♣.",
        },
        {
          id: "cp1-9-intro-2",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "I've been trying to train your instincts to appreciate that very often we want to ruff stuff in dummy before drawing trumps. However, even though that is my instinct, I always ask myself one question:\n\n##Can I just draw trumps?##",
        },
        {
          id: "cp1-9-q1",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Can I just draw trumps?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: false,
          revealText:
            "Yes. The key is counting tricks.\n\nIf trumps break 3-1, we still have 12 tricks: 5 clubs, 2 spades, 1 heart, 3 diamonds, and 1 spade ruff.\n\nSo we can safely draw trumps.\n\nOn this deal trumps broke 2-2, so declarer should make 13 tricks.",
        },
        {
          id: "cp1-9-how-ruff",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "Wait but how did we ruff a spade, dummy has 3?",
        },
        {
          id: "cp1-9-watch-prompt",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "We pitched a spade on our diamond, once again we \"created the shortage\".",
          continueButtonLabel: "watch the play",
        },
        {
          id: "cp1-9-critical-moment",
          type: "INFO",
          atRoundIdx: 4,
          promptText: "This is the critical moment, we \"create a shortage\".",
        },
        {
          id: "cp1-9-end-message",
          type: "INFO",
          atRoundIdx: 8,
          promptText: "There are no trumps out, you have the rest.",
        },
      ],
    },
    shownHands: {
      LHO: { S: "QT632", H: "987", D: "J62", C: "Q2" },
      DUMMY: { S: "K98", H: "AJT53", D: "K3", C: "754" },
      RHO: { S: "J", H: "KQ642", D: "T9875", C: "T9" },
      DECLARER: { S: "A754", H: "", D: "AQ4", C: "AKJ863" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (Diamond lead, king wins in dummy)",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "D" } },
          { seat: "DUMMY", card: { rank: "K", suit: "D" } },
          { seat: "RHO", card: { rank: "5", suit: "D" } },
          { seat: "DECLARER", card: { rank: "4", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Ace of clubs)",
        plays: [
          { seat: "DUMMY", card: { rank: "4", suit: "C" } },
          { seat: "RHO", card: { rank: "9", suit: "C" } },
          { seat: "DECLARER", card: { rank: "A", suit: "C" } },
          { seat: "LHO", card: { rank: "2", suit: "C" } },
        ],
      },
      {
        label: "Trick 3 (King of clubs)",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
          { seat: "LHO", card: { rank: "Q", suit: "C" } },
          { seat: "DUMMY", card: { rank: "7", suit: "C" } },
          { seat: "RHO", card: { rank: "T", suit: "C" } },
        ],
      },
      {
        label: "Trick 4 (Ace of diamonds)",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
          { seat: "LHO", card: { rank: "2", suit: "D" } },
          { seat: "DUMMY", card: { rank: "3", suit: "D" } },
          { seat: "RHO", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 5 (Queen of diamonds, pitch a spade from dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "Q", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
          { seat: "DUMMY", card: { rank: "8", suit: "S" } },
          { seat: "RHO", card: { rank: "8", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (King of spades)",
        plays: [
          { seat: "DECLARER", card: { rank: "4", suit: "S" } },
          { seat: "LHO", card: { rank: "2", suit: "S" } },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "J", suit: "S" } },
        ],
      },
      {
        label: "Trick 7 (Ace of spades)",
        plays: [
          { seat: "DUMMY", card: { rank: "9", suit: "S" } },
          { seat: "RHO", card: { rank: "2", suit: "H" }, showOut: true },
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
          { seat: "LHO", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 8 (Spade ruffed in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "5", suit: "S" } },
          { seat: "LHO", card: { rank: "6", suit: "S" } },
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
          { seat: "RHO", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 9 (Ace of hearts, pitch a spade)",
        plays: [
          { seat: "DUMMY", card: { rank: "A", suit: "H" } },
          { seat: "RHO", card: { rank: "K", suit: "H" } },
          { seat: "DECLARER", card: { rank: "7", suit: "S" } },
          { seat: "LHO", card: { rank: "7", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp1-10",
    difficulty: 1,
    newUntil: "2026-04-30",
    title: "4♥: heart lead — Ruffing a lot (cross ruffing)",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "ruffingLot",
      themeLabel: "Theme: Ruffing a lot (cross ruffing)",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/1P949kKAanI",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-10-intro-1",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Continue",
          promptText:
            "These problems look at hands where \"Ruffing a lot\" might be a good idea, or might not.\n\nLet's build this into our pattern recognition.\n\nI call it \"ruffing a lot\", but similar ideas are often called \"cross ruffing\".",
        },
        {
          id: "cp1-10-intro-2",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "What are the first thoughts that come to mind when looking at this?\n\nA common first thought is: \"There is a 5-card suit, and I want to think about setting that up.\"\n\nHowever, sometimes we can count enough tricks on a cross ruff.",
        },
        {
          id: "cp1-10-intro-3",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "The typical features of a cross ruff include:\n\n✓ High trumps — often (not always) we need strong trumps so we can't get overruffed.\n✓ Few side winners — not many tricks to set up outside trumps; usually just a few cashable aces and kings.\n✓ Cash first, then ruff — use those winners before ruffing everything, or you might not get to cash them later.",
        },
        {
          id: "cp1-10-watch",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Watch the play",
          promptText: "This hand is a very beautiful example of a cross ruff.",
        },
        {
          id: "cp1-10-cash-winners",
          type: "INFO",
          atRoundIdx: 2,
          continueButtonLabel: "Continue",
          promptText:
            "As you can see, we first cash our winners in the side suits before embarking on a cross ruff.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "K432", H: "AQ84", D: "8", C: "A432" },
      DECLARER: { S: "", H: "KJT97", D: "A5432", C: "Q32" },
      LHO: { S: "A9865", H: "6532", D: "K863", C: "7" },
      RHO: { S: "QJT7", H: "", D: "QT97", C: "KJT986" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (Heart lead shown on table)",
        plays: [{ seat: "LHO", card: { rank: "2", suit: "H" } }],
      },
      {
        label: "Trick 1 (continued — win the lead in hand)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "H" } },
          { seat: "DUMMY", card: { rank: "4", suit: "H" } },
          { seat: "RHO", card: { rank: "8", suit: "C" }, showOut: true },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (Ace of diamonds, all follow)",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
          { seat: "LHO", card: { rank: "3", suit: "D" } },
          { seat: "DUMMY", card: { rank: "8", suit: "D" } },
          { seat: "RHO", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 3 (Low club to the Ace in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "2", suit: "C" } },
          { seat: "LHO", card: { rank: "7", suit: "C" } },
          { seat: "DUMMY", card: { rank: "A", suit: "C" } },
          { seat: "RHO", card: { rank: "6", suit: "C" } },
        ],
      },
      {
        label: "Trick 4 (Low spade from dummy, ruff in hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "2", suit: "S" } },
          { seat: "RHO", card: { rank: "7", suit: "S" } },
          { seat: "DECLARER", card: { rank: "7", suit: "H" } },
          { seat: "LHO", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (Diamond ruffed in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "4", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
          { seat: "DUMMY", card: { rank: "8", suit: "H" } },
          { seat: "RHO", card: { rank: "9", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (Spade from dummy, ruff in hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "3", suit: "S" } },
          { seat: "RHO", card: { rank: "T", suit: "S" } },
          { seat: "DECLARER", card: { rank: "9", suit: "H" } },
          { seat: "LHO", card: { rank: "8", suit: "S" } },
        ],
      },
      {
        label: "Trick 7 (Diamond ruffed in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "5", suit: "D" } },
          { seat: "LHO", card: { rank: "8", suit: "D" } },
          { seat: "DUMMY", card: { rank: "Q", suit: "H" } },
          { seat: "RHO", card: { rank: "T", suit: "D" } },
        ],
      },
      {
        label: "Trick 8 (Spade from dummy, ruff in hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "4", suit: "S" } },
          { seat: "RHO", card: { rank: "J", suit: "S" } },
          { seat: "DECLARER", card: { rank: "T", suit: "H" } },
          { seat: "LHO", card: { rank: "6", suit: "S" } },
        ],
      },
      {
        label: "Trick 9 (Diamond ruffed in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "3", suit: "D" } },
          { seat: "LHO", card: { rank: "K", suit: "D" } },
          { seat: "DUMMY", card: { rank: "A", suit: "H" } },
          { seat: "RHO", card: { rank: "Q", suit: "D" } },
        ],
      },
      {
        label: "Trick 10 (Spade from dummy, ruff in hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "Q", suit: "S" } },
          { seat: "DECLARER", card: { rank: "J", suit: "H" } },
          { seat: "LHO", card: { rank: "9", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "cp1-11",
    difficulty: 1,
    newUntil: "2026-04-30",
    title: "5♦: club lead — can we just draw trumps?",
    trumpSuit: "D",
    contract: "5♦",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "ruffingLot",
      themeLabel: "Theme: Ruffing a lot (cross ruffing)",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/h14m5rRY6Cg",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-11-clue",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "Clue: this is a bit of a trick question.\n\nWe learn excellent ideas including:\n\n• Set up trick sources\n• Set up 5-card suits\n• Ruff stuff in dummy\n• Cross ruff",
        },
        {
          id: "cp1-11-plan",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "So, let's take a deep breath. Dummy has come down - what are we going to do?",
          options: [
            { id: "ruff_stuff", label: "Ruff stuff" },
            { id: "setup_side", label: "Setup our side suit" },
            { id: "cross_ruff", label: "Cross ruff" },
            { id: "draw_trumps", label: "Draw trumps" },
          ],
          expectedChoice: "draw_trumps",
          noContinue: true,
          revealText:
            "We can and should simply draw trumps.\n\nThis is a trick question, and it's one we have to ask ourselves every time dummy comes down. Even though the answer is often \"no\", it is the start of any good plan.\n\nWe have 11 top tricks, provided we take those trumps out as soon as possible. Any delay and the opponents will get a club ruff.\n\nSo always ask, no matter what you have just learned about declarer play:\n\n\"Can I just draw trumps?\"",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "A72", H: "74", D: "T86", C: "AQ743" },
      DECLARER: { S: "65", H: "A93", D: "KQJ75", C: "KJ6" },
      // East has exactly 2 clubs. West holds the Ace of diamonds.
      LHO: { S: "KQJ9", H: "KQ6", D: "A43", C: "T52" },
      RHO: { S: "T843", H: "JT852", D: "92", C: "98" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (2♣ lead shown on table)",
        plays: [{ seat: "LHO", card: { rank: "2", suit: "C" } }],
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
      videoUrlBeforeStart: "https://youtube.com/shorts/GEJcHaaWVeg",
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
      videoUrlBeforeStart: "https://youtube.com/shorts/KBA3CXalFkQ",
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
      videoUrlBeforeStart: "https://youtube.com/shorts/-b60sY7rNuc",
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
            "Play a club. Is ruffing a tempting idea? It shouldn't be — go for the long club suit; that's what yields the best results.\n\nIs drawing trumps the obvious move? Even with 9 trumps, we should lay off the trumps till we have set up the clubs, or at least started them. Trumps are also entries, which you may need to either hand. Laying off trumps keeps you flexible to begin with.\n\nFire off a club, confidently begin to set up your long suit!\n\nOnce again, we are using entries productively by playing a club towards the King.",
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
      videoUrlBeforeStart: "https://youtube.com/shorts/Pn-N-AYXCCo",
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
      videoUrlBeforeStart: "https://youtube.com/shorts/pKVWX3tFZoM",
      startAutoPlayThroughRoundIdx: 0,
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
  {
    id: "cp2-6",
    difficulty: 2,
    title: "4♠: use entries, then draw trumps",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "entriesProductive",
      themeLabel: "Theme: Using entries productively",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/LhjJh25vzG4",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-6-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "We have just won the Ace of diamonds. What should we do now?",
          options: [
            { id: "draw_trump_or_two", label: "1. Draw a trump or 2" },
            { id: "play_hearts", label: "2. Play hearts" },
            { id: "play_diamonds", label: "3. Play diamonds" },
            { id: "play_clubs", label: "4. Play clubs" },
          ],
          expectedChoice: "play_hearts",
          revealText:
            "Play a heart. Let's follow two guiding principles.\n\n1) Always use our entry productively. We are in dummy, so ask ourselves: what can we do in dummy that we can't do from our hand?\n\nTaking a heart finesse needs to be done by leading a heart from the north hand, so do it now.\n\n2) Sometimes it's best to think of trumps as entries, or even the \"entry suit\". We are perfectly positioned in dummy, so there is no reason to start playing our entry suit yet.",
        },
        {
          id: "cp2-6-what-now",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "Going well so far, what now?",
          options: [
            { id: "continue_hearts", label: "1. Continue with the heart suit" },
            { id: "play_trumps", label: "2. Play some trumps" },
            { id: "play_diamonds", label: "3. Play diamonds" },
            { id: "play_clubs", label: "4. Play clubs" },
          ],
          expectedChoice: "play_trumps",
          revealText:
            "It's a good idea now to draw some trumps.\n\nWe are now in our hand. There is nothing productive we can do from our hand, and there is no gain in playing either minor suit.\n\nSo, since we have nothing productive to do, we should look closely at the trump suit.\n\nWe want to take another heart finesse, so whatever we do with trumps, let's make sure to use our only remaining entry productively.",
        },
        {
          id: "cp2-6-how-many-trumps",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "So what should we do with trumps?",
          options: [
            { id: "draw_1", label: "1. Just draw 1 round" },
            { id: "draw_2", label: "2. Draw 2 rounds" },
            { id: "draw_3", label: "3. Draw 3 rounds" },
            { id: "draw_4_if_needed", label: "4. Draw 4 rounds if needed" },
          ],
          expectedChoice: "draw_3",
          revealText:
            "Draw 3 rounds. There is no reason to delay. Draw 3 rounds, but make sure to end in dummy, as we want to use that entry.",
        },
        {
          id: "cp2-6-spade-distribution",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 3,
          fixed: { DUMMY: 3, DECLARER: 5, LHO: 1 },
          expectedDistribution: { LHO: 1, DUMMY: 3, RHO: 4, DECLARER: 5 },
          promptText:
            "What is the spade distribution?\n\nNorth is 3, South is 5, West is 1. Fill in East.",
        },
        {
          id: "cp2-6-east-trumps-left",
          type: "SINGLE_NUMBER",
          atRoundIdx: 3,
          promptText:
            "How many trumps are still outstanding?\n\n(Hint: remember how many trumps East started with, and how many rounds have been played.)",
          expectedAnswer: 2,
        },
        {
          id: "cp2-6-east-trumps-left-explain",
          type: "INFO",
          atRoundIdx: 3,
          promptText:
            "The answer is 2. East started with 4, and we have drawn two rounds, East following both times, with 2 trumps remaining.",
        },
        {
          id: "cp2-6-one-more-trump",
          type: "INFO",
          atRoundIdx: 5,
          promptText: "We know East has 1 more trump, so let's draw the final trump now.",
        },
        {
          id: "cp2-6-hearts-winners",
          type: "PLAY_DECISION",
          atRoundIdx: 6,
          promptText: "Are our remaining hearts winners, or not sure yet?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes.\n\nSince both opponents followed to two rounds of hearts, the suit is breaking 3-2. Therefore our last two hearts will be winners.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "K72", H: "9876", D: "A5", C: "7642" },
      DECLARER: { S: "AQJ95", H: "AQJ4", D: "32", C: "A5" },
      LHO: { S: "T", H: "K32", D: "Q864", C: "JT983" },
      RHO: { S: "8643", H: "T5", D: "KJT97", C: "KQ" },
    },
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (Q♦ lead, dummy wins A♦)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "A", suit: "D" } },
          { seat: "RHO", card: { rank: "7", suit: "D" } },
          { seat: "DECLARER", card: { rank: "2", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Heart from dummy: small, Q, small)",
        plays: [
          { seat: "DUMMY", card: { rank: "9", suit: "H" } },
          { seat: "LHO", card: { rank: "2", suit: "H" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "H" } },
          { seat: "RHO", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (A♠, all follow)",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
          { seat: "LHO", card: { rank: "T", suit: "S" } },
          { seat: "DUMMY", card: { rank: "2", suit: "S" } },
          { seat: "RHO", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (Q♠, West discards a club)",
        plays: [
          { seat: "DECLARER", card: { rank: "Q", suit: "S" } },
          { seat: "LHO", card: { rank: "3", suit: "C" }, showOut: true },
          { seat: "DUMMY", card: { rank: "7", suit: "S" } },
          { seat: "RHO", card: { rank: "4", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (Spade to the King; West discards a diamond)",
        plays: [
          { seat: "DECLARER", card: { rank: "5", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "D" }, showOut: true },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "6", suit: "S" } },
        ],
      },
      {
        label: "Trick 6 (Heart from dummy: small, J, small)",
        plays: [
          { seat: "DUMMY", card: { rank: "8", suit: "H" } },
          { seat: "RHO", card: { rank: "T", suit: "H" } },
          { seat: "DECLARER", card: { rank: "J", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 7 (J♠, West and North discard clubs, East follows)",
        plays: [
          { seat: "DECLARER", card: { rank: "J", suit: "S" } },
          { seat: "LHO", card: { rank: "8", suit: "C" }, showOut: true },
          { seat: "DUMMY", card: { rank: "2", suit: "C" }, showOut: true },
          { seat: "RHO", card: { rank: "8", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "cp2-7",
    difficulty: 2,
    title: "4♠: entries first, long suit priority",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "entriesProductive",
      themeLabel: "Theme: Using entries productively",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/ArED5qGmybs",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-7-general-plan",
          type: "INFO",
          atRoundIdx: 1,
          promptText: "Have a think about what you want to do on this hand, a general plan.",
        },
        {
          id: "cp2-7-theme-intro",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "Throughout this site I emphasise setting up long suits as a priority, before drawing trumps.\n\nThe question often arises, when should I draw trumps though, and how many?\n\nLet's call trumps the \"entry suit\" for this hand. And see if that label helps us answer the question.",
        },
        {
          id: "cp2-7-which-hand-hearts",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText:
            "We have decided to set up our 5 card heart suit as a matter of priority. Which hand would it be best to play the heart suit from?",
          options: [
            { id: "doesnt_matter", label: "1. Doesn't matter" },
            { id: "lead_from_dummy", label: "2. I want to lead hearts from dummy" },
            { id: "play_from_hand", label: "3. I want to play hearts immediately out of hand." },
          ],
          expectedChoice: "lead_from_dummy",
          revealText:
            "Keep it simple. It looks natural to play low towards AQJxx. So let's use our \"entry suit\" to jump over to dummy, in order for us to play a heart.",
        },
        {
          id: "cp2-7-draw-another-trump",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText: "Should we draw another trump?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          revealText:
            "No, we do not need to draw more trumps.\n\nRemember we are calling it our entry suit. No need to touch our entry suit, we are in the perfect hand.",
        },
        {
          id: "cp2-7-what-now-spade-entry",
          type: "PLAY_DECISION",
          atRoundIdx: 3,
          promptText: "What now?",
          options: [
            { id: "play_spade", label: "1. Play a spade" },
            { id: "play_heart", label: "2. Play a heart" },
            { id: "play_diamond", label: "3. Play a diamond" },
            { id: "play_club", label: "4. Play a club" },
          ],
          expectedChoice: "play_spade",
          revealText:
            "Play a trump.\n\nWe want to jump back over to dummy so let's use our entry suit.\n\nWe want to continue setting up our heart suit as a matter of priority. It still looks natural to take the heart finesse again.",
        },
        {
          id: "cp2-7-spade-distribution",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 4,
          fixed: { DUMMY: 4, DECLARER: 4, RHO: 1 },
          expectedDistribution: { LHO: 4, DUMMY: 4, RHO: 1, DECLARER: 4 },
          promptText:
            "What was the original spade distribution?\n\nNorth is 4, South is 4, East is 1. Fill in West.",
        },
        {
          id: "cp2-7-west-started-4",
          type: "INFO",
          atRoundIdx: 4,
          promptText: "West started with 4 trumps.",
        },
        {
          id: "cp2-7-west-trumps-left",
          type: "SINGLE_NUMBER",
          atRoundIdx: 4,
          promptText:
            "How many trumps does West have left?\n\n(Hint: think of the number West started with, and also think about how many rounds we have played.)",
          expectedAnswer: 2,
          autoContinueOnCorrect: true,
        },
        {
          id: "cp2-7-west-trumps-left-explain",
          type: "INFO",
          atRoundIdx: 4,
          promptText:
            "West has two left. We know West started with 4 trumps and has followed twice to both rounds, leaving 2 left.",
        },
        {
          id: "cp2-7-what-now-keep-hearts",
          type: "PLAY_DECISION",
          atRoundIdx: 5,
          promptText: "What now?",
          options: [
            { id: "play_trumps", label: "Play trumps" },
            { id: "play_hearts", label: "Play hearts" },
            { id: "play_diamonds", label: "Play diamonds" },
            { id: "play_clubs", label: "Play clubs" },
          ],
          expectedChoice: "play_hearts",
          revealText:
            "We keep the focus from the start of the hand till the end of the hand. We want to set up the long suit.\n\nAs for trumps, that is our entry suit. We are in the correct hand. We may want to use our queen of spades later to jump back to our hand.",
        },
        {
          id: "cp2-7-ruffing-choice",
          type: "INFO",
          atRoundIdx: 5,
          promptText:
            "We have played two rounds of the suit. The Ace will take care of the third round, but if the suit breaks 4-2 we need to ruff one. So we decide to ruff one now.",
        },
        {
          id: "cp2-7-heart-distribution",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 6,
          fixed: { DUMMY: 2, DECLARER: 5, LHO: 2 },
          expectedDistribution: { LHO: 2, DUMMY: 2, RHO: 4, DECLARER: 5 },
          promptText: "So the initial heart distribution was?",
        },
        {
          id: "cp2-7-entry-wrap",
          type: "INFO",
          atRoundIdx: 6,
          promptText:
            "As you can see, the Queen of spades is once again our entry suit. We want to get back to our hand and enjoy our heart winners.",
        },
        {
          id: "cp2-7-final-message",
          type: "INFO",
          atRoundIdx: 7,
          promptText:
            "We will make 10 tricks now.\n\nWe will just play our heart and club winners.\n\nWe will lose a diamond, and the J of spades. That, along with the Ace of clubs will be 3 losers in total.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "AK94", H: "72", D: "KT64", C: "832" },
      DECLARER: { S: "QT63", H: "AQJ85", D: "5", C: "KQ7" },
      LHO: { S: "J875", H: "43", D: "A983", C: "T64" },
      RHO: { S: "2", H: "KT96", D: "QJ72", C: "AJ95" },
    },
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (4♣ lead, East wins A♣)",
        plays: [
          { seat: "LHO", card: { rank: "4", suit: "C" } },
          { seat: "DUMMY", card: { rank: "2", suit: "C" } },
          { seat: "RHO", card: { rank: "A", suit: "C" } },
          { seat: "DECLARER", card: { rank: "7", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (East continues clubs, South wins K♣)",
        plays: [
          { seat: "RHO", card: { rank: "J", suit: "C" } },
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
          { seat: "LHO", card: { rank: "6", suit: "C" } },
          { seat: "DUMMY", card: { rank: "8", suit: "C" } },
        ],
      },
      {
        label: "Trick 3 (Low spade to the Ace)",
        plays: [
          { seat: "DECLARER", card: { rank: "3", suit: "S" } },
          { seat: "LHO", card: { rank: "5", suit: "S" } },
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "2", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (Heart to the Queen finesse)",
        plays: [
          { seat: "DUMMY", card: { rank: "2", suit: "H" } },
          { seat: "RHO", card: { rank: "6", suit: "H" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (Spade to King; West discards diamond)",
        plays: [
          { seat: "DECLARER", card: { rank: "6", suit: "S" } },
          { seat: "LHO", card: { rank: "7", suit: "S" } },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "2", suit: "D" }, showOut: true },
        ],
      },
      {
        label: "Trick 6 (Heart to the Jack finesse)",
        plays: [
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "9", suit: "H" } },
          { seat: "DECLARER", card: { rank: "J", suit: "H" } },
          { seat: "LHO", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 7 (Ruff a heart in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "5", suit: "H" } },
          { seat: "LHO", card: { rank: "8", suit: "D" }, showOut: true },
          { seat: "DUMMY", card: { rank: "4", suit: "S" }, showOut: true },
          { seat: "RHO", card: { rank: "T", suit: "H" } },
        ],
      },
      {
        label: "Trick 8 (Spade entry to the 10; West discards diamond)",
        plays: [
          { seat: "DUMMY", card: { rank: "9", suit: "S" } },
          { seat: "RHO", card: { rank: "7", suit: "D" }, showOut: true },
          { seat: "DECLARER", card: { rank: "Q", suit: "S" } },
          { seat: "LHO", card: { rank: "8", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "cp2-8",
    difficulty: 2,
    title: "3NT: entries productively — majors and knock-out",
    newUntil: "2026-12-31",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "entriesProductive",
      themeLabel: "Theme: Using entries productively",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/U43p6sSuHyU",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-8-intro-focus",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "There is usually lots to think about on a bridge hand, interpreting the lead, the auction and many other factors.\n\nHowever, I want to narrow our focus for this hand, like the previous two, and focus only on using our entries productively.",
        },
        {
          id: "cp2-8-knock-ace-prior",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "If you have worked through declarer stage 1 (problems 3–6), you have already seen this idea.\n\nA suit like hearts is a strong candidate: you \"knock out the Ace\" and turn the suit into winners for our side.",
        },
        {
          id: "cp2-8-combine-entries",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "However, on this hand, we want to combine with the idea of using our entries productively.",
        },
        {
          id: "cp2-8-spade-hand-matters",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "Let's look at the major suits.\n\nHearts and spades will both matter — but not in the same way.\n\nStart with spades — does it matter which hand we tackle that suit from?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          revealText:
            "Yes it does.\n\nWe want to play toward dummy's ♠AJ109 — lead low toward that tenace. If West has the king or queen, a finesse can pick up an extra trick; if not, your entries still let you develop the suit in an orderly way.",
        },
        {
          id: "cp2-8-heart-hand-matters",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Does it matter which hand we play the ♥ suit from?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          revealText:
            "No it doesn't. We can play ♥ from either hand — it's a straightforward suit: cash honors and eventually lose to the ace.",
        },
        {
          id: "cp2-8-which-suit-first",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "Which suit should we play first — hearts or spades?\n\nBe guided now, and always, by the idea of using your entries productively.\n\nYou are in your hand: seize the moment and do something from your hand that can't be done from dummy.\n\nI will play:",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
          ],
          expectedChoice: "spade",
          revealText: "Let's lead a spade up.",
        },
        {
          id: "cp2-8-jack-surprise",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "Interesting — the Jack won the trick, a slight surprise. What should we do now?",
        },
        {
          id: "cp2-8-after-jack",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "Play:",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "hearts",
          revealText:
            "Now is an excellent time to play hearts. You were looking forward to playing that suit. Since there is nothing you particularly want to do from dummy, now is the time to play a heart.\n\nWe want to stay off spades, as those are best played from our hand, finessing.",
        },
        {
          id: "cp2-8-continue-hearts-or-what",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText: "We win another trick. Should we continue with hearts or what?\n\nI would play:",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "spade",
          revealText:
            "Play a spade. Once again, without wanting to sound repetitive, we use our entry to do what cannot be done from the other hand.",
        },
        {
          id: "cp2-8-after-diamond-return",
          type: "PLAY_DECISION",
          atRoundIdx: 4,
          promptText: "A question I expect you to get right — what do we play now?",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "spade",
          revealText:
            "Spade — from the start to the end, we have kept our focus on using entries productively.",
        },
        {
          id: "cp2-8-spade-distribution",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 5,
          fixed: { DECLARER: 3, DUMMY: 4, RHO: 2 },
          expectedDistribution: { LHO: 4, DUMMY: 4, RHO: 2, DECLARER: 3 },
          promptText: "What was the original spade distribution?",
        },
        {
          id: "cp2-8-hearts-going-well",
          type: "INFO",
          atRoundIdx: 6,
          promptText: "We are doing well — now all that's left is to continue with our heart suit.",
        },
        {
          id: "cp2-8-knock-ace-hearts",
          type: "INFO",
          atRoundIdx: 7,
          promptText: "We keep persisting — let's \"knock out the Ace\" and set up our 9th trick.",
        },
        {
          id: "cp2-8-done-9",
          type: "INFO",
          atRoundIdx: 11,
          promptText: "Our final heart is good, for a total of 9 tricks.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "AJ109", H: "J1098", D: "32", C: "AJ7" },
      DECLARER: { S: "876", H: "KQ3", D: "AQ5", C: "10432" },
      LHO: { S: "Q432", H: "65", D: "8762", C: "K5" },
      RHO: { S: "K5", H: "A42", D: "KJT9", C: "Q986" },
    },
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (2♦ lead: low, King, Ace)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "D" } },
          { seat: "DUMMY", card: { rank: "3", suit: "D" } },
          { seat: "RHO", card: { rank: "K", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Low spade to the Jack)",
        plays: [
          { seat: "DECLARER", card: { rank: "8", suit: "S" } },
          { seat: "LHO", card: { rank: "3", suit: "S" } },
          { seat: "DUMMY", card: { rank: "J", suit: "S" } },
          { seat: "RHO", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (Heart: low, King, low)",
        plays: [
          { seat: "DUMMY", card: { rank: "9", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "H" } },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "6", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (Spade: low, low, 10, King)",
        plays: [
          { seat: "DECLARER", card: { rank: "7", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "S" } },
          { seat: "DUMMY", card: { rank: "T", suit: "S" } },
          { seat: "RHO", card: { rank: "K", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (Diamond return: win the Queen — Ace already cashed)",
        plays: [
          { seat: "RHO", card: { rank: "9", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (Spade: low, 9, East discards club)",
        plays: [
          { seat: "DECLARER", card: { rank: "6", suit: "S" } },
          { seat: "LHO", card: { rank: "2", suit: "S" } },
          { seat: "DUMMY", card: { rank: "9", suit: "S" } },
          { seat: "RHO", card: { rank: "9", suit: "C" }, showOut: true },
        ],
      },
      {
        label: "Trick 7 (Ace of spades)",
        plays: [
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "8", suit: "C" }, showOut: true },
          { seat: "DECLARER", card: { rank: "4", suit: "C" }, showOut: true },
          { seat: "LHO", card: { rank: "Q", suit: "S" } },
        ],
      },
      {
        label: "Trick 8 (Heart: low, Queen, low)",
        plays: [
          { seat: "DUMMY", card: { rank: "8", suit: "H" } },
          { seat: "RHO", card: { rank: "4", suit: "H" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "H" } },
          { seat: "LHO", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 9 (Heart: South leads; Ace wins for East)",
        plays: [
          { seat: "DECLARER", card: { rank: "3", suit: "H" } },
          { seat: "LHO", card: { rank: "8", suit: "D" }, showOut: true },
          { seat: "DUMMY", card: { rank: "J", suit: "H" } },
          { seat: "RHO", card: { rank: "A", suit: "H" } },
        ],
      },
      {
        label: "Trick 10 (Diamond — East leads; North pitches lowest club)",
        plays: [
          { seat: "RHO", card: { rank: "J", suit: "D" } },
          { seat: "DECLARER", card: { rank: "5", suit: "D" } },
          { seat: "LHO", card: { rank: "7", suit: "D" } },
          { seat: "DUMMY", card: { rank: "7", suit: "C" }, showOut: true },
        ],
      },
      {
        label: "Trick 11 (Diamond — East leads; discards)",
        plays: [
          { seat: "RHO", card: { rank: "T", suit: "D" } },
          { seat: "DECLARER", card: { rank: "3", suit: "C" }, showOut: true },
          { seat: "LHO", card: { rank: "8", suit: "D" } },
          { seat: "DUMMY", card: { rank: "J", suit: "C" }, showOut: true },
        ],
      },
      {
        label: "Trick 12 (East leads a club; North wins the Ace)",
        plays: [
          { seat: "RHO", card: { rank: "6", suit: "C" } },
          { seat: "DECLARER", card: { rank: "2", suit: "C" } },
          { seat: "LHO", card: { rank: "K", suit: "C" } },
          { seat: "DUMMY", card: { rank: "A", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp2-9",
    difficulty: 2,
    title: "4♠: heart finesse — dummy's entry and the five-card suit",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "entriesProductive",
      themeLabel: "Theme: Using entries productively",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/cC7f208jmeg",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-9-plan-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What is your plan here, and what do you play to trick 2?",
          options: [
            { id: "trumps", label: "Trumps" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "hearts",
          revealText: "Hearts. Use Dummy's only sure entry wisely, don't waste it!",
        },
        {
          id: "cp2-9-dummy-five",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "Before explaining why, did you notice dummy's five-card ♣ suit?\n\nI talk a lot about the power of five-card suits, and I always at least glance to see whether I can set one up.",
        },
        {
          id: "cp2-9-dummy-weak",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "Here dummy is too weak for that (see my Declarer Play article \"Pattern recognition #2 — Suss\").",
        },
        {
          id: "cp2-9-play-heart-ten",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "So how do you play the heart suit? Please play the trick by clicking the cards.",
          playCardUserPlaysDummyFirst: true,
          playCardAutoPlaysBefore: [{ seat: "RHO", card: { rank: "2", suit: "H" } }],
          playCardAutoPlayAfter: { seat: "LHO", card: { rank: "A", suit: "H" } },
          playCardEndHandAfterContinue: true,
          expectedSuit: "H",
          expectedRank: "T",
          correctRevealText: "Well done!",
          wrongRevealText: "Nice try.",
          revealText:
            "The winning play is to finesse the ♥J — that gives you the best chance of making 2 ♥ tricks.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "43", H: "Q76", D: "A32", C: "JT985" },
      DECLARER: { S: "AKQ1098", H: "K108", D: "54", C: "32" },
      LHO: { S: "762", H: "A543", D: "KQJT", C: "AK7" },
      RHO: { S: "J5", H: "J92", D: "9876", C: "Q64" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (♦K lead: ♦A wins in dummy)",
        plays: [
          { seat: "LHO", card: { rank: "K", suit: "D" } },
          { seat: "DUMMY", card: { rank: "A", suit: "D" } },
          { seat: "RHO", card: { rank: "9", suit: "D" } },
          { seat: "DECLARER", card: { rank: "5", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Low ♥ from dummy — ♥10 from hand; West wins ♥A)",
        plays: [
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "H" } },
          { seat: "DECLARER", card: { rank: "T", suit: "H" } },
          { seat: "LHO", card: { rank: "A", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp2-10",
    difficulty: 2,
    title: "4♠: spectacular crossruff — two 5–0 breaks",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "entriesProductive",
      themeLabel: "Theme: Using entries productively",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/WvrNS2Kkbtw",
      skipAutoPlayOnStart: true,
      customPrompts: [
        {
          id: "cp2-10-spectacular",
          type: "INFO",
          atRoundIdx: 1,
          promptText: "This is a spectacular declarer-play hand.",
        },
        {
          id: "cp2-10-prelim",
          type: "INFO",
          atRoundIdx: 1,
          promptText: "Before we go further, let's do some preliminary work.",
        },
        {
          id: "cp2-10-dist-hearts",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 1,
          fixed: { DUMMY: 5, RHO: 0, DECLARER: 3 },
          expectedDistribution: { LHO: 5, DUMMY: 5, RHO: 0, DECLARER: 3 },
          promptText: "The ♥ distribution is — fill in the missing seat.",
        },
        {
          id: "cp2-10-exp-hearts",
          type: "INFO",
          atRoundIdx: 1,
          promptText: "We can work out that West started with 5 ♥.",
        },
        {
          id: "cp2-10-dist-spades",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 1,
          fixed: { DUMMY: 4, DECLARER: 4, LHO: 0 },
          expectedDistribution: { LHO: 0, DUMMY: 4, RHO: 5, DECLARER: 4 },
          promptText: "What about the trump distribution? Fill in the missing seat.",
        },
        {
          id: "cp2-10-exp-spades",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "East started with 5 ♠. Two 5–0 breaks — is that going to slow you down, or are you going to treat this hand like any other and stick with good principles?",
        },
        {
          id: "cp2-10-which-suit",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "Which suit do you think declarer played next?",
          options: [
            { id: "trump", label: "Trump" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "heart",
          revealText:
            "Play a ♥. Good bridge principles like this don't have many exceptions — this hand was no exception.",
        },
        {
          id: "cp2-10-east-trumps-left",
          type: "SINGLE_NUMBER",
          atRoundIdx: 3,
          promptText:
            "Let's keep track of trumps — we know East started with 5. How many does East have left?\n\n(hint: think about how many rounds have been drawn and how many times East has ruffed)",
          expectedAnswer: 1,
        },
        {
          id: "cp2-10-exp-trumps-left",
          type: "INFO",
          atRoundIdx: 3,
          promptText:
            "East has 1 ♠ left — after ruffing twice and drawing two rounds.",
        },
        {
          id: "cp2-10-claimed",
          type: "INFO",
          atRoundIdx: 3,
          promptText:
            "Declarer actually claimed: the hand was high, with ♥ all winners and the rest a crossruff. One trump is still out with East — it wins eventually.",
        },
        {
          id: "cp2-10-wrap",
          type: "INFO",
          atRoundIdx: 3,
          promptText: "Two 5–0 breaks didn't slow declarer down — entries were used productively.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "8765", H: "AKQ97", D: "A32", C: "2" },
      DECLARER: { S: "AK43", H: "982", D: "4", C: "A9876" },
      LHO: { S: "", H: "JT654", D: "K765", C: "9842" },
      RHO: { S: "QJT92", H: "", D: "QJT98", C: "QT7" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (♥J, ♥A; ♠2 ruff — East wins)",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "H" } },
          { seat: "DUMMY", card: { rank: "A", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "S" } },
          { seat: "DECLARER", card: { rank: "8", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (East leads — East, South, West, North: ♠Q, ♠A, ♦4, ♠5)",
        plays: [
          { seat: "RHO", card: { rank: "Q", suit: "S" } },
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "D" } },
          { seat: "DUMMY", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (♥2, ♥4, ♥7, ♠6 ruff)",
        plays: [
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
          { seat: "LHO", card: { rank: "4", suit: "H" } },
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "6", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (♠J, ♠K, ♣8, ♠6 from dummy)",
        plays: [
          { seat: "RHO", card: { rank: "J", suit: "S" } },
          { seat: "DECLARER", card: { rank: "K", suit: "S" } },
          { seat: "LHO", card: { rank: "8", suit: "C" } },
          { seat: "DUMMY", card: { rank: "6", suit: "S" } },
        ],
      },
    ],
  },
];

export const CARDPLAY_PUZZLES = CARDPLAY_PUZZLES_ALL;

function isPuzzleNew(puzzle) {
  return !!(puzzle && puzzle.newUntil && new Date() < new Date(puzzle.newUntil));
}

export const CARDPLAY_HAS_NEW = CARDPLAY_PUZZLES.some(isPuzzleNew);

function CardPlayTrainer(routeProps) {
  return <CountingTrumpsTrainer {...routeProps} puzzlesOverride={CARDPLAY_PUZZLES} trainerLabel="Declarer Play" categoryKey="declarer" />;
}

export default CardPlayTrainer;


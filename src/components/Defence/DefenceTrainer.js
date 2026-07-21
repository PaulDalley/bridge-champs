import React from "react";
import CountingTrumpsTrainer, { TextWithColoredSuits } from "../Counting/CountingTrumpsTrainer";

const DEFENCE_PUZZLES = [
  {
    id: "df1-1",
    difficulty: 1,
    title: "2♠: remove dummy’s trumps",
    trumpSuit: "S",
    contract: "2♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "E", // you are East (right side), defending
    visibleFullHandSeats: ["RHO", "DUMMY"], // you + dummy
    promptOptions: {
      promptPlacement: "left",
      hideAuction: true,
      contractLabel: "Contract is 2♠ by West",
      /** Display-only; does not change viewerCompass or card play. */
      viewerCompassLabelOverride: "S",
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Theme: Recognising dummy types",
      videoUrlBeforeStart: "https://youtube.com/shorts/DSSMOXi1HnY",
      customPrompts: [
        {
          id: "df1-1-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "This is a quick pattern recognition problem. Take a look at the layout, then we'll ask what you'd do.",
        },
        {
          id: "df1-1-whatNow",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "You win the Ace. What do you do now?",
          options: [
            { id: "clubs", label: "Return clubs" },
            { id: "heart", label: "Play a heart" },
            { id: "diamond", label: "Play a diamond" },
            { id: "trump", label: "Play a trump" },
          ],
          expectedChoice: "trump",
          noContinue: true,
          motivationText: "Good habits win tricks — keep going.",
          videoUrl: "",
          revealText:
            "This type of dummy is one which is only useful to declarer for its ruffing value.\n\nDummy is\n\n✓ weak\n✓ has a shortage\n✓ has trumps\n\nTherefore it’s the duty of the defence to remove dummy’s trumps — confidently play a trump!",
        },
      ],
    },
    shownHands: {
      // Dummy (North)
      DUMMY: { S: "J72", H: "2", D: "A76543", C: "J72" },
      // You (East / RHO)
      RHO: { S: "A2", H: "KJ32", D: "QT2", C: "AQ92" },
    },
    rounds: [
      {
        label: "Trick 1 (♣2 lead)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "C" } }, // partner leads ♣2
          { seat: "DUMMY", card: { rank: "7", suit: "C" } },
          { seat: "RHO", card: { rank: "A", suit: "C" } }, // you win ♣A
          { seat: "DECLARER", card: { rank: "3", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "df1-2",
    difficulty: 1,
    title: "4♠: trump lead — take heart tricks in a hurry",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: true,
      contractLabel: "Contract is 4♠ by West",
      viewerCompassLabelOverride: "S",
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Theme: Recognising dummy types",
      videoUrlBeforeStart: "https://youtube.com/shorts/vW6VnyF4nHE",
      customPrompts: [
        {
          id: "df1-2-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "This is a quick pattern recognition problem. Take a look at the layout, then we'll ask what you'd do.",
        },
        {
          id: "df1-2-whatNext",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "You win the ace. What next?",
          options: [
            { id: "trump", label: "Play another trump" },
            { id: "hearts", label: "Play hearts" },
            { id: "clubs", label: "Play clubs" },
          ],
          expectedChoice: "hearts",
          revealText:
            "With a very menacing diamond suit in dummy, the defence needs to take their heart tricks in a hurry. Otherwise declarer will draw trumps and enjoy 6 diamond tricks, throwing any heart and club losers.\n\nWhen there is a menacing source of tricks in dummy, often you need to go after your tricks immediately — you can't delay or you will not make them!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      LHO: { S: "54", H: "A54", D: "84", C: "KJ9765" },
      DUMMY: { S: "KQ2", H: "732", D: "AKT932", C: "2" },
      RHO: { S: "A2", H: "QJ98", D: "765", C: "QT98" },
      DECLARER: { S: "J98732", H: "K76", D: "QJ", C: "A2" },
    },
    rounds: [
      {
        label: "Trick 1 (partner leads a trump)",
        plays: [
          { seat: "LHO", card: { rank: "4", suit: "S" } },
          { seat: "DUMMY", card: { rank: "2", suit: "S" } },
          { seat: "RHO", card: { rank: "A", suit: "S" } },
          { seat: "DECLARER", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (you play the Queen of hearts)",
        plays: [
          { seat: "RHO", card: { rank: "Q", suit: "H" } },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "A", suit: "H" } },
          { seat: "DUMMY", card: { rank: "3", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "df1-3",
    difficulty: 1,
    newUntil: "2026-04-15",
    title: "3NT: duck the diamond — limit dummy's tricks",
    trumpSuit: null,
    contract: "3NT",
    auction: "1NT P 3NT P P P",
    // Display-space (like df1-5..7): auction shows 1NT opened by West, matching contractLabel.
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      contractLabel: "Contract is 3NT by West",
      viewerCompassLabelOverride: "S",
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Theme: Recognising dummy types",
      videoUrlBeforeStart: "https://youtube.com/shorts/sfN5H5fI7Og",
      customPrompts: [
        {
          id: "df1-3-duck",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "What do you do?",
          options: [
            { id: "win", label: "Win the King" },
            { id: "duck", label: "Duck" },
          ],
          expectedChoice: "duck",
          noContinue: true,
          revealText:
            "This is a classic case where dummy has tricks but entries are limited. If you win this diamond, you give declarer 5 diamond tricks in dummy. Whereas, if you duck, you may limit declarer to two diamond tricks. That's a 4 trick difference!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      LHO: { S: "29853", H: "JT4", D: "63", C: "A42" },
      DUMMY: { S: "74", H: "532", D: "AQJT82", C: "J9" },
      RHO: { S: "KT6", H: "Q987", D: "K74", C: "QT3" },
      DECLARER: { S: "AQ2", H: "AK6", D: "98", C: "K8765" },
    },
    rounds: [
      {
        label: "Trick 1 (partner leads 2♠)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "S" } },
          { seat: "DUMMY", card: { rank: "7", suit: "S" } },
          { seat: "RHO", card: { rank: "K", suit: "S" } },
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (declarer plays 9♦; West low, dummy low — your turn)",
        plays: [
          { seat: "DECLARER", card: { rank: "9", suit: "D" } },
          { seat: "LHO", card: { rank: "3", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "df1-4",
    difficulty: 1,
    newUntil: "2026-04-15",
    title: "3NT: win the King — don't sit back",
    trumpSuit: null,
    contract: "3NT",
    auction: "1NT P 3NT P P P",
    // Display-space (like df1-5..7): auction shows 1NT opened by West, matching contractLabel.
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      contractLabel: "Contract is 3NT by West",
      viewerCompassLabelOverride: "S",
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Theme: Recognising dummy types",
      videoUrlBeforeStart: "https://youtube.com/shorts/qsUHYkHMQ1c",
      customPrompts: [
        {
          id: "df1-4-win",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "What do you do?",
          options: [
            { id: "win", label: "Win the King" },
            { id: "duck", label: "Duck" },
          ],
          expectedChoice: "win",
          noContinue: true,
          revealText:
            "Win the K♦, for two reasons:\n\n1. This is not the type of hand where entries to dummy are scarce — dummy has a sure entry in hearts if declarer needs it.\n\n2. Dummy is quite strong; declarer will likely have enough tricks if you sit back and wait. When declarer has strength (say 27+ combined points), the race is on for us to make 5 tricks!\n\nDucking is not always a good thing. In this case, time is of the essence — you cannot afford to sit back and wait. Grab your K♦, and play a spade, hoping you have cashing spades.\n\nAs it turns out, ducking would be 9 tricks for declarer; winning however would mean 5 tricks for your side!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      LHO: { S: "QJ953", H: "86", D: "63", C: "T742" },
      DUMMY: { S: "T74", H: "A53", D: "AQJT2", C: "Q9" },
      RHO: { S: "K86", H: "742", D: "K74", C: "J853" },
      DECLARER: { S: "A2", H: "KQJT2", D: "985", C: "AK6" },
    },
    rounds: [
      {
        label: "Trick 1 (partner leads 5♠)",
        plays: [
          { seat: "LHO", card: { rank: "5", suit: "S" } },
          { seat: "DUMMY", card: { rank: "7", suit: "S" } },
          { seat: "RHO", card: { rank: "K", suit: "S" } },
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (declarer plays 9♦; West low, dummy low — your turn)",
        plays: [
          { seat: "DECLARER", card: { rank: "9", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "df1-5",
    difficulty: 1,
    title: "4♠: passive or active? — take heart tricks in time",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    auction: "2♠ P 4♠ P P P",
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♠ by West",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "active",
      themeLabel: "Theme: Go active or stay passive?",
      videoUrlBeforeStart: "https://youtube.com/shorts/36lwXCVBvnA",
      customPrompts: [
        {
          id: "df1-5-theme",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "The theme of the next 5 problems is whether to go passive or get active.\n\nThe signs for going active are one or more of these:\n\n(a) Declarer has lots of high card points (27 or 28+ points in game).\n(b) Dummy has a big source of tricks somewhere.\n(c) Declarer and dummy have lots of trumps between them.\n(d) Declarer is very distributional.",
        },
        {
          id: "df1-5-passiveOrActive",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "Before we decide what to play, is this the type of situation where we can stay passive or do we need to go active?",
          options: [
            { id: "active", label: "Active" },
            { id: "passive", label: "Passive" },
          ],
          expectedChoice: "active",
          noContinue: false,
          revealText:
            "We need to get active. If we sit back, declarer will draw trumps and make 6 club tricks. Say 6 spades + 6 clubs is 12 tricks!\n\nSigns we need to get active:\n\n✓ Dummy has a big source of tricks.\n✓ Declarer is distributional and the trump fit is big (9+ cards).",
          videoUrl: "",
        },
        {
          id: "df1-5-whichSuit",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "What suit do we need to get active and take our tricks in, before it's too late?",
          options: [
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "hearts",
          noContinue: false,
          revealText:
            "Hearts. We want to take our tricks in hearts — but how many? We have 1 diamond trick; our chances of a trick in one of the black suits is basically 0. So we want 3 heart tricks in order to set the contract. So let's think clearly for the final piece of the puzzle.",
          videoUrl: "",
        },
        {
          id: "df1-5-whichHeart",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Which heart do we lead?",
          options: [
            { id: "ace", label: "The ace" },
            { id: "small", label: "A small one" },
          ],
          expectedChoice: "small",
          noContinue: true,
          revealText:
            "A small one, hoping partner has the King, and will return one, scooping up three tricks. It's always a bit uncomfortable underleading an Ace like that, but in bridge there is a time and place for it. If we didn't do it, declarer was making their contract, with overtricks!\n\nDon't get in the habit of doing such adventurous plays — make sure you are sure it's time to \"get active\".",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "AJ2", H: "Q32", D: "2", C: "AKJT32" },
      RHO: { S: "32", H: "AJ32", D: "A32", C: "4322" },
      DECLARER: { S: "KQT982", H: "654", D: "K43", C: "Q" },
      LHO: { S: "54", H: "K98", D: "QJT65", C: "65" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads Q♦)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "A", suit: "D" } },
          { seat: "DECLARER", card: { rank: "3", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "df1-6",
    difficulty: 1,
    title: "4♥: stay passive — no need to get active",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    auction: "1♥ P 1NT P 4♥ P P P",
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♥ by West",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "active",
      themeLabel: "Theme: Go active or stay passive?",
      videoUrlBeforeStart: "https://youtube.com/shorts/DJnRNI3DYog",
      customPrompts: [
        {
          id: "df1-6-passiveOrActive",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText:
            "Is this a hand where you need to go active, or can you just stay calm and play passively?",
          options: [
            { id: "active", label: "Go active" },
            { id: "passive", label: "Stay passive" },
          ],
          expectedChoice: "passive",
          noContinue: false,
          revealText:
            "Stay passive. There is no need to \"do anything\" on this hand. You can see for yourself that Dummy's diamonds are not a source of tricks — you are stopping that from happening. So any tricks you are entitled to will come your way if you wait.",
          videoUrl: "",
        },
        {
          id: "df1-6-whichSuit",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText:
            "What suit can we play that will be passive — i.e. not give declarer any help?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: ["spades", "hearts"],
          noContinue: true,
          revealText:
            "Playing a spade seems most reliable — let declarer ruff again and now it's up to him to try to do something. Another possible option is to play a heart, but that actually might help declarer; perhaps he wanted to take a heart finesse, and you're giving him the chance or entry to do that.\n\nWe definitely want to stay off diamonds and clubs; that could cost a lot.\n\nDeclarer bid boldly but this time is limited to 9 tricks at most, provided you stay passive.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      LHO: { S: "AK9865", H: "7", D: "87", C: "6543" },
      DUMMY: { S: "JT7", H: "654", D: "AQT2", C: "Q32" },
      RHO: { S: "Q43", H: "Q32", D: "KJ92", C: "K32" },
      DECLARER: { S: "2", H: "AKJT98", D: "543", C: "AJ2" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads A♠)",
        plays: [
          { seat: "LHO", card: { rank: "A", suit: "S" } },
          { seat: "DUMMY", card: { rank: "7", suit: "S" } },
          { seat: "RHO", card: { rank: "4", suit: "S" } },
          { seat: "DECLARER", card: { rank: "2", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (partner leads K♠; declarer ruffs with a heart)",
        plays: [
          { seat: "LHO", card: { rank: "K", suit: "S" } },
          { seat: "DUMMY", card: { rank: "J", suit: "S" } },
          { seat: "RHO", card: { rank: "3", suit: "S" } },
          { seat: "DECLARER", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (declarer plays low diamond to dummy's Q; you win K♦)",
        plays: [
          { seat: "DECLARER", card: { rank: "4", suit: "D" } },
          { seat: "LHO", card: { rank: "7", suit: "D" } },
          { seat: "DUMMY", card: { rank: "Q", suit: "D" } },
          { seat: "RHO", card: { rank: "K", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "df1-7",
    difficulty: 1,
    title: "3NT: stay passive — play towards dummy's weakness",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    auction: "1NT P 3NT P P P",
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 3NT by West",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "active",
      themeLabel: "Theme: Go active or stay passive?",
      videoUrlBeforeStart: "https://youtube.com/shorts/zYqpGro5IZw",
      customPrompts: [
        {
          id: "df1-7-passiveOrActive",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "Is this the type of hand to play active or passive?",
          options: [
            { id: "active", label: "Active" },
            { id: "passive", label: "Passive" },
          ],
          expectedChoice: "passive",
          noContinue: false,
          revealText:
            "Passive. Dummy is flat and not very strong for the auction. There isn't a menacing source of tricks. You can see nothing much good is happening for declarer in any of the suits.",
          videoUrl: "",
        },
        {
          id: "df1-7-whichSuit",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "What suit do you play in order to be passive?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "diamonds",
          noContinue: true,
          revealText:
            "Diamonds is likely best. When trying to be passive, go with the very well known saying — play around towards dummy's weakness. That is one of the most common ways of playing passively.\n\nDeclarer won't come to 9 tricks if we don't help him; just sit tight, play passively.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      LHO: { S: "J652", H: "65", D: "KJ98", C: "T65" },
      DUMMY: { S: "AQ93", H: "QJ2", D: "765", C: "J32" },
      RHO: { S: "KT4", H: "KT43", D: "43", C: "K987" },
      DECLARER: { S: "87", H: "A987", D: "AQT2", C: "AQ4" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads 2♠)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "S" } },
          { seat: "DUMMY", card: { rank: "9", suit: "S" } },
          { seat: "RHO", card: { rank: "T", suit: "S" } },
          { seat: "DECLARER", card: { rank: "7", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "df1-8",
    difficulty: 1,
    title: "4♥: Gold Coast Finals — passive or active?",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    auction: "P P 1♦ 1N P 2♦ P 2♥ P 2N P 3♥ P 4♥ P P P",
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♥ by West",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "active",
      themeLabel: "Theme: Go active or stay passive?",
      videoUrlBeforeStart: "https://youtube.com/shorts/_F4BreFEpk0",
      customPrompts: [
        {
          id: "df1-8-passiveOrActive",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText:
            "This was a hand from the Gold Coast Championship Finals. It proved to be a blind spot.\n\nIs this a time to go passive or active?",
          options: [
            { id: "passive", label: "Passive" },
            { id: "active", label: "Active" },
          ],
          expectedChoice: "active",
          noContinue: true,
          revealText:
            "Actually it is time to go active, the spade suit turned out to be menacing. However, it was difficult to see, because it was hidden in declarer's hand, not visible in dummy.\n\nHow could we have known this? One strong indication is that our spade suit is weak and short, whereas our diamond suit is long and strong. It's not very surprising that declarer had a long and strong spade suit, ready to use!\n\n(Gold Coast 2022 final, set 1 hand 4)\n\nWell done — take your diamond tricks before declarer uses the spades.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      LHO: { S: "8763", H: "93", D: "AT64", C: "T63" },
      DUMMY: { S: "K52", H: "AJT64", D: "87", C: "754" },
      RHO: { S: "T4", H: "K87", D: "KJ93", C: "AQ82" },
      DECLARER: { S: "AQJ9", H: "Q52", D: "Q52", C: "KJ9" },
    },
    rounds: [
      {
        label: "Trick 1 (club lead)",
        plays: [
          { seat: "LHO", card: { rank: "3", suit: "C" } },
          { seat: "DUMMY", card: { rank: "4", suit: "C" } },
          { seat: "RHO", card: { rank: "A", suit: "C" } },
          { seat: "DECLARER", card: { rank: "9", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (you lead a club back)",
        plays: [
          { seat: "RHO", card: { rank: "2", suit: "C" } },
          { seat: "DECLARER", card: { rank: "J", suit: "C" } },
          { seat: "LHO", card: { rank: "6", suit: "C" } },
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
        ],
      },
      {
        label: "Trick 3 (you win the King of hearts)",
        plays: [
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
          { seat: "LHO", card: { rank: "9", suit: "H" } },
          { seat: "DUMMY", card: { rank: "J", suit: "H" } },
          { seat: "RHO", card: { rank: "K", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "df1-9",
    difficulty: 1,
    title: "4♠: partner discourages clubs — trust the switch",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "E",
    viewerCompass: "S",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    revealFullHandsAtEnd: ["RHO", "DECLARER"],
    auction: "1C 1S P 4S P P P",
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♠ by East",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "enemyFive",
      themeLabel: "The enemy's 5 card suit",
      dummyOnRight: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/VO9Empu4-oA",
      customPrompts: [
        {
          id: "df1-9-no-switch",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "Partner's club signal is discouraging. If we switch suits, is one suit clearly wrong to lead?",
          options: [
            { id: "no_trump", label: "Never a trump" },
            { id: "no_heart", label: "Never a heart" },
            { id: "no_diamond", label: "Never a diamond" },
          ],
          expectedChoice: "no_diamond",
          noContinue: false,
          revealText:
            "Diamond — dummy's long suit. Leading it again is almost never right.\n\n99% of the time its a bad idea to play the opponent's 5 card suit. (Exceptions exist; we'll cover them later.)",
          videoUrl: "",
        },
        {
          id: "df1-9-partnership",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "So diamonds are out. That leaves hearts as the real switch.\n\nWorth agreeing with partner: discouraging clubs here often means \"I'm keen for you to play the only other sensible switch - hearts\"",
        },
        {
          id: "df1-9-partnership-2",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "Finer point: if partner had nothing in hearts, they'd usually encourage clubs instead — \"hearts aren't the answer; don't switch.\"\n\n(Leading a trump can make sense sometimes; not this problem.)",
        },
        {
          id: "df1-9-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What do you lead at trick 2?",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "heart",
          noContinue: true,
          revealText:
            "Heart. Partner steered you away from clubs — trust it.\n\n(Australian Teams Trial 2026; a strong player missed this.)",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      // North (partner): KJ / KQ98 / KJ85 / 975
      LHO: { S: "KJ", H: "KQ98", D: "KJ85", C: "975" },
      // West (dummy): 732 / A64 / AQT62 / 86
      DUMMY: { S: "732", H: "A64", D: "AQT62", C: "86" },
      // East (declarer): AQT85 / T75 / 9 / QJT2
      DECLARER: { S: "AQT85", H: "T75", D: "9", C: "QJT2" },
      // South (you): 964 / J32 / 743 / AK43
      RHO: { S: "964", H: "J32", D: "743", C: "AK43" },
    },
    rounds: [
      {
        label: "Trick 1 (A♣ lead, all follow)",
        plays: [
          { seat: "RHO", card: { rank: "A", suit: "C" } },
          { seat: "DUMMY", card: { rank: "6", suit: "C" } },
          { seat: "LHO", card: { rank: "9", suit: "C" } },
          { seat: "DECLARER", card: { rank: "2", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "df1-10",
    difficulty: 1,
    title: "4♠: partner discourages hearts — switch to diamonds",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "W",
    declarerCompass: "N",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    revealFullHandsAtEnd: ["RHO", "DECLARER"],
    auction: "P P 4S P P P",
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♠ by East",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "enemyFive",
      themeLabel: "The enemy's 5 card suit",
      dummyOnRight: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/Vva7oLnQOrI",
      customPrompts: [
        {
          id: "df1-10-switch",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "Partner has discouraged hearts. Let's say you decide to switch - what will you switch to?",
          options: [
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "diamonds",
          noContinue: true,
          revealText:
            "Diamonds.\n\nBridge is becoming easier: there is only one serious option for us to switch to, since dummy's 5-card (or longer) suits are out of the question.\n\nPartner discouraging hearts is the same as encouraging a switch to diamonds.\n\nTrust partner and play a diamond - maybe even the ##K♦## to make it easy for partner to know you have that card.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      // Partner is West = LHO when declarer is North.
      LHO: { S: "85", H: "QJT96", D: "AJ96", C: "532" },
      DECLARER: { S: "AKJ1097", H: "82", D: "543", C: "K" },
      DUMMY: { S: "Q32", H: "4", D: "Q87", C: "AQ9876" },
      // You are East = RHO when declarer is North.
      RHO: { S: "64", H: "AK753", D: "KT2", C: "JT4" },
    },
    rounds: [
      {
        label: "Trick 1 (A♥ lead, all follow)",
        plays: [
          { seat: "RHO", card: { rank: "A", suit: "H" } },
          { seat: "DUMMY", card: { rank: "4", suit: "H" } },
          { seat: "LHO", card: { rank: "6", suit: "H" } },
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "df1-11",
    difficulty: 1,
    title: "5♦: count visible tricks, then cash dummy's spades",
    trumpSuit: "D",
    contract: "5♦",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    revealFullHandsAtEnd: ["RHO", "DECLARER"],
    auction: "4D P 5D P P P",
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 5♦ by West",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "enemyFive",
      themeLabel: "The enemy's 5 card suit",
      videoUrlBeforeStart: "https://youtube.com/shorts/DDSRlEcHtBE",
      customPrompts: [
        {
          id: "df1-11-intro",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "Let's assume declarer has 8 diamonds, including the Ace. Let's count the tricks we can see.",
        },
        {
          id: "df1-11-diamonds",
          type: "SINGLE_NUMBER",
          atRoundIdx: 0,
          promptText: "How many diamond tricks does declarer have?",
          expectedAnswer: 8,
          revealText: "Declarer has 8 diamond tricks!",
        },
        {
          id: "df1-11-clubs",
          type: "SINGLE_NUMBER",
          atRoundIdx: 0,
          promptText: "How many club tricks can we see that declarer has?",
          expectedAnswer: 1,
          revealText: "Just one, the Ace.",
        },
        {
          id: "df1-11-hearts",
          type: "SINGLE_NUMBER",
          atRoundIdx: 0,
          promptText: "How many heart tricks does declarer have?",
          expectedAnswer: 2,
          revealText: "Two, if declarer has a second heart.",
        },
        {
          id: "df1-11-summary",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "So we can see declarer has 11 tricks by way of 2 hearts, 8 diamonds, and 1 club.",
        },
        {
          id: "df1-11-switch",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "So do we have any chance to beat the contract? If so what suit should we play?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "spades",
          noContinue: false,
          revealText:
            "Spades — rare case where cashing dummy's 5-card side suit is right. Take our spade winners before declarer throws losers on hearts.",
          videoUrl: "",
        },
        {
          id: "df1-11-note",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "One of the few exceptions to the \"never play dummy's 5-card suit\" idea is when we need to cash out. This will typically only happen when:\n\n• Declarer is very distributional. In such situations, for example when they have shown a 7+ card suit, or a 5-5 shape, etc, we can consider it.\n• Nevertheless, it's still not typically correct, however at least it's a consideration.",
        },
      ],
    },
    shownHands: {
      LHO: { S: "A72", H: "Q754", D: "3", C: "T9862" },
      DUMMY: { S: "QT963", H: "KJT", D: "K82", C: "A4" },
      RHO: { S: "KJ7", H: "A983", D: "6", C: "KQJ75" },
      DECLARER: { S: "84", H: "62", D: "AQJT9754", C: "3" },
    },
    rounds: [
      {
        label: "Trick 1 (Heart lead, all follow)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "H" } },
          { seat: "DUMMY", card: { rank: "T", suit: "H" } },
          { seat: "RHO", card: { rank: "A", suit: "H" } },
          { seat: "DECLARER", card: { rank: "6", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "df1-12",
    difficulty: 1,
    title: "4♠: strong dummy — find the diamond switch",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "E",
    declarerCompass: "E",
    viewerCompass: "S",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    revealFullHandsAtEnd: ["LHO", "DECLARER"],
    auction: "1N P 3C P 3S P 4S P P P",
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♠ by East",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "enemyFive",
      themeLabel: "The enemy's 5 card suit",
      dummyOnRight: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/cqB_4doDsLc",
      customPrompts: [
        {
          id: "df1-12-trick1-plan",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Continue",
          promptText:
            "A strong dummy has come down, and you can already see 3 tricks in your hand. Have a think about where your 4th trick might come from.",
        },
        {
          id: "df1-12-trick1-cash-heart",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Continue",
          promptText:
            "Let's cash a second heart first, and then decide what to do.",
        },
        {
          id: "df1-12-switch",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText:
            "There is actually a very straightforward way of beating this. Like most things in bridge, it's straightforward - but you need to see it.\n\nWhat do you play next?",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "diamond",
          noContinue: false,
          revealText:
            "The answer is a diamond. Here we break the rule and play dummy's 5+ card suit.\n\nRemember: declarer opened 1NT, so declarer typically has at least 2 diamonds. How many does that leave partner? At most 1.\n\nSo this is one of the exceptions to \"never play dummy's 5-card suit\" - we do it when we are trying to get, or give, a ruff.",
          videoUrl: "",
        },
        {
          id: "df1-12-note",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "Even in those circumstances, think twice - it's still not always right, even for a ruff.\n\nBut the point is that all bridge rules can be broken.\n\n\"Never play dummy's 5-card suit\" is such a reliable rule that even if you never break it, you'll usually be fine. I still wanted to show one of the few reasons we very occasionally do.",
        },
      ],
    },
    shownHands: {
      // North (partner)
      LHO: { S: "6542", H: "T932", D: "9", C: "QT63" },
      // West (dummy)
      DUMMY: { S: "QJ3", H: "65", D: "AKJT83", C: "42" },
      // South (you)
      RHO: { S: "A", H: "AK84", D: "7642", C: "9875" },
      // East (declarer) - 16 HCP, 5 spades, 2 diamonds
      DECLARER: { S: "KT987", H: "QJ7", D: "Q5", C: "AKJ" },
    },
    rounds: [
      {
        label: "Trick 1 (A♥ lead, all follow)",
        plays: [
          { seat: "RHO", card: { rank: "A", suit: "H" } },
          { seat: "DUMMY", card: { rank: "5", suit: "H" } },
          { seat: "LHO", card: { rank: "2", suit: "H" } },
          { seat: "DECLARER", card: { rank: "7", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (K♥ cash, all follow)",
        plays: [
          { seat: "RHO", card: { rank: "K", suit: "H" } },
          { seat: "DUMMY", card: { rank: "6", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
          { seat: "DECLARER", card: { rank: "J", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "df1-13",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♠: force declarer to ruff until trumps run out",
    trumpSuit: "S",
    contract: "4♠",
    auction: "1♠ 2♥ 3♥ P 3♠ P 4♠ P P P",
    dealerCompass: "E",
    declarerCompass: "E",
    viewerCompass: "S",
    visibleFullHandSeats: ["south", "west"],
    revealFullHandsAtEnd: ["north", "east"],
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♠ by East",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "drawTrumps",
      themeLabel: "Theme: Forcing declarer",
      dummyOnRight: true,
      videoUrlBeforeStart: "https://www.youtube.com/shorts/StIWzoOoqBA?si=DixgCgApKwMCsR2K",
      auctionHighlightCall: { row: 0, seat: "W" },
      auctionHighlightNote: "3♥ was an 11+ point spade raise.",
      customPrompts: [
        {
          id: "df1-13-track-trumps",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "Continue",
          promptText:
            "Let's keep track of trumps.\n\nA fair assumption is that East started with 5 spades.\nAfter ruffing this trick, East now has 4 left.\n\nThat is still one more spade than you.",
        },
        {
          id: "df1-13-how-many-trumps-now",
          type: "SEAT_SUIT_COUNT",
          seat: "E",
          suit: "S",
          atRoundIdx: 2,
          expected: 3,
          promptText: "How many trumps does East have now?",
          revealText: "East has 3 trumps left, still one more than you.",
        },
        {
          id: "df1-13-plan",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText: "What is your plan? Play a:",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "heart",
          revealText:
            "Keep going with hearts.\n\nVisualise what happens: one more heart, one more ruff, and suddenly trumps are equal length.",
          videoUrl: "",
        },
        {
          id: "df1-13-equal-length",
          type: "INFO",
          atRoundIdx: 3,
          continueButtonLabel: "Continue",
          promptText: "Now trumps are equal length: 2 each.",
        },
        {
          id: "df1-13-no-good-moves",
          type: "INFO",
          atRoundIdx: 4,
          continueButtonLabel: "Continue",
          promptText:
            "There are no good moves now.\n\nIf East draws the last trump and then plays clubs, you win and cash hearts.\nBest chance is to try clubs now and hope to survive one down.\n\nLet's watch it.",
        },
        {
          id: "df1-13-wrap",
          type: "INFO",
          atRoundIdx: 6,
          promptText:
            "Key point:\n- We forced repeated ruffs.\n- Trumps became equal.\n- Then East ran out first.\n\nThat final spade is now our 4th trick.\n\nThis is a very common defensive pattern: force ruffs, and the hand often falls apart.",
        },
      ],
    },
    shownHands: {
      // North (partner)
      north: { S: "96", H: "J4", D: "86532", C: "9874" },
      // West (dummy)
      west: { S: "742", H: "8753", D: "AQ", C: "KQJT" },
      // South (you)
      south: { S: "A83", H: "AKT962", D: "74", C: "A2" },
      // East (declarer)
      east: { S: "KQJT5", H: "Q", D: "KJT9", C: "653" },
    },
    rounds: [
      {
        label: "Trick 1 (A♥ lead)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "H" } },
          { seat: "W", card: { rank: "3", suit: "H" } },
          { seat: "N", card: { rank: "4", suit: "H" } },
          { seat: "E", card: { rank: "Q", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (K♥; declarer ruffs)",
        plays: [
          { seat: "S", card: { rank: "K", suit: "H" } },
          { seat: "W", card: { rank: "7", suit: "H" } },
          { seat: "N", card: { rank: "J", suit: "H" } },
          { seat: "E", card: { rank: "5", suit: "S" }, showOut: true },
        ],
      },
      {
        label: "Trick 3 (K♠ from declarer)",
        plays: [
          { seat: "E", card: { rank: "K", suit: "S" } },
          { seat: "S", card: { rank: "A", suit: "S" } },
          { seat: "W", card: { rank: "2", suit: "S" } },
          { seat: "N", card: { rank: "6", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (10♥; declarer ruffs)",
        plays: [
          { seat: "S", card: { rank: "T", suit: "H" } },
          { seat: "W", card: { rank: "8", suit: "H" } },
          { seat: "N", card: { rank: "8", suit: "D" }, showOut: true },
          { seat: "E", card: { rank: "J", suit: "S" }, showOut: true },
        ],
      },
      {
        label: "Trick 5 (Q♠ from declarer)",
        plays: [
          { seat: "E", card: { rank: "Q", suit: "S" } },
          { seat: "S", card: { rank: "3", suit: "S" } },
          { seat: "W", card: { rank: "4", suit: "S" } },
          { seat: "N", card: { rank: "9", suit: "S" } },
        ],
      },
      {
        label: "Trick 6 (declarer plays a club; you win)",
        plays: [
          { seat: "E", card: { rank: "6", suit: "C" } },
          { seat: "S", card: { rank: "A", suit: "C" } },
          { seat: "W", card: { rank: "T", suit: "C" } },
          { seat: "N", card: { rank: "4", suit: "C" } },
        ],
      },
      {
        label: "Trick 7 (heart again; declarer ruffs)",
        plays: [
          { seat: "S", card: { rank: "9", suit: "H" } },
          { seat: "W", card: { rank: "5", suit: "H" } },
          { seat: "N", card: { rank: "6", suit: "D" }, showOut: true },
          { seat: "E", card: { rank: "T", suit: "S" }, showOut: true },
        ],
      },
    ],
  },
  {
    id: "df1-14",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♠: duck two, win the Ace on the third — force declarer to ruff",
    trumpSuit: "S",
    contract: "4♠",
    auction: "1♣ P 1♠ P 2♠ P 4♠ P P P",
    dealerCompass: "W",
    declarerCompass: "E",
    viewerCompass: "S",
    visibleFullHandSeats: ["south", "west"],
    revealFullHandsAtEnd: ["north", "east"],
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♠ by East",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      playThroughRoundAfterPreInclusive: 0,
      promptThemeTint: "drawTrumps",
      themeLabel: "Theme: Forcing declarer",
      dummyOnRight: true,
      videoUrlBeforeStart: "https://www.youtube.com/shorts/lsw1baqGu1U",
      auctionHighlightCall: { row: 1, seat: "W" },
      auctionHighlightNote: "2♠ showed 4 spades.",
      customPrompts: [
        {
          id: "df1-14-groundwork",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--sky">
              <p className="ct-df14-noteTitle">Ok so the lead has gone well!</p>
              <p className="ct-df14-noteBody">
                But let's zoom out for a second and think about the trump suit.
              </p>
              <p className="ct-df14-noteBody">
                If we do the ground work now, we can more easily piece together the hand later.
              </p>
            </div>
          ),
        },
        {
          id: "df1-14-dist-4441",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 0,
          expectedDistribution: { north: 1, west: 4, south: 4, east: 4 },
          fixed: { west: 4, south: 4, east: 4 },
          promptText: "If declarer has 4 trumps, how many does partner have?",
          successText: "Right.",
        },
        {
          id: "df1-14-dist-4450",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 0,
          expectedDistribution: { north: 0, west: 4, south: 4, east: 5 },
          fixed: { west: 4, south: 4, east: 5 },
          promptText: "there is another possibility, lets say declarer has 5 trumps",
          successText: "Right.",
        },
        {
          id: "df1-14-dist-recall",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 3,
          expectedDistribution: { north: 1, west: 4, south: 4, east: 4 },
          fixed: { south: 4, west: 4, north: 1 },
          promptText: "How many spades did declarer start with?",
          successText: "Right.",
        },
        {
          id: "df1-14-trumps-left",
          type: "SINGLE_NUMBER",
          atRoundIdx: 3,
          expectedAnswer: 2,
          promptText: "How many trumps does declarer have left?",
          successText: "Two left, remember declarer ruffed a heart.",
        },
        {
          id: "df1-14-duck-spade",
          type: "PLAY_DECISION",
          atRoundIdx: 4,
          promptText: "Win this trick, or duck?",
          options: [
            { id: "win", label: "Win it" },
            { id: "duck", label: "Duck it" },
          ],
          expectedChoice: "duck",
          wrongTryText: "Duck here — keep the Ace for the next round.",
          revealText: (
            <div className="ct-df14-note ct-df14-note--gold">
              <p className="ct-df14-noteBody">
                Its very typical to duck twice with Axxx trumps, and win the Ace on the 3rd round. This regularly
                happens also with Kxxx when the Ace is gone.
              </p>
              <div className="ct-df14-chipRow" aria-label="Pattern examples">
                <span className="ct-df14-cardChip">Axxx</span>
                <span className="ct-df14-cardChip">Kxxx</span>
                <span className="ct-df14-cardChip ct-df14-cardChip--highlight">Win on round 3</span>
              </div>
              <p className="ct-df14-noteBody">
                It is a piece of pattern recognition that builds over time "duck twice with Axxx" It's almost always
                a good idea.
              </p>
            </div>
          ),
          playDecisionApplyCardOnChoice: {
            win: { seat: "S", card: { rank: "A", suit: "S" } },
            duck: { seat: "S", card: { rank: "7", suit: "S" } },
          },
        },
        {
          id: "df1-14-after-duck-note",
          type: "INFO",
          atRoundIdx: 4,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--mint">
              <p className="ct-df14-noteBody">
                Declarer is down to 1 trump, and has no good moves. If she doesn't draw trumps you will score your low
                trump as a ruff, lets see what happens if she does try draw your trumps.
              </p>
            </div>
          ),
        },
        {
          id: "df1-14-after-ace-note",
          type: "INFO",
          atRoundIdx: 5,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--rose">
              <p className="ct-df14-noteBody">
                We now hit the enemy with a the final and deadly heart, forcing a second ruff.
              </p>
            </div>
          ),
        },
        {
          id: "df1-14-final-trump-note",
          type: "INFO",
          atRoundIdx: 6,
          continueButtonLabel: "Reveal full hand",
          promptText: (
            <div className="ct-df14-note ct-df14-note--victory">
              <p className="ct-df14-noteTitle">We have the only remaining trump, and it will be our 4th trick!</p>
              <p className="ct-df14-noteBody">We have so far won two heart tricks and the Ace of trumps.</p>
            </div>
          ),
        },
      ],
    },
    shownHands: {
      north: { S: "2", H: "AJ54", D: "T642", C: "T982" },
      east: { S: "J943", H: "98", D: "QJ5", C: "AKQJ" },
      west: { S: "KQT5", H: "Q73", D: "AK3", C: "764" },
      south: { S: "A876", H: "KT62", D: "987", C: "53" },
    },
    rounds: [
      {
        label: "Trick 1 (2♥ lead; partner wins)",
        plays: [
          { seat: "S", card: { rank: "2", suit: "H" } },
          { seat: "W", card: { rank: "3", suit: "H" } },
          { seat: "N", card: { rank: "J", suit: "H" } },
          { seat: "E", card: { rank: "8", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (partner leads a heart; you win the King)",
        plays: [
          { seat: "N", card: { rank: "4", suit: "H" } },
          { seat: "E", card: { rank: "9", suit: "H" } },
          { seat: "S", card: { rank: "K", suit: "H" } },
          { seat: "W", card: { rank: "7", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (partner’s Ace; declarer ruffs)",
        plays: [
          { seat: "S", card: { rank: "6", suit: "H" } },
          { seat: "W", card: { rank: "Q", suit: "H" } },
          { seat: "N", card: { rank: "A", suit: "H" } },
          { seat: "E", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (spade toward dummy)",
        plays: [
          { seat: "E", card: { rank: "9", suit: "S" } },
          { seat: "S", card: { rank: "6", suit: "S" } },
          { seat: "W", card: { rank: "K", suit: "S" } },
          { seat: "N", card: { rank: "2", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (Jack of spades; you duck — play 3♠ in the prompt)",
        plays: [
          { seat: "W", card: { rank: "5", suit: "S" } },
          { seat: "N", card: { rank: "2", suit: "D" }, showOut: true },
          { seat: "E", card: { rank: "J", suit: "S" } },
        ],
      },
      {
        label: "Trick 6 (Ace of spades)",
        plays: [
          { seat: "E", card: { rank: "4", suit: "S" } },
          { seat: "S", card: { rank: "A", suit: "S" } },
          { seat: "W", card: { rank: "T", suit: "S" } },
          { seat: "N", card: { rank: "2", suit: "C" } },
        ],
      },
      {
        label: "Trick 7 (heart lead; dummy pitches a spade)",
        plays: [
          { seat: "S", card: { rank: "T", suit: "H" } },
          { seat: "W", card: { rank: "Q", suit: "S" } },
          { seat: "N", card: { rank: "4", suit: "D" } },
          { seat: "E", card: { rank: "J", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "df1-15",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♠ by West: forcing declarer",
    trumpSuit: "S",
    contract: "4♠",
    auction: "1♠ P 2♠ P 3♦ P 4♠ P P P",
    dealerCompass: "W",
    declarerCompass: "W",
    viewerCompass: "S",
    visibleFullHandSeats: ["S"],
    visibleFullHandSeats: ["south", "east"],
    revealFullHandsAtEnd: ["north", "west"],
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♠ by West",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "drawTrumps",
      themeLabel: "Theme: Forcing declarer",
      videoUrlBeforeStart: "https://www.youtube.com/shorts/7-mK5X3KSD4",
      customPrompts: [
        {
          id: "df1-15-force-idea",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "Is this a hand where declarer can realistically be forced to ruff, and eventually the defence has more trumps?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          revealText: (
            <div className="ct-df14-note ct-df14-note--gold">
              <p className="ct-df14-noteTitle">Yes</p>
              <p className="ct-df14-noteBody">
                Very possible. When we have 3-4 trumps, forcing declarer to ruff is often a strong plan.
              </p>
              <p className="ct-df14-noteBody">
                Earlier, when we had 4 trumps, partner had 1. Here we have 1 trump, so there is definitely a realistic
                chance partner has 4.
              </p>
              <div className="ct-df14-chipRow" aria-label="Partnership trump assets">
                <span className="ct-df14-cardChip">3-4 trumps</span>
                <span className="ct-df14-cardChip">force ruffs</span>
                <span className="ct-df14-cardChip ct-df14-cardChip--highlight">partnership assets</span>
              </div>
              <p className="ct-df14-noteBody">
                If we can force lots of ruffs, good things can happen with 4 trumps (often 3 as well).
              </p>
              <p className="ct-df14-noteBody">
                Be aware of partnership assets, not just your own hand.
              </p>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "df1-15-return-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What should we return at trick 2 if our goal is to force declarer to ruff?",
          options: [
            { id: "trump", label: "Trump" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "diamond",
          noContinue: true,
          revealText: (
            <div className="ct-df14-note ct-df14-note--victory">
              <p className="ct-df14-noteTitle">Diamond</p>
              <p className="ct-df14-noteBody">
                A diamond is a great return. Cashing the <TextWithColoredSuits text="Q♦" /> and playing another diamond forces declarer
                to ruff (or lose 4 tricks).
              </p>
              <p className="ct-df14-noteBody">
                Declarer will be forced to ruff again soon. When North wins the <TextWithColoredSuits text="K♠" />, North plays the fatal
                4th diamond for a second ruff, leaving declarer with fewer trumps than North.
              </p>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      west: { S: "AQJ75", H: "AKQJ9", D: "98", C: "9" },
      east: { S: "T36", H: "T87", D: "J657", C: "AKQ" },
      south: { S: "2", H: "65", D: "AQ4", C: "T875643" },
      north: { S: "K984", H: "432", D: "KT32", C: "J2" },
    },
    rounds: [
      {
        label: "Trick 1 (2♦ lead; low from dummy, A♦ from South, low from West)",
        plays: [
          { seat: "N", card: { rank: "2", suit: "D" } },
          { seat: "E", card: { rank: "5", suit: "D" } },
          { seat: "S", card: { rank: "A", suit: "D" } },
          { seat: "W", card: { rank: "8", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "df1-16",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♠ by West: setup hand (build)",
    trumpSuit: "S",
    contract: "4♠",
    auction: "1♠ P 2♠ P 3♦ P 4♠ P P P",
    dealerCompass: "W",
    declarerCompass: "W",
    viewerCompass: "S",
    visibleFullHandSeats: ["S", "N"],
    visibleFullHandSeats: ["south", "east"],
    revealFullHandsAtEnd: ["north", "west"],
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♠ by West",
      viewerCompassLabelOverride: "S",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "drawTrumps",
      themeLabel: "Theme: Forcing declarer",
      videoUrlBeforeStart: "https://www.youtube.com/shorts/jsGst_u7-LU",
      auctionHighlightCall: { row: 1, seat: "W" },
      auctionHighlightNote: "3♦ showed 5 card diamond suit and slam try",
      customPrompts: [
        {
          id: "df1-16-hand-sense",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--sky">
              <p className="ct-df14-noteTitle">There are some interesting facts here.</p>
              <p className="ct-df14-noteBody">Take a moment to get a feel for the hand, then continue.</p>
            </div>
          ),
        },
        {
          id: "df1-16-diamond-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "D",
          atRoundIdx: 1,
          expectedDistribution: { west: 5, south: 4, east: 3, north: 1 },
          fixed: { west: 5, south: 4, east: 3 },
          promptText: "Firstly, what is the diamond distribution? (Declarer has shown 5 diamonds in the auction.)",
          successText: "We can see partner has a singleton diamond!",
        },
        {
          id: "df1-16-trump-sense-intro",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--mint">
              <p className="ct-df14-noteTitle">Pattern recognition check</p>
              <p className="ct-df14-noteBody">
                We have a singleton trump. That should trigger a strong possibility in the trump distribution.
              </p>
              <p className="ct-df14-noteBody">What possible layout should we be thinking about?</p>
            </div>
          ),
        },
        {
          id: "df1-16-trump-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 1,
          expectedDistribution: { west: 5, east: 3, south: 1, north: 4 },
          fixed: { west: 5, east: 3, south: 1 },
          promptText: "A possible trump distribution is",
          successText:
            "Partner may have 4 trumps here. This could be a situation where we attack declarer's control of the whole hand.",
        },
        {
          id: "df1-16-what-now",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "So what should we do?",
          options: [
            { id: "ruff", label: "Give partner a ruff for now" },
            { id: "trump", label: "Play a trump" },
            { id: "heart", label: "Play a heart" },
            { id: "club", label: "Play a club" },
          ],
          expectedChoice: "heart",
          continueButtonLabel: "Lets turn over the cards and watch what happens",
          revealFullHandSeats: ["north", "west"],
          revealFullHandSeatsOnContinue: true,
          revealText: (
            <div className="ct-df14-note ct-df14-note--gold">
              <p className="ct-df14-noteTitle">Nice one!</p>
              <p className="ct-df14-noteBody">
                A ruff is a short sighted goal. The bigger prize is to challenge declarer's control of the hand by
                forcing declarer to ruff.
              </p>
              <p className="ct-df14-noteBody">Watch what happens.</p>
            </div>
          ),
        },
        {
          id: "df1-16-after-ruff-note",
          type: "INFO",
          atRoundIdx: 4,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--rose">
              <p className="ct-df14-noteTitle">Why this position is critical</p>
              <p className="ct-df14-noteBody">
                If declarer draws trumps now, partner (North) keeps one extra trump, can ruff a diamond, and then cash
                a heart winner.
              </p>
              <p className="ct-df14-noteBody">If declarer keeps playing diamonds, the result is the same.</p>
              <p className="ct-df14-noteBody">
                Declarer's trumps have dipped below the defenders' trumps, and the hand starts to collapse.
              </p>
            </div>
          ),
        },
        {
          id: "df1-16-summary",
          type: "INFO",
          atRoundIdx: 4,
          continueButtonLabel: "Show me the starting layout",
          promptText: (
            <div className="ct-df14-note ct-df14-note--victory">
              <p className="ct-df14-noteTitle">Summary</p>
              <p className="ct-df14-noteBody">Forcing declarer is a powerful strategy.</p>
              <p className="ct-df14-noteBody">
                It means making declarer ruff so the defence ends up with longer trump length than declarer.
              </p>
              <p className="ct-df14-noteBody">That can destroy declarer's control and break the hand.</p>
            </div>
          ),
        },
      ],
    },
    shownHands: {
      west: { S: "AKQ95", H: "A", D: "J9834", C: "K2" },
      east: { S: "T63", H: "9852", D: "QT7", C: "A64" },
      south: { S: "2", H: "QT63", D: "AK65", C: "J975" },
      north: { S: "J874", H: "KJ74", D: "2", C: "QT83" },
    },
    rounds: [
      {
        label: "Trick 1 (4♥ lead; 2♥, Q♥, A♥)",
        plays: [
          { seat: "N", card: { rank: "4", suit: "H" } },
          { seat: "E", card: { rank: "2", suit: "H" } },
          { seat: "S", card: { rank: "Q", suit: "H" } },
          { seat: "W", card: { rank: "A", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (3♦ lead; 2♦, Q♦, K♦)",
        plays: [
          { seat: "W", card: { rank: "3", suit: "D" } },
          { seat: "N", card: { rank: "2", suit: "D" } },
          { seat: "E", card: { rank: "Q", suit: "D" } },
          { seat: "S", card: { rank: "K", suit: "D" } },
        ],
      },
      {
        label: "Trick 3 (heart by South; low trump by West; heart by North; heart by East)",
        plays: [
          { seat: "S", card: { rank: "6", suit: "H" } },
          { seat: "W", card: { rank: "5", suit: "S" }, showOut: true },
          { seat: "N", card: { rank: "7", suit: "H" } },
          { seat: "E", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (diamond by West; club discard by North; 10♦ by East; A♦ by South)",
        plays: [
          { seat: "W", card: { rank: "4", suit: "D" } },
          { seat: "N", card: { rank: "3", suit: "C" }, showOut: true },
          { seat: "E", card: { rank: "T", suit: "D" } },
          { seat: "S", card: { rank: "A", suit: "D" } },
        ],
      },
      {
        label: "Trick 5 (heart by South; low trump by West; heart by North; heart by East)",
        plays: [
          { seat: "S", card: { rank: "T", suit: "H" } },
          { seat: "W", card: { rank: "9", suit: "S" }, showOut: true },
          { seat: "N", card: { rank: "J", suit: "H" } },
          { seat: "E", card: { rank: "8", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "df1-17",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "Summary: forcing declarer",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "W",
    declarerCompass: "W",
    viewerCompass: "S",
    visibleFullHandSeats: ["S", "N"],
    promptOptions: {
      promptPlacement: "left",
      contractLabel: "Contract is 4♠ by West",
      viewerCompassLabelOverride: "S",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "drawTrumps",
      themeLabel: "Theme: Forcing declarer",
      customPrompts: [
        {
          id: "df1-17-intro",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--sky">
              <p className="ct-df14-noteTitle">Let's summarise this section.</p>
            </div>
          ),
        },
        {
          id: "df1-17-ruffs-always",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Is it a good idea to give partner ruffs whenever you can?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          revealText: (
            <div className="ct-df14-note ct-df14-note--gold">
              <p className="ct-df14-noteTitle">No</p>
              <p className="ct-df14-noteBody">
                Not always. Ruffs are often excellent and can beat contracts, so always look for ruffs you can take or
                give.
              </p>
              <ul className="ct-revealRichPoints">
                <li>In this theme, the key weapon is forcing declarer to ruff.</li>
                <li>On many hands, that is the only realistic route to beat the contract.</li>
                <li>Here, giving partner a ruff can be bad: it can "inflict a ruff on partner."</li>
              </ul>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "df1-17-four-or-one",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--mint">
              <p className="ct-df14-noteTitle">Trump-length alert</p>
              <ul className="ct-revealRichPoints">
                <li>With 4 trumps, we can often challenge declarer's control.</li>
                <li>If you have 1 trump, partner may have 4 - be alert for that too.</li>
              </ul>
            </div>
          ),
        },
        {
          id: "df1-17-three-trumps",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Is it possible to challenge declarer's control when you only have 3 trumps?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          revealText: (
            <div className="ct-df14-note ct-df14-note--rose">
              <p className="ct-df14-noteTitle">Yes</p>
              <p className="ct-df14-noteBody">Yes, definitely still can, as problem 13 illustrates.</p>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "df1-17-axxx-kxxx",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What is the most common strategy with Axxx and frequently Kxxx in trumps?",
          options: [
            { id: "duck0", label: "Duck 0 rounds" },
            { id: "duck1", label: "Duck 1 round" },
            { id: "duck2", label: "Duck 2 rounds" },
            { id: "duck3", label: "Duck 3 rounds" },
          ],
          expectedChoice: "duck2",
          revealText: (
            <div className="ct-df14-note ct-df14-note--gold">
              <p className="ct-df14-noteTitle">Duck 2 rounds</p>
              <ul className="ct-revealRichPoints">
                <li>Very common with Axxx (and often Kxxx): duck twice, then win.</li>
                <li>If we win too early, declarer often still has enough combined trumps to cope with forcing play.</li>
              </ul>
              <p className="ct-df14-noteBody">Revisit problem 14: winning the second trump lets declarer cope comfortably.</p>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "df1-17-wrap",
          type: "INFO",
          atRoundIdx: -1,
          promptText: (
            <div className="ct-df14-note ct-df14-note--victory">
              <p className="ct-df14-noteBody">
                Understanding this declarer-vs-defenders trump struggle will deepen your bridge quickly. Even strong
                players often miss this dynamic.
              </p>
              <p className="ct-df14-noteTitle">Key features</p>
              <ul className="ct-revealRichPoints">
                <li>Declarer typically has an 8-card trump fit with dummy.</li>
                <li>Even more so when the defence has 4 trumps (a 4-1 trump split).</li>
                <li>
                  Declarer has side-suit winners you can ruff if declarer does not draw trumps. In other words, your
                  trumps are dangerous to declarer if not drawn.
                </li>
              </ul>
              <p className="ct-df14-noteBody">
                Next topic: when giving declarer ruffs actually helps declarer. Contrasting the two cases makes table
                decisions much clearer.
              </p>
            </div>
          ),
        },
      ],
    },
    shownHands: {},
    rounds: [],
  },
  {
    id: "df1-18",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "3NT: the deadly duck (declarer view)",
    trumpSuit: null,
    contract: "3NT",
    vulnerability: "E-W vulnerable",
    auction: "1NT P 3NT P P P",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["S", "N"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/Xnf4Lis76Qk?si=I3Kf2V4aYBUp0-jb",
      questionNumbers: [],
      promptThemeTint: "deadlyDuck",
      themeLabel: "Theme: Deadly Duck",
      customPrompts: [
        {
          id: "df1-18-rule-prelude",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading ct-deadlyDuckRuleHeading">This is the rule</p>
                  <div className="ct-revealRichRuleBox">
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      <strong>Rule</strong>
                    </p>
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      A time to duck: If winning gives declarer the rest of the tricks in the suit.
                    </p>
                  </div>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    Let's make the idea clear so you can use it next time you play bridge.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-18-intro-1",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--sky">
              <p className="ct-df14-noteTitle">Defence theme setup</p>
              <p className="ct-df14-noteBody">
                This is a set of problems on Defence. In order to illustrate how powerful this idea is, I want to start
                by showing you from declarer's point of view.
              </p>
              <p className="ct-df14-noteBody">
                The bidding looks strange, but this pair play 10-13 No Trump when they aren't vulnerable.
              </p>
              <p className="ct-df14-noteBody">But let's not worry about the bidding; let's worry about making the contract.</p>
            </div>
          ),
        },
        {
          id: "df1-18-intro-2",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate ct-deadlyDuckCard">
                  <p className="ct-revealRichHeading ct-deadlyDuckRuleHeading">Declarer's plan</p>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">This declarer had a simple plan - there are 6 top tricks:</p>
                  <table className="ct-deadlyDuckPlanTable" aria-label="Top tricks">
                    <tbody>
                      <tr>
                        <th scope="row">1 trick</th>
                        <td>
                          Spade <span className="ct-suitSym ct-suitSym--black">♠</span>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">3 tricks</th>
                        <td>
                          Hearts <span className="ct-suitSym ct-suitSym--red">♥</span>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">2 tricks</th>
                        <td>
                          Diamonds <span className="ct-suitSym ct-suitSym--red">♦</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                Declarer's idea was to make 3 spade tricks, a reasonable goal - mostly just needing one of the honors
                onside.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">That will bring the trick count to 8.</p>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                Also, at some point hoping to make a club trick, which should be fine provided the opponents don't cash
                too many diamond winners.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">The only real concern is if the diamond suit is a 5 card suit, in which case</p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-18-diamond-break",
          type: "DISTRIBUTION_GUESS",
          suit: "D",
          atRoundIdx: 0,
          expectedDistribution: { west: 5, north: 3, south: 4, east: 1 },
          fixed: { west: 5, north: 3, south: 4 },
          promptText: "What is the diamond break?",
          successText: "If west has 5 diamonds, east will have 1.",
        },
        {
          id: "df1-18-intro-3",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--gold">
              <p className="ct-df14-noteBody">
                Since East will only have 1 diamond anyway (if the lead is from a 5 card suit), declarer simply won the
                first trick as there is no need to hold up (East already will have none left!).
              </p>
              <p className="ct-df14-noteBody">
                Also, a club switch might not be so great for declarer - it looks like a weaker suit than diamonds!
              </p>
            </div>
          ),
        },
        {
          id: "df1-18-after-spade",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-df14-note ct-df14-note--rose">
              <p className="ct-df14-noteBody">Declarer now quite logically plays a spade to the J♠.</p>
            </div>
          ),
        },
        {
          id: "df1-18-what-next",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText: (
            <div className="ct-df14-note ct-df14-note--victory">
              <p className="ct-df14-noteBody">
                Declarer was very much so expecting to lose that trick, and then repeat the spade finesse.
              </p>
              <p className="ct-df14-noteBody">
                You would think winning the J♠ is a good thing? It turns out that East has found a deadly duck.
              </p>
              <p className="ct-df14-noteTitle">What do you play next?</p>
            </div>
          ),
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: ["spade", "heart", "diamond", "club"],
          noContinue: false,
          continueButtonLabel: "Reveal full hand",
          revealFullHandSeats: ["N", "E", "S", "W"],
          revealFullHandSeatsOnContinue: true,
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">Trick question</p>
                  <p className="ct-revealRichBody">
                    It is a trick question, to get you thinking. Because nothing works, the duck has destroyed declarer's
                    chances.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "df1-18-what-next-detail",
          type: "INFO",
          atRoundIdx: 2,
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichBody">
                    If declarer plays spades, he gets lucky - they break 3-3. Except East throws away the K♠ on the A♠,
                    and West gets in. This allows West to play diamonds, and setup enough tricks to beat the contract
                    when he wins the A♣.
                  </p>
                  <p className="ct-revealRichBody">
                    If you try come back to hand with a club, West wins the club, clears clubs. Now when East wins the
                    K♠, he has lots of club tricks to cash.
                  </p>
                  <p className="ct-revealRichBody">
                    A diamond back to hand? Also losing, now the diamond gates are wide open, and when East wins the K♠,
                    a club to West's hand will be 1 off.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-18-rule-duck",
          type: "INFO",
          atRoundIdx: 2,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichHeading ct-deadlyDuckRuleHeading">Rule: A time to duck</p>
                  <div className="ct-revealRichRuleBox">
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      <strong>Rule</strong>
                    </p>
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      A time to duck: If winning gives declarer the rest of the tricks in the suit.
                    </p>
                  </div>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    On this hand, you can see the spade suit is robust enough to take the rest of the tricks if you win
                    your King, so duck is likely to be a good idea.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    No rule in bridge is 100% perfect, but I've found this rule to be right far more often than it is
                    wrong. Try it out, develop the confidence to do it smoothly at the table. Have a good attitude in
                    the rare instances it goes wrong.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    shownHands: {
      west: { S: "Q76", H: "932", D: "QJT95", C: "A7" },
      east: { S: "K43", H: "J765", D: "8", C: "JT932" },
      south: { S: "852", H: "T84", D: "AK32", C: "K64" },
      north: { S: "AJT9", H: "AKQ", D: "764", C: "Q85" },
    },
    rounds: [
      {
        label: "Opening lead shown (Q♦ on table)",
        plays: [{ seat: "W", card: { rank: "Q", suit: "D" } }],
      },
      {
        label: "Trick 1 (Q♦ lead; 4♦, 8♦, A♦)",
        plays: [
          { seat: "W", card: { rank: "Q", suit: "D" } },
          { seat: "N", card: { rank: "4", suit: "D" } },
          { seat: "E", card: { rank: "8", suit: "D" } },
          { seat: "S", card: { rank: "A", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (2♠, 6♠, J♠, 3♠)",
        plays: [
          { seat: "S", card: { rank: "2", suit: "S" } },
          { seat: "W", card: { rank: "6", suit: "S" } },
          { seat: "N", card: { rank: "J", suit: "S" } },
          { seat: "E", card: { rank: "3", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "df1-19",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♠: deadly duck in hearts",
    trumpSuit: "S",
    contract: "4♠",
    auction: "1♣ P 1♠ P 3♠ P 4♠ P P P",
    dealerCompass: "E",
    declarerCompass: "W",
    viewerCompass: "S",
    visibleFullHandSeats: ["S", "E"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/jjgeR-KvxR8?si=QMxyIlSmL0_HAM0x",
      questionNumbers: [],
      promptThemeTint: "deadlyDuck",
      themeLabel: "Theme: Deadly Duck",
      customPrompts: [
        {
          id: "df1-19-rule",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading ct-deadlyDuckRuleHeading">Rule - A time to duck</p>
                  <div className="ct-revealRichRuleBox">
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      <strong>Rule</strong>
                    </p>
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      A time to duck: If winning gives declarer the rest of the tricks in the suit.
                    </p>
                  </div>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    Let's see if we have an easy time spotting it here.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-19-system-note",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate ct-deadlyDuckCard">
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                    In their system East showed 16-18 with 4 spades, seems reasonable if you count an extra point for
                    the doubleton club (and you should with a trump fit).
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                    Partner is off to a diamond lead which looks good for you, perhaps you can set up some diamond
                    winners. A small interesting point for this hand - your partner is not someone who randomly
                    underleads Aces, so you know declarer has that card.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                    Declarer has the AK of diamonds, and should've won the first trick with the Ace, not the King (as
                    declarer it's often correct to win with the highest of equal cards, it will keep the defenders
                    guessing more).
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-19-heart-fired",
          type: "INFO",
          atRoundIdx: 1,
          promptText: "Declarer immediately fires off a heart.",
        },
        {
          id: "df1-19-take-or-duck",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "Take the trick or duck?",
          options: [
            { id: "take", label: "Take" },
            { id: "duck", label: "Duck" },
          ],
          expectedChoice: "duck",
          noContinue: false,
          revealFullHandSeats: ["N", "E", "S", "W"],
          revealFullHandSeatsOnContinue: true,
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">Duck</p>
                  <p className="ct-revealRichBody">
                    Duck, because if you take the trick, it looks certain that declarer will easily scoop up the rest
                    of heart tricks, so it fits in with our rule.
                  </p>
                </div>
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichHeading ct-deadlyDuckRuleHeading">Rule</p>
                  <div className="ct-revealRichRuleBox">
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      <strong>Rule</strong>
                    </p>
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      A time to duck: If winning gives declarer the rest of the tricks in the suit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-19-wrap",
          type: "INFO",
          atRoundIdx: 2,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate ct-deadlyDuckCard">
                  <p className="ct-revealRichHeading ct-deadlyDuckRuleHeading">Declarer is in trouble</p>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                    Declarer is in trouble here, in fact, the contract has become hopeless.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                    The key idea of the hand is, declarer wants to set up the hearts before the diamond losers are
                    exposed. But now that declarer is stuck in dummy with the J♥, he has no moves. He has to get back
                    to hand to play the heart suit up again - but doing so opens up the diamond losers!
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                    The key idea - ducking hurts declarer because he needs to burn an entry to play the suit up again.
                    Entries are limited in bridge, putting strain on declarer's entries will often defeat the contract.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    shownHands: {
      west: { S: "J762", H: "542", D: "AK7", C: "872" },
      east: { S: "AK83", H: "KJT9", D: "486", C: "A5" },
      south: { S: "95", H: "A63", D: "QJ93", C: "KJ64" },
      north: { S: "QT4", H: "Q87", D: "T52", C: "QT93" },
    },
    rounds: [
      {
        label: "Trick 1 (diamond lead: low, 4, J, King)",
        plays: [
          { seat: "N", card: { rank: "2", suit: "D" } },
          { seat: "E", card: { rank: "4", suit: "D" } },
          { seat: "S", card: { rank: "J", suit: "D" } },
          { seat: "W", card: { rank: "K", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (2♥, 7♥, J♥ — your turn)",
        plays: [
          { seat: "W", card: { rank: "2", suit: "H" } },
          { seat: "N", card: { rank: "7", suit: "H" } },
          { seat: "E", card: { rank: "J", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 completed (2♥, 7♥, J♥, 3♥)",
        keepExistingTrickCards: true,
        plays: [{ seat: "S", card: { rank: "3", suit: "H" } }],
      },
    ],
  },
  {
    id: "df1-20",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♠: competitive auction, deadly duck setup",
    trumpSuit: "S",
    contract: "4♠",
    auction: "1♠ 2♥ 2♠ 3♥ 4♦ P 4♠ P P P",
    dealerCompass: "W",
    declarerCompass: "W",
    viewerCompass: "S",
    visibleFullHandSeats: ["S", "E"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/uhyJvHJvN50?si=31XuwsL_H85efJBm",
      questionNumbers: [],
      promptThemeTint: "deadlyDuck",
      themeLabel: "Theme: Deadly Duck",
      customPrompts: [
        {
          id: "df1-20-auction-idea-1",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate ct-deadlyDuckCard">
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                    In their system, 4D showed a 5 card suit. This is reasonably common in competitive auctions,
                    showing shapely hands so partner has all the information to know whether it's best to defend or
                    declare on the 4 level, if the opponents decide to bid.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                    The idea is - if your points complement partner, it's often good to declare, if you are misfitting,
                    it may be better to defend.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-20-auction-idea-2",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate ct-deadlyDuckCard">
                  <p className="ct-revealRichHeading ct-deadlyDuckRuleHeading">Summary</p>
                  <ul className="ct-revealRichPoints">
                    <li>
                      Shortage opposite partner's length/strength is a misfit and indicates defending is better.
                    </li>
                    <li>
                      Strength and quality cards opposite partner's length indicates a fit and that declaring could go
                      well, Kx for example is an excellent holding opposite partner's second suit, whereas a singleton
                      is bad for declaring - it will be difficult to set that suit up as declarer.
                    </li>
                  </ul>
                  <p className="ct-revealRichBody ct-deadlyDuckBody">
                    The main point, however, is the play - so let's move to that.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-20-heart-count",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 2,
          expectedDistribution: { west: 2, east: 3, south: 3, north: 5 },
          fixed: { east: 3, south: 3 },
          promptText: "Lets practice our counting habit. What was the heart distribution?",
          successText: "Declarer had 2 hearts, Partner 5, Dummy 3, 3 for us.",
        },
        {
          id: "df1-20-trumps-left",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 2,
          expectedDistribution: { west: 5, east: 3, south: 3, north: 2 },
          fixed: { west: 5, east: 3, south: 3 },
          promptText:
            "Declarer is now on lead and about to draw trumps.\n\nAgain lets practice the habit. How many trumps do we expect from partner?",
          successText: "We are expecting two trumps from partner.",
        },
        {
          id: "df1-20-trumps-drawn-note",
          type: "INFO",
          atRoundIdx: 5,
          continueButtonLabel: "continue",
          promptText:
            "With trumps drawn, we are expecting declarer to try setup his long side suit - diamonds.",
        },
        {
          id: "df1-20-diamond-duck",
          type: "PLAY_DECISION",
          atRoundIdx: 6,
          promptText: "Take it or duck it?",
          options: [
            { id: "duck", label: "Duck" },
            { id: "take", label: "Take" },
          ],
          expectedChoice: "duck",
          noContinue: false,
          continueButtonLabel: "Reveal full hand",
          revealFullHandSeats: ["N", "E", "S", "W"],
          revealFullHandSeatsOnContinue: true,
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">Duck</p>
                  <p className="ct-revealRichBody">Duck, this conforms with the rule.</p>
                </div>
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichHeading ct-deadlyDuckRuleHeading">Rule - The time to duck</p>
                  <div className="ct-revealRichRuleBox">
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      <strong>Rule</strong>
                    </p>
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      A time to duck: If winning gives declarer the rest of the tricks in the suit.
                    </p>
                  </div>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    I'm not saying that ducking will always magically make tricks appear, but more often than not, for
                    a host of reasons, it can do good things.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    Most often declarer's entries can be affected, but in this context, something nice happens. Let's
                    reveal the full hand to watch what happens when you duck the Queen.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-20-final-note",
          type: "INFO",
          atRoundIdx: 8,
          promptText:
            "Declarer took a finesse into the Jack, which was the setting trick. If, however, you had won the Ace, declarer would've had no choice but to just bang down the K♦ when he got in, as there was no entry to dummy to take the losing finesse! (declarer of course cannot see all the cards, and was hoping it was a winning finesse, which is more likely than hoping the Jack will fall).",
        },
      ],
    },
    shownHands: {
      west: { S: "KQJA7", H: "95", D: "KT764", C: "A" },
      east: { S: "842", H: "J73", D: "Q85", C: "KJ92" },
      south: { S: "T65", H: "Q84", D: "A93", C: "T765" },
      north: { S: "93", H: "AKT62", D: "J2", C: "Q843" },
    },
    rounds: [
      {
        label: "Trick 1 (A♥, 3♥, 4♥, 5♥)",
        plays: [
          { seat: "N", card: { rank: "A", suit: "H" } },
          { seat: "E", card: { rank: "3", suit: "H" } },
          { seat: "S", card: { rank: "4", suit: "H" } },
          { seat: "W", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (K♥, 7♥, 8♥, 9♥)",
        plays: [
          { seat: "N", card: { rank: "K", suit: "H" } },
          { seat: "E", card: { rank: "7", suit: "H" } },
          { seat: "S", card: { rank: "8", suit: "H" } },
          { seat: "W", card: { rank: "9", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (2♥, J♥, Q♥, 7♠)",
        plays: [
          { seat: "N", card: { rank: "2", suit: "H" } },
          { seat: "E", card: { rank: "J", suit: "H" } },
          { seat: "S", card: { rank: "Q", suit: "H" } },
          { seat: "W", card: { rank: "7", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (A♠, 3♠, 2♠, 5♠)",
        plays: [
          { seat: "W", card: { rank: "A", suit: "S" } },
          { seat: "N", card: { rank: "3", suit: "S" } },
          { seat: "E", card: { rank: "2", suit: "S" } },
          { seat: "S", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (K♠, 9♠, 4♠, 6♠)",
        plays: [
          { seat: "W", card: { rank: "K", suit: "S" } },
          { seat: "N", card: { rank: "9", suit: "S" } },
          { seat: "E", card: { rank: "4", suit: "S" } },
          { seat: "S", card: { rank: "6", suit: "S" } },
        ],
      },
      {
        label: "Trick 6 (Q♠, 6♥, 8♠, T♠)",
        plays: [
          { seat: "W", card: { rank: "Q", suit: "S" } },
          { seat: "N", card: { rank: "6", suit: "H" } },
          { seat: "E", card: { rank: "8", suit: "S" } },
          { seat: "S", card: { rank: "T", suit: "S" } },
        ],
      },
      {
        label: "Trick 7 (4♦, 2♦, Q♦ — your turn)",
        plays: [
          { seat: "W", card: { rank: "4", suit: "D" } },
          { seat: "N", card: { rank: "2", suit: "D" } },
          { seat: "E", card: { rank: "Q", suit: "D" } },
        ],
      },
      {
        label: "Trick 7 completed (3♦ by South)",
        keepExistingTrickCards: true,
        plays: [{ seat: "S", card: { rank: "3", suit: "D" } }],
      },
      {
        label: "Trick 8 (5♦ by East, 9♦ by South, T♦ by West, J♦ by North)",
        plays: [
          { seat: "E", card: { rank: "5", suit: "D" } },
          { seat: "S", card: { rank: "9", suit: "D" } },
          { seat: "W", card: { rank: "T", suit: "D" } },
          { seat: "N", card: { rank: "J", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "df1-21",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♠: deadly duck in trumps",
    trumpSuit: "S",
    contract: "4♠",
    auction: "1♣ P 1♠ P 3♠ P 4♠ P P P",
    dealerCompass: "E",
    declarerCompass: "W",
    viewerCompass: "S",
    visibleFullHandSeats: ["S", "E"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/9ICdGaWWw_E?si=9GhycZ76WxY6vRQv",
      questionNumbers: [],
      promptThemeTint: "deadlyDuck",
      themeLabel: "Theme: Deadly Duck",
      customPrompts: [
        {
          id: "df1-21-duck-or-win",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Let's get ready to play smoothly. If declarer plays a trump (spade) up, what are we going to do?",
          options: [
            { id: "duck", label: "Duck" },
            { id: "win", label: "Win" },
          ],
          expectedChoice: "duck",
          noContinue: false,
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">Duck</p>
                  <div className="ct-revealRichRuleBox">
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      <strong>Rule</strong>
                    </p>
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      A time to duck: If winning gives declarer the rest of the tricks in the suit.
                    </p>
                  </div>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">This applies for the trump suit also.</p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-21-post-trump-duck",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <div className="ct-revealRichRuleBox">
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      <strong>Rule</strong>
                    </p>
                    <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                      A time to duck: If winning gives declarer the rest of the tricks in the suit.
                    </p>
                  </div>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">This applies to the trump suit as well.</p>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    Declarer now in dummy may try a low spade, losing to partner's Jack. It really is a guess for
                    declarer: they could try the <TextWithColoredSuits text="K♠" />, but that would lose if you ducked with Ax (a
                    doubleton), which is equally as reasonable.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-21-plan-note",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "Continue",
          revealFullHandSeats: ["N", "E", "S", "W"],
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    The idea of this hand is declarer wants to draw trumps as soon as possible, and then play clubs,
                    pitching a diamond. Ducking messes up that plan. Declarer can't conveniently come back to hand to
                    play a spade up again, so has to guess what to do while in dummy (play the K or play low). In fact,
                    both could be losing options if North had, for example, AJx.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    Perhaps declarer misplayed and should've played a spade to the 10, that's not the point for us
                    today.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    shownHands: {
      east: { S: "KQT9", H: "54", D: "987", C: "AKQJ" },
      west: { S: "8764", H: "Q87", D: "AK2", C: "953" },
      south: { S: "A53", H: "A92", D: "QJ6", C: "T874" },
      north: { S: "J2", H: "KJT63", D: "T543", C: "62" },
    },
    rounds: [
      {
        label: "Trick 1 (3♦, 7♦, J♦, A♦)",
        plays: [
          { seat: "N", card: { rank: "3", suit: "D" } },
          { seat: "E", card: { rank: "7", suit: "D" } },
          { seat: "S", card: { rank: "J", suit: "D" } },
          { seat: "W", card: { rank: "A", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (4♠, 2♠, K♠, 3♠)",
        plays: [
          { seat: "W", card: { rank: "4", suit: "S" } },
          { seat: "N", card: { rank: "2", suit: "S" } },
          { seat: "E", card: { rank: "K", suit: "S" } },
          { seat: "S", card: { rank: "3", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "df1-22",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♥: deadly duck setup",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "W",
    declarerCompass: "W",
    viewerCompass: "S",
    visibleFullHandSeats: ["S", "E"],
    auction: "1♥ P 1NT P 4♥ P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/Uw4fAerizJ0?si=QgMuZYSmYfRy80nr",
      questionNumbers: [],
      promptThemeTint: "deadlyDuck",
      themeLabel: "Theme: Deadly Duck",
      customPrompts: [
        {
          id: "df1-22-rule-exception",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    We need to give an exception to our rule. If you think declarer may have a singleton in that suit,
                    do not duck.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    Hint: in modern-day partnerships, players sometimes give count. That can help you in these
                    situations, for example in the diamond suit.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-22-count-hint",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    You have 4 diamonds, dummy has 4. If you are concerned declarer has a singleton, partner would have
                    4.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    If partner shows an even number of cards, take the Ace and be on the safe side, as it is possible
                    partner has 4.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    If partner shows an odd number of cards, it is no longer possible for declarer to have 1 and
                    partner to have 4.
                  </p>
                  <p className="ct-revealRichBody ct-deadlyDuckRuleBody">
                    That is a good partnership bridge idea, but for our purposes the main point is this: if you think
                    it could be a singleton, be careful with the duck and don't do it.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-22-take-or-duck",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "Is this a time to duck or take?",
          options: [
            { id: "duck", label: "Duck" },
            { id: "winAce", label: "Win the Ace" },
          ],
          expectedChoice: "winAce",
          noContinue: false,
          continueButtonLabel: "Reveal full hand",
          revealFullHandSeats: ["N", "E", "S", "W"],
          revealFullHandSeatsOnContinue: true,
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">Win the Ace</p>
                  <p className="ct-revealRichBody">
                    Win the Ace. Declarer has shown a distributional hand with lots of hearts, so it is quite possible
                    they have a singleton diamond.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-22-final-note",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "continue",
          promptText: "Declarer only has 9 tricks, and is trying to steal a 10th in diamonds.",
        },
      ],
    },
    shownHands: {
      east: { S: "9842", H: "4", D: "KQT9", C: "9876" },
      west: { S: "AK7", H: "AKQJ732", D: "2", C: "53" },
      south: { S: "65", H: "986", D: "A863", C: "KJ42" },
      north: { S: "QJT3", H: "T5", D: "J754", C: "AQT" },
    },
    rounds: [
      {
        label: "Trick 1 (Q♠, 2♠, 5♠, A♠)",
        plays: [
          { seat: "N", card: { rank: "Q", suit: "S" } },
          { seat: "E", card: { rank: "2", suit: "S" } },
          { seat: "S", card: { rank: "5", suit: "S" } },
          { seat: "W", card: { rank: "A", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (2♦, 4♦, K♦ — your turn)",
        plays: [
          { seat: "W", card: { rank: "2", suit: "D" } },
          { seat: "N", card: { rank: "4", suit: "D" } },
          { seat: "E", card: { rank: "K", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "df1-23",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♥: opening lead fundamentals",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "E",
    declarerCompass: "E",
    viewerCompass: "S",
    visibleFullHandSeats: ["S"],
    auction: "1♥ P 1NT P 4♥ P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      infoContinueSkipsDoneScreen: true,
      questionNumbers: [],
      videoUrlBeforeStart: "https://youtube.com/shorts/IXuSsxHaj2o?si=vvdTtaIG3HFbHzI3",
      promptThemeTint: "openingLead",
      themeLabel: "Theme: Opening Leads",
      customPrompts: [
        {
          id: "df1-23-lead",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "Please click the card you would lead",
          playCardResponderSeat: "S",
          playCardRequireCorrect: false,
          playCardRevealHideSuccessBanner: true,
          expectedSuit: "S",
          correctRevealText: "Great choice.",
          wrongRevealText: "Great try.",
          playCardShowNextCustomPromptOnContinue: true,
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText:
            "This may come as a big shock to many people, but the doubleton lead will be one of your absolute strongest leads, consistently.\n\nBefore looking at why, a quick word on leads in general.\n\nOpening leads are not luck - a \"good\" lead can work out badly from time to time, but overall good players get a very big edge from leading well.\n\nLeads are also the starting point for your partnership discussions - understanding what your partner would lead and why helps you get on the same page, align your goals, and anticipate and read your partner's lead more effectively.",
          videoUrl: "",
        },
        {
          id: "df1-23-rules",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Continue",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichHeading">Let's set in stone two rules</p>
                  <p className="ct-revealRichBody">
                    1. Leading from random a single honor is in general a bad idea (We'll look at the exceptions). So
                    leads from K1084, or Q76 for example, are bad leads.
                  </p>
                  <p className="ct-revealRichBody">
                    2. Small doubleton leads are excellent leads against suit contracts. Honor doubleton, such as Kx
                    score very badly, they are high volatility leads that won't work out well in the long run.
                  </p>
                  <p className="ct-revealRichBody">
                    I've given you a concise but reliable summary there, but if you want further information on this
                    topic, the book "WInning leads against suit contracts" has done extensive computer analysis on
                    leads and has found doubletons to consistently come out far ahead, against a very large range of
                    suit contracts.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "df1-23-why-doubletons",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Finish",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichHeading">The reason they are so effective is</p>
                  <p className="ct-revealRichBody">
                    1. They do not give away a trick, whereas leading from a King, Queen or Jack will often give
                    trick(s) away.
                  </p>
                  <p className="ct-revealRichBody">2. You often get ruffs if you lead your doubleton.</p>
                  <p className="ct-revealRichBody">3. You set up partner's tricks - (this is a big reason).</p>
                  <p className="ct-revealRichBody">
                    4. Opponent's are not likely to have shortage in this suit, so may be a source of winners for
                    you. Think about it like this - if you lead a long suit, often declarer or dummy is short in that
                    suit, and you don't end up making tricks there.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    shownHands: {
      south: { S: "53", H: "Q83", D: "KT84", C: "A943" },
    },
    rounds: [
      {
        label: "Opening lead",
        plays: [],
      },
    ],
  },
  {
    id: "df1-24",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♠: opening lead fundamentals",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "E",
    declarerCompass: "E",
    viewerCompass: "S",
    visibleFullHandSeats: ["S"],
    auction: "1♠ P 2♠ P 4♠ P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "https://youtube.com/shorts/LG2TivW7OUE?si=AnKfJ-PB-zGqRpfA",
      promptThemeTint: "openingLead",
      themeLabel: "Theme: Opening Leads",
      customPrompts: [
        {
          id: "df1-24-lead",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "Please click the card you would lead",
          playCardResponderSeat: "S",
          playCardRequireCorrect: false,
          playCardRevealHideSuccessBanner: true,
          expectedSuit: "D",
          correctRevealText: "Correct — the singleton is best.",
          wrongRevealText: "Not quite — the singleton is best.",
          noContinue: true,
          revealText:
            "The singleton lead against a trump contract should almost always be the #1 choice.\n\nA heart is an attractive option when you have a triple honor sequence like that, but the singleton lead is still too powerful. The only lead that beats a singleton is if you have say AKx(x). The Ace lead there comes out ahead (you can often switch to your singleton anyway after leading the A from AK).\n\nA very unattractive option is the club.\n\nLong suits are not good in such situations, and leading away from a single honor like that is a quick and simple way to lose lots of tricks! (don't do it!)",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "873", H: "KQJ2", D: "5", C: "Q9643" },
    },
    rounds: [
      {
        label: "Opening lead",
        plays: [],
      },
    ],
  },
  {
    id: "df1-25",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "3NT: opening lead — longest and strongest",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "E",
    declarerCompass: "W",
    viewerCompass: "S",
    visibleFullHandSeats: ["S"],
    auction: "1NT P 3NT P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "https://youtube.com/shorts/3_xPeJzX7Cw?si=DuCXbNia_xUzxqOr",
      promptThemeTint: "openingLead",
      themeLabel: "Theme: Opening Leads",
      customPrompts: [
        {
          id: "df1-25-lead",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "Please click the card you would lead",
          playCardResponderSeat: "S",
          playCardRequireCorrect: false,
          playCardRevealHideSuccessBanner: true,
          expectedSuit: ["S", "H"],
          correctRevealText: "Correct.",
          wrongRevealText: "Not quite.",
          noContinue: true,
          revealText:
            "A Spade or even heart is your best lead here.\n\nIn this auction, where responder has not investigated a major (has 3 at most in either major), the major lead comes out far ahead. It should be automatic unless you have an attractive 5 card minor, and even then the major is still a consideration (see \"winning leads against No Trump\" by David Bird for the computer analysis on this if you are a skeptic).\n\nRule: When responder has not shown the majors, that will often be the enemy's weakness and your partner's strength. Lead a major.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "854", H: "72", D: "K963", C: "Q1063" },
    },
    rounds: [
      {
        label: "Opening lead",
        plays: [],
      },
    ],
  },
  {
    id: "df1-26",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♠: opening lead — forcing declarer exception",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "E",
    declarerCompass: "E",
    viewerCompass: "S",
    visibleFullHandSeats: ["S"],
    auction: "1♠ 2♣ 2♠ P 4♠ P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "https://youtube.com/shorts/Pqbk1UcSIAU?si=kHfiXzCoQQw-w8c1",
      promptThemeTint: "openingLead",
      themeLabel: "Theme: Opening Leads",
      customPrompts: [
        {
          id: "df1-26-lead",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "Please click the card you would lead",
          playCardResponderSeat: "S",
          playCardRequireCorrect: false,
          playCardRevealHideSuccessBanner: true,
          expectedSuit: "C",
          expectedRank: "K",
          correctRevealText: "Correct.",
          wrongRevealText: "Not quite.",
          noContinue: true,
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichBody">
                    We break the previously set rules by leading the <TextWithColoredSuits text="K♣" />, why?
                  </p>
                  <p className="ct-revealRichBody">
                    Bridge is a dynamic game, and this is an exception that comes up occasionally, a minority of
                    times, but is worth understanding.
                  </p>
                  <p className="ct-revealRichBody">
                    The theme was looked at in problems 13-17 in Defence "Forcing Declarer". We have long trumps, and
                    strength. There is a good chance we can force declarer to lose control of the hand by playing
                    clubs, forcing declarer and/or dummy to ruff. Check out problems 13-17 for more on this theme.
                  </p>
                  <p className="ct-revealRichBody">The characteristics of this hand are</p>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ width: "42px", verticalAlign: "top", padding: "8px 8px 8px 0" }}>1.</td>
                        <td style={{ verticalAlign: "top", padding: "8px 0" }}>
                          Strength, we have Outside Aces, and a strong suit
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "42px", verticalAlign: "top", padding: "8px 8px 8px 0" }}>2.</td>
                        <td style={{ verticalAlign: "top", padding: "8px 0" }}>A good solid suit</td>
                      </tr>
                      <tr>
                        <td style={{ width: "42px", verticalAlign: "top", padding: "8px 8px 8px 0" }}>3.</td>
                        <td style={{ verticalAlign: "top", padding: "8px 0" }}>
                          Good trumps, with length, at least 3 cards but typically 4. Kxxx or Axxx are strong signs
                          this defense is correct.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      south: { S: "AT72", H: "A", D: "64", C: "KQJ942" },
    },
    rounds: [
      {
        label: "Opening lead",
        plays: [],
      },
    ],
  },
  {
    id: "df1-27",
    difficulty: 1,
    playEngine: "compassClockwise",
    seatMode: "compass",
    title: "4♠: opening lead — attack with a heart",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "E",
    declarerCompass: "E",
    viewerCompass: "S",
    visibleFullHandSeats: ["S"],
    auction: "1♠ P 2♦ P 2♠ P 4♠ P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "https://youtube.com/shorts/qFsxl9HMfsk?si=xqhORjpZi9UW2ujN",
      promptThemeTint: "openingLead",
      themeLabel: "Theme: Opening Leads",
      customPrompts: [
        {
          id: "df1-27-lead",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "Please click the card you would lead",
          playCardResponderSeat: "S",
          playCardRequireCorrect: false,
          playCardRevealHideSuccessBanner: true,
          playCardShowNextCustomPromptOnContinue: true,
          expectedSuit: "H",
          correctRevealText: "Correct — lead a heart.",
          wrongRevealText: "Best lead here is a heart.",
          noContinue: false,
          continueButtonLabel: "Continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichBody">A heart lead is best here, even though it is from the King.</p>
                  <p className="ct-revealRichBody">
                    1. Dummy has a long diamond suit. Declarer can set that suit up and throw losers. You need to
                    attack quickly: time is ticking.
                  </p>
                  <p className="ct-revealRichBody">
                    2. Dummy&apos;s likely shortage is in clubs (the suit you are longest in). Dummy might be 3=3=6=1,
                    for example. You are often not making many club tricks because dummy can ruff, but you may have
                    heart tricks to set up. <strong>Leading your 5+ card suit here is often a bad choice.</strong>
                  </p>
                  <p className="ct-revealRichBody">
                    3. This is usually not the time for a trump lead. The threat of dummy&apos;s long diamond suit is
                    serious and puts you under time pressure, so you cannot just sit back and lead a trump. You need
                    to develop your tricks quickly.
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "df1-27-key",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Finish",
          promptText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichHeading">
                    So what is the key on this hand that indicates leading aggressively, from a King?
                  </p>
                  <p className="ct-revealRichBody">
                    1. Shorter suits are typically better to lead than long suits when opponents have a trump fit and
                    side sources of tricks.
                  </p>
                  <p className="ct-revealRichBody">
                    2. You can take risks when the opponent&apos;s have a lingering source of tricks like this auction
                    suggests.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    shownHands: {
      south: { S: "65", H: "K103", D: "K52", C: "J8643" },
    },
    rounds: [
      {
        label: "Opening lead",
        plays: [],
      },
    ],
  },
  {
    id: "df3-1",
    difficulty: 3,
    title: "4♥: you win the K♥ — which suit now?",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    auction: "P P 1♦ 1N P 2♦ P 2♥ P 2N P 3♥ P 4♥ P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "df3-1-whatSuit",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText: "You win the K♥. What suit should you play now?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "diamonds",
          noContinue: true,
          wrongTryText: "Good try! Think about taking your tricks — and which suit is menacing in dummy.",
          motivationText: "Well done — take your diamond tricks before declarer uses the spades.",
          revealText:
            "Diamonds. You need to take diamond tricks. The spade suit is actually menacing in declarer's hand.\n\nHow could we have known this? One strong indication is that our spade suit is weak and short, whereas our diamond suit is long and strong. It's not very surprising that declarer had a long and strong spade suit, ready to use!\n\n(Gold Coast 2022 final, set 1 hand 4)",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      LHO: { S: "8763", H: "93", D: "AT64", C: "T63" },
      DUMMY: { S: "K52", H: "AJT64", D: "87", C: "754" },
      RHO: { S: "T4", H: "K87", D: "KJ93", C: "AQ82" },
      DECLARER: { S: "AQJ9", H: "Q52", D: "Q52", C: "KJ9" },
    },
    rounds: [
      {
        label: "Trick 1 (club lead)",
        plays: [
          { seat: "LHO", card: { rank: "3", suit: "C" } },
          { seat: "DUMMY", card: { rank: "4", suit: "C" } },
          { seat: "RHO", card: { rank: "A", suit: "C" } },
          { seat: "DECLARER", card: { rank: "9", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (you lead a club back)",
        plays: [
          { seat: "RHO", card: { rank: "2", suit: "C" } },
          { seat: "DECLARER", card: { rank: "J", suit: "C" } },
          { seat: "LHO", card: { rank: "6", suit: "C" } },
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
        ],
      },
      {
        label: "Trick 3 (you win the King of hearts)",
        plays: [
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
          { seat: "LHO", card: { rank: "9", suit: "H" } },
          { seat: "DUMMY", card: { rank: "J", suit: "H" } },
          { seat: "RHO", card: { rank: "K", suit: "H" } },
        ],
      },
    ],
  },
];

export { DEFENCE_PUZZLES };

function DefenceTrainer(routeProps) {
  return <CountingTrumpsTrainer {...routeProps} puzzlesOverride={DEFENCE_PUZZLES} trainerLabel="Defence" categoryKey="defence" />;
}

export default DefenceTrainer;


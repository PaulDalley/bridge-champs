import React from "react";
import CountingTrumpsTrainer from "../Counting/CountingTrumpsTrainer";

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
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "",
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
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "",
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
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "",
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
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "",
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
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    auction: "2♠ P 4♠ P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "active",
      videoUrlBeforeStart: "",
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
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    auction: "1♥ P 2♥ P 4♥ P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "active",
      videoUrlBeforeStart: "",
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
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    auction: "1NT P 3NT P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "active",
      videoUrlBeforeStart: "",
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
      promptThemeTint: "active",
      videoUrlBeforeStart: "",
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
    id: "df2-1",
    difficulty: 2,
    title: "Defending 3♥: count declarer's shape (and duck the spade)",
    trumpSuit: "H",
    contract: "3♥",
    auction: "1♥ 3♣ 3♥ P P P P",
    dealerCompass: "W",
    declarerCompass: "W",
    viewerCompass: "S",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    promptOptions: {
      questionNumbers: [],
      manualTrickAdvance: true,
      startAutoPlayThroughRoundIdx: 0,
      focusNote: "West opened 1♥, showing at least 5 hearts.",
      seatShapeTarget: "DECLARER",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "df2-1-clubs",
          type: "SEAT_SUIT_COUNT",
          seat: "DECLARER",
          suit: "C",
          atRoundIdx: 4,
          promptText: "Declarer has shown out in clubs — how many clubs did declarer start with?",
          expected: 2,
        },
        {
          id: "df2-1-trumpDistPrefill",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 6,
          expectedDistribution: { LHO: 2, DUMMY: 3, RHO: 3, DECLARER: 5 },
          fixed: { LHO: 2, RHO: 3, DUMMY: 3 },
          promptText:
            "Partner has shown 2 hearts — we can figure out how many trumps declarer started with now. The original trump distribution was",
        },
        {
          id: "df2-1-diamondDist",
          type: "DISTRIBUTION_GUESS",
          suit: "D",
          atRoundIdx: 8,
          expectedDistribution: { LHO: 3, DUMMY: 3, RHO: 4, DECLARER: 3 },
          promptText: "What was the ORIGINAL diamond distribution?",
        },
        {
          id: "df2-1-shape",
          type: "SEAT_SHAPE",
          atRoundIdx: 8,
          promptText:
            "Now you have enough information for declarer's shape. What was it? (S H D C)",
        },
        {
          id: "df2-1-duckSpade",
          type: "PLAY_DECISION",
          atRoundIdx: 8,
          promptText:
            "Declarer is about to play a spade up — do you need to grab the Ace in a hurry?",
          options: [
            { id: "yes", label: "Yes — take the Ace" },
            { id: "no", label: "No — duck smoothly" },
          ],
          expectedChoice: "no",
          endHandAfterReveal: true,
          revealText:
            "No. We know declarer started with 3 spades. If you duck smoothly, maybe he will play your partner for doubleton spade (Ax) and play low. Always give your opponents a chance to go wrong.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      LHO: { S: "72", H: "Q4", D: "AK6", C: "AQT982" },
      DUMMY: { S: "943", H: "K72", D: "JT7", C: "K753" },
      RHO: { S: "AJT85", H: "863", D: "8532", C: "6" },
      DECLARER: { S: "KQ6", H: "AJT95", D: "Q94", C: "J4" },
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "LHO", card: { rank: "A", suit: "C" } },
          { seat: "DUMMY", card: { rank: "3", suit: "C" } },
          { seat: "RHO", card: { rank: "6", suit: "C" } },
          { seat: "DECLARER", card: { rank: "4", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (club ruff)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "C" } },
          { seat: "DUMMY", card: { rank: "K", suit: "C" } },
          { seat: "RHO", card: { rank: "3", suit: "H" }, showOut: true },
          { seat: "DECLARER", card: { rank: "J", suit: "C" } },
        ],
      },
      {
        label: "Trick 3",
        plays: [
          { seat: "RHO", card: { rank: "2", suit: "D" } },
          { seat: "DECLARER", card: { rank: "4", suit: "D" } },
          { seat: "LHO", card: { rank: "A", suit: "D" } },
          { seat: "DUMMY", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 4 (Q on the K)",
        plays: [
          { seat: "LHO", card: { rank: "K", suit: "D" } },
          { seat: "DUMMY", card: { rank: "T", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "D" } },
        ],
      },
      {
        label: "Trick 5 (club ruff)",
        plays: [
          { seat: "LHO", card: { rank: "T", suit: "C" } },
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
          { seat: "RHO", card: { rank: "5", suit: "S" }, showOut: true },
          { seat: "DECLARER", card: { rank: "9", suit: "H" }, showOut: true },
        ],
      },
      {
        label: "Trick 6 (A♥)",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "H" } },
          { seat: "LHO", card: { rank: "4", suit: "H" } },
          { seat: "DUMMY", card: { rank: "2", suit: "H" } },
          { seat: "RHO", card: { rank: "6", suit: "H" } },
        ],
      },
      {
        label: "Trick 7 (to dummy's K♥)",
        plays: [
          { seat: "DECLARER", card: { rank: "T", suit: "H" } },
          { seat: "LHO", card: { rank: "Q", suit: "H" } },
          { seat: "DUMMY", card: { rank: "K", suit: "H" } },
          { seat: "RHO", card: { rank: "8", suit: "H" } },
        ],
      },
      {
        label: "Trick 8 (spade to the king)",
        plays: [
          { seat: "DUMMY", card: { rank: "3", suit: "S" } },
          { seat: "RHO", card: { rank: "T", suit: "S" } },
          { seat: "DECLARER", card: { rank: "K", suit: "S" } },
          { seat: "LHO", card: { rank: "2", suit: "S" } },
        ],
      },
      {
        label: "Trick 9 (third diamond to dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "9", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
          { seat: "DUMMY", card: { rank: "J", suit: "D" } },
          { seat: "RHO", card: { rank: "5", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "df3-1",
    difficulty: 3,
    title: "4♥: you win the King of hearts — which suit now?",
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
          promptText: "You win the King of hearts. What suit should you play now?",
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

function DefenceTrainer() {
  return <CountingTrumpsTrainer puzzlesOverride={DEFENCE_PUZZLES} trainerLabel="Defence" categoryKey="defence" />;
}

export default DefenceTrainer;


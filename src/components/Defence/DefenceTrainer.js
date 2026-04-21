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
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
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
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
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
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "enemyFive",
      themeLabel: "The enemy's 5 card suit",
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
    revealFullHandsAtEnd: ["LHO", "DECLARER"],
    auction: "P 4S P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "enemyFive",
      themeLabel: "The enemy's 5 card suit",
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
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["RHO", "DUMMY"],
    revealFullHandsAtEnd: ["LHO", "DECLARER"],
    auction: "4D P 5D P P P",
    promptOptions: {
      promptPlacement: "left",
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
    visibleFullHandSeats: ["LHO", "DUMMY"],
    revealFullHandsAtEnd: ["RHO", "DECLARER"],
    auction: "1N P 3C P 3S P 4S P P P",
    promptOptions: {
      promptPlacement: "left",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "enemyFive",
      themeLabel: "The enemy's 5 card suit",
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
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      promptThemeTint: "drawTrumps",
      themeLabel: "Forcing declarer",
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

export { DEFENCE_PUZZLES };

function DefenceTrainer(routeProps) {
  return <CountingTrumpsTrainer {...routeProps} puzzlesOverride={DEFENCE_PUZZLES} trainerLabel="Defence" categoryKey="defence" />;
}

export default DefenceTrainer;


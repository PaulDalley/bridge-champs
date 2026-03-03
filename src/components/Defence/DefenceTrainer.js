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
      customPrompts: [
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
      customPrompts: [
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


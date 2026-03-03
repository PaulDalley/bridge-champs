import React from "react";
import CountingTrumpsTrainer from "../Counting/CountingTrumpsTrainer";

const CARDPLAY_PUZZLES = [
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
      customPrompts: [
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
          revealText:
            "This meets the conditions for setting up a long suit.\n\n✓ Dummy has opening strength values\n✓ Dummy has a long suit\n\nIn these type of hands it is preferable to go after the long suit rather than look for ruffs.",
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
      // Start by showing Trick 1 only; user clicks → for Trick 2.
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
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
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
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
];

function CardPlayTrainer() {
  return <CountingTrumpsTrainer puzzlesOverride={CARDPLAY_PUZZLES} trainerLabel="Declarer Play" categoryKey="declarer" />;
}

export default CardPlayTrainer;


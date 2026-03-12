import React from "react";
import CountingTrumpsTrainer from "../Counting/CountingTrumpsTrainer";

/**
 * Bidding practice: opening (1–5) and responding (6–10). Uses CountingTrumpsTrainer with question-only flow (no tricks).
 */
const BIDDING_PUZZLES = [
  // --- Opening: Do you open the bidding? (1–5) ---
  {
    id: "bid1-1",
    difficulty: 1,
    title: "Opening (1): Do you open?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Do you open the bidding?",
      promptThemeTint: "points",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "bid1-1-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This series is about training your eye to recognise what a \"good\" and \"bad\" hand look like. Even at a glance, it will start to stick out to you.\n\nWith minimal effort you want to know whether to open the hand or not.",
          videoUrl: "",
        },
        {
          id: "bid1-1-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do you open this?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: true,
          revealText:
            "No. This hand has 11 points. We typically open most 12-point hands, but when we have less than that we need to use judgment.\n\nThis is what I would call a \"bad\" 11. The hand has several flaws:\n\n✗ There are no 10s and 9s.\n\n✗ The hand is very balanced, 4333.\n\n✗ The honours are scattered everywhere — you don't have a collection of honours/strength in any suit.\n\nWithout doubt this is a pass.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "QJ2", H: "K32", D: "Q432", C: "K32" },
    },
    rounds: [],
  },
  {
    id: "bid1-2",
    difficulty: 1,
    title: "Opening (2): Do you open?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Do you open the bidding?",
      promptThemeTint: "points",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "bid1-2-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do you open this?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes. In contrast to the previous hand, this one has:\n\n✓ More shape — 4432 rather than 4333.\n\n✓ Honour cards nicely clustered in two suits; concentrated strength works better than scattered. \"They work better together.\"\n\n✓ Length and/or strength in the majors is a good thing; here you have both.\n\n✓ Quality cards — an Ace and two Kings.\n\n✓ Excellent intermediate cards (10s and 9s) to complement your long, strong suits.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AKT2", H: "KJT2", D: "65", C: "432" },
    },
    rounds: [],
  },
  {
    id: "bid1-3",
    difficulty: 1,
    title: "Opening (3): Do you open?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Do you open the bidding?",
      promptThemeTint: "points",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "bid1-3-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do you open this?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes. We have to draw the line somewhere, but it might have to be at 9 points. This hand has excellent shape; the 6-card suit is robust. It is unbalanced, 6313, which gives it even better prospects of succeeding in a suit contract.\n\nYou could open a weak 2 if you play that, but you could argue that this hand fits the bill of an opening hand — the Aces and Kings, and the overall \"purity\" (cards in the right places/suits) is so good.\n\nContrast this hand with, say, ♠Q9xxxx ♥xxx ♦A ♣KJx — both hands are 10 points, yet our actual hand is leagues better.\n\nEven though spades is the likely contract if your side is to win the bidding, believe it or not this hand could even be an excellent dummy if partner has hearts or even clubs. More on this to come.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AKT982", H: "KT2", D: "6", C: "432" },
    },
    rounds: [],
  },
  {
    id: "bid1-4",
    difficulty: 1,
    title: "Opening (4): Should you open?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Do you open the bidding?",
      promptThemeTint: "points",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "bid1-4-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Should you open this?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: true,
          revealText:
            "No. There has to be a cutoff. At the end of the day it is a 10-point hand that is balanced and not exceptional. It is not a bad hand — in fact it's very close to opening quality.\n\nPlus points include:\n\n✓ A strong 5-card suit with intermediate card(s).\n✓ Kings are good — better than Queens and Jacks typically.\n✓ No points in the shortage (doubleton) is often a good thing.\n\nNegatives include:\n\n✗ No Aces.\n✗ Simply not enough points — draw the line at 10 usually.\n✗ Somewhat balanced, 5332 — 5431 or 5521 becomes more attractive to open.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KJT98", H: "K32", D: "KT2", C: "65" },
    },
    rounds: [],
  },
  {
    id: "bid1-5",
    difficulty: 1,
    title: "Opening (5): Do you open? (Bobby's hand)",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Do you open the bidding?",
      promptThemeTint: "points",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "bid1-5-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Do you open this?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: ["yes", "no"],
          noContinue: true,
          revealText:
            "This is a famous hand, a bit of a trick question. Yes and No are both good answers. In general I would suggest against opening 8-point hands, but it is worth understanding the rationale at least.\n\nBob Richman, one of Australia's best ever players (although he wasn't born in Australia), once opened this exact hand. Bobby was later asked by someone why or how he opened that and he responded something like \"Don't tell your mother.\"\n\nWhat was Bobby's reason to open such a low HCP (high card point) hand?\n\n✓ Shapely 5521 is a big asset if you end up declaring the hand in a suit.\n✓ Both majors — the hand has both majors, giving you good prospects of finding a major suit part-score or game.\n✓ Aces are the boss card (and best card); also the 10s and 9s pad the suits up a lot, to make up for the lack of HCP.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "AT982", H: "AT832", D: "65", C: "2" },
    },
    rounds: [],
  },
  // --- Responding (6–10) ---
  {
    id: "bid1-6",
    difficulty: 1,
    title: "Responding (6): Partner opens 1♥",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ P ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "You are responder, what will you do?",
      promptThemeTint: "respond",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "bid1-6-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "Partner has opened; your only job here is to describe your hand.",
          videoUrl: "",
        },
        {
          id: "bid1-6-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Your bid?",
          options: [
            { id: "1s", label: "1♠" },
            { id: "2h", label: "2♥" },
            { id: "pass", label: "Pass" },
            { id: "other", label: "Something else" },
          ],
          expectedChoice: "2h",
          noContinue: true,
          revealText:
            "I like to bid 2♥. There is a golden rule of bridge: \"Always support partner\". Without that rule, we are lost.\n\nIf I see my opponents break this rule, I smile and know it will be an easy game.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KT982", H: "QJ7", D: "6", C: "8752" },
    },
    rounds: [],
  },
  {
    id: "bid1-7",
    difficulty: 1,
    title: "Responding (7): North 1♥, East 1♠, your bid",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ 1♠ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "You are responder, what will you do?",
      promptThemeTint: "respond",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "bid1-7-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do you do?",
          options: [
            { id: "bid", label: "Bid something" },
            { id: "pass", label: "Pass" },
          ],
          expectedChoice: "bid",
          noContinue: false,
          revealText:
            "Bid something. Partner has overcalled; we have enough to respond (6 or 7+ points). We must always try to \"bid our hand\".",
          videoUrl: "",
        },
        {
          id: "bid1-7-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do we bid?",
          options: [
            { id: "support", label: "Support partner" },
            { id: "1nt", label: "1NT" },
            { id: "other", label: "Something else" },
          ],
          expectedChoice: "other",
          noContinue: false,
          revealText:
            "Something else. We need 3 cards to support partner. \"Always support partner WHEN you have support.\" As for 1NT — that should show a heart stopper.",
          videoUrl: "",
        },
        {
          id: "bid1-7-q3",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "So what should we bid?",
          options: [
            { id: "suit", label: "One of our suits" },
            { id: "dbl", label: "Double (×)" },
          ],
          expectedChoice: "dbl",
          noContinue: true,
          revealText:
            "It is correct to double here. It conveys:\n\n(a) I have some points, say 6+.\n\n(b) I typically have the other two suits (takeout shape).",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "K8", H: "762", D: "KJT8", C: "QT92" },
    },
    rounds: [],
  },
  {
    id: "bid1-8",
    difficulty: 1,
    title: "Responding (8): 1♠ 3♦",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ 3♦ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "You are responder, what will you do?",
      promptThemeTint: "respond",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "bid1-8-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "You are considering making a bid. Firstly — does it matter what the opponent's 3♦ bid means?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: false,
          revealText:
            "No. Basically it doesn't matter at all. Our goal is to bid our hand; often there is noise or chaos going on around us, but if possible we ignore the opponents and simply bid our hand.\n\nThis sounds strange, but as we do more and more problems, this idea will be clear.",
          videoUrl: "",
        },
        {
          id: "bid1-8-q2",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Let's say we did bid. What would we bid?",
          options: [
            { id: "support", label: "Support partner" },
            { id: "other", label: "Something else" },
          ],
          expectedChoice: "support",
          noContinue: false,
          revealText: "Support partner. Remember the golden rule — \"Always support partner.\"",
          videoUrl: "",
        },
        {
          id: "bid1-8-q3",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "So, finally, can we bid 3♠?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes we can. As a general rule, if we were able to raise partner to 2♠, we will typically take the push to 3♠ if needed.\n\nIt is a bit pushy, but it is better than the alternative of passing and pretending like you have nothing useful at all.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KT8", H: "AT7", D: "65", C: "87652" },
    },
    rounds: [],
  },
  {
    id: "bid1-9",
    difficulty: 1,
    title: "Responding (9): 1♠ 4♦",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♠ 4♦ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "You are responder, what will you do?",
      promptThemeTint: "respond",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "bid1-9-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "The opponents have made this difficult. Can we still follow the golden rule and support partner?",
          options: [
            { id: "4s", label: "Yes, bid 4♠" },
            { id: "pass", label: "No, pass" },
          ],
          expectedChoice: "pass",
          noContinue: true,
          revealText:
            "Pass — we have to stop somewhere unfortunately.\n\nLet's take a reality check. We have 7 points, partner may have say 12 points. That gives us a combined 19 points and an 8-card fit; we could be far too high bidding 4♠ with so little to spare.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KT8", H: "AT7", D: "65", C: "87652" },
    },
    rounds: [],
  },
  {
    id: "bid1-10",
    difficulty: 1,
    title: "Responding (10): 1♣ 1♥",
    trumpSuit: "C",
    contract: "—",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ 1♥ ?",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "You are responder, what will you do?",
      promptThemeTint: "respond",
      newUntil: "2026-04-15",
      videoUrlBeforeStart: "",
      customPrompts: [
        {
          id: "bid1-10-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "What do we bid?",
          options: [
            { id: "support", label: "Support partner" },
            { id: "spades", label: "Bid our spade suit" },
          ],
          expectedChoice: "spades",
          noContinue: true,
          revealText:
            "We should bid our spade suit. So why are we breaking the golden rule? There are two reasons:\n\n1. The main reason is — Majors are very important, especially spades. (More on this to come.) It's a good idea to try to find a major fit (hearts or spades).\n\n2. A 1♣ opening can often be 2 or 3 depending on your system. So raising clubs should really show 5 or even 6.\n\nEvery good bridge rule has a few exceptions here and there; that's what makes the game great!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DECLARER: { S: "KT982", H: "76", D: "65", C: "AQ97" },
    },
    rounds: [],
  },
];

function BiddingTrainer() {
  return (
    <CountingTrumpsTrainer
      puzzlesOverride={BIDDING_PUZZLES}
      trainerLabel="Bidding"
      categoryKey="bidding"
    />
  );
}

export default BiddingTrainer;

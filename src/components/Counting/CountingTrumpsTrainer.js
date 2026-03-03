import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./CountingTrumpsTrainer.css";

// Seats arranged like a typical bridge diagram:
// - Dummy at top, Declarer at bottom, LHO left, RHO right.
const SEATS = ["LHO", "DUMMY", "RHO", "DECLARER"];

const SUIT_SYMBOL = {
  S: "♠",
  H: "♥",
  D: "♦",
  C: "♣",
};

const SUIT_NAME = {
  S: "spades",
  H: "hearts",
  D: "diamonds",
  C: "clubs",
};

function makeCard(rank, suit) {
  return { rank: String(rank), suit: String(suit) };
}

function formatCard(card) {
  if (!card) return "";
  const sym = SUIT_SYMBOL[card.suit] || card.suit;
  const rank = card.rank === "T" ? "10" : card.rank;
  return `${rank}${sym}`;
}

function displayRank(rank) {
  if (rank === "T") return "10";
  return String(rank);
}

/** Renders explanation/reveal text with paragraphs and styled ✓ lists for better readability */
function FormattedRevealText({ text, className = "" }) {
  if (!text || !String(text).trim()) return null;
  const blocks = String(text).trim().split(/\n\n+/);
  return (
    <div className={`ct-revealContent ${className}`.trim()}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^\s*✓/.test(l.trim()));
        if (isList) {
          return (
            <ul key={i} className="ct-revealList">
              {lines.map((line, j) => (
                <li key={j} className="ct-revealListItem">
                  {line.trim()}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="ct-revealParagraph">
            {block.trim()}
          </p>
        );
      })}
    </div>
  );
}

function suitSymbol(suit) {
  return SUIT_SYMBOL[suit] || suit;
}

function isTrump(card, trumpSuit) {
  if (!card || !trumpSuit) return false;
  return card.suit === trumpSuit;
}

function cardColorClass(card) {
  if (!card) return "";
  return card.suit === "H" || card.suit === "D" ? "ct-card--red" : "ct-card--black";
}

function parseHandSuitString(s) {
  if (!s) return [];
  return String(s)
    .trim()
    .split("")
    .filter(Boolean);
}

function computeSuitLengthsFromShownHands(puzzle, suit) {
  const out = {};
  for (const seat of SEATS) {
    const h = puzzle?.shownHands?.[seat];
    if (!h) return null;
    if (h.suit && Array.isArray(h.cards)) {
      if (h.suit !== suit) return null;
      out[seat] = h.cards.length;
      continue;
    }
    if (!isFullHandShape(h)) return null;
    out[seat] = parseHandSuitString(h[suit]).length;
  }
  return out;
}

function computeSuitLengthsFromPlayedThroughRound(puzzle, throughRoundIdx) {
  const out = { S: {}, H: {}, D: {}, C: {} };
  for (const suit of ["S", "H", "D", "C"]) {
    for (const seat of SEATS) out[suit][seat] = 0;
  }
  const rounds = puzzle?.rounds || [];
  for (let r = 0; r <= throughRoundIdx; r++) {
    const plays = rounds[r]?.plays || [];
    for (const p of plays) {
      const s = p?.card?.suit;
      const seat = p?.seat;
      if (!s || !out[s] || !SEATS.includes(seat)) continue;
      out[s][seat] += 1;
    }
  }
  const all13 = {};
  for (const suit of ["S", "H", "D", "C"]) {
    const total = SEATS.reduce((sum, seat) => sum + (out[suit][seat] || 0), 0);
    if (total === 13) all13[suit] = out[suit];
  }
  return { counts: out, all13 };
}

function rankValue(rank) {
  const r = String(rank || "").toUpperCase();
  const order = "23456789TJQKA";
  const idx = order.indexOf(r === "10" ? "T" : r);
  return idx === -1 ? -1 : idx;
}

function computeTrickCountExpectedThroughRound(puzzle, throughRoundIdx) {
  const out = { S: 0, H: 0, D: 0, C: 0 };
  const rounds = puzzle?.rounds || [];
  const trumpSuit = puzzle?.trumpSuit;
  for (let r = 0; r <= throughRoundIdx; r++) {
    const plays = rounds[r]?.plays || [];
    if (!plays.length) continue;
    const ledSuit = plays[0]?.card?.suit;
    let winning = plays[0];
    for (const p of plays) {
      const c = p.card;
      if (!c) continue;
      const w = winning.card;
      const pIsTrump = trumpSuit && c.suit === trumpSuit;
      const wIsTrump = trumpSuit && w.suit === trumpSuit;
      if (pIsTrump && !wIsTrump) {
        winning = p;
        continue;
      }
      if (pIsTrump && wIsTrump) {
        if (rankValue(c.rank) > rankValue(w.rank)) winning = p;
        continue;
      }
      if (!wIsTrump && c.suit === ledSuit && w.suit === ledSuit) {
        if (rankValue(c.rank) > rankValue(w.rank)) winning = p;
      }
      if (!wIsTrump && w.suit !== ledSuit && c.suit === ledSuit) {
        winning = p;
      }
    }
    const winnerSeat = winning.seat;
    const winnerIsDeclarerSide = winnerSeat === "DECLARER" || winnerSeat === "DUMMY";
    if (!winnerIsDeclarerSide) continue;
    const winSuit = winning.card?.suit;
    if (winSuit && out[winSuit] !== undefined) out[winSuit] += 1;
  }
  return out;
}

const QUESTION = {
  // Numbers you can reference when you send me a new puzzle
  DEFENDERS_TRUMPS_AT_START: 1,
  TRUMPS_STILL_OUT_AFTER_EVENT: 2,
  ORIGINAL_SUIT_DISTRIBUTION_AT_EVENT: 3,
  SEAT_SHAPE: 4,
  TRICK_COUNT: 5,
};

function isSuitContract(puzzle) {
  return !!puzzle?.trumpSuit && ["S", "H", "D", "C"].includes(puzzle.trumpSuit);
}

function contractToText(puzzle) {
  if (!puzzle) return "";
  if (typeof puzzle.contract === "string") return puzzle.contract;
  const lvl = puzzle.contract?.level;
  const strain = puzzle.contract?.strain;
  if (!lvl || !strain) return "";
  if (strain === "NT") return `${lvl}NT`;
  return `${lvl}${SUIT_SYMBOL[strain] || strain}`;
}

/** Renders contract text (e.g. "4♥") with hearts/diamonds in red */
function ContractWithColoredSuit({ text }) {
  if (!text) return null;
  const m = text.match(/^(\d)(♥|♦)$/);
  if (m) return <>{m[1]}<span className="ct-suitSym--red">{m[2]}</span></>;
  const m2 = text.match(/^(\d)(♠|♣)$/);
  if (m2) return <>{m2[1]}<span className="ct-suitSym--black">{m2[2]}</span></>;
  return <>{text}</>;
}

function auctionToText(puzzle) {
  const a = puzzle?.auction;
  if (!a) return "";
  if (Array.isArray(a)) return a.join(" ");
  return String(a);
}

function normalizeAuctionTokens(auctionText) {
  if (!auctionText) return [];
  return String(auctionText)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function parseAuctionCall(token) {
  const raw = String(token || "").trim();
  const upper = raw.toUpperCase();
  if (upper === "P" || upper === "PASS") return { text: "P", kind: "pass" };
  if (upper === "X" || upper === "D" || upper === "DBL") return { text: "X", kind: "dbl" };
  if (upper === "XX" || upper === "RDBL") return { text: "XX", kind: "rdbl" };
  if (/^\dNT$/i.test(raw)) return { text: raw.toUpperCase(), kind: "nt" };

  // e.g. 4♠, 1♥, 3♦, 2♣
  const m = raw.match(/^(\d)([SHDC♠♥♦♣])$/);
  if (m) {
    const lvl = m[1];
    const strainRaw = m[2];
    const strain =
      strainRaw === "♠"
        ? "S"
        : strainRaw === "♥"
          ? "H"
          : strainRaw === "♦"
            ? "D"
            : strainRaw === "♣"
              ? "C"
              : strainRaw;
    const sym = SUIT_SYMBOL[strain] || strainRaw;
    const isRed = strain === "H" || strain === "D";
    return { text: lvl, suitSym: sym, kind: "suit", isRed };
  }

  return { text: raw, kind: "other" };
}

// Auction table display order: align with on-screen compass positions (top/right/bottom/left).
const COMPASS_ORDER = ["N", "E", "S", "W"];
const CLOCKWISE = ["N", "E", "S", "W"]; // bidding/play rotation
const AUCTION_DISPLAY_ORDER = ["W", "N", "E", "S"]; // common auction grid order (BBO-like)
function partnerCompass(seat) {
  const i = CLOCKWISE.indexOf(seat);
  return i === -1 ? "S" : CLOCKWISE[(i + 2) % 4];
}
function lhoCompass(seat) {
  const i = CLOCKWISE.indexOf(seat);
  return i === -1 ? "W" : CLOCKWISE[(i + 1) % 4];
}
function rhoCompass(seat) {
  const i = CLOCKWISE.indexOf(seat);
  return i === -1 ? "E" : CLOCKWISE[(i + 3) % 4];
}

function parseBidToken(token) {
  const raw = String(token || "").trim();
  if (!raw) return null;
  const upper = raw.toUpperCase();
  const nt = upper.match(/^(\d)\s*NT$/i);
  if (nt) return { level: Number(nt[1]), strain: "NT" };
  const m = raw.match(/^(\d)([SHDC♠♥♦♣])$/i);
  if (!m) return null;
  const lvl = Number(m[1]);
  const strainRaw = m[2];
  const strain =
    strainRaw === "♠"
      ? "S"
      : strainRaw === "♥"
        ? "H"
        : strainRaw === "♦"
          ? "D"
          : strainRaw === "♣"
            ? "C"
            : String(strainRaw).toUpperCase();
  return { level: lvl, strain };
}

function inferDeclarerCompassFromAuction({ auctionText, dealerCompass = "N" }) {
  const tokens = normalizeAuctionTokens(auctionText);
  if (!tokens.length) return null;

  const dealerIdx = Math.max(0, CLOCKWISE.indexOf(dealerCompass));
  const seatForIdx = (i) => CLOCKWISE[(dealerIdx + i) % 4];

  let finalIdx = -1;
  let finalBid = null;
  for (let i = tokens.length - 1; i >= 0; i--) {
    const b = parseBidToken(tokens[i]);
    if (b) {
      finalIdx = i;
      finalBid = b;
      break;
    }
  }
  if (finalIdx === -1 || !finalBid) return null;

  const finalSeat = seatForIdx(finalIdx);
  const declaringSide = finalSeat === "N" || finalSeat === "S" ? "NS" : "EW";
  for (let i = 0; i < tokens.length; i++) {
    const b = parseBidToken(tokens[i]);
    if (!b) continue;
    if (b.strain !== finalBid.strain) continue;
    const s = seatForIdx(i);
    const side = s === "N" || s === "S" ? "NS" : "EW";
    if (side === declaringSide) return s;
  }
  return finalSeat;
}

function seatCompassLabel(seat) {
  // Auction grid now uses compass seats directly.
  return seat;
}

function buildAuctionGrid({ auctionText, dealerCompass = "N" }) {
  const order = AUCTION_DISPLAY_ORDER;
  const dealerIdxInOrder = Math.max(0, order.indexOf(dealerCompass));
  const cols = { W: [], N: [], E: [], S: [] }; // arrays by row index
  const tokens = normalizeAuctionTokens(auctionText);
  for (let i = 0; i < tokens.length; i++) {
    // Offset rows so calls *before* dealer appear as blanks in row 0.
    // This makes "opening bid by South" appear in the South column with blanks before it,
    // and subsequent calls fall on the next row when dealer is late in the display order.
    const pos = dealerIdxInOrder + i;
    const seat = order[pos % 4];
    const row = Math.floor(pos / 4);
    cols[seat][row] = parseAuctionCall(tokens[i]);
  }
  const rowCount = Math.max(cols.W.length, cols.N.length, cols.E.length, cols.S.length);
  const rows = [];
  for (let r = 0; r < rowCount; r++) {
    rows.push({
      W: cols.W[r] || null,
      N: cols.N[r] || null,
      E: cols.E[r] || null,
      S: cols.S[r] || null,
    });
  }
  return { order, rows };
}

function resolveQuestionPlan(puzzle, perspectiveSeat, eventSuit) {
  const nums = Array.isArray(puzzle?.promptOptions?.questionNumbers) ? puzzle.promptOptions.questionNumbers : null;
  const suitContract = isSuitContract(puzzle);
  const isTrumpEvent = !!eventSuit && eventSuit === puzzle?.trumpSuit;
  const isDeclarerSide = perspectiveSeat === "DECLARER" || perspectiveSeat === "DUMMY";

  // Default: preserve current trainer flow (start trumps, still out, then distribution on first known suit).
  const defaultNums = (() => {
    if (suitContract) {
      return [
        QUESTION.DEFENDERS_TRUMPS_AT_START,
        QUESTION.TRUMPS_STILL_OUT_AFTER_EVENT,
        QUESTION.ORIGINAL_SUIT_DISTRIBUTION_AT_EVENT,
      ];
    }
    // NT default: no “trumps” questions, but we can still ask suit distribution at the first show-out.
    return [QUESTION.ORIGINAL_SUIT_DISTRIBUTION_AT_EVENT];
  })();

  // If questionNumbers is provided (even empty), treat it as authoritative.
  const chosen = nums ? nums : defaultNums;

  const pre = [];
  const post = [];
  for (const n of chosen) {
    if (n === QUESTION.DEFENDERS_TRUMPS_AT_START) {
      if (suitContract) {
        if (isDeclarerSide) pre.push("DEFENDERS_STARTED");
        else post.push("DEFENDERS_STARTED"); // defender POV: ask when trumps are known
      }
    } else if (n === QUESTION.TRUMPS_STILL_OUT_AFTER_EVENT) {
      if (suitContract) {
        post.push("DEFENDERS_REMAINING");
      }
    } else if (n === QUESTION.ORIGINAL_SUIT_DISTRIBUTION_AT_EVENT) {
      post.push("DISTRIBUTION");
    } else if (n === QUESTION.SEAT_SHAPE) {
      post.push("SEAT_SHAPE");
    } else if (n === QUESTION.TRICK_COUNT) {
      post.push("TRICK_COUNT");
    }
  }

  return { pre, post };
}

function isFullHandShape(handObj) {
  return (
    handObj &&
    typeof handObj === "object" &&
    ["S", "H", "D", "C"].some((k) => Object.prototype.hasOwnProperty.call(handObj, k))
  );
}

function inferSuitLengthsFromVisibleAndPlayed({ puzzle, suit, throughRoundIdx, visibleFullHandSeats = [] }) {
  if (!puzzle || !suit) return null;
  const played = computeSuitLengthsFromPlayedThroughRound(puzzle, throughRoundIdx);
  const mins = played?.counts?.[suit];
  if (!mins) return null;

  const knownExact = {};
  for (const seat of SEATS) {
    const legacy = puzzle?.shownHands?.[seat];
    if (legacy?.suit && Array.isArray(legacy.cards) && legacy.suit === suit) {
      knownExact[seat] = legacy.cards.length;
      continue;
    }
    if (visibleFullHandSeats.includes(seat) && isFullHandShape(puzzle?.shownHands?.[seat])) {
      knownExact[seat] = parseHandSuitString(puzzle.shownHands[seat][suit]).length;
    }
  }

  const sumExact = Object.values(knownExact).reduce((a, b) => a + (Number(b) || 0), 0);
  if (sumExact > 13) return null;
  const remaining = 13 - sumExact;
  const unknownSeats = SEATS.filter((s) => typeof knownExact[s] !== "number");
  if (unknownSeats.length === 0) return knownExact;

  const sumMinsUnknown = unknownSeats.reduce((acc, s) => acc + (mins[s] || 0), 0);
  if (sumMinsUnknown !== remaining) return null;

  const out = { ...knownExact };
  for (const s of unknownSeats) out[s] = mins[s] || 0;
  return out;
}

function inferSuitLengthsFromShowOutsAndVisible({ puzzle, suit, throughRoundIdx, visibleFullHandSeats = [] }) {
  if (!puzzle || !suit) return null;
  const knownFromShowOut = computeKnownSuitCountsThroughRound(puzzle.rounds || [], throughRoundIdx);
  const known = {};
  for (const seat of SEATS) {
    const legacy = puzzle?.shownHands?.[seat];
    if (legacy?.suit && Array.isArray(legacy.cards) && legacy.suit === suit) {
      known[seat] = legacy.cards.length;
      continue;
    }
    if (visibleFullHandSeats.includes(seat) && isFullHandShape(puzzle?.shownHands?.[seat])) {
      known[seat] = parseHandSuitString(puzzle.shownHands[seat][suit]).length;
      continue;
    }
    const k = knownFromShowOut?.[seat]?.[suit];
    if (typeof k === "number") known[seat] = k;
  }
  const seatsKnown = Object.keys(known);
  if (seatsKnown.length < 3) return null;
  const sum = seatsKnown.reduce((acc, s) => acc + (known[s] || 0), 0);
  const missing = SEATS.find((s) => typeof known[s] !== "number");
  if (!missing) return known;
  const inferred = 13 - sum;
  if (inferred < 0) return null;
  return { ...known, [missing]: inferred };
}

const SUIT_ORDER = ["S", "H", "C", "D"];
const RANK_ORDER = ["A", "K", "Q", "J", "T", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"];
function rankSortValue(r) {
  const idx = RANK_ORDER.indexOf(String(r));
  return idx === -1 ? 999 : idx;
}

function sortCardsSuitRank(cards) {
  return [...cards].sort((a, b) => {
    const suitA = SUIT_ORDER.indexOf(a.suit);
    const suitB = SUIT_ORDER.indexOf(b.suit);
    if (suitA !== suitB) return suitA - suitB;
    return rankSortValue(a.rank) - rankSortValue(b.rank);
  });
}

function buildFullHandCards(handObj) {
  if (!handObj) return [];
  // Legacy one-suit shape
  if (handObj.suit && Array.isArray(handObj.cards)) {
    return handObj.cards.map((r) => makeCard(r, handObj.suit));
  }
  if (!isFullHandShape(handObj)) return [];

  const cards = [];
  for (const suit of SUIT_ORDER) {
    const ranks = parseHandSuitString(handObj[suit]);
    for (const r of ranks) cards.push(makeCard(r, suit));
  }
  return sortCardsSuitRank(cards);
}

function useTimeoutQueue() {
  const timeoutsRef = useRef([]);
  const clearAll = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };
  const setQueuedTimeout = (fn, delayMs) => {
    const t = setTimeout(fn, delayMs);
    timeoutsRef.current.push(t);
    return t;
  };
  useEffect(() => clearAll, []);
  return { clearAll, setQueuedTimeout };
}

/**
 * Minimal MVP: scripted puzzle(s) to validate flow.
 * You can add more puzzles by appending objects to this list.
 */
const PUZZLES = [
  {
    id: "p1",
    difficulty: 1,
    title: "Two rounds of trumps, LHO shows out on round 2",
    trumpSuit: "S",
    promptOptions: {
      // Start -> ask the first question immediately (before any cards are played).
      prePromptsBeforePlay: true,
    },
    shownHands: {
      DUMMY: { suit: "S", cards: ["Q", "9", "7", "3"] }, // 4 spades
      DECLARER: { suit: "S", cards: ["A", "K", "J", "4"] }, // 4 spades
    },
    expectedInitialLengths: {
      LHO: 1,
      DUMMY: 4,
      RHO: 4,
      DECLARER: 4,
    },
    // Reveal the full trump suit for closure once prompts are finished.
    endRevealTrumpHands: {
      LHO: ["8"],
      DUMMY: ["Q", "9", "7", "3"],
      RHO: ["6", "5", "2", "T"],
      DECLARER: ["A", "K", "J", "4"],
    },
    // Two rounds (two tricks). Cards are shown as they are played into the trick area.
    // Only the played cards are revealed for defenders; the rest stays hidden.
    rounds: [
      {
        label: "Round 1",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
          { seat: "LHO", card: { rank: "8", suit: "S" } },
          { seat: "DUMMY", card: { rank: "3", suit: "S" } },
          { seat: "RHO", card: { rank: "6", suit: "S" } },
        ],
      },
      {
        label: "Round 2",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "S" } },
          // Show-out moment:
          { seat: "LHO", card: { rank: "2", suit: "D" }, showOut: true },
          { seat: "DUMMY", card: { rank: "7", suit: "S" } },
          { seat: "RHO", card: { rank: "2", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "p1-2",
    difficulty: 1,
    title: "Defending 4♠: count declarer’s trumps after partner shows out",
    trumpSuit: "S",
    contract: "4♠",
    auction: "4♠ P P P",
    dealerCompass: "S", // declarer opened 4♠ as dealer
    viewerCompass: "E", // you are East, defending (RHO)
    promptOptions: {
      disableWarmupTrumpGuess: true,
      // After we count partner, ask for the full suit distribution.
      questionNumbers: [QUESTION.ORIGINAL_SUIT_DISTRIBUTION_AT_EVENT],
      distributionPrefill: { suit: "S", fixed: { RHO: 3, DUMMY: 1, LHO: 2 }, lock: true },
      distributionPromptText: "So let’s work out the suit. What was the original spades distribution?",
      customPrompts: [
        {
          id: "p1-2-warmup",
          type: "DECLARER_TRUMP_GUESS",
          atRoundIdx: -1,
          promptText: "Training warm-up: take your best guess — how many trumps do you think Declarer has? (no wrong answers)",
        },
        {
          id: "p1-2-partnerIf8",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: -1,
          fixed: { DECLARER: 8, DUMMY: 1, RHO: 3 },
          expectedDistribution: { LHO: 1, DUMMY: 1, RHO: 3, DECLARER: 8 },
          promptText: "Let’s focus on your partner’s hand for a moment. If declarer has 8 trumps, how many will your partner have?",
        },
        {
          id: "p1-2-partnerIf7",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: -1,
          fixed: { DECLARER: 7, DUMMY: 1, RHO: 3 },
          expectedDistribution: { LHO: 2, DUMMY: 1, RHO: 3, DECLARER: 7 },
          promptText: "Let’s also consider how many your partner would have if declarer had 7 trumps.",
        },
        {
          id: "p1-2-focusPartner",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "Ok with that in mind, let’s focus on partner’s trumps to see how many they have.",
        },
        {
          id: "p1-2-partnerActual",
          type: "SEAT_SUIT_COUNT",
          seat: "LHO",
          suit: "S",
          atRoundIdx: 2,
          promptText: "So how many trumps did partner have?",
          expected: 2,
        },
      ],
    },
    shownHands: {
      // Only show trump suit (legacy one-suit mode).
      // You can see your own trumps (Jxx) and dummy has 1 trump.
      RHO: { suit: "S", cards: ["J", "7", "3"] }, // You: Jxx
      DUMMY: { suit: "S", cards: ["2"] }, // Dummy: singleton
    },
    // At the end, "turn over" the spade suit for visual closure.
    endRevealTrumpHands: {
      DECLARER: ["A", "K", "Q", "T", "9", "8", "6"],
      LHO: ["5", "4"], // Partner
      DUMMY: ["2"],
      RHO: ["J", "7", "3"], // You
    },
    expectedInitialLengths: {
      // Correct answer after the 3rd round when partner shows out.
      LHO: 2, // Partner followed twice then showed out
      DUMMY: 1,
      RHO: 3, // You: Jxx
      DECLARER: 7,
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "S" } },
          { seat: "DUMMY", card: { rank: "2", suit: "S" } },
          { seat: "RHO", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 2",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "S" } },
          { seat: "LHO", card: { rank: "5", suit: "S" } },
          // Dummy is out of trumps now.
          { seat: "DUMMY", card: { rank: "2", suit: "D" }, showOut: true },
          { seat: "RHO", card: { rank: "7", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (partner shows out)",
        plays: [
          { seat: "DECLARER", card: { rank: "Q", suit: "S" } },
          // Partner is out of trumps after following twice.
          { seat: "LHO", card: { rank: "2", suit: "H" }, showOut: true },
          { seat: "DUMMY", card: { rank: "3", suit: "D" } },
          { seat: "RHO", card: { rank: "J", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "p1-3",
    difficulty: 1,
    title: "Defending: two rounds of hearts reveal 5-4-2-2",
    trumpSuit: "H",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E", // you are East, defending (RHO)
    promptOptions: {
      // Ask the distribution once it becomes knowable.
      questionNumbers: [QUESTION.ORIGINAL_SUIT_DISTRIBUTION_AT_EVENT],
      // Replace the trump-guess warm-up with a distribution guess warm-up for this puzzle.
      disableWarmupTrumpGuess: true,
      distributionPromptAsSuit: true,
      customPrompts: [
        {
          id: "p1-3-guess1",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 0,
          fixed: { RHO: 5, DUMMY: 4 },
          promptText: "What do you think the original hearts distribution is?",
        },
      ],
      distributionPrefill: {
        suit: "H",
        fixed: { RHO: 5, DUMMY: 4 },
        lock: true,
      },
    },
    shownHands: {
      // Only show hearts (legacy one-suit mode). Dummy is North, you are East.
      DUMMY: { suit: "H", cards: ["J", "9", "7", "6"] }, // J9xx
      RHO: { suit: "H", cards: ["A", "K", "Q", "8", "5"] }, // 5 hearts (AKxxx)
    },
    expectedInitialLengths: {
      LHO: 2,
      DUMMY: 4,
      RHO: 5,
      DECLARER: 2,
    },
    // Reveal the full hearts suit for closure.
    endRevealTrumpHands: {
      LHO: ["T", "3"],
      DUMMY: ["J", "9", "7", "6"],
      RHO: ["A", "K", "Q", "8", "5"],
      DECLARER: ["4", "2"],
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "LHO", card: { rank: "T", suit: "H" } }, // partner leads ♥10
          { seat: "DUMMY", card: { rank: "J", suit: "H" } }, // dummy plays J
          { seat: "RHO", card: { rank: "A", suit: "H" } }, // you win A
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
        ],
      },
      {
        label: "Trick 2",
        plays: [
          { seat: "RHO", card: { rank: "K", suit: "H" } }, // cash K
          { seat: "DECLARER", card: { rank: "4", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
          { seat: "DUMMY", card: { rank: "9", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "p1-4",
    difficulty: 1,
    title: "Defending: three rounds of hearts, partner shows out on round 3",
    trumpSuit: "H",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E", // you are East, defending (RHO)
    promptOptions: {
      // This hand is all about using the guesses, then revealing the suit.
      questionNumbers: [],
      disableWarmupTrumpGuess: true,
      distributionPromptAsSuit: true,
      customPrompts: [
        {
          id: "p1-4-guess1",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 0,
          fixed: { RHO: 4, DUMMY: 4 },
          promptText: "What do you think the original hearts distribution is?",
        },
        {
          id: "p1-4-guess2",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 1, // after cashing A and K
          fixed: { RHO: 4, DUMMY: 4 },
          promptText:
            "After two rounds, what do you think the original hearts distribution is?\n\nHint: partner leads top from doubleton and lowest if they have 3 cards.",
        },
      ],
      endRevealDelayMs: 2000,
    },
    shownHands: {
      DUMMY: { suit: "H", cards: ["Q", "J", "9", "7"] }, // QJ9x
      RHO: { suit: "H", cards: ["A", "K", "6", "5"] }, // AKxx
    },
    // Reveal the full hearts suit for closure.
    endRevealTrumpHands: {
      LHO: ["T", "8"],
      DUMMY: ["Q", "J", "9", "7"],
      RHO: ["A", "K", "6", "5"],
      DECLARER: ["4", "3", "2"],
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "LHO", card: { rank: "T", suit: "H" } }, // partner leads ♥10
          { seat: "DUMMY", card: { rank: "Q", suit: "H" } },
          { seat: "RHO", card: { rank: "A", suit: "H" } }, // you win A
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
        ],
      },
      {
        label: "Trick 2",
        plays: [
          { seat: "RHO", card: { rank: "K", suit: "H" } }, // cash K
          { seat: "DECLARER", card: { rank: "3", suit: "H" } },
          { seat: "LHO", card: { rank: "8", suit: "H" } },
          { seat: "DUMMY", card: { rank: "J", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (partner shows out)",
        plays: [
          { seat: "RHO", card: { rank: "6", suit: "H" } }, // third round
          { seat: "DECLARER", card: { rank: "4", suit: "H" } },
          { seat: "LHO", card: { rank: "2", suit: "S" }, showOut: true }, // partner discards a spade
          { seat: "DUMMY", card: { rank: "9", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "p1-5",
    difficulty: 1,
    title: "Declaring: set up dummy’s long suit (4-3 break)",
    trumpSuit: "S",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S", // you are Declarer (South)
    promptOptions: {
      questionNumbers: [],
      disableWarmupTrumpGuess: true,
      distributionPromptAsSuit: true,
      customPrompts: [
        {
          id: "p1-5-can5",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "You would like to set this suit up — can you make 5 tricks in the suit?",
          options: [
            { id: "Yes", label: "Yes" },
            { id: "No", label: "No" },
          ],
          expectedChoice: "Yes",
          revealText: "Yes.",
        },
        {
          id: "p1-5-need43",
          type: "DISTRIBUTION_NEED",
          suit: "S",
          atRoundIdx: -1,
          fixed: { DUMMY: 5, DECLARER: 1 },
          defendersNeed: [4, 3],
          promptText: "Give a possible distribution that would let this work.",
        },
        {
          id: "p1-5-lastTrick",
          type: "PLAY_DECISION",
          atRoundIdx: 3,
          promptText: "Is the final card in the suit a trick?",
          options: [
            { id: "Yes", label: "Yes" },
            { id: "No", label: "No" },
          ],
          expectedChoice: "Yes",
          revealText: "Yes — the suit has been set up, so the last card is now good.",
        },
      ],
      watchNote: "Watch the play — see if the suit is set up.",
    },
    shownHands: {
      // One-suit display (spades). Dummy is North, declarer is South.
      DUMMY: { suit: "S", cards: ["A", "K", "Q", "J", "9"] }, // AKQJx
      DECLARER: { suit: "S", cards: ["2"] }, // singleton
    },
    // Reveal full spade layout for closure.
    endRevealTrumpHands: {
      DUMMY: ["A", "K", "Q", "J", "9"],
      DECLARER: ["2"],
      LHO: ["T", "8", "7"], // 3
      RHO: ["6", "5", "4", "3"], // 4
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "6", suit: "S" } },
          { seat: "DECLARER", card: { rank: "2", suit: "S" } },
          { seat: "LHO", card: { rank: "7", suit: "S" } },
        ],
      },
      {
        label: "Trick 2",
        plays: [
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "5", suit: "S" } },
          { seat: "DECLARER", card: { rank: "2", suit: "H" }, showOut: true },
          { seat: "LHO", card: { rank: "8", suit: "S" } },
        ],
      },
      {
        label: "Trick 3",
        plays: [
          { seat: "DUMMY", card: { rank: "Q", suit: "S" } },
          { seat: "RHO", card: { rank: "4", suit: "S" } },
          { seat: "DECLARER", card: { rank: "3", suit: "H" }, showOut: true },
          { seat: "LHO", card: { rank: "T", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (4-3 break)",
        plays: [
          { seat: "DUMMY", card: { rank: "J", suit: "S" } },
          { seat: "RHO", card: { rank: "3", suit: "S" } },
          { seat: "DECLARER", card: { rank: "4", suit: "H" }, showOut: true },
          { seat: "LHO", card: { rank: "2", suit: "D" }, showOut: true }, // out of spades
        ],
      },
    ],
  },
  {
    id: "p1-6",
    difficulty: 1,
    title: "Declaring: drawing trumps — common splits (5332 / 5341)",
    trumpSuit: "S",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S", // you are Declarer (South)
    promptOptions: {
      disableWarmupTrumpGuess: true,
      distributionPromptAsSuit: true,
      // After the show-out, ask the trump distribution.
      questionNumbers: [QUESTION.ORIGINAL_SUIT_DISTRIBUTION_AT_EVENT],
      // Prefill the known hands on the final (graded) distribution question.
      distributionPrefill: { suit: "S", fixed: { DECLARER: 5, DUMMY: 3, RHO: 1 }, lock: true },
      customPrompts: [
        {
          id: "p1-6-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This is your trump suit, and you are about to draw trumps. Let’s look at the two most common distributions.",
        },
        {
          id: "p1-6-common-5332",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: -1,
          fixed: { DECLARER: 5, DUMMY: 3, LHO: 3 },
          expectedDistribution: { LHO: 3, DUMMY: 3, RHO: 2, DECLARER: 5 },
          promptText: "Fill in the missing number.",
        },
        {
          id: "p1-6-common-5341",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: -1,
          fixed: { DECLARER: 5, DUMMY: 3, LHO: 4 },
          expectedDistribution: { LHO: 4, DUMMY: 3, RHO: 1, DECLARER: 5 },
          promptText: "Well done. Now the next common distribution.",
        },
      ],
    },
    shownHands: {
      // Only show trump suit (legacy one-suit mode).
      DUMMY: { suit: "S", cards: ["6", "5", "4"] }, // xxx
      DECLARER: { suit: "S", cards: ["A", "K", "Q", "3", "2"] }, // AKQxx
    },
    expectedInitialLengths: {
      LHO: 4,
      DUMMY: 3,
      RHO: 1,
      DECLARER: 5,
    },
    // Show the full suit at the end for closure.
    endRevealTrumpHands: {
      DECLARER: ["A", "K", "Q", "3", "2"],
      DUMMY: ["6", "5", "4"],
      LHO: ["J", "9", "8", "7"],
      RHO: ["T"],
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
          { seat: "LHO", card: { rank: "J", suit: "S" } },
          { seat: "DUMMY", card: { rank: "4", suit: "S" } },
          { seat: "RHO", card: { rank: "T", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (show-out)",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "S" } },
          { seat: "LHO", card: { rank: "9", suit: "S" } },
          { seat: "DUMMY", card: { rank: "5", suit: "S" } },
          { seat: "RHO", card: { rank: "2", suit: "H" }, showOut: true },
        ],
      },
    ],
  },
  {
    id: "p1-7",
    difficulty: 1,
    title: "Counting trumps: we have 9, they have ? (clubs)",
    trumpSuit: "C",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    promptOptions: {
      disableWarmupTrumpGuess: true,
      distributionPromptAsSuit: true,
      questionNumbers: [QUESTION.ORIGINAL_SUIT_DISTRIBUTION_AT_EVENT],
      distributionPrefill: { suit: "C", fixed: { DECLARER: 6, DUMMY: 3 }, lock: true },
      distributionPromptText: "What is the distribution?",
      customPrompts: [
        {
          id: "p1-7-they",
          type: "SEAT_SUIT_COUNT",
          seat: "RHO",
          suit: "C",
          atRoundIdx: -1,
          promptText: "We have 9 cards, they have ?",
          expected: 4,
        },
        {
          id: "p1-7-break2",
          type: "SEAT_SUIT_COUNT",
          seat: "RHO",
          suit: "C",
          atRoundIdx: -1,
          leftValue: 2,
          promptText: "What are some possible breaks?",
          expected: 2,
        },
        {
          id: "p1-7-break3",
          type: "SEAT_SUIT_COUNT",
          seat: "RHO",
          suit: "C",
          atRoundIdx: -1,
          leftValue: 3,
          promptText: "Another possible break",
          expected: 1,
        },
      ],
    },
    shownHands: {
      DUMMY: { suit: "C", cards: ["6", "5", "4"] },
      DECLARER: { suit: "C", cards: ["A", "K", "Q", "9", "8", "7"] },
    },
    expectedInitialLengths: {
      LHO: 1,
      DUMMY: 3,
      RHO: 3,
      DECLARER: 6,
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "C" } },
          { seat: "LHO", card: { rank: "J", suit: "C" } },
          { seat: "DUMMY", card: { rank: "4", suit: "C" } },
          { seat: "RHO", card: { rank: "T", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (West shows out)",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
          { seat: "LHO", card: { rank: "2", suit: "H" }, showOut: true },
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
          { seat: "RHO", card: { rank: "T", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "p1-8",
    difficulty: 1,
    title: "Can you make 4 tricks? (diamonds)",
    trumpSuit: "D",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    promptOptions: {
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      customPrompts: [
        {
          id: "p1-8-can4",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Can you make 4 tricks in this suit?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          revealText: "Well done — you're identifying important trick-taking ideas.",
        },
        {
          id: "p1-8-break",
          type: "DISTRIBUTION_GUESS",
          suit: "D",
          atRoundIdx: -1,
          fixed: { DECLARER: 4, DUMMY: 3 },
          expectedDistribution: { LHO: 3, RHO: 3, DUMMY: 3, DECLARER: 4 },
          promptText: "What break (distribution) do you need the cards to be?",
        },
        {
          id: "p1-8-fourth",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText: "Is the 4th card a trick?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          revealText: "Yes — well done. When the break is 3-3, your AKQx opposite xxx takes four tricks.",
        },
      ],
      watchNote: "Watch the play.",
    },
    shownHands: {
      DUMMY: { suit: "D", cards: ["8", "7", "6"] },
      DECLARER: { suit: "D", cards: ["A", "K", "Q", "9"] },
    },
    expectedInitialLengths: {
      LHO: 3,
      DUMMY: 3,
      RHO: 3,
      DECLARER: 4,
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
          { seat: "LHO", card: { rank: "5", suit: "D" } },
          { seat: "DUMMY", card: { rank: "6", suit: "D" } },
          { seat: "RHO", card: { rank: "2", suit: "D" } },
        ],
      },
      {
        label: "Trick 2",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "D" } },
          { seat: "LHO", card: { rank: "4", suit: "D" } },
          { seat: "DUMMY", card: { rank: "7", suit: "D" } },
          { seat: "RHO", card: { rank: "T", suit: "D" } },
        ],
      },
      {
        label: "Trick 3",
        plays: [
          { seat: "DECLARER", card: { rank: "Q", suit: "D" } },
          { seat: "LHO", card: { rank: "3", suit: "D" } },
          { seat: "DUMMY", card: { rank: "8", suit: "D" } },
          { seat: "RHO", card: { rank: "J", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "d2-2",
    difficulty: 2,
    title: "Defending 3♥: count declarer’s shape (and duck the spade)",
    trumpSuit: "H",
    contract: "3♥",
    auction: "1♥ 3♣ 3♥ P P P P",
    dealerCompass: "W",
    declarerCompass: "W",
    viewerCompass: "S", // you are South (defender)
    visibleFullHandSeats: ["RHO", "DUMMY"], // you (South) + dummy
    promptOptions: {
      questionNumbers: [],
      manualTrickAdvance: true,
      startAutoPlayThroughRoundIdx: 0, // play Trick 1, then user advances
      focusNote: "West opened 1♥, showing at least 5 hearts.",
      seatShapeTarget: "DECLARER",
      customPrompts: [
        {
          id: "d2-2-clubs",
          type: "SEAT_SUIT_COUNT",
          seat: "DECLARER",
          suit: "C",
          atRoundIdx: 4,
          promptText: "Declarer has shown out in clubs — how many clubs did declarer start with?",
          expected: 2,
        },
        {
          id: "d2-2-trumpDistPrefill",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 6,
          expectedDistribution: { LHO: 2, DUMMY: 3, RHO: 3, DECLARER: 5 },
          fixed: { LHO: 2, RHO: 3, DUMMY: 3 },
          promptText:
            "Partner has shown 2 hearts — we can figure out how many trumps declarer started with now. The original trump distribution was",
        },
        {
          id: "d2-2-diamondDist",
          type: "DISTRIBUTION_GUESS",
          suit: "D",
          atRoundIdx: 8,
          expectedDistribution: { LHO: 3, DUMMY: 3, RHO: 4, DECLARER: 3 },
          promptText: "What was the ORIGINAL diamond distribution?",
        },
        {
          id: "d2-2-shape",
          type: "SEAT_SHAPE",
          atRoundIdx: 8,
          promptText:
            "Now you have enough information for declarer’s shape. What was it? (S H D C)",
        },
        {
          id: "d2-2-duckSpade",
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
      // Partner (North / LHO): ♠72 ♥Q4 ♦AK6 ♣AQT982
      LHO: { S: "72", H: "Q4", D: "AK6", C: "AQT982" },
      // East (Dummy): ♠943 ♥K72 ♦JT7 ♣K753
      DUMMY: { S: "943", H: "K72", D: "JT7", C: "K753" },
      // You (South / RHO): ♠AJT85 ♥863 ♦8532 ♣6
      RHO: { S: "AJT85", H: "863", D: "8532", C: "6" },
      // West (Declarer): ♠KQ6 ♥AJT95 ♦Q94 ♣J4  (3-5-3-2)
      DECLARER: { S: "KQ6", H: "AJT95", D: "Q94", C: "J4" },
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "LHO", card: { rank: "A", suit: "C" } }, // A♣ (partner)
          { seat: "DUMMY", card: { rank: "3", suit: "C" } },
          { seat: "RHO", card: { rank: "6", suit: "C" } }, // you follow (singleton)
          { seat: "DECLARER", card: { rank: "4", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (club ruff)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "C" } }, // Q♣ (partner)
          { seat: "DUMMY", card: { rank: "K", suit: "C" } }, // cover
          { seat: "RHO", card: { rank: "3", suit: "H" }, showOut: true }, // ruff (now void in clubs)
          { seat: "DECLARER", card: { rank: "J", suit: "C" } },
        ],
      },
      {
        label: "Trick 3",
        plays: [
          { seat: "RHO", card: { rank: "2", suit: "D" } }, // ♦2 (you)
          { seat: "DECLARER", card: { rank: "4", suit: "D" } },
          { seat: "LHO", card: { rank: "A", suit: "D" } }, // ♦A (partner)
          { seat: "DUMMY", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 4 (Q on the K)",
        plays: [
          { seat: "LHO", card: { rank: "K", suit: "D" } }, // ♦K (partner)
          { seat: "DUMMY", card: { rank: "T", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } }, // you
          { seat: "DECLARER", card: { rank: "Q", suit: "D" } }, // Q on the king
        ],
      },
      {
        label: "Trick 5 (club ruff)",
        plays: [
          { seat: "LHO", card: { rank: "T", suit: "C" } }, // club return (partner)
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
          { seat: "RHO", card: { rank: "5", suit: "S" }, showOut: true }, // you discard (no ruff)
          { seat: "DECLARER", card: { rank: "9", suit: "H" }, showOut: true }, // ruff (declarer shows out in clubs)
        ],
      },
      {
        label: "Trick 6 (A♥)",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "H" } },
          { seat: "LHO", card: { rank: "4", suit: "H" } }, // partner
          { seat: "DUMMY", card: { rank: "2", suit: "H" } },
          { seat: "RHO", card: { rank: "6", suit: "H" } }, // you
        ],
      },
      {
        label: "Trick 7 (to dummy’s K♥)",
        plays: [
          { seat: "DECLARER", card: { rank: "T", suit: "H" } },
          { seat: "LHO", card: { rank: "Q", suit: "H" } }, // partner (2nd heart shown)
          { seat: "DUMMY", card: { rank: "K", suit: "H" } }, // wins in dummy
          { seat: "RHO", card: { rank: "8", suit: "H" } }, // you must follow suit
        ],
      },
      {
        label: "Trick 8 (spade to the king)",
        plays: [
          { seat: "DUMMY", card: { rank: "3", suit: "S" } },
          { seat: "RHO", card: { rank: "T", suit: "S" } }, // you
          { seat: "DECLARER", card: { rank: "K", suit: "S" } },
          { seat: "LHO", card: { rank: "2", suit: "S" } }, // partner
        ],
      },
      {
        label: "Trick 9 (third diamond to dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "9", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } }, // partner follows last diamond
          { seat: "DUMMY", card: { rank: "J", suit: "D" } },
          { seat: "RHO", card: { rank: "5", suit: "D" } }, // you
        ],
      },
    ],
  },
  {
    id: "p2-2",
    difficulty: 2,
    title: "Counting: set up the heart suit (two suits)",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    promptOptions: {
      prePromptsBeforePlay: true,
      defendersStartedPromptText: "How many trumps do the opponents have?",
      defendersHeartsStartedExpected: 6,
      defendersHeartsStartedPromptText: "How many hearts do the opponents have?",
      questionNumbers: [],
      manualTrickAdvance: true,
      focusNote: "Spades are trumps. We are just looking at two suits for this problem. Let's set up our heart suit! Before we begin…",
      customPrompts: [
        { id: "p2-2-hearts-left-1", type: "SINGLE_NUMBER", atRoundIdx: 1, promptText: "How many hearts do the opponents still have?", expectedAnswer: 2 },
        { id: "p2-2-break-33", type: "DISTRIBUTION_GUESS", suit: "H", atRoundIdx: 1, fixed: { LHO: 3, DUMMY: 6, DECLARER: 1 }, expectedDistribution: { LHO: 3, RHO: 3, DUMMY: 6, DECLARER: 1 }, promptText: "Let's think about possible breaks for the heart suit. Fill in the missing number." },
        { id: "p2-2-break-24", type: "DISTRIBUTION_GUESS", suit: "H", atRoundIdx: 1, fixed: { LHO: 2, DUMMY: 6, DECLARER: 1 }, expectedDistribution: { LHO: 2, RHO: 4, DUMMY: 6, DECLARER: 1 }, promptText: "Let's think about possible breaks for the heart suit. Fill in the missing number." },
        { id: "p2-2-trumps-still-3", type: "SINGLE_NUMBER", atRoundIdx: 2, promptText: "Let's update our tally of the outstanding trumps. How many are still out?", expectedAnswer: 3 },
        { id: "p2-2-overruff-msg", type: "INFO", atRoundIdx: 3, promptText: "You have gotten overruffed. Take your time to make sure you know exactly what is going on with both suits." },
        { id: "p2-2-trumps-after-overruff", type: "SINGLE_NUMBER", atRoundIdx: 3, promptText: "How many trumps do the opponents still have after the overruff?", expectedAnswer: 2 },
        { id: "p2-2-hearts-left-after-overruff", type: "SINGLE_NUMBER", atRoundIdx: 3, promptText: "How many hearts are left?", expectedAnswer: 1 },
        { id: "p2-2-trumps-out-0", type: "SINGLE_NUMBER", atRoundIdx: 4, promptText: "How many trumps are outstanding?", expectedAnswer: 0 },
        {
          id: "p2-2-closing",
          type: "INFO",
          atRoundIdx: 4,
          setDoneExtraText: true,
          promptText: "We confidently know there are no trumps left, and we confidently know there is one heart outstanding. We can play 1 more round of hearts, losing it, but be sure the rest are good! Reveal the hand — East holds the final remaining heart.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "AKQ2", H: "A98765", D: "", C: "" },
      DECLARER: { S: "2356", H: "2", D: "", C: "" },
      RHO: { S: "JT", H: "KQ84", D: "AK32", C: "765" },
      LHO: { S: "489", H: "357", D: "QJT9", C: "842" },
    },
    expectedInitialLengths: { LHO: 3, DUMMY: 4, RHO: 2, DECLARER: 4 },
    preserveEndStateAtDone: true,
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "DUMMY", card: { rank: "A", suit: "H" } },
          { seat: "RHO", card: { rank: "4", suit: "H" } },
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 2",
        plays: [
          { seat: "DUMMY", card: { rank: "9", suit: "H" } },
          { seat: "RHO", card: { rank: "8", suit: "H" } },
          { seat: "DECLARER", card: { rank: "2", suit: "S" } },
          { seat: "LHO", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (spade to the Ace)",
        plays: [
          { seat: "DECLARER", card: { rank: "3", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "S" } },
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "7", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (third heart: you ruff, West overruffs and wins)",
        plays: [
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "K", suit: "H" } },
          { seat: "DECLARER", card: { rank: "5", suit: "S" } },
          { seat: "LHO", card: { rank: "8", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (West leads trump; North wins, East follows)",
        plays: [
          { seat: "LHO", card: { rank: "9", suit: "S" } },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "T", suit: "S" } },
          { seat: "DECLARER", card: { rank: "6", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "d5-2",
    difficulty: 3,
    title: "BBO board 21 (5♥) — defender shows out on 2nd round of trumps",
    trumpSuit: "H",
    contract: "5♥",
    auction: "P P 1♥ 3♠ 4♥ P 4NT P 5♣ P 5♦ P 5♥ P P P",
    dealerCompass: "N",
    viewerCompass: "E", // user is East, defending
    visibleFullHandSeats: ["RHO", "DUMMY"], // defender sees own hand + dummy
    promptOptions: {
      // Include trick-count prompt (defenders count declarer's tricks by suit) after the 3rd club trick.
      questionNumbers: [1, 2, 3, 5, 4],
      seatShapeTarget: "DECLARER",
      manualTrickAdvance: true,
      trickCountAtRoundIdx: 9, // after Trick 10 (0-based index)
      trickCountExpected: { S: 2, H: 5, D: 0, C: 3 }, // 10 total (as intended for this training moment)
    },
    // Source: https://www.bridgebase.com/tools/vugraph_linfetch.php?id=85072 (board c21)
    shownHands: {
      LHO: {
        S: "AJT943",
        H: "7",
        D: "Q2",
        C: "7543",
      },
      DUMMY: {
        S: "KQ76",
        H: "9852",
        D: "54",
        C: "AJ8",
      },
      RHO: {
        S: "52",
        H: "JT3",
        D: "A9873",
        C: "962",
      },
      DECLARER: {
        S: "8",
        H: "AKQ64",
        D: "KJT6",
        C: "KQT",
      },
    },
    expectedInitialLengths: {
      // Hearts distribution at trick 4 show-out moment
      LHO: 1, // West: ♥7
      DUMMY: 4,
      RHO: 3, // East: ♥J103
      DECLARER: 5,
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "LHO", card: { rank: "A", suit: "S" } }, // W: AS
          { seat: "DUMMY", card: { rank: "6", suit: "S" } }, // N: 6S
          { seat: "RHO", card: { rank: "2", suit: "S" } }, // E: 2S
          { seat: "DECLARER", card: { rank: "8", suit: "S" } }, // S: 8S
        ],
      },
      {
        label: "Trick 2",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "S" } }, // W: JS
          { seat: "DUMMY", card: { rank: "Q", suit: "S" } }, // N: QS
          { seat: "RHO", card: { rank: "5", suit: "S" } }, // E: 5S
          { seat: "DECLARER", card: { rank: "6", suit: "D" }, showOut: true }, // S: 6D (show-out of spades)
        ],
      },
      {
        label: "Trick 3",
        plays: [
          { seat: "DUMMY", card: { rank: "2", suit: "H" } }, // N: 2H
          { seat: "RHO", card: { rank: "T", suit: "H" } }, // E: 10H
          { seat: "DECLARER", card: { rank: "Q", suit: "H" } }, // S: QH
          { seat: "LHO", card: { rank: "7", suit: "H" } }, // W: 7H
        ],
      },
      {
        label: "Trick 4 (show-out)",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "H" } }, // S: KH
          // Show-out moment: West cannot follow trumps (hearts).
          { seat: "LHO", card: { rank: "3", suit: "S" }, showOut: true }, // W: 3S
          { seat: "DUMMY", card: { rank: "5", suit: "H" } }, // N: 5H
          { seat: "RHO", card: { rank: "3", suit: "H" } }, // E: 3H
        ],
      },
      {
        label: "Trick 5",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "H" } }, // S: AH
          { seat: "LHO", card: { rank: "4", suit: "S" } }, // W: 4S
          { seat: "DUMMY", card: { rank: "8", suit: "H" } }, // N: 8H
          { seat: "RHO", card: { rank: "J", suit: "H" } }, // E: JH
        ],
      },
      {
        label: "Trick 6",
        plays: [
          { seat: "DECLARER", card: { rank: "4", suit: "H" } }, // S: 4H
          { seat: "LHO", card: { rank: "4", suit: "C" } }, // W: 4C
          { seat: "DUMMY", card: { rank: "9", suit: "H" } }, // N: 9H
          { seat: "RHO", card: { rank: "8", suit: "D" } }, // E: 8D
        ],
      },
      {
        label: "Trick 7",
        plays: [
          { seat: "DUMMY", card: { rank: "K", suit: "S" } }, // N: KS
          { seat: "RHO", card: { rank: "3", suit: "D" } }, // E: 3D
          { seat: "DECLARER", card: { rank: "T", suit: "D" } }, // S: 10D
          { seat: "LHO", card: { rank: "9", suit: "S" } }, // W: 9S
        ],
      },
      {
        label: "Trick 8",
        plays: [
          { seat: "DUMMY", card: { rank: "8", suit: "C" } }, // N: 8C
          { seat: "RHO", card: { rank: "2", suit: "C" } }, // E: 2C
          { seat: "DECLARER", card: { rank: "Q", suit: "C" } }, // S: QC
          { seat: "LHO", card: { rank: "3", suit: "C" } }, // W: 3C
        ],
      },
      {
        label: "Trick 9",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "C" } }, // S: KC
          { seat: "LHO", card: { rank: "5", suit: "C" } }, // W: 5C
          { seat: "DUMMY", card: { rank: "J", suit: "C" } }, // N: JC
          { seat: "RHO", card: { rank: "6", suit: "C" } }, // E: 6C
        ],
      },
      {
        label: "Trick 10",
        plays: [
          { seat: "DECLARER", card: { rank: "T", suit: "C" } }, // S: 10C
          { seat: "LHO", card: { rank: "7", suit: "C" } }, // W: 7C
          { seat: "DUMMY", card: { rank: "A", suit: "C" } }, // N: AC
          { seat: "RHO", card: { rank: "9", suit: "C" } }, // E: 9C
        ],
      },
      {
        label: "Trick 11",
        plays: [
          { seat: "DUMMY", card: { rank: "4", suit: "D" } }, // N: 4D
          { seat: "RHO", card: { rank: "7", suit: "D" } }, // E: 7D
          { seat: "DECLARER", card: { rank: "J", suit: "D" } }, // S: JD
          { seat: "LHO", card: { rank: "Q", suit: "D" } }, // W: QD
        ],
      },
    ],
  },
  {
    id: "cp3-2",
    difficulty: 3,
    title: "Win the spade Ace? (4♥) — Aus NOT final set 4, board 25",
    trumpSuit: "H",
    contract: "4♥",
    auction: "P P 1♥ P 2♣ P 3N P 4♥ P P P",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    promptOptions: {
      questionNumbers: [],
      manualTrickAdvance: true,
      customPrompts: [
        {
          id: "cp3-2-spadeAce",
          type: "PLAY_DECISION",
          atRoundIdx: 5,
          promptText: "What should you do, play low or win the Ace?",
          options: [
            { id: "Win the Ace", label: "Win the Ace" },
            { id: "Play low", label: "Play low" },
          ],
          expectedChoice: "Win the Ace",
          noContinue: true,
          revealText:
            "Correct — win the Ace. Put simply, we need to pitch our 2 diamonds on our setup clubs before losing the lead.\n\nLet's count tricks as practice — If we win the ace, we make 11 tricks: 2 spades, 5 hearts, 0 diamonds, 4 clubs. On the two club winners we pitch both our diamonds, then play a spade and make our second spade trick. We lose 1 spade, 0 heart, 0 diamonds, 1 club — 2 losers, 11 winners.\n\nIf we let the spade ride we have enough tricks (2 spades, 5 hearts and 4 clubs) but our loser count tips too far: we open ourselves to lose 1 spade, 1 heart, 1 club and 2 diamonds.\n\n(Aus NOT final set 4, board 25.)",
        },
      ],
    },
    shownHands: {
      // LIN o25 md| order S,W,N,E. 4H by South. N dealer.
      // LHO=West(H2), RHO=East(H4), DUMMY=North(H3), DECLARER=South(H1)
      LHO: { S: "T93", H: "82", D: "AT98", C: "K742" },
      DUMMY: { S: "A762", H: "AT4", D: "4", C: "JT853" },
      RHO: { S: "K54", H: "976", D: "QJ7532", C: "6" },
      DECLARER: { S: "QJ8", H: "KQJ53", D: "K6", C: "AQ9" },
    },
    rounds: [
      {
        label: "Trick 1 (LHO leads ♥8)",
        plays: [
          { seat: "LHO", card: { rank: "8", suit: "H" } },
          { seat: "DUMMY", card: { rank: "4", suit: "H" } },
          { seat: "RHO", card: { rank: "6", suit: "H" } },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (declarer leads ♥3)",
        plays: [
          { seat: "DECLARER", card: { rank: "3", suit: "H" } },
          { seat: "LHO", card: { rank: "2", suit: "H" } },
          { seat: "DUMMY", card: { rank: "A", suit: "H" } },
          { seat: "RHO", card: { rank: "7", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (dummy leads ♣3)",
        plays: [
          { seat: "DUMMY", card: { rank: "3", suit: "C" } },
          { seat: "RHO", card: { rank: "6", suit: "C" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "C" } },
          { seat: "LHO", card: { rank: "2", suit: "C" } },
        ],
      },
      {
        label: "Trick 4 (declarer leads ♥5)",
        plays: [
          { seat: "DECLARER", card: { rank: "5", suit: "H" } },
          { seat: "LHO", card: { rank: "4", suit: "C" } },
          { seat: "DUMMY", card: { rank: "T", suit: "H" } },
          { seat: "RHO", card: { rank: "9", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (dummy leads ♣5, King of clubs)",
        plays: [
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
          { seat: "RHO", card: { rank: "5", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "C" } },
          { seat: "LHO", card: { rank: "7", suit: "C" } },
        ],
      },
      {
        label: "Trick 6 (LHO leads 10♠ — your decision)",
        plays: [{ seat: "LHO", card: { rank: "T", suit: "S" } }],
      },
      {
        label: "Trick 6 (continued — win the Ace)",
        plays: [
          { seat: "LHO", card: { rank: "T", suit: "S" } },
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "4", suit: "S" } },
          { seat: "DECLARER", card: { rank: "6", suit: "D" } },
        ],
      },
    ],
  },
];

function buildInitialRemainingHands(puzzle) {
  const trumpSuit = puzzle.trumpSuit;
  const out = {};
  for (const seat of SEATS) {
    const h = puzzle.shownHands?.[seat];
    if (!h) continue;
    // Legacy one-suit shape
    if (h.suit && Array.isArray(h.cards)) {
      if (h.suit !== trumpSuit) continue;
      out[seat] = h.cards.map((r) => makeCard(r, trumpSuit));
      continue;
    }
    // Full-hand shape
    if (isFullHandShape(h)) {
      const ranks = parseHandSuitString(h[trumpSuit]) || [];
      out[seat] = ranks.map((r) => makeCard(r, trumpSuit));
    }
  }
  return out;
}

function removeCardFromHand(handCards, cardToRemove) {
  // Removes first matching card (rank+suit), returns new array.
  const idx = (handCards || []).findIndex((c) => c.rank === cardToRemove.rank && c.suit === cardToRemove.suit);
  if (idx === -1) return handCards || [];
  return [...handCards.slice(0, idx), ...handCards.slice(idx + 1)];
}

function computeDefendersRemainingThroughEvent(
  { rounds, trumpSuit, expectedInitialLengths },
  showOutRoundIdx,
  showOutPlayIdx
) {
  const defendersInitial = (expectedInitialLengths.LHO || 0) + (expectedInitialLengths.RHO || 0);
  let defendersTrumpPlayed = 0;
  for (let r = 0; r <= showOutRoundIdx; r++) {
    const plays = rounds[r]?.plays || [];
    const maxPlayIdx = r === showOutRoundIdx ? showOutPlayIdx : plays.length - 1;
    for (let i = 0; i <= maxPlayIdx; i++) {
      const p = plays[i];
      const isDefender = p.seat === "LHO" || p.seat === "RHO";
      if (isDefender && isTrump(p.card, trumpSuit)) defendersTrumpPlayed += 1;
    }
  }
  return Math.max(0, defendersInitial - defendersTrumpPlayed);
}

function computeTrumpsRemainingThroughEvent({ rounds, trumpSuit }, showOutRoundIdx, showOutPlayIdx, seats, initialTotal) {
  if (!trumpSuit) return 0;
  let trumpPlayed = 0;
  for (let r = 0; r <= showOutRoundIdx; r++) {
    const plays = rounds[r]?.plays || [];
    const maxPlayIdx = r === showOutRoundIdx ? showOutPlayIdx : plays.length - 1;
    for (let i = 0; i <= maxPlayIdx; i++) {
      const p = plays[i];
      if (seats.includes(p.seat) && isTrump(p.card, trumpSuit)) trumpPlayed += 1;
    }
  }
  return Math.max(0, (initialTotal || 0) - trumpPlayed);
}

function computeKnownSuitCountsThroughRound(rounds, throughRoundIdx) {
  const countPlayed = { LHO: { S: 0, H: 0, D: 0, C: 0 }, DUMMY: { S: 0, H: 0, D: 0, C: 0 }, RHO: { S: 0, H: 0, D: 0, C: 0 }, DECLARER: { S: 0, H: 0, D: 0, C: 0 } };
  const known = { LHO: {}, DUMMY: {}, RHO: {}, DECLARER: {} };
  for (let r = 0; r <= throughRoundIdx; r++) {
    const plays = rounds?.[r]?.plays || [];
    const ledSuit = plays[0]?.card?.suit;
    for (let i = 0; i < plays.length; i++) {
      const p = plays[i];
      const s = p?.card?.suit;
      if (p?.seat && s && countPlayed[p.seat]?.[s] !== undefined) countPlayed[p.seat][s] += 1;
      if (p?.showOut && p?.seat && ledSuit) {
        // Showing out of ledSuit means the player started with exactly the number of ledSuit cards they've already played.
        known[p.seat][ledSuit] = countPlayed[p.seat][ledSuit];
      }
    }
  }
  return known;
}

function inferUniqueSuitLengths({ puzzle, throughRoundIdx, fixedFromHandsSeats = [] }) {
  const SUITS = ["S", "H", "D", "C"];
  const rounds = puzzle?.rounds || [];

  // Base constraints
  const constraints = {};
  for (const seat of SEATS) {
    constraints[seat] = {};
    for (const s of SUITS) constraints[seat][s] = { min: 0, max: 13, exact: null };
  }

  // Minimums from cards played so far + exacts from show-outs
  const playedCount = { LHO: { S: 0, H: 0, D: 0, C: 0 }, DUMMY: { S: 0, H: 0, D: 0, C: 0 }, RHO: { S: 0, H: 0, D: 0, C: 0 }, DECLARER: { S: 0, H: 0, D: 0, C: 0 } };
  for (let r = 0; r <= throughRoundIdx; r++) {
    const plays = rounds[r]?.plays || [];
    const ledSuit = plays[0]?.card?.suit;
    for (let i = 0; i < plays.length; i++) {
      const p = plays[i];
      const seat = p?.seat;
      const suit = p?.card?.suit;
      if (seat && suit && playedCount[seat]?.[suit] !== undefined) playedCount[seat][suit] += 1;
      if (p?.showOut && seat && ledSuit) {
        const exact = playedCount[seat][ledSuit];
        constraints[seat][ledSuit].exact = exact;
        constraints[seat][ledSuit].min = exact;
        constraints[seat][ledSuit].max = exact;
      }
    }
  }
  for (const seat of SEATS) {
    for (const s of SUITS) {
      constraints[seat][s].min = Math.max(constraints[seat][s].min, playedCount[seat][s]);
    }
  }

  // Fixed suit lengths from fully known hands (e.g. viewer + dummy in defender POV)
  for (const seat of fixedFromHandsSeats) {
    const h = puzzle?.shownHands?.[seat];
    if (!isFullHandShape(h)) continue;
    for (const s of SUITS) {
      const exact = parseHandSuitString(h[s]).length;
      constraints[seat][s].exact = exact;
      constraints[seat][s].min = exact;
      constraints[seat][s].max = exact;
    }
  }

  // Generate possible 4-tuples per seat.
  const tuplesBySeat = {};
  for (const seat of SEATS) {
    const c = constraints[seat];
    const tuples = [];
    for (let sp = c.S.min; sp <= c.S.max; sp++) {
      for (let he = c.H.min; he <= c.H.max; he++) {
        for (let di = c.D.min; di <= c.D.max; di++) {
          const cl = 13 - (sp + he + di);
          if (cl < c.C.min || cl > c.C.max) continue;
          if (cl < 0 || cl > 13) continue;
          tuples.push({ S: sp, H: he, D: di, C: cl });
        }
      }
    }
    tuplesBySeat[seat] = tuples;
  }

  // Backtrack across seats enforcing suit totals = 13.
  const seatsOrder = [...SEATS].sort((a, b) => tuplesBySeat[a].length - tuplesBySeat[b].length);
  const sumSuit = { S: 0, H: 0, D: 0, C: 0 };
  const assigned = {};
  const solutions = [];

  const remainingBounds = (idx) => {
    const remSeats = seatsOrder.slice(idx);
    const minRem = { S: 0, H: 0, D: 0, C: 0 };
    const maxRem = { S: 0, H: 0, D: 0, C: 0 };
    for (const seat of remSeats) {
      for (const s of SUITS) {
        minRem[s] += constraints[seat][s].min;
        maxRem[s] += constraints[seat][s].max;
      }
    }
    return { minRem, maxRem };
  };

  const dfs = (idx) => {
    if (idx === seatsOrder.length) {
      if (SUITS.every((s) => sumSuit[s] === 13)) solutions.push({ ...assigned });
      return;
    }
    const seat = seatsOrder[idx];
    const { minRem, maxRem } = remainingBounds(idx + 1);

    for (const t of tuplesBySeat[seat]) {
      // early prune totals
      let ok = true;
      for (const s of SUITS) {
        const nextSum = sumSuit[s] + t[s];
        if (nextSum > 13) ok = false;
        // Feasibility for remaining seats
        if (nextSum + minRem[s] > 13) ok = false;
        if (nextSum + maxRem[s] < 13) ok = false;
      }
      if (!ok) continue;

      assigned[seat] = t;
      for (const s of SUITS) sumSuit[s] += t[s];
      dfs(idx + 1);
      for (const s of SUITS) sumSuit[s] -= t[s];
      delete assigned[seat];
      if (solutions.length > 4000) return; // safety cap
    }
  };
  dfs(0);

  if (solutions.length === 0) return { solutionsCount: 0, uniqueSeat: {}, uniqueSuit: {} };

  // Unique seat shapes
  const uniqueSeat = {};
  for (const seat of SEATS) {
    const first = solutions[0][seat];
    const allSame = solutions.every((sol) => SUITS.every((s) => sol[seat][s] === first[s]));
    if (allSame) uniqueSeat[seat] = first;
  }

  // Unique suit distributions across seats
  const uniqueSuit = {};
  for (const suit of SUITS) {
    const first = {};
    for (const seat of SEATS) first[seat] = solutions[0][seat][suit];
    const allSame = solutions.every((sol) => SEATS.every((seat) => sol[seat][suit] === first[seat]));
    if (allSame) uniqueSuit[suit] = first;
  }

  return { solutionsCount: solutions.length, uniqueSeat, uniqueSuit };
}

const CATEGORY_CONFIG = [
  { key: "declarer", label: "Declarer", path: "/cardPlay/practice" },
  { key: "defence", label: "Defence", path: "/defence/practice" },
  { key: "counting", label: "Counting", path: "/counting/practice" },
];

const isLocalhost = typeof window !== "undefined" && (window.location?.hostname === "localhost" || window.location?.hostname === "127.0.0.1");

function CountingTrumpsTrainer({ uid, subscriptionActive, a, puzzlesOverride, trainerLabel = "Counting", categoryKey = "counting" }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const isAdmin = a === true;
  const isMember = isLocalhost || isAdmin || !!subscriptionActive; // admins + localhost get full access
  const puzzlesAll = useMemo(() => {
    // If override is provided (even empty), treat it as authoritative for this trainer instance.
    if (Array.isArray(puzzlesOverride)) return puzzlesOverride;
    const list = PUZZLES;
    const isLocal =
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.hostname || ""));
    if (!isLocal) {
      return list.filter((p) => p.id !== "p2-2");
    }
    return list;
  }, [puzzlesOverride]);
  const fallbackPuzzle = useMemo(() => {
    // Stable placeholder so hooks don't rely on Counting puzzles when this trainer has none yet.
    return {
      id: `${trainerLabel.toLowerCase().replace(/\s+/g, "-")}-placeholder`,
      difficulty: 1,
      title: `${trainerLabel} trainer (coming soon)`,
      trumpSuit: "S",
      shownHands: {},
      rounds: [{ label: "Trick 1", plays: [] }],
      promptOptions: { questionNumbers: [] },
    };
  }, [trainerLabel]);
  const previewPuzzleIdByDifficulty = useMemo(() => {
    // Allow preview access to the first problem in EACH difficulty.
    const byDiff = {};
    for (const p of puzzlesAll) {
      const d = Number(p?.difficulty || 1);
      if (!byDiff[d]) byDiff[d] = p?.id;
    }
    return byDiff;
  }, [puzzlesAll]);
  const puzzlesForDifficultyAll = useMemo(() => {
    return puzzlesAll.filter((p) => (p.difficulty || 1) === selectedDifficulty);
  }, [puzzlesAll, selectedDifficulty]);
  const [puzzleIdxInDifficulty, setPuzzleIdxInDifficulty] = useState(0);
  const hasPuzzles = puzzlesForDifficultyAll.length > 0;
  const isBlankDifficulty = !hasPuzzles;
  const previewPuzzleIdForSelectedDifficulty = previewPuzzleIdByDifficulty?.[selectedDifficulty] || null;
  const previewIdxInDifficulty = useMemo(() => {
    if (!previewPuzzleIdForSelectedDifficulty) return 0;
    const idx = puzzlesForDifficultyAll.findIndex((p) => p.id === previewPuzzleIdForSelectedDifficulty);
    return idx >= 0 ? idx : 0;
  }, [puzzlesForDifficultyAll, previewPuzzleIdForSelectedDifficulty]);
  const effectivePuzzleIdx = isMember ? puzzleIdxInDifficulty : previewIdxInDifficulty;

  useEffect(() => {
    if (isMember) return;
    if (puzzleIdxInDifficulty !== previewIdxInDifficulty) setPuzzleIdxInDifficulty(previewIdxInDifficulty);
  }, [isMember, puzzleIdxInDifficulty, previewIdxInDifficulty]);

  // Always provide a puzzle object to keep hook order stable;
  // when a difficulty is blank we render a placeholder instead of the table.
  const puzzle = hasPuzzles
    ? puzzlesForDifficultyAll[effectivePuzzleIdx] || puzzlesForDifficultyAll[0]
    : puzzlesAll[0] || fallbackPuzzle;

  const contractText = contractToText(puzzle);
  const auctionText = auctionToText(puzzle);

  // Viewer is always a compass seat (N/E/S/W) for true-table orientation.
  const viewerCompass = puzzle.viewerCompass || "S";
  const dealerCompass = puzzle.dealerCompass || "N";
  const declarerCompass = useMemo(() => {
    if (puzzle.declarerCompass) return puzzle.declarerCompass;
    const inferred = inferDeclarerCompassFromAuction({ auctionText, dealerCompass });
    return inferred || "S";
  }, [puzzle.declarerCompass, auctionText, dealerCompass]);

  const declarerCompassName = useMemo(() => {
    const map = { N: "North", E: "East", S: "South", W: "West" };
    return map[declarerCompass] || declarerCompass;
  }, [declarerCompass]);

  const contractDisplayText = useMemo(() => {
    if (!contractText) return "";
    if (puzzle?.promptOptions?.contractOnly) return `Contract is ${contractText}`;
    return `Contract is ${contractText} by ${declarerCompassName}`;
  }, [contractText, declarerCompassName, puzzle?.promptOptions?.contractOnly]);

  const seatAtCompass = useMemo(() => {
    const out = { N: "DUMMY", E: "RHO", S: "DECLARER", W: "LHO" }; // default app convention
    out[declarerCompass] = "DECLARER";
    out[partnerCompass(declarerCompass)] = "DUMMY";
    out[lhoCompass(declarerCompass)] = "LHO";
    out[rhoCompass(declarerCompass)] = "RHO";
    return out;
  }, [declarerCompass]);

  const seatTop = seatAtCompass.N;
  const seatRight = seatAtCompass.E;
  const seatBottom = seatAtCompass.S;
  const seatLeft = seatAtCompass.W;

  const viewerSeat = seatAtCompass[viewerCompass] || "DECLARER"; // internal seat key: LHO/DUMMY/RHO/DECLARER
  // Clockwise typing order (left -> top -> right -> bottom) from the viewer’s perspective.
  // Needs to be defined early (it is referenced by hooks below).
  const distSeatOrder = useMemo(() => [seatLeft, seatTop, seatRight, seatBottom], [seatLeft, seatTop, seatRight, seatBottom]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [playIdx, setPlayIdx] = useState(-1); // -1 means none played in current round yet
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedRoundIdx, setCompletedRoundIdx] = useState(-1); // last fully completed trick/round (manual mode)

  // Trick area shows up to one card per seat for the current trick.
  const [trickCards, setTrickCards] = useState({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });

  // Remaining visible trump cards in Dummy/Declarer hands (played cards disappear).
  const [remainingHands, setRemainingHands] = useState(() => buildInitialRemainingHands(puzzlesAll[0] || fallbackPuzzle));
  const initialTrumpVisibleSeats = useMemo(() => {
    // In one-suit mode, only show trumps for seats whose trump holding is explicitly provided.
    return Object.keys(buildInitialRemainingHands(puzzle) || {});
  }, [puzzle]);
  const initialFullHands = useMemo(() => {
    return {
      LHO: buildFullHandCards(puzzle.shownHands?.LHO),
      DUMMY: buildFullHandCards(puzzle.shownHands?.DUMMY),
      RHO: buildFullHandCards(puzzle.shownHands?.RHO),
      DECLARER: buildFullHandCards(puzzle.shownHands?.DECLARER),
    };
  }, [puzzle.shownHands]);

  const [playedFromHand, setPlayedFromHand] = useState({ LHO: {}, DUMMY: {}, RHO: {}, DECLARER: {} });

  const dummyHandFanRef = useRef(null);
  const declarerHandFanRef = useRef(null);
  const lhoHandFanRef = useRef(null);
  const rhoHandFanRef = useRef(null);
  const prevHandRectsRef = useRef({ LHO: {}, DUMMY: {}, RHO: {}, DECLARER: {} });

  // Prompt flow
  const [promptStep, setPromptStep] = useState(null); // null | "DEFENDERS_STARTED" | "DEFENDERS_REMAINING" | "DISTRIBUTION" | "DONE"
  const [postPromptIdx, setPostPromptIdx] = useState(0);
  const [currentPostPrompts, setCurrentPostPrompts] = useState([]);
  const [feedback, setFeedback] = useState(null); // { type: "ok"|"error", text }

  const [defendersStartedInput, setDefendersStartedInput] = useState("");
  const [defendersHeartsStartedInput, setDefendersHeartsStartedInput] = useState("");
  const [defendersRemainingInput, setDefendersRemainingInput] = useState("");
  const [distributionInput, setDistributionInput] = useState({ LHO: "", DUMMY: "", RHO: "", DECLARER: "" });
  const [distributionSuitKey, setDistributionSuitKey] = useState(null);
  const [distributionSuit, setDistributionSuit] = useState(null);
  const [seatShapeInput, setSeatShapeInput] = useState({ S: "", H: "", D: "", C: "" });
  const [seatShapeSeatKey, setSeatShapeSeatKey] = useState(null);
  const [shapeSeat, setShapeSeat] = useState(null); // which seat we are currently asking to enter shape for
  const [trickCountInput, setTrickCountInput] = useState({ S: "", H: "", D: "", C: "" });
  const [shapeIntroSeatKey, setShapeIntroSeatKey] = useState(null);
  const [declarerTrumpGuessInput, setDeclarerTrumpGuessInput] = useState("");
  const [seatSuitCountInput, setSeatSuitCountInput] = useState("");
  const [seatSuitCountKey, setSeatSuitCountKey] = useState(null);
  const [singleNumberInput, setSingleNumberInput] = useState("");
  const [activeCustomPrompt, setActiveCustomPrompt] = useState(null);
  const [playDecisionReveal, setPlayDecisionReveal] = useState(null); // { text, promptId, roundIdx }
  const [doneExtraText, setDoneExtraText] = useState(null);
  const askedRef = useRef({
    defendersStarted: false,
    defendersRemaining: false,
    suitDistAsked: {}, // {S:true,...}
    suitDistValues: {}, // {S:{LHO:..,DUMMY:..,RHO:..,DECLARER:..}, ...}
    seatShapeAsked: {}, // {DECLARER:true,...}
    trickCountAsked: false,
    declarerTrumpGuessAsked: false,
    preDistGuessAsked: false,
    customAsked: {}, // {promptId:true,...}
  });
  const [askedTick, setAskedTick] = useState(0);

  const defendersSingleInputRef = useRef(null);
  const declarerTrumpGuessRef = useRef(null);
  const seatSuitCountRef = useRef(null);
  const singleNumberRef = useRef(null);
  const playDecisionQuestionRef = useRef(null);
  const seatShapeRefs = {
    S: useRef(null),
    H: useRef(null),
    D: useRef(null),
    C: useRef(null),
  };

  const [wrongAttempts, setWrongAttempts] = useState({
    defendersStarted: 0,
    defendersHeartsStarted: 0,
    defendersRemaining: 0,
    distribution: 0,
    distributionGuess: 0,
    distributionNeed: 0,
    seatShape: 0,
    trickCount: 0,
    seatSuitCount: 0,
    singleNumber: 0,
    playDecision: 0,
  });

  const { clearAll, setQueuedTimeout } = useTimeoutQueue();
  const [hasStarted, setHasStarted] = useState(false);
  const [pauseIdx, setPauseIdx] = useState(0);
  const [nextRoundToPlay, setNextRoundToPlay] = useState(0);

  // All puzzles are manual trick-advance: user controls pace with arrows.
  const manualTrickMode = true;

  const pauseRounds = useMemo(() => {
    const rounds = puzzle.rounds || [];
    const out = [];
    for (let r = 0; r < rounds.length; r++) {
      if ((rounds[r].plays || []).some((p) => p.showOut)) out.push(r);
    }
    return out;
  }, [puzzle.rounds]);

  const lastRoundIdx = (puzzle.rounds?.length || 1) - 1;
  const activePauseRoundIdx = pauseRounds[pauseIdx] ?? lastRoundIdx;
  const progressRoundIdx = manualTrickMode ? completedRoundIdx : activePauseRoundIdx;

  const showOutLedSuit = useMemo(() => {
    const idx = progressRoundIdx >= 0 ? progressRoundIdx : 0;
    const plays = puzzle.rounds?.[idx]?.plays || [];
    return plays[0]?.card?.suit || puzzle.trumpSuit;
  }, [puzzle.rounds, puzzle.trumpSuit, progressRoundIdx]);

  const distributionExpected = useMemo(() => {
    const suit = distributionSuit || showOutLedSuit;
    const through = progressRoundIdx >= 0 ? progressRoundIdx : 0;
    const played = computeSuitLengthsFromPlayedThroughRound(puzzle, through);
    if (played?.all13?.[suit]) return played.all13[suit];
    return computeSuitLengthsFromShownHands(puzzle, suit) || puzzle.expectedInitialLengths;
  }, [puzzle, distributionSuit, showOutLedSuit, progressRoundIdx]);

  const trumpLengths = useMemo(() => {
    if (!isSuitContract(puzzle)) return null;
    const fromHands = computeSuitLengthsFromShownHands(puzzle, puzzle.trumpSuit);
    return fromHands || puzzle.expectedInitialLengths;
  }, [puzzle, puzzle.trumpSuit]);

  const viewerIsDeclarerSide = viewerSeat === "DECLARER" || viewerSeat === "DUMMY";

  const startedTrumpsCorrect = useMemo(() => {
    if (!trumpLengths) return 0;
    if (viewerIsDeclarerSide) return (trumpLengths.LHO || 0) + (trumpLengths.RHO || 0);
    return trumpLengths.DECLARER || 0;
  }, [viewerIsDeclarerSide, trumpLengths]);

  const remainingTrumpsCorrect = useMemo(() => {
    if (!trumpLengths) return 0;
    // We ask after the FULL show-out trick is completed (all 4 cards played).
    const idx = progressRoundIdx >= 0 ? progressRoundIdx : activePauseRoundIdx;
    const lastPlayIdx = (puzzle.rounds[idx]?.plays || []).length - 1;
    if (viewerIsDeclarerSide) {
      const init = (trumpLengths.LHO || 0) + (trumpLengths.RHO || 0);
      return computeTrumpsRemainingThroughEvent(puzzle, idx, lastPlayIdx, ["LHO", "RHO"], init);
    }
    const init = trumpLengths.DECLARER || 0;
    return computeTrumpsRemainingThroughEvent(puzzle, idx, lastPlayIdx, ["DECLARER"], init);
  }, [viewerIsDeclarerSide, puzzle, activePauseRoundIdx, progressRoundIdx, trumpLengths]);

  const { pre: prePrompts, post: postPrompts } = useMemo(() => {
    return resolveQuestionPlan(puzzle, viewerSeat, showOutLedSuit);
  }, [puzzle, viewerSeat, showOutLedSuit]);

  const seatShapeTarget = shapeSeat || puzzle.promptOptions?.seatShapeTarget || viewerSeat;
  const seatShapeExpected = useMemo(() => {
    const h = puzzle.shownHands?.[seatShapeTarget];
    if (!isFullHandShape(h)) return null;
    return {
      S: parseHandSuitString(h.S).length,
      H: parseHandSuitString(h.H).length,
      D: parseHandSuitString(h.D).length,
      C: parseHandSuitString(h.C).length,
    };
  }, [puzzle.shownHands, seatShapeTarget]);

  const visibleFullHandSeatsBase = useMemo(() => {
    if (Array.isArray(puzzle.visibleFullHandSeats) && puzzle.visibleFullHandSeats.length > 0) return puzzle.visibleFullHandSeats;
    return ["DUMMY", "DECLARER"];
  }, [puzzle.visibleFullHandSeats]);

  const visibleFullHandSeats = useMemo(() => {
    // At the end, reveal everything we know.
    if (promptStep === "DONE") return SEATS;
    // When showing a noContinue reveal, treat as end of hand and show full hand if puzzle has all four in shownHands.
    if (promptStep === "PLAY_DECISION_REVEAL" && activeCustomPrompt?.noContinue && SEATS.every((s) => isFullHandShape(puzzle.shownHands?.[s]))) return SEATS;
    return visibleFullHandSeatsBase;
  }, [promptStep, visibleFullHandSeatsBase, activeCustomPrompt?.noContinue, puzzle.shownHands]);

  const showFullHands = useMemo(() => {
    return visibleFullHandSeats.every((seat) => isFullHandShape(puzzle.shownHands?.[seat]));
  }, [puzzle.shownHands, visibleFullHandSeats]);

  const inference = useMemo(() => {
    if (progressRoundIdx < 0) return { solutionsCount: 0, uniqueSeat: {}, uniqueSuit: {} };
    return inferUniqueSuitLengths({
      puzzle,
      throughRoundIdx: progressRoundIdx,
      fixedFromHandsSeats: visibleFullHandSeats,
    });
  }, [progressRoundIdx, puzzle, visibleFullHandSeats]);

  const isSeatShapeKnowableNow = useMemo(() => {
    return !!inference?.uniqueSeat?.[seatShapeTarget];
  }, [inference, seatShapeTarget]);

  const askedSuitCount = useMemo(() => Object.keys(askedRef.current?.suitDistAsked || {}).length, [askedTick]);

  const computeSeatShapesFromAskedSuits = () => {
    const asked = askedRef.current || {};
    const suitVals = asked.suitDistValues || {};
    const suits = Object.keys(suitVals);
    if (suits.length < 3) return null;
    const used = suits.slice(0, 3);
    const remainingSuit = ["S", "H", "D", "C"].find((s) => !used.includes(s));
    if (!remainingSuit) return null;
    const shapes = {};
    for (const seat of SEATS) {
      const a = Number(suitVals[used[0]]?.[seat] ?? 0);
      const b = Number(suitVals[used[1]]?.[seat] ?? 0);
      const c = Number(suitVals[used[2]]?.[seat] ?? 0);
      const d = Math.max(0, 13 - (a + b + c));
      shapes[seat] = { [used[0]]: a, [used[1]]: b, [used[2]]: c, [remainingSuit]: d };
    }
    return shapes;
  };

  const pickNextShapeSeat = ({ localInference, shapesByMath }) => {
    const asked = askedRef.current || {};
    const askedSeat = asked.seatShapeAsked || {};
    const viewerIsDeclarer = viewerSeat === "DECLARER";
    const viewerIsDefender = viewerSeat === "LHO" || viewerSeat === "RHO";
    const defenderPartnerSeat = viewerSeat === "LHO" ? "RHO" : viewerSeat === "RHO" ? "LHO" : null;
    const targets = viewerIsDeclarer
      ? ["LHO", "RHO"]
      : viewerIsDefender
        ? ["DECLARER", defenderPartnerSeat].filter(Boolean)
        : ["DECLARER"];
    for (const s of targets) {
      if (askedSeat[s]) continue;
      if (localInference?.uniqueSeat?.[s] || shapesByMath?.[s]) return s;
    }
    return null;
  };

  const computeDeclarerTrumpStartKnowable = ({ throughRoundIdx, localInference }) => {
    if (!isSuitContract(puzzle)) return false;
    if (!(viewerSeat === "LHO" || viewerSeat === "RHO")) return true; // declarer-side prompts can be asked as an exercise

    const trumpSuit = puzzle.trumpSuit;
    const played = computeSuitLengthsFromPlayedThroughRound(puzzle, throughRoundIdx);
    if (played?.all13?.[trumpSuit]) return true;

    // Exact suit counts from trump show-outs.
    const knownFromShowOut = computeKnownSuitCountsThroughRound(puzzle.rounds || [], throughRoundIdx);

    const known = {};
    for (const seat of SEATS) {
      const legacy = puzzle.shownHands?.[seat];
      if (legacy?.suit && Array.isArray(legacy.cards) && legacy.suit === trumpSuit) {
        known[seat] = legacy.cards.length;
        continue;
      }
      if (visibleFullHandSeats.includes(seat) && isFullHandShape(puzzle.shownHands?.[seat])) {
        known[seat] = parseHandSuitString(puzzle.shownHands[seat][trumpSuit]).length;
        continue;
      }
      const k = knownFromShowOut?.[seat]?.[trumpSuit];
      if (typeof k === "number") known[seat] = k;
    }

    if (typeof known.DECLARER === "number") return true;
    const seatsKnown = Object.keys(known);
    if (seatsKnown.length < 3) return false;
    const sum = seatsKnown.reduce((acc, s) => acc + (known[s] || 0), 0);
    const missing = SEATS.find((s) => typeof known[s] !== "number");
    if (!missing) return true;
    const inferred = 13 - sum;
    return missing === "DECLARER" ? inferred >= 0 : false;
  };

  const getNextCustomPrompt = (throughRoundIdx) => {
    const all = Array.isArray(puzzle.promptOptions?.customPrompts) ? puzzle.promptOptions.customPrompts : [];
    if (!all.length) return null;
    const askedCustom = askedRef.current?.customAsked || {};
    const eligible = all.filter((p) => {
      const at = Number(p?.atRoundIdx);
      const atOk = Number.isFinite(at) ? throughRoundIdx >= at : false;
      return atOk && p?.id && !askedCustom[p.id];
    });
    return eligible[0] || null;
  };

  const computePostPromptsForPause = (pauseIndex) => {
    const pauseRoundIdx = pauseRounds[pauseIndex] ?? lastRoundIdx;
    const trickPlays = puzzle.rounds?.[pauseRoundIdx]?.plays || [];
    const ledSuit = trickPlays?.[0]?.card?.suit || puzzle.trumpSuit;
    const trickHasShowOut = trickPlays.some((p) => p?.showOut);
    const showOutSuit = trickHasShowOut ? ledSuit : null;
    const plan = resolveQuestionPlan(puzzle, viewerSeat, ledSuit);
    const localInference = inferUniqueSuitLengths({
      puzzle,
      throughRoundIdx: pauseRoundIdx,
      fixedFromHandsSeats: visibleFullHandSeats,
    });
    const declarerTrumpStartKnowable = computeDeclarerTrumpStartKnowable({ throughRoundIdx: pauseRoundIdx, localInference });

    const asked =
      askedRef.current || ({
        defendersStarted: false,
        defendersRemaining: false,
        suitDistAsked: {},
        suitDistValues: {},
        seatShapeAsked: {},
      });
    const unique = localInference?.uniqueSuit || {};
    const askedSuit = asked.suitDistAsked || {};
    const played = computeSuitLengthsFromPlayedThroughRound(puzzle, pauseRoundIdx);
    const all13 = played?.all13 || {};
    const suitIsKnown = (s) => {
      if (unique?.[s] || all13?.[s]) return true;
      const fromShowOut = inferSuitLengthsFromShowOutsAndVisible({
        puzzle,
        suit: s,
        throughRoundIdx: pauseRoundIdx,
        visibleFullHandSeats,
      });
      if (fromShowOut) return true;
      const inferred = inferSuitLengthsFromVisibleAndPlayed({
        puzzle,
        suit: s,
        throughRoundIdx: pauseRoundIdx,
        visibleFullHandSeats,
      });
      return !!inferred;
    };
    const allowDistribution = Object.keys(askedSuit).length < 3;
    const nextSuitToAsk =
      (allowDistribution && showOutSuit && suitIsKnown(showOutSuit) && !askedSuit[showOutSuit] && showOutSuit) ||
      (allowDistribution && ledSuit && suitIsKnown(ledSuit) && !askedSuit[ledSuit] && ledSuit) ||
      (allowDistribution ? ["S", "H", "D", "C"].find((s) => suitIsKnown(s) && !askedSuit[s]) : null) ||
      null;

    const shapesByMath = computeSeatShapesFromAskedSuits();
    const nextShapeSeat = pickNextShapeSeat({ localInference, shapesByMath });
    const filtered = (plan.post || []).filter((p) => {
      if (p === "DEFENDERS_STARTED") return !asked.defendersStarted && declarerTrumpStartKnowable;
      if (p === "DEFENDERS_REMAINING") return !asked.defendersRemaining && declarerTrumpStartKnowable;
      if (p === "DISTRIBUTION") return !!nextSuitToAsk;
      if (p === "TRICK_COUNT") return false; // manual trick mode handles this prompt
      if (p === "SEAT_SHAPE") return !!nextShapeSeat && !!seatShapeExpected;
      return true;
    });
    const nextCustom = getNextCustomPrompt(pauseRoundIdx);
    const prompts = nextCustom ? [nextCustom.type, ...Array.from(new Set(filtered))] : Array.from(new Set(filtered));
    return { prompts, distributionSuit: nextSuitToAsk, shapeSeat: nextShapeSeat, customPrompt: nextCustom };
  };

  const autoStartedRef = useRef(false);

  const resetForPuzzle = () => {
    clearAll();
    setIsPlaying(false);
    setRoundIdx(0);
    setPlayIdx(-1);
    setCompletedRoundIdx(-1);
    setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });
    setRemainingHands(buildInitialRemainingHands(puzzle));
    setPlayedFromHand({ LHO: {}, DUMMY: {}, RHO: {}, DECLARER: {} });
    setPostPromptIdx(0);
    setCurrentPostPrompts([]);
    setPauseIdx(0);
    setNextRoundToPlay(0);
    autoStartedRef.current = false;
    setHasStarted(false);
    setPromptStep(null);
    setFeedback(null);
    setDefendersStartedInput("");
    setDefendersHeartsStartedInput("");
    setDefendersRemainingInput("");
    setDistributionInput({ LHO: "", DUMMY: "", RHO: "", DECLARER: "" });
    setDistributionSuitKey(null);
    setDistributionSuit(null);
    setSeatShapeInput({ S: "", H: "", D: "", C: "" });
    setSeatShapeSeatKey(null);
    setShapeIntroSeatKey(null);
    setTrickCountInput({ S: "", H: "", D: "", C: "" });
    setDeclarerTrumpGuessInput("");
    setSeatSuitCountInput("");
    setSingleNumberInput("");
    setActiveCustomPrompt(null);
    setPlayDecisionReveal(null);
    setDoneExtraText(null);
    setWrongAttempts({
      defendersStarted: 0,
      defendersHeartsStarted: 0,
      defendersRemaining: 0,
      distribution: 0,
      distributionGuess: 0,
      distributionNeed: 0,
      seatShape: 0,
      trickCount: 0,
      seatSuitCount: 0,
      singleNumber: 0,
      playDecision: 0,
    });
    askedRef.current = {
      defendersStarted: false,
      defendersRemaining: false,
      suitDistAsked: {},
      suitDistValues: {},
      seatShapeAsked: {},
      trickCountAsked: false,
      declarerTrumpGuessAsked: false,
      preDistGuessAsked: false,
      customAsked: {},
    };
    setAskedTick((t) => t + 1);
  };

  useEffect(() => {
    resetForPuzzle();
  }, [puzzle.id]);

  const stopPlayback = () => {
    clearAll();
    setIsPlaying(false);
  };

  const applyStateThroughRound = (endRoundInclusive) => {
    stopPlayback();
    const end = Math.max(-1, Math.min(lastRoundIdx, endRoundInclusive));
    const playedMap = { LHO: {}, DUMMY: {}, RHO: {}, DECLARER: {} };
    let rem = buildInitialRemainingHands(puzzle);
    let lastTrick = { LHO: null, DUMMY: null, RHO: null, DECLARER: null };

    if (end >= 0) {
      for (let r = 0; r <= end; r++) {
        const plays = puzzle.rounds?.[r]?.plays || [];
        for (const p of plays) {
          const key = `${p.card.rank}${p.card.suit}`;
          if (showFullHands && visibleFullHandSeats.includes(p.seat)) {
            playedMap[p.seat] = { ...(playedMap[p.seat] || {}), [key]: true };
          }
          if (isTrump(p.card, puzzle.trumpSuit)) {
            rem = { ...rem, [p.seat]: removeCardFromHand(rem[p.seat], p.card) };
          }
        }
      }
      const lastPlays = puzzle.rounds?.[end]?.plays || [];
      lastTrick = { LHO: null, DUMMY: null, RHO: null, DECLARER: null };
      for (const p of lastPlays) lastTrick[p.seat] = p.card;
    }

    setPlayedFromHand(playedMap);
    setRemainingHands(rem);
    setTrickCards(lastTrick);
    setRoundIdx(Math.max(0, end));
    setPlayIdx(end >= 0 ? (puzzle.rounds?.[end]?.plays || []).length - 1 : -1);
    setCompletedRoundIdx(end);
    setPromptStep(null);
    setFeedback(null);
    setPostPromptIdx(0);
    setCurrentPostPrompts([]);
  };

  const playSegment = (startRound, endRoundInclusive, onDone) => {
    stopPlayback();
    setFeedback(null);
    setPromptStep(null);

    // Schedule sequential plays across rounds.
    setIsPlaying(true);
    let t = 0;
    const playDelay = 650;
    const betweenRoundsDelay = 900;

    for (let r = startRound; r <= endRoundInclusive; r++) {
      setQueuedTimeout(() => {
        setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });
        setRoundIdx(r);
        setPlayIdx(-1);
      }, t);
      t += 250;

      const plays = puzzle.rounds[r].plays;
      for (let i = 0; i <= plays.length - 1; i++) {
        const p = plays[i];
        setQueuedTimeout(() => {
          setRoundIdx(r);
          setPlayIdx(i);
          setTrickCards((prev) => ({ ...prev, [p.seat]: p.card }));
          if (showFullHands && visibleFullHandSeats.includes(p.seat)) {
            setPlayedFromHand((prev) => ({
              ...prev,
              [p.seat]: { ...(prev[p.seat] || {}), [`${p.card.rank}${p.card.suit}`]: true },
            }));
          }
          if (isTrump(p.card, puzzle.trumpSuit)) {
            setRemainingHands((prev) => ({
              ...prev,
              [p.seat]: removeCardFromHand(prev[p.seat], p.card),
            }));
          }
        }, t);
        t += playDelay;
      }

      if (r !== endRoundInclusive) t += betweenRoundsDelay;
    }

    setQueuedTimeout(() => {
      setIsPlaying(false);
      onDone?.();
    }, t + 150);
  };

  const computePostPromptsForRound = (roundIndex) => {
    const idx = Math.max(0, Math.min(lastRoundIdx, roundIndex));
    const trickPlays = puzzle.rounds?.[idx]?.plays || [];
    const ledSuit = trickPlays?.[0]?.card?.suit || puzzle.trumpSuit;
    const trickHasShowOut = trickPlays.some((p) => p?.showOut);
    const showOutSuit = trickHasShowOut ? ledSuit : null;
    const plan = resolveQuestionPlan(puzzle, viewerSeat, ledSuit);
    const localInference = inferUniqueSuitLengths({
      puzzle,
      throughRoundIdx: idx,
      fixedFromHandsSeats: visibleFullHandSeats,
    });
    const declarerTrumpStartKnowable = computeDeclarerTrumpStartKnowable({ throughRoundIdx: idx, localInference });

    const asked =
      askedRef.current || ({
        defendersStarted: false,
        defendersRemaining: false,
        suitDistAsked: {},
        suitDistValues: {},
        seatShapeAsked: {},
      });
    const unique = localInference?.uniqueSuit || {};
    const askedSuit = asked.suitDistAsked || {};
    const played = computeSuitLengthsFromPlayedThroughRound(puzzle, idx);
    const all13 = played?.all13 || {};
    const suitIsKnown = (s) => {
      if (unique?.[s] || all13?.[s]) return true;
      const fromShowOut = inferSuitLengthsFromShowOutsAndVisible({
        puzzle,
        suit: s,
        throughRoundIdx: idx,
        visibleFullHandSeats,
      });
      if (fromShowOut) return true;
      const inferred = inferSuitLengthsFromVisibleAndPlayed({
        puzzle,
        suit: s,
        throughRoundIdx: idx,
        visibleFullHandSeats,
      });
      return !!inferred;
    };
    const allowDistribution = Object.keys(askedSuit).length < 3;
    const nextSuitToAsk =
      (allowDistribution && showOutSuit && suitIsKnown(showOutSuit) && !askedSuit[showOutSuit] && showOutSuit) ||
      (allowDistribution && ledSuit && suitIsKnown(ledSuit) && !askedSuit[ledSuit] && ledSuit) ||
      (allowDistribution ? ["S", "H", "D", "C"].find((s) => suitIsKnown(s) && !askedSuit[s]) : null) ||
      null;

    const shapesByMath = computeSeatShapesFromAskedSuits();
    const nextShapeSeat = pickNextShapeSeat({ localInference, shapesByMath });
    const filtered = (plan.post || []).filter((p) => {
      if (p === "DEFENDERS_STARTED") return !asked.defendersStarted && declarerTrumpStartKnowable;
      if (p === "DEFENDERS_REMAINING") return !asked.defendersRemaining && declarerTrumpStartKnowable;
      if (p === "DISTRIBUTION") return !!nextSuitToAsk;
      if (p === "TRICK_COUNT") {
        const at = Number(puzzle.promptOptions?.trickCountAtRoundIdx);
        const eligible = Number.isFinite(at) ? idx >= at : false;
        return eligible && !asked.trickCountAsked;
      }
      if (p === "SEAT_SHAPE") return !!nextShapeSeat && !!seatShapeExpected;
      return true;
    });
    const nextCustom = getNextCustomPrompt(idx);
    const prompts = nextCustom ? [nextCustom.type, ...Array.from(new Set(filtered))] : Array.from(new Set(filtered));
    return { prompts, distributionSuit: nextSuitToAsk, shapeSeat: nextShapeSeat, customPrompt: nextCustom };
  };

  const afterManualTrick = (idx) => {
    // Set prompts based on knowledge AFTER this trick.
    const computed = computePostPromptsForRound(idx);
    setCurrentPostPrompts(computed.prompts);
    setPostPromptIdx(0);
    setActiveCustomPrompt(computed.customPrompt || null);
    if (computed.prompts[0] === "DISTRIBUTION") setDistributionSuit(computed.distributionSuit);
    if (computed.customPrompt?.type === "DISTRIBUTION_GUESS" && computed.customPrompt?.suit) setDistributionSuit(computed.customPrompt.suit);
    if (computed.customPrompt?.type === "SEAT_SHAPE" && computed.customPrompt?.seat) setShapeSeat(computed.customPrompt.seat);
    else if (computed.prompts[0] === "SEAT_SHAPE") setShapeSeat(computed.shapeSeat);
    setPromptStep(computed.prompts[0] || null);
    if (idx >= lastRoundIdx && computed.prompts.length === 0) {
      const delayMs = Number(puzzle?.promptOptions?.endRevealDelayMs || 0);
      if (Number.isFinite(delayMs) && delayMs > 0) {
        setQueuedTimeout(() => setPromptStep("DONE"), delayMs);
      } else {
        setPromptStep("DONE");
      }
    }
    return computed;
  };

  const playOneTrick = (idx) => {
    if (idx < 0 || idx > lastRoundIdx) return;
    if (promptStep && promptStep !== "DONE") return; // must answer prompts before advancing
    playSegment(idx, idx, () => {
      setCompletedRoundIdx(idx);
      afterManualTrick(idx);
    });
  };

  const playFromRoundToPause = (startRound, pauseIndex) => {
    const start = startRound;
    if (start > lastRoundIdx) {
      setPromptStep("DONE");
      return;
    }

    const end = pauseRounds[pauseIndex] ?? lastRoundIdx;
    setPauseIdx(pauseIndex);
    setNextRoundToPlay(end + 1);

    playSegment(start, end, () => {
      setPostPromptIdx(0);
      const computed = computePostPromptsForPause(pauseIndex);
      setCurrentPostPrompts(computed.prompts);
      const nextPrompt = computed.prompts[0] || null;
      if (nextPrompt === "DISTRIBUTION") setDistributionSuit(computed.distributionSuit);
      if (nextPrompt === "SEAT_SHAPE") setShapeSeat(computed.shapeSeat);
      setPromptStep(nextPrompt);

      if (!nextPrompt) {
        if (end >= lastRoundIdx) setPromptStep("DONE");
        else playFromRoundToPause(end + 1, pauseIndex + 1);
      }
    });
  };

  const continueAfterPrompts = () => {
    playFromRoundToPause(nextRoundToPlay, pauseIdx + 1);
  };

  const playFromStartToNextPause = () => {
    playFromRoundToPause(0, 0);
  };

  const startPuzzle = () => {
    if (isPlaying) return;
    setHasStarted(true);
    setFeedback(null);
    setPostPromptIdx(0);
    setPauseIdx(0);
    // Manual mode: always start by showing Trick 1 on the table.
    setPromptStep(null);
    applyStateThroughRound(-1);
    // Some hands start with questions BEFORE any cards are played.
    const preCustom = getNextCustomPrompt(-1);
    if (preCustom) {
      setActiveCustomPrompt(preCustom);
      setPromptStep(preCustom.type);
      return;
    }
    // Some hands want the standard pre-prompts (e.g. DEFENDERS_STARTED) before any play.
    if (puzzle?.promptOptions?.prePromptsBeforePlay && prePrompts[0]) {
      setPromptStep(prePrompts[0]);
      return;
    }

    // If there is no play, this is a question-only exercise: after pre-prompts finish, end immediately.
    if (lastRoundIdx < 0) {
      setPromptStep(prePrompts[0] ? prePrompts[0] : "DONE");
      return;
    }

    const autoThrough = Number.isFinite(puzzle?.promptOptions?.startAutoPlayThroughRoundIdx)
      ? Math.max(0, Math.min(lastRoundIdx, Number(puzzle.promptOptions.startAutoPlayThroughRoundIdx)))
      : 0;
    const startEnd = Math.max(0, Math.min(lastRoundIdx, autoThrough));

    playSegment(0, startEnd, () => {
      setCompletedRoundIdx(startEnd);

      // After Trick 1, show any warm-up prompts (distribution guess, trump guess, etc).
      if (puzzle?.promptOptions?.preDistributionGuess && !(askedRef.current?.preDistGuessAsked || false)) {
        const cfg = puzzle.promptOptions.preDistributionGuess;
        const suit = cfg?.suit || puzzle.trumpSuit || showOutLedSuit;
        const fixed = cfg?.fixed || {};
        setDistributionSuit(suit);
        setDistributionSuitKey(`preGuess:${puzzle.id}:${suit}`);
        setDistributionInput({
          LHO: fixed.LHO !== undefined ? String(fixed.LHO) : "",
          DUMMY: fixed.DUMMY !== undefined ? String(fixed.DUMMY) : "",
          RHO: fixed.RHO !== undefined ? String(fixed.RHO) : "",
          DECLARER: fixed.DECLARER !== undefined ? String(fixed.DECLARER) : "",
        });
        setPromptStep("DISTRIBUTION_GUESS");
        return;
      }

      // Training warm-up: take a best guess (no wrong answers).
      if (
        !puzzle?.promptOptions?.disableWarmupTrumpGuess &&
        isSuitContract(puzzle) &&
        viewerIsDefender &&
        !(askedRef.current?.declarerTrumpGuessAsked || false)
      ) {
        setPromptStep("DECLARER_TRUMP_GUESS");
        return;
      }

      // If this puzzle has a "pre-play" prompt, ask it now (after Trick 1 is visible).
      if (prePrompts[0]) {
        setPromptStep(prePrompts[0]);
        return;
      }

      afterManualTrick(startEnd);
    });
  };

  const currentPlay = useMemo(() => {
    const plays = puzzle.rounds?.[roundIdx]?.plays || [];
    if (playIdx < 0 || playIdx >= plays.length) return null;
    return plays[playIdx];
  }, [puzzle.rounds, roundIdx, playIdx]);

  const animSeat = currentPlay?.seat || null;

  // Animate full-hand card shifts (FLIP) so cards "slide in" when one is played.
  useLayoutEffect(() => {
    if (!showFullHands) return;

    const seatToRef = {
      LHO: lhoHandFanRef,
      DUMMY: dummyHandFanRef,
      RHO: rhoHandFanRef,
      DECLARER: declarerHandFanRef,
    };

    const seats = visibleFullHandSeats.map((seat) => ({ seat, ref: seatToRef[seat] })).filter((x) => x.ref);

    for (const { seat, ref } of seats) {
      const root = ref.current;
      if (!root) continue;

      const els = Array.from(root.querySelectorAll("[data-card-key]"));
      const nextRects = {};
      for (const el of els) {
        const k = el.getAttribute("data-card-key");
        if (!k) continue;
        nextRects[k] = el.getBoundingClientRect();
      }

      const prevRects = prevHandRectsRef.current?.[seat] || {};
      for (const el of els) {
        const k = el.getAttribute("data-card-key");
        if (!k) continue;
        const prev = prevRects[k];
        const next = nextRects[k];
        if (!prev || !next) continue;

        const dx = prev.left - next.left;
        const dy = prev.top - next.top;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;

        el.style.transition = "transform 0s";
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => {
          el.style.transition = "transform 180ms ease";
          el.style.transform = "translate(0px, 0px)";
        });
      }

      prevHandRectsRef.current = { ...(prevHandRectsRef.current || {}), [seat]: nextRects };
    }
  }, [showFullHands, playedFromHand, puzzle.id, visibleFullHandSeats]);

  const getStaticSeatSuitCards = (seat, suit) => {
    const hand = puzzle.shownHands?.[seat];
    if (!hand) return [];
    if (hand.suit && hand.cards && suit === hand.suit) return hand.cards.map((r) => makeCard(r, suit));
    if (!isFullHandShape(hand)) return [];
    return parseHandSuitString(hand[suit]).map((r) => makeCard(r, suit));
  };

  const getSeatSuitCardsForRender = (seat, suit) => {
    if (seat !== "DUMMY" && seat !== "DECLARER") return [];
    if (suit === puzzle.trumpSuit) return remainingHands[seat] || [];
    return getStaticSeatSuitCards(seat, suit);
  };

  const renderSeatHand = (seat) => {
    if (!showFullHands) {
      // Old mode: show only trump suit as mini-cards.
      if (promptStep === "DONE" && puzzle.endRevealTrumpHands && Array.isArray(puzzle.endRevealTrumpHands[seat])) {
        const ranks = puzzle.endRevealTrumpHands[seat];
        return (
          <div className="ct-handCardsAsCards" aria-label={`${seat} trump suit revealed`}>
            {ranks.map((r, idx) => {
              const c = makeCard(r, puzzle.trumpSuit);
              return (
                <div key={`${seat}-reveal-${c.rank}${c.suit}-${idx}`} className={`ct-miniCard ${cardColorClass(c)}`}>
                  <div className="ct-miniCardCorner">{formatCard(c)}</div>
                  <div className="ct-miniCardCenter">{formatCard(c)}</div>
                </div>
              );
            })}
          </div>
        );
      }
      if (!initialTrumpVisibleSeats.includes(seat)) {
        return (
          <div className="ct-hiddenHand" aria-label={`${seat} hidden hand`}>
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={`${seat}-hidden-${i}`} className="ct-hiddenCard" />
            ))}
          </div>
        );
      }
      return (
        <div className="ct-handCardsAsCards" aria-label={`${seat} trump cards remaining`}>
          {(remainingHands[seat] || []).map((c, idx) => (
            <div key={`${seat}-${c.rank}${c.suit}-${idx}`} className={`ct-miniCard ${cardColorClass(c)}`}>
              <div className="ct-miniCardCorner">{formatCard(c)}</div>
              <div className="ct-miniCardCenter">{formatCard(c)}</div>
            </div>
          ))}
          {(remainingHands[seat] || []).length === 0 && <div className="ct-emptyHand">No trumps left</div>}
        </div>
      );
    }

    if (!visibleFullHandSeats.includes(seat)) {
      // Defender POV: keep unseen hands hidden (but stable in layout).
      return (
        <div className="ct-hiddenHand" aria-label={`${seat} hidden hand`}>
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={`${seat}-hidden-${i}`} className="ct-hiddenCard" />
          ))}
        </div>
      );
    }

    const full = initialFullHands[seat] || [];
    const playedMap =
      promptStep === "DONE" && !puzzle.preserveEndStateAtDone ? {} : playedFromHand?.[seat] || {};
    const unplayed = full.filter((c) => !playedMap[`${c.rank}${c.suit}`]);
    const ghostCount = Math.max(0, full.length - unplayed.length);
    const fanRef =
      seat === "DUMMY"
        ? dummyHandFanRef
        : seat === "DECLARER"
          ? declarerHandFanRef
          : seat === "LHO"
            ? lhoHandFanRef
            : seat === "RHO"
              ? rhoHandFanRef
              : null;

    const isWideSeat = seat === seatTop || seat === seatBottom;

    // For wide slots (top/bottom), use the large BBO-like 13-wide grid.
    // For side slots (left/right), use the compact per-suit rows.
    if (!isWideSeat) {
      const SUITS = ["S", "H", "D", "C"];
      return (
        <div ref={fanRef} className="ct-suitHand" aria-label={`${seat} suit layout`}>
          {SUITS.map((s) => {
            const suitCards = unplayed.filter((c) => c.suit === s);
            if (suitCards.length === 0) return null;
            return (
              <div
                key={`${seat}-suit-${s}`}
                className="ct-suitLine"
                style={{ gridTemplateColumns: `repeat(${Math.max(suitCards.length, 1)}, minmax(34px, 50px))` }}
              >
                {suitCards.map((c, idx) => {
                  const key = `${c.rank}${c.suit}`;
                  return (
                    <div
                      key={`${seat}-${key}-${idx}`}
                      data-card-key={key}
                      className={`ct-miniCard ct-miniCard--fan ${cardColorClass(c)}`}
                    >
                      <div className="ct-fanFace" aria-hidden="true">
                        <div className="ct-fanRank">{displayRank(c.rank)}</div>
                        <div className="ct-fanSuit">{suitSymbol(c.suit)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div ref={fanRef} className="ct-handFan ct-handFan--full" aria-label={`${seat} full hand`}>
        {unplayed.map((c, idx) => {
          const key = `${c.rank}${c.suit}`;
          return (
            <div
              key={`${seat}-${key}-${idx}`}
              data-card-key={key}
              className={`ct-miniCard ct-miniCard--fan ${cardColorClass(c)}`}
            >
              <div className="ct-fanFace" aria-hidden="true">
                <div className="ct-fanRank">{displayRank(c.rank)}</div>
                <div className="ct-fanSuit">{suitSymbol(c.suit)}</div>
              </div>
            </div>
          );
        })}
        {Array.from({ length: ghostCount }).map((_, i) => (
          <div
            key={`${seat}-ghost-${i}`}
            className="ct-miniCard ct-miniCard--fan ct-miniCard--ghost"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  const advancePostPrompt = () => {
    const nextIdx = postPromptIdx + 1;
    setPostPromptIdx(nextIdx);
    const next = currentPostPrompts[nextIdx] || null;
    if (next) {
      if (next === "DISTRIBUTION") {
        // Recompute distribution suit in case the user just answered one.
        const computed = manualTrickMode ? computePostPromptsForRound(completedRoundIdx) : computePostPromptsForPause(pauseIdx);
        setDistributionSuit(computed.distributionSuit);
      }
      if (next === "SEAT_SHAPE") {
        const computed = manualTrickMode ? computePostPromptsForRound(completedRoundIdx) : computePostPromptsForPause(pauseIdx);
        setShapeSeat(computed.shapeSeat);
      }
      setPromptStep(next);
      return;
    }
    setPromptStep(null);
    if (manualTrickMode) {
      // In manual mode, we still want a clear completion screen once the hand is finished.
      if (completedRoundIdx >= lastRoundIdx) setPromptStep("DONE");
      return;
    }
    continueAfterPrompts();
  };

  const revealAfterTwoWrong = (kind) => {
    const next = (wrongAttempts?.[kind] || 0) + 1;
    setWrongAttempts((prev) => ({ ...prev, [kind]: next }));
    return next >= 2;
  };

  const submitDefendersStarted = () => {
    const val = Number(defendersStartedInput);
    if (Number.isFinite(val) && String(defendersStartedInput).trim() !== "" && val === startedTrumpsCorrect) {
      setFeedback({ type: "ok", text: "Well done — that’s correct!" });
      setQueuedTimeout(() => {
        setFeedback(null);
        askedRef.current = { ...(askedRef.current || {}), defendersStarted: true };
        setAskedTick((t) => t + 1);
        if (prePrompts[0] === "DEFENDERS_STARTED") {
          if (puzzle?.promptOptions?.defendersHeartsStartedExpected != null) {
            setPromptStep("DEFENDERS_HEARTS_STARTED");
          } else {
            setPromptStep(null);
            applyStateThroughRound(-1);
          }
        } else {
          // Post-play: continue to next question.
          advancePostPrompt();
        }
      }, 550);
    } else {
      const shouldReveal = revealAfterTwoWrong("defendersStarted");
      if (shouldReveal) {
        setFeedback({ type: "ok", text: `The correct answer is ${startedTrumpsCorrect}.` });
        setQueuedTimeout(() => {
          setFeedback(null);
          askedRef.current = { ...(askedRef.current || {}), defendersStarted: true };
          setAskedTick((t) => t + 1);
          if (prePrompts[0] === "DEFENDERS_STARTED") {
            if (puzzle?.promptOptions?.defendersHeartsStartedExpected != null) {
              setPromptStep("DEFENDERS_HEARTS_STARTED");
            } else {
              setPromptStep(null);
              applyStateThroughRound(-1);
            }
          } else {
            advancePostPrompt();
          }
        }, 900);
      } else {
        setFeedback({ type: "error", text: "Not quite — try again." });
      }
    }
  };

  const submitDefendersHeartsStarted = () => {
    const expected = puzzle?.promptOptions?.defendersHeartsStartedExpected;
    const val = Number(defendersHeartsStartedInput);
    if (Number.isFinite(expected) && Number.isFinite(val) && val === expected) {
      setFeedback({ type: "ok", text: "Well done — that's correct!" });
      setQueuedTimeout(() => {
        setFeedback(null);
        setPromptStep(null);
        applyStateThroughRound(-1);
      }, 550);
    } else {
      const shouldReveal = revealAfterTwoWrong("defendersHeartsStarted");
      if (shouldReveal) {
        setFeedback({ type: "ok", text: `The correct answer is ${expected}.` });
        setQueuedTimeout(() => {
          setFeedback(null);
          setPromptStep(null);
          applyStateThroughRound(-1);
        }, 900);
      } else {
        setFeedback({ type: "error", text: "Not quite — try again." });
      }
    }
  };

  const submitDefendersRemaining = () => {
    const val = Number(defendersRemainingInput);
    if (Number.isFinite(val) && String(defendersRemainingInput).trim() !== "" && val === remainingTrumpsCorrect) {
      setFeedback({ type: "ok", text: "Well done — that’s correct!" });
      setQueuedTimeout(() => {
        setFeedback(null);
        askedRef.current = { ...(askedRef.current || {}), defendersRemaining: true };
        setAskedTick((t) => t + 1);
        advancePostPrompt();
      }, 400);
    } else {
      const shouldReveal = revealAfterTwoWrong("defendersRemaining");
      if (shouldReveal) {
        setFeedback({ type: "ok", text: `The correct answer is ${remainingTrumpsCorrect}.` });
        setQueuedTimeout(() => {
          setFeedback(null);
          askedRef.current = { ...(askedRef.current || {}), defendersRemaining: true };
          setAskedTick((t) => t + 1);
          advancePostPrompt();
        }, 900);
      } else {
        setFeedback({ type: "error", text: "Not quite — try again." });
      }
    }
  };

  const submitDistribution = () => {
    const expected = distributionExpected || puzzle.expectedInitialLengths;
    const parsed = {};
    for (const seat of SEATS) parsed[seat] = Number(distributionInput[seat]);

    const allFilled = SEATS.every((s) => String(distributionInput[s]).trim() !== "");
    const correct =
      allFilled &&
      SEATS.every((s) => Number.isFinite(parsed[s])) &&
      SEATS.every((s) => parsed[s] === expected[s]);

    if (correct) {
      setFeedback({ type: "ok", text: "Well done — that’s correct!" });
      setQueuedTimeout(() => {
        setFeedback(null);
        if (distributionSuit) {
          askedRef.current = {
            ...(askedRef.current || {}),
            suitDistAsked: { ...((askedRef.current && askedRef.current.suitDistAsked) || {}), [distributionSuit]: true },
            suitDistValues: {
              ...((askedRef.current && askedRef.current.suitDistValues) || {}),
              [distributionSuit]: expected,
            },
          };
          setAskedTick((t) => t + 1);
        }
        // If another suit is already known at this same point, ask it next (no need to advance play yet).
        const ctxRound = manualTrickMode ? completedRoundIdx : activePauseRoundIdx;
        const computed = manualTrickMode ? computePostPromptsForRound(ctxRound) : computePostPromptsForPause(pauseIdx);
        if (computed.prompts.includes("DISTRIBUTION") && computed.distributionSuit && computed.distributionSuit !== distributionSuit) {
          setCurrentPostPrompts(computed.prompts);
          setPostPromptIdx(0);
          setDistributionSuit(computed.distributionSuit);
          setPromptStep("DISTRIBUTION");
          return;
        }
        advancePostPrompt();
      }, 450);
    } else {
      const shouldReveal = revealAfterTwoWrong("distribution");
      if (shouldReveal) {
        const suit = distributionSuit || showOutLedSuit;
        const suitName = suit === puzzle.trumpSuit ? "trump" : SUIT_NAME[suit] || suit;
        const answerText = `${roleLabelForSeat("LHO")}: ${expected.LHO}, ${roleLabelForSeat("DUMMY")}: ${expected.DUMMY}, ${roleLabelForSeat("RHO")}: ${expected.RHO}, ${roleLabelForSeat("DECLARER")}: ${expected.DECLARER}`;
        setFeedback({ type: "ok", text: `The correct ${suitName} distribution is ${answerText}.` });
        setQueuedTimeout(() => {
          setFeedback(null);
          if (distributionSuit) {
            askedRef.current = {
              ...(askedRef.current || {}),
              suitDistAsked: { ...((askedRef.current && askedRef.current.suitDistAsked) || {}), [distributionSuit]: true },
              suitDistValues: {
                ...((askedRef.current && askedRef.current.suitDistValues) || {}),
                [distributionSuit]: expected,
              },
            };
            setAskedTick((t) => t + 1);
          }
          const ctxRound = manualTrickMode ? completedRoundIdx : activePauseRoundIdx;
          const computed = manualTrickMode ? computePostPromptsForRound(ctxRound) : computePostPromptsForPause(pauseIdx);
          if (computed.prompts.includes("DISTRIBUTION") && computed.distributionSuit && computed.distributionSuit !== distributionSuit) {
            setCurrentPostPrompts(computed.prompts);
            setPostPromptIdx(0);
            setDistributionSuit(computed.distributionSuit);
            setPromptStep("DISTRIBUTION");
            return;
          }
          advancePostPrompt();
        }, 1300);
      } else {
        setFeedback({
          type: "error",
          text: allFilled ? "Not quite — try again." : "Please enter all 4 numbers, then try again.",
        });
      }
    }
  };

  const submitDistributionGuess = () => {
    const isCustomGuess = activeCustomPrompt?.type === "DISTRIBUTION_GUESS" && !!activeCustomPrompt?.id;
    const promptId = isCustomGuess ? activeCustomPrompt.id : null;
    const suit =
      (isCustomGuess ? activeCustomPrompt?.suit : null) ||
      puzzle?.promptOptions?.preDistributionGuess?.suit ||
      puzzle?.trumpSuit ||
      showOutLedSuit;
    const expectedDist = isCustomGuess ? activeCustomPrompt?.expectedDistribution : null;
    const parsed = {};
    for (const seat of SEATS) parsed[seat] = Number(distributionInput[seat]);
    const allFilled = SEATS.every((s) => String(distributionInput[s]).trim() !== "");
    const allNums = SEATS.every((s) => Number.isFinite(parsed[s]));
    const sum = SEATS.reduce((acc, s) => acc + (Number.isFinite(parsed[s]) ? parsed[s] : 0), 0);

    if (!allFilled || !allNums || sum !== 13) {
      setFeedback({ type: "error", text: "That doesn’t add to 13 — try again." });
      return;
    }

    if (expectedDist && typeof expectedDist === "object") {
      const correct = SEATS.every((s) => Number(expectedDist[s]) === parsed[s]);
      if (!correct) {
        const shouldReveal = revealAfterTwoWrong("distributionGuess");
        if (shouldReveal) {
          setFeedback({
            type: "ok",
            text: `The correct answer is ${expectedDist.LHO}${expectedDist.DUMMY}${expectedDist.RHO}${expectedDist.DECLARER}.`,
          });
          setQueuedTimeout(() => {
            setFeedback(null);
            askedRef.current = {
              ...(askedRef.current || {}),
              customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
            };
            setAskedTick((t) => t + 1);
            setDistributionSuit(suit);
            continueFromRound(completedRoundIdx);
          }, 1100);
        } else {
          setFeedback({ type: "error", text: "Not quite — try again." });
        }
        return;
      }
    }

    setFeedback({ type: "ok", text: "Well done — let’s play!" });
    setQueuedTimeout(() => {
      setFeedback(null);
      if (promptId) {
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setActiveCustomPrompt(null);
      } else {
        askedRef.current = { ...(askedRef.current || {}), preDistGuessAsked: true };
      }
      setAskedTick((t) => t + 1);
      setDistributionSuit(suit);
      continueFromRound(completedRoundIdx);
    }, 650);
  };

  const setShapeSuitValue = (suit, rawValue) => {
    const raw = String(rawValue ?? "");
    const cleaned = raw.replace(/[^0-9]/g, "").slice(-1); // single digit only (0–9)
    if (cleaned === "") {
      setSeatShapeInput((prev) => ({ ...prev, [suit]: "" }));
      return "";
    }
    // Clamp to 0..9 (single digit)
    const n = Math.max(0, Math.min(9, Number(cleaned)));
    const out = String(n);
    setSeatShapeInput((prev) => ({ ...prev, [suit]: out }));
    return out;
  };

  const resetSeatShapeInputs = () => {
    setSeatShapeInput({ S: "", H: "", D: "", C: "" });
    setFeedback(null);
    // re-focus happens via the promptStep effect
    setQueuedTimeout(() => {
      seatShapeRefs.S.current?.focus?.();
      seatShapeRefs.S.current?.select?.();
    }, 0);
  };

  const setTrickCountSuitDigit = (suit, rawValue) => {
    const raw = String(rawValue ?? "");
    const digit = raw.replace(/[^0-9]/g, "").slice(-1);
    if (digit === "") {
      setTrickCountInput((prev) => ({ ...prev, [suit]: "" }));
      return "";
    }
    setTrickCountInput((prev) => ({ ...prev, [suit]: digit }));
    return digit;
  };

  const submitTrickCount = () => {
    const through = manualTrickMode ? completedRoundIdx : activePauseRoundIdx;
    const expected =
      puzzle.promptOptions?.trickCountExpected || computeTrickCountExpectedThroughRound(puzzle, Math.max(0, through));
    const parsed = {
      S: Number(trickCountInput.S),
      H: Number(trickCountInput.H),
      D: Number(trickCountInput.D),
      C: Number(trickCountInput.C),
    };
    const total = (Number.isFinite(parsed.S) ? parsed.S : 0) + (Number.isFinite(parsed.H) ? parsed.H : 0) + (Number.isFinite(parsed.D) ? parsed.D : 0) + (Number.isFinite(parsed.C) ? parsed.C : 0);
    const allFilled = ["S", "H", "D", "C"].every((s) => String(trickCountInput[s]).trim() !== "");
    const correct =
      allFilled &&
      ["S", "H", "D", "C"].every((s) => Number.isFinite(parsed[s])) &&
      parsed.S === expected.S &&
      parsed.H === expected.H &&
      parsed.D === expected.D &&
      parsed.C === expected.C;

    if (correct) {
      setFeedback({
        type: "ok",
        text: `Well done! Correct — ${isDeclarerSide ? "your side" : "declarer"} has ${total} sure tricks.`,
      });
      setQueuedTimeout(() => {
        setFeedback(null);
        askedRef.current = { ...(askedRef.current || {}), trickCountAsked: true };
        setAskedTick((t) => t + 1);
        advancePostPrompt();
      }, 1100);
    } else {
      const shouldReveal = revealAfterTwoWrong("trickCount");
      if (shouldReveal) {
        const ansTotal = (expected.S || 0) + (expected.H || 0) + (expected.D || 0) + (expected.C || 0);
        setFeedback({ type: "ok", text: `The correct answer is ${expected.S}${expected.H}${expected.D}${expected.C} (total ${ansTotal}).` });
        setQueuedTimeout(() => {
          setFeedback(null);
          askedRef.current = { ...(askedRef.current || {}), trickCountAsked: true };
          setAskedTick((t) => t + 1);
          advancePostPrompt();
        }, 1400);
      } else {
        setFeedback({ type: "error", text: allFilled ? "Not quite — try again." : "Please enter all 4 numbers, then try again." });
      }
    }
  };

  const submitDeclarerTrumpGuess = () => {
    const raw = String(declarerTrumpGuessInput ?? "").trim();
    const cleaned = raw.replace(/[^0-9]/g, "").slice(0, 2); // allow 0-13
    if (cleaned === "") {
      setFeedback({ type: "error", text: "Enter a number (0–13) to continue." });
      return;
    }
    const n = Math.max(0, Math.min(13, Number(cleaned)));
    setDeclarerTrumpGuessInput(String(n));
    setFeedback(null);
    const isCustom = activeCustomPrompt?.type === "DECLARER_TRUMP_GUESS" && activeCustomPrompt?.id;
    if (isCustom) {
      askedRef.current = {
        ...(askedRef.current || {}),
        customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [activeCustomPrompt.id]: true },
      };
    } else {
      askedRef.current = { ...(askedRef.current || {}), declarerTrumpGuessAsked: true };
    }
    setAskedTick((t) => t + 1);
    continueFromRound(completedRoundIdx);
  };

  const submitSeatSuitCount = () => {
    const expected = activeCustomPrompt?.expected;
    const promptId = activeCustomPrompt?.id;
    const raw = String(seatSuitCountInput ?? "").trim();
    const cleaned = raw.replace(/[^0-9]/g, "").slice(0, 1);
    const val = cleaned === "" ? NaN : Number(cleaned);
    if (!promptId || typeof expected !== "number") {
      setPromptStep(null);
      return;
    }
    if (Number.isFinite(val) && val === expected) {
      setFeedback({ type: "ok", text: "Well done — that's correct!" });
      setQueuedTimeout(() => {
        setFeedback(null);
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        afterManualTrick(completedRoundIdx);
      }, 650);
      return;
    }

    const shouldReveal = revealAfterTwoWrong("seatSuitCount");
    if (shouldReveal) {
      setFeedback({ type: "ok", text: `The correct answer is ${expected}.` });
      setQueuedTimeout(() => {
        setFeedback(null);
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        afterManualTrick(completedRoundIdx);
      }, 1100);
    } else {
      setFeedback({ type: "error", text: "Not quite — try again." });
    }
  };

  const submitSingleNumber = () => {
    const promptId = activeCustomPrompt?.id;
    const expected = activeCustomPrompt?.expectedAnswer;
    const val = Number(singleNumberInput);
    if (!promptId || typeof expected !== "number") return;
    if (Number.isFinite(val) && val === expected) {
      setFeedback({ type: "ok", text: "Well done — that's correct!" });
      setQueuedTimeout(() => {
        setFeedback(null);
        setSingleNumberInput("");
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        afterManualTrick(completedRoundIdx);
      }, 550);
    } else {
      const shouldReveal = revealAfterTwoWrong("singleNumber");
      if (shouldReveal) {
        setFeedback({ type: "ok", text: `The correct answer is ${expected}.` });
        setQueuedTimeout(() => {
          setFeedback(null);
          setSingleNumberInput("");
          askedRef.current = {
            ...(askedRef.current || {}),
            customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
          };
          setAskedTick((t) => t + 1);
          afterManualTrick(completedRoundIdx);
        }, 900);
      } else {
        setFeedback({ type: "error", text: "Not quite — try again." });
      }
    }
  };

  const submitPlayDecision = (choiceId) => {
    const promptId = activeCustomPrompt?.id;
    if (!promptId) return;
    const expectedChoice = activeCustomPrompt?.expectedChoice;
    const reveal = activeCustomPrompt?.revealText || "Thanks — let’s continue.";
    const endHandAfter = !!activeCustomPrompt?.endHandAfterReveal;

    if (expectedChoice) {
      const correct = String(choiceId) === String(expectedChoice);
      if (!correct) {
        const shouldReveal = revealAfterTwoWrong("playDecision");
        if (shouldReveal) {
          const goodTry = activeCustomPrompt?.wrongTryText ? "Good try! " : "";
          const text = `${goodTry}The correct answer is ${expectedChoice}. ${reveal}`;
          // Mark asked now (since there may be no Continue button).
          askedRef.current = {
            ...(askedRef.current || {}),
            customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
          };
          setAskedTick((t) => t + 1);
          setFeedback(null);
          if (endHandAfter) {
            setDoneExtraText(text);
            setPromptStep("DONE"); // also reveals all hands
            return;
          }
          // Teaching reveal is shown in the PLAY_DECISION_REVEAL panel; avoid duplicating it in the feedback banner.
          setPlayDecisionReveal({ text, promptId, roundIdx: completedRoundIdx });
          setPromptStep("PLAY_DECISION_REVEAL");
        } else {
          const wrongText = activeCustomPrompt?.wrongTryText || "Not quite — try again.";
          setFeedback({ type: "error", text: wrongText });
        }
        return;
      }
    }

    // Either ungraded or correct.
    // Teaching reveal is shown in the PLAY_DECISION_REVEAL panel; show congratulations when correct.
    setFeedback(null);
    askedRef.current = {
      ...(askedRef.current || {}),
      customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
    };
    setAskedTick((t) => t + 1);
    if (endHandAfter) {
      setDoneExtraText(reveal);
      setPromptStep("DONE"); // also reveals all hands
      return;
    }
    setPlayDecisionReveal({ text: reveal, promptId, roundIdx: completedRoundIdx, correct: !!expectedChoice });
    setPromptStep("PLAY_DECISION_REVEAL");
  };

  const submitDistributionNeed = () => {
    const promptId = activeCustomPrompt?.id;
    if (!promptId) return;
    const fixed = activeCustomPrompt?.fixed || {};
    const need = Array.isArray(activeCustomPrompt?.defendersNeed) ? activeCustomPrompt.defendersNeed : [4, 3];
    const a = Number(distributionInput.LHO);
    const b = Number(distributionInput.RHO);
    const fixedOk =
      (fixed?.DUMMY === undefined || Number(distributionInput.DUMMY) === Number(fixed.DUMMY)) &&
      (fixed?.DECLARER === undefined || Number(distributionInput.DECLARER) === Number(fixed.DECLARER));
    const correct =
      fixedOk &&
      Number.isFinite(a) &&
      Number.isFinite(b) &&
      String(distributionInput.LHO).trim() !== "" &&
      String(distributionInput.RHO).trim() !== "" &&
      ((a === need[0] && b === need[1]) || (a === need[1] && b === need[0]));

    if (correct) {
      setFeedback({ type: "ok", text: "Well done — that's correct!" });
      setQueuedTimeout(() => {
        setFeedback(null);
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        continueFromRound(completedRoundIdx);
      }, 650);
      return;
    }

    const shouldReveal = revealAfterTwoWrong("distributionNeed");
    if (shouldReveal) {
      setFeedback({ type: "ok", text: `The correct answer is ${need[0]}-${need[1]} (in either order).` });
      setQueuedTimeout(() => {
        setFeedback(null);
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        continueFromRound(completedRoundIdx);
      }, 1100);
    } else {
      setFeedback({ type: "error", text: "Not quite — try again." });
    }
  };

  const continueFromRound = (idx) => {
    if (!Number.isFinite(idx) || idx < 0) {
      const next = getNextCustomPrompt(-1);
      if (next) {
        setActiveCustomPrompt(next);
        setPromptStep(next.type);
        return;
      }
      // No more pre-trick prompts: show Trick 1.
      if (lastRoundIdx < 0) {
        setPromptStep("DONE");
        return;
      }
      playSegment(0, 0, () => {
        setCompletedRoundIdx(0);
        afterManualTrick(0);
      });
      return;
    }
    afterManualTrick(idx);
  };

  const submitInfoPrompt = () => {
    const promptId = activeCustomPrompt?.id;
    if (activeCustomPrompt?.setDoneExtraText && activeCustomPrompt?.promptText) {
      setDoneExtraText(activeCustomPrompt.promptText);
    }
    if (!promptId) {
      setPromptStep(null);
      continueFromRound(completedRoundIdx);
      return;
    }
    askedRef.current = {
      ...(askedRef.current || {}),
      customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
    };
    setAskedTick((t) => t + 1);
    setPromptStep(null);
    continueFromRound(completedRoundIdx);
  };

  const continueAfterPlayDecision = () => {
    const promptId = playDecisionReveal?.promptId;
    const roundIdxToContinue = Number.isFinite(playDecisionReveal?.roundIdx) ? playDecisionReveal.roundIdx : completedRoundIdx;
    if (!promptId) return;
    setFeedback(null);
    setPlayDecisionReveal(null);
    askedRef.current = {
      ...(askedRef.current || {}),
      customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
    };
    setAskedTick((t) => t + 1);
    // In manual mode: re-run prompts for this round; if another prompt (e.g. next question) exists, show it without playing the next trick.
    if (manualTrickMode) {
      setPromptStep(null);
      const computed = afterManualTrick(roundIdxToContinue);
      if (computed.prompts[0]) {
        return;
      }
      const next = roundIdxToContinue + 1;
      if (next <= lastRoundIdx) playOneTrick(next);
      else setPromptStep("DONE");
      return;
    }
    continueFromRound(roundIdxToContinue);
  };

  const focusNextShapeNoWrap = (suit) => {
    const order = ["S", "H", "D", "C"];
    const idx = order.indexOf(suit);
    if (idx === -1 || idx === order.length - 1) return;
    const next = order[idx + 1];
    seatShapeRefs[next]?.current?.focus?.();
    seatShapeRefs[next]?.current?.select?.();
  };

  const submitSeatShape = () => {
    if (!seatShapeExpected) {
      setPromptStep("DONE");
      return;
    }
    const parsed = {
      S: Number(seatShapeInput.S),
      H: Number(seatShapeInput.H),
      D: Number(seatShapeInput.D),
      C: Number(seatShapeInput.C),
    };
    const allFilled = ["S", "H", "D", "C"].every((s) => String(seatShapeInput[s]).trim() !== "");
    const correct =
      allFilled &&
      ["S", "H", "D", "C"].every((s) => Number.isFinite(parsed[s])) &&
      parsed.S === seatShapeExpected.S &&
      parsed.H === seatShapeExpected.H &&
      parsed.D === seatShapeExpected.D &&
      parsed.C === seatShapeExpected.C;

    if (correct) {
      setFeedback({ type: "ok", text: "Well done — that’s correct!" });
      setQueuedTimeout(() => {
        setFeedback(null);
        if (seatShapeTarget) {
          askedRef.current = {
            ...(askedRef.current || {}),
            seatShapeAsked: { ...((askedRef.current && askedRef.current.seatShapeAsked) || {}), [seatShapeTarget]: true },
          };
          setAskedTick((t) => t + 1);
        }
        if (activeCustomPrompt?.type === "SEAT_SHAPE" && activeCustomPrompt?.id) {
          askedRef.current = {
            ...(askedRef.current || {}),
            customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [activeCustomPrompt.id]: true },
          };
          setAskedTick((t) => t + 1);
          afterManualTrick(completedRoundIdx);
          return;
        }
        // If another seat's shape is already knowable at this same point, ask it next.
        const ctxRound = manualTrickMode ? completedRoundIdx : activePauseRoundIdx;
        const computed = manualTrickMode ? computePostPromptsForRound(ctxRound) : computePostPromptsForPause(pauseIdx);
        if (computed.prompts.includes("SEAT_SHAPE") && computed.shapeSeat && computed.shapeSeat !== seatShapeTarget) {
          setCurrentPostPrompts(computed.prompts);
          setPostPromptIdx(0);
          setShapeSeat(computed.shapeSeat);
          setPromptStep("SEAT_SHAPE");
          return;
        }
        if (manualTrickMode && completedRoundIdx >= lastRoundIdx) setPromptStep("DONE");
        advancePostPrompt();
      }, 450);
    } else {
      const shouldReveal = revealAfterTwoWrong("seatShape");
      if (shouldReveal) {
        setFeedback({
          type: "ok",
          text: `The correct answer is ${seatShapeExpected.S}${seatShapeExpected.H}${seatShapeExpected.D}${seatShapeExpected.C}.`,
        });
        setQueuedTimeout(() => {
          setFeedback(null);
          if (seatShapeTarget) {
            askedRef.current = {
              ...(askedRef.current || {}),
              seatShapeAsked: { ...((askedRef.current && askedRef.current.seatShapeAsked) || {}), [seatShapeTarget]: true },
            };
            setAskedTick((t) => t + 1);
          }
          if (activeCustomPrompt?.type === "SEAT_SHAPE" && activeCustomPrompt?.id) {
            askedRef.current = {
              ...(askedRef.current || {}),
              customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [activeCustomPrompt.id]: true },
            };
            setAskedTick((t) => t + 1);
            afterManualTrick(completedRoundIdx);
            return;
          }
          const ctxRound = manualTrickMode ? completedRoundIdx : activePauseRoundIdx;
          const computed = manualTrickMode ? computePostPromptsForRound(ctxRound) : computePostPromptsForPause(pauseIdx);
          if (computed.prompts.includes("SEAT_SHAPE") && computed.shapeSeat && computed.shapeSeat !== seatShapeTarget) {
            setCurrentPostPrompts(computed.prompts);
            setPostPromptIdx(0);
            setShapeSeat(computed.shapeSeat);
            setPromptStep("SEAT_SHAPE");
            return;
          }
          if (manualTrickMode && completedRoundIdx >= lastRoundIdx) setPromptStep("DONE");
          advancePostPrompt();
        }, 1400);
      } else {
        setFeedback({
          type: "error",
          text: allFilled ? "Not quite — try again." : "Please enter all 4 numbers, then try again.",
        });
      }
    }
  };

  const setDistSeatDigit = (seat, rawValue) => {
    const raw = String(rawValue ?? "");
    const cleaned = raw.replace(/[^0-9]/g, "").slice(-1); // single digit only
    if (cleaned === "") {
      setDistributionInput((prev) => ({ ...prev, [seat]: "" }));
      return "";
    }
    const n = Math.max(0, Math.min(9, Number(cleaned)));
    const out = String(n);
    setDistributionInput((prev) => ({ ...prev, [seat]: out }));
    return out;
  };

  const focusNextSeatNoWrap = (seat) => {
    const idx = distSeatOrder.indexOf(seat);
    if (idx === -1 || idx === distSeatOrder.length - 1) return;
    const next = distSeatOrder[idx + 1];
    distributionRefs[next]?.current?.focus?.();
    distributionRefs[next]?.current?.select?.();
  };

  const distributionRefs = {
    LHO: useRef(null),
    DUMMY: useRef(null),
    RHO: useRef(null),
    DECLARER: useRef(null),
  };

  const focusNextSeat = (seat) => focusNextSeatNoWrap(seat);

  const nextHand = () => {
    const next = (puzzleIdxInDifficulty + 1) % Math.max(1, puzzlesForDifficultyAll.length);
    setPuzzleIdxInDifficulty(next);
  };

  // Autoplace cursor on LHO when distribution prompt opens.
  useEffect(() => {
    if (promptStep === "DISTRIBUTION") {
      const t = setTimeout(() => {
        // If we are asking distribution for a new suit, clear any previous entries.
        const suit = distributionSuit || showOutLedSuit;
        if (distributionSuitKey !== suit) {
          const prefill = puzzle?.promptOptions?.distributionPrefill;
          const fixed =
            prefill && prefill.suit === suit && prefill.fixed
              ? prefill.fixed
              : null;
          const lock = !!prefill?.lock && prefill?.suit === suit;
          const isLocked = (seat) => lock && fixed?.[seat] !== undefined;
          setDistributionInput({
            LHO: fixed?.LHO !== undefined ? String(fixed.LHO) : "",
            DUMMY: fixed?.DUMMY !== undefined ? String(fixed.DUMMY) : "",
            RHO: fixed?.RHO !== undefined ? String(fixed.RHO) : "",
            DECLARER: fixed?.DECLARER !== undefined ? String(fixed.DECLARER) : "",
          });
          setDistributionSuitKey(suit);
          // Focus the first editable box (skip any locked/prefilled seats).
          const firstEditable = (distSeatOrder || []).find((s) => !isLocked(s)) || distSeatOrder[0] || "LHO";
          distributionRefs[firstEditable]?.current?.focus?.();
          distributionRefs[firstEditable]?.current?.select?.();
          return;
        }
        // Same suit: just focus the first editable box.
        const prefill = puzzle?.promptOptions?.distributionPrefill;
        const fixed =
          prefill && prefill.suit === suit && prefill.fixed
            ? prefill.fixed
            : null;
        const lock = !!prefill?.lock && prefill?.suit === suit;
        const isLocked = (seat) => lock && fixed?.[seat] !== undefined;
        const firstEditable = (distSeatOrder || []).find((s) => !isLocked(s)) || distSeatOrder[0] || "LHO";
        distributionRefs[firstEditable]?.current?.focus?.();
        distributionRefs[firstEditable]?.current?.select?.();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [promptStep, distributionSuit, distributionSuitKey, distSeatOrder, showOutLedSuit, puzzle?.promptOptions?.distributionPrefill]);

  useEffect(() => {
    if (promptStep === "DISTRIBUTION_GUESS" || promptStep === "DISTRIBUTION_NEED") {
      const t = setTimeout(() => {
        const isCustomGuess =
          (activeCustomPrompt?.type === "DISTRIBUTION_GUESS" || activeCustomPrompt?.type === "DISTRIBUTION_NEED") &&
          !!activeCustomPrompt?.id;
        const key = isCustomGuess ? `customGuess:${activeCustomPrompt.id}` : `preGuess:${puzzle.id}`;
        if (distributionSuitKey !== key) {
          const fixed = isCustomGuess
            ? (activeCustomPrompt?.fixed || {})
            : (puzzle?.promptOptions?.preDistributionGuess?.fixed || {});
          setDistributionInput({
            LHO: fixed?.LHO !== undefined ? String(fixed.LHO) : "",
            DUMMY: fixed?.DUMMY !== undefined ? String(fixed.DUMMY) : "",
            RHO: fixed?.RHO !== undefined ? String(fixed.RHO) : "",
            DECLARER: fixed?.DECLARER !== undefined ? String(fixed.DECLARER) : "",
          });
          setDistributionSuitKey(key);
        }
        const fixed =
          isCustomGuess
            ? (activeCustomPrompt?.fixed || {})
            : (puzzle?.promptOptions?.preDistributionGuess?.fixed || {});
        const isLocked = (seat) => fixed?.[seat] !== undefined;
        const firstEditable = (distSeatOrder || []).find((s) => !isLocked(s)) || distSeatOrder[0] || "LHO";
        distributionRefs[firstEditable]?.current?.focus?.();
        distributionRefs[firstEditable]?.current?.select?.();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [promptStep, distSeatOrder, activeCustomPrompt, distributionSuitKey, puzzle.id, puzzle?.promptOptions?.preDistributionGuess]);

  // Autoplace cursor on S when shape prompt opens.
  useEffect(() => {
    if (promptStep === "SEAT_SHAPE") {
      const t = setTimeout(() => {
        // If we are asking shape for a new seat, clear any previous entries.
        if (seatShapeSeatKey !== seatShapeTarget) {
          const fixedSuitCounts =
            (activeCustomPrompt?.type === "SEAT_SHAPE" && activeCustomPrompt?.fixedSuitCounts) || null;
          setSeatShapeInput({
            S: fixedSuitCounts?.S !== undefined ? String(fixedSuitCounts.S) : "",
            H: fixedSuitCounts?.H !== undefined ? String(fixedSuitCounts.H) : "",
            D: fixedSuitCounts?.D !== undefined ? String(fixedSuitCounts.D) : "",
            C: fixedSuitCounts?.C !== undefined ? String(fixedSuitCounts.C) : "",
          });
          setSeatShapeSeatKey(seatShapeTarget);
          setFeedback(null);
        }
        if (askedSuitCount >= 3 && !shapeIntroSeatKey) setShapeIntroSeatKey(seatShapeTarget);
        const fixedSuitCounts = (activeCustomPrompt?.type === "SEAT_SHAPE" && activeCustomPrompt?.fixedSuitCounts) || null;
        const isLocked = (s) => fixedSuitCounts?.[s] !== undefined;
        const firstEditable = ["S", "H", "D", "C"].find((s) => !isLocked(s)) || "S";
        seatShapeRefs[firstEditable]?.current?.focus?.();
        seatShapeRefs[firstEditable]?.current?.select?.();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [promptStep, seatShapeSeatKey, seatShapeTarget, askedSuitCount, shapeIntroSeatKey, activeCustomPrompt]);

  // Make the single number tile always typeable (even though the input is visually hidden).
  useEffect(() => {
    if (promptStep === "DEFENDERS_STARTED" || promptStep === "DEFENDERS_REMAINING") {
      const t = setTimeout(() => {
        defendersSingleInputRef.current?.focus?.();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [promptStep]);

  useEffect(() => {
    if (promptStep === "DECLARER_TRUMP_GUESS") {
      const t = setTimeout(() => {
        declarerTrumpGuessRef.current?.focus?.();
        declarerTrumpGuessRef.current?.select?.();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [promptStep]);

  useEffect(() => {
    if (promptStep === "SEAT_SUIT_COUNT") {
      const t = setTimeout(() => {
        if (seatSuitCountKey !== activeCustomPrompt?.id) {
          setSeatSuitCountInput("");
          setSeatSuitCountKey(activeCustomPrompt?.id || null);
          setFeedback(null);
        }
        seatSuitCountRef.current?.focus?.();
        seatSuitCountRef.current?.select?.();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [promptStep, seatSuitCountKey, activeCustomPrompt]);

  useEffect(() => {
    if (promptStep === "SINGLE_NUMBER") {
      const t = setTimeout(() => {
        setSingleNumberInput("");
        setFeedback(null);
        singleNumberRef.current?.focus?.();
        singleNumberRef.current?.select?.();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [promptStep]);

  // When we reveal all cards at the end, show the original deal for ALL hands (unless puzzle asks to preserve end state).
  useEffect(() => {
    if (promptStep !== "DONE") return;
    if (puzzle.preserveEndStateAtDone) return;
    setPlayedFromHand({ LHO: {}, DUMMY: {}, RHO: {}, DECLARER: {} });
    setRemainingHands(buildInitialRemainingHands(puzzle));
  }, [promptStep, puzzle]);

  // When a play-decision question appears, scroll it into view so the user notices.
  useEffect(() => {
    if (promptStep !== "PLAY_DECISION") return;
    const el = playDecisionQuestionRef.current;
    if (el) {
      const t = setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [promptStep]);

  const clearFeedback = () => setFeedback(null);

  const isDeclarerSide = viewerSeat === "DECLARER" || viewerSeat === "DUMMY";
  const viewerIsDeclarer = viewerSeat === "DECLARER";
  const viewerIsDefender = viewerSeat === "LHO" || viewerSeat === "RHO";
  const defenderPartnerSeat = viewerSeat === "LHO" ? "RHO" : viewerSeat === "RHO" ? "LHO" : null;
  const isPrePlayInManual = manualTrickMode && completedRoundIdx < 0;

  const roleLabelForSeat = (seat) => {
    // Required label sets:
    // - Viewer is declarer: You, LHO, RHO, Dummy
    // - Viewer is defender: You, Partner, Declarer, Dummy
    if (seat === viewerSeat) return "You";

    if (viewerIsDeclarer) {
      if (seat === "DUMMY") return "Dummy";
      if (puzzle?.promptOptions?.hideOpponentLabels && (seat === "LHO" || seat === "RHO")) return "";
      if (seat === "LHO") return "LHO";
      if (seat === "RHO") return "RHO";
      return "Declarer";
    }

    if (viewerIsDefender) {
      if (seat === "DECLARER") return "Declarer";
      if (seat === "DUMMY") return "Dummy";
      if (seat === defenderPartnerSeat) return "Partner";
      return "Defender";
    }

    // Fallback (e.g. viewer is dummy): keep it unambiguous.
    if (seat === "DECLARER") return "Declarer";
    if (seat === "DUMMY") return "Dummy";
    return seat;
  };

  const auctionGrid = useMemo(() => {
    if (!auctionText) return null;
    return buildAuctionGrid({ auctionText, dealerCompass });
  }, [auctionText, dealerCompass]);
  const promptPlacement = useMemo(() => {
    const pref = puzzle.promptOptions?.promptPlacement;
    if (pref === "left" || pref === "right" || pref === "bottom") return pref;

    // Auto: if a full hand is visible on the right (common in defender POV: "You"),
    // and the left seat is hidden (often "Partner"), use that empty space for prompts
    // so we don't force vertical scrolling with a bottom prompt.
    const rightSeatHasHand = showFullHands && visibleFullHandSeats.includes(seatRight);
    const leftSeatHidden = showFullHands && !visibleFullHandSeats.includes(seatLeft);
    if (rightSeatHasHand && leftSeatHidden) return "left";

    // Auto: if a full hand is visible on the right (common in defender POV: "You"),
    // don't cram the prompt there or force it to the left; put it under the table.
    if (rightSeatHasHand) return "bottom";

    // Otherwise, default to the right.
    return "right";
  }, [puzzle.promptOptions?.promptPlacement, showFullHands, seatRight, seatLeft, visibleFullHandSeats]);

  // When full hands, put prompt in left column so South stays visible (no prompt below table pushing it off).
  const useBottomRowLayout = !!showFullHands;

  const showHeaderRail = promptStep !== "DONE";
  const hideAuctionNow =
    !!puzzle?.promptOptions?.hideAuction ||
    (promptStep === "DONE" && !!puzzle?.promptOptions?.hideAuctionOnDone) ||
    promptStep === "PLAY_DECISION_REVEAL";

  const promptNode = (
    <>
      {showHeaderRail && (
        <div className="ct-railMuted">
          {!isMember && (
            <div className="ct-paywallNote" aria-label="Members only notice">
              Preview mode: you can try <strong>1 problem per difficulty</strong>. Members get full access to {trainerLabel}.
              <span className="ct-paywallActions">
                <Link to="/membership" className="ct-paywallLink">
                  Subscribe to unlock
                </Link>
              </span>
            </div>
          )}
          {contractText ? (
            <div className="ct-contractLine">
              Contract is <strong><ContractWithColoredSuit text={contractText} /></strong> by <strong>{declarerCompassName}</strong>
            </div>
          ) : null}
          {auctionGrid && !hideAuctionNow && (
            <div className="ct-auctionCard" aria-label="Bidding">
              <div className="ct-auctionTitle">Bidding</div>
              <div className="ct-auctionGrid" role="table" aria-label="Auction grid">
                <div className="ct-auctionHead" role="row">
                  {auctionGrid.order.map((seat) => (
                    <div key={`h-${seat}`} className="ct-auctionCell ct-auctionCell--head" role="columnheader">
                      {seatCompassLabel(seat)}
                    </div>
                  ))}
                </div>
                {auctionGrid.rows.map((row, idx) => (
                  <div key={`r-${idx}`} className="ct-auctionRow" role="row">
                    {auctionGrid.order.map((seat) => {
                      const c = row[seat];
                      return (
                        <div key={`c-${idx}-${seat}`} className="ct-auctionCell" role="cell">
                          {c ? (
                            <span className={`ct-auctionCall ct-auctionCall--${c.kind}`}>
                              <span className="ct-auctionCallText">{c.text}</span>
                              {c.suitSym ? (
                                <span className={`ct-auctionSuit ${c.isRed ? "ct-auctionSuit--red" : "ct-auctionSuit--black"}`}>
                                  {c.suitSym}
                                </span>
                              ) : null}
                            </span>
                          ) : (
                            <span className="ct-auctionEmpty" aria-hidden="true">
                              &nbsp;
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="ct-roleLine">You are <strong>{isDeclarerSide ? "declaring" : "defending"}</strong>.</div>
        </div>
      )}

      {/* Start button is shown as a large overlay on the table (clearer than a small corner button). */}

      {hasStarted && !promptStep && (
        <div className="ct-watchNote">
          {completedRoundIdx >= lastRoundIdx
            ? "Well done — hand complete."
            : (puzzle?.promptOptions?.watchNote || "Watch the play, then answer.") +
              (manualTrickMode && lastRoundIdx >= 0 && completedRoundIdx < lastRoundIdx ? " Click Next →" : "")}
        </div>
      )}

      {promptStep && promptStep !== "DONE" && (
        <div className="ct-promptRail">
          {promptStep === "DECLARER_TRUMP_GUESS" && (
            <>
              <div className="ct-questionText">
                {(activeCustomPrompt?.type === "DECLARER_TRUMP_GUESS" && activeCustomPrompt?.promptText) ||
                  "How many trumps does Declarer have? (best guess — no wrong answers)"}
              </div>

              <div className="ct-railAnswer">
                <div
                  className="ct-numBox ct-numBox--single"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    declarerTrumpGuessRef.current?.focus?.({ preventScroll: true });
                    declarerTrumpGuessRef.current?.select?.();
                  }}
                >
                  <div className="ct-numBoxValue ct-numBoxValue--single" aria-hidden="true">
                    {declarerTrumpGuessInput}
                  </div>
                  <input
                    ref={declarerTrumpGuessRef}
                    className="ct-numBoxInput ct-numBoxInput--hidden"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    aria-label="Best guess: declarer starting trumps"
                    value={declarerTrumpGuessInput}
                    onChange={(e) => {
                      const raw = String(e.target.value ?? "");
                      const cleaned = raw.replace(/[^0-9]/g, "").slice(0, 2);
                      if (cleaned === "") {
                        setDeclarerTrumpGuessInput("");
                        return;
                      }
                      const n = Math.max(0, Math.min(13, Number(cleaned)));
                      setDeclarerTrumpGuessInput(String(n));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        submitDeclarerTrumpGuess();
                      }
                    }}
                    disabled={isPlaying}
                  />
                </div>
                <button className="ct-btn" onClick={submitDeclarerTrumpGuess} disabled={isPlaying}>
                  Enter
                </button>
              </div>

              <div className="ct-railActions">
                {feedback?.type === "error" && (
                  <button className="ct-btn ct-btn--secondary" onClick={clearFeedback}>
                    OK
                  </button>
                )}
              </div>
            </>
          )}

          {promptStep === "INFO" && (
            <>
              <div className="ct-questionText">{activeCustomPrompt?.promptText || "Continue."}</div>
              <div className="ct-railActions" style={{ marginTop: 12 }}>
                <button className="ct-btn" onClick={submitInfoPrompt} disabled={isPlaying}>
                  Continue
                </button>
              </div>
            </>
          )}

          {promptStep === "SEAT_SUIT_COUNT" && (
            <>
              <div className="ct-questionText">{activeCustomPrompt?.promptText || "How many cards did declarer start with in this suit?"}</div>

              <div className="ct-railAnswer" style={activeCustomPrompt?.leftValue != null ? { display: "flex", alignItems: "center", gap: 8 } : undefined}>
                {activeCustomPrompt?.leftValue != null && (
                  <>
                    <div className="ct-numBox ct-numBox--single ct-numBox--locked">
                      <div className="ct-numBoxValue ct-numBoxValue--single" aria-hidden="true">
                        {activeCustomPrompt.leftValue}
                      </div>
                    </div>
                    <span aria-hidden="true">–</span>
                  </>
                )}
                <div
                  className="ct-numBox ct-numBox--single"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    seatSuitCountRef.current?.focus?.({ preventScroll: true });
                    seatSuitCountRef.current?.select?.();
                  }}
                >
                  <div className="ct-numBoxValue ct-numBoxValue--single" aria-hidden="true">
                    {seatSuitCountInput}
                  </div>
                  <input
                    ref={seatSuitCountRef}
                    className="ct-numBoxInput ct-numBoxInput--hidden"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    aria-label="Suit count answer"
                    value={seatSuitCountInput}
                    onChange={(e) => {
                      const raw = String(e.target.value ?? "");
                      const cleaned = raw.replace(/[^0-9]/g, "").slice(0, 1);
                      setSeatSuitCountInput(cleaned);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        submitSeatSuitCount();
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    disabled={isPlaying}
                  />
                </div>
                <button className="ct-btn" onClick={submitSeatSuitCount} disabled={isPlaying}>
                  Enter
                </button>
              </div>

              <div className="ct-railActions">
                {feedback?.type === "error" && (
                  <button className="ct-btn ct-btn--secondary" onClick={clearFeedback}>
                    Try again
                  </button>
                )}
              </div>
            </>
          )}

          {promptStep === "SINGLE_NUMBER" && (
            <>
              <div className="ct-questionText">{activeCustomPrompt?.promptText || "Enter the number."}</div>
              <div className="ct-railAnswer" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  className="ct-numBox ct-numBox--single"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    singleNumberRef.current?.focus?.({ preventScroll: true });
                    singleNumberRef.current?.select?.();
                  }}
                >
                  <div className="ct-numBoxValue ct-numBoxValue--single" aria-hidden="true">
                    {singleNumberInput}
                  </div>
                  <input
                    ref={singleNumberRef}
                    className="ct-numBoxInput ct-numBoxInput--hidden"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    aria-label="Number answer"
                    value={singleNumberInput}
                    onChange={(e) => {
                      const raw = String(e.target.value ?? "");
                      const cleaned = raw.replace(/[^0-9]/g, "").slice(0, 2);
                      setSingleNumberInput(cleaned);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        submitSingleNumber();
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    disabled={isPlaying}
                  />
                </div>
                <button className="ct-btn" onClick={submitSingleNumber} disabled={isPlaying}>
                  Enter
                </button>
              </div>
              <div className="ct-railActions">
                {feedback?.type === "error" && (
                  <button className="ct-btn ct-btn--secondary" onClick={clearFeedback}>
                    Try again
                  </button>
                )}
              </div>
            </>
          )}

          {promptStep === "PLAY_DECISION" && (
            <div ref={playDecisionQuestionRef} className="ct-playDecisionBlock" role="region" aria-label="Question">
              <div className="ct-playDecisionBlock-heading">Your turn — answer below</div>
              <div className="ct-questionText ct-playDecisionBlock-question">{activeCustomPrompt?.promptText || "What’s your play?"}</div>
              <div className="ct-railActions" style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {(activeCustomPrompt?.options || []).map((o) => (
                  <button key={o.id} className="ct-btn" onClick={() => submitPlayDecision(o.id)} disabled={isPlaying}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {promptStep === "PLAY_DECISION_REVEAL" && (
            <>
              {!!playDecisionReveal?.text && (
                <div className="ct-playRevealWrap">
                  {playDecisionReveal?.correct && (
                    <strong className="ct-feedback ct-feedback--ok ct-revealSuccess">Well done — that&apos;s correct!</strong>
                  )}
                  <FormattedRevealText text={playDecisionReveal.text} className="ct-playRevealText" />
                </div>
              )}
              {!!activeCustomPrompt?.motivationText && (
                <p className="ct-revealMotivation">{activeCustomPrompt.motivationText}</p>
              )}
              {!activeCustomPrompt?.noContinue && (
                <div className="ct-railActions" style={{ marginTop: 12 }}>
                  <button className="ct-btn" onClick={continueAfterPlayDecision} disabled={isPlaying}>
                    {manualTrickMode && completedRoundIdx < lastRoundIdx ? "Next →" : "Continue"}
                  </button>
                </div>
              )}
            </>
          )}

          {(promptStep === "DEFENDERS_STARTED" || promptStep === "DEFENDERS_REMAINING" || promptStep === "DEFENDERS_HEARTS_STARTED") && (
            <>
              <div className="ct-questionText">
                {promptStep === "DEFENDERS_HEARTS_STARTED"
                  ? (puzzle?.promptOptions?.defendersHeartsStartedPromptText || "How many hearts did the defenders start with?")
                  : promptStep === "DEFENDERS_STARTED"
                    ? (puzzle?.promptOptions?.defendersStartedPromptText ||
                        (isDeclarerSide
                          ? isPrePlayInManual
                            ? "How many trumps do the defenders have?"
                            : "How many trumps did the defenders start with?"
                          : "How many trumps did declarer start with?"))
                    : (puzzle?.promptOptions?.defendersRemainingPromptText ||
                        (isDeclarerSide ? "How many trumps do the defenders still hold?" : "How many trumps does declarer have left?"))}
              </div>

              <div className="ct-railAnswer">
                <div
                  className="ct-numBox ct-numBox--single"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    defendersSingleInputRef.current?.focus?.({ preventScroll: true });
                  }}
                >
                  <div className="ct-numBoxValue ct-numBoxValue--single" aria-hidden="true">
                    {promptStep === "DEFENDERS_HEARTS_STARTED" ? defendersHeartsStartedInput : promptStep === "DEFENDERS_STARTED" ? defendersStartedInput : defendersRemainingInput}
                  </div>
                  <input
                    ref={defendersSingleInputRef}
                    className="ct-numBoxInput ct-numBoxInput--hidden"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    aria-label={
                      promptStep === "DEFENDERS_HEARTS_STARTED"
                        ? "Defenders starting hearts total"
                        : promptStep === "DEFENDERS_STARTED"
                          ? "Defenders starting trumps total"
                          : "Defenders trumps still held"
                    }
                    value={promptStep === "DEFENDERS_HEARTS_STARTED" ? defendersHeartsStartedInput : promptStep === "DEFENDERS_STARTED" ? defendersStartedInput : defendersRemainingInput}
                    onChange={(e) => {
                      const raw = String(e.target.value ?? "");
                      const cleaned = raw.replace(/[^0-9]/g, "").slice(0, 1);
                      const n = cleaned === "" ? "" : String(Math.max(0, Math.min(9, Number(cleaned))));
                      if (promptStep === "DEFENDERS_HEARTS_STARTED") setDefendersHeartsStartedInput(n);
                      else if (promptStep === "DEFENDERS_STARTED") setDefendersStartedInput(n);
                      else setDefendersRemainingInput(n);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (promptStep === "DEFENDERS_HEARTS_STARTED") submitDefendersHeartsStarted();
                        else if (promptStep === "DEFENDERS_STARTED") submitDefendersStarted();
                        else submitDefendersRemaining();
                      }
                    }}
                    disabled={isPlaying}
                  />
                </div>
                <button
                  className="ct-btn"
                  onClick={promptStep === "DEFENDERS_HEARTS_STARTED" ? submitDefendersHeartsStarted : promptStep === "DEFENDERS_STARTED" ? submitDefendersStarted : submitDefendersRemaining}
                  disabled={isPlaying}
                >
                  Enter
                </button>
              </div>

              <div className="ct-railActions">
                {feedback?.type === "error" && (
                  <button className="ct-btn ct-btn--secondary" onClick={clearFeedback}>
                    Try again
                  </button>
                )}
              </div>
            </>
          )}

          {promptStep === "DISTRIBUTION" && (
            <>
              {(() => {
                const suit = distributionSuit || showOutLedSuit;
                const suitName = SUIT_NAME[suit] || suit;
                const isTrumpSuit = suit === puzzle.trumpSuit;
                const overrideText = puzzle?.promptOptions?.distributionPromptText;
                if (overrideText) {
                  return <div className="ct-questionText">{overrideText}</div>;
                }
                return (
              <div className="ct-questionText">
                {isTrumpSuit && !puzzle?.promptOptions?.distributionPromptAsSuit
                  ? "What was the original trump distribution?"
                  : `What was the original ${suitName} distribution?`}
              </div>
                );
              })()}

              <div className="ct-distRow ct-distRow--numBoxes" role="group" aria-label="Distribution inputs">
                {(() => {
                  const suit = distributionSuit || showOutLedSuit;
                  const prefill = puzzle?.promptOptions?.distributionPrefill;
                  const fixed =
                    prefill && prefill.suit === suit && prefill.fixed ? prefill.fixed : {};
                  const lock = !!prefill?.lock && prefill?.suit === suit;
                  const isLocked = (seat) => lock && fixed?.[seat] !== undefined;
                  return distSeatOrder.map((seat, idx) => (
                  <div key={seat} className="ct-distSeat" data-position={["left", "top", "right", "bottom"][idx]}>
                    <div className="ct-distLabel">{roleLabelForSeat(seat)}</div>
                    <div
                      className={`ct-numBox ct-numBox--dist ${isLocked(seat) ? "ct-numBox--locked" : ""}`}
                      onMouseDown={(e) => {
                        if (isLocked(seat)) return;
                        e.preventDefault();
                        distributionRefs[seat]?.current?.focus?.({ preventScroll: true });
                        distributionRefs[seat]?.current?.select?.();
                      }}
                      title={isLocked(seat) ? "Prefilled for this exercise" : undefined}
                    >
                      <div className="ct-numBoxValue ct-numBoxValue--dist" aria-hidden="true">
                        {distributionInput[seat]}
                      </div>
                      <input
                        ref={distributionRefs[seat]}
                        className="ct-numBoxInput ct-numBoxInput--hidden"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        aria-label={`${roleLabelForSeat(seat)} original ${(SUIT_NAME[distributionSuit || showOutLedSuit] || (distributionSuit || showOutLedSuit))} count`}
                        value={distributionInput[seat]}
                        onChange={(e) => {
                          if (isLocked(seat)) return;
                          const v = setDistSeatDigit(seat, e.target.value);
                          if (!v) return;
                          if (seat === distSeatOrder[distSeatOrder.length - 1]) e.target.blur();
                          else focusNextSeatNoWrap(seat);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (seat === distSeatOrder[distSeatOrder.length - 1]) submitDistribution();
                            else focusNextSeatNoWrap(seat);
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                        onBlur={clearFeedback}
                        disabled={isPlaying || isLocked(seat)}
                      />
                    </div>
                  </div>
                  ));
                })()}
              </div>

              <div className="ct-railActions">
                <button className="ct-btn" onClick={submitDistribution} disabled={isPlaying}>
                  Enter
                </button>
                {feedback?.type === "error" && (
                  <button className="ct-btn ct-btn--secondary" onClick={clearFeedback}>
                    Try again
                  </button>
                )}
              </div>

            </>
          )}

          {promptStep === "DISTRIBUTION_GUESS" && (
            <>
              <div className="ct-questionText">
                {((activeCustomPrompt?.type === "DISTRIBUTION_GUESS" && activeCustomPrompt?.promptText) ? activeCustomPrompt.promptText : null) ||
                  puzzle?.promptOptions?.preDistributionGuess?.promptText ||
                  "What do you think the original distribution is?"}
              </div>

              <div className="ct-distRow ct-distRow--numBoxes" role="group" aria-label="Distribution guess inputs">
                {(() => {
                  const fixed =
                    (activeCustomPrompt?.type === "DISTRIBUTION_GUESS" && activeCustomPrompt?.fixed) ||
                    puzzle?.promptOptions?.preDistributionGuess?.fixed ||
                    {};
                  const isLocked = (seat) => fixed?.[seat] !== undefined;
                  return distSeatOrder.map((seat, idx) => (
                    <div key={seat} className="ct-distSeat" data-position={["left", "top", "right", "bottom"][idx]}>
                      <div className="ct-distLabel">{roleLabelForSeat(seat)}</div>
                      <div
                        className={`ct-numBox ct-numBox--dist ${isLocked(seat) ? "ct-numBox--locked" : ""}`}
                        onMouseDown={(e) => {
                          if (isLocked(seat)) return;
                          e.preventDefault();
                          distributionRefs[seat]?.current?.focus?.({ preventScroll: true });
                          distributionRefs[seat]?.current?.select?.();
                        }}
                        title={isLocked(seat) ? "Prefilled for this exercise" : undefined}
                      >
                        <div className="ct-numBoxValue ct-numBoxValue--dist" aria-hidden="true">
                          {distributionInput[seat]}
                        </div>
                        <input
                          ref={distributionRefs[seat]}
                          className="ct-numBoxInput ct-numBoxInput--hidden"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          aria-label={`${roleLabelForSeat(seat)} distribution guess`}
                          value={distributionInput[seat]}
                          onChange={(e) => {
                            if (isLocked(seat)) return;
                            const v = setDistSeatDigit(seat, e.target.value);
                            if (!v) return;
                            if (seat === distSeatOrder[distSeatOrder.length - 1]) e.target.blur();
                            else focusNextSeatNoWrap(seat);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (seat === distSeatOrder[distSeatOrder.length - 1]) submitDistributionGuess();
                              else focusNextSeatNoWrap(seat);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          onBlur={clearFeedback}
                          disabled={isPlaying || isLocked(seat)}
                        />
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="ct-railActions">
                <button className="ct-btn" onClick={submitDistributionGuess} disabled={isPlaying}>
                  Enter
                </button>
                {feedback?.type === "error" && (
                  <button className="ct-btn ct-btn--secondary" onClick={clearFeedback}>
                    Try again
                  </button>
                )}
              </div>

              <div className="ct-microHelp">
                Your guess must add to <strong>13</strong>.
              </div>
            </>
          )}

          {promptStep === "DISTRIBUTION_NEED" && (
            <>
              <div className="ct-questionText">
                {activeCustomPrompt?.promptText || "What distribution do you need?"}
              </div>

              <div className="ct-distRow ct-distRow--numBoxes" role="group" aria-label="Distribution needed inputs">
                {(() => {
                  const fixed = activeCustomPrompt?.fixed || {};
                  const lock = true;
                  const isLocked = (seat) => lock && fixed?.[seat] !== undefined;
                  return distSeatOrder.map((seat, idx) => (
                    <div key={seat} className="ct-distSeat" data-position={["left", "top", "right", "bottom"][idx]}>
                      <div className="ct-distLabel">{roleLabelForSeat(seat)}</div>
                      <div
                        className={`ct-numBox ct-numBox--dist ${isLocked(seat) ? "ct-numBox--locked" : ""}`}
                        onMouseDown={(e) => {
                          if (isLocked(seat)) return;
                          e.preventDefault();
                          distributionRefs[seat]?.current?.focus?.({ preventScroll: true });
                          distributionRefs[seat]?.current?.select?.();
                        }}
                        title={isLocked(seat) ? "Prefilled for this exercise" : undefined}
                      >
                        <div className="ct-numBoxValue ct-numBoxValue--dist" aria-hidden="true">
                          {distributionInput[seat]}
                        </div>
                        <input
                          ref={distributionRefs[seat]}
                          className="ct-numBoxInput ct-numBoxInput--hidden"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          aria-label={`${roleLabelForSeat(seat)} distribution needed`}
                          value={distributionInput[seat]}
                          onChange={(e) => {
                            if (isLocked(seat)) return;
                            const v = setDistSeatDigit(seat, e.target.value);
                            if (!v) return;
                            if (seat === distSeatOrder[distSeatOrder.length - 1]) e.target.blur();
                            else focusNextSeatNoWrap(seat);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (seat === distSeatOrder[distSeatOrder.length - 1]) submitDistributionNeed();
                              else focusNextSeatNoWrap(seat);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          onBlur={clearFeedback}
                          disabled={isPlaying || isLocked(seat)}
                        />
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="ct-railActions">
                <button className="ct-btn" onClick={submitDistributionNeed} disabled={isPlaying}>
                  Enter
                </button>
                {feedback?.type === "error" && (
                  <button className="ct-btn ct-btn--secondary" onClick={clearFeedback}>
                    Try again
                  </button>
                )}
              </div>
            </>
          )}

          {promptStep === "SEAT_SHAPE" && (
            <>
              <div className="ct-questionText">
                {activeCustomPrompt?.type === "SEAT_SHAPE" && activeCustomPrompt?.promptText ? (
                  <>{activeCustomPrompt.promptText}</>
                ) : (
                  <>
                    {askedSuitCount >= 3 && shapeIntroSeatKey === seatShapeTarget ? "Now we have enough information for the full hand. " : ""}
                    Enter <strong>{roleLabelForSeat(seatShapeTarget)}</strong>&apos;s original shape (S H D C)
                  </>
                )}
              </div>

              <div className="ct-shapeRow" role="group" aria-label="Shape inputs">
                {(() => {
                  const fixedSuitCounts =
                    (activeCustomPrompt?.type === "SEAT_SHAPE" && activeCustomPrompt?.fixedSuitCounts) || null;
                  const isLocked = (s) => fixedSuitCounts?.[s] !== undefined;
                  return ["S", "H", "D", "C"].map((suit) => (
                    <div key={suit} className="ct-distSeat">
                      <div className="ct-distLabel">{suit}</div>
                      <div
                        className={`ct-numBox ct-numBox--dist ${isLocked(suit) ? "ct-numBox--locked" : ""}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          if (isLocked(suit)) return;
                          seatShapeRefs[suit]?.current?.focus?.({ preventScroll: true });
                        }}
                        title={isLocked(suit) ? "Prefilled for this exercise" : undefined}
                      >
                        <div className="ct-numBoxValue ct-numBoxValue--dist" aria-hidden="true">
                          {seatShapeInput[suit]}
                        </div>
                        <input
                          ref={seatShapeRefs[suit]}
                          className="ct-numBoxInput ct-numBoxInput--hidden"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          aria-label={`${seatShapeTarget} ${suit} count`}
                          value={seatShapeInput[suit]}
                          onChange={(e) => {
                            if (isLocked(suit)) return;
                            const v = setShapeSuitValue(suit, e.target.value);
                            if (!v) return;
                            if (suit === "C") {
                              e.target.blur();
                              return;
                            }
                            focusNextShapeNoWrap(suit);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (suit === "C") submitSeatShape();
                              else focusNextShapeNoWrap(suit);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          onBlur={clearFeedback}
                          disabled={isPlaying || isLocked(suit)}
                        />
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="ct-railActions">
                <button className="ct-btn" onClick={submitSeatShape} disabled={isPlaying}>
                  Enter
                </button>
                {feedback?.type === "error" && (
                  <button className="ct-btn ct-btn--secondary" onClick={resetSeatShapeInputs}>
                    Try again
                  </button>
                )}
              </div>
            </>
          )}

          {promptStep === "TRICK_COUNT" && (
            <>
              <div className="ct-questionText">
                How many <strong>sure tricks</strong> does <strong>{isDeclarerSide ? "your side" : "declarer"}</strong> have? (by suit)
              </div>

              <div className="ct-shapeRow" role="group" aria-label="Trick count inputs">
                {["S", "H", "D", "C"].map((suit) => (
                  <div key={`tc-${suit}`} className="ct-distSeat">
                    <div className="ct-distLabel">{suitSymbol(suit)}</div>
                    <div
                      className="ct-numBox ct-numBox--dist"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        seatShapeRefs[suit]?.current?.focus?.({ preventScroll: true });
                        seatShapeRefs[suit]?.current?.select?.();
                      }}
                    >
                      <div className="ct-numBoxValue ct-numBoxValue--dist" aria-hidden="true">
                        {trickCountInput[suit]}
                      </div>
                      <input
                        ref={seatShapeRefs[suit]}
                        className="ct-numBoxInput ct-numBoxInput--hidden"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        aria-label={`${suit} trick count`}
                        value={trickCountInput[suit]}
                        onChange={(e) => {
                          const v = setTrickCountSuitDigit(suit, e.target.value);
                          if (!v) return;
                          if (suit === "C") return;
                          const order = ["S", "H", "D", "C"];
                          const idx = order.indexOf(suit);
                          const next = order[idx + 1];
                          seatShapeRefs[next]?.current?.focus?.();
                          seatShapeRefs[next]?.current?.select?.();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (suit === "C") submitTrickCount();
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                        onBlur={clearFeedback}
                        disabled={isPlaying}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="ct-railActions">
                <button className="ct-btn" onClick={submitTrickCount} disabled={isPlaying}>
                  Enter
                </button>
                {feedback?.type === "error" && (
                  <button
                    className="ct-btn ct-btn--secondary"
                    onClick={() => {
                      setTrickCountInput({ S: "", H: "", D: "", C: "" });
                      clearFeedback();
                    }}
                  >
                    Try again
                  </button>
                )}
              </div>

              <div className="ct-microHelp">
                Sure tricks total:{" "}
                <strong>
                  {["S", "H", "D", "C"].reduce((sum, s) => sum + (Number(trickCountInput[s]) || 0), 0)}
                </strong>
              </div>
            </>
          )}

          {feedback && (
            <div className={`ct-feedback ${feedback.type === "ok" ? "ct-feedback--ok" : "ct-feedback--error"}`}>
              {feedback.type === "ok" && feedback.text.startsWith("Well done") ? (
                <strong>{feedback.text}</strong>
              ) : (
                feedback.text
              )}
            </div>
          )}
        </div>
      )}

      {promptStep === "DONE" && (
        <div className="ct-promptDone">
          <div className="ct-promptTitle">
            {trainerLabel === "Counting" ? "Well done — you’ve counted the hand correctly." : "Well done — exercise complete."}
          </div>
          {!!doneExtraText && (
            <FormattedRevealText text={doneExtraText} className="ct-railMuted ct-doneExtraText" />
          )}
          <div className="ct-railMuted ct-doneNote">
            {trainerLabel === "Counting" ? "You’re building a good habit — keep going." : "Keep going — repetition builds instincts."}
          </div>
          <div className="ct-row">
            <button className="ct-btn" onClick={nextHand}>
              Next hand
            </button>
            <button className="ct-btn ct-btn--secondary" onClick={startPuzzle}>
              Replay
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={`ct-page ${showFullHands ? "ct-page--fullhands" : ""}`}>

      <div className={`ct-layout ${showFullHands ? "ct-layout--fullhands" : ""}`}>
        <div className="ct-stage">
          <div className="ct-topNav" aria-label={`${trainerLabel} navigation`}>
            {/* Category tier: Declarer | Defence | Counting */}
            <div className="ct-categoryRow" aria-label="Trainer category">
              <div className="ct-categoryTabs" role="tablist">
                {CATEGORY_CONFIG.map((c) => (
                  <Link
                    key={c.key}
                    to={c.path}
                    className={`ct-categoryTab ${c.key === categoryKey ? "ct-categoryTab--active" : ""}`}
                    role="tab"
                    aria-selected={c.key === categoryKey}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Difficulty tier */}
            <div className="ct-topNavRow ct-topNavRow--diff" aria-label="Difficulty tabs">
              <div className="ct-topNavLabel">Difficulty</div>
              <div className="ct-diffTabs" role="tablist" aria-label="Difficulty levels">
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    className={`ct-diffTab ${d === selectedDifficulty ? "ct-diffTab--active" : ""}`}
                    onClick={() => {
                      setSelectedDifficulty(d);
                      setPuzzleIdxInDifficulty(0);
                    }}
                    type="button"
                    role="tab"
                    aria-selected={d === selectedDifficulty}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem tier */}
            <div className="ct-topNavSubRow" aria-label="Problem tabs">
              <div className="ct-topNavLabel ct-topNavLabel--sub">
                Problems <span className="ct-topNavSubNote">in Difficulty {selectedDifficulty}</span>
              </div>
              <div className="ct-problemTabs ct-problemTabs--sub" role="tablist" aria-label="Problems in difficulty">
                {isBlankDifficulty ? (
                  <span className="ct-railMuted">—</span>
                ) : (
                  puzzlesForDifficultyAll.map((p, idx) => {
                    const isUnlocked = isMember || (!!previewPuzzleIdForSelectedDifficulty && p.id === previewPuzzleIdForSelectedDifficulty);
                    return (
                      <button
                        key={p.id}
                        className={`ct-problemTab ${idx === puzzleIdxInDifficulty ? "ct-problemTab--active" : ""} ${!isUnlocked ? "ct-problemTab--locked" : ""}`}
                        onClick={() => {
                          if (!isUnlocked) return;
                          setPuzzleIdxInDifficulty(idx);
                        }}
                        type="button"
                        role="tab"
                        aria-selected={idx === puzzleIdxInDifficulty}
                        title={p.title}
                        disabled={!isUnlocked}
                      >
                        {idx + 1}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {!!puzzle.promptOptions?.focusNote && (
            <div className="ct-focusNote" aria-label="Training focus note">
              {puzzle.promptOptions.focusNote}
            </div>
          )}

          {isBlankDifficulty ? (
            <div className="ct-sidePrompt" style={{ maxWidth: 520, margin: "24px auto" }}>
              <div className="ct-questionText">No problems yet for Difficulty {selectedDifficulty}.</div>
            </div>
          ) : (
            <div className={useBottomRowLayout ? "ct-tableWithSidebar" : ""}>
            <div
              className={`ct-table ${useBottomRowLayout ? "ct-table--bottomRowLayout ct-table--promptOnRight" : ""} ${useBottomRowLayout && showFullHands && visibleFullHandSeats.includes(seatLeft) ? "ct-table--westVisible" : ""}`}
            >
          {/* Top */}
          <div className={`ct-seat ct-seat--top ${showFullHands && visibleFullHandSeats.includes(seatTop) ? "ct-seat--span" : ""}`}>
            {!!contractText && !useBottomRowLayout && (
              <div className="ct-contractTop">
                Contract is <strong><ContractWithColoredSuit text={contractText} /></strong> by <strong>{declarerCompassName}</strong>
              </div>
            )}
            <div className="ct-seatLabel">{roleLabelForSeat(seatTop)}</div>
            {(!showFullHands || visibleFullHandSeats.includes(seatTop)) && (
              <div className="ct-handWrap">{renderSeatHand(seatTop)}</div>
            )}
          </div>

          {/* Middle row: LHO - Trick - RHO (prompt is in right sidebar when useBottomRowLayout) */}
          <div className="ct-seat ct-seat--left">
            {showFullHands &&
              !useBottomRowLayout &&
              (promptStep === "PLAY_DECISION_REVEAL" || !visibleFullHandSeats.includes(seatLeft)) &&
              (useBottomRowLayout || (!hasStarted || (hasStarted && promptPlacement === "left"))) && (
                <div className={`ct-sidePrompt ct-sidePrompt--seatLeft ${useBottomRowLayout ? "ct-sidePrompt--leftOfTable" : ""}`} aria-label="Bidding and prompts">
                  {promptNode}
                </div>
              )}
            {showFullHands && visibleFullHandSeats.includes(seatLeft) && <div className="ct-handWrap">{renderSeatHand(seatLeft)}</div>}
            {!showFullHands &&
              (((remainingHands[seatLeft] || []).length > 0) ||
                (promptStep === "DONE" && puzzle.endRevealTrumpHands && Array.isArray(puzzle.endRevealTrumpHands[seatLeft]))) && (
                <div className="ct-handWrap">{renderSeatHand(seatLeft)}</div>
              )}
          </div>

          <div
            className={`ct-trickWrap ${
              useBottomRowLayout ? "ct-trickWrap--bottomRowLayout" : ""
            } ${
              showFullHands && (promptPlacement === "right" || promptPlacement === "left") && !useBottomRowLayout ? "ct-trickWrap--sidePanel" : ""
            } ${showFullHands && promptPlacement === "left" && !useBottomRowLayout ? "ct-trickWrap--sidePanelLeft" : ""}`}
            aria-label="Trick area and controls"
          >
            <div className="ct-trickBoard" aria-label="Card table">
              {!hasStarted && (
                <div className="ct-startOverlay" aria-label="Start exercise">
                  <div className="ct-startCard">
                    {!!contractText && (
                      <div className="ct-startTitle">
                        Contract is <strong><ContractWithColoredSuit text={contractText} /></strong>
                        {!puzzle?.promptOptions?.contractOnly && <> by <strong>{declarerCompassName}</strong></>}
                      </div>
                    )}
                    <div className="ct-startSub">
                      You are <strong>{isDeclarerSide ? "declaring" : "defending"}</strong>.
                    </div>
                    <button className="ct-startBtn" onClick={startPuzzle} disabled={isPlaying}>
                      Start
                    </button>
                    {lastRoundIdx >= 0 ? (
                      <div className="ct-startHint">
                        After each trick, click <strong>Next →</strong>
                      </div>
                    ) : (
                      <div className="ct-startHint">Click Start to begin.</div>
                    )}
                  </div>
                </div>
              )}
              <div className="ct-trickGrid" role="region" aria-label="Trick area">
                <div className="ct-trickPos ct-trickPos--top">
                  {trickCards[seatTop] && (
                    <div className={`ct-card ${animSeat === seatTop ? "ct-card--entered" : ""} ${cardColorClass(trickCards[seatTop])}`}>
                      {formatCard(trickCards[seatTop])}
                    </div>
                  )}
                </div>
                <div className="ct-trickPos ct-trickPos--left">
                  {trickCards[seatLeft] && (
                    <div className={`ct-card ${animSeat === seatLeft ? "ct-card--entered" : ""} ${cardColorClass(trickCards[seatLeft])}`}>
                      {formatCard(trickCards[seatLeft])}
                    </div>
                  )}
                </div>
                <div className="ct-trickPos ct-trickPos--right">
                  {trickCards[seatRight] && (
                    <div className={`ct-card ${animSeat === seatRight ? "ct-card--entered" : ""} ${cardColorClass(trickCards[seatRight])}`}>
                      {formatCard(trickCards[seatRight])}
                    </div>
                  )}
                </div>
                <div className="ct-trickPos ct-trickPos--bottom">
                  {trickCards[seatBottom] && (
                    <div className={`ct-card ${animSeat === seatBottom ? "ct-card--entered" : ""} ${cardColorClass(trickCards[seatBottom])}`}>
                      {formatCard(trickCards[seatBottom])}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="ct-trickSide">
              {showFullHands &&
                !useBottomRowLayout &&
                (promptPlacement === "right" || (promptPlacement === "left" && visibleFullHandSeats.includes(seatLeft))) && (
                <div className={`ct-sidePrompt ${promptPlacement === "left" ? "ct-sidePrompt--left" : ""}`} aria-label="Counting prompt">
                  {promptNode}
                </div>
              )}
              {!manualTrickMode && (
                <button
                  className="ct-btn ct-btn--secondary ct-replayBtn"
                  onClick={playFromStartToNextPause}
                  disabled={!hasStarted || isPlaying || promptStep === "DEFENDERS_STARTED"}
                >
                  Let me see that again
                </button>
              )}

                {manualTrickMode && lastRoundIdx >= 0 && (
                  <div className="ct-trickNav" aria-label="Trick navigation">
                    <button
                      className="ct-btn ct-btn--secondary"
                      onClick={() => {
                        if (!hasStarted) return;
                        if (isPlaying) return;
                        const prev = completedRoundIdx - 1;
                        if (prev < 0) return;
                        applyStateThroughRound(prev);
                        afterManualTrick(prev);
                      }}
                      disabled={!hasStarted || isPlaying || completedRoundIdx <= 0}
                    >
                      ← Prev
                    </button>
                    <button
                      className="ct-btn"
                      onClick={() => {
                        if (!hasStarted) return;
                        if (isPlaying) return;
                        const next = completedRoundIdx + 1;
                        if (next > lastRoundIdx) return;
                        playOneTrick(next);
                      }}
                      disabled={!hasStarted || isPlaying || completedRoundIdx >= lastRoundIdx || (promptStep && promptStep !== "DONE")}
                    >
                      Next →
                    </button>
                  </div>
                )}
            </div>

            {showFullHands && promptPlacement === "bottom" && !useBottomRowLayout && (
              <div className="ct-bottomPrompt" aria-label="Counting prompt">
                <div className="ct-sidePrompt">{promptNode}</div>
              </div>
            )}
          </div>

          <div className="ct-seat ct-seat--right">
            {showFullHands && visibleFullHandSeats.includes(seatRight) && <div className="ct-handWrap">{renderSeatHand(seatRight)}</div>}
            {!showFullHands &&
              (((remainingHands[seatRight] || []).length > 0) ||
                (promptStep === "DONE" && puzzle.endRevealTrumpHands && Array.isArray(puzzle.endRevealTrumpHands[seatRight]))) && (
                <div className="ct-handWrap">{renderSeatHand(seatRight)}</div>
              )}
          </div>

          {/* Declarer: South centered under table */}
          <div className={`ct-seat ct-seat--bottom ${showFullHands && visibleFullHandSeats.includes(seatBottom) ? "ct-seat--span" : ""}`}>
            <div className="ct-seatLabel">{roleLabelForSeat(seatBottom)}</div>
            {(!showFullHands || visibleFullHandSeats.includes(seatBottom)) && (
              <div className="ct-handWrap">{renderSeatHand(seatBottom)}</div>
            )}
          </div>
          </div>
          {useBottomRowLayout && (
            <aside className="ct-explanationSidebar" aria-label="Bidding and explanation">
              <div className="ct-sidePrompt">{promptNode}</div>
            </aside>
          )}
          </div>
          )}
        </div>

        {!isBlankDifficulty && !showFullHands && (
          <aside className="ct-rail" aria-label="Counting prompt">
            {promptNode}
          </aside>
        )}
      </div>

    </div>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  subscriptionActive: state.auth.subscriptionActive,
  a: state.auth.a,
});

export default connect(mapStateToProps)(CountingTrumpsTrainer);


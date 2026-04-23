import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { savePracticeCompletion } from "../../store/actions/usersActions";
import { sendPracticeEvent } from "../../utils/analytics";
import { TRAINER_CATEGORY_TABS } from "../Trainers/trainerCategoryTabs";
import { TRIAL_STARTER_IDS_BY_CATEGORY, FREE_PROBLEM_IDS_BY_CATEGORY, THEME_PACKS } from "../../data/themePacks";
import { THEME_INTRO_BY_TINT } from "../../data/themePacks";
import { filterBeginnerTrainerPuzzles } from "../../data/beginnerModeConfig";
import PracticeVideoBlock from "./PracticeVideoBlock";
import { CLOCKWISE, partnerCompass, lhoCompass, rhoCompass, buildSeatCompassMaps } from "../../bridge/seatCompassMaps";
import { PLAY_ENGINE_COMPASS_CLOCKWISE, followSeatsClockwiseFromLeader } from "../../bridge/compassPlayOrder";
import { isCompassTrainerEngine, puzzleHasPlayInHand, compassTrainerSeatLabel } from "../../bridge/trainerCompassEngine";
import "./CountingTrumpsTrainer.css";

// Runner storage seat ids (historical JSON + state shape). Layout is viewer-centric on screen;
// use trainerEngine: "compass" for N/E/S/W labels in the UI.
const SEATS = ["LHO", "DUMMY", "RHO", "DECLARER"];

/** Narrow rail: theme + auction collapse to a peek row (contract line always visible). */
const RAIL_CONTEXT_COLLAPSE_MEDIA = "(max-width: 860px)";
const RAIL_CONTEXT_AUTO_COLLAPSE_MS = 2800;

/** Cyan rail/tab styling shared by d1 "drawing trumps" and d2 "using entries productively" problems */
function isCyanDeclarerThemeTint(tint) {
  return tint === "drawTrumps" || tint === "entriesProductive";
}

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

const PLAY_DECISION_BIDDING_BOX_LEVELS = [1, 2, 3, 4, 5, 6, 7];
const PLAY_DECISION_BIDDING_BOX_STRAINS = [
  { suffix: "c", labelText: "♣", ariaSuit: "clubs" },
  { suffix: "d", labelText: "♦", ariaSuit: "diamonds" },
  { suffix: "h", labelText: "♥", ariaSuit: "hearts" },
  { suffix: "s", labelText: "♠", ariaSuit: "spades" },
  { suffix: "nt", labelText: null, ariaSuit: null },
];

/** Full bidding-box for PLAY_DECISION: suit columns (compact Bid-Pal style) + Pass / X / XX. */
function PlayDecisionBiddingBox({ onSelect, disabled }) {
  return (
    <div className="ct-biddingDecisionBox" role="group" aria-label="Bidding box">
      <div className="ct-biddingDecisionBox-grid">
        <div className="ct-biddingDecisionBox-gutter" aria-hidden="true">
          <div className="ct-biddingDecisionBox-corner" />
          {PLAY_DECISION_BIDDING_BOX_LEVELS.map((level) => (
            <div key={level} className="ct-biddingDecisionBox-rowhead">
              {level}
            </div>
          ))}
        </div>
        {PLAY_DECISION_BIDDING_BOX_STRAINS.map((s) => (
          <div key={s.suffix} className={`ct-biddingDecisionBox-column ct-biddingDecisionBox-column--${s.suffix}`}>
            <div className="ct-biddingDecisionBox-colhead">
              {s.suffix === "nt" ? "NT" : <TextWithColoredSuits text={s.labelText} />}
            </div>
            {PLAY_DECISION_BIDDING_BOX_LEVELS.map((level) => {
              const id = `${level}${s.suffix}`;
              const labelText = s.suffix === "nt" ? `${level}NT` : `${level}${s.labelText}`;
              const ariaBid = s.suffix === "nt" ? `Bid ${level} notrump` : `Bid ${level} ${s.ariaSuit}`;
              return (
                <button
                  key={id}
                  type="button"
                  className="ct-biddingDecisionBox-call"
                  onClick={() => onSelect(id)}
                  disabled={disabled}
                  aria-label={ariaBid}
                >
                  <span className="ct-biddingDecisionBox-callLabel">
                    <TextWithColoredSuits text={labelText} />
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="ct-biddingDecisionBox-actions" role="group" aria-label="Other calls">
        <button
          type="button"
          className="ct-biddingDecisionBox-call ct-biddingDecisionBox-call--wide ct-biddingDecisionBox-call--pass"
          onClick={() => onSelect("pass")}
          disabled={disabled}
          aria-label="Pass"
        >
          Pass
        </button>
        <button
          type="button"
          className="ct-biddingDecisionBox-call ct-biddingDecisionBox-call--wide ct-biddingDecisionBox-call--double"
          onClick={() => onSelect("double")}
          disabled={disabled}
          aria-label="Double"
        >
          X
        </button>
        <button
          type="button"
          className="ct-biddingDecisionBox-call ct-biddingDecisionBox-call--wide ct-biddingDecisionBox-call--redouble"
          onClick={() => onSelect("redouble")}
          disabled={disabled}
          aria-label="Redouble"
        >
          XX
        </button>
      </div>
    </div>
  );
}

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

/** Split text into spans: ♥/♦ red, ♠/♣ black (bridge convention). */
function suitColoredParts(text) {
  if (text == null || text === "") return null;
  const parts = String(text).split(/([♠♥♦♣])/);
  return parts.map((part, i) => {
    if (part === "♥" || part === "♦") {
      return (
        <span key={i} className="ct-suitSym--red">
          {part}
        </span>
      );
    }
    if (part === "♠" || part === "♣") {
      return (
        <span key={i} className="ct-suitSym--black">
          {part}
        </span>
      );
    }
    return part ? <React.Fragment key={i}>{part}</React.Fragment> : null;
  });
}

/** **bold**, ##gold##, [[RING]]…[[/RING]] (circled emphasis) inside a single paragraph block; suit symbols colored */
function renderRevealInlineParts(block) {
  const parts = String(block)
    .trim()
    .split(/(\*\*.+?\*\*|##.+?##|\[\[RING\]\][\s\S]*?\[\[\/RING\]\])/g);
  return parts.map((seg, j) => {
    if (!seg) return null;
    const ringMatch = seg.match(/^\[\[RING\]\]([\s\S]*?)\[\[\/RING\]\]$/);
    if (ringMatch) {
      return (
        <span key={j} className="ct-revealRing">
          {renderRevealInlineParts(ringMatch[1])}
        </span>
      );
    }
    const boldMatch = seg.match(/^\*\*(.+?)\*\*$/s);
    if (boldMatch) {
      return (
        <strong key={j}>{suitColoredParts(boldMatch[1])}</strong>
      );
    }
    const goldMatch = seg.match(/^##(.+?)##$/s);
    if (goldMatch) {
      return (
        <span key={j} className="ct-revealGold">
          {suitColoredParts(goldMatch[1])}
        </span>
      );
    }
    return <React.Fragment key={j}>{suitColoredParts(seg)}</React.Fragment>;
  });
}

/** Renders explanation/reveal text with paragraphs and styled ✓/✗/lettered lists for better readability */
function FormattedRevealText({ text, className = "" }) {
  if (text == null || text === false) return null;
  if (typeof text !== "string") {
    return <div className={`ct-revealContent ${className}`.trim()}>{text}</div>;
  }
  if (!String(text).trim()) return null;
  const blocks = String(text).trim().split(/\n\n+/);
  return (
    <div className={`ct-revealContent ${className}`.trim()}>
      {blocks.map((block, i) => {
        const alertWrapped = block.trim().match(/^\[\[ALERT\]\]\s*([\s\S]*?)\s*\[\[\/ALERT\]\]$/);
        if (alertWrapped) {
          const innerParas = alertWrapped[1].trim().split(/\n\n+/);
          return (
            <div key={i} className="ct-promptAlert" role="note">
              {innerParas.map((ib, k) => (
                <p key={k} className="ct-revealParagraph ct-revealParagraph--alertCallout">
                  {renderRevealInlineParts(ib.trim())}
                </p>
              ))}
            </div>
          );
        }
        const lines = block.split("\n").filter(Boolean);
        const isTickList = lines.length > 0 && lines.every((l) => /^\s*✓/.test(l.trim()));
        const isCrossList = lines.length > 0 && lines.every((l) => /^\s*[✗×]/.test(l.trim()));
        const isBulletList = lines.length > 0 && lines.every((l) => /^\s*•/.test(l.trim()));
        const isLetteredList = lines.length > 0 && lines.every((l) => /^\s*\([a-z]\)\s+/.test(l.trim()));
        if (isTickList) {
          return (
            <ul key={i} className="ct-revealList">
              {lines.map((line, j) => (
                <li key={j} className="ct-revealListItem">
                  {suitColoredParts(line.trim())}
                </li>
              ))}
            </ul>
          );
        }
        if (isBulletList) {
          return (
            <ul key={i} className="ct-revealList">
              {lines.map((line, j) => (
                <li key={j} className="ct-revealListItem">
                  {suitColoredParts(line.trim().replace(/^•\s*/, ""))}
                </li>
              ))}
            </ul>
          );
        }
        if (isCrossList) {
          return (
            <ul key={i} className="ct-revealList ct-revealList--cross">
              {lines.map((line, j) => (
                <li key={j} className="ct-revealListItem">
                  {suitColoredParts(line.trim())}
                </li>
              ))}
            </ul>
          );
        }
        if (isLetteredList) {
          return (
            <ol key={i} className="ct-revealList ct-revealList--lettered">
              {lines.map((line, j) => (
                <li key={j} className="ct-revealListItem">
                  {suitColoredParts(line.trim().replace(/^\s*\([a-z]\)\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }
        // Support **bold** and ##gold## inside paragraphs
        return (
          <p key={i} className="ct-revealParagraph">
            {renderRevealInlineParts(block)}
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

/** Trick table: same pip markup as hands (unified sizing on phone via CSS). */
function TrickPipCard({ card, entered }) {
  if (!card) return null;
  return (
    <div
      className={`ct-miniCard ct-miniCard--fan ct-miniCard--trick ${entered ? "ct-card--entered" : ""} ${cardColorClass(card)}`.trim()}
    >
      <div className="ct-fanFace" aria-hidden="true">
        <div className="ct-fanRank">{displayRank(card.rank)}</div>
        <div className="ct-fanSuit">{suitSymbol(card.suit)}</div>
      </div>
    </div>
  );
}

function parseHandSuitString(s) {
  if (!s) return [];
  const str = String(s).trim();
  const ranks = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "1" && str[i + 1] === "0") {
      ranks.push("T"); // 10 → T (cards are 2–10, J, Q, K, A; no 0 or 1)
      i++;
    } else {
      ranks.push(str[i]);
    }
  }
  return ranks.filter(Boolean);
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

/** Renders any string with ♥/♦ in red and ♠/♣ in black (bridge convention). */
export function TextWithColoredSuits({ text }) {
  const nodes = suitColoredParts(text);
  if (!nodes) return null;
  return <>{nodes}</>;
}

/** Inviting lesson headline for Learn bridge from scratch (/beginner/practice). */
function BeginnerLessonContractTitle({ text }) {
  return (
    <div className="ct-beginnerLessonBanner">
      <div className="ct-beginnerLessonBanner-eyebrow">Learn bridge from scratch</div>
      <div className="ct-beginnerLessonBanner-title">
        <TextWithColoredSuits text={text} />
      </div>
    </div>
  );
}

/** Renders contract text (e.g. "4♥") with hearts/diamonds in red */
function ContractWithColoredSuit({ text }) {
  return <TextWithColoredSuits text={text} />;
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

const AUCTION_DISPLAY_ORDER = ["W", "N", "E", "S"]; // common auction grid order (BBO-like)

function normalizeTrickPlaysClockwise(plays, declarerCompass) {
  if (!Array.isArray(plays) || plays.length !== 4) return plays;
  const { seatToCompass, compassToSeat } = buildSeatCompassMaps(declarerCompass);
  const leaderSeat = plays[0]?.seat;
  const leaderCompass = seatToCompass[leaderSeat];
  if (!leaderCompass) return plays;

  const playBySeat = {};
  for (const p of plays) {
    const seat = p?.seat;
    if (!SEATS.includes(seat)) return plays;
    playBySeat[seat] = p;
  }
  if (Object.keys(playBySeat).length !== 4) return plays;

  const leaderIdx = CLOCKWISE.indexOf(leaderCompass);
  if (leaderIdx === -1) return plays;
  const expectedSeats = Array.from({ length: 4 }, (_, i) => {
    const compass = CLOCKWISE[(leaderIdx + i) % 4];
    return compassToSeat[compass];
  });
  if (expectedSeats.some((seat) => !playBySeat[seat])) return plays;
  return expectedSeats.map((seat) => playBySeat[seat]);
}

function normalizeRoundsClockwise(rounds, declarerCompass) {
  if (!Array.isArray(rounds) || !rounds.length) return rounds || [];
  return rounds.map((round) => {
    const plays = Array.isArray(round?.plays) ? round.plays : [];
    return { ...round, plays: normalizeTrickPlaysClockwise(plays, declarerCompass) };
  });
}

/** Compass seats in puzzle data (plays, distribution keys). Hands use {@link COMPASS_HAND_KEYS} to avoid clashing with suit key "S". */
const COMPASS_LETTERS = new Set(["N", "E", "S", "W"]);
const COMPASS_HAND_KEYS = { north: "N", east: "E", south: "S", west: "W" };
const COMPASS_HAND_KEY_SET = new Set(Object.keys(COMPASS_HAND_KEYS));
const LOCKED_COUNTING_COMPASS_IDS = new Set(["p1-15", "p1-16", "p1-17", "p1-18", "p1-19"]);

/**
 * Reorder trick plays in true compass order (N→E→S→W) starting from the leader (plays[0]).
 * Supports fewer than four cards (e.g. teaching layouts). Only runs when all seats are compass letters.
 */
function normalizeTrickPlaysCompassOrder(plays) {
  if (!Array.isArray(plays) || plays.length === 0) return plays;
  let hasCompass = false;
  let hasLegacy = false;
  for (const p of plays) {
    const s = p?.seat;
    if (!s) continue;
    if (COMPASS_LETTERS.has(s)) hasCompass = true;
    else if (SEATS.includes(s)) hasLegacy = true;
  }
  if (!hasCompass || hasLegacy) return plays;
  const leader = plays[0]?.seat;
  if (!COMPASS_LETTERS.has(leader)) return plays;
  const playBySeat = {};
  for (const p of plays) {
    const s = p?.seat;
    if (!COMPASS_LETTERS.has(s)) return plays;
    if (playBySeat[s]) return plays;
    playBySeat[s] = p;
  }
  const leaderIdx = CLOCKWISE.indexOf(leader);
  const ordered = [];
  for (let i = 0; i < 4; i++) {
    const c = CLOCKWISE[(leaderIdx + i) % 4];
    if (playBySeat[c]) ordered.push(playBySeat[c]);
  }
  if (ordered.length !== plays.length) return plays;
  return ordered;
}

function deepFreeze(obj) {
  if (!obj || typeof obj !== "object" || Object.isFrozen(obj)) return obj;
  Object.getOwnPropertyNames(obj).forEach((key) => {
    deepFreeze(obj[key]);
  });
  return Object.freeze(obj);
}

function assertCompassSeatToken(token, { puzzleId, path }) {
  if (typeof token !== "string" || !token) return;
  if (SEATS.includes(token)) {
    throw new Error(`Puzzle ${puzzleId} uses legacy seat "${token}" at ${path}.`);
  }
  if (!COMPASS_LETTERS.has(token) && !COMPASS_HAND_KEY_SET.has(token)) {
    throw new Error(`Puzzle ${puzzleId} has invalid compass seat "${token}" at ${path}.`);
  }
}

function assertCompassSeatKeyMap(obj, { puzzleId, path }) {
  if (!obj || typeof obj !== "object") return;
  Object.keys(obj).forEach((key) => assertCompassSeatToken(key, { puzzleId, path: `${path}.${key}` }));
}

function validateLockedCountingCompassPuzzle(puzzle) {
  if (!puzzle) return;
  const puzzleId = puzzle.id || "(unknown)";
  if (!LOCKED_COUNTING_COMPASS_IDS.has(puzzleId)) return;

  if (puzzle.seatMode !== "compass") {
    throw new Error(`Puzzle ${puzzleId} must declare seatMode: "compass".`);
  }

  assertCompassSeatToken(puzzle.viewerCompass, { puzzleId, path: "viewerCompass" });
  assertCompassSeatToken(puzzle.declarerCompass, { puzzleId, path: "declarerCompass" });

  (puzzle.visibleFullHandSeats || []).forEach((seat, idx) =>
    assertCompassSeatToken(seat, { puzzleId, path: `visibleFullHandSeats[${idx}]` })
  );

  assertCompassSeatKeyMap(puzzle.shownHands, { puzzleId, path: "shownHands" });
  assertCompassSeatKeyMap(puzzle.expectedInitialLengths, { puzzleId, path: "expectedInitialLengths" });
  assertCompassSeatKeyMap(puzzle.endRevealTrumpHands, { puzzleId, path: "endRevealTrumpHands" });

  (puzzle.rounds || []).forEach((round, roundIdx) => {
    (round?.plays || []).forEach((play, playIdx) => {
      assertCompassSeatToken(play?.seat, { puzzleId, path: `rounds[${roundIdx}].plays[${playIdx}].seat` });
    });
  });

  const prompts = puzzle.promptOptions?.customPrompts || [];
  prompts.forEach((prompt, promptIdx) => {
    assertCompassSeatToken(prompt?.seat, { puzzleId, path: `promptOptions.customPrompts[${promptIdx}].seat` });
    assertCompassSeatKeyMap(prompt?.fixed, { puzzleId, path: `promptOptions.customPrompts[${promptIdx}].fixed` });
    assertCompassSeatKeyMap(prompt?.expectedDistribution, {
      puzzleId,
      path: `promptOptions.customPrompts[${promptIdx}].expectedDistribution`,
    });
    (prompt?.distributionPairGuides?.groups || []).forEach((group, groupIdx) => {
      (group?.seats || []).forEach((seat, seatIdx) =>
        assertCompassSeatToken(seat, {
          puzzleId,
          path: `promptOptions.customPrompts[${promptIdx}].distributionPairGuides.groups[${groupIdx}].seats[${seatIdx}]`,
        })
      );
    });
  });
}

/**
 * New puzzles only: `seatMode: "compass"` with plays/seat keys N/E/S/W and optional hand keys north/east/south/west.
 * Converted once to runner storage seat ids so the existing play runner is unchanged. Legacy puzzles omit seatMode.
 */
function compassPuzzleToLegacy(puzzle) {
  if (!puzzle || puzzle.seatMode !== "compass") return puzzle;
  const dec = puzzle.declarerCompass || "S";
  const { compassToSeat } = buildSeatCompassMaps(dec);

  const letterToLegacy = (letter) => {
    const leg = compassToSeat[letter];
    if (!leg) throw new Error(`compassPuzzleToLegacy: no legacy seat for compass "${letter}"`);
    return leg;
  };

  const remapPlaySeat = (seat) => {
    if (!seat) return seat;
    if (COMPASS_LETTERS.has(seat)) return letterToLegacy(seat);
    if (COMPASS_HAND_KEYS[seat]) return letterToLegacy(COMPASS_HAND_KEYS[seat]);
    if (SEATS.includes(seat)) return seat;
    throw new Error(`compassPuzzleToLegacy: unknown seat "${seat}"`);
  };

  const remapHandKey = (key) => {
    if (COMPASS_HAND_KEYS[key]) return letterToLegacy(COMPASS_HAND_KEYS[key]);
    if (SEATS.includes(key)) return key;
    return key;
  };

  /** Seat-only keyed maps (counts, lengths). Do not use for nested suit-keyed objects. */
  const remapTopLevelSeatKeys = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      let nk = k;
      if (COMPASS_LETTERS.has(k)) nk = letterToLegacy(k);
      else if (COMPASS_HAND_KEYS[k]) nk = letterToLegacy(COMPASS_HAND_KEYS[k]);
      else if (SEATS.includes(k)) nk = k;
      out[nk] = v;
    }
    return out;
  };

  /** PLAY_CARD: outer keys are seats; inner keys are suits (S/H/D/C) — only remap outer. */
  const remapPlayCardAutoFollowBySuit = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      let nk = k;
      if (COMPASS_LETTERS.has(k)) nk = letterToLegacy(k);
      else if (COMPASS_HAND_KEYS[k]) nk = letterToLegacy(COMPASS_HAND_KEYS[k]);
      else if (SEATS.includes(k)) nk = k;
      out[nk] = v;
    }
    return out;
  };

  const remapPrompt = (p) => {
    if (!p || typeof p !== "object") return p;
    const out = { ...p };
    if (typeof out.seat === "string") out.seat = remapPlaySeat(out.seat);
    if (Array.isArray(out.revealFullHandSeats)) {
      out.revealFullHandSeats = out.revealFullHandSeats.map((s) => (typeof s === "string" ? remapPlaySeat(s) : s));
    }
    if (out.fixed) out.fixed = remapTopLevelSeatKeys(out.fixed);
    if (out.expectedDistribution) out.expectedDistribution = remapTopLevelSeatKeys(out.expectedDistribution);
    if (out.playCardAutoFollowBySuit) {
      if (puzzle.playEngine !== PLAY_ENGINE_COMPASS_CLOCKWISE) {
        out.playCardAutoFollowBySuit = remapPlayCardAutoFollowBySuit(out.playCardAutoFollowBySuit);
      }
    }
    if (Array.isArray(out.playCardAutoPlaysBefore)) {
      out.playCardAutoPlaysBefore = out.playCardAutoPlaysBefore.map((x) =>
        x && typeof x === "object" ? { ...x, seat: x.seat ? remapPlaySeat(x.seat) : x.seat } : x
      );
    }
    if (Array.isArray(out.playCardAutoPlaysAfterDummy)) {
      out.playCardAutoPlaysAfterDummy = out.playCardAutoPlaysAfterDummy.map((x) =>
        x && typeof x === "object" ? { ...x, seat: x.seat ? remapPlaySeat(x.seat) : x.seat } : x
      );
    }
    if (out.playCardAutoPlayAfter && typeof out.playCardAutoPlayAfter === "object") {
      out.playCardAutoPlayAfter = {
        ...out.playCardAutoPlayAfter,
        seat: out.playCardAutoPlayAfter.seat ? remapPlaySeat(out.playCardAutoPlayAfter.seat) : out.playCardAutoPlayAfter.seat,
      };
    }
    if (typeof out.playCardResponderSeat === "string" && out.playCardResponderSeat) {
      out.playCardResponderSeat = remapPlaySeat(out.playCardResponderSeat);
    }
    if (out.playDecisionApplyCardOnChoice && typeof out.playDecisionApplyCardOnChoice === "object") {
      const mapped = {};
      Object.entries(out.playDecisionApplyCardOnChoice).forEach(([choice, play]) => {
        if (!play || typeof play !== "object") return;
        mapped[choice] = {
          ...play,
          seat: play.seat ? remapPlaySeat(play.seat) : play.seat,
        };
      });
      out.playDecisionApplyCardOnChoice = mapped;
    }
    return out;
  };

  const shownHands = {};
  if (puzzle.shownHands) {
    for (const [k, v] of Object.entries(puzzle.shownHands)) {
      shownHands[remapHandKey(k)] = v;
    }
  }

  const rounds = (puzzle.rounds || []).map((r) => {
    const rawPlays = r.plays || [];
    const compassOrdered = normalizeTrickPlaysCompassOrder(rawPlays);
    const plays = compassOrdered.map((p) => ({ ...p, seat: remapPlaySeat(p.seat) }));
    return { ...r, plays };
  });

  const out = {
    ...puzzle,
    shownHands,
    rounds,
  };
  delete out.seatMode;

  if (puzzle.endRevealTrumpHands) {
    const er = {};
    for (const [k, v] of Object.entries(puzzle.endRevealTrumpHands)) {
      er[remapHandKey(k)] = v;
    }
    out.endRevealTrumpHands = er;
  }

  if (puzzle.expectedInitialLengths) {
    out.expectedInitialLengths = remapTopLevelSeatKeys(puzzle.expectedInitialLengths);
  }

  if (Array.isArray(puzzle.visibleFullHandSeats)) {
    out.visibleFullHandSeats = puzzle.visibleFullHandSeats.map((s) => (typeof s === "string" ? remapPlaySeat(s) : s));
  }

  if (Array.isArray(puzzle.revealFullHandsAtEnd)) {
    out.revealFullHandsAtEnd = puzzle.revealFullHandsAtEnd.map((s) => (typeof s === "string" ? remapPlaySeat(s) : s));
  }

  if (puzzle.promptOptions && typeof puzzle.promptOptions === "object") {
    const po = { ...puzzle.promptOptions };
    if (typeof po.seatShapeTarget === "string") po.seatShapeTarget = remapPlaySeat(po.seatShapeTarget);
    if (Array.isArray(po.customPrompts)) po.customPrompts = po.customPrompts.map(remapPrompt);
    if (po.distributionPrefill?.fixed) {
      po.distributionPrefill = { ...po.distributionPrefill, fixed: remapTopLevelSeatKeys(po.distributionPrefill.fixed) };
    }
    out.promptOptions = po;
  }

  return out;
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

/**
 * Compact auction grid for lesson / practice prompts (same cell layout as the rail auction).
 */
export function PracticeAuctionMiniTable({
  auctionText,
  dealerCompass = "S",
  auctionAllWhite = true,
  vulnerability,
  className = "",
}) {
  const auctionGrid = useMemo(
    () => (auctionText ? buildAuctionGrid({ auctionText, dealerCompass }) : null),
    [auctionText, dealerCompass]
  );
  if (!auctionGrid?.rows?.length) return null;
  const headExtra = auctionAllWhite ? " ct-auctionCell--white" : "";
  const cellExtra = auctionAllWhite ? " ct-auctionCell--white" : "";
  return (
    <div className={`ct-revealRichAuction ct-auctionCard ${className}`.trim()} aria-label="Auction">
      {vulnerability ? (
        <div className="ct-auctionVul" aria-label="Vulnerability">
          {vulnerability}
        </div>
      ) : null}
      <div className="ct-auctionGrid" role="table" aria-label="Auction grid">
        <div className="ct-auctionHead" role="row">
          {auctionGrid.order.map((seat) => (
            <div key={`h-${seat}`} className={`ct-auctionCell ct-auctionCell--head${headExtra}`.trim()} role="columnheader">
              {seatCompassLabel(seat)}
            </div>
          ))}
        </div>
        {auctionGrid.rows.map((row, idx) => (
          <div key={`r-${idx}`} className="ct-auctionRow" role="row">
            {auctionGrid.order.map((seat) => {
              const c = row[seat];
              return (
                <div key={`c-${idx}-${seat}`} className={`ct-auctionCell${cellExtra}`.trim()} role="cell">
                  {c ? (
                    <span className={`ct-auctionCall ct-auctionCall--${c.kind}`.trim()}>
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
  );
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
const RANK_ORDER = ["A", "K", "Q", "J", "T", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
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
 * For a "New" badge, set newUntil: "YYYY-MM-DD" (e.g. ~2 weeks from add date).
 * Optional video: promptOptions.videoUrlBeforeStart (intro), customPrompts[].videoUrl (explanation after reveal).
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
      videoUrlBeforeStart: "https://youtube.com/shorts/89TwhfB2biM",
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
      RHO: ["T", "6", "5", "2"],
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
    id: "p1-2",
    difficulty: 1,
    title: "Defending 4♠: count declarer’s trumps after partner shows out",
    trumpSuit: "S",
    contract: "4♠",
    auction: "4♠ P P P",
    dealerCompass: "S", // declarer opened 4♠ as dealer
    viewerCompass: "E", // you are East, defending (RHO)
    promptOptions: {
      videoUrlBeforeStart: "https://youtube.com/shorts/S_Hhj87iXOw",
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
    id: "p1-9",
    difficulty: 1,
    title: "5 hearts opposite a void — can you make 4 tricks? (No Trump)",
    trumpSuit: "H",
    contract: "3NT",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    promptOptions: {
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      focusNote: "You are declarer in No Trump. We are looking at the heart suit.",
      customPrompts: [
        {
          id: "p1-9-can4",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Is there a chance to make 5 heart tricks opposite partners void?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          revealText: "Yes.",
        },
        {
          id: "p1-9-break",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: -1,
          fixed: { DECLARER: 5, DUMMY: 0 },
          expectedDistribution: { LHO: 4, RHO: 4, DUMMY: 0, DECLARER: 5 },
          promptText: "What distribution do you need (East and West)?",
        },
        {
          id: "p1-9-fifth",
          type: "PLAY_DECISION",
          atRoundIdx: 3,
          promptText: "Is your final heart a trick or not?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText: "Yes — with 4-4 break, your final heart is high. Any 5-card suit can be set up for extra tricks, even opposite a void! Keep your eye on your 5-card suits; they will improve your bridge scores!",
        },
      ],
      watchNote: "Watch the play.",
    },
    shownHands: {
      DUMMY: { S: "", H: "", D: "", C: "" },
      DECLARER: { S: "", H: "AKQJ2", D: "", C: "" },
    },
    expectedInitialLengths: {
      LHO: 4,
      DUMMY: 0,
      RHO: 4,
      DECLARER: 5,
    },
    endRevealTrumpHands: {
      LHO: ["5", "4", "3", "2"],
      DUMMY: [],
      RHO: ["T", "9", "8", "7"],
      DECLARER: ["A", "K", "Q", "J", "2"],
    },
    preserveEndStateAtDone: false,
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "H" } },
          { seat: "LHO", card: { rank: "5", suit: "H" } },
          { seat: "DUMMY", card: { rank: "2", suit: "S" }, showOut: true },
          { seat: "RHO", card: { rank: "T", suit: "H" } },
        ],
      },
      {
        label: "Trick 2",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "4", suit: "H" } },
          { seat: "DUMMY", card: { rank: "3", suit: "S" }, showOut: true },
          { seat: "RHO", card: { rank: "9", suit: "H" } },
        ],
      },
      {
        label: "Trick 3",
        plays: [
          { seat: "DECLARER", card: { rank: "Q", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
          { seat: "DUMMY", card: { rank: "4", suit: "S" }, showOut: true },
          { seat: "RHO", card: { rank: "8", suit: "H" } },
        ],
      },
      {
        label: "Trick 4",
        plays: [
          { seat: "DECLARER", card: { rank: "J", suit: "H" } },
          { seat: "LHO", card: { rank: "2", suit: "H" } },
          { seat: "DUMMY", card: { rank: "5", suit: "S" }, showOut: true },
          { seat: "RHO", card: { rank: "7", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "p1-10",
    difficulty: 1,
    title: "3NT: counting points — how many does partner have?",
    newUntil: "2026-04-15",
    trumpSuit: null,
    contract: "3NT",
    auction: "1NT P 3NT P P P",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "W",
    visibleFullHandSeats: ["LHO", "DUMMY"],
    promptOptions: {
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideAuction: false,
      focusNote: "You are West on lead. This is a quick exercise — we will only look at trick 1.",
      customPrompts: [
        {
          id: "p1-10-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "The point of this exercise is to get acquainted with the idea of counting points. This is a quick exercise; we will only look at trick 1.\n\nIt can look scary at first if you don't like arithmetic, but I encourage you to build the habit.",
        },
        {
          id: "p1-10-partner-points",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Declarer has 15–17 points for their opening bid. How many points does partner have?",
          options: [
            { id: "4-6", label: "4–6" },
            { id: "6-8", label: "6–8" },
            { id: "8-10", label: "8–10" },
            { id: "10-12", label: "10–12" },
          ],
          expectedChoice: "8-10",
          noContinue: true,
          revealText:
            "8–10.\n\nA key habit on every hand is to know roughly how many points partner has — and how many declarer has. It really pays off.\n\nYou have 4 points. Dummy has 11. That’s 15 in total. If declarer has 15 points, that leaves 10 for partner. If declarer has 17, that leaves 8 for partner. So partner has 8–10 points.\n\n✓ Add your points to dummy’s and get the total.\n✓ Add declarer’s minimum (15 for 1NT) to that total.\n✓ What’s left is roughly partner’s points.",
        },
      ],
    },
    shownHands: {
      LHO: { S: "KJ953", H: "876", D: "43", C: "762" },
      DUMMY: { S: "A32", H: "Q9", D: "KJT987", C: "J4" },
      RHO: {},
      DECLARER: {},
    },
    rounds: [
      {
        label: "Trick 1 (you lead ♠5)",
        plays: [{ seat: "LHO", card: { rank: "5", suit: "S" } }],
      },
    ],
  },
  {
    id: "p1-11",
    difficulty: 1,
    newUntil: "2026-03-25",
    title: "1NT defence: 4th highest lead — partner has how many?",
    trumpSuit: "S",
    contract: "1NT",
    auction: "P P 1NT P",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "E",
    promptOptions: {
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideAuction: false,
      focusNote: "Assume we are defending 1NT and partner leads their 4th highest. You are East.",
      customPrompts: [
        {
          id: "p1-11-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This is a single-suit, quick pattern-recognition idea that builds on our knowledge of shapes.\n\nAssume we are defending 1NT and partner leads their 4th highest card.",
        },
        {
          id: "p1-11-partner-count",
          type: "SINGLE_NUMBER",
          atRoundIdx: 0,
          promptText: "How many of the suit does partner have?",
          expectedAnswer: 4,
        },
        {
          id: "p1-11-partner-4-reason",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "4 exactly. If the 4th highest card is the 2♠, partner cannot have 5 cards in the suit.",
        },
        {
          id: "p1-11-declarer-count",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 0,
          fixed: { LHO: 4, DUMMY: 2, RHO: 4 },
          expectedDistribution: { LHO: 4, DUMMY: 2, RHO: 4, DECLARER: 3 },
          promptText: "How many does that leave declarer?",
        },
        {
          id: "p1-11-declarer-3-reveal",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "Declarer has 3, so the Spade distribution is 4243.",
        },
      ],
    },
    shownHands: {
      DUMMY: { suit: "S", cards: ["3", "6"] },
      RHO: { suit: "S", cards: ["K", "9", "8", "4"] },
    },
    endRevealTrumpHands: {
      LHO: ["2", "5", "7", "T"],
      DUMMY: ["3", "6"],
      RHO: ["K", "9", "8", "4"],
      DECLARER: ["A", "J", "Q"],
    },
    rounds: [
      {
        label: "Partner's lead",
        plays: [{ seat: "LHO", card: { rank: "2", suit: "S" } }],
      },
    ],
  },
  {
    id: "p1-12",
    difficulty: 1,
    newUntil: "2026-03-25",
    title: "1NT defence: 4th highest lead — distribution 4441",
    trumpSuit: "S",
    contract: "1NT",
    auction: "P P 1NT P",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "E",
    promptOptions: {
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideAuction: false,
      focusNote: "Assume we are defending 1NT and partner leads their 4th highest. You are East. Dummy has one spade.",
      customPrompts: [
        {
          id: "p1-12-partner-count",
          type: "SINGLE_NUMBER",
          atRoundIdx: 0,
          promptText: "How many of the suit does partner have?",
          expectedAnswer: 4,
        },
        {
          id: "p1-12-partner-4-reason",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "4 exactly. If the 4th highest card is the 2♠, partner cannot have 5 cards in the suit.",
        },
        {
          id: "p1-12-declarer-count",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 0,
          fixed: { LHO: 4, DUMMY: 1, RHO: 4 },
          expectedDistribution: { LHO: 4, DUMMY: 1, RHO: 4, DECLARER: 4 },
          promptText: "How many does that leave declarer?",
        },
        {
          id: "p1-12-declarer-4-reveal",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "Declarer has 4, so the Spade distribution is 4144.",
        },
      ],
    },
    shownHands: {
      DUMMY: { suit: "S", cards: ["9"] },
      RHO: { suit: "S", cards: ["A", "7", "5", "4"] },
    },
    endRevealTrumpHands: {
      LHO: ["2", "5", "7", "T"],
      DUMMY: ["9"],
      RHO: ["A", "7", "5", "4"],
      DECLARER: ["K", "Q", "J", "6"],
    },
    rounds: [
      {
        label: "Partner's lead",
        plays: [{ seat: "LHO", card: { rank: "2", suit: "S" } }],
      },
    ],
  },
  {
    id: "p1-13",
    difficulty: 1,
    newUntil: "2026-03-25",
    title: "1NT after 1♠: partner leads 3♠ — 4th highest from 5",
    trumpSuit: "S",
    contract: "1NT",
    auction: "1♠ P P 1NT P P P",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "E",
    promptOptions: {
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideAuction: false,
      focusNote: "4th highest leads. Partner (West) leads the 3♠. You are East.",
      customPrompts: [
        {
          id: "p1-13-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "Hint: always watch the bidding.",
        },
        {
          id: "p1-13-partner-count",
          type: "SINGLE_NUMBER",
          atRoundIdx: 0,
          promptText: "How many spades does partner have?",
          expectedAnswer: 5,
        },
        {
          id: "p1-13-partner-5-reason",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "5. Leading 4th highest: there is only 1 card lower than the 3 (the 2). So partner must have exactly 5 cards in the suit — not 6.",
        },
        {
          id: "p1-13-distribution",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 0,
          fixed: { LHO: 5, DUMMY: 1, RHO: 3 },
          expectedDistribution: { LHO: 5, DUMMY: 1, RHO: 3, DECLARER: 4 },
          promptText: "So what is the distribution of the suit? West 5, North 1, You 3 — how many does declarer have?",
        },
        {
          id: "p1-13-distribution-reveal",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "Declarer has 4. The Spade distribution is 5134.",
        },
      ],
    },
    shownHands: {
      DUMMY: { suit: "S", cards: ["9"] },
      RHO: { suit: "S", cards: ["A", "7", "5"] },
    },
    endRevealTrumpHands: {
      LHO: ["K", "T", "8", "3", "2"],
      DUMMY: ["9"],
      RHO: ["A", "7", "5"],
      DECLARER: ["Q", "J", "6", "4"],
    },
    rounds: [
      {
        label: "Partner's lead",
        plays: [{ seat: "LHO", card: { rank: "3", suit: "S" } }],
      },
    ],
  },
  {
    id: "p1-14",
    difficulty: 1,
    newUntil: "2026-04-01",
    title: "4♥: After ruffing the 4th spade — where is the ♥Q?",
    trumpSuit: "H",
    contract: "4♥",
    auction: "P P P 1♥ P 2♥ P 4♥ P P P",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    promptOptions: {
      questionNumbers: [],
      disableWarmupTrumpGuess: true,
      focusNote: "West is dealer. You are declarer in 4♥. Our job is to find the Q♥.",
      customPrompts: [
        {
          id: "p1-14-heart-play",
          type: "PLAY_DECISION",
          atRoundIdx: 3,
          promptText:
            "We have no further losers, other than potentially the Q♥. How are we going to play the heart suit?",
          options: [
            { id: "drop", label: "Play for the drop — cash the Ace and King" },
            { id: "finesse-west", label: "Finesse West (assume West holds the Queen)" },
            { id: "finesse-east", label: "Finesse East" },
          ],
          expectedChoice: "finesse-east",
          noContinue: true,
          revealText:
            "Finesse East for the Queen!\n\nWest was a passed hand and has turned up with 10 points so far (the A-K-Q-J of spades). With the Q♥, West would have had enough to open the bidding. So the Queen is marked with East — we finesse East for it.",
        },
      ],
    },
    shownHands: {
      LHO: { S: "AKQJ", H: "7", D: "398", C: "6T932" },
      DUMMY: { S: "8765", H: "KT2", D: "KQ3", C: "987" },
      RHO: { S: "T9", H: "Q72", D: "J6542", C: "QJ3" },
      DECLARER: { S: "432", H: "AJ9862", D: "A7", C: "AK" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♠A)",
        plays: [
          { seat: "LHO", card: { rank: "A", suit: "S" } },
          { seat: "DUMMY", card: { rank: "8", suit: "S" } },
          { seat: "RHO", card: { rank: "9", suit: "S" } },
          { seat: "DECLARER", card: { rank: "4", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (West leads ♠K)",
        plays: [
          { seat: "LHO", card: { rank: "K", suit: "S" } },
          { seat: "DUMMY", card: { rank: "7", suit: "S" } },
          { seat: "RHO", card: { rank: "T", suit: "S" } },
          { seat: "DECLARER", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (West leads ♠Q; East pitches a diamond)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "S" } },
          { seat: "DUMMY", card: { rank: "6", suit: "S" } },
          { seat: "RHO", card: { rank: "5", suit: "D" } },
          { seat: "DECLARER", card: { rank: "2", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (West leads ♠J; East pitches; you ruff with a heart, winning)",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "S" } },
          { seat: "DUMMY", card: { rank: "5", suit: "S" } },
          { seat: "RHO", card: { rank: "6", suit: "D" } },
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "p1-15",
    difficulty: 1,
    seatMode: "compass",
    title: "2♠: two-suit counting (8 goes with 5, 9 goes with 4)",
    trumpSuit: "S",
    contract: "2♠",
    auction: "1♠ P 2♠ P P P",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["east", "north"],
    promptOptions: {
      prePromptsBeforePlay: false,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/woQkBC9Iy9s",
      promptThemeTint: "enemyFive",
      themeLabel: "Theme: 8 + 5, 9 + 4",
      visibleSuitsDuringPlay: ["S", "H"],
      visibleSuitsOnDone: ["S", "H"],
      revealOriginalOnDone: true,
      customPrompts: [
        {
          id: "p1-15-intro-1",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "We are going to get very good at counting two suits; that is the foundation for doing full hands.",
        },
        {
          id: "p1-15-intro-2",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "One skill we need is quickly remembering: 9 goes with 4, and 8 goes with 5.\n\nIf this is unfamiliar, please review Fundamentals #1 - understand bridge 'shapes'.",
        },
        {
          id: "p1-15-heart-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 1,
          fixed: { N: 4, E: 5 },
          expectedDistribution: { E: 5, N: 4, W: 3, S: 1 },
          promptText: "What was the original heart distribution?",
          successText: "Correct — great counting. Keep building this habit.",
          distributionPairGuides: {
            variant: "all_three",
            groups: [
              { seats: ["E", "N"], label: "Adds to 9" },
              { seats: ["S", "W"], label: "Adds to 4" },
            ],
          },
        },
        {
          id: "p1-15-trump-muscle",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "We need to build a muscle. For every hand, track how many trumps partner has. Notice how much you can do with that information.",
          continueButtonLabel: "Continue",
        },
        {
          id: "p1-15-partner-trumps",
          type: "SEAT_SUIT_COUNT",
          seat: "W",
          suit: "S",
          atRoundIdx: 3,
          promptText: "How many trumps did partner have?",
          expected: 1,
        },
        {
          id: "p1-15-trump-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 3,
          fixed: { E: 3, W: 1, N: 3 },
          expectedDistribution: { E: 3, N: 3, W: 1, S: 6 },
          promptText: "What was the original trump distribution?",
          successText: "Well done — excellent trump counting.",
          distributionPairGuides: {
            variant: "all_three",
            groups: [
              { seats: ["W", "E"], label: "Adds to 4" },
              { seats: ["S", "N"], label: "Adds to 9" },
            ],
          },
        },
      ],
    },
    shownHands: {
      east: { S: "987", H: "AKT95", D: "AQ8", C: "K7" }, // East (you)
      north: { S: "432", H: "J876", D: "K74", C: "AJ6" }, // North (dummy)
      west: { S: "5", H: "642", D: "JT9653", C: "T98" }, // West (partner)
      south: { S: "AKQJT6", H: "3", D: "2", C: "Q5432" }, // South
    },
    expectedInitialLengths: { E: 3, N: 3, W: 1, S: 6 },
    preserveEndStateAtDone: true,
    rounds: [
      {
        label: "Trick 1 (West leads ♥2)",
        plays: [
          { seat: "W", card: { rank: "2", suit: "H" } },
          { seat: "N", card: { rank: "7", suit: "H" } },
          { seat: "E", card: { rank: "K", suit: "H" } },
          { seat: "S", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (East leads ♥A; declarer ruffs)",
        plays: [
          { seat: "E", card: { rank: "A", suit: "H" } },
          { seat: "S", card: { rank: "6", suit: "S" }, showOut: true },
          { seat: "W", card: { rank: "4", suit: "H" } },
          { seat: "N", card: { rank: "8", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (declarer cashes ♠A)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "S" } },
          { seat: "W", card: { rank: "5", suit: "S" } },
          { seat: "N", card: { rank: "2", suit: "S" } },
          { seat: "E", card: { rank: "7", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (declarer cashes ♠K; West discards a diamond)",
        plays: [
          { seat: "S", card: { rank: "K", suit: "S" } },
          { seat: "W", card: { rank: "6", suit: "D" }, showOut: true },
          { seat: "N", card: { rank: "3", suit: "S" } },
          { seat: "E", card: { rank: "8", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "p1-16",
    difficulty: 1,
    seatMode: "compass",
    title: "2♠: two-suit counting follow-up (8+5 and 5+8)",
    trumpSuit: "S",
    contract: "2♠",
    auction: "1♠ P 2♠ P P P",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["east", "north"],
    promptOptions: {
      prePromptsBeforePlay: false,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/l1sT7tRTVB4",
      promptThemeTint: "enemyFive",
      themeLabel: "Theme: 8 + 5, 9 + 4",
      visibleSuitsDuringPlay: ["S", "H"],
      visibleSuitsOnDone: ["S", "H"],
      customPrompts: [
        {
          id: "p1-16-heart-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 2,
          fixed: { E: 5, N: 3 },
          expectedDistribution: { E: 5, N: 3, W: 3, S: 2 },
          promptText: "What was the original heart distribution?",
          successText: "Correct — strong work. You are developing real counting instincts.",
          distributionPairGuides: {
            variant: "all_three",
            groups: [
              { seats: ["E", "N"], label: "Adds to 8" },
              { seats: ["S", "W"], label: "Adds to 5" },
            ],
          },
        },
        {
          id: "p1-16-trump-key-msg",
          type: "INFO",
          atRoundIdx: 2,
          promptText:
            "Declarer is about to draw trumps, always keep an eye on the number of trumps partner has, that is one of the biggest keys to unlock the door to counting.",
        },
        {
          id: "p1-16-partner-trumps",
          type: "SEAT_SUIT_COUNT",
          seat: "W",
          suit: "S",
          atRoundIdx: 5,
          promptText: "So how many trumps did partner have?",
          expected: 2,
        },
        {
          id: "p1-16-spade-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 5,
          fixed: { W: 2, E: 3, N: 3 },
          expectedDistribution: { E: 3, N: 3, W: 2, S: 5 },
          promptText: "So what was the original spade distribution?",
          successText: "Well done — your suit counting is getting sharper.",
          distributionPairGuides: {
            variant: "all_three",
            groups: [
              { seats: ["W", "E"], label: "Adds to 5" },
              { seats: ["N", "S"], label: "Adds to 8" },
            ],
          },
        },
      ],
    },
    shownHands: {
      // East (you)
      east: { S: "973", H: "AJT42", D: "KJ4", C: "T9" },
      // North (dummy)
      north: { S: "Q84", H: "Q96", D: "AQ743", C: "85" },
      // West (partner)
      west: { S: "J6", H: "K43", D: "982", C: "KQJ72" },
      // South (declarer)
      south: { S: "AKT52", H: "75", D: "T65", C: "A643" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads a small heart)",
        plays: [
          { seat: "W", card: { rank: "3", suit: "H" } },
          { seat: "N", card: { rank: "6", suit: "H" } },
          { seat: "E", card: { rank: "T", suit: "H" } },
          { seat: "S", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (you continue hearts)",
        plays: [
          { seat: "E", card: { rank: "2", suit: "H" } },
          { seat: "S", card: { rank: "7", suit: "H" } },
          { seat: "W", card: { rank: "K", suit: "H" } },
          { seat: "N", card: { rank: "9", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (West leads low heart; declarer pitches a spade)",
        plays: [
          { seat: "W", card: { rank: "4", suit: "H" } },
          { seat: "N", card: { rank: "Q", suit: "H" } },
          { seat: "E", card: { rank: "A", suit: "H" } },
          { seat: "S", card: { rank: "2", suit: "S" }, showOut: true },
        ],
      },
      {
        label: "Trick 4 (declarer plays ♠A)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "S" } },
          { seat: "W", card: { rank: "6", suit: "S" } },
          { seat: "N", card: { rank: "4", suit: "S" } },
          { seat: "E", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (declarer plays ♠K)",
        plays: [
          { seat: "S", card: { rank: "K", suit: "S" } },
          { seat: "W", card: { rank: "J", suit: "S" } },
          { seat: "N", card: { rank: "8", suit: "S" } },
          { seat: "E", card: { rank: "7", suit: "S" } },
        ],
      },
      {
        label: "Trick 6 (low spade to dummy’s queen; partner discards a diamond)",
        plays: [
          { seat: "S", card: { rank: "5", suit: "S" } },
          { seat: "W", card: { rank: "2", suit: "D" }, showOut: true },
          { seat: "N", card: { rank: "Q", suit: "S" } },
          { seat: "E", card: { rank: "9", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "p1-17",
    difficulty: 1,
    seatMode: "compass",
    title: "4♠: watch partner’s trumps while counting two suits",
    trumpSuit: "S",
    contract: "4♠",
    auction: "4♠ P P P",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["east", "north"],
    promptOptions: {
      prePromptsBeforePlay: false,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/QIxiu0y3lh0",
      promptThemeTint: "enemyFive",
      themeLabel: "Theme: 8 + 5, 9 + 4",
      visibleSuitsDuringPlay: ["S", "H"],
      visibleSuitsOnDone: ["S", "H"],
      customPrompts: [
        {
          id: "p1-17-heart-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 1,
          fixed: { N: 4, E: 4 },
          expectedDistribution: { E: 4, N: 4, W: 4, S: 1 },
          promptText: "What was the original heart distribution?",
          successText:
            "Correct — great work. This is exactly the skill we want to build: combining known cards quickly and confidently.",
          distributionPairGuides: {
            variant: "all_three",
            groups: [
              { seats: ["E", "N"], label: "Adds to 8" },
              { seats: ["S", "W"], label: "Adds to 5" },
            ],
          },
        },
        {
          id: "p1-17-trump-key-msg",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "Declarer is about to draw trumps, solidify the habit of watching how many trumps your partner has.",
        },
        {
          id: "p1-17-spade-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 3,
          fixed: { E: 3, N: 2 },
          expectedDistribution: { E: 3, N: 2, W: 1, S: 7 },
          promptText: "What was the original spade distribution?",
          successText: "Correct — excellent. Keep trusting your count.",
          distributionPairGuides: {
            variant: "all_three",
            groups: [
              { seats: ["E", "N"], label: "Adds to 5" },
              { seats: ["S", "W"], label: "Adds to 8" },
            ],
          },
        },
      ],
    },
    shownHands: {
      // East (you)
      east: { S: "864", H: "AQ92", D: "J75", C: "T94" },
      // North (dummy)
      north: { S: "72", H: "K843", D: "A86", C: "Q875" },
      // West (partner)
      west: { S: "J", H: "JT65", D: "KQ32", C: "A632" },
      // South (declarer)
      south: { S: "AKQT953", H: "7", D: "T94", C: "KJ" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♥J; all follow low)",
        plays: [
          { seat: "W", card: { rank: "J", suit: "H" } },
          { seat: "N", card: { rank: "3", suit: "H" } },
          { seat: "E", card: { rank: "2", suit: "H" } },
          { seat: "S", card: { rank: "7", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (West leads ♥10; declarer ruffs)",
        plays: [
          { seat: "W", card: { rank: "T", suit: "H" } },
          { seat: "N", card: { rank: "4", suit: "H" } },
          { seat: "E", card: { rank: "9", suit: "H" } },
          { seat: "S", card: { rank: "3", suit: "S" }, showOut: true },
        ],
      },
      {
        label: "Trick 3 (declarer plays ♠A; all follow)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "S" } },
          { seat: "W", card: { rank: "J", suit: "S" } },
          { seat: "N", card: { rank: "2", suit: "S" } },
          { seat: "E", card: { rank: "4", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (declarer plays ♠K; partner discards a diamond)",
        plays: [
          { seat: "S", card: { rank: "K", suit: "S" } },
          { seat: "W", card: { rank: "2", suit: "D" }, showOut: true },
          { seat: "N", card: { rank: "7", suit: "S" } },
          { seat: "E", card: { rank: "6", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "p1-18",
    difficulty: 1,
    seatMode: "compass",
    title: "4♠: diamonds first, then trumps",
    trumpSuit: "S",
    contract: "4♠",
    auction: "3♦ P P 3♠ P P P",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["east", "north"],
    promptOptions: {
      prePromptsBeforePlay: false,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/bqzHDzNJeGg",
      promptThemeTint: "enemyFive",
      themeLabel: "Theme: 8 + 5, 9 + 4",
      visibleSuitsDuringPlay: ["S", "D"],
      visibleSuitsOnDone: ["S", "D"],
      customPrompts: [
        {
          id: "p1-18-diamond-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "D",
          atRoundIdx: 1,
          fixed: { E: 2, N: 3 },
          expectedDistribution: { E: 2, N: 3, W: 7, S: 1 },
          promptText: "What was the original diamond distribution?",
          successText: "Correct — good discipline counting the side suit first.",
          distributionPairGuides: {
            variant: "all_three",
            groups: [
              { seats: ["E", "N"], label: "Adds to 5" },
              { seats: ["W", "S"], label: "Adds to 8" },
            ],
          },
        },
        {
          id: "p1-18-trump-key-msg",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "As always, watch how many trumps partner has, it is always the crucial starting point.",
        },
        {
          id: "p1-18-spade-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 3,
          fixed: { E: 3, N: 2 },
          expectedDistribution: { E: 3, N: 2, W: 1, S: 7 },
          promptText: "Lets now work out the spade distribution",
          successText: "Well done — that is solid trump counting.",
          distributionPairGuides: {
            variant: "all_three",
            groups: [
              { seats: ["E", "N"], label: "Adds to 5" },
              { seats: ["W", "S"], label: "Adds to 8" },
            ],
          },
        },
      ],
    },
    shownHands: {
      // East (you)
      east: { S: "J84", H: "AQ92", D: "52", C: "T73" },
      // North (dummy)
      north: { S: "62", H: "K843", D: "T84", C: "QJ9" },
      // West (partner)
      west: { S: "5", H: "JT75", D: "AKQJ973", C: "2" },
      // South (declarer)
      south: { S: "AKQT973", H: "6", D: "6", C: "AK8654" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♦A; all follow low)",
        plays: [
          { seat: "W", card: { rank: "A", suit: "D" } },
          { seat: "N", card: { rank: "4", suit: "D" } },
          { seat: "E", card: { rank: "2", suit: "D" } },
          { seat: "S", card: { rank: "6", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (West leads ♦K; declarer ruffs)",
        plays: [
          { seat: "W", card: { rank: "K", suit: "D" } },
          { seat: "N", card: { rank: "8", suit: "D" } },
          { seat: "E", card: { rank: "5", suit: "D" } },
          { seat: "S", card: { rank: "3", suit: "S" }, showOut: true },
        ],
      },
      {
        label: "Trick 3 (declarer plays ♠A; all follow)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "S" } },
          { seat: "W", card: { rank: "5", suit: "S" } },
          { seat: "N", card: { rank: "2", suit: "S" } },
          { seat: "E", card: { rank: "4", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (declarer plays ♠K; partner discards a diamond)",
        plays: [
          { seat: "S", card: { rank: "K", suit: "S" } },
          { seat: "W", card: { rank: "3", suit: "D" }, showOut: true },
          { seat: "N", card: { rank: "6", suit: "S" } },
          { seat: "E", card: { rank: "8", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "p1-19",
    difficulty: 1,
    seatMode: "compass",
    title: "2♠: count hearts first, then partner’s trumps",
    trumpSuit: "S",
    contract: "2♠",
    auction: "1♠ P 2♠ P P P",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "E",
    visibleFullHandSeats: ["east", "north"],
    promptOptions: {
      prePromptsBeforePlay: false,
      questionNumbers: [],
      manualTrickAdvance: true,
      disableWarmupTrumpGuess: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/KhU9_6j0DeA",
      promptThemeTint: "enemyFive",
      themeLabel: "Theme: 8 + 5, 9 + 4",
      visibleSuitsDuringPlay: ["S", "H"],
      visibleSuitsOnDone: ["S", "H"],
      customPrompts: [
        {
          id: "p1-19-heart-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 1,
          fixed: { E: 5, N: 3 },
          expectedDistribution: { E: 5, N: 3, W: 4, S: 1 },
          promptText: "What was the original heart distribution?",
          successText: "Correct — great job converting clues into exact numbers.",
          distributionPairGuides: {
            variant: "all_three",
            groups: [
              { seats: ["E", "N"], label: "Adds to 8" },
              { seats: ["W", "S"], label: "Adds to 5" },
            ],
          },
        },
        {
          id: "p1-19-trump-key-msg",
          type: "INFO",
          atRoundIdx: 1,
          promptText: "As always, keep your eye on partner's number of trumps.",
        },
        {
          id: "p1-19-partner-trumps",
          type: "SEAT_SUIT_COUNT",
          seat: "W",
          suit: "S",
          atRoundIdx: 3,
          promptText: "How many trumps did partner have?",
          expected: 1,
        },
        {
          id: "p1-19-spade-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 3,
          fixed: { W: 1, N: 3, E: 3 },
          expectedDistribution: { E: 3, N: 3, W: 1, S: 6 },
          promptText: "So what was the original distribution of the trump suit?",
          successText: "Well done — your trump distribution counting is spot on.",
          distributionPairGuides: {
            variant: "all_three",
            groups: [
              { seats: ["E", "W"], label: "Adds to 4" },
              { seats: ["N", "S"], label: "Adds to 9" },
            ],
          },
        },
      ],
    },
    shownHands: {
      // East (you)
      east: { S: "753", H: "AQ932", D: "62", C: "T8" },
      // North (dummy)
      north: { S: "T84", H: "K84", D: "A95", C: "QJ72" },
      // West (partner)
      west: { S: "J", H: "JT76", D: "KQ84", C: "A953" },
      // South (declarer)
      south: { S: "AKQ962", H: "5", D: "JT73", C: "K64" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♥J; low, low, low)",
        plays: [
          { seat: "W", card: { rank: "J", suit: "H" } },
          { seat: "N", card: { rank: "4", suit: "H" } },
          { seat: "E", card: { rank: "2", suit: "H" } },
          { seat: "S", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (West leads ♥10; declarer ruffs)",
        plays: [
          { seat: "W", card: { rank: "T", suit: "H" } },
          { seat: "N", card: { rank: "8", suit: "H" } },
          { seat: "E", card: { rank: "3", suit: "H" } },
          { seat: "S", card: { rank: "2", suit: "S" }, showOut: true },
        ],
      },
      {
        label: "Trick 3 (declarer plays ♠A; all follow)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "S" } },
          { seat: "W", card: { rank: "J", suit: "S" } },
          { seat: "N", card: { rank: "4", suit: "S" } },
          { seat: "E", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (declarer plays ♠K; partner discards a diamond)",
        plays: [
          { seat: "S", card: { rank: "K", suit: "S" } },
          { seat: "W", card: { rank: "4", suit: "D" }, showOut: true },
          { seat: "N", card: { rank: "8", suit: "S" } },
          { seat: "E", card: { rank: "5", suit: "S" } },
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
    newUntil: "2026-03-25",
    title: "Counting: set up the heart suit (two suits)",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    promptOptions: {
      prePromptsBeforePlay: false,
      questionNumbers: [],
      manualTrickAdvance: true,
      focusNote: "Spades are trumps. We are just looking at two suits for this problem.",
      customPrompts: [
        { id: "p2-2-intro", type: "INFO", atRoundIdx: -1, promptText: "We are playing 4♠ and we are going to try to set up our heart suit. Let's warm up with 2 practice questions." },
        { id: "p2-2-trumps-started", type: "SINGLE_NUMBER", atRoundIdx: -1, promptText: "How many trumps have the opponents started with?", expectedAnswer: 5 },
        { id: "p2-2-hearts-started", type: "SINGLE_NUMBER", atRoundIdx: -1, promptText: "How many hearts have the opponents started with?", expectedAnswer: 6 },
        { id: "p2-2-we-have-7", type: "INFO", atRoundIdx: -1, promptText: "We have 7, they have 6. When you repetitively practice setting up '7 card side suits' like this, you will become familiar with the idea that we have 7, they have 6." },
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
          promptText: "You now give up 1 more heart and you have set up the suit. That was the very best you could've done.\n\nCongratulations — this is a significant achievement! Repeating this exercise will build the pattern recognition you need; don't be shy to do it again, even daily. Well done!",
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
    id: "p2-3",
    difficulty: 2,
    newUntil: "2026-03-25",
    title: "Counting: set up hearts in 4♠ (two suits, no overruff)",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    promptOptions: {
      prePromptsBeforePlay: false,
      questionNumbers: [],
      manualTrickAdvance: true,
      focusNote: "Spades are trumps. We are just looking at two suits for this problem.",
      customPrompts: [
        { id: "p2-3-intro", type: "INFO", atRoundIdx: -1, promptText: "We are playing in 4♠, and are going to practice setting up hearts. Let's get ourselves ready by asking two important questions." },
        { id: "p2-3-trumps-started", type: "SINGLE_NUMBER", atRoundIdx: -1, promptText: "How many trumps have the opponents started with?", expectedAnswer: 5 },
        { id: "p2-3-hearts-started", type: "SINGLE_NUMBER", atRoundIdx: -1, promptText: "How many hearts (our side suit) do the opponents hold?", expectedAnswer: 6 },
        { id: "p2-3-we-have-7", type: "INFO", atRoundIdx: -1, promptText: "The more of these type problems we do, the more we will naturally remember that \"When we start with 7, they start with 6\"." },
        { id: "p2-3-hearts-left-2", type: "SINGLE_NUMBER", atRoundIdx: 1, promptText: "We've played two rounds of hearts. How many do the opponents have left?", expectedAnswer: 2 },
        { id: "p2-3-break-33", type: "DISTRIBUTION_GUESS", suit: "H", atRoundIdx: 1, fixed: { LHO: 3, DUMMY: 5, DECLARER: 2 }, expectedDistribution: { LHO: 3, RHO: 3, DUMMY: 5, DECLARER: 2 }, promptText: "What are some possible breaks? Fill in the missing number." },
        { id: "p2-3-break-24", type: "DISTRIBUTION_GUESS", suit: "H", atRoundIdx: 1, fixed: { LHO: 2, DUMMY: 5, DECLARER: 2 }, expectedDistribution: { LHO: 2, RHO: 4, DUMMY: 5, DECLARER: 2 }, promptText: "What are some possible breaks? Fill in the missing number." },
        { id: "p2-3-hearts-left-1", type: "SINGLE_NUMBER", atRoundIdx: 2, promptText: "So how many hearts are still out now?", expectedAnswer: 1 },
        { id: "p2-3-trumps-after-ace", type: "SINGLE_NUMBER", atRoundIdx: 3, promptText: "Let's update our trump tally. How many do the opponents still have?", expectedAnswer: 3 },
        { id: "p2-3-setup-note", type: "INFO", atRoundIdx: 4, promptText: "We now confidently note that we have set up our 5th heart." },
        { id: "p2-3-trumps-left-1", type: "SINGLE_NUMBER", atRoundIdx: 5, promptText: "How many trumps are still left?", expectedAnswer: 1 },
        {
          id: "p2-3-closing",
          type: "INFO",
          atRoundIdx: 5,
          setDoneExtraText: true,
          promptText: "We can now draw the last trump, confidently knowing that no more trumps are out, and that our heart is a winner.\n\nWell done — counting trumps and the side suit like this is a core declarer skill.\n\nKeep repeating this exercise to build the habit.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "AKQ", H: "A9876", D: "", C: "" },
      DECLARER: { S: "JT932", H: "K2", D: "", C: "" },
      RHO: { S: "54", H: "T3", D: "", C: "" },
      LHO: { S: "876", H: "QJ54", D: "", C: "" },
    },
    expectedInitialLengths: { LHO: 3, DUMMY: 3, RHO: 2, DECLARER: 5 },
    preserveEndStateAtDone: false,
    rounds: [
      {
        label: "Trick 1 (King of hearts)",
        plays: [
          { seat: "DUMMY", card: { rank: "6", suit: "H" } },
          { seat: "RHO", card: { rank: "4", suit: "H" } },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (heart to the Ace)",
        plays: [
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
          { seat: "LHO", card: { rank: "5", suit: "H" } },
          { seat: "DUMMY", card: { rank: "A", suit: "H" } },
          { seat: "RHO", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (ruff heart with J, RHO discards)",
        plays: [
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "C" }, showOut: true },
          { seat: "DECLARER", card: { rank: "J", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (trump to the Ace)",
        plays: [
          { seat: "DECLARER", card: { rank: "3", suit: "S" } },
          { seat: "LHO", card: { rank: "6", suit: "S" } },
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (ruff heart with 10)",
        plays: [
          { seat: "DUMMY", card: { rank: "8", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "C" }, showOut: true },
          { seat: "DECLARER", card: { rank: "T", suit: "S" } },
          { seat: "LHO", card: { rank: "Q", suit: "H" } },
        ],
      },
      {
        label: "Trick 6 (another trump, both follow)",
        plays: [
          { seat: "DECLARER", card: { rank: "9", suit: "S" } },
          { seat: "LHO", card: { rank: "7", suit: "S" } },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "4", suit: "S" } },
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

for (const p of PUZZLES) {
  validateLockedCountingCompassPuzzle(p);
  if (LOCKED_COUNTING_COMPASS_IDS.has(p?.id)) {
    deepFreeze(p);
  }
}

/** Same list the counting route uses (excludes moved puzzle d2-2). Exported for beginner practice isolation. */
export const DEFAULT_COUNTING_PUZZLES_FOR_TRAINER = PUZZLES.filter((p) => p.id !== "d2-2");

export const COUNTING_HAS_NEW = PUZZLES.some(isPuzzleNew);

/** Top practice categories used for the cross-trainer “Theme” jump combobox. */
const THEME_JUMP_CATEGORY_KEYS = ["declarer", "defence", "counting", "bidding"];

function themeJumpTabPath(categoryKey) {
  const row = TRAINER_CATEGORY_TABS.find((c) => c.key === categoryKey);
  return row?.path || "/cardPlay/practice";
}

function themeJumpTabLabel(categoryKey) {
  const row = TRAINER_CATEGORY_TABS.find((c) => c.key === categoryKey);
  return row?.label || categoryKey;
}

/**
 * Puzzles for every main trainer tab, loaded lazily so CardPlay/Defence/Bidding modules
 * (which import this file) can finish initializing before we read their exports.
 */
function loadTrainerPuzzlesByCategoryForThemeJump() {
  const counting = PUZZLES.filter((p) => p.id !== "d2-2");
  let declarer = [];
  let defence = [];
  let bidding = [];
  try {
    // eslint-disable-next-line global-require
    declarer = require("../CardPlay/CardPlayTrainer").CARDPLAY_PUZZLES || [];
    // eslint-disable-next-line global-require
    defence = require("../Defence/DefenceTrainer").DEFENCE_PUZZLES || [];
    // eslint-disable-next-line global-require
    bidding = require("../Bidding/BiddingTrainer").BIDDING_PUZZLES || [];
  } catch (e) {
    // Rare circular/timing edge during first bundle evaluation; options fill on next run.
  }
  return { counting, declarer, defence, bidding };
}

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

/** `playedFromHand` keys are `${rank}${suit}` e.g. AS, TS — recover a card for hand updates. */
function cardFromPlayedKey(key) {
  if (!key || typeof key !== "string" || key.length < 2) return null;
  const suit = key.slice(-1);
  if (!["S", "H", "D", "C"].includes(suit)) return null;
  const rank = key.slice(0, -1);
  return makeCard(rank, suit);
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

/** Short positive messages for correct-answer feedback (keeps layout compact). */
const SHORT_SUCCESS = ["Great!", "Well done!", "Correct!", "Nice one!", "Spot on!", "Good!"];
function getShortSuccess() {
  return SHORT_SUCCESS[Math.floor(Math.random() * SHORT_SUCCESS.length)];
}

const DONE_TITLES = [
  "Well done — you've counted the hand correctly.",
  "Correct — your counting is spot on.",
  "Nice work — that's the right count.",
  "Spot on — you've got the distribution.",
  "Well done — exercise complete.",
];

const DONE_NOTES = [
  "You're building a good habit — keep going.",
  "Repetition builds instincts — keep at it.",
  "Counting becomes automatic with practice — you're on the right track.",
  "This skill pays off at the table — keep going.",
  "Keep going — repetition builds instincts.",
  "Small steps add up — you're building a real skill.",
];

/** Completion screen — Bidding trainer (rotates by problem so lines do not feel repetitive). */
const BIDDING_DONE_TITLES = [
  "Nice work — ready for the next auction?",
  "Well done — on to the next hand.",
  "Good — that's one more in the bank.",
  "Solid — keep the run going.",
  "Nice — another hand is ready when you are.",
  "One down — pick another when you're ready.",
];

const BIDDING_DONE_NOTES = [
  "Each hand adds a little pattern recognition. Keep going.",
  "Small reps add up — stay with it.",
  "You're stacking habits — nice.",
  "The next problem is one click away.",
  "Momentum helps — roll straight into the next one if you like.",
  "Same time tomorrow works too — but the next hand is here when you are.",
  "Tiny edges compound — keep feeding the habit.",
];

function doneMessageIndex(puzzleId, arrayLength) {
  if (!puzzleId || arrayLength < 1) return 0;
  let n = 0;
  for (let i = 0; i < puzzleId.length; i++) n += puzzleId.charCodeAt(i);
  return Math.abs(n) % arrayLength;
}

/** Puzzle is "new" until this date (ISO string). Keep for ~2 weeks then remove or extend newUntil. */
function isPuzzleNew(puzzle) {
  return !!(puzzle && puzzle.newUntil && new Date() < new Date(puzzle.newUntil));
}

const isLocalhost = typeof window !== "undefined" && (window.location?.hostname === "localhost" || window.location?.hostname === "127.0.0.1");

/**
 * Legacy seat-model allowlist for counting (`LHO`/`RHO`/`DUMMY`/`DECLARER`).
 * Anything not listed here must be authored with compass seats + `seatMode: "compass"`.
 */
const COUNTING_LEGACY_SEAT_MODEL_IDS = new Set([
  "p1",
  "p1-2",
  "p1-3",
  "p1-4",
  "p1-5",
  "p1-6",
  "p1-7",
  "p1-8",
  "p1-9",
  "p1-10",
  "p1-11",
  "p1-12",
  "p1-13",
  "p1-14",
  "d2-2",
  "p2-2",
  "p2-3",
  "cp3-2",
]);

function mustUseCompassSeatModel({ categoryKey, puzzleId }) {
  if (categoryKey !== "counting") return false;
  if (!puzzleId) return false;
  return !COUNTING_LEGACY_SEAT_MODEL_IDS.has(puzzleId);
}

function CountingTrumpsTrainer({
  uid,
  subscriptionActive,
  tier: propsTier,
  paymentMethod,
  a,
  puzzlesOverride,
  trainerLabel = "Counting",
  categoryKey = "counting",
  location,
  history,
  completedPractice,
  dispatch,
  beginnerModeOverride = false,
  /** When true with beginnerModeOverride: puzzlesOverride is the full beginner library (no main-site featuredProblemIds filter). */
  beginnerIsolatedPuzzleList = false,
  /** Beginner Stages 1–3: hide Stage 1/2/3 tabs; list all problems in one row. */
  hideDifficultyTabs = false,
  puzzleIdWhitelist = null,
  categoryLabelsOverride = null,
  categoryPathOverrides = null,
  /** When set with beginner mode, only these category tabs are shown (e.g. Stage 1 only). */
  beginnerVisibleCategoryKeys = null,
  /** When set with beginner mode, replaces the built-in category tab row (keys, labels, paths). */
  beginnerCategoryTabsOverride = null,
  /** On /beginner/practice (declarer stage only): first N puzzles in that list are free for everyone. */
  beginnerPublicPracticeCount = 0,
}) {
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const [themeJumpSelection, setThemeJumpSelection] = useState("");
  const isAdmin = a === true;
  const mockUnsub = useMemo(() => {
    if (!location?.search) return false;
    return new URLSearchParams(location.search).get("mockUnsub") === "1";
  }, [location?.search]);
  const isMember = (isLocalhost && !mockUnsub) || isAdmin || !!subscriptionActive;
  const mockPaywall = useMemo(() => {
    if (!location?.search) return false;
    return new URLSearchParams(location.search).get("mockPaywall") === "1";
  }, [location?.search]);
  /** On localhost: ?mockTier=basic forces Basic tier (for testing locked video, upgrade prompt). */
  const mockTier = useMemo(() => {
    if (!isLocalhost || !location?.search) return null;
    const t = new URLSearchParams(location.search).get("mockTier");
    return t === "basic" || t === "premium" ? t : null;
  }, [location?.search]);
  const effectiveTier = mockTier || propsTier;
  const showSubscribeBanner = !isMember || (isLocalhost && mockPaywall);
  /** Beginner declarer/defence style: one flat row of hands (no “Problems” label, no Stage 1/2/3 strip). */
  const beginnerFlatHandNav = beginnerModeOverride && hideDifficultyTabs;
  const puzzlesAll = useMemo(() => {
    let list;
    if (Array.isArray(puzzlesOverride)) {
      list = puzzlesOverride;
    } else {
      const raw = PUZZLES;
      list = raw.filter((p) => p.id !== "d2-2");
    }
    if (!beginnerModeOverride) {
      return list;
    }

    // Isolated beginner files: list is already curated — never intersect with main-site featuredProblemIds.
    if (beginnerIsolatedPuzzleList) {
      if (puzzleIdWhitelist != null && Array.isArray(puzzleIdWhitelist) && puzzleIdWhitelist.length === 0) return [];
      let out = list;
      if (Array.isArray(puzzleIdWhitelist) && puzzleIdWhitelist.length > 0) {
        const positionById = new Map(puzzleIdWhitelist.map((id, idx) => [id, idx]));
        out = out.filter((p) => positionById.has(p?.id));
        out = [...out].sort((a, b) => {
          const aPos = positionById.has(a?.id) ? positionById.get(a.id) : Number.MAX_SAFE_INTEGER;
          const bPos = positionById.has(b?.id) ? positionById.get(b.id) : Number.MAX_SAFE_INTEGER;
          if (aPos !== bPos) return aPos - bPos;
          return (a?.id || "").localeCompare(b?.id || "");
        });
      }
      return out;
    }

    // Legacy: beginner view filtered from main trainer pools + beginnerModeConfig featuredProblemIds.
    if (Array.isArray(puzzleIdWhitelist) && puzzleIdWhitelist.length === 0) return [];
    let out = filterBeginnerTrainerPuzzles(list, categoryKey);
    if (Array.isArray(puzzleIdWhitelist) && puzzleIdWhitelist.length > 0) {
      const positionById = new Map(puzzleIdWhitelist.map((id, idx) => [id, idx]));
      out = out.filter((p) => positionById.has(p?.id));
      out = [...out].sort((a, b) => {
        const aPos = positionById.has(a?.id) ? positionById.get(a.id) : Number.MAX_SAFE_INTEGER;
        const bPos = positionById.has(b?.id) ? positionById.get(b.id) : Number.MAX_SAFE_INTEGER;
        if (aPos !== bPos) return aPos - bPos;
        return (a?.id || "").localeCompare(b?.id || "");
      });
    }
    return out;
  }, [puzzlesOverride, beginnerModeOverride, beginnerIsolatedPuzzleList, categoryKey, puzzleIdWhitelist]);

  const effectiveCategoryTabs = useMemo(() => {
    if (!beginnerModeOverride) return TRAINER_CATEGORY_TABS;
    if (Array.isArray(beginnerCategoryTabsOverride) && beginnerCategoryTabsOverride.length > 0) {
      return beginnerCategoryTabsOverride;
    }
    const mapped = TRAINER_CATEGORY_TABS.map((c) => ({
      ...c,
      label: categoryLabelsOverride?.[c.key] ?? c.label,
      path: categoryPathOverrides?.[c.key] ?? c.path,
    }));
    if (Array.isArray(beginnerVisibleCategoryKeys) && beginnerVisibleCategoryKeys.length > 0) {
      const allow = new Set(beginnerVisibleCategoryKeys);
      return mapped.filter((c) => allow.has(c.key));
    }
    return mapped;
  }, [
    beginnerModeOverride,
    beginnerCategoryTabsOverride,
    categoryLabelsOverride,
    categoryPathOverrides,
    beginnerVisibleCategoryKeys,
  ]);

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
    const byDiff = {};
    for (const p of puzzlesAll) {
      const d = Number(p?.difficulty || 1);
      if (!byDiff[d]) byDiff[d] = p?.id;
    }
    return byDiff;
  }, [puzzlesAll]);
  const puzzlesForDifficultyAll = useMemo(() => {
    if (hideDifficultyTabs) return puzzlesAll;
    return puzzlesAll.filter((p) => (p.difficulty || 1) === selectedDifficulty);
  }, [puzzlesAll, selectedDifficulty, hideDifficultyTabs]);
  const [puzzleIdxInDifficulty, setPuzzleIdxInDifficulty] = useState(0);

  /** Phones only — iPads are wider; we support tablet layout (see hand CSS max-width 1024px). */
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 480px)");
    const update = () => setIsMobileViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Deep-link: open specific problem/difficulty from ?problem=id and/or ?difficulty=N in URL
  useEffect(() => {
    if (!location?.search) return;
    const params = new URLSearchParams(location.search);
    const difficultyParam = params.get("difficulty");
    if (difficultyParam) {
      const d = Number(difficultyParam);
      if (d >= 1) setSelectedDifficulty(d);
    }
    const problemId = params.get("problem");
    if (!problemId || !puzzlesAll.length) return;
    const puzzle = puzzlesAll.find((p) => p.id === problemId);
    if (!puzzle) return;
    const diff = Number(puzzle.difficulty || 1);
    const inDiff = puzzlesAll.filter((p) => (p.difficulty || 1) === diff);
    const idx = inDiff.findIndex((p) => p.id === problemId);
    if (idx >= 0) {
      setSelectedDifficulty(diff);
      setPuzzleIdxInDifficulty(idx);
    }
  }, [location?.search, puzzlesAll]);

  // GA4: fire once per trainer view (when user lands on this practice section)
  const practiceViewSentRef = useRef(false);
  useEffect(() => {
    if (practiceViewSentRef.current || !categoryKey || !trainerLabel) return;
    practiceViewSentRef.current = true;
    sendPracticeEvent("practice_view", {
      trainer: trainerLabel,
      category_key: categoryKey,
    });
  }, [categoryKey, trainerLabel]);

  const completedStorageKey = `bridgechamps_trainer_completed_${categoryKey}`;
  const [completedProblemIds, setCompletedProblemIds] = useState(() => {
    try {
      const fromRedux = completedPractice && completedPractice[categoryKey];
      if (Array.isArray(fromRedux) && fromRedux.length > 0) {
        const obj = {};
        fromRedux.forEach((id) => { obj[id] = true; });
        return obj;
      }
      if (typeof localStorage === "undefined") return {};
      const raw = localStorage.getItem(completedStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });
  useEffect(() => {
    const fromRedux = completedPractice && completedPractice[categoryKey];
    if (Array.isArray(fromRedux) && fromRedux.length > 0) {
      const fromReduxObj = {};
      fromRedux.forEach((id) => { fromReduxObj[id] = true; });
      setCompletedProblemIds((prev) => ({ ...fromReduxObj, ...prev }));
    }
  }, [completedPractice, categoryKey]);
  useEffect(() => {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(completedStorageKey, JSON.stringify(completedProblemIds));
    } catch (e) {}
  }, [completedStorageKey, completedProblemIds]);
  const hasPuzzles = puzzlesForDifficultyAll.length > 0;
  const isBlankDifficulty = !hasPuzzles;
  const previewPuzzleIdForSelectedDifficulty = previewPuzzleIdByDifficulty?.[selectedDifficulty] || null;
  const previewIdxInDifficulty = useMemo(() => {
    if (!previewPuzzleIdForSelectedDifficulty) return 0;
    const idx = puzzlesForDifficultyAll.findIndex((p) => p.id === previewPuzzleIdForSelectedDifficulty);
    return idx >= 0 ? idx : 0;
  }, [puzzlesForDifficultyAll, previewPuzzleIdForSelectedDifficulty]);
  const effectivePuzzleIdx = puzzleIdxInDifficulty;
  const trialStarterProblemId = TRIAL_STARTER_IDS_BY_CATEGORY?.[categoryKey] || null;
  const freeProblemIdsForCategory = FREE_PROBLEM_IDS_BY_CATEGORY?.[categoryKey];
  const hasExplicitFreeListForCategory =
    FREE_PROBLEM_IDS_BY_CATEGORY != null &&
    Object.prototype.hasOwnProperty.call(FREE_PROBLEM_IDS_BY_CATEGORY, categoryKey);
  const currentProblemId = puzzlesForDifficultyAll[puzzleIdxInDifficulty]?.id || null;
  const isFreeProblem = (problemId) => {
    if (!problemId) return false;
    if (
      beginnerModeOverride &&
      beginnerIsolatedPuzzleList &&
      beginnerPublicPracticeCount > 0 &&
      categoryKey === "declarer"
    ) {
      const idx = puzzlesForDifficultyAll.findIndex((p) => p.id === problemId);
      if (idx >= 0 && idx < beginnerPublicPracticeCount) return true;
    }
    if (hasExplicitFreeListForCategory) {
      return Array.isArray(freeProblemIdsForCategory) && freeProblemIdsForCategory.includes(problemId);
    }
    return (
      (!!trialStarterProblemId && problemId === trialStarterProblemId) ||
      (!!previewPuzzleIdForSelectedDifficulty && problemId === previewPuzzleIdForSelectedDifficulty)
    );
  };
  const currentPuzzleIsPreview =
    !hasExplicitFreeListForCategory &&
    !isMember &&
    previewPuzzleIdForSelectedDifficulty &&
    puzzlesForDifficultyAll[puzzleIdxInDifficulty]?.id === previewPuzzleIdForSelectedDifficulty;
  const isTrialStarterProblem = (problemId) => !!problemId && !!trialStarterProblemId && problemId === trialStarterProblemId;
  const currentPuzzleIsFree = !isMember && isFreeProblem(currentProblemId);
  /** Theme / per-problem intro videos: premium, admin, or any puzzle the table treats as free (e.g. first N beginner hands). */
  const currentPuzzleVideoUnlocked =
    effectiveTier === "premium" || isAdmin || isFreeProblem(currentProblemId);
  const showPaywallOverlay = !isMember && !currentPuzzleIsFree && !currentPuzzleIsPreview && !isBlankDifficulty;

  // Always provide a puzzle object to keep hook order stable;
  // when a difficulty is blank we render a placeholder instead of the table.
  const rawPuzzle = hasPuzzles
    ? puzzlesForDifficultyAll[effectivePuzzleIdx] || puzzlesForDifficultyAll[0]
    : puzzlesAll[0] || fallbackPuzzle;

  /** New-format puzzles only (`seatMode: "compass"`); legacy puzzles pass through unchanged. */
  const rawPuzzleResolved = useMemo(() => {
    if (mustUseCompassSeatModel({ categoryKey, puzzleId: rawPuzzle?.id }) && rawPuzzle?.seatMode !== "compass") {
      throw new Error(`Counting problem "${rawPuzzle?.id}" must use seatMode: "compass" (compass-only authoring).`);
    }
    if (rawPuzzle?.seatMode === "compass") return compassPuzzleToLegacy(rawPuzzle);
    return rawPuzzle;
  }, [rawPuzzle, categoryKey]);

  const contractText = contractToText(rawPuzzleResolved);
  const auctionText = auctionToText(rawPuzzleResolved);

  // Viewer is always a compass seat (N/E/S/W) for true-table orientation.
  const viewerCompass = rawPuzzleResolved.viewerCompass || "S";
  const dealerCompass = rawPuzzleResolved.dealerCompass || "N";
  const declarerCompass = useMemo(() => {
    if (rawPuzzleResolved.declarerCompass) return rawPuzzleResolved.declarerCompass;
    const inferred = inferDeclarerCompassFromAuction({ auctionText, dealerCompass });
    return inferred || "S";
  }, [rawPuzzleResolved.id, rawPuzzleResolved.declarerCompass, auctionText, dealerCompass]);

  // Normalize full tricks to clockwise compass order from the leader (N→E→S→W).
  // Uses seatCompassMaps (compassTable / buildSeatCompassMaps) for declarer-relative geometry.
  const puzzle = useMemo(
    () => ({
      ...rawPuzzleResolved,
      rounds: normalizeRoundsClockwise(rawPuzzleResolved.rounds || [], declarerCompass),
    }),
    [rawPuzzleResolved, declarerCompass]
  );

  const declarerCompassName = useMemo(() => {
    const map = { N: "North", E: "East", S: "South", W: "West" };
    return map[declarerCompass] || declarerCompass;
  }, [declarerCompass]);

  const contractDisplayText = useMemo(() => {
    if (puzzle?.promptOptions?.contractLabel) return puzzle.promptOptions.contractLabel;
    if (!contractText) return "";
    if (puzzle?.promptOptions?.contractOnly) return `Contract is ${contractText}`;
    return `Contract is ${contractText} by ${declarerCompassName}`;
  }, [contractText, declarerCompassName, puzzle?.promptOptions?.contractOnly, puzzle?.promptOptions?.contractLabel]);

  const seatAtCompass = useMemo(() => {
    const out = { N: "DUMMY", E: "RHO", S: "DECLARER", W: "LHO" };
    out[declarerCompass] = "DECLARER";
    out[partnerCompass(declarerCompass)] = "DUMMY";
    if (declarerCompass === "N" || declarerCompass === "S") {
      out.W = "LHO";
      out.E = "RHO";
    } else {
      out[lhoCompass(declarerCompass)] = "LHO";
      out[rhoCompass(declarerCompass)] = "RHO";
    }
    return out;
  }, [declarerCompass]);

  /*
   * Screen layout is viewer-centric: "You" always sit at the bottom (South of the diagram).
   * Top = partner (compass opposite). Left/right = the two lateral seats: rho(viewer) on left,
   * lho(viewer) on right — matches a clockwise compass read (N→E→S→W) with you at bottom.
   */
  const { seatTop, seatRight, seatBottom, seatLeft } = useMemo(() => {
    const v = viewerCompass;
    return {
      seatBottom: seatAtCompass[v],
      seatTop: seatAtCompass[partnerCompass(v)],
      seatLeft: seatAtCompass[rhoCompass(v)],
      seatRight: seatAtCompass[lhoCompass(v)],
    };
  }, [seatAtCompass, viewerCompass]);

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
  const playedFromHandRef = useRef(playedFromHand);
  useEffect(() => {
    playedFromHandRef.current = playedFromHand;
  }, [playedFromHand]);
  /** When user is asked to "play a card" (PLAY_CARD prompt), the card they clicked; null otherwise. */
  const [userPlayedCard, setUserPlayedCard] = useState(null);
  /** When PLAY_CARD uses playCardAutoPlaysBefore, false until those cards are on the table (user cannot act yet). */
  const [playCardAutoPhaseDone, setPlayCardAutoPhaseDone] = useState(true);
  /** For playCardUserPlaysDummyFirst: dummy_lead → wait_rho → declarer. */
  const [playCardInteractiveStep, setPlayCardInteractiveStep] = useState(null);
  const playCardDummyAfterTimeoutRef = useRef(null);
  /** PLAY_CARD stagger: ids for follow-card timeouts (cleared on continue / next play). */
  const playCardFollowStaggerTimeoutsRef = useRef([]);

  const dummyHandFanRef = useRef(null);
  const declarerHandFanRef = useRef(null);
  /** Trump-only strips (`!showFullHands`): measure + match pip tiles when no full fan ref. */
  const declarerTrumpStripRef = useRef(null);
  const dummyTrumpStripRef = useRef(null);
  const lhoHandFanRef = useRef(null);
  const rhoHandFanRef = useRef(null);
  const prevHandRectsRef = useRef({ LHO: {}, DUMMY: {}, RHO: {}, DECLARER: {} });

  // Prompt flow
  const [promptStep, setPromptStep] = useState(null); // null | "DEFENDERS_STARTED" | "DEFENDERS_REMAINING" | "DISTRIBUTION" | "DONE"
  const [postPromptIdx, setPostPromptIdx] = useState(0);
  const [currentPostPrompts, setCurrentPostPrompts] = useState([]);
  const [feedback, setFeedback] = useState(null); // { type: "ok"|"error", text }
  const [stickyRevealFullHandSeats, setStickyRevealFullHandSeats] = useState([]);
  const [waitingForContinue, setWaitingForContinue] = useState(false);
  const pendingAdvanceRef = useRef(null);
  const promptDoneRef = useRef(null);
  const [successFeedbackFading, setSuccessFeedbackFading] = useState(false);
  /** Set when user clicks Continue from PLAY_CARD_REVEAL; used so custom watch note only shows after first explanation. */
  const continuedFromPlayCardRevealRef = useRef(false);
  const enableUnifiedPromptCtaFlow =
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(window.location?.hostname || "");
  const promptStepRef = useRef(promptStep);
  const completedRoundIdxRef = useRef(completedRoundIdx);
  const isPlayingRef = useRef(isPlaying);
  const hasStartedRef = useRef(false);

  const runPendingAdvance = () => {
    const fn = pendingAdvanceRef.current;
    pendingAdvanceRef.current = null;
    setWaitingForContinue(false);
    setFeedback(null);
    if (fn) fn();
  };
  const hasFollowUpPromptQueued = () => {
    if (Array.isArray(currentPostPrompts) && postPromptIdx + 1 < currentPostPrompts.length) return true;
    if (
      promptStep === "DEFENDERS_STARTED" &&
      prePrompts?.[0] === "DEFENDERS_STARTED" &&
      puzzle?.promptOptions?.defendersHeartsStartedExpected != null
    ) {
      return true;
    }
    if (promptStep === "PLAY_DECISION_REVEAL" && !activeCustomPrompt?.noContinue) return true;
    return false;
  };
  const canAdvanceToNextTrickFromSuccess = () =>
    enableUnifiedPromptCtaFlow &&
    manualTrickMode &&
    hasStarted &&
    completedRoundIdx < lastRoundIdx &&
    !hasFollowUpPromptQueued();
  useEffect(() => {
    setStickyRevealFullHandSeats([]);
  }, [puzzle?.id]);

  const runSuccessPrimaryCta = () => {
    const fn = pendingAdvanceRef.current;
    pendingAdvanceRef.current = null;
    setWaitingForContinue(false);
    setSuccessFeedbackFading(true);
    setTimeout(() => {
      setFeedback(null);
      setSuccessFeedbackFading(false);
      if (fn) fn();
    }, 170);
    if (!canAdvanceToNextTrickFromSuccess()) return;
    setTimeout(() => {
      const canAdvanceNow =
        manualTrickMode &&
        hasStartedRef.current &&
        !isPlayingRef.current &&
        !promptStepRef.current &&
        completedRoundIdxRef.current >= -1 &&
        completedRoundIdxRef.current < lastRoundIdx;
      if (!canAdvanceNow) return;
      playOneTrick(completedRoundIdxRef.current + 1, { ignorePromptLock: true });
    }, 220);
  };

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
  const [trickCountPrefillKey, setTrickCountPrefillKey] = useState(null);
  const [shapeIntroSeatKey, setShapeIntroSeatKey] = useState(null);
  const [declarerTrumpGuessInput, setDeclarerTrumpGuessInput] = useState("");
  const [seatSuitCountInput, setSeatSuitCountInput] = useState("");
  const [seatSuitCountKey, setSeatSuitCountKey] = useState(null);
  const [singleNumberInput, setSingleNumberInput] = useState("");
  const [activeCustomPrompt, setActiveCustomPrompt] = useState(null);
  /** PLAY_CARD: seat whose hand is clickable (defaults to declarer for legacy beginner puzzles). */
  const playCardResponderLegacySeat = useMemo(() => {
    const raw = activeCustomPrompt?.playCardResponderSeat;
    if (
      promptStep === "PLAY_CARD" &&
      activeCustomPrompt?.type === "PLAY_CARD" &&
      typeof raw === "string" &&
      SEATS.includes(raw)
    ) {
      return raw;
    }
    return "DECLARER";
  }, [promptStep, activeCustomPrompt?.type, activeCustomPrompt?.playCardResponderSeat]);
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

  const puzzleIdWhenReachedDoneRef = useRef(null);

  useEffect(() => {
    if (promptStep === "DONE" && promptDoneRef.current) {
      promptDoneRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [promptStep]);

  /** Latest handler for optional PLAY_CARD reveal auto-continue (see `playCardAutoContinueRevealMs` on custom prompts). */
  const continueAfterPlayCardRevealFnRef = useRef(() => {});

  useEffect(() => {
    if (promptStep !== "PLAY_CARD_REVEAL" || !playDecisionReveal?.fromPlayCard) return undefined;
    const promptId = playDecisionReveal.promptId;
    const list = puzzle?.promptOptions?.customPrompts;
    const cfg = Array.isArray(list) ? list.find((p) => p.id === promptId) : null;
    if (!cfg || cfg.playCardAutoContinueRevealMs == null) return undefined;
    const ms = Number(cfg.playCardAutoContinueRevealMs);
    if (!Number.isFinite(ms) || ms < 0) return undefined;
    const timer = window.setTimeout(() => {
      continueAfterPlayCardRevealFnRef.current();
    }, ms);
    return () => window.clearTimeout(timer);
  }, [promptStep, playDecisionReveal?.fromPlayCard, playDecisionReveal?.promptId, puzzle?.promptOptions?.customPrompts]);

  useEffect(() => {
    if (!puzzle?.id) return;
    const done = promptStep === "DONE";
    const noContinueReveal = promptStep === "PLAY_DECISION_REVEAL" && activeCustomPrompt?.noContinue;
    // If we're in DONE/reveal state but just switched to a different puzzle (e.g. clicked next tab), don't mark this puzzle complete — the DONE state is from the previous puzzle.
    if (puzzleIdWhenReachedDoneRef.current !== puzzle.id && (done || noContinueReveal)) {
      puzzleIdWhenReachedDoneRef.current = puzzle.id;
      return;
    }
    if (done || noContinueReveal) {
      setCompletedProblemIds((prev) => {
        if (prev[puzzle.id]) return prev;
        sendPracticeEvent("practice_problem_complete", {
          trainer: trainerLabel,
          category_key: categoryKey,
          puzzle_id: puzzle.id,
          difficulty: puzzle.difficulty ?? 1,
        });
        if (uid && categoryKey && puzzle?.id) dispatch(savePracticeCompletion(uid, categoryKey, puzzle.id));
        return { ...prev, [puzzle.id]: true };
      });
    }
    puzzleIdWhenReachedDoneRef.current = puzzle.id;
  }, [puzzle?.id, puzzle?.difficulty, promptStep, activeCustomPrompt?.noContinue, uid, categoryKey, trainerLabel, dispatch]);

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
  useLayoutEffect(() => {
    promptStepRef.current = promptStep;
  }, [promptStep]);
  useLayoutEffect(() => {
    completedRoundIdxRef.current = completedRoundIdx;
  }, [completedRoundIdx]);
  useLayoutEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useLayoutEffect(() => {
    hasStartedRef.current = hasStarted;
  }, [hasStarted]);
  // When contractLabel is intro-only, hide it after Start so it doesn't show again as "Contract is — by South"
  const effectiveContractDisplayText = useMemo(() => {
    if (puzzle?.promptOptions?.contractLabelBeforeStartOnly && hasStarted && puzzle?.promptOptions?.contractLabel) return "";
    return contractDisplayText;
  }, [contractDisplayText, hasStarted, puzzle?.promptOptions?.contractLabel, puzzle?.promptOptions?.contractLabelBeforeStartOnly]);
  const showBeginnerLessonContractBanner = useMemo(
    () =>
      beginnerModeOverride &&
      beginnerIsolatedPuzzleList &&
      !!puzzle?.promptOptions?.contractLabel &&
      !!String(effectiveContractDisplayText || "").trim(),
    [
      beginnerModeOverride,
      beginnerIsolatedPuzzleList,
      puzzle?.promptOptions?.contractLabel,
      effectiveContractDisplayText,
    ]
  );
  // Theme label text is explicit-only (set `themeLabel` on the puzzle). Do not infer from `promptThemeTint`.
  const effectiveThemeLabel = useMemo(
    () => String(puzzle?.promptOptions?.themeLabel || "").trim(),
    [puzzle?.promptOptions?.themeLabel]
  );
  const activeThemeTint = puzzle?.promptOptions?.promptThemeTint || "";
  const activeThemeIntro = useMemo(() => {
    if (!puzzle?.promptOptions?.useThemePackIntro || !activeThemeTint) return null;
    return THEME_INTRO_BY_TINT?.[activeThemeTint] || null;
  }, [puzzle?.promptOptions?.useThemePackIntro, activeThemeTint]);
  const activeThemeIntroUrl = (activeThemeIntro?.url || "").trim();
  const perProblemIntroVideoUrl = (puzzle?.promptOptions?.videoUrlBeforeStart || "").trim();
  const normalizeVideoUrl = (url = "") => url.replace(/\/+$/, "");
  const themeIntroIsDistinct = !!activeThemeIntroUrl && normalizeVideoUrl(activeThemeIntroUrl) !== normalizeVideoUrl(perProblemIntroVideoUrl);
  const effectiveThemeIntroUrl = themeIntroIsDistinct ? activeThemeIntroUrl : "";
  const activeThemeIntroVersion = Number(activeThemeIntro?.version || 1);
  const themeIntroStorageKey = useMemo(() => {
    if (!activeThemeTint || !effectiveThemeIntroUrl) return "";
    const userKey = uid || "anon";
    return `bridgechamps_theme_intro_seen_${activeThemeTint}_${userKey}_${activeThemeIntroVersion}`;
  }, [activeThemeTint, effectiveThemeIntroUrl, activeThemeIntroVersion, uid]);
  const [themeIntroExpanded, setThemeIntroExpanded] = useState(false);
  useEffect(() => {
    if (!themeIntroStorageKey) {
      setThemeIntroExpanded(false);
      return;
    }
    let seen = false;
    try {
      seen = typeof localStorage !== "undefined" && localStorage.getItem(themeIntroStorageKey) === "1";
    } catch (e) {
      seen = false;
    }
    setThemeIntroExpanded(!seen);
  }, [themeIntroStorageKey]);
  const markThemeIntroSeen = () => {
    if (!themeIntroStorageKey) return;
    try {
      if (typeof localStorage !== "undefined") localStorage.setItem(themeIntroStorageKey, "1");
    } catch (e) {}
    setThemeIntroExpanded(false);
  };
  const showThemeIntroAgain = () => setThemeIntroExpanded(true);
  const usingThemeIntro = !!effectiveThemeIntroUrl;
  const showThemeIntroInRail = usingThemeIntro && themeIntroExpanded;
  const showPerProblemIntroInRail = !!perProblemIntroVideoUrl;
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

  // Empty `rounds: []` means question-only (e.g. bidding): must be -1 so we finish to DONE, not "watch play".
  const _roundLen = puzzle.rounds?.length;
  const lastRoundIdx = _roundLen === 0 ? -1 : (_roundLen ?? 1) - 1;
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
    // "You" is defined per-problem by `viewerCompass`, mapped to an internal seat key (`viewerSeat`).
    // If a puzzle explicitly sets visible seats, honour it across trainers (useful for build/test setups).
    const youSeat = viewerSeat;
    const vf = puzzle?.visibleFullHandSeats;
    if (Array.isArray(vf) && vf.length > 0) {
      return [...new Set(vf)];
    }
    // Bidding mode is strict: only show the viewer's hand unless a puzzle explicitly reveals more.
    if (categoryKey === "bidding") {
      return [youSeat];
    }
    const hasDummy = isFullHandShape(puzzle?.shownHands?.DUMMY);
    const out = [youSeat];
    if (hasDummy) out.push("DUMMY");
    const merged = [...new Set(out)];
    if (
      isCompassTrainerEngine(puzzle) &&
      puzzleHasPlayInHand(puzzle) &&
      puzzle?.shownHands &&
      Object.prototype.hasOwnProperty.call(puzzle.shownHands, "DUMMY")
    ) {
      if (!merged.includes("DUMMY")) merged.push("DUMMY");
      if (!merged.includes(youSeat)) merged.push(youSeat);
    }
    return merged;
  }, [viewerSeat, puzzle?.shownHands, puzzle?.visibleFullHandSeats, puzzle?.rounds, puzzle?.trainerEngine, categoryKey]);

  const visibleFullHandSeats = useMemo(() => {
    const baseWithSticky = [...new Set([...(visibleFullHandSeatsBase || []), ...(stickyRevealFullHandSeats || [])])];
    // At the end: if puzzle has revealFullHandsAtEnd, add those seats to the base list; otherwise reveal all.
    if (promptStep === "DONE") {
      const toReveal = puzzle.revealFullHandsAtEnd;
      if (Array.isArray(toReveal) && toReveal.length > 0) {
        const combined = [...new Set([...baseWithSticky, ...toReveal])];
        return combined;
      }
      // Bidding is strict unless explicitly configured per puzzle.
      if (categoryKey === "bidding") return baseWithSticky;
      return SEATS;
    }
    // Optional: reveal extra full hands during a PLAY_DECISION reveal (e.g. show dummy after “Continue”).
    if (promptStep === "PLAY_DECISION_REVEAL") {
      const extraReveal = activeCustomPrompt?.revealFullHandSeats;
      if (Array.isArray(extraReveal) && extraReveal.length > 0 && !activeCustomPrompt?.revealFullHandSeatsOnContinue) {
        return [...new Set([...baseWithSticky, ...extraReveal])];
      }
    }
    // When showing a noContinue reveal, treat as end of hand and show full hand if puzzle has all four in shownHands.
    if (
      categoryKey === "bidding" &&
      promptStep === "PLAY_DECISION_REVEAL" &&
      activeCustomPrompt?.noContinue
    ) {
      if (SEATS.every((s) => isFullHandShape(puzzle.shownHands?.[s]))) return SEATS;
      return baseWithSticky;
    }
    if (promptStep === "PLAY_DECISION_REVEAL" && activeCustomPrompt?.noContinue && SEATS.every((s) => isFullHandShape(puzzle.shownHands?.[s]))) return SEATS;
    return baseWithSticky;
  }, [
    promptStep,
    visibleFullHandSeatsBase,
    stickyRevealFullHandSeats,
    activeCustomPrompt?.noContinue,
    activeCustomPrompt?.revealFullHandSeats,
    activeCustomPrompt?.revealFullHandSeatsOnContinue,
    puzzle.shownHands,
    puzzle.revealFullHandsAtEnd,
    categoryKey,
  ]);

  const showFullHands = useMemo(() => {
    return visibleFullHandSeats.every((seat) => isFullHandShape(puzzle.shownHands?.[seat]));
  }, [puzzle.shownHands, visibleFullHandSeats]);

  /**
   * Which compass seats show full pip hands on the bottom-row bridge grid (N=8, E=4, S=2, W=1).
   * Drives `.ct-table--handsMask{n}` for phone/tablet layout — independent of `ct-table--westVisible`
   * (westVisible is true whenever the left seat has a hand, including dummy-on-west).
   */
  const fullHandsCornerMask = useMemo(() => {
    if (!showFullHands) return 0;
    let m = 0;
    if (visibleFullHandSeats.includes(seatTop)) m |= 8;
    if (visibleFullHandSeats.includes(seatRight)) m |= 4;
    if (visibleFullHandSeats.includes(seatBottom)) m |= 2;
    if (visibleFullHandSeats.includes(seatLeft)) m |= 1;
    return m;
  }, [showFullHands, visibleFullHandSeats, seatTop, seatRight, seatBottom, seatLeft]);

  /**
   * Phones: measure a live wide-seat fan tile (prefer declarer / “You”) and expose as --ct-trainerPipPx
   * so suit rows + trick use the same pixel width as that row (not a separate clamp).
   */
  const [trainerPipTilePx, setTrainerPipTilePx] = useState(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !isMobileViewport) {
      setTrainerPipTilePx(null);
      return;
    }

    const pickFanEl = () => {
      for (const ref of [declarerHandFanRef, dummyHandFanRef, lhoHandFanRef, rhoHandFanRef]) {
        const el = ref.current;
        if (!el?.isConnected) continue;
        const tiles = el.querySelectorAll(".ct-miniCard.ct-miniCard--fan:not(.ct-miniCard--ghost)");
        if (tiles.length < 10) continue;
        return el;
      }
      return null;
    };

    let ro;
    let raf = 0;
    const measure = () => {
      const fan = pickFanEl();
      if (!fan) {
        setTrainerPipTilePx(null);
        return;
      }
      const first = fan.querySelector(".ct-miniCard.ct-miniCard--fan:not(.ct-miniCard--ghost)");
      if (!first) {
        setTrainerPipTilePx(null);
        return;
      }
      const w = first.getBoundingClientRect().width;
      if (w < 8 || w > 120) {
        setTrainerPipTilePx(null);
        return;
      }
      const rounded = Math.round(w * 100) / 100;
      setTrainerPipTilePx((prev) => (prev === rounded ? prev : rounded));
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    schedule();
    const fanForRo = pickFanEl();
    if (fanForRo) {
      ro = new ResizeObserver(schedule);
      ro.observe(fanForRo);
    }
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
    };
  }, [
    isMobileViewport,
    puzzle?.id,
    showFullHands,
    hasStarted,
    progressRoundIdx,
    promptStep,
    playedFromHand,
    visibleFullHandSeats,
    beginnerModeOverride,
  ]);

  const trainerPipPageStyle = useMemo(() => {
    if (!isMobileViewport || trainerPipTilePx == null) return undefined;
    return { "--ct-trainerPipPx": `${trainerPipTilePx}px` };
  }, [isMobileViewport, trainerPipTilePx]);

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
    const trickCountAlreadyAsked = !!askedRef.current?.trickCountAsked;
    const eligible = all.filter((p) => {
      const at = Number(p?.atRoundIdx);
      const atOk = Number.isFinite(at) ? throughRoundIdx >= at : false;
      if (p?.type === "TRICK_COUNT" && trickCountAlreadyAsked) return false;
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
    setUserPlayedCard(null);
    setPlayCardAutoPhaseDone(true);
    setPlayCardInteractiveStep(null);
    if (playCardDummyAfterTimeoutRef.current) {
      clearTimeout(playCardDummyAfterTimeoutRef.current);
      playCardDummyAfterTimeoutRef.current = null;
    }
    setPostPromptIdx(0);
    setCurrentPostPrompts([]);
    setPauseIdx(0);
    setNextRoundToPlay(0);
    autoStartedRef.current = false;
    setHasStarted(false);
    setPromptStep(null);
    setFeedback(null);
    setWaitingForContinue(false);
    pendingAdvanceRef.current = null;
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
    setTrickCountPrefillKey(null);
    setDeclarerTrumpGuessInput("");
    setSeatSuitCountInput("");
    setSingleNumberInput("");
    setActiveCustomPrompt(null);
    setPlayDecisionReveal(null);
    setDoneExtraText(null);
    continuedFromPlayCardRevealRef.current = false;
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
          playedMap[p.seat] = { ...(playedMap[p.seat] || {}), [key]: true };
          if (isTrump(p.card, puzzle.trumpSuit)) {
            rem = { ...rem, [p.seat]: removeCardFromHand(rem[p.seat], p.card) };
          }
        }
      }
      // Learner cards played via PLAY_CARD are often omitted from `rounds`; remove them from remaining hands.
      const prevPf = playedFromHandRef.current || {};
      for (const seat of ["DECLARER", "DUMMY", "LHO", "RHO"]) {
        const extra = prevPf[seat] || {};
        for (const k of Object.keys(extra)) {
          const c = cardFromPlayedKey(k);
          if (!c || !isTrump(c, puzzle.trumpSuit)) continue;
          rem = { ...rem, [seat]: removeCardFromHand(rem[seat], c) };
        }
      }
      const lastPlays = puzzle.rounds?.[end]?.plays || [];
      lastTrick = { LHO: null, DUMMY: null, RHO: null, DECLARER: null };
      for (const p of lastPlays) lastTrick[p.seat] = p.card;
    }

    // Rounds often omit the user's last card (played via PLAY_CARD). Merge prior declarer plays
    // so Continue after a reveal does not put those cards back in the hand.
    setPlayedFromHand((prev) => {
      if (end < 0) return playedMap;
      return {
        LHO: { ...(playedMap.LHO || {}), ...(prev?.LHO || {}) },
        DUMMY: { ...(playedMap.DUMMY || {}), ...(prev?.DUMMY || {}) },
        RHO: { ...(playedMap.RHO || {}), ...(prev?.RHO || {}) },
        DECLARER: { ...(playedMap.DECLARER || {}), ...(prev?.DECLARER || {}) },
      };
    });
    setRemainingHands(rem);
    // Rounds may omit the learner's card (PLAY_CARD). For partial tricks, merge any missing seat from prev.
    setTrickCards((prev) => {
      if (end < 0) return { LHO: null, DUMMY: null, RHO: null, DECLARER: null };
      const lastPlays = puzzle.rounds?.[end]?.plays || [];
      const merged = { ...lastTrick };
      if (lastPlays.length < 4 && prev) {
        for (const s of SEATS) {
          if (!merged[s] && prev[s]) merged[s] = prev[s];
        }
      } else if (!merged.DECLARER && prev?.DECLARER) {
        merged.DECLARER = prev.DECLARER;
      }
      return merged;
    });
    setRoundIdx(Math.max(0, end));
    setPlayIdx(end >= 0 ? (puzzle.rounds?.[end]?.plays || []).length - 1 : -1);
    setCompletedRoundIdx(end);
    setPromptStep(null);
    setFeedback(null);
    setPostPromptIdx(0);
    setCurrentPostPrompts([]);
  };

  // PLAY_CARD: optional scripted cards before the user (e.g. dummy leads, RHO follows low).
  useEffect(() => {
    if (promptStep !== "PLAY_CARD" || activeCustomPrompt?.type !== "PLAY_CARD") {
      setPlayCardAutoPhaseDone(true);
      setPlayCardInteractiveStep(null);
      return;
    }
    if (activeCustomPrompt.playCardUserPlaysDummyFirst) {
      setPlayCardInteractiveStep("dummy_lead");
      setPlayCardAutoPhaseDone(false);
      setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });
      return;
    }
    const before = activeCustomPrompt.playCardAutoPlaysBefore;
    const keepExistingTrick = !!activeCustomPrompt.playCardKeepExistingTrickCards;
    // Click dummy first (after a lead, or to start a fresh trick): W/DUMMY/E/… flow — see handleDummyPlayCard.
    if (activeCustomPrompt.playCardNextClickFromDummy && !activeCustomPrompt.playCardUserPlaysDummyFirst) {
      setPlayCardInteractiveStep("dummy_follow");
      setPlayCardAutoPhaseDone(false);
      if (!keepExistingTrick) {
        setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });
      }
      return;
    }
    if (!Array.isArray(before) || before.length === 0) {
      setPlayCardAutoPhaseDone(true);
      setPlayCardInteractiveStep(null);
      // New trick: clear the table when there is no scripted preface (e.g. learner leads after winning).
      if (!keepExistingTrick) {
        setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });
      }
      return;
    }
    // Scripted preface already on the table (e.g. user advanced with Next →); do not replay.
    if (activeCustomPrompt.playCardKeepExistingTrickCards) {
      setPlayCardAutoPhaseDone(true);
      setPlayCardInteractiveStep(null);
      return;
    }

    let cancelled = false;
    const staggerMs = 380;
    setPlayCardAutoPhaseDone(false);
    setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });

    let trick = { LHO: null, DUMMY: null, RHO: null, DECLARER: null };
    before.forEach((play, i) => {
      setTimeout(() => {
        if (cancelled) return;
        const seat = play?.seat;
        const card = play?.card;
        if (!seat || !card) return;
        trick = { ...trick, [seat]: card };
        setTrickCards({ ...trick });
        setPlayedFromHand((prev) => ({
          ...prev,
          [seat]: { ...(prev[seat] || {}), [`${card.rank}${card.suit}`]: true },
        }));
        if (isTrump(card, puzzle.trumpSuit)) {
          setRemainingHands((prev) => ({
            ...prev,
            [seat]: removeCardFromHand(prev[seat], card),
          }));
        }
      }, i * staggerMs);
    });

    const doneMs = Math.max(0, (before.length - 1) * staggerMs) + 50;
    const doneId = setTimeout(() => {
      if (!cancelled) setPlayCardAutoPhaseDone(true);
    }, doneMs);

    return () => {
      cancelled = true;
      clearTimeout(doneId);
    };
  }, [
    promptStep,
    activeCustomPrompt?.id,
    activeCustomPrompt?.type,
    activeCustomPrompt?.playCardUserPlaysDummyFirst,
    activeCustomPrompt?.playCardNextClickFromDummy,
    activeCustomPrompt?.playCardKeepExistingTrickCards,
    puzzle.id,
    puzzle.trumpSuit,
    visibleFullHandSeats,
  ]);

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
          setPlayedFromHand((prev) => ({
            ...prev,
            [p.seat]: { ...(prev[p.seat] || {}), [`${p.card.rank}${p.card.suit}`]: true },
          }));
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

  const playOneTrick = (idx, opts = {}) => {
    const { ignorePromptLock = false } = opts;
    if (idx < 0 || idx > lastRoundIdx) return;
    if (!ignorePromptLock && promptStep && promptStep !== "DONE") return; // must answer prompts before advancing
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

    // User advances trick 1 with Next (completedRoundIdx stays -1 until first Next).
    if (puzzle?.promptOptions?.skipAutoPlayOnStart) {
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

  // Reset when the puzzle changes; learner taps Start to begin (all categories + beginner).
  useLayoutEffect(() => {
    resetForPuzzle();
  }, [puzzle.id, beginnerModeOverride]);

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
    // Text-only bidding drills: no hand diagram (no placeholder 13-card strip).
    if (categoryKey === "bidding" && puzzle?.promptOptions?.hideBiddingHand) {
      return null;
    }
    const miniTrumpPresentation = puzzle?.promptOptions?.miniTrumpHandPresentation;
    const trumpStripRef =
      seat === "DECLARER" ? declarerTrumpStripRef : seat === "DUMMY" ? dummyTrumpStripRef : null;
    const handCardsAsCardsClassName = [
      "ct-handCardsAsCards",
      miniTrumpPresentation === "compactOneRow" && "ct-handCardsAsCards--miniTrumpCompactRow",
      miniTrumpPresentation === "twoRows7_6" && "ct-handCardsAsCards--miniTrumpTwoRows76",
    ]
      .filter(Boolean)
      .join(" ");
    /** Ace-left (high to low): `rankSortValue` is lower for stronger ranks — sort ascending on it. */
    const orderMiniTrumpStripCards = (cardObjs) => {
      if (!miniTrumpPresentation || !Array.isArray(cardObjs) || cardObjs.length === 0) return cardObjs;
      return [...cardObjs].sort((a, b) => rankSortValue(a.rank) - rankSortValue(b.rank));
    };
    if (!showFullHands) {
      // Old mode: show only trump suit as mini-cards.
      if (promptStep === "DONE" && puzzle.endRevealTrumpHands && Array.isArray(puzzle.endRevealTrumpHands[seat])) {
        const ranks = puzzle.endRevealTrumpHands[seat];
        const revealCards = orderMiniTrumpStripCards(ranks.map((r) => makeCard(r, puzzle.trumpSuit)));
        return (
          <div ref={trumpStripRef} className={handCardsAsCardsClassName} aria-label={`${seat} trump suit revealed`}>
            {revealCards.map((c, idx) => {
              return (
                <div key={`${seat}-reveal-${c.rank}${c.suit}-${idx}`} className={`ct-miniCard ct-miniCard--fan ${cardColorClass(c)}`}>
                  <div className="ct-fanFace" aria-hidden="true">
                    <div className="ct-fanRank">{displayRank(c.rank)}</div>
                    <div className="ct-fanSuit">{suitSymbol(c.suit)}</div>
                  </div>
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
      const stripCards = orderMiniTrumpStripCards(remainingHands[seat] || []);
      return (
        <div ref={trumpStripRef} className={handCardsAsCardsClassName} aria-label={`${seat} trump cards remaining`}>
          {stripCards.map((c, idx) => (
            <div key={`${seat}-${c.rank}${c.suit}-${idx}`} className={`ct-miniCard ct-miniCard--fan ${cardColorClass(c)}`}>
              <div className="ct-fanFace" aria-hidden="true">
                <div className="ct-fanRank">{displayRank(c.rank)}</div>
                <div className="ct-fanSuit">{suitSymbol(c.suit)}</div>
              </div>
            </div>
          ))}
          {stripCards.length === 0 && <div className="ct-emptyHand">No trumps left</div>}
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
    const noContinueRevealAllHands =
      promptStep === "PLAY_DECISION_REVEAL" && activeCustomPrompt?.noContinue && visibleFullHandSeats.length === 4;
    const revealOriginalOnDone = promptStep === "DONE" && !!puzzle?.promptOptions?.revealOriginalOnDone;
    const playedMap =
      (promptStep === "DONE" && (!puzzle.preserveEndStateAtDone || revealOriginalOnDone)) || noContinueRevealAllHands
        ? {}
        : playedFromHand?.[seat] || {};
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
    // Reveal/full-hand view: keep suit rows aligned across opposite seats for readability.
    // This is display-only and intentionally avoids trump-position special-casing by seat.
    const visibleSuitsDuringPlay = Array.isArray(puzzle?.promptOptions?.visibleSuitsDuringPlay)
      ? puzzle.promptOptions.visibleSuitsDuringPlay.filter((s) => SUIT_ORDER.includes(s))
      : null;
    const visibleSuitsOnDone = Array.isArray(puzzle?.promptOptions?.visibleSuitsOnDone)
      ? puzzle.promptOptions.visibleSuitsOnDone.filter((s) => SUIT_ORDER.includes(s))
      : null;
    const showAllSuitsNow = promptStep === "DONE";
    const orderedSuits = showAllSuitsNow
      ? visibleSuitsOnDone?.length
        ? visibleSuitsOnDone
        : SUIT_ORDER
      : visibleSuitsDuringPlay?.length
        ? visibleSuitsDuringPlay
        : SUIT_ORDER;
    const visibleUnplayed = [...unplayed].filter((c) => orderedSuits.includes(c.suit));
    const orderedUnplayed = visibleUnplayed.sort((a, b) => {
      const suitA = orderedSuits.indexOf(a.suit);
      const suitB = orderedSuits.indexOf(b.suit);
      if (suitA !== suitB) return suitA - suitB;
      return rankSortValue(a.rank) - rankSortValue(b.rank);
    });

    if (!isWideSeat) {
      const isPlayCardDummySide =
        seat === "DUMMY" &&
        promptStep === "PLAY_CARD" &&
        activeCustomPrompt?.type === "PLAY_CARD" &&
        (playCardInteractiveStep === "dummy_lead" || playCardInteractiveStep === "dummy_follow");
      const isPlayCardModeSide =
        seat === playCardResponderLegacySeat &&
        promptStep === "PLAY_CARD" &&
        activeCustomPrompt?.type === "PLAY_CARD" &&
        playCardAutoPhaseDone;
      const playCardClickableSide = isPlayCardDummySide || isPlayCardModeSide;
      return (
        <div ref={fanRef} className="ct-suitHand" aria-label={`${seat} suit layout`}>
          {orderedSuits.map((s) => {
            const suitCards = orderedUnplayed.filter((c) => c.suit === s);
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
                      role={playCardClickableSide ? "button" : undefined}
                      tabIndex={playCardClickableSide ? 0 : undefined}
                      onClick={
                        playCardClickableSide
                          ? () => (isPlayCardDummySide ? handleDummyPlayCard(c) : handleDeclarerPlayCard(c))
                          : undefined
                      }
                      onKeyDown={
                        playCardClickableSide
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                if (isPlayCardDummySide) handleDummyPlayCard(c);
                                else handleDeclarerPlayCard(c);
                              }
                            }
                          : undefined
                      }
                      className={`ct-miniCard ct-miniCard--fan ${cardColorClass(c)} ${playCardClickableSide ? "ct-miniCard--playable" : ""}`}
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

    const isPlayCardDummyWide =
      seat === "DUMMY" &&
      promptStep === "PLAY_CARD" &&
      activeCustomPrompt?.type === "PLAY_CARD" &&
      (playCardInteractiveStep === "dummy_lead" || playCardInteractiveStep === "dummy_follow");
    const isPlayCardMode =
      seat === playCardResponderLegacySeat &&
      promptStep === "PLAY_CARD" &&
      activeCustomPrompt?.type === "PLAY_CARD" &&
      playCardAutoPhaseDone;
    const playCardClickableWide = isPlayCardDummyWide || isPlayCardMode;
    return (
      <div ref={fanRef} className="ct-handFan ct-handFan--full" aria-label={`${seat} full hand`}>
        {orderedUnplayed.map((c, idx) => {
          const key = `${c.rank}${c.suit}`;
          return (
            <div
              key={`${seat}-${key}-${idx}`}
              data-card-key={key}
              role={playCardClickableWide ? "button" : undefined}
              tabIndex={playCardClickableWide ? 0 : undefined}
              onClick={
                playCardClickableWide
                  ? () => (isPlayCardDummyWide ? handleDummyPlayCard(c) : handleDeclarerPlayCard(c))
                  : undefined
              }
              onKeyDown={
                playCardClickableWide
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (isPlayCardDummyWide) handleDummyPlayCard(c);
                        else handleDeclarerPlayCard(c);
                      }
                    }
                  : undefined
              }
              className={`ct-miniCard ct-miniCard--fan ${cardColorClass(c)} ${playCardClickableWide ? "ct-miniCard--playable" : ""}`}
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

  const REVEAL_GOOD_TRY = "Good try! ";

  const revealAfterTwoWrong = (kind, promptId) => {
    const key = promptId ? `${kind}_${promptId}` : kind;
    const next = (wrongAttempts?.[key] || 0) + 1;
    setWrongAttempts((prev) => ({ ...prev, [key]: next }));
    return next >= 2;
  };

  const submitDefendersStarted = () => {
    const val = Number(defendersStartedInput);
    if (Number.isFinite(val) && String(defendersStartedInput).trim() !== "" && val === startedTrumpsCorrect) {
      setFeedback({ type: "ok", text: getShortSuccess() });
      pendingAdvanceRef.current = () => {
        setFeedback(null);
        setWaitingForContinue(false);
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
      };
      setWaitingForContinue(true);
    } else {
      const shouldReveal = revealAfterTwoWrong("defendersStarted");
      if (shouldReveal) {
        setFeedback({ type: "ok", text: `${REVEAL_GOOD_TRY}The correct answer is ${startedTrumpsCorrect}.` });
        pendingAdvanceRef.current = () => {
          setFeedback(null);
          setWaitingForContinue(false);
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
        };
        setWaitingForContinue(true);
      } else {
        setFeedback({ type: "error", text: "Not quite — try again." });
      }
    }
  };

  const submitDefendersHeartsStarted = () => {
    const expected = puzzle?.promptOptions?.defendersHeartsStartedExpected;
    const val = Number(defendersHeartsStartedInput);
    if (Number.isFinite(expected) && Number.isFinite(val) && val === expected) {
      setFeedback({ type: "ok", text: getShortSuccess() });
      pendingAdvanceRef.current = () => {
        setFeedback(null);
        setWaitingForContinue(false);
        setPromptStep(null);
        applyStateThroughRound(-1);
      };
      setWaitingForContinue(true);
    } else {
      const shouldReveal = revealAfterTwoWrong("defendersHeartsStarted");
      if (shouldReveal) {
        setFeedback({ type: "ok", text: `${REVEAL_GOOD_TRY}The correct answer is ${expected}.` });
        pendingAdvanceRef.current = () => {
          setFeedback(null);
          setWaitingForContinue(false);
          setPromptStep(null);
          applyStateThroughRound(-1);
        };
        setWaitingForContinue(true);
      } else {
        setFeedback({ type: "error", text: "Not quite — try again." });
      }
    }
  };

  const submitDefendersRemaining = () => {
    const val = Number(defendersRemainingInput);
    if (Number.isFinite(val) && String(defendersRemainingInput).trim() !== "" && val === remainingTrumpsCorrect) {
      setFeedback({ type: "ok", text: getShortSuccess() });
      pendingAdvanceRef.current = () => {
        setFeedback(null);
        setWaitingForContinue(false);
        askedRef.current = { ...(askedRef.current || {}), defendersRemaining: true };
        setAskedTick((t) => t + 1);
        advancePostPrompt();
      };
      setWaitingForContinue(true);
    } else {
      const shouldReveal = revealAfterTwoWrong("defendersRemaining");
      if (shouldReveal) {
        setFeedback({ type: "ok", text: `${REVEAL_GOOD_TRY}The correct answer is ${remainingTrumpsCorrect}.` });
        pendingAdvanceRef.current = () => {
          setFeedback(null);
          setWaitingForContinue(false);
          askedRef.current = { ...(askedRef.current || {}), defendersRemaining: true };
          setAskedTick((t) => t + 1);
          advancePostPrompt();
        };
        setWaitingForContinue(true);
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
      setFeedback({ type: "ok", text: getShortSuccess() });
      pendingAdvanceRef.current = () => {
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
      };
      setWaitingForContinue(true);
    } else {
      const shouldReveal = revealAfterTwoWrong("distribution");
      if (shouldReveal) {
        const suit = distributionSuit || showOutLedSuit;
        const suitName = suit === puzzle.trumpSuit ? "trump" : SUIT_NAME[suit] || suit;
        const answerText = `${roleLabelForSeat("LHO")}: ${expected.LHO}, ${roleLabelForSeat("DUMMY")}: ${expected.DUMMY}, ${roleLabelForSeat("RHO")}: ${expected.RHO}, ${roleLabelForSeat("DECLARER")}: ${expected.DECLARER}`;
        setFeedback({ type: "ok", text: `${REVEAL_GOOD_TRY}The correct ${suitName} distribution is ${answerText}.` });
        pendingAdvanceRef.current = () => {
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
        };
        setWaitingForContinue(true);
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
        const shouldReveal = revealAfterTwoWrong("distributionGuess", promptId);
        if (shouldReveal) {
          setFeedback({
            type: "ok",
            text: `${REVEAL_GOOD_TRY}The correct answer is ${expectedDist.LHO}${expectedDist.DUMMY}${expectedDist.RHO}${expectedDist.DECLARER}.`,
          });
          pendingAdvanceRef.current = () => {
            askedRef.current = {
              ...(askedRef.current || {}),
              customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
            };
            setAskedTick((t) => t + 1);
            setDistributionSuit(suit);
            continueFromRound(completedRoundIdx);
          };
          setWaitingForContinue(true);
        } else {
          setFeedback({ type: "error", text: "Not quite — try again." });
        }
        return;
      }
    }

    const successText =
      isCustomGuess && typeof activeCustomPrompt?.successText === "string"
        ? activeCustomPrompt.successText.trim()
        : "";
    if (successText) {
      setFeedback({ type: "ok", text: successText });
      pendingAdvanceRef.current = () => {
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
      };
      setWaitingForContinue(true);
      return;
    }

    /* Advance without showing "Let's play!" — just continue to the next step */
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
    const customTrickCountPromptId = activeCustomPrompt?.type === "TRICK_COUNT" ? activeCustomPrompt?.id : null;
    const expected =
      (customTrickCountPromptId ? activeCustomPrompt?.trickCountExpected : null) ||
      puzzle.promptOptions?.trickCountExpected ||
      computeTrickCountExpectedThroughRound(puzzle, Math.max(0, through));
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
        text: `Correct — ${isDeclarerSide ? "your side" : "declarer"} has ${total} sure tricks.`,
      });
      pendingAdvanceRef.current = () => {
        askedRef.current = {
          ...(askedRef.current || {}),
          trickCountAsked: true,
          customAsked: customTrickCountPromptId
            ? { ...((askedRef.current && askedRef.current.customAsked) || {}), [customTrickCountPromptId]: true }
            : ((askedRef.current && askedRef.current.customAsked) || {}),
        };
        setAskedTick((t) => t + 1);
        if (manualTrickMode) {
          if (customTrickCountPromptId) {
            const throughRound = Math.max(
              Number.isFinite(completedRoundIdxRef.current) ? completedRoundIdxRef.current : -1,
              Number.isFinite(completedRoundIdx) ? completedRoundIdx : -1,
              Number.isFinite(roundIdx) ? roundIdx : -1
            );
            const next = throughRound + 1;
            setActiveCustomPrompt(null);
            setCurrentPostPrompts([]);
            setPostPromptIdx(0);
            setPromptStep(null);
            if (next <= lastRoundIdx) playOneTrick(next, { ignorePromptLock: true });
            else setPromptStep("DONE");
            return;
          }
          const throughRound = Math.max(
            Number.isFinite(completedRoundIdxRef.current) ? completedRoundIdxRef.current : -1,
            Number.isFinite(completedRoundIdx) ? completedRoundIdx : -1
          );
          const computed = afterManualTrick(throughRound);
          if (computed.prompts[0]) return;
          const next = throughRound + 1;
          if (next <= lastRoundIdx) playOneTrick(next, { ignorePromptLock: true });
          else setPromptStep("DONE");
          return;
        }
        advancePostPrompt();
      };
      setWaitingForContinue(true);
    } else {
      const shouldReveal = revealAfterTwoWrong("trickCount");
      if (shouldReveal) {
        const ansTotal = (expected.S || 0) + (expected.H || 0) + (expected.D || 0) + (expected.C || 0);
        setFeedback({ type: "ok", text: `${REVEAL_GOOD_TRY}The correct answer is ${expected.S}${expected.H}${expected.D}${expected.C} (total ${ansTotal}).` });
        pendingAdvanceRef.current = () => {
          askedRef.current = {
            ...(askedRef.current || {}),
            trickCountAsked: true,
            customAsked: customTrickCountPromptId
              ? { ...((askedRef.current && askedRef.current.customAsked) || {}), [customTrickCountPromptId]: true }
              : ((askedRef.current && askedRef.current.customAsked) || {}),
          };
          setAskedTick((t) => t + 1);
          if (manualTrickMode) {
            if (customTrickCountPromptId) {
              const throughRound = Math.max(
                Number.isFinite(completedRoundIdxRef.current) ? completedRoundIdxRef.current : -1,
                Number.isFinite(completedRoundIdx) ? completedRoundIdx : -1,
                Number.isFinite(roundIdx) ? roundIdx : -1
              );
              const next = throughRound + 1;
              setActiveCustomPrompt(null);
              setCurrentPostPrompts([]);
              setPostPromptIdx(0);
              setPromptStep(null);
              if (next <= lastRoundIdx) playOneTrick(next, { ignorePromptLock: true });
              else setPromptStep("DONE");
              return;
            }
            const throughRound = Math.max(
              Number.isFinite(completedRoundIdxRef.current) ? completedRoundIdxRef.current : -1,
              Number.isFinite(completedRoundIdx) ? completedRoundIdx : -1
            );
            const computed = afterManualTrick(throughRound);
            if (computed.prompts[0]) return;
            const next = throughRound + 1;
            if (next <= lastRoundIdx) playOneTrick(next, { ignorePromptLock: true });
            else setPromptStep("DONE");
            return;
          }
          advancePostPrompt();
        };
        setWaitingForContinue(true);
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
      setFeedback({ type: "ok", text: getShortSuccess() });
      pendingAdvanceRef.current = () => {
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        afterManualTrick(completedRoundIdx);
      };
      setWaitingForContinue(true);
      return;
    }

    const shouldReveal = revealAfterTwoWrong("seatSuitCount", promptId);
    if (shouldReveal) {
      setFeedback({ type: "ok", text: `${REVEAL_GOOD_TRY}The correct answer is ${expected}.` });
      pendingAdvanceRef.current = () => {
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        afterManualTrick(completedRoundIdx);
      };
      setWaitingForContinue(true);
    } else {
      setFeedback({ type: "error", text: "Not quite — try again." });
    }
  };

  const submitSingleNumber = () => {
    const promptId = activeCustomPrompt?.id;
    const expected = activeCustomPrompt?.expectedAnswer;
    const autoContinueOnCorrect = !!activeCustomPrompt?.autoContinueOnCorrect;
    const val = Number(singleNumberInput);
    const successTextRaw = activeCustomPrompt?.successText;
    const successText =
      typeof successTextRaw === "string" && successTextRaw.trim() ? successTextRaw : getShortSuccess();
    if (!promptId || typeof expected !== "number") return;
    if (Number.isFinite(val) && val === expected) {
      if (autoContinueOnCorrect) {
        setFeedback(null);
        setWaitingForContinue(false);
        setSingleNumberInput("");
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        afterManualTrick(completedRoundIdx);
        return;
      }
      setFeedback({ type: "ok", text: successText });
      pendingAdvanceRef.current = () => {
        setSingleNumberInput("");
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        afterManualTrick(completedRoundIdx);
      };
      setWaitingForContinue(true);
    } else {
      const shouldReveal = revealAfterTwoWrong("singleNumber", promptId);
      if (shouldReveal) {
        setFeedback({ type: "ok", text: `${REVEAL_GOOD_TRY}The correct answer is ${expected}.` });
        pendingAdvanceRef.current = () => {
          setSingleNumberInput("");
          askedRef.current = {
            ...(askedRef.current || {}),
            customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
          };
          setAskedTick((t) => t + 1);
          afterManualTrick(completedRoundIdx);
        };
        setWaitingForContinue(true);
      } else {
        setFeedback({ type: "error", text: "Not quite — try again." });
      }
    }
  };

  const submitPlayDecision = (choiceId) => {
    const promptId = activeCustomPrompt?.id;
    if (!promptId) return;
    const expectedChoice = activeCustomPrompt?.expectedChoice;
    const reveal =
      activeCustomPrompt?.revealText != null && activeCustomPrompt?.revealText !== ""
        ? activeCustomPrompt.revealText
        : "Thanks — let’s continue.";
    const endHandAfter = !!activeCustomPrompt?.endHandAfterReveal;

    if (expectedChoice !== undefined && expectedChoice !== null) {
      const allowed = Array.isArray(expectedChoice)
        ? expectedChoice.map((c) => String(c))
        : [String(expectedChoice)];
      const correct = allowed.includes(String(choiceId));
      const correctAnswerText = Array.isArray(expectedChoice)
        ? (expectedChoice.length === 2 ? `${expectedChoice[0]} or ${expectedChoice[1]}` : expectedChoice.join(", "))
        : activeCustomPrompt?.expectedChoiceDisplay != null && String(activeCustomPrompt.expectedChoiceDisplay).trim() !== ""
          ? String(activeCustomPrompt.expectedChoiceDisplay)
          : String(expectedChoice);
      if (!correct) {
        const shouldReveal = revealAfterTwoWrong("playDecision", promptId);
        if (shouldReveal) {
          const text =
            typeof reveal === "string"
              ? `${REVEAL_GOOD_TRY}The correct answer is ${correctAnswerText}. ${reveal}`
              : (
                  <>
                    <p className="ct-revealParagraph">
                      {REVEAL_GOOD_TRY}The correct answer is <strong>{correctAnswerText}</strong>.
                    </p>
                    <div className="ct-revealRichRoot">{reveal}</div>
                  </>
                );
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

    // Ungraded, or choice was correct.
    // Teaching reveal is shown in the PLAY_DECISION_REVEAL panel; show congratulations when correct.
    const applyChoiceMap = activeCustomPrompt?.playDecisionApplyCardOnChoice;
    const scriptedPlay =
      applyChoiceMap && typeof applyChoiceMap === "object"
        ? applyChoiceMap[String(choiceId)] || applyChoiceMap.ANY || null
        : null;
    if (scriptedPlay?.seat && scriptedPlay?.card) {
      const seat = scriptedPlay.seat;
      const card = {
        rank: String(scriptedPlay.card.rank),
        suit: String(scriptedPlay.card.suit),
      };
      if (SEATS.includes(seat) && card.rank && card.suit) {
        setTrickCards((prev) => ({
          ...(prev || { LHO: null, DUMMY: null, RHO: null, DECLARER: null }),
          [seat]: card,
        }));
        setPlayedFromHand((prev) => ({
          ...prev,
          [seat]: { ...(prev?.[seat] || {}), [`${card.rank}${card.suit}`]: true },
        }));
        if (isTrump(card, puzzle.trumpSuit)) {
          setRemainingHands((prev) => ({
            ...prev,
            [seat]: removeCardFromHand(prev?.[seat], card),
          }));
        }
      }
    }
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
    const hadExpected = expectedChoice !== undefined && expectedChoice !== null;
    setPlayDecisionReveal({ text: reveal, promptId, roundIdx: completedRoundIdx, correct: hadExpected });
    if (activeCustomPrompt?.noContinue && SEATS.every((s) => isFullHandShape(puzzle.shownHands?.[s]))) {
      applyStateThroughRound(-1);
      setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });
    }
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
      setFeedback({ type: "ok", text: getShortSuccess() });
      pendingAdvanceRef.current = () => {
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        continueFromRound(completedRoundIdx);
      };
      setWaitingForContinue(true);
      return;
    }

    const shouldReveal = revealAfterTwoWrong("distributionNeed", promptId);
    if (shouldReveal) {
      setFeedback({ type: "ok", text: `${REVEAL_GOOD_TRY}The correct answer is ${need[0]}-${need[1]} (in either order).` });
      pendingAdvanceRef.current = () => {
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        continueFromRound(completedRoundIdx);
      };
      setWaitingForContinue(true);
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
      const playThroughPre = Number(puzzle?.promptOptions?.playThroughRoundAfterPreInclusive);
      if (Number.isFinite(playThroughPre) && playThroughPre >= 0) {
        const endR = Math.max(0, Math.min(lastRoundIdx, playThroughPre));
        playSegment(0, endR, () => {
          setCompletedRoundIdx(endR);
          afterManualTrick(endR);
        });
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
    const infoRevealText = activeCustomPrompt?.infoEndsWithReveal;
    if (infoRevealText && promptId) {
      askedRef.current = {
        ...(askedRef.current || {}),
        customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
      };
      setAskedTick((t) => t + 1);
      const revealPromptId = `${promptId}--reveal`;
      setActiveCustomPrompt({
        id: revealPromptId,
        type: "PLAY_DECISION",
        noContinue: true,
        videoUrl: "",
      });
      setPlayDecisionReveal({
        text: String(infoRevealText),
        promptId: revealPromptId,
        roundIdx: completedRoundIdx,
      });
      setPromptStep("PLAY_DECISION_REVEAL");
      return;
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
    // Question-only hands with no tricks: optional skip the DONE / "Next hand · Replay" panel and go straight on.
    if (
      puzzle?.promptOptions?.infoContinueSkipsDoneScreen &&
      lastRoundIdx < 0 &&
      !getNextCustomPrompt(-1)
    ) {
      setCompletedProblemIds((prev) => {
        if (!puzzle?.id || prev[puzzle.id]) return prev;
        sendPracticeEvent("practice_problem_complete", {
          trainer: trainerLabel,
          category_key: categoryKey,
          puzzle_id: puzzle.id,
          difficulty: puzzle.difficulty ?? 1,
        });
        if (uid && categoryKey && puzzle?.id) dispatch(savePracticeCompletion(uid, categoryKey, puzzle.id));
        return { ...prev, [puzzle.id]: true };
      });
      nextHand();
      return;
    }
    continueFromRound(completedRoundIdx);
  };

  const handleDummyPlayCard = (card) => {
    if (userPlayedCard || !activeCustomPrompt || activeCustomPrompt.type !== "PLAY_CARD" || isPlaying) return;
    const isDummyLead =
      !!activeCustomPrompt.playCardUserPlaysDummyFirst && playCardInteractiveStep === "dummy_lead";
    const isDummyFollow =
      !!activeCustomPrompt.playCardNextClickFromDummy && playCardInteractiveStep === "dummy_follow";
    if (!isDummyLead && !isDummyFollow) return;

    if (isDummyFollow && activeCustomPrompt.playCardRequireCorrect) {
      const expectedSuit = activeCustomPrompt.expectedSuit;
      const expectedRank = activeCustomPrompt.expectedRank;
      const suitOk = expectedSuit == null || expectedSuit === "" || card.suit === expectedSuit;
      const rankOk = expectedRank == null || expectedRank === "" || String(card.rank) === String(expectedRank);
      if (!suitOk || !rankOk) {
        setFeedback({ type: "error", text: activeCustomPrompt?.wrongTryText || "Not quite — try again." });
        return;
      }
    }

    if (playCardDummyAfterTimeoutRef.current) {
      clearTimeout(playCardDummyAfterTimeoutRef.current);
      playCardDummyAfterTimeoutRef.current = null;
    }

    const applyDummyCardToState = () => {
      setTrickCards((prev) => ({ ...prev, DUMMY: card }));
      if (visibleFullHandSeats.includes("DUMMY")) {
        setPlayedFromHand((prev) => ({
          ...prev,
          DUMMY: { ...(prev.DUMMY || {}), [`${card.rank}${card.suit}`]: true },
        }));
      }
      if (isTrump(card, puzzle.trumpSuit)) {
        setRemainingHands((prev) => ({
          ...prev,
          DUMMY: removeCardFromHand(prev.DUMMY, card),
        }));
      }
    };

    if (isDummyFollow) {
      applyDummyCardToState();
      const afterDummy = activeCustomPrompt.playCardAutoPlaysAfterDummy || [];
      const staggerMs = 400;
      const finishPartialReveal = () => {
        const promptId = activeCustomPrompt.id;
        const firstLine = activeCustomPrompt.correctRevealText || "Continue.";
        const r = activeCustomPrompt.revealText;
        const text =
          r == null || r === ""
            ? firstLine
            : typeof r === "string"
              ? `${firstLine}\n\n${r}`
              : (
                  <>
                    <p className="ct-revealParagraph">{firstLine}</p>
                    <div className="ct-revealRichRoot">{r}</div>
                  </>
                );
        setPlayDecisionReveal({
          text,
          correct: true,
          promptId,
          roundIdx: completedRoundIdx,
          fromPlayCard: true,
        });
        askedRef.current = {
          ...(askedRef.current || {}),
          customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
        };
        setAskedTick((t) => t + 1);
        setPlayCardInteractiveStep(null);
        setPromptStep("PLAY_CARD_REVEAL");
      };

      playCardDummyAfterTimeoutRef.current = setTimeout(() => {
        playCardDummyAfterTimeoutRef.current = null;
        afterDummy.forEach((play, i) => {
          setTimeout(() => {
            const seat = play?.seat;
            const c = play?.card;
            if (!seat || !c) return;
            setTrickCards((prev) => ({ ...prev, [seat]: c }));
            setPlayedFromHand((prev) => ({
              ...prev,
              [seat]: { ...(prev[seat] || {}), [`${c.rank}${c.suit}`]: true },
            }));
            if (isTrump(c, puzzle.trumpSuit)) {
              setRemainingHands((prev) => ({
                ...prev,
                [seat]: removeCardFromHand(prev[seat], c),
              }));
            }
          }, i * staggerMs);
        });
        const doneMs = Math.max(0, (afterDummy.length - 1) * staggerMs) + staggerMs + 80;
        setTimeout(() => {
          if (activeCustomPrompt.playCardAdvanceToNextCustomAfterDummyFollow) {
            const promptId = activeCustomPrompt.id;
            askedRef.current = {
              ...(askedRef.current || {}),
              customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
            };
            setAskedTick((t) => t + 1);
            setPlayCardInteractiveStep(null);
            setFeedback(null);
            const throughRound = Number.isFinite(completedRoundIdxRef.current)
              ? completedRoundIdxRef.current
              : completedRoundIdx;
            afterManualTrick(throughRound);
            return;
          }
          if (activeCustomPrompt.playCardRevealAfterDummyFollowWithoutDeclarer) {
            finishPartialReveal();
          } else {
            setPlayCardInteractiveStep("declarer");
            setPlayCardAutoPhaseDone(true);
          }
        }, doneMs);
      }, staggerMs);
      return;
    }

    setPlayCardInteractiveStep("wait_rho");
    applyDummyCardToState();

    const before = activeCustomPrompt.playCardAutoPlaysBefore || [];
    const staggerMs = 400;
    playCardDummyAfterTimeoutRef.current = setTimeout(() => {
      playCardDummyAfterTimeoutRef.current = null;
      let trick = { LHO: null, DUMMY: null, RHO: null, DECLARER: null };
      trick.DUMMY = card;
      before.forEach((play, i) => {
        setTimeout(() => {
          const seat = play?.seat;
          const c = play?.card;
          if (!seat || !c) return;
          trick = { ...trick, [seat]: c };
          setTrickCards({ ...trick });
          setPlayedFromHand((prev) => ({
            ...prev,
            [seat]: { ...(prev[seat] || {}), [`${c.rank}${c.suit}`]: true },
          }));
          if (isTrump(c, puzzle.trumpSuit)) {
            setRemainingHands((prev) => ({
              ...prev,
              [seat]: removeCardFromHand(prev[seat], c),
            }));
          }
        }, i * staggerMs);
      });
      const doneMs = Math.max(0, (before.length - 1) * staggerMs) + 50;
      setTimeout(() => {
        setPlayCardInteractiveStep("declarer");
        setPlayCardAutoPhaseDone(true);
      }, doneMs);
    }, staggerMs);
  };

  const clearPlayCardFollowStaggerTimeouts = () => {
    playCardFollowStaggerTimeoutsRef.current.forEach((id) => clearTimeout(id));
    playCardFollowStaggerTimeoutsRef.current = [];
  };

  const handleDeclarerPlayCard = (card) => {
    if (userPlayedCard || !activeCustomPrompt || activeCustomPrompt.type !== "PLAY_CARD" || isPlaying) return;
    const responderSeat = SEATS.includes(activeCustomPrompt?.playCardResponderSeat)
      ? activeCustomPrompt.playCardResponderSeat
      : "DECLARER";
    const userDummyFirst = !!activeCustomPrompt.playCardUserPlaysDummyFirst;
    const hasAutoPreface =
      !userDummyFirst &&
      Array.isArray(activeCustomPrompt.playCardAutoPlaysBefore) &&
      activeCustomPrompt.playCardAutoPlaysBefore.length > 0;
    if (hasAutoPreface && !playCardAutoPhaseDone) return;
    if (userDummyFirst && playCardInteractiveStep !== "declarer") return;
    if (!!activeCustomPrompt.playCardNextClickFromDummy && playCardInteractiveStep !== "declarer") return;
    const promptId = activeCustomPrompt.id;
    const wrongRanks = activeCustomPrompt.playCardWrongRanks;
    if (Array.isArray(wrongRanks) && wrongRanks.some((r) => String(r) === String(card.rank))) {
      setFeedback({ type: "error", text: activeCustomPrompt?.wrongTryText || "Not quite — try again." });
      return;
    }
    const expectedSuit = activeCustomPrompt.expectedSuit;
    const expectedRank = activeCustomPrompt.expectedRank;
    const suitOk = expectedSuit == null || expectedSuit === "" || card.suit === expectedSuit;
    const rankOk = expectedRank == null || expectedRank === "" || String(card.rank) === String(expectedRank);
    const correct = suitOk && rankOk;
    if (!correct && activeCustomPrompt?.playCardRequireCorrect) {
      setFeedback({ type: "error", text: activeCustomPrompt?.wrongTryText || "Not quite — try again." });
      return;
    }

    clearPlayCardFollowStaggerTimeouts();

    const followBySuit = activeCustomPrompt?.playCardAutoFollowBySuit;
    /** Legacy: declarer-relative order. Not used when `playEngine === compassClockwise`. */
    const followAutoSeatsOrder = ["LHO", "DUMMY", "RHO"];
    const compassLeaderForFollow =
      puzzle?.playEngine === PLAY_ENGINE_COMPASS_CLOCKWISE
        ? activeCustomPrompt?.playCardTrickLeaderCompass &&
          ["N", "E", "S", "W"].includes(activeCustomPrompt.playCardTrickLeaderCompass)
          ? activeCustomPrompt.playCardTrickLeaderCompass
          : viewerCompass || declarerCompass
        : null;
    const resolveFollows = () => {
      const follows = [];
      if (!followBySuit || typeof followBySuit !== "object") return follows;

      if (puzzle?.playEngine === PLAY_ENGINE_COMPASS_CLOCKWISE && compassLeaderForFollow) {
        for (const comp of followSeatsClockwiseFromLeader(compassLeaderForFollow)) {
          const legacySeat = seatAtCompass[comp];
          if (!legacySeat) continue;
          const seatMap = followBySuit[comp];
          if (!seatMap || typeof seatMap !== "object") continue;
          const followCard = seatMap?.[card.suit] || seatMap?.ANY || null;
          if (followCard?.rank && followCard?.suit) {
            follows.push({
              seat: legacySeat,
              card: { rank: String(followCard.rank), suit: String(followCard.suit) },
            });
          }
        }
        return follows;
      }

      for (const seat of followAutoSeatsOrder) {
        const seatMap = followBySuit?.[seat];
        if (!seatMap || typeof seatMap !== "object") continue;
        const followCard = seatMap?.[card.suit] || seatMap?.ANY || null;
        if (followCard?.rank && followCard?.suit) {
          follows.push({
            seat,
            card: { rank: String(followCard.rank), suit: String(followCard.suit) },
          });
        }
      }
      return follows;
    };
    const follows = resolveFollows();
    const staggerMs = Number(activeCustomPrompt?.playCardAutoFollowStaggerMs);
    const useStagger = Number.isFinite(staggerMs) && staggerMs > 0 && follows.length > 0;

    const keepExistingTrickCards = !!activeCustomPrompt?.playCardKeepExistingTrickCards;
    const computeTrickBase = (prev) =>
      hasAutoPreface ||
      userDummyFirst ||
      keepExistingTrickCards ||
      (!!activeCustomPrompt?.playCardNextClickFromDummy && playCardInteractiveStep === "declarer")
        ? prev
        : { LHO: null, DUMMY: null, RHO: null, DECLARER: null };
    const placeLearnerCard = (base, c) => ({ ...base, [responderSeat]: c });

    const firstLine = correct
      ? (activeCustomPrompt.correctRevealText || "Well done!")
      : (activeCustomPrompt.wrongRevealText || "Good try, that looks logical but it doesn't work.");
    const r = activeCustomPrompt.revealText;
    const text =
      r == null || r === ""
        ? firstLine
        : typeof r === "string"
          ? `${firstLine}\n\n${r}`
          : (
              <>
                <p className="ct-revealParagraph">{firstLine}</p>
                <div className="ct-revealRichRoot">{r}</div>
              </>
            );

    const finishPlayCardReveal = () => {
      setPlayDecisionReveal({ text, correct, promptId, roundIdx: completedRoundIdx, fromPlayCard: true });
      askedRef.current = {
        ...(askedRef.current || {}),
        customAsked: { ...((askedRef.current && askedRef.current.customAsked) || {}), [promptId]: true },
      };
      setAskedTick((t) => t + 1);
      setPromptStep("PLAY_CARD_REVEAL");
    };

    setUserPlayedCard(card);
    setPlayedFromHand((prev) => ({
      ...prev,
      [responderSeat]: { ...(prev[responderSeat] || {}), [`${card.rank}${card.suit}`]: true },
    }));

    if (useStagger) {
      const afterPlay = activeCustomPrompt.playCardAutoPlayAfter;
      setTrickCards((prev) => {
        const base = computeTrickBase(prev);
        const startTrick = placeLearnerCard(base, card);
        queueMicrotask(() => {
          let acc = { ...startTrick };
          follows.forEach((item, i) => {
            const tid = setTimeout(() => {
              acc = { ...acc, [item.seat]: item.card };
              setTrickCards({ ...acc });
            }, (i + 1) * staggerMs);
            playCardFollowStaggerTimeoutsRef.current.push(tid);
          });
          const doneMs = follows.length * staggerMs + 120;
          const tidDone = setTimeout(() => {
            if (afterPlay?.seat && afterPlay?.card) {
              setTrickCards((prev) => ({
                ...prev,
                [afterPlay.seat]: {
                  rank: String(afterPlay.card.rank),
                  suit: String(afterPlay.card.suit),
                },
              }));
            }
            finishPlayCardReveal();
          }, doneMs);
          playCardFollowStaggerTimeoutsRef.current.push(tidDone);
        });
        return startTrick;
      });
      return;
    }

    setTrickCards((prev) => {
      const base = computeTrickBase(prev);
      const next = placeLearnerCard(base, card);
      if (followBySuit && typeof followBySuit === "object") {
        if (puzzle?.playEngine === PLAY_ENGINE_COMPASS_CLOCKWISE && compassLeaderForFollow) {
          for (const comp of followSeatsClockwiseFromLeader(compassLeaderForFollow)) {
            const legacySeat = seatAtCompass[comp];
            if (!legacySeat || next[legacySeat]) continue;
            const seatMap = followBySuit[comp];
            if (!seatMap || typeof seatMap !== "object") continue;
            const followCard = seatMap?.[card.suit] || seatMap?.ANY || null;
            if (followCard?.rank && followCard?.suit) {
              next[legacySeat] = { rank: String(followCard.rank), suit: String(followCard.suit) };
            }
          }
        } else {
          followAutoSeatsOrder.forEach((seat) => {
            if (next[seat]) return;
            const seatMap = followBySuit?.[seat];
            if (!seatMap || typeof seatMap !== "object") return;
            const followCard = seatMap?.[card.suit] || seatMap?.ANY || null;
            if (followCard?.rank && followCard?.suit) {
              next[seat] = { rank: String(followCard.rank), suit: String(followCard.suit) };
            }
          });
        }
      }
      const after = activeCustomPrompt.playCardAutoPlayAfter;
      if (after?.seat && after?.card) {
        next[after.seat] = after.card;
      }
      return next;
    });
    finishPlayCardReveal();
  };

  const continueAfterPlayCardReveal = () => {
    const promptId = playDecisionReveal?.promptId;
    const revealCorrect = !!playDecisionReveal?.correct;
    if (!promptId) return;
    setFeedback(null);
    setPlayDecisionReveal(null);
    setUserPlayedCard(null);
    if (playCardDummyAfterTimeoutRef.current) {
      clearTimeout(playCardDummyAfterTimeoutRef.current);
      playCardDummyAfterTimeoutRef.current = null;
    }
    clearPlayCardFollowStaggerTimeouts();
    setPlayCardInteractiveStep(null);
    const cfg = puzzle.promptOptions?.customPrompts?.find((p) => p.id === promptId);
    if (cfg?.playCardEndHandAfterContinue) {
      applyStateThroughRound(lastRoundIdx);
      continuedFromPlayCardRevealRef.current = true;
      setPromptStep("DONE");
      return;
    }
    if (cfg?.playCardKeepStateOnContinue) {
      setPromptStep(null);
      if (!cfg?.playCardKeepTrickOnContinue) {
        setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });
      }
      continuedFromPlayCardRevealRef.current = true;
      if (cfg?.playCardShowNextCustomPromptOnContinue) {
        const throughRound = Number.isFinite(completedRoundIdxRef.current)
          ? completedRoundIdxRef.current
          : completedRoundIdx;
        if (cfg?.playCardAutoAdvanceOneManualTrick && manualTrickMode && throughRound < lastRoundIdx) {
          playOneTrick(throughRound + 1, { ignorePromptLock: true });
        } else {
          afterManualTrick(throughRound);
        }
      }
      return;
    }
    const throughRound = Number.isFinite(cfg?.playCardContinueThroughRoundIdx)
      ? Math.max(-1, Math.min(lastRoundIdx, Number(cfg.playCardContinueThroughRoundIdx)))
      : 0;
    setActiveCustomPrompt(null);
    applyStateThroughRound(throughRound);
    continuedFromPlayCardRevealRef.current = true;
    if (cfg?.playCardShowNextCustomPromptOnContinue) {
      const computed = afterManualTrick(throughRound);
      if (
        cfg?.playCardAutoAdvanceOneManualTrick &&
        manualTrickMode &&
        throughRound < lastRoundIdx &&
        !computed?.customPrompt &&
        !(computed?.prompts && computed.prompts[0])
      ) {
        playOneTrick(throughRound + 1, { ignorePromptLock: true });
      }
    } else if (
      beginnerModeOverride &&
      manualTrickMode &&
      revealCorrect &&
      throughRound >= 0 &&
      throughRound < lastRoundIdx
    ) {
      // Learn bridge from scratch: one Continue after a success reveal should start the next trick
      // (same as "Next trick →") so learners are not asked to Continue and then click Next trick.
      playOneTrick(throughRound + 1, { ignorePromptLock: true });
    }
  };
  continueAfterPlayCardRevealFnRef.current = continueAfterPlayCardReveal;

  const continueAfterPlayDecision = () => {
    if (playDecisionReveal?.fromPlayCard) {
      continueAfterPlayCardReveal();
      return;
    }
    const promptId = playDecisionReveal?.promptId;
    const roundIdxToContinue = Number.isFinite(playDecisionReveal?.roundIdx) ? playDecisionReveal.roundIdx : completedRoundIdx;
    if (!promptId) return;
    const cfg = puzzle.promptOptions?.customPrompts?.find((p) => p.id === promptId);
    if (cfg?.revealFullHandSeatsOnContinue && Array.isArray(cfg?.revealFullHandSeats) && cfg.revealFullHandSeats.length > 0) {
      setStickyRevealFullHandSeats((prev) => [...new Set([...(prev || []), ...cfg.revealFullHandSeats])]);
    }
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
      const playThroughPre = Number(puzzle?.promptOptions?.playThroughRoundAfterPreInclusive);
      if (
        Number.isFinite(playThroughPre) &&
        playThroughPre >= 0 &&
        Number.isFinite(roundIdxToContinue) &&
        roundIdxToContinue < 0 &&
        lastRoundIdx >= 0
      ) {
        const endR = Math.max(0, Math.min(lastRoundIdx, playThroughPre));
        playSegment(0, endR, () => {
          setCompletedRoundIdx(endR);
          afterManualTrick(endR);
        });
        return;
      }
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
      setFeedback({ type: "ok", text: getShortSuccess() });
      pendingAdvanceRef.current = () => {
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
      };
      setWaitingForContinue(true);
    } else {
      const shouldReveal = revealAfterTwoWrong("seatShape", activeCustomPrompt?.id);
      if (shouldReveal) {
        setFeedback({
          type: "ok",
          text: `${REVEAL_GOOD_TRY}The correct answer is ${seatShapeExpected.S}${seatShapeExpected.H}${seatShapeExpected.D}${seatShapeExpected.C}.`,
        });
        pendingAdvanceRef.current = () => {
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
        };
        setWaitingForContinue(true);
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

  const focusNextSeatNoWrap = (seat, isLockedSeat = () => false) => {
    const idx = distSeatOrder.indexOf(seat);
    if (idx === -1) return;
    for (let i = idx + 1; i < distSeatOrder.length; i++) {
      const next = distSeatOrder[i];
      if (!isLockedSeat(next)) {
        setTimeout(() => {
          distributionRefs[next]?.current?.focus?.();
          distributionRefs[next]?.current?.select?.();
        }, 0);
        return;
      }
    }
  };

  const distributionRefs = {
    LHO: useRef(null),
    DUMMY: useRef(null),
    RHO: useRef(null),
    DECLARER: useRef(null),
  };

  const focusNextSeat = (seat) => focusNextSeatNoWrap(seat);

  const nextHand = () => {
    const len = Math.max(1, puzzlesForDifficultyAll.length);
    const next = (puzzleIdxInDifficulty + 1) % len;
    setPuzzleIdxInDifficulty(next);
    // With only one problem in the rail, index stays 0 and puzzle.id never changes — force a full restart.
    if (len === 1) {
      resetForPuzzle();
    }
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
    if (promptStep === "TRICK_COUNT") {
      const t = setTimeout(() => {
        const isCustomTrickCount = activeCustomPrompt?.type === "TRICK_COUNT" && !!activeCustomPrompt?.id;
        const key = isCustomTrickCount ? `customTrickCount:${activeCustomPrompt.id}` : `baseTrickCount:${puzzle.id}`;
        if (trickCountPrefillKey !== key) {
          const prefill = (isCustomTrickCount ? activeCustomPrompt?.trickCountPrefill : null) || puzzle?.promptOptions?.trickCountPrefill || {};
          setTrickCountInput({
            S: prefill?.S !== undefined ? String(prefill.S) : "",
            H: prefill?.H !== undefined ? String(prefill.H) : "",
            D: prefill?.D !== undefined ? String(prefill.D) : "",
            C: prefill?.C !== undefined ? String(prefill.C) : "",
          });
          setTrickCountPrefillKey(key);
          setFeedback(null);
        }
        const firstEditable = ["S", "H", "D", "C"].find((s) => String(trickCountInput[s] ?? "").trim() === "") || "S";
        seatShapeRefs[firstEditable]?.current?.focus?.();
        seatShapeRefs[firstEditable]?.current?.select?.();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [promptStep, activeCustomPrompt, puzzle?.id, puzzle?.promptOptions?.trickCountPrefill, trickCountPrefillKey, trickCountInput, seatShapeRefs]);

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

  const clearFeedback = () => setFeedback(null);

  const isDeclarerSide = viewerSeat === "DECLARER" || viewerSeat === "DUMMY";
  const viewerIsDeclarer = viewerSeat === "DECLARER";
  const viewerIsDefender = viewerSeat === "LHO" || viewerSeat === "RHO";
  const defenderPartnerSeat = viewerSeat === "LHO" ? "RHO" : viewerSeat === "RHO" ? "LHO" : null;
  const isPrePlayInManual = manualTrickMode && completedRoundIdx < 0;

  const roleLabelForSeat = (seat) => {
    if (isCompassTrainerEngine(puzzle)) {
      return compassTrainerSeatLabel(seat, { viewerSeat, declarerCompass });
    }
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

  const getDistributionPairGuidesForStep = (step, promptCfg) => {
    const cfg = promptCfg?.distributionPairGuides || puzzle?.promptOptions?.distributionPairGuides;
    if (!cfg || typeof cfg !== "object") return null;
    const allowedSteps =
      Array.isArray(cfg.applyTo) && cfg.applyTo.length
        ? cfg.applyTo.map((s) => String(s))
        : ["DISTRIBUTION", "DISTRIBUTION_GUESS", "DISTRIBUTION_NEED"];
    if (!allowedSteps.includes(String(step))) return null;

    const rawGroups = Array.isArray(cfg.groups) ? cfg.groups : [];
    if (rawGroups.length !== 2) return null;
    const seenSeats = new Set();
    const groups = [];
    for (let i = 0; i < rawGroups.length; i += 1) {
      const group = rawGroups[i];
      const seats = Array.isArray(group?.seats) ? group.seats.filter((s) => SEATS.includes(s)) : [];
      if (seats.length !== 2 || new Set(seats).size !== 2) return null;
      for (const seat of seats) {
        if (seenSeats.has(seat)) return null;
        seenSeats.add(seat);
      }
      groups.push({
        id: group?.id || `pair-${i + 1}`,
        seats,
        label: String(group?.label || "").trim(),
        tone: i === 0 ? "a" : "b",
      });
    }
    if (seenSeats.size !== 4) return null;

    const variant = typeof cfg.variant === "string" && cfg.variant.trim() ? cfg.variant.trim() : "all_three";
    return { variant, groups };
  };

  const distributionPairClassForSeat = (seat, pairGuides) => {
    if (!pairGuides?.groups?.length) return "";
    const group = pairGuides.groups.find((g) => g.seats.includes(seat));
    if (!group) return "";
    return group.tone === "a" ? "ct-distSeat--pairA" : "ct-distSeat--pairB";
  };

  const pairGeometryClass = (seatA, seatB) => {
    const idxByPos = { left: 0, top: 1, right: 2, bottom: 3 };
    const posA = ["left", "top", "right", "bottom"][distSeatOrder.indexOf(seatA)] || "";
    const posB = ["left", "top", "right", "bottom"][distSeatOrder.indexOf(seatB)] || "";
    const pair = [posA, posB].sort((a, b) => (idxByPos[a] ?? 99) - (idxByPos[b] ?? 99)).join("-");
    if (pair === "left-right") return "centerHorizontal";
    if (pair === "top-bottom") return "centerVertical";
    if (pair === "left-top") return "topLeft";
    if (pair === "top-right") return "topRight";
    if (pair === "left-bottom") return "bottomLeft";
    if (pair === "right-bottom") return "bottomRight";
    return "centerHorizontal";
  };

  const renderDistributionPairMarkers = (pairGuides) => {
    if (!pairGuides?.groups?.length) return null;
    return (
      <div className={`ct-distPairMarkers ct-distPairMarkers--${pairGuides.variant}`} aria-hidden="true">
        {pairGuides.groups.map((group) => {
          const geom = pairGeometryClass(group.seats[0], group.seats[1]);
          return (
            <React.Fragment key={group.id}>
              <div className={`ct-distPairConnector ct-distPairConnector--${group.tone} ct-distPairConnector--${geom}`} />
              <div className={`ct-distPairMarker ct-distPairMarker--${group.tone} ct-distPairMarker--${geom}`}>
                <span className="ct-distPairMarkerMembers">
                  {roleLabelForSeat(group.seats[0])} + {roleLabelForSeat(group.seats[1])}
                </span>
                {!!group.label && <span className="ct-distPairMarkerTarget">{group.label}</span>}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const displayAuctionText = useMemo(() => {
    const base = auctionText;
    const infoId = puzzle?.promptOptions?.auctionShowResolvedDuringInfoPromptId;
    const resolved = puzzle?.promptOptions?.auctionResolvedText;
    if (!infoId || !resolved) return base;
    if (activeCustomPrompt?.id === infoId) return resolved;
    if (activeCustomPrompt?.id === `${infoId}--reveal`) return resolved;
    const asked = askedRef.current?.customAsked || {};
    if (asked[infoId]) return resolved;
    return base;
  }, [auctionText, puzzle?.promptOptions?.auctionShowResolvedDuringInfoPromptId, puzzle?.promptOptions?.auctionResolvedText, askedTick, activeCustomPrompt?.id]);

  const auctionGrid = useMemo(() => {
    if (!displayAuctionText) return null;
    return buildAuctionGrid({ auctionText: displayAuctionText, dealerCompass });
  }, [displayAuctionText, dealerCompass]);
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
  const hideTableCardsForEndReveal =
    promptStep === "DONE" &&
    showFullHands &&
    Array.isArray(puzzle?.revealFullHandsAtEnd) &&
    puzzle.revealFullHandsAtEnd.length > 0;
  const hideAuctionNow =
    !!puzzle?.promptOptions?.hideAuction ||
    (promptStep === "DONE" && !!puzzle?.promptOptions?.hideAuctionOnDone) ||
    promptStep === "PLAY_DECISION_REVEAL";

  const [isNarrowRailContext, setIsNarrowRailContext] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(RAIL_CONTEXT_COLLAPSE_MEDIA).matches : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia(RAIL_CONTEXT_COLLAPSE_MEDIA);
    let debounceT = null;
    const applyMatches = () => setIsNarrowRailContext(mq.matches);
    applyMatches();
    const onMqChange = () => {
      if (debounceT != null) window.clearTimeout(debounceT);
      debounceT = window.setTimeout(() => {
        debounceT = null;
        setIsNarrowRailContext(mq.matches);
      }, 100);
    };
    mq.addEventListener("change", onMqChange);
    return () => {
      mq.removeEventListener("change", onMqChange);
      if (debounceT != null) window.clearTimeout(debounceT);
    };
  }, []);

  const hasVideoOrIntroInRailSlot =
    !!showThemeIntroInRail || !!usingThemeIntro || !!showPerProblemIntroInRail;

  const hasCollapsibleRailContext =
    isNarrowRailContext &&
    (!!effectiveThemeLabel || (!!auctionGrid && !hideAuctionNow) || hasVideoOrIntroInRailSlot);

  const railContextAutoCollapseTimerRef = useRef(null);
  const railCollapseLastPuzzleIdRef = useRef(undefined);
  /** State (not ref): effect must see this so matchMedia / layout churn cannot re-arm collapse before React re-renders. */
  const [railAutoCollapseSuppressed, setRailAutoCollapseSuppressed] = useState(false);
  const [railContextExpanded, setRailContextExpanded] = useState(true);
  useEffect(() => {
    const pid = puzzle?.id;
    const isStablePid = typeof pid === "string" && pid.length > 0;
    // Only treat as a new hand when both ids are real strings. If `puzzle?.id` flickers
    // undefined→"foo" on re-render, `undefined !== "foo"` must NOT reset suppression or the
    // collapse timer re-arms immediately after the user taps "Show theme…".
    let transitionedToNewStablePuzzle = false;
    if (isStablePid && railCollapseLastPuzzleIdRef.current !== pid) {
      const prev = railCollapseLastPuzzleIdRef.current;
      railCollapseLastPuzzleIdRef.current = pid;
      transitionedToNewStablePuzzle = typeof prev === "string" && prev.length > 0;
      if (transitionedToNewStablePuzzle) {
        setRailAutoCollapseSuppressed(false);
      }
    }

    // Touch-first devices: timer + layout churn caused the rail to snap shut right after expand.
    // Rely on the peek control for collapse instead of a delayed auto-hide.
    const skipAutoCollapseTimer =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;

    if (!hasCollapsibleRailContext) {
      if (railContextAutoCollapseTimerRef.current != null) {
        window.clearTimeout(railContextAutoCollapseTimerRef.current);
        railContextAutoCollapseTimerRef.current = null;
      }
      setRailContextExpanded(true);
      return undefined;
    }
    setRailContextExpanded(true);

    const treatCollapseSuppressed = railAutoCollapseSuppressed && !transitionedToNewStablePuzzle;
    if (treatCollapseSuppressed || skipAutoCollapseTimer) {
      if (railContextAutoCollapseTimerRef.current != null) {
        window.clearTimeout(railContextAutoCollapseTimerRef.current);
        railContextAutoCollapseTimerRef.current = null;
      }
      return () => {
        if (railContextAutoCollapseTimerRef.current != null) {
          window.clearTimeout(railContextAutoCollapseTimerRef.current);
          railContextAutoCollapseTimerRef.current = null;
        }
      };
    }

    if (railContextAutoCollapseTimerRef.current != null) {
      window.clearTimeout(railContextAutoCollapseTimerRef.current);
    }
    railContextAutoCollapseTimerRef.current = window.setTimeout(() => {
      railContextAutoCollapseTimerRef.current = null;
      setRailContextExpanded(false);
    }, RAIL_CONTEXT_AUTO_COLLAPSE_MS);
    return () => {
      if (railContextAutoCollapseTimerRef.current != null) {
        window.clearTimeout(railContextAutoCollapseTimerRef.current);
        railContextAutoCollapseTimerRef.current = null;
      }
    };
  }, [puzzle?.id, hasCollapsibleRailContext, railAutoCollapseSuppressed]);

  const expandRailThemeAndAuction = () => {
    if (railContextAutoCollapseTimerRef.current != null) {
      window.clearTimeout(railContextAutoCollapseTimerRef.current);
      railContextAutoCollapseTimerRef.current = null;
    }
    setRailAutoCollapseSuppressed(true);
    setRailContextExpanded(true);
  };

  const renderRailThemeAndAuction = useCallback(
    () => (
      <>
        {!!effectiveThemeLabel && (
          <div
            className={`ct-themeLabel ct-themeLabel--rail ${puzzle?.promptOptions?.promptThemeTint === "points" ? "ct-themeLabel--themePoints" : ""} ${puzzle?.promptOptions?.promptThemeTint === "active" ? "ct-themeLabel--themeActive" : ""} ${puzzle?.promptOptions?.promptThemeTint === "respond" ? "ct-themeLabel--themeRespond" : ""} ${puzzle?.promptOptions?.promptThemeTint === "1nt" ? "ct-themeLabel--theme1nt" : ""} ${puzzle?.promptOptions?.promptThemeTint === "matchpoints" ? "ct-themeLabel--themeMatchpoints" : ""} ${puzzle?.promptOptions?.promptThemeTint === "handEval" ? "ct-themeLabel--themeHandEval" : ""} ${puzzle?.promptOptions?.promptThemeTint === "doubles" ? "ct-themeLabel--themeDoubles" : ""} ${puzzle?.promptOptions?.promptThemeTint === "knockAce" ? "ct-themeLabel--themeKnockAce" : ""} ${isCyanDeclarerThemeTint(puzzle?.promptOptions?.promptThemeTint) ? "ct-themeLabel--themeDrawTrumps" : ""} ${puzzle?.promptOptions?.promptThemeTint === "ruffingLot" ? "ct-themeLabel--themeRuffingLot" : ""} ${puzzle?.promptOptions?.promptThemeTint === "enemyFive" ? "ct-themeLabel--themeEnemyFive" : ""} ${puzzle?.promptOptions?.promptThemeTint === "twoLevel" ? "ct-themeLabel--themeTwoLevel" : ""} ${puzzle?.promptOptions?.promptThemeTint === "respondToDouble" ? "ct-themeLabel--themeRespondToDouble" : ""} ${puzzle?.promptOptions?.promptThemeTint === "splinters" ? "ct-themeLabel--themeSplinters" : ""}`}
          >
            {effectiveThemeLabel}
          </div>
        )}
        {auctionGrid && !hideAuctionNow && (
          <div className="ct-auctionCard" aria-label="Bidding">
            {(puzzle?.vulnerability || puzzle?.promptOptions?.vulnerability) ? (
              <div className="ct-auctionVul" aria-label="Vulnerability">{puzzle.vulnerability || puzzle.promptOptions.vulnerability}</div>
            ) : null}
            <div className="ct-auctionGrid" role="table" aria-label="Auction grid">
              <div className="ct-auctionHead" role="row">
                {auctionGrid.order.map((seat) => (
                  <div
                    key={`h-${seat}`}
                    className={`ct-auctionCell ct-auctionCell--head ${puzzle?.promptOptions?.auctionAllRed ? "ct-auctionCell--red" : puzzle?.promptOptions?.auctionAllWhite ? "ct-auctionCell--white" : ""} ${!puzzle?.promptOptions?.auctionAllRed && !puzzle?.promptOptions?.auctionAllWhite && puzzle?.promptOptions?.auctionOpponentsRed && (seat === "W" || seat === "E") ? "ct-auctionCell--red" : ""} ${!puzzle?.promptOptions?.auctionAllRed && !puzzle?.promptOptions?.auctionAllWhite && puzzle?.promptOptions?.auctionOpponentsRed && (seat === "N" || seat === "S") ? (puzzle?.promptOptions?.auctionPartnersGreen ? "ct-auctionCell--green" : "ct-auctionCell--white") : ""}`}
                    role="columnheader"
                  >
                    {seatCompassLabel(seat)}
                  </div>
                ))}
              </div>
              {auctionGrid.rows.map((row, idx) => (
                <div key={`r-${idx}`} className="ct-auctionRow" role="row">
                  {auctionGrid.order.map((seat) => {
                    const c = row[seat];
                    return (
                      <div
                        key={`c-${idx}-${seat}`}
                        className={`ct-auctionCell ${puzzle?.promptOptions?.auctionAllRed ? "ct-auctionCell--red" : puzzle?.promptOptions?.auctionAllWhite ? "ct-auctionCell--white" : ""} ${!puzzle?.promptOptions?.auctionAllRed && !puzzle?.promptOptions?.auctionAllWhite && puzzle?.promptOptions?.auctionOpponentsRed && (seat === "W" || seat === "E") ? "ct-auctionCell--red" : ""} ${!puzzle?.promptOptions?.auctionAllRed && !puzzle?.promptOptions?.auctionAllWhite && puzzle?.promptOptions?.auctionOpponentsRed && (seat === "N" || seat === "S") ? (puzzle?.promptOptions?.auctionPartnersGreen ? "ct-auctionCell--green" : "ct-auctionCell--white") : ""}`}
                        role="cell"
                      >
                        {c ? (
                          <span
                            className={`ct-auctionCall ct-auctionCall--${c.kind} ${
                              puzzle?.promptOptions?.auctionHighlightCall?.row === idx &&
                              puzzle?.promptOptions?.auctionHighlightCall?.seat === seat
                                ? "ct-auctionCall--ring"
                                : ""
                            }`.trim()}
                          >
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
            {!!puzzle?.promptOptions?.auctionHighlightNote && (
              <div className="ct-auctionHighlightNote">{puzzle.promptOptions.auctionHighlightNote}</div>
            )}
          </div>
        )}
      </>
    ),
    [effectiveThemeLabel, auctionGrid, hideAuctionNow, puzzle]
  );

  const renderRailPracticeVideos = useCallback(
    () => (
      <div className="ct-practiceVideoSlot" key={puzzle?.id ? `video-intro-${puzzle.id}` : "video-intro"}>
        {showThemeIntroInRail && (
          <PracticeVideoBlock
            videoUrl={effectiveThemeIntroUrl}
            isPremium={currentPuzzleVideoUnlocked}
            label="Theme intro"
            className="ct-practiceVideo--beforeStart"
            isAdmin={isAdmin}
            softMembershipCta={beginnerModeOverride}
          />
        )}
        {usingThemeIntro && (
          <div className="ct-themeIntroControls">
            {themeIntroExpanded ? (
              <button type="button" className="ct-themeIntroBtn" onClick={markThemeIntroSeen}>
                Dismiss intro
              </button>
            ) : (
              <button type="button" className="ct-themeIntroBtn ct-themeIntroBtn--secondary" onClick={showThemeIntroAgain}>
                Watch theme intro again
              </button>
            )}
          </div>
        )}
        {showPerProblemIntroInRail && (
          <PracticeVideoBlock
            videoUrl={perProblemIntroVideoUrl}
            isPremium={currentPuzzleVideoUnlocked}
            label="30s problem intro"
            className="ct-practiceVideo--beforeStart"
            isAdmin={isAdmin}
            softMembershipCta={beginnerModeOverride}
          />
        )}
      </div>
    ),
    [
      puzzle?.id,
      showThemeIntroInRail,
      effectiveThemeIntroUrl,
      currentPuzzleVideoUnlocked,
      beginnerModeOverride,
      isAdmin,
      usingThemeIntro,
      themeIntroExpanded,
      markThemeIntroSeen,
      showThemeIntroAgain,
      showPerProblemIntroInRail,
      perProblemIntroVideoUrl,
    ]
  );

  const showRailWatchPlayNote = hasStarted && !promptStep && lastRoundIdx >= 0;
  const showNarrowIntroVideoDock =
    showHeaderRail &&
    isNarrowRailContext &&
    hasVideoOrIntroInRailSlot &&
    (!hasCollapsibleRailContext || railContextExpanded);
  /** Wide layouts stack theme + videos in one rail; after Start, watch copy goes between them. */
  const showWatchInsideWideRail = showRailWatchPlayNote && showHeaderRail && !isNarrowRailContext;
  /** Narrow + intro dock: after Start, watch copy sits above the docked videos. */
  const showWatchBeforeNarrowVideoDock = showRailWatchPlayNote && showNarrowIntroVideoDock;
  const showWatchAfterRailFallback =
    showRailWatchPlayNote && !showWatchBeforeNarrowVideoDock && !showWatchInsideWideRail;

  /** Full-hands / bottom-row: after Start, stack watch copy then intro videos under the felt (not in sidebar). */
  const movePlayGuidanceUnderTable = useBottomRowLayout && hasStarted;

  const renderRailWatchPlayNote = () => (
    <>
      <div className="ct-watchNote">
        {completedRoundIdx >= lastRoundIdx
          ? "Hand complete."
          : (() => {
              const onlyAfterRound = puzzle?.promptOptions?.watchNoteOnlyAfterRound;
              const onlyAfterPlayCardReveal = puzzle?.promptOptions?.watchNoteOnlyAfterPlayCardReveal;
              const showNote =
                (onlyAfterPlayCardReveal ? continuedFromPlayCardRevealRef.current : true) &&
                (onlyAfterRound == null || completedRoundIdx >= onlyAfterRound);
              const noteText = showNote ? (puzzle?.promptOptions?.watchNote || "Watch the play, then answer.") : "";
              const suffix = manualTrickMode && lastRoundIdx >= 0 && completedRoundIdx < lastRoundIdx ? " Click Next →" : "";
              return noteText ? noteText + suffix : (suffix ? suffix.trim() : "");
            })()}
      </div>
      {manualTrickMode && lastRoundIdx >= 0 && completedRoundIdx < lastRoundIdx && (
        <div className="ct-railActions" style={{ marginTop: 8 }}>
          <button
            className="ct-btn"
            onClick={() => {
              const next = completedRoundIdx + 1;
              if (next > lastRoundIdx) return;
              playOneTrick(next);
            }}
            disabled={!hasStarted || isPlaying}
          >
            Next trick →
          </button>
        </div>
      )}
    </>
  );

  const themeJumpOptions = useMemo(() => {
    if (beginnerModeOverride || !history?.push) return [];
    const opts = [];
    const seen = new Set();
    /** `categoryKey::themeTint` — skip a per-puzzle tint row only when a homepage pack already covers that tint in that category. */
    const packedTintByCategory = new Set();
    const categoryOrder = (k) => {
      const i = THEME_JUMP_CATEGORY_KEYS.indexOf(k);
      return i === -1 ? 99 : i;
    };

    for (const pack of THEME_PACKS) {
      if (!pack?.id || !pack?.to) continue;
      const value = `pack:${pack.id}`;
      if (seen.has(value)) continue;
      seen.add(value);
      const packCat = String(pack.categoryKey || "").trim();
      const packTab = packCat ? themeJumpTabLabel(packCat) : "";
      const packTitle = String(pack.title || pack.id).trim();
      opts.push({
        value,
        label: packTab ? `${packTab}: ${packTitle}` : packTitle,
        categoryKey: packCat,
        apply: () => history.push(pack.to),
      });
      if (pack.categoryKey && pack.themeTint) {
        packedTintByCategory.add(`${pack.categoryKey}::${pack.themeTint}`);
      }
    }

    const puzzlesByCategory = loadTrainerPuzzlesByCategoryForThemeJump();
    const seenTintInCategory = new Set();
    const seenLabelInCategory = new Set();

    for (const catKey of THEME_JUMP_CATEGORY_KEYS) {
      const list = puzzlesByCategory[catKey];
      if (!Array.isArray(list)) continue;
      const path = themeJumpTabPath(catKey);
      const tab = themeJumpTabLabel(catKey);
      for (const p of list) {
        const po = p?.promptOptions;
        const themeLabel = String(po?.themeLabel || "").trim();
        const tint = po?.promptThemeTint;
        const d = Number(p.difficulty || 1);
        const pushJump = (value, labelText, dedupeKey) => {
          if (seen.has(dedupeKey)) return;
          seen.add(dedupeKey);
          opts.push({
            value,
            label: `${tab}: ${labelText}`,
            categoryKey: catKey,
            apply: () =>
              history.push({
                pathname: path,
                search: `?difficulty=${encodeURIComponent(String(d))}&problem=${encodeURIComponent(p.id)}`,
              }),
          });
        };

        if (tint) {
          if (packedTintByCategory.has(`${catKey}::${tint}`)) {
            // Homepage pack already lists this tint for this category (e.g. Defence + enemyFive).
            continue;
          }
          // Same `promptThemeTint` can mean different authored themes (e.g. bidding `1nt` for Lebensohl vs other 1NT topics).
          const labelKey = themeLabel.trim();
          const dedupeKey = `tint::${catKey}::${tint}::${labelKey}`;
          if (seenTintInCategory.has(dedupeKey)) continue;
          seenTintInCategory.add(dedupeKey);
          const labelBase =
            labelKey || THEME_INTRO_BY_TINT[tint]?.title || `Theme (${tint})`;
          const valuePath =
            labelKey.length > 0
              ? `here:${catKey}:${tint}:${encodeURIComponent(labelKey)}`
              : `here:${catKey}:${tint}`;
          pushJump(valuePath, labelBase, `opt::${dedupeKey}`);
        } else if (themeLabel) {
          const dedupeKey = `lbl::${catKey}::${themeLabel}`;
          if (seenLabelInCategory.has(dedupeKey)) continue;
          seenLabelInCategory.add(dedupeKey);
          pushJump(`here:${catKey}:label:${encodeURIComponent(themeLabel)}`, themeLabel, `opt::${dedupeKey}`);
        }
      }
    }

    const stripCategoryPrefixForSort = (label, tabLabel) => {
      const s = String(label || "").trim();
      const prefix = `${tabLabel}: `;
      if (tabLabel && s.toLowerCase().startsWith(prefix.toLowerCase())) {
        return s.slice(prefix.length).trim();
      }
      return s;
    };
    opts.sort((a, b) => {
      const ca = categoryOrder(a.categoryKey);
      const cb = categoryOrder(b.categoryKey);
      if (ca !== cb) return ca - cb;
      const ta = themeJumpTabLabel(a.categoryKey);
      const tb = themeJumpTabLabel(b.categoryKey);
      const sa = stripCategoryPrefixForSort(a.label, ta);
      const sb = stripCategoryPrefixForSort(b.label, tb);
      const cmp = sa.localeCompare(sb, undefined, { sensitivity: "base" });
      if (cmp !== 0) return cmp;
      return (a.label || "").localeCompare(b.label || "", undefined, { sensitivity: "base" });
    });
    return opts;
  }, [beginnerModeOverride, history]);

  const promptNode = (
    <>
      {showHeaderRail && (
        <div className="ct-railMuted">
          {showSubscribeBanner && !beginnerModeOverride && (
            <Link to="/membership" className="ct-subscribeBanner" aria-label="Start 7-day free trial">
              <span className="ct-subscribeBannerIcon">
                <i className="material-icons" aria-hidden>star</i>
              </span>
              <span className="ct-subscribeBannerContent">
                <strong>Start 7-day free trial</strong> — Get full access to all {trainerLabel} exercises
              </span>
              <span className="ct-subscribeBannerBtn">Start free trial</span>
            </Link>
          )}
          {effectiveContractDisplayText && !showBeginnerLessonContractBanner ? (
            <div className="ct-contractLine">
              {puzzle?.promptOptions?.contractLabel ? (
                <TextWithColoredSuits text={effectiveContractDisplayText} />
              ) : (
                <>Contract is <strong><ContractWithColoredSuit text={contractText} /></strong> by <strong>{declarerCompassName}</strong></>
              )}
            </div>
          ) : null}
          {hasCollapsibleRailContext ? (
            railContextExpanded ? (
              <div className="ct-railContextWrap">
                {isNarrowRailContext ? (
                  renderRailThemeAndAuction()
                ) : (
                  <>
                    {renderRailThemeAndAuction()}
                    {showWatchInsideWideRail ? renderRailWatchPlayNote() : null}
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="ct-railContextPeekBtn"
                onClick={expandRailThemeAndAuction}
                aria-expanded="false"
              >
                Show theme, bidding & videos
              </button>
            )
          ) : isNarrowRailContext ? (
            renderRailThemeAndAuction()
          ) : movePlayGuidanceUnderTable ? (
            renderRailThemeAndAuction()
          ) : (
            <>
              {renderRailThemeAndAuction()}
              {showWatchInsideWideRail ? renderRailWatchPlayNote() : null}
            </>
          )}
        </div>
      )}

      {!movePlayGuidanceUnderTable && showWatchBeforeNarrowVideoDock ? renderRailWatchPlayNote() : null}

      {!movePlayGuidanceUnderTable && showWatchAfterRailFallback ? renderRailWatchPlayNote() : null}

      {promptStep && promptStep !== "DONE" && (
        <div className={`ct-promptRail ${
          feedback?.type === "ok" &&
          waitingForContinue &&
          !["SINGLE_NUMBER", "SEAT_SUIT_COUNT", "DEFENDERS_STARTED", "DEFENDERS_REMAINING", "DEFENDERS_HEARTS_STARTED"].includes(promptStep)
            ? "ct-promptRail--withFeedback"
            : ""
        }`}>
          <div className="ct-promptRail-content">
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

          {promptStep === "INFO" && !puzzle?.promptOptions?.promptsInOverlay && (
            <>
              <div className="ct-questionText ct-questionText--formatted">
                <FormattedRevealText text={activeCustomPrompt?.promptText || "Continue."} />
              </div>
              <div className="ct-railActions" style={{ marginTop: 12 }}>
                <button className="ct-btn" onClick={submitInfoPrompt} disabled={isPlaying}>
                  {activeCustomPrompt?.continueButtonLabel || "Continue"}
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

          {promptStep === "SINGLE_NUMBER" && !puzzle?.promptOptions?.promptsInOverlay && (
            <>
              <div className="ct-questionText ct-questionText--formatted">
                <FormattedRevealText text={activeCustomPrompt?.promptText || "Enter the number."} />
              </div>
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

          {promptStep === "PLAY_CARD" && (
            <div className="ct-playDecisionBlock" role="region" aria-label="Play a card">
              <div className="ct-questionText ct-playDecisionBlock-question ct-playDecisionBlock-question--formatted">
                <FormattedRevealText
                  text={
                    activeCustomPrompt?.playCardPromptTextDeclarerTurn &&
                    playCardInteractiveStep === "declarer"
                      ? activeCustomPrompt.playCardPromptTextDeclarerTurn
                      : activeCustomPrompt?.promptText || "Click a card in your hand to play it."
                  }
                />
              </div>
              {!!puzzle?.promptOptions?.persistentPlayCardHint && (
                <p className="ct-playDecisionBlock-hint" style={{ marginTop: 10, opacity: 0.95 }}>
                  {puzzle.promptOptions.persistentPlayCardHint}
                </p>
              )}
            </div>
          )}

          {promptStep === "PLAY_DECISION" && (
            <div ref={playDecisionQuestionRef} className="ct-playDecisionBlock" role="region" aria-label="Question">
              <PracticeVideoBlock
                videoUrl={activeCustomPrompt?.videoUrlStart}
                isPremium={currentPuzzleVideoUnlocked}
                label="30s intro"
                className="ct-practiceVideo--start"
                isAdmin={isAdmin}
                softMembershipCta={beginnerModeOverride}
              />
              {!puzzle?.promptOptions?.hidePlayDecisionHeading && !activeCustomPrompt?.hidePlayDecisionHeading && (
                <div className="ct-playDecisionBlock-heading">Your turn — answer below</div>
              )}
              <div className="ct-playDecisionBlock-question ct-playDecisionBlock-question--formatted">
                <FormattedRevealText text={activeCustomPrompt?.promptText || "What’s your play?"} />
              </div>
              <div
                className={`ct-railActions${activeCustomPrompt?.playDecisionInput === "biddingBox" ? " ct-railActions--biddingBox" : ""}`}
                style={
                  activeCustomPrompt?.playDecisionInput === "biddingBox"
                    ? { marginTop: 12, display: "block", width: "100%" }
                    : { marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }
                }
              >
                {activeCustomPrompt?.playDecisionInput === "biddingBox" ? (
                  <PlayDecisionBiddingBox onSelect={submitPlayDecision} disabled={isPlaying} />
                ) : (
                  (activeCustomPrompt?.options || []).map((o) => (
                    <button key={o.id} className="ct-btn" onClick={() => submitPlayDecision(o.id)} disabled={isPlaying}>
                      <TextWithColoredSuits text={o.label} />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {(promptStep === "PLAY_DECISION_REVEAL" || promptStep === "PLAY_CARD_REVEAL") && (
            <>
              {!!playDecisionReveal?.text && (
                <div className="ct-playRevealWrap">
                  {playDecisionReveal?.correct && !activeCustomPrompt?.playCardRevealHideSuccessBanner && (
                    <strong className="ct-feedback ct-feedback--ok ct-revealSuccess">{getShortSuccess()}</strong>
                  )}
                  <FormattedRevealText text={playDecisionReveal.text} className="ct-playRevealText" />
                </div>
              )}
              {!!activeCustomPrompt?.motivationText && (
                <p className="ct-revealMotivation">{activeCustomPrompt.motivationText}</p>
              )}
              <PracticeVideoBlock
                videoUrl={activeCustomPrompt?.videoUrl}
                isPremium={currentPuzzleVideoUnlocked}
                label="30s explanation"
                className="ct-practiceVideo--reveal"
                isAdmin={isAdmin}
                softMembershipCta={beginnerModeOverride}
              />
              {!activeCustomPrompt?.noContinue && (
                <div className="ct-railActions" style={{ marginTop: 12 }}>
                  <button className="ct-btn" onClick={continueAfterPlayDecision} disabled={isPlaying}>
                    {activeCustomPrompt?.continueButtonLabel || "Continue"}
                  </button>
                </div>
              )}
              {activeCustomPrompt?.noContinue && puzzlesForDifficultyAll.length > 0 && (
                <div className="ct-railActions" style={{ marginTop: 12 }}>
                  <button className="ct-btn" onClick={nextHand} disabled={isPlaying}>
                    {beginnerFlatHandNav ? "Next hand" : "Next problem"}
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
                  const pairGuides = getDistributionPairGuidesForStep("DISTRIBUTION", activeCustomPrompt);
                  return distSeatOrder.map((seat, idx) => (
                  <div
                    key={seat}
                    className={`ct-distSeat ${distributionPairClassForSeat(seat, pairGuides)}`}
                    data-position={["left", "top", "right", "bottom"][idx]}
                  >
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
                          else focusNextSeatNoWrap(seat, isLocked);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (seat === distSeatOrder[distSeatOrder.length - 1]) submitDistribution();
                            else focusNextSeatNoWrap(seat, isLocked);
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
                {renderDistributionPairMarkers(getDistributionPairGuidesForStep("DISTRIBUTION", activeCustomPrompt))}
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

          {promptStep === "DISTRIBUTION_GUESS" && !puzzle?.promptOptions?.promptsInOverlay && (
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
                  const pairGuides = getDistributionPairGuidesForStep("DISTRIBUTION_GUESS", activeCustomPrompt);
                  return distSeatOrder.map((seat, idx) => (
                    <div
                      key={seat}
                      className={`ct-distSeat ${distributionPairClassForSeat(seat, pairGuides)}`}
                      data-position={["left", "top", "right", "bottom"][idx]}
                    >
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
                            else focusNextSeatNoWrap(seat, isLocked);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (seat === distSeatOrder[distSeatOrder.length - 1]) submitDistributionGuess();
                              else focusNextSeatNoWrap(seat, isLocked);
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
                {renderDistributionPairMarkers(getDistributionPairGuidesForStep("DISTRIBUTION_GUESS", activeCustomPrompt))}
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
                  const pairGuides = getDistributionPairGuidesForStep("DISTRIBUTION_NEED", activeCustomPrompt);
                  return distSeatOrder.map((seat, idx) => (
                    <div
                      key={seat}
                      className={`ct-distSeat ${distributionPairClassForSeat(seat, pairGuides)}`}
                      data-position={["left", "top", "right", "bottom"][idx]}
                    >
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
                            else focusNextSeatNoWrap(seat, isLocked);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (seat === distSeatOrder[distSeatOrder.length - 1]) submitDistributionNeed();
                              else focusNextSeatNoWrap(seat, isLocked);
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
                {renderDistributionPairMarkers(getDistributionPairGuidesForStep("DISTRIBUTION_NEED", activeCustomPrompt))}
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
                Let's simply count the tricks we can see in front of us, in each suit.
              </div>

              <div className="ct-shapeRow ct-shapeRow--trickCount" role="group" aria-label="Trick count inputs">
                {["S", "H", "D", "C"].map((suit) => (
                  <div key={`tc-${suit}`} className="ct-distSeat">
                    <div className={`ct-distLabel ct-distLabel--trickCountSuit ct-distLabel--trickCountSuit${suit}`}>{suitSymbol(suit)}</div>
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

          </div>
          {feedback && (feedback.type === "ok" && waitingForContinue ? (
            <div className={`ct-feedback ct-feedback--ok ct-feedbackWithContinue`}>
              <button className="ct-btn ct-feedbackWithContinue-btn" onClick={runSuccessPrimaryCta} disabled={isPlaying}>
                Continue
              </button>
              <span className={`ct-feedbackWithContinue-text ${successFeedbackFading ? "ct-feedbackWithContinue-text--fading" : ""}`}>
                <strong>{feedback.text}</strong>
              </span>
            </div>
          ) : (
            <div className={`ct-feedback ${feedback.type === "ok" ? "ct-feedback--ok" : "ct-feedback--error"}`}>
              {feedback.type === "ok" ? (
                <strong>{feedback.text}</strong>
              ) : (
                feedback.text
              )}
            </div>
          ))}
        </div>
      )}

      {showHeaderRail && hasVideoOrIntroInRailSlot && (
        <div className="ct-railMuted ct-railMuted--introVideosDock ct-railMuted--practiceVideosAfterPrompts">
          {hasCollapsibleRailContext ? (
            <div className="ct-railContextWrap ct-railContextWrap--videoDock">{renderRailPracticeVideos()}</div>
          ) : (
            renderRailPracticeVideos()
          )}
        </div>
      )}

      {promptStep === "DONE" && (
        <div className="ct-promptDone" ref={promptDoneRef}>
          <div className="ct-promptTitle">
            {trainerLabel === "Counting"
              ? DONE_TITLES[doneMessageIndex(puzzle?.id, DONE_TITLES.length)]
              : trainerLabel === "Bidding"
                ? BIDDING_DONE_TITLES[doneMessageIndex(`${puzzle?.id || ""}:bidTitle`, BIDDING_DONE_TITLES.length)]
                : "Well done — exercise complete."}
          </div>
          {!!doneExtraText && (
            <FormattedRevealText text={doneExtraText} className="ct-railMuted ct-doneExtraText" />
          )}
          <div className="ct-railMuted ct-doneNote">
            {trainerLabel === "Counting"
              ? DONE_NOTES[doneMessageIndex((puzzle?.id || "") + "n", DONE_NOTES.length)]
              : trainerLabel === "Bidding"
                ? BIDDING_DONE_NOTES[doneMessageIndex(`${puzzle?.id || ""}:bidNote`, BIDDING_DONE_NOTES.length)]
                : "Keep going — repetition builds instincts."}
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
    <div
      className={`ct-page ${showFullHands ? "ct-page--fullhands" : ""} ${beginnerModeOverride ? "ct-page--beginnerPractice" : ""}${beginnerModeOverride && categoryKey === "declarer" ? " ct-beginnerDeclarerStage" : ""} ${isMobileViewport && !beginnerModeOverride ? "ct-page--phoneHandPips" : ""} ${typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location?.hostname || "") ? "ct-page--localhost" : ""}`}
      style={trainerPipPageStyle}
    >
      {showBeginnerLessonContractBanner && (
        <div className="ct-beginnerPageIntro" aria-label="Lesson introduction">
          <BeginnerLessonContractTitle text={effectiveContractDisplayText} />
        </div>
      )}

      <div className={`ct-layout ${showFullHands ? "ct-layout--fullhands" : ""}`}>
        <div className="ct-stage">
          <div className="ct-topNavWrap">
            <div className="ct-topNav" aria-label={`${trainerLabel} navigation`}>
              {/* Category tier: Declarer | Defence | Counting | Bidding | Just play | Treadmill */}
              <div className="ct-categoryRow" aria-label="Trainer category">
                <div className="ct-categoryTabs" role="tablist">
                  {effectiveCategoryTabs.map((c) => (
                    <Link
                      key={c.key}
                      to={c.path}
                      className={`ct-categoryTab ${c.key === categoryKey ? "ct-categoryTab--active" : ""}`}
                      role="tab"
                      aria-selected={c.key === categoryKey}
                    >
                      {c.label}
                      {c.new && <span className="ct-newBadge" aria-label="New">New</span>}
                    </Link>
                  ))}
                </div>
              </div>

              {!beginnerModeOverride && history?.push && (
                <div className="ct-themeSearchRow" aria-label="Jump to a theme">
                  <span className="ct-themeSearchLabel" id={`ct-themeSearchLabel-${categoryKey}`}>
                    Theme
                  </span>
                  <select
                    id={`ct-themeSearchSelect-${categoryKey}`}
                    className="ct-themeSearchSelect browser-default"
                    aria-labelledby={`ct-themeSearchLabel-${categoryKey}`}
                    value={themeJumpSelection}
                    onChange={(e) => setThemeJumpSelection(e.target.value)}
                  >
                    <option value="">Choose a theme…</option>
                    {themeJumpOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="ct-btn ct-themeSearchOk"
                    disabled={!themeJumpSelection}
                    onClick={() => {
                      const opt = themeJumpOptions.find((o) => o.value === themeJumpSelection);
                      if (!opt?.apply) return;
                      opt.apply();
                      setThemeJumpSelection("");
                    }}
                  >
                    OK
                  </button>
                </div>
              )}

              {!hideDifficultyTabs && (
                <div className="ct-topNavRow ct-topNavRow--diff" aria-label="Stage tabs">
                  <span className="ct-topNavLabel">Stage</span>
                  <div className="ct-diffTabs" role="tablist" aria-label="Stages">
                    {[1, 2, 3].map((d) => {
                      const puzzlesInDiff = puzzlesAll.filter((p) => (p.difficulty || 1) === d);
                      const hasNewInDiff = puzzlesInDiff.some(isPuzzleNew);
                      const allCompletedInDiff = puzzlesInDiff.length > 0 && puzzlesInDiff.every((p) => !!completedProblemIds[p.id]);
                      return (
                        <button
                          key={d}
                          className={`ct-diffTab ${d === selectedDifficulty ? "ct-diffTab--active" : ""} ${allCompletedInDiff ? "ct-diffTab--completed" : ""}`}
                          onClick={() => {
                            setSelectedDifficulty(d);
                            setPuzzleIdxInDifficulty(0);
                          }}
                          type="button"
                          role="tab"
                          aria-selected={d === selectedDifficulty}
                        >
                          {allCompletedInDiff && <span className="ct-diffTabTick" aria-hidden="true">✓</span>}
                          {d}
                          {hasNewInDiff && <span className="ct-newBadge" aria-label="New">New</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hand / problem picker tier */}
              <div className="ct-topNavSubRow" aria-label={beginnerFlatHandNav ? "Hands" : "Problem tabs"}>
                {!beginnerFlatHandNav && (
                  <span className="ct-topNavLabel ct-topNavLabel--sub">
                    Problems
                    {!hideDifficultyTabs && (
                      <span className="ct-topNavSubNote"> in Stage {selectedDifficulty}</span>
                    )}
                  </span>
                )}
                <div
                  className="ct-problemTabs ct-problemTabs--sub"
                  role="tablist"
                  aria-label={
                    beginnerFlatHandNav
                      ? "Hands in order"
                      : hideDifficultyTabs
                        ? "Problems"
                        : "Problems in stage"
                  }
                >
                  {isBlankDifficulty ? (
                    <span className="ct-railMuted">—</span>
                  ) : (
                    puzzlesForDifficultyAll.map((p, idx) => {
                      const isUnlocked = isMember || isFreeProblem(p.id);
                      const isCompleted = !!completedProblemIds[p.id];
                      const showFreeBadge = !isMember && isFreeProblem(p.id);
                      return (
                        <button
                          key={p.id}
                          className={`ct-problemTab ${idx === puzzleIdxInDifficulty ? "ct-problemTab--active" : ""} ${!isUnlocked ? "ct-problemTab--locked" : ""} ${isCompleted ? "ct-problemTab--completed" : ""} ${p?.promptOptions?.promptThemeTint === "points" ? "ct-problemTab--themePoints" : ""} ${p?.promptOptions?.promptThemeTint === "active" ? "ct-problemTab--themeActive" : ""} ${p?.promptOptions?.promptThemeTint === "respond" ? "ct-problemTab--themeRespond" : ""} ${p?.promptOptions?.promptThemeTint === "1nt" ? "ct-problemTab--theme1nt" : ""} ${p?.promptOptions?.promptThemeTint === "matchpoints" ? "ct-problemTab--themeMatchpoints" : ""} ${p?.promptOptions?.promptThemeTint === "handEval" ? "ct-problemTab--themeHandEval" : ""} ${p?.promptOptions?.promptThemeTint === "doubles" ? "ct-problemTab--themeDoubles" : ""} ${p?.promptOptions?.promptThemeTint === "knockAce" ? "ct-problemTab--themeKnockAce" : ""} ${isCyanDeclarerThemeTint(p?.promptOptions?.promptThemeTint) ? "ct-problemTab--themeDrawTrumps" : ""} ${p?.promptOptions?.promptThemeTint === "ruffingLot" ? "ct-problemTab--themeRuffingLot" : ""} ${p?.promptOptions?.promptThemeTint === "enemyFive" ? "ct-problemTab--themeEnemyFive" : ""} ${p?.promptOptions?.promptThemeTint === "twoLevel" ? "ct-problemTab--themeTwoLevel" : ""} ${p?.promptOptions?.promptThemeTint === "respondToDouble" ? "ct-problemTab--themeRespondToDouble" : ""} ${p?.promptOptions?.promptThemeTint === "splinters" ? "ct-problemTab--themeSplinters" : ""}`}
                          onClick={() => setPuzzleIdxInDifficulty(idx)}
                          type="button"
                          role="tab"
                          aria-selected={idx === puzzleIdxInDifficulty}
                          title={p.title}
                        >
                          {isCompleted && <span className="ct-problemTabTick" aria-hidden="true">✓</span>}
                          {idx + 1}
                          {isPuzzleNew(p) && <span className="ct-newBadge" aria-label="New">New</span>}
                          {showFreeBadge && <span className="ct-freeBadge" aria-label="Free starter">Free</span>}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {isBlankDifficulty ? (
            <div className="ct-sidePrompt" style={{ maxWidth: 520, margin: "24px auto" }}>
              <div className="ct-questionText">
                {beginnerFlatHandNav
                  ? "No hands yet."
                  : hideDifficultyTabs
                    ? "No problems yet."
                    : `No problems yet for Stage ${selectedDifficulty}.`}
              </div>
            </div>
          ) : (
            <>
            {/* Layout: table + questions side-by-side. Do not change structure without user request. See LAYOUT-CONTRACT.md and CountingTrumpsTrainer.css */}
            <div className="ct-tableWithSidebar ct-tableWithSidebar--hasOverlay" style={{ position: "relative" }}>
            {showPaywallOverlay && (
              <div className="ct-paywallOverlay">
                {beginnerModeOverride ? (
                  <div className="ct-paywallBeginnerCard">
                    <p className="ct-paywallBeginnerTitle">This hand is for members</p>
                    <p className="ct-paywallBeginnerSub">
                      The first six hands are free—choose 1–6 above. Or{" "}
                      <Link to="/membership" className="ct-paywallBeginnerLink">
                        view membership
                      </Link>
                      .
                    </p>
                  </div>
                ) : (
                  <Link to="/membership" className="ct-paywallFullCta">
                    <span className="ct-paywallFullIcon">
                      <i className="material-icons" aria-hidden>lock</i>
                    </span>
                    <strong>Start 7-day free trial</strong>
                    <span className="ct-paywallFullDesc">Get full access to all {trainerLabel} exercises</span>
                    <span className="ct-paywallFullBtn">Start free trial</span>
                  </Link>
                )}
              </div>
            )}
            <div className="ct-tableWithSidebar-inner">
            <div className="ct-tableWithSidebar-main">
            {!hasStarted && !isBlankDifficulty && !showPaywallOverlay && (
              <div className="ct-practiceStartBar">
                <button type="button" className="ct-btn ct-btn--practiceStart" onClick={startPuzzle}>
                  Start
                </button>
              </div>
            )}
            <div
              className={`ct-table ${useBottomRowLayout ? "ct-table--bottomRowLayout ct-table--promptOnRight" : ""} ${useBottomRowLayout && showFullHands && visibleFullHandSeats.includes(seatLeft) ? "ct-table--westVisible" : ""} ${useBottomRowLayout && showFullHands && fullHandsCornerMask ? `ct-table--handsMask${fullHandsCornerMask}` : ""}`}
            >
          {/* Top */}
          <div className={`ct-seat ct-seat--top ${showFullHands && visibleFullHandSeats.includes(seatTop) ? "ct-seat--span" : ""}`}>
            {!!effectiveContractDisplayText && !useBottomRowLayout && !showBeginnerLessonContractBanner && (
              <div className="ct-contractTop">
                {puzzle?.promptOptions?.contractLabel ? (
                  <TextWithColoredSuits text={effectiveContractDisplayText} />
                ) : (
                  <React.Fragment>Contract is <strong><ContractWithColoredSuit text={contractText} /></strong> by <strong>{declarerCompassName}</strong></React.Fragment>
                )}
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
                <div className={`ct-sidePrompt ct-sidePrompt--seatLeft ${useBottomRowLayout ? "ct-sidePrompt--leftOfTable" : ""} ${puzzle?.promptOptions?.promptThemeTint === "points" ? "ct-sidePrompt--themePoints" : ""} ${puzzle?.promptOptions?.promptThemeTint === "active" ? "ct-sidePrompt--themeActive" : ""} ${puzzle?.promptOptions?.promptThemeTint === "respond" ? "ct-sidePrompt--themeRespond" : ""} ${puzzle?.promptOptions?.promptThemeTint === "1nt" ? "ct-sidePrompt--theme1nt" : ""} ${puzzle?.promptOptions?.promptThemeTint === "matchpoints" ? "ct-sidePrompt--themeMatchpoints" : ""} ${puzzle?.promptOptions?.promptThemeTint === "handEval" ? "ct-sidePrompt--themeHandEval" : ""} ${puzzle?.promptOptions?.promptThemeTint === "doubles" ? "ct-sidePrompt--themeDoubles" : ""} ${puzzle?.promptOptions?.promptThemeTint === "knockAce" ? "ct-sidePrompt--themeKnockAce" : ""} ${isCyanDeclarerThemeTint(puzzle?.promptOptions?.promptThemeTint) ? "ct-sidePrompt--themeDrawTrumps" : ""} ${puzzle?.promptOptions?.promptThemeTint === "ruffingLot" ? "ct-sidePrompt--themeRuffingLot" : ""} ${puzzle?.promptOptions?.promptThemeTint === "enemyFive" ? "ct-sidePrompt--themeEnemyFive" : ""} ${puzzle?.promptOptions?.promptThemeTint === "twoLevel" ? "ct-sidePrompt--themeTwoLevel" : ""} ${puzzle?.promptOptions?.promptThemeTint === "respondToDouble" ? "ct-sidePrompt--themeRespondToDouble" : ""} ${puzzle?.promptOptions?.promptThemeTint === "splinters" ? "ct-sidePrompt--themeSplinters" : ""}`} aria-label="Bidding and prompts">
                  {promptNode}
                </div>
              )}
            {showFullHands && visibleFullHandSeats.includes(seatLeft) && <div className="ct-handWrap">{renderSeatHand(seatLeft)}</div>}
            {!showFullHands &&
              (((remainingHands[seatLeft] || []).length > 0) ||
                (promptStep === "DONE" && puzzle.endRevealTrumpHands && Array.isArray(puzzle.endRevealTrumpHands[seatLeft]))) && (
                <>
                  <div className="ct-seatLabel">{roleLabelForSeat(seatLeft)}</div>
                  <div className="ct-handWrap">{renderSeatHand(seatLeft)}</div>
                </>
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
            <div className="ct-trickBoard" aria-label="Play area">
              {hasStarted && puzzle?.promptOptions?.promptsInOverlay && activeCustomPrompt && (promptStep === "INFO" || promptStep === "SINGLE_NUMBER" || promptStep === "DISTRIBUTION_GUESS") && (
                <div className="ct-promptOverlay" aria-label="Question">
                  <div className="ct-promptCard">
                    {promptStep === "INFO" && (
                      <>
                        <div className="ct-questionText ct-promptCard-text ct-questionText--formatted">
                          <FormattedRevealText text={activeCustomPrompt?.promptText || "Continue."} />
                        </div>
                        <div className="ct-railActions" style={{ marginTop: 12 }}>
                          <button className="ct-btn" onClick={submitInfoPrompt} disabled={isPlaying}>
                            Continue
                          </button>
                        </div>
                      </>
                    )}
                    {promptStep === "SINGLE_NUMBER" && (
                      <>
                        <div className="ct-questionText ct-promptCard-text ct-questionText--formatted">
                          <FormattedRevealText text={activeCustomPrompt?.promptText || "Enter the number."} />
                        </div>
                        <div className="ct-railAnswer" style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
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
                        {feedback?.type === "error" && (
                          <div className="ct-railActions" style={{ marginTop: 8 }}>
                            <button className="ct-btn ct-btn--secondary" onClick={clearFeedback}>
                              Try again
                            </button>
                          </div>
                        )}
                      </>
                    )}
                    {promptStep === "DISTRIBUTION_GUESS" && (
                      <>
                        <div className="ct-questionText ct-promptCard-text">
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
                            const pairGuides = getDistributionPairGuidesForStep("DISTRIBUTION_GUESS", activeCustomPrompt);
                            return distSeatOrder.map((seat, idx) => (
                              <div
                                key={seat}
                                className={`ct-distSeat ${distributionPairClassForSeat(seat, pairGuides)}`}
                                data-position={["left", "top", "right", "bottom"][idx]}
                              >
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
                                    aria-label={`${roleLabelForSeat(seat)} count`}
                                    value={distributionInput[seat]}
                                    onChange={(e) => {
                                      if (isLocked(seat)) return;
                                      const v = setDistSeatDigit(seat, e.target.value);
                                      if (!v) return;
                                      if (seat === distSeatOrder[distSeatOrder.length - 1]) e.target.blur();
                                      else focusNextSeatNoWrap(seat, isLocked);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (seat === distSeatOrder[distSeatOrder.length - 1]) submitDistribution();
                                        else focusNextSeatNoWrap(seat, isLocked);
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
                          {renderDistributionPairMarkers(getDistributionPairGuidesForStep("DISTRIBUTION_GUESS", activeCustomPrompt))}
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
                  </div>
                </div>
              )}
              <div className="ct-trickGrid" role="region" aria-label="Trick area">
                <div className="ct-trickPos ct-trickPos--top">
                  <TrickPipCard
                    card={hideTableCardsForEndReveal ? null : trickCards[seatTop]}
                    entered={!hideTableCardsForEndReveal && animSeat === seatTop}
                  />
                </div>
                <div className="ct-trickPos ct-trickPos--left">
                  <TrickPipCard
                    card={hideTableCardsForEndReveal ? null : trickCards[seatLeft]}
                    entered={!hideTableCardsForEndReveal && animSeat === seatLeft}
                  />
                </div>
                <div className="ct-trickPos ct-trickPos--right">
                  <TrickPipCard
                    card={hideTableCardsForEndReveal ? null : trickCards[seatRight]}
                    entered={!hideTableCardsForEndReveal && animSeat === seatRight}
                  />
                </div>
                <div className="ct-trickPos ct-trickPos--bottom">
                  <TrickPipCard
                    card={hideTableCardsForEndReveal ? null : trickCards[seatBottom]}
                    entered={!hideTableCardsForEndReveal && animSeat === seatBottom}
                  />
                </div>
              </div>
            </div>

            <div className="ct-trickSide">
              {showFullHands &&
                !useBottomRowLayout &&
                (promptPlacement === "right" || (promptPlacement === "left" && visibleFullHandSeats.includes(seatLeft))) && (
                <div className={`ct-sidePrompt ${promptPlacement === "left" ? "ct-sidePrompt--left" : ""} ${puzzle?.promptOptions?.promptThemeTint === "points" ? "ct-sidePrompt--themePoints" : ""} ${puzzle?.promptOptions?.promptThemeTint === "active" ? "ct-sidePrompt--themeActive" : ""} ${puzzle?.promptOptions?.promptThemeTint === "respond" ? "ct-sidePrompt--themeRespond" : ""} ${puzzle?.promptOptions?.promptThemeTint === "1nt" ? "ct-sidePrompt--theme1nt" : ""} ${puzzle?.promptOptions?.promptThemeTint === "matchpoints" ? "ct-sidePrompt--themeMatchpoints" : ""} ${puzzle?.promptOptions?.promptThemeTint === "handEval" ? "ct-sidePrompt--themeHandEval" : ""} ${puzzle?.promptOptions?.promptThemeTint === "doubles" ? "ct-sidePrompt--themeDoubles" : ""} ${puzzle?.promptOptions?.promptThemeTint === "knockAce" ? "ct-sidePrompt--themeKnockAce" : ""} ${isCyanDeclarerThemeTint(puzzle?.promptOptions?.promptThemeTint) ? "ct-sidePrompt--themeDrawTrumps" : ""} ${puzzle?.promptOptions?.promptThemeTint === "ruffingLot" ? "ct-sidePrompt--themeRuffingLot" : ""} ${puzzle?.promptOptions?.promptThemeTint === "enemyFive" ? "ct-sidePrompt--themeEnemyFive" : ""} ${puzzle?.promptOptions?.promptThemeTint === "twoLevel" ? "ct-sidePrompt--themeTwoLevel" : ""} ${puzzle?.promptOptions?.promptThemeTint === "respondToDouble" ? "ct-sidePrompt--themeRespondToDouble" : ""} ${puzzle?.promptOptions?.promptThemeTint === "splinters" ? "ct-sidePrompt--themeSplinters" : ""}`} aria-label="Counting prompt">
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
                <>
                  <div className="ct-seatLabel">{roleLabelForSeat(seatRight)}</div>
                  <div className="ct-handWrap">{renderSeatHand(seatRight)}</div>
                </>
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
          {movePlayGuidanceUnderTable && (
            <div className="ct-tableWithSidebar-underPlay" aria-label="Play instructions">
              {showRailWatchPlayNote ? renderRailWatchPlayNote() : null}
            </div>
          )}
            </div>
          {useBottomRowLayout && (
            <aside className="ct-explanationSidebar" aria-label="Bidding and explanation">
              <div className="ct-sidePrompt">{promptNode}</div>
            </aside>
          )}
          {!isBlankDifficulty && !showFullHands && (
            <aside className="ct-rail ct-rail--inSidebar" aria-label="Counting prompt">
              {promptNode}
            </aside>
          )}
          </div>
          </div>
          </>
          )}
        </div>
      </div>

    </div>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  subscriptionActive: state.auth.subscriptionActive,
  tier: state.auth.tier ?? "basic",
  paymentMethod: state.auth.paymentMethod ?? null,
  a: state.auth.a,
  completedPractice: state.user?.completedPractice || {},
});

export default connect(mapStateToProps)(CountingTrumpsTrainer);


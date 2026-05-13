import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CARD_RUSH_ALL_PUZZLES,
  CARD_RUSH_PUZZLE_POOL,
  cardRank,
  cardSuit,
  groupBySuit,
  pickRandomPuzzles,
  sortHandForDisplay,
} from "../../data/treadmill/cardRush";
import {
  CARD_RUSH_LEADERBOARD_DISPLAY_LIMIT,
  getCardRushLeaderboardErrorMessage,
  submitCardRushPersonalBest,
  subscribeCardRushLeaderboard,
} from "../../utils/cardRushLeaderboardFirestore";
import "./CardRushTrainer.css";

/** Competitive mode — score the most puzzles in this window. */
const RUN_DURATION_MS = 60 * 1000;
/** Lives per competitive run — every wrong answer costs one. Run ends at zero. */
const RUN_LIVES = 3;
/** Brief delay so the user sees the tick/cross before the next puzzle loads. */
const POST_ANSWER_PAUSE_MS = 650;
/** How often we tick the timer state during a live run (ms). */
const TIMER_TICK_MS = 100;
/** Run modes. Practice = no timer / no lives, just rip through. */
const MODE_PRACTICE = "practice";
const MODE_COMPETITIVE = "competitive";

const SUIT_GLYPH = { S: "♠", H: "♥", D: "♦", C: "♣" };
const SUIT_LABEL = { S: "Spades", H: "Hearts", D: "Diamonds", C: "Clubs" };
const SUIT_CLASS = { S: "crSuit--spades", H: "crSuit--hearts", D: "crSuit--diamonds", C: "crSuit--clubs" };
const SEAT_LABEL = { N: "North", E: "East", S: "South", W: "West" };
const ALL_SEATS = ["N", "E", "S", "W"];

/** Non-interactive board shown to logged-out users so they can quickly grasp the format. */
const LOCKED_PREVIEW_PUZZLE = {
  id: "cr-locked-preview",
  topic: "Preview",
  contract: "4H",
  declarerCompass: "S",
  viewerCompass: "S",
  trumpSuit: "H",
  currentTrick: { leader: "S", plays: [] },
  toPlaySeat: "S",
  playRevealSeats: ["S", "N"],
  visibleHands: {
    N: ["SK", "S9", "S2", "HQ", "H7", "H4", "CK", "C8", "C4", "DK", "DJ", "D6", "D2"],
    S: ["SA", "SQ", "SJ", "H5", "H3", "H2", "CA", "C5", "C3", "CQ", "D7", "D5", "D3"],
    W: ["S8", "S6", "S5", "HK", "H9", "H6", "CJ", "C9", "C7", "DA", "DQ", "DT", "D8"],
    E: ["ST", "S7", "S4", "HA", "HJ", "HT", "H8", "C6", "C2", "D5", "D4", "D3", "D2"],
  },
  correctCards: [],
};

function formatMs(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "0.0s";
  const total = ms / 1000;
  if (total < 60) return `${total.toFixed(1)}s`;
  const m = Math.floor(total / 60);
  const s = Math.floor(total - m * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Format a remaining time as M:SS (used for the run countdown). */
function formatCountdown(msRemaining) {
  const ms = Math.max(0, Math.ceil(msRemaining / 1000) * 1000);
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec - m * 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function rankLabel(card) {
  const r = cardRank(card);
  return r === "T" ? "10" : r;
}

function parseContractDisplay(contract) {
  const raw = String(contract || "").trim().toUpperCase();
  const m = raw.match(/^(\d)(NT|N|S|H|D|C)(XX|X)?$/);
  if (!m) {
    return { raw, level: "", denom: "", symbol: raw, dbl: "", suitClass: "" };
  }
  const level = m[1];
  const denom = m[2];
  const dbl = m[3] || "";
  if (denom === "NT" || denom === "N") {
    return { raw, level, denom: "NT", symbol: "NT", dbl, suitClass: "" };
  }
  const suit = denom;
  return {
    raw,
    level,
    denom: suit,
    symbol: SUIT_GLYPH[suit] || suit,
    dbl,
    suitClass: `crHeader-contractMain--${suit}`,
  };
}

const SUIT_FROM_GLYPH = { "♠": "S", "♥": "H", "♦": "D", "♣": "C" };

/**
 * Convert a free-text explanation into React nodes, replacing inline card
 * tokens (e.g. "♠J", "♥10", "♦A") with coloured chip spans. Use unicode suit
 * glyphs in the source text and the trainer takes care of the rest.
 */
function renderExplanationParts(text) {
  if (!text) return null;
  const parts = [];
  const re = /([♠♥♦♣])(10|[2-9TJQKA])/g;
  let lastIdx = 0;
  let key = 0;
  let m = re.exec(text);
  while (m != null) {
    if (m.index > lastIdx) {
      parts.push(<React.Fragment key={`ex-t-${key++}`}>{text.slice(lastIdx, m.index)}</React.Fragment>);
    }
    const suit = SUIT_FROM_GLYPH[m[1]];
    const rawRank = m[2];
    const displayRank = rawRank === "T" ? "10" : rawRank;
    parts.push(
      <span key={`ex-c-${key++}`} className={`crInlineCard ${SUIT_CLASS[suit] || ""}`}>
        <span className="crInlineCard-rank">{displayRank}</span>
        <span className="crInlineCard-suit">{m[1]}</span>
      </span>
    );
    lastIdx = m.index + m[0].length;
    m = re.exec(text);
  }
  if (lastIdx < text.length) {
    parts.push(<React.Fragment key={`ex-t-${key++}`}>{text.slice(lastIdx)}</React.Fragment>);
  }
  return parts;
}

/** Returns the seat that "is" dummy for a given declarer (compass mode). */
function dummySeat(declarerCompass) {
  if (declarerCompass === "S") return "N";
  if (declarerCompass === "N") return "S";
  if (declarerCompass === "E") return "W";
  return "E";
}

/** Cards the seat may legally play given the led suit (must follow if able). */
function legalCards(allCards, ledSuit) {
  if (!ledSuit) return allCards;
  const followers = allCards.filter((c) => cardSuit(c) === ledSuit);
  return followers.length > 0 ? followers : allCards;
}

/** True if `c` is in `correctCards` AND follows suit when required. */
function isCorrectChoice(c, puzzle) {
  if (!puzzle) return false;
  const inAnswer = puzzle.correctCards.includes(c);
  if (!inAnswer) return false;
  const led = puzzle.currentTrick?.plays?.[0]?.card;
  if (!led) return true;
  const ledSuit = cardSuit(led);
  const seatHand = puzzle.visibleHands?.[puzzle.toPlaySeat] || [];
  const legal = legalCards(seatHand, ledSuit);
  return legal.includes(c);
}

/** Returns the role label ("Declarer" / "Dummy" / "Defender") for the viewer. */
function viewerRole(puzzle) {
  if (puzzle.viewerCompass === puzzle.declarerCompass) return "Declarer";
  if (puzzle.viewerCompass === dummySeat(puzzle.declarerCompass)) return "Dummy";
  return "Defender";
}

/** Card chip — shared by the trick area and the review modal. */
function PlayedCardChip({ card, seat, highlight }) {
  const suit = cardSuit(card);
  return (
    <div
      className={`crChip ${SUIT_CLASS[suit] || ""} ${highlight ? "crChip--current" : ""}`}
      aria-label={`${seat ? `${SEAT_LABEL[seat]} played ` : ""}${SUIT_LABEL[suit]} ${rankLabel(card)}`}
    >
      <span className="crChip-rank">{rankLabel(card)}</span>
      <span className="crChip-suit">{SUIT_GLYPH[suit]}</span>
    </div>
  );
}

/**
 * Compact card button used inside a SeatHand. When `enabled && onPick` the user
 * can click; the trainer marks it ok / wrong via `highlightCard` + `highlightVariant`.
 */
function CardBtn({ card, onPick, enabled, illegal, highlightVariant }) {
  const suit = cardSuit(card);
  const cls = [
    "crCard",
    SUIT_CLASS[suit] || "",
    enabled ? "crCard--clickable" : "",
    illegal ? "crCard--illegal" : "",
    highlightVariant === "ok" ? "crCard--ok" : "",
    highlightVariant === "wrong" ? "crCard--wrong" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type="button"
      className={cls}
      disabled={!enabled || illegal}
      onClick={enabled && !illegal && typeof onPick === "function" ? () => onPick(card) : undefined}
      aria-label={`${SUIT_LABEL[suit]} ${rankLabel(card)}`}
    >
      <span className="crCard-rank">{rankLabel(card)}</span>
      <span className="crCard-suit">{SUIT_GLYPH[suit]}</span>
    </button>
  );
}

/**
 * Render a hand at a compass seat. If `cards` is null the hand is hidden
 * (face-down placeholder). When `playable` the cards are clickable, with
 * must-follow-suit enforced.
 */
function SeatHand({
  seat,
  cards,
  isViewer,
  playable,
  ledSuit,
  highlightCard,
  highlightVariant,
  onPick,
  showRoleHint,
  roleHint,
}) {
  const hidden = !Array.isArray(cards);
  const groups = useMemo(() => (hidden ? [] : groupBySuit(cards)), [cards, hidden]);
  const hasLedSuit = !hidden && !!ledSuit && cards.some((c) => cardSuit(c) === ledSuit);

  return (
    <div
      className={`crSeat crSeat--${seat.toLowerCase()} ${isViewer ? "crSeat--viewer" : ""} ${
        playable ? "crSeat--playable" : ""
      }`}
      aria-label={`${SEAT_LABEL[seat]} hand${isViewer ? " (you)" : ""}`}
    >
      <div className="crSeat-head">
        <span className="crSeat-label">{SEAT_LABEL[seat]}</span>
        {isViewer ? <span className="crSeat-you">you</span> : null}
        {showRoleHint && roleHint ? <span className="crSeat-role">{roleHint}</span> : null}
      </div>
      {hidden ? (
        <div className="crSeat-hidden" aria-hidden="true">
          <span className="crSeat-hiddenBack">🂠</span>
          <span className="crSeat-hiddenLabel">Hidden</span>
        </div>
      ) : (
        <div className="crSeat-suits">
          {groups.map((g) => (
            <div key={`crsr-${seat}-${g.suit}`} className={`crSeat-suitRow ${SUIT_CLASS[g.suit] || ""}`}>
              <span className="crSeat-suitGlyph" aria-hidden="true">
                {SUIT_GLYPH[g.suit]}
              </span>
              <ul className="crSeat-cards" role="list">
                {g.cards.length === 0 ? (
                  <li className="crSeat-void" aria-label="void">
                    —
                  </li>
                ) : (
                  g.cards.map((c) => {
                    const illegal = playable && hasLedSuit && cardSuit(c) !== ledSuit;
                    return (
                      <li key={`crc-${seat}-${c}`}>
                        <CardBtn
                          card={c}
                          enabled={playable && !highlightCard}
                          illegal={illegal}
                          highlightVariant={c === highlightCard ? highlightVariant : null}
                          onPick={onPick}
                        />
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Spatially-positioned trick area — N top, W left, E right, S bottom of the centre tile.
 *  When `currentTrick` has plays we render those (mid-trick); when it's empty AND `lastTrick`
 *  exists we render the just-finished trick with a "won by …" badge so the user can see
 *  the trick they just observed before they lead to the next one.
 */
function TrickCenter({ puzzle }) {
  const cur = puzzle.currentTrick?.plays || [];
  const last = puzzle.lastTrick && Array.isArray(puzzle.lastTrick.plays) ? puzzle.lastTrick.plays : null;

  // Pick which trick to display: the in-progress one if cards have been played, else the last completed trick.
  const showLast = cur.length === 0 && last && last.length > 0;
  const displayPlays = showLast ? last : cur;
  const displayMap = Object.fromEntries(displayPlays.map((p) => [p.seat, p.card]));
  const winnerSeat = showLast ? puzzle.lastTrick?.winner || null : null;
  const lastSeat = displayPlays.length > 0 ? displayPlays[displayPlays.length - 1].seat : null;

  return (
    <div className="crCenter" aria-label="Trick area">
      <div className="crCenter-pos crCenter-pos--north">
        {displayMap.N ? (
          <PlayedCardChip card={displayMap.N} seat="N" highlight={winnerSeat === "N" || (!showLast && lastSeat === "N")} />
        ) : null}
      </div>
      <div className="crCenter-pos crCenter-pos--west">
        {displayMap.W ? (
          <PlayedCardChip card={displayMap.W} seat="W" highlight={winnerSeat === "W" || (!showLast && lastSeat === "W")} />
        ) : null}
      </div>
      <div className="crCenter-pos crCenter-pos--east">
        {displayMap.E ? (
          <PlayedCardChip card={displayMap.E} seat="E" highlight={winnerSeat === "E" || (!showLast && lastSeat === "E")} />
        ) : null}
      </div>
      <div className="crCenter-pos crCenter-pos--south">
        {displayMap.S ? (
          <PlayedCardChip card={displayMap.S} seat="S" highlight={winnerSeat === "S" || (!showLast && lastSeat === "S")} />
        ) : null}
      </div>
      <div className="crCenter-pos crCenter-pos--inner">
        <div className="crCenter-prompt">
          {showLast ? (
            <>
              <span className="crCenter-promptKicker">Won by {SEAT_LABEL[winnerSeat] || "?"}</span>
              <span className="crCenter-promptText">{SEAT_LABEL[puzzle.toPlaySeat]} to lead</span>
            </>
          ) : cur.length === 0 ? (
            <>
              <span className="crCenter-promptKicker">Lead</span>
              <span className="crCenter-promptText">{SEAT_LABEL[puzzle.toPlaySeat]} on lead</span>
            </>
          ) : (
            <>
              <span className="crCenter-promptKicker">To play</span>
              <span className="crCenter-promptText">{SEAT_LABEL[puzzle.toPlaySeat]}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Header strip with contract, role, score, lives and the run countdown timer.
 *  Topic / title / explanation are deliberately hidden during play (no hints).
 */
function RunHeader({ puzzle, runState, msRemaining, score, mode }) {
  const role = viewerRole(puzzle);
  const c = parseContractDisplay(puzzle.contract);
  const isCompetitive = mode === MODE_COMPETITIVE;
  const seconds = isCompetitive && msRemaining != null ? msRemaining / 1000 : 0;
  const timeLow = isCompetitive && seconds <= 15;
  return (
    <div className="crHeader">
      <div className="crHeader-meta">
        <span className="crHeader-contract" aria-label={`Contract ${puzzle.contract || ""}`}>
          <span className="crHeader-contractTag">Contract</span>
          <span className={`crHeader-contractMain ${c.suitClass}`}>{`${c.level}${c.symbol}${c.dbl}`}</span>
          {puzzle.declarerCompass ? <span className="crHeader-contractBy">by {SEAT_LABEL[puzzle.declarerCompass]}</span> : null}
        </span>
        <span className={`crHeader-role crHeader-role--${role.toLowerCase()}`}>You are {role}</span>
      </div>
      <div className="crHeader-stats">
        <span className="crHeader-score" aria-label={`Score ${score}`}>{score}</span>
        {isCompetitive ? (
          <div
            className={`crHeader-timer ${runState === "running" ? "crHeader-timer--live" : ""} ${
              timeLow && runState === "running" ? "crHeader-timer--low" : ""
            }`}
            aria-label={`Time remaining ${formatCountdown(msRemaining)}`}
          >
            ⏱ {formatCountdown(msRemaining)}
          </div>
        ) : (
          <div className="crHeader-mode" aria-label="Practice mode">Practice</div>
        )}
      </div>
    </div>
  );
}

/** Returns "You (South)" / "Dummy (East)" / "Declarer (North)" / compass label for a hand-row header. */
function rowLabel(seat, puzzle) {
  if (seat === puzzle.viewerCompass) return `You (${SEAT_LABEL[seat]})`;
  if (seat === dummySeat(puzzle.declarerCompass)) return `Dummy (${SEAT_LABEL[seat]})`;
  if (seat === puzzle.declarerCompass) return `Declarer (${SEAT_LABEL[seat]})`;
  return SEAT_LABEL[seat];
}

/** Tag shown next to the played card in the trick strip ("Dummy" / "You" / "Lead" / etc.). */
function trickSeatTag(seat, puzzle, isLeader) {
  if (seat === puzzle.viewerCompass) return "You";
  if (seat === dummySeat(puzzle.declarerCompass)) return "Dummy";
  if (isLeader) return `${SEAT_LABEL[seat]} (lead)`;
  return SEAT_LABEL[seat];
}

/**
 * Single mini-card cell used in both the hand row and the trick strip.
 * Visually matches the BBO-style tile used in the existing trainers
 * (white square, big rank top-left, suit bottom-left, alternating colours).
 */
function MiniCard({ card, variant = "hand", playable = false, illegal = false, state = null, onPick, highlight = false }) {
  const suit = cardSuit(card);
  const isRed = suit === "H" || suit === "D";
  const cls = [
    "crMini",
    `crMini--${variant}`,
    isRed ? "crMini--red" : "crMini--black",
    playable ? "crMini--playable" : "",
    illegal ? "crMini--illegal" : "",
    state === "ok" ? "crMini--ok" : "",
    state === "wrong" ? "crMini--wrong" : "",
    highlight ? "crMini--win" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const label = `${SUIT_LABEL[suit]} ${rankLabel(card)}`;
  if (playable && !illegal && typeof onPick === "function") {
    return (
      <button type="button" className={cls} onClick={() => onPick(card)} aria-label={label}>
        <span className="crMini-rank">{rankLabel(card)}</span>
        <span className="crMini-suit">{SUIT_GLYPH[suit]}</span>
      </button>
    );
  }
  return (
    <div className={cls} aria-label={label}>
      <span className="crMini-rank">{rankLabel(card)}</span>
      <span className="crMini-suit">{SUIT_GLYPH[suit]}</span>
    </div>
  );
}

/**
 * Side-column hand used when dummy is East or West. Cards are shown in the
 * same MiniCard tile style as the main strips, but grouped by suit into rows
 * so the column stays narrow. No white background box — it sits on the felt.
 */
function SideHand({ seat, puzzle, ledSuit, highlightCard, highlightVariant, dailyHardBlock, onPick }) {
  const cards = puzzle.visibleHands?.[seat] || null;
  const isPlayable = !dailyHardBlock && seat === puzzle.toPlaySeat && Array.isArray(cards);
  const groups = useMemo(() => (cards ? groupBySuit(cards) : []), [cards]);
  const hasLedSuit = !!ledSuit && Array.isArray(cards) && cards.some((c) => cardSuit(c) === ledSuit);
  const label = rowLabel(seat, puzzle);

  if (!cards) {
    return (
      <div className="crSideHand crSideHand--hidden">
        <div className="crSideHand-head">
          <span className="crSideHand-label">{label}</span>
        </div>
        <div className="crStripHand-cards crStripHand-cards--hidden" aria-hidden="true">
          <span className="crStripHand-hiddenBack">🂠</span>
          <span className="crStripHand-hiddenLabel">Hidden</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`crSideHand ${isPlayable ? "crSideHand--playable" : ""}`}>
      <div className="crSideHand-head">
        <span className="crSideHand-label">{label}</span>
        {isPlayable ? <span className="crStripHand-cue">your move</span> : null}
      </div>
      <div className="crSideHand-suits">
        {groups.map((g) => (
          <div key={g.suit} className="crSideHand-suitRow">
            {g.cards.map((card) => {
              const illegal = isPlayable && hasLedSuit && cardSuit(card) !== ledSuit;
              const isHighlighted = card === highlightCard;
              const state = isHighlighted ? highlightVariant : null;
              return (
                <MiniCard
                  key={`crsd-${seat}-${card}`}
                  card={card}
                  variant="hand"
                  playable={isPlayable && !illegal && !highlightCard}
                  illegal={illegal}
                  state={state}
                  onPick={onPick}
                />
              );
            })}
            {g.cards.length === 0 && (
              <span className="crSideHand-void">—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * One hand row in the strip layout: a small label on top, then a 13-column
 * grid of MiniCards. Played cards (i.e. cards no longer in the hand) leave
 * a transparent placeholder so the row width stays stable through a deal.
 */
function StripHand({ seat, puzzle, ledSuit, highlightCard, highlightVariant, dailyHardBlock, onPick }) {
  const cards = puzzle.visibleHands?.[seat] || null;
  const isPlayable = !dailyHardBlock && seat === puzzle.toPlaySeat && Array.isArray(cards);
  const sorted = useMemo(() => (cards ? sortHandForDisplay(cards) : []), [cards]);
  const hasLedSuit = !!ledSuit && sorted.some((c) => cardSuit(c) === ledSuit);
  const isViewerRow = seat === puzzle.viewerCompass;

  if (!cards) {
    return (
      <div className={`crStripHand crStripHand--hidden ${isViewerRow ? "crStripHand--viewer" : ""}`}>
        <div className="crStripHand-head">
          <span className="crStripHand-label">{rowLabel(seat, puzzle)}</span>
        </div>
        <div className="crStripHand-cards crStripHand-cards--hidden" aria-hidden="true">
          <span className="crStripHand-hiddenBack">🂠</span>
          <span className="crStripHand-hiddenLabel">Hidden</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`crStripHand crStripHand--row ${isPlayable ? "crStripHand--playable" : ""} ${
        isViewerRow ? "crStripHand--viewer" : ""
      }`}
    >
      <div className="crStripHand-head">
        <span className="crStripHand-label">{rowLabel(seat, puzzle)}</span>
        {isPlayable ? <span className="crStripHand-cue">your move</span> : null}
      </div>
      <div className="crStripHand-cards" role="list" aria-label={`${rowLabel(seat, puzzle)} hand`}>
        {sorted.map((card) => {
          const illegal = isPlayable && hasLedSuit && cardSuit(card) !== ledSuit;
          const isHighlighted = card === highlightCard;
          const state = isHighlighted ? highlightVariant : null;
          return (
            <MiniCard
              key={`crh-${seat}-${card}`}
              card={card}
              variant="hand"
              playable={isPlayable && !illegal && !highlightCard}
              illegal={illegal}
              state={state}
              onPick={onPick}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact trick-context bar shown between the two hand rows. Mirrors the
 * "centre of the table" — current trick if mid-trick, last completed trick
 * (with a "Won by …" status) if the user is about to lead the next trick.
 */
function TrickStrip({ puzzle, onReplayDoneChange }) {
  const cur = puzzle.currentTrick?.plays || [];
  const hasCurrentPlays = cur.length > 0;
  const replayTricks =
    !hasCurrentPlays && Array.isArray(puzzle.replayTricks) && puzzle.replayTricks.length > 0
      ? puzzle.replayTricks.filter((t) => t && Array.isArray(t.plays) && t.plays.length > 0)
      : !hasCurrentPlays && puzzle.lastTrick && Array.isArray(puzzle.lastTrick.plays) && puzzle.lastTrick.plays.length > 0
      ? [puzzle.lastTrick]
      : [];
  const replayMode = !hasCurrentPlays && replayTricks.length > 0;
  const manualReplay = replayMode && puzzle.replayControl === "click";

  const [anim, setAnim] = useState({ trickIdx: 0, revealedCount: 0, done: !replayMode });
  const [manualTrickIdx, setManualTrickIdx] = useState(0);

  useEffect(() => {
    if (manualReplay) setManualTrickIdx(0);
  }, [manualReplay, puzzle.id]);

  // Animate one or more completed tricks before the user's decision point.
  // In auto mode the whole sequence plays through. In manual mode we only
  // animate the trick the user just landed on (manualTrickIdx) so each
  // "Click to see Trick N" reveals the cards at the same pace as trick 1.
  useEffect(() => {
    if (!replayMode) {
      setAnim({ trickIdx: 0, revealedCount: cur.length, done: true });
      return undefined;
    }

    const timers = [];
    const CARD_STEP_MS = 290;
    const BETWEEN_TRICKS_MS = 320;
    let at = 0;

    if (manualReplay) {
      const trick = replayTricks[manualTrickIdx];
      const trickPlays = trick?.plays || [];
      const isLastTrick = manualTrickIdx >= replayTricks.length - 1;
      setAnim({ trickIdx: manualTrickIdx, revealedCount: 0, done: false });
      for (let i = 1; i <= trickPlays.length; i += 1) {
        at += CARD_STEP_MS;
        const isLastCard = i === trickPlays.length;
        timers.push(
          window.setTimeout(() => {
            setAnim({
              trickIdx: manualTrickIdx,
              revealedCount: i,
              done: isLastCard && isLastTrick,
            });
          }, at)
        );
      }
    } else {
      setAnim({ trickIdx: 0, revealedCount: 0, done: false });
      replayTricks.forEach((trick, tIdx) => {
        const trickPlays = trick.plays || [];
        for (let i = 1; i <= trickPlays.length; i += 1) {
          at += CARD_STEP_MS;
          timers.push(
            window.setTimeout(() => {
              setAnim({ trickIdx: tIdx, revealedCount: i, done: false });
            }, at)
          );
        }
        if (tIdx < replayTricks.length - 1) {
          at += BETWEEN_TRICKS_MS;
          timers.push(
            window.setTimeout(() => {
              setAnim({ trickIdx: tIdx + 1, revealedCount: 0, done: false });
            }, at)
          );
        } else {
          at += 50;
          timers.push(
            window.setTimeout(() => {
              setAnim({ trickIdx: tIdx, revealedCount: trickPlays.length, done: true });
            }, at)
          );
        }
      });
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [replayMode, manualReplay, puzzle.id, manualTrickIdx]);

  const activeReplayTrick = replayMode
    ? replayTricks[Math.min(manualReplay ? manualTrickIdx : anim.trickIdx, replayTricks.length - 1)]
    : null;
  const plays = replayMode
    ? (activeReplayTrick?.plays || []).slice(0, Math.max(0, anim.revealedCount))
    : cur;
  const winnerSeat = replayMode ? activeReplayTrick?.winner || null : null;
  const lastTrickFullyShown =
    replayMode &&
    manualReplay &&
    manualTrickIdx >= replayTricks.length - 1 &&
    anim.revealedCount >= (replayTricks[manualTrickIdx]?.plays?.length || 0);
  const fullyRevealed = replayMode ? (manualReplay ? lastTrickFullyShown : anim.done) : true;

  useEffect(() => {
    if (typeof onReplayDoneChange === "function") onReplayDoneChange(fullyRevealed);
  }, [fullyRevealed, onReplayDoneChange]);

  if (plays.length === 0 && !replayMode) {
    return (
      <div className="crStripTrick crStripTrick--empty" aria-label="Trick — opening lead">
        <span className="crStripTrick-status">{rowLabel(puzzle.toPlaySeat, puzzle)} on lead</span>
      </div>
    );
  }

  const map = Object.fromEntries(plays.map((p) => [p.seat, p.card]));

  const renderSlot = (seat) => {
    const card = map[seat];
    if (!card) return <div className="crStripTrick-slot crStripTrick-slot--empty" aria-hidden="true" />;
    const isWinner = fullyRevealed && winnerSeat === seat;
    return (
      <div className={`crStripTrick-slot ${isWinner ? "crStripTrick-slot--won" : ""} ${replayMode ? "crStripTrick-slot--enter" : ""}`}>
        <MiniCard card={card} variant="trick" highlight={isWinner} />
      </div>
    );
  };

  return (
    <div className="crStripTrick" aria-label="Trick area">
      <div className="crStripTrick-table">
        <div className="crStripTrick-pos crStripTrick-pos--n">{renderSlot("N")}</div>
        <div className="crStripTrick-pos crStripTrick-pos--w">{renderSlot("W")}</div>
        <div className="crStripTrick-pos crStripTrick-pos--e">{renderSlot("E")}</div>
        <div className="crStripTrick-pos crStripTrick-pos--s">{renderSlot("S")}</div>
      </div>
      <div className="crStripTrick-status">
        {manualReplay && !fullyRevealed
          ? `Trick ${manualTrickIdx + 1} of ${replayTricks.length}`
          : replayMode && !fullyRevealed
          ? `Replaying trick ${Math.min(anim.trickIdx + 1, replayTricks.length)} of ${replayTricks.length}...`
          : replayMode
          ? `Won by ${rowLabel(winnerSeat, puzzle)}. ${rowLabel(puzzle.toPlaySeat, puzzle)} to lead.`
          : `${rowLabel(puzzle.toPlaySeat, puzzle)} to play.`}
      </div>
      {manualReplay && manualTrickIdx < replayTricks.length - 1 &&
        anim.revealedCount >= (replayTricks[manualTrickIdx]?.plays?.length || 0) ? (
        <button
          type="button"
          className="crStripTrick-nextBtn"
          onClick={() => setManualTrickIdx((idx) => Math.min(idx + 1, replayTricks.length - 1))}
        >
          <span className="crStripTrick-nextBtn-label">Click to see Trick {manualTrickIdx + 2}</span>
          <span className="crStripTrick-nextBtn-arrow" aria-hidden="true">→</span>
        </button>
      ) : null}
    </div>
  );
}

/**
 * The play-time board: a clean vertical stack — top opponent/dummy hand,
 * trick area in the middle, then your own hand at the bottom. Always uses
 * the horizontal 13-card strip for every seat so nothing can spill past
 * the felt regardless of viewport size.
 */
function PlayBoard({ puzzle, highlightCard, highlightVariant, dailyHardBlock, onPick }) {
  const ledSuit = puzzle.currentTrick?.plays?.[0] ? cardSuit(puzzle.currentTrick.plays[0].card) : null;
  const visible = puzzle.visibleHands || {};
  const reveal = Array.isArray(puzzle.playRevealSeats) && puzzle.playRevealSeats.length > 0
    ? puzzle.playRevealSeats
    : Object.keys(visible);

  const viewer = puzzle.viewerCompass;
  const opponentSeat = ["N", "E", "W"].find((s) => reveal.includes(s) && viewer !== s) || null;
  const southSeat = reveal.includes(viewer) ? viewer : reveal.includes("S") ? "S" : null;
  // E/W opponents appear in a side column rather than the top strip so the
  // compass position is visually correct (East = right, West = left).
  const isSide = opponentSeat === "E" || opponentSeat === "W";
  const [replayDone, setReplayDone] = useState(true);

  useEffect(() => {
    const hasReplay =
      (Array.isArray(puzzle.replayTricks) && puzzle.replayTricks.length > 0) ||
      (puzzle.lastTrick && Array.isArray(puzzle.lastTrick.plays) && puzzle.lastTrick.plays.length > 0);
    setReplayDone(!hasReplay);
  }, [puzzle.id, puzzle.replayTricks, puzzle.lastTrick]);

  return (
    <div
      className={`crStripBoard${isSide ? ` crStripBoard--opp-${opponentSeat.toLowerCase()}` : ""}`}
      role="group"
      aria-label="Card Rush play area"
    >
      {opponentSeat && !isSide ? (
        <div className="crStripArea crStripArea--top">
          <StripHand
            seat={opponentSeat}
            puzzle={puzzle}
            ledSuit={ledSuit}
            highlightCard={highlightCard}
            highlightVariant={highlightVariant}
            dailyHardBlock={dailyHardBlock || !replayDone}
            onPick={onPick}
          />
        </div>
      ) : null}
      <div className="crStripArea crStripArea--center">
        <TrickStrip puzzle={puzzle} onReplayDoneChange={setReplayDone} />
      </div>
      {opponentSeat && isSide ? (
        <div className="crStripArea crStripArea--side">
          <SideHand
            seat={opponentSeat}
            puzzle={puzzle}
            ledSuit={ledSuit}
            highlightCard={highlightCard}
            highlightVariant={highlightVariant}
            dailyHardBlock={dailyHardBlock || !replayDone}
            onPick={onPick}
          />
        </div>
      ) : null}
      {southSeat ? (
        <div className="crStripArea crStripArea--south">
          <StripHand
            seat={southSeat}
            puzzle={puzzle}
            ledSuit={ledSuit}
            highlightCard={highlightCard}
            highlightVariant={highlightVariant}
            dailyHardBlock={dailyHardBlock || !replayDone}
            onPick={onPick}
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * The bridge-table layout: 4 seats around a felt centre with the trick in the middle.
 *
 * `mode = "play"` (default) — only seats listed in `puzzle.playRevealSeats` are
 * shown face-up; everything else is face-down. This mirrors what a real player
 * would see at the table (e.g. declarer sees own hand + dummy only).
 *
 * `mode = "review"` — every seat in `visibleHands` is shown face-up, so the
 * post-run review reveals the full deal.
 */
function BridgeTable({ puzzle, highlightCard, highlightVariant, dailyHardBlock, onPick, mode = "play" }) {
  const ledSuit = puzzle.currentTrick?.plays?.[0] ? cardSuit(puzzle.currentTrick.plays[0].card) : null;
  const visible = puzzle.visibleHands || {};
  const dummy = dummySeat(puzzle.declarerCompass);
  const role = viewerRole(puzzle);
  const revealSet = new Set(
    mode === "review"
      ? Object.keys(visible)
      : Array.isArray(puzzle.playRevealSeats) && puzzle.playRevealSeats.length > 0
      ? puzzle.playRevealSeats
      : Object.keys(visible) // back-compat: legacy puzzles without playRevealSeats stay fully visible
  );

  const seatNode = (seat) => {
    const revealed = revealSet.has(seat);
    const cards = revealed ? visible[seat] || null : null;
    const playable =
      mode === "play" && seat === puzzle.toPlaySeat && !dailyHardBlock && cards != null;
    let roleHint = null;
    if (seat === puzzle.declarerCompass) roleHint = "Declarer";
    else if (seat === dummy) roleHint = "Dummy";
    return (
      <SeatHand
        seat={seat}
        cards={cards}
        isViewer={seat === puzzle.viewerCompass}
        playable={playable}
        ledSuit={ledSuit}
        highlightCard={highlightCard}
        highlightVariant={highlightVariant}
        onPick={onPick}
        showRoleHint
        roleHint={roleHint}
      />
    );
  };

  return (
    <div className={`crTable crTable--role-${role.toLowerCase()}`}>
      <div className="crTable-pos crTable-pos--north">{seatNode("N")}</div>
      <div className="crTable-pos crTable-pos--west">{seatNode("W")}</div>
      <div className="crTable-pos crTable-pos--center">
        <TrickCenter puzzle={puzzle} />
      </div>
      <div className="crTable-pos crTable-pos--east">{seatNode("E")}</div>
      <div className="crTable-pos crTable-pos--south">{seatNode("S")}</div>
    </div>
  );
}

/** Tile bar showing attempts; any completed attempt can be reviewed immediately. */
function TileStrip({ attempts, currentIdx, runState, onReview }) {
  const tiles = [];
  // Always show at least the cells already attempted plus a "current" placeholder.
  // Pad to a small minimum so the strip doesn't look empty in the first few seconds.
  const TILE_MIN = 10;
  const tileCount = Math.max(attempts.length + (runState === "running" ? 1 : 0), TILE_MIN);
  for (let i = 0; i < tileCount; i += 1) {
    const a = attempts[i];
    let cls = "crTile";
    let glyph = "";
    let label = `Puzzle ${i + 1} pending`;
    if (a) {
      cls += a.correct ? " crTile--ok" : " crTile--wrong";
      glyph = a.correct ? "✓" : "✗";
      label = `Puzzle ${i + 1} ${a.correct ? "correct" : "wrong"} — click to review`;
    } else if (runState === "running" && i === currentIdx) {
      cls += " crTile--current";
      glyph = "•";
      label = `Puzzle ${i + 1} — current`;
    }
    const clickable = !!a;
    tiles.push(
      clickable ? (
        <button
          key={`crtile-${i}`}
          type="button"
          className={`${cls} crTile--clickable`}
          onClick={() => onReview(i)}
          aria-label={label}
        >
          <span className="crTile-num">{i + 1}</span>
          <span className="crTile-mark">{glyph}</span>
        </button>
      ) : (
        <span key={`crtile-${i}`} className={cls} aria-label={label}>
          <span className="crTile-num">{i + 1}</span>
          <span className="crTile-mark">{glyph}</span>
        </span>
      )
    );
  }
  return (
    <div className="crTileStrip" aria-label="Puzzle attempts">
      {tiles}
    </div>
  );
}

/** Modal showing a past puzzle with the user's answer + the correct answer + explanation. */
function ReviewModal({ attempt, onClose }) {
  if (!attempt) return null;
  const { puzzle, chosenCard, correct } = attempt;
  const correctLabels = (puzzle.correctCards || []).map(
    (c) => `${SUIT_GLYPH[cardSuit(c)] || ""}${rankLabel(c)}`
  );
  const chosenLabel = chosenCard ? `${SUIT_GLYPH[cardSuit(chosenCard)] || ""}${rankLabel(chosenCard)}` : "—";

  return (
    <div className="crModalScrim" role="dialog" aria-modal="true" aria-label="Card Rush — review puzzle">
      <div className="crModal">
        <div className="crModal-head">
          <h3 className="crModal-title">{puzzle.title || puzzle.topic || `Puzzle ${puzzle.id}`}</h3>
          <button type="button" className="crModal-close" onClick={onClose} aria-label="Close review">
            ×
          </button>
        </div>
        <div className="crModal-body">
          <div className="crModal-context">
            <span>
              {puzzle.contract} by {SEAT_LABEL[puzzle.declarerCompass]}
            </span>
            {puzzle.topic ? <span> · {puzzle.topic}</span> : null}
          </div>
          <BridgeTable
            puzzle={puzzle}
            highlightCard={chosenCard}
            highlightVariant={correct ? "ok" : "wrong"}
            dailyHardBlock
            onPick={undefined}
            mode="review"
          />
          <div className={`crModal-result ${correct ? "crModal-result--ok" : "crModal-result--wrong"}`}>
            <div>
              <strong>Your card:</strong> {chosenLabel} {correct ? "✓" : "✗"}
            </div>
            <div>
              <strong>{correct ? "Also acceptable" : "Correct"}:</strong> {correctLabels.join(", ")}
            </div>
          </div>
          {puzzle.explanation ? (
            <p className="crModal-explanation">{renderExplanationParts(puzzle.explanation)}</p>
          ) : null}
        </div>
        <div className="crModal-foot">
          <button type="button" className="ct-btn ct-btn--primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Card Rush trainer. Treadmill-trainer-shaped props for paywall/leaderboard
 * plumbing; otherwise self-contained.
 */
export default function CardRushTrainer({
  uid = "",
  alias = "",
  canRecordLeaderboard = false,
  lockedPreview = false,
  previewNote,
  dailyInteractionBlocked = false,
  dailyFreeRemaining = Infinity,
  onDailyRoundConsumed,
  onSubscribeClick,
  belowLeaderboardSlot = null,
  previewPuzzleId = "",
}) {
  const previewPuzzle = useMemo(
    () => CARD_RUSH_ALL_PUZZLES.find((p) => String(p?.id || "") === String(previewPuzzleId || "")) || null,
    [previewPuzzleId]
  );
  const sourcePool = useMemo(() => (previewPuzzle ? [previewPuzzle] : CARD_RUSH_PUZZLE_POOL), [previewPuzzle]);
  const poolSize = sourcePool.length;
  const hasPuzzles = poolSize > 0;

  const [puzzleSeq, setPuzzleSeq] = useState(() => (hasPuzzles ? pickRandomPuzzles(40, sourcePool) : []));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [livesLeft, setLivesLeft] = useState(RUN_LIVES);
  const [attempts, setAttempts] = useState([]);
  // idle | running | completed (completed = run is over, regardless of timeout vs lives-out)
  const [runState, setRunState] = useState("idle");
  const [runMode, setRunMode] = useState(MODE_COMPETITIVE);
  const [runOutcome, setRunOutcome] = useState(null); // 'time' | 'lives' | 'quit'
  const [runStartedAt, setRunStartedAt] = useState(null);
  const [runFinishedMs, setRunFinishedMs] = useState(null);
  const [highlight, setHighlight] = useState({ card: null, variant: null });
  const [reviewIdx, setReviewIdx] = useState(null);
  const [tickNow, setTickNow] = useState(Date.now());
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const [boardRows, setBoardRows] = useState([]);
  const [boardError, setBoardError] = useState("");
  const advanceTimerRef = useRef(null);
  const isCompetitive = runMode === MODE_COMPETITIVE;

  // Live timer
  useEffect(() => {
    if (runState !== "running") return undefined;
    const id = window.setInterval(() => setTickNow(Date.now()), TIMER_TICK_MS);
    return () => window.clearInterval(id);
  }, [runState]);

  // Cleanup advance timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current != null) {
        window.clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
    };
  }, []);

  // Subscribe to global leaderboard
  useEffect(() => {
    const unsub = subscribeCardRushLeaderboard((rows, err) => {
      if (err) {
        setBoardError(getCardRushLeaderboardErrorMessage(err));
        setBoardRows([]);
      } else {
        setBoardError("");
        setBoardRows(rows);
      }
    });
    return () => {
      try {
        unsub && unsub();
      } catch {
        /* noop */
      }
    };
  }, []);

  const elapsedMs = useMemo(() => {
    if (runState === "completed" && runFinishedMs != null && runStartedAt != null) {
      return runFinishedMs - runStartedAt;
    }
    if (runState === "running" && runStartedAt != null) {
      return tickNow - runStartedAt;
    }
    return 0;
  }, [runState, runStartedAt, runFinishedMs, tickNow]);

  const msRemaining = useMemo(
    () => (isCompetitive ? Math.max(0, RUN_DURATION_MS - elapsedMs) : null),
    [isCompetitive, elapsedMs]
  );

  const score = useMemo(() => attempts.filter((a) => a.correct).length, [attempts]);

  const currentPuzzle = puzzleSeq[currentIdx];

  const startRun = useCallback(
    (mode) => {
      if (lockedPreview || !hasPuzzles) return;
      const next = mode === MODE_PRACTICE ? MODE_PRACTICE : MODE_COMPETITIVE;
      setRunMode(next);
      setPuzzleSeq(pickRandomPuzzles(80, sourcePool));
      setCurrentIdx(0);
      setStreak(0);
      setBestStreak(0);
      setLivesLeft(RUN_LIVES);
      setAttempts([]);
      setRunFinishedMs(null);
      setRunOutcome(null);
      setHighlight({ card: null, variant: null });
      setReviewIdx(null);
      setSubmitState({ status: "idle", message: "" });
      setRunStartedAt(Date.now());
      setTickNow(Date.now());
      setRunState("running");
    },
    [lockedPreview, hasPuzzles, sourcePool]
  );

  const finishRun = useCallback((outcome) => {
    if (advanceTimerRef.current != null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setHighlight({ card: null, variant: null });
    setRunFinishedMs(Date.now());
    setRunOutcome(outcome);
    setRunState("completed");
  }, []);

  // End the competitive run automatically when the timer expires.
  useEffect(() => {
    if (runState !== "running" || runStartedAt == null || !isCompetitive) return;
    if (tickNow - runStartedAt >= RUN_DURATION_MS) {
      finishRun("time");
    }
  }, [runState, runStartedAt, tickNow, finishRun, isCompetitive]);

  // Auto-submit personal best on completion (competitive only — practice runs
  // never go on the leaderboard).
  useEffect(() => {
    if (runState !== "completed" || runFinishedMs == null || runStartedAt == null) return;
    if (!isCompetitive) return;
    if (!canRecordLeaderboard || !uid) return;
    const trimmed = String(alias || "").trim();
    if (!trimmed) {
      setSubmitState({ status: "error", message: "Add your username in Profile to appear on the leaderboard." });
      return;
    }
    if (score <= 0) {
      // Skip empty/zero-score runs — leaderboard would be cluttered.
      setSubmitState({ status: "idle", message: "" });
      return;
    }
    const ms = runFinishedMs - runStartedAt;
    setSubmitState({ status: "submitting", message: "Saving your score…" });
    submitCardRushPersonalBest(uid, trimmed, score, ms)
      .then((updated) =>
        setSubmitState({
          status: "ok",
          message: updated ? "New personal best saved!" : "Score not better than your best — not updated.",
        })
      )
      .catch((err) => {
        setSubmitState({
          status: "error",
          message: err?.message ? `Could not save: ${err.message}` : "Could not save your score.",
        });
      });
  }, [runState, runFinishedMs, runStartedAt, canRecordLeaderboard, uid, alias, score, isCompetitive]);

  const handleCardPick = useCallback(
    (card) => {
      if (lockedPreview || runState !== "running" || !currentPuzzle) return;
      if (highlight.card) return; // already locked in for this puzzle
      const correct = isCorrectChoice(card, currentPuzzle);
      setHighlight({ card, variant: correct ? "ok" : "wrong" });
      setAttempts((prev) => [...prev, { puzzle: currentPuzzle, chosenCard: card, correct }]);
      const nextStreak = correct ? streak + 1 : 0;
      setStreak(nextStreak);
      if (correct) setBestStreak((b) => Math.max(b, nextStreak));
      // Practice mode never burns lives or ends on misses — just keep going.
      const nextLives = isCompetitive ? (correct ? livesLeft : livesLeft - 1) : livesLeft;
      if (isCompetitive && !correct) setLivesLeft(nextLives);

      if (correct && typeof onDailyRoundConsumed === "function") {
        onDailyRoundConsumed();
      }

      if (advanceTimerRef.current != null) {
        window.clearTimeout(advanceTimerRef.current);
      }
      advanceTimerRef.current = window.setTimeout(() => {
        advanceTimerRef.current = null;
        if (isCompetitive && nextLives <= 0) {
          finishRun("lives");
          return;
        }
        setHighlight({ card: null, variant: null });
        setCurrentIdx((idx) => {
          const next = idx + 1;
          if (next >= puzzleSeq.length) {
            // Refill mid-run if we somehow exhaust the pool order.
            setPuzzleSeq((seq) => [...seq, ...pickRandomPuzzles(40, sourcePool)]);
          }
          return next;
        });
      }, POST_ANSWER_PAUSE_MS);
    },
    [
      lockedPreview,
      runState,
      currentPuzzle,
      highlight,
      streak,
      livesLeft,
      onDailyRoundConsumed,
      finishRun,
      puzzleSeq.length,
      isCompetitive,
      sourcePool,
    ]
  );

  // ── Locked preview ────────────────────────────────────────────────────────
  if (lockedPreview) {
    return (
      <section className="crTrainer crTrainer--locked" aria-label="Card Rush preview">
        <p className="tm-toolPreview-note">{previewNote || "Preview only. Subscribe to use this tool."}</p>
        <CardRushPreviewMock />
      </section>
    );
  }

  // ── Empty pool — friendly message instead of crash ────────────────────────
  if (!hasPuzzles) {
    return (
      <section className="crTrainer crTrainer--empty" aria-label="Card Rush — no puzzles">
        <div className="crEmpty">
          <h2 className="crEmpty-title">Card Rush — no puzzles loaded yet</h2>
          <p className="crEmpty-lead">
            The puzzle pool is currently empty. Add puzzles to{" "}
            <code>src/data/treadmill/cardRush/seed.js</code> and reload — the format is documented at the top of
            that file.
          </p>
          <p className="crEmpty-hint">
            The trainer is fully wired in (route, paywall, leaderboard, review modal). It just needs content.
          </p>
        </div>
        <CardRushLeaderboardPanel
          rows={boardRows}
          error={boardError}
          uid={uid}
          alias={alias}
          belowLeaderboardSlot={belowLeaderboardSlot}
        />
      </section>
    );
  }

  // ── Idle / start screen ───────────────────────────────────────────────────
  if (runState === "idle") {
    return (
      <section className="crTrainer crTrainer--idle" aria-label="Card Rush — start screen">
        <div className="crIntro">
          <h2 className="crIntro-title">Card Rush</h2>
          <p className="crIntro-tagline">Trick 2 and 3 decisions</p>
          <div className="crModePicker" role="group" aria-label="Choose a mode">
            <button
              type="button"
              className="crModeBtn crModeBtn--practice"
              onClick={() => startRun(MODE_PRACTICE)}
            >
              <span className="crModeBtn-name">Practice</span>
              <span className="crModeBtn-meta">No timer</span>
            </button>
            <button
              type="button"
              className="crModeBtn crModeBtn--competitive"
              onClick={() => startRun(MODE_COMPETITIVE)}
            >
              <span className="crModeBtn-name">Competitive</span>
              <span className="crModeBtn-meta">1 minute · 3 lives</span>
            </button>
          </div>
          <p className="crIntro-guidance">
            When the auction is not included assume declarer has a normal type of hand (8 card trump fit,
            balanced hand). These problems are meant to be quick, pattern recognition style that can be done
            quickly.
          </p>
          {Number.isFinite(dailyFreeRemaining) ? (
            <p className="crIntro-quota">
              {dailyFreeRemaining > 0
                ? `${dailyFreeRemaining} free correct answers left today.`
                : "Daily free answers used. Subscribe for unlimited play."}
            </p>
          ) : null}
        </div>
        <CardRushLeaderboardPanel
          rows={boardRows}
          error={boardError}
          uid={uid}
          alias={alias}
          belowLeaderboardSlot={belowLeaderboardSlot}
        />
      </section>
    );
  }

  // ── Completed ─────────────────────────────────────────────────────────────
  if (runState === "completed") {
    const ms = runFinishedMs != null && runStartedAt != null ? runFinishedMs - runStartedAt : 0;
    const totalAttempts = attempts.length;
    const missed = totalAttempts - score;
    const heading =
      runOutcome === "lives" ? "Out of lives!" :
      runOutcome === "time" ? "Time's up!" :
      runOutcome === "quit" ? "Practice ended" : "Run over";
    return (
      <section className="crTrainer crTrainer--done" aria-label="Card Rush — finished">
        <div className="crResult">
          <h2 className="crResult-title">{heading}</h2>
          <p className="crResult-score">
            <span className="crResult-scoreNum">{score}</span>
            <span className="crResult-scoreLabel">{score === 1 ? "puzzle" : "puzzles"} solved</span>
          </p>
          <p className="crResult-counts">
            {totalAttempts} attempted · {missed} missed · best streak {bestStreak} · {formatMs(ms)} elapsed
          </p>
          {isCompetitive && submitState.status !== "idle" ? (
            <p className={`crResult-submit crResult-submit--${submitState.status}`}>{submitState.message}</p>
          ) : null}
          <div className="crResult-actions">
            <button type="button" className="crBigBtn" onClick={() => startRun(MODE_COMPETITIVE)}>
              Competitive (1 min)
            </button>
            <button type="button" className="crBigBtn crBigBtn--ghost" onClick={() => startRun(MODE_PRACTICE)}>
              Practice
            </button>
            {isCompetitive && !canRecordLeaderboard ? (
              <span className="crResult-hint">Sign in and set a username to appear on the leaderboard.</span>
            ) : null}
          </div>
          <h3 className="crResult-reviewHeading">Review your run</h3>
          <p className="crResult-reviewHint">Click any tile to see the puzzle, your answer and the explanation.</p>
          <TileStrip
            attempts={attempts}
            currentIdx={currentIdx}
            runState={runState}
            onReview={(i) => setReviewIdx(i)}
          />
        </div>
        <CardRushLeaderboardPanel
          rows={boardRows}
          error={boardError}
          uid={uid}
          alias={alias}
          belowLeaderboardSlot={belowLeaderboardSlot}
        />
        {reviewIdx != null ? (
          <ReviewModal attempt={attempts[reviewIdx]} onClose={() => setReviewIdx(null)} />
        ) : null}
      </section>
    );
  }

  // ── Running ──────────────────────────────────────────────────────────────
  if (!currentPuzzle) {
    return (
      <section className="crTrainer crTrainer--idle" aria-label="Card Rush">
        <p>Out of puzzles. Reload to try again.</p>
      </section>
    );
  }

  const dailyHardBlock = !!dailyInteractionBlocked;

  return (
    <section className="crTrainer crTrainer--running" aria-label="Card Rush — in play">
      <RunHeader
        puzzle={currentPuzzle}
        runState={runState}
        msRemaining={msRemaining}
        score={score}
        mode={runMode}
      />
      {previewPuzzle ? (
        <div className="crPreviewBanner">
          Preview mode: <strong>{previewPuzzle.id}</strong>
        </div>
      ) : null}

      <PlayBoard
        puzzle={currentPuzzle}
        highlightCard={highlight.card}
        highlightVariant={highlight.variant}
        dailyHardBlock={dailyHardBlock}
        onPick={handleCardPick}
      />

      {!isCompetitive ? (
        <div className="crRunQuit">
          <button type="button" className="crRunQuit-btn" onClick={() => finishRun("quit")}>
            End practice
          </button>
        </div>
      ) : null}

      {highlight.variant ? (
        <div
          className={`crFeedbackFlash crFeedbackFlash--${highlight.variant}`}
          role="status"
          aria-live="polite"
        >
          <span className="crFeedbackFlash-glyph" aria-hidden="true">
            {highlight.variant === "ok" ? "✓" : "✗"}
          </span>
          <span className="crFeedbackFlash-text">{highlight.variant === "ok" ? "Correct" : "Wrong"}</span>
        </div>
      ) : null}

      <TileStrip
        attempts={attempts}
        currentIdx={currentIdx}
        runState={runState}
        onReview={(i) => setReviewIdx(i)}
      />

      {dailyHardBlock ? (
        <div className="crDailyBlocked">
          <p>You&apos;ve used today&apos;s free correct answers on Card Rush.</p>
          {typeof onSubscribeClick === "function" ? (
            <button type="button" className="ct-btn ct-btn--primary" onClick={onSubscribeClick}>
              Subscribe for unlimited
            </button>
          ) : null}
        </div>
      ) : null}

      {reviewIdx != null ? (
        <ReviewModal attempt={attempts[reviewIdx]} onClose={() => setReviewIdx(null)} />
      ) : null}
    </section>
  );
}

function CardRushLeaderboardPanel({ rows, error, uid, alias, belowLeaderboardSlot }) {
  return (
    <aside className="crLeaderboard" aria-label="Card Rush leaderboard">
      <h3 className="crLeaderboard-title">Top scores · 1-min rush</h3>
      {error ? (
        <p className="crLeaderboard-error">{error}</p>
      ) : rows.length === 0 ? (
        <p className="crLeaderboard-empty">No scores yet — be first.</p>
      ) : (
        <ol className="crLeaderboard-list" role="list">
          {rows.slice(0, CARD_RUSH_LEADERBOARD_DISPLAY_LIMIT).map((r, i) => {
            const me = uid && r.uid === uid;
            return (
              <li key={`crlb-${r.uid}`} className={`crLeaderboard-row ${me ? "crLeaderboard-row--me" : ""}`}>
                <span className="crLeaderboard-rank">{i + 1}</span>
                <span className="crLeaderboard-alias">{r.alias}</span>
                <span className="crLeaderboard-score">{r.score}</span>
                <span className="crLeaderboard-time">{formatMs(r.timeMs)}</span>
              </li>
            );
          })}
        </ol>
      )}
      {!uid ? (
        <p className="crLeaderboard-hint">Sign in to put yourself on the board.</p>
      ) : !alias ? (
        <p className="crLeaderboard-hint">Add a username in your profile to appear here.</p>
      ) : null}
      {belowLeaderboardSlot}
    </aside>
  );
}

/** Simple placeholder shown to logged-out / paywalled users. */
function CardRushPreviewMock() {
  return (
    <div className="crLockedPreview">
      <p className="crLockedPreview-note">Preview (non-interactive)</p>
      <PlayBoard
        puzzle={LOCKED_PREVIEW_PUZZLE}
        highlightCard={null}
        highlightVariant={null}
        dailyHardBlock
        onPick={undefined}
      />
    </div>
  );
}

// Surface the seat constant so it's available to subcomponent tests / iterations later.
void ALL_SEATS;

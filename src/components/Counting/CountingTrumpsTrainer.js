import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

function suitSymbol(suit) {
  return SUIT_SYMBOL[suit] || suit;
}

function isTrump(card, trumpSuit) {
  return card && card.suit === trumpSuit;
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

function isFullHandShape(handObj) {
  return (
    handObj &&
    typeof handObj === "object" &&
    ["S", "H", "D", "C"].some((k) => Object.prototype.hasOwnProperty.call(handObj, k))
  );
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
    id: "d5-1",
    difficulty: 5,
    title: "Full hands shown (4 suits) — counting trumps after a show-out",
    trumpSuit: "S",
    shownHands: {
      // Show full (4-suit) hands for realism. Only trump suit cards are removed as they are played.
      DUMMY: {
        S: "Q973",
        H: "K86",
        D: "A74",
        C: "J52",
      },
      DECLARER: {
        S: "AKJ4",
        H: "Q92",
        D: "KQ3",
        C: "A86",
      },
    },
    expectedInitialLengths: {
      // Trump suit distribution (single digits only)
      LHO: 1,
      DUMMY: 4,
      RHO: 4,
      DECLARER: 4,
    },
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
          { seat: "LHO", card: { rank: "2", suit: "D" }, showOut: true },
          { seat: "DUMMY", card: { rank: "7", suit: "S" } },
          { seat: "RHO", card: { rank: "2", suit: "S" } },
        ],
      },
    ],
  },
];

function buildInitialRemainingHands(puzzle) {
  const trumpSuit = puzzle.trumpSuit;
  const dummy = puzzle.shownHands.DUMMY || {};
  const declarer = puzzle.shownHands.DECLARER || {};

  const dummyRanks =
    (dummy.suit === trumpSuit ? dummy.cards : parseHandSuitString(dummy[trumpSuit])) || [];
  const declarerRanks =
    (declarer.suit === trumpSuit ? declarer.cards : parseHandSuitString(declarer[trumpSuit])) || [];

  return {
    DUMMY: dummyRanks.map((r) => makeCard(r, trumpSuit)),
    DECLARER: declarerRanks.map((r) => makeCard(r, trumpSuit)),
  };
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

export default function CountingTrumpsTrainer() {
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const puzzlesForDifficulty = useMemo(() => {
    return PUZZLES.filter((p) => (p.difficulty || 1) === selectedDifficulty);
  }, [selectedDifficulty]);
  const [puzzleIdxInDifficulty, setPuzzleIdxInDifficulty] = useState(0);
  const puzzle = puzzlesForDifficulty[puzzleIdxInDifficulty] || PUZZLES[0];

  const [roundIdx, setRoundIdx] = useState(0);
  const [playIdx, setPlayIdx] = useState(-1); // -1 means none played in current round yet
  const [isPlaying, setIsPlaying] = useState(false);

  // Trick area shows up to one card per seat for the current trick.
  const [trickCards, setTrickCards] = useState({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });

  // Remaining visible trump cards in Dummy/Declarer hands (played cards disappear).
  const [remainingHands, setRemainingHands] = useState(() => buildInitialRemainingHands(PUZZLES[0]));
  const initialFullHands = useMemo(() => {
    return {
      DUMMY: buildFullHandCards(puzzle.shownHands?.DUMMY),
      DECLARER: buildFullHandCards(puzzle.shownHands?.DECLARER),
    };
  }, [puzzle.shownHands]);

  const [playedFromHand, setPlayedFromHand] = useState({ DUMMY: {}, DECLARER: {} });

  const dummyHandFanRef = useRef(null);
  const declarerHandFanRef = useRef(null);
  const prevHandRectsRef = useRef({ DUMMY: {}, DECLARER: {} });

  // Prompt flow
  const [promptStep, setPromptStep] = useState(null); // null | "DEFENDERS_STARTED" | "DEFENDERS_REMAINING" | "DISTRIBUTION" | "DONE"
  const [feedback, setFeedback] = useState(null); // { type: "ok"|"error", text }

  const [defendersStartedInput, setDefendersStartedInput] = useState("");
  const [defendersRemainingInput, setDefendersRemainingInput] = useState("");
  const [distributionInput, setDistributionInput] = useState({ LHO: "", DUMMY: "", RHO: "", DECLARER: "" });

  const defendersSingleInputRef = useRef(null);

  const [wrongAttempts, setWrongAttempts] = useState({
    defendersStarted: 0,
    defendersRemaining: 0,
    distribution: 0,
  });

  const { clearAll, setQueuedTimeout } = useTimeoutQueue();

  const showOutEvent = useMemo(() => {
    for (let r = 0; r < puzzle.rounds.length; r++) {
      const idx = (puzzle.rounds[r].plays || []).findIndex((p) => p.showOut);
      if (idx !== -1) return { roundIdx: r, playIdx: idx };
    }
    return { roundIdx: puzzle.rounds.length - 1, playIdx: (puzzle.rounds[puzzle.rounds.length - 1].plays || []).length - 1 };
  }, [puzzle.rounds]);

  const defendersRemainingCorrect = useMemo(() => {
    // We ask after the FULL show-out trick is completed (all 4 cards played).
    const lastPlayIdx = (puzzle.rounds[showOutEvent.roundIdx]?.plays || []).length - 1;
    return computeDefendersRemainingThroughEvent(puzzle, showOutEvent.roundIdx, lastPlayIdx);
  }, [puzzle, showOutEvent.playIdx, showOutEvent.roundIdx]);
  const defendersStartedCorrect = useMemo(() => {
    // Total trumps defenders start with (between them).
    return (puzzle.expectedInitialLengths.LHO || 0) + (puzzle.expectedInitialLengths.RHO || 0);
  }, [puzzle.expectedInitialLengths.LHO, puzzle.expectedInitialLengths.RHO]);

  const resetForPuzzle = () => {
    clearAll();
    setIsPlaying(false);
    setRoundIdx(0);
    setPlayIdx(-1);
    setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });
    setRemainingHands(buildInitialRemainingHands(puzzle));
    setPlayedFromHand({ DUMMY: {}, DECLARER: {} });
    setPromptStep("DEFENDERS_STARTED");
    setFeedback(null);
    setDefendersStartedInput("");
    setDefendersRemainingInput("");
    setDistributionInput({ LHO: "", DUMMY: "", RHO: "", DECLARER: "" });
    setWrongAttempts({ defendersStarted: 0, defendersRemaining: 0, distribution: 0 });
  };

  useEffect(() => {
    resetForPuzzle();
  }, [puzzle.id]);

  const stopPlayback = () => {
    clearAll();
    setIsPlaying(false);
  };

  const playFromStartToShowOut = () => {
    stopPlayback();
    setFeedback(null);
    setPromptStep(null);
    setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });
    setRemainingHands(buildInitialRemainingHands(puzzle));
    setPlayedFromHand({ DUMMY: {}, DECLARER: {} });
    setRoundIdx(0);
    setPlayIdx(-1);

    // Schedule sequential plays across rounds.
    setIsPlaying(true);
    let t = 0;
    const playDelay = 650;
    const betweenRoundsDelay = 900;

    for (let r = 0; r <= showOutEvent.roundIdx; r++) {
      // Clear trick at the start of each round.
      setQueuedTimeout(() => {
        setTrickCards({ LHO: null, DUMMY: null, RHO: null, DECLARER: null });
        setRoundIdx(r);
        setPlayIdx(-1);
      }, t);
      t += 250;

      const plays = puzzle.rounds[r].plays;
      // We always finish the full trick (all 4 cards) before prompting.
      for (let i = 0; i <= plays.length - 1; i++) {
        const p = plays[i];
        setQueuedTimeout(() => {
          setRoundIdx(r);
          setPlayIdx(i);
          setTrickCards((prev) => ({ ...prev, [p.seat]: p.card }));
          if (p.seat === "DUMMY" || p.seat === "DECLARER") {
            // Mark card as played from hand (for full-hand layout we keep a placeholder slot).
            setPlayedFromHand((prev) => ({
              ...prev,
              [p.seat]: { ...(prev[p.seat] || {}), [`${p.card.rank}${p.card.suit}`]: true },
            }));

            // If the played card is from the shown trump suit, remove it from the trump-only hand.
            setRemainingHands((prev) => ({
              ...prev,
              [p.seat]: isTrump(p.card, puzzle.trumpSuit) ? removeCardFromHand(prev[p.seat], p.card) : prev[p.seat],
            }));
          }
        }, t);
        t += playDelay;
      }

      // Pause between rounds unless this was the final (show-out) round.
      if (r !== showOutEvent.roundIdx) t += betweenRoundsDelay;
    }

    // After the full show-out trick is played (all 4 cards), show the prompt.
    setQueuedTimeout(() => {
      setIsPlaying(false);
      setPromptStep("DEFENDERS_REMAINING");
    }, t + 150);
  };

  const currentPlay = useMemo(() => {
    const plays = puzzle.rounds?.[roundIdx]?.plays || [];
    if (playIdx < 0 || playIdx >= plays.length) return null;
    return plays[playIdx];
  }, [puzzle.rounds, roundIdx, playIdx]);

  const animSeat = currentPlay?.seat || null;
  const showFullHands =
    isFullHandShape(puzzle.shownHands?.DUMMY) && isFullHandShape(puzzle.shownHands?.DECLARER);

  // Animate full-hand card shifts (FLIP) so cards "slide in" when one is played.
  useLayoutEffect(() => {
    if (!showFullHands) return;

    const seats = [
      { seat: "DUMMY", ref: dummyHandFanRef },
      { seat: "DECLARER", ref: declarerHandFanRef },
    ];

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
  }, [showFullHands, playedFromHand, puzzle.id]);

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

    const full = initialFullHands[seat] || [];
    const playedMap = playedFromHand?.[seat] || {};
    const unplayed = full.filter((c) => !playedMap[`${c.rank}${c.suit}`]);
    const ghostCount = Math.max(0, full.length - unplayed.length);
    const fanRef = seat === "DUMMY" ? dummyHandFanRef : seat === "DECLARER" ? declarerHandFanRef : null;

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

  const submitDefendersStarted = () => {
    const val = Number(defendersStartedInput);
    if (Number.isFinite(val) && String(defendersStartedInput).trim() !== "" && val === defendersStartedCorrect) {
      setFeedback({ type: "ok", text: "Well done — that’s correct!" });
      setQueuedTimeout(() => {
        setFeedback(null);
        setPromptStep(null);
        playFromStartToShowOut();
      }, 550);
    } else {
      setWrongAttempts((prev) => ({ ...prev, defendersStarted: prev.defendersStarted + 1 }));
      setFeedback({ type: "error", text: "Not quite — try again." });
    }
  };

  const submitDefendersRemaining = () => {
    const val = Number(defendersRemainingInput);
    if (Number.isFinite(val) && String(defendersRemainingInput).trim() !== "" && val === defendersRemainingCorrect) {
      setFeedback({ type: "ok", text: "Well done — that’s correct!" });
      setQueuedTimeout(() => {
        setFeedback(null);
        setPromptStep("DISTRIBUTION");
      }, 400);
    } else {
      setWrongAttempts((prev) => ({ ...prev, defendersRemaining: prev.defendersRemaining + 1 }));
      setFeedback({ type: "error", text: "Not quite — try again." });
    }
  };

  const submitDistribution = () => {
    const expected = puzzle.expectedInitialLengths;
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
        setPromptStep("DONE");
      }, 450);
    } else {
      setWrongAttempts((prev) => ({ ...prev, distribution: prev.distribution + 1 }));
      setFeedback({
        type: "error",
        text: allFilled ? "Not quite — try again." : "Please enter all 4 numbers, then try again.",
      });
    }
  };

  const setDistSeatDigit = (seat, rawValue) => {
    // Single digit only (0-9)
    const raw = String(rawValue ?? "");
    const digit = raw.replace(/[^0-9]/g, "").slice(-1);
    if (digit === "") {
      setDistributionInput((prev) => ({ ...prev, [seat]: "" }));
      return "";
    }
    setDistributionInput((prev) => ({ ...prev, [seat]: digit }));
    return digit;
  };

  const focusNextSeatNoWrap = (seat) => {
    const idx = SEATS.indexOf(seat);
    if (idx === -1 || idx === SEATS.length - 1) return;
    const next = SEATS[idx + 1];
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
    const next = (puzzleIdxInDifficulty + 1) % Math.max(1, puzzlesForDifficulty.length);
    setPuzzleIdxInDifficulty(next);
  };

  // Autoplace cursor on LHO when distribution prompt opens.
  useEffect(() => {
    if (promptStep === "DISTRIBUTION") {
      const t = setTimeout(() => {
        distributionRefs.LHO.current?.focus?.();
        distributionRefs.LHO.current?.select?.();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [promptStep]);

  // Make the single number tile always typeable (even though the input is visually hidden).
  useEffect(() => {
    if (promptStep === "DEFENDERS_STARTED" || promptStep === "DEFENDERS_REMAINING") {
      const t = setTimeout(() => {
        defendersSingleInputRef.current?.focus?.();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [promptStep]);

  const clearFeedback = () => setFeedback(null);

  const promptNode = (
    <>
      {!promptStep && <div className="ct-railMuted">Watch the play, then answer the prompt.</div>}

      {promptStep && promptStep !== "DONE" && (
        <div className="ct-promptRail">
          {(promptStep === "DEFENDERS_STARTED" || promptStep === "DEFENDERS_REMAINING") && (
            <>
              <div className="ct-questionText">
                {promptStep === "DEFENDERS_STARTED"
                  ? "How many trumps do the defenders have between them at the start?"
                  : "How many trumps do the defenders still hold?"}
              </div>

              <div className="ct-railAnswer">
                <div
                  className="ct-numBox ct-numBox--single"
                  onMouseDown={(e) => {
                    // Make the whole tile clickable/focusable (not just the border).
                    e.preventDefault();
                    defendersSingleInputRef.current?.focus?.({ preventScroll: true });
                  }}
                >
                  <div className="ct-numBoxValue ct-numBoxValue--single" aria-hidden="true">
                    {promptStep === "DEFENDERS_STARTED" ? defendersStartedInput : defendersRemainingInput}
                  </div>
                  <input
                    ref={defendersSingleInputRef}
                    className="ct-numBoxInput ct-numBoxInput--hidden"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    aria-label={
                      promptStep === "DEFENDERS_STARTED"
                        ? "Defenders starting trumps total"
                        : "Defenders trumps still held"
                    }
                    value={promptStep === "DEFENDERS_STARTED" ? defendersStartedInput : defendersRemainingInput}
                    onChange={(e) => {
                      const next = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
                      if (promptStep === "DEFENDERS_STARTED") setDefendersStartedInput(next);
                      else setDefendersRemainingInput(next);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (promptStep === "DEFENDERS_STARTED") submitDefendersStarted();
                        else submitDefendersRemaining();
                      }
                    }}
                    disabled={isPlaying}
                  />
                </div>
                <button
                  className="ct-btn"
                  onClick={promptStep === "DEFENDERS_STARTED" ? submitDefendersStarted : submitDefendersRemaining}
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
              <div className="ct-questionText">What was the original trump distribution?</div>

              <div className="ct-distRow ct-distRow--numBoxes" role="group" aria-label="Distribution inputs">
                {SEATS.map((seat) => (
                  <div key={seat} className="ct-distSeat">
                    <div className="ct-distLabel">{seat}</div>
                    <div
                      className="ct-numBox ct-numBox--dist"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        distributionRefs[seat]?.current?.focus?.({ preventScroll: true });
                      }}
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
                        aria-label={`${seat} original trump count`}
                        value={distributionInput[seat]}
                        onChange={(e) => {
                          const digit = setDistSeatDigit(seat, e.target.value);
                          if (!digit) return;

                          if (seat === "DECLARER") {
                            // Stop typing here; user must click if they want to edit earlier boxes.
                            e.target.blur();
                            return;
                          }
                          focusNextSeatNoWrap(seat);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (seat === "DECLARER") submitDistribution();
                            else focusNextSeatNoWrap(seat);
                          }
                        }}
                        onBlur={clearFeedback}
                        disabled={isPlaying}
                      />
                    </div>
                  </div>
                ))}
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

              <div className="ct-microHelp">
                Cursor starts at <strong>LHO</strong> and advances clockwise (10–13 supported).
              </div>
            </>
          )}

          {feedback && (
            <div className={`ct-feedback ${feedback.type === "ok" ? "ct-feedback--ok" : "ct-feedback--error"}`}>
              {feedback.text}
            </div>
          )}
        </div>
      )}

      {promptStep === "DONE" && (
        <div className="ct-promptDone">
          <div className="ct-promptTitle">Nice — you’ve counted the trumps correctly.</div>
          <div className="ct-row">
            <button className="ct-btn" onClick={nextHand}>
              Next hand
            </button>
            <button className="ct-btn ct-btn--secondary" onClick={playFromStartToShowOut}>
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
          <div className="ct-topNav" aria-label="Counting difficulty navigation">
            <div className="ct-topNavLabel">Difficulty</div>
            <div className="ct-diffTabs" role="tablist" aria-label="Difficulty levels">
              {[1, 2, 3, 4, 5].map((d) => (
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

            <div className="ct-topNavSpacer" />

            <div className="ct-topNavLabel">Problem</div>
            <div className="ct-problemTabs" role="tablist" aria-label="Problems in difficulty">
              {puzzlesForDifficulty.map((p, idx) => (
                <button
                  key={p.id}
                  className={`ct-problemTab ${idx === puzzleIdxInDifficulty ? "ct-problemTab--active" : ""}`}
                  onClick={() => setPuzzleIdxInDifficulty(idx)}
                  type="button"
                  role="tab"
                  aria-selected={idx === puzzleIdxInDifficulty}
                  title={p.title}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="ct-table">
          {/* Dummy */}
          <div className={`ct-seat ct-seat--dummy ${showFullHands ? "ct-seat--span" : ""}`}>
            <div className="ct-seatLabel">DUMMY</div>
            <div className="ct-handWrap">
              {renderSeatHand("DUMMY")}
            </div>
          </div>

          {/* Middle row: LHO - Trick - RHO */}
          <div className="ct-seat ct-seat--lho">
            <div className="ct-seatLabel">LHO</div>
          </div>

          <div className={`ct-trickWrap ${showFullHands ? "ct-trickWrap--sidePanel" : ""}`} aria-label="Trick area and controls">
            <div className="ct-trickBoard" aria-label="Card table">
              <div className="ct-trickGrid" role="region" aria-label="Trick area">
                <div className="ct-trickPos ct-trickPos--top">
                  {trickCards.DUMMY && (
                    <div className={`ct-card ${animSeat === "DUMMY" ? "ct-card--entered" : ""} ${cardColorClass(trickCards.DUMMY)}`}>
                      {formatCard(trickCards.DUMMY)}
                    </div>
                  )}
                </div>
                <div className="ct-trickPos ct-trickPos--left">
                  {trickCards.LHO && (
                    <div className={`ct-card ${animSeat === "LHO" ? "ct-card--entered" : ""} ${cardColorClass(trickCards.LHO)}`}>
                      {formatCard(trickCards.LHO)}
                    </div>
                  )}
                </div>
                <div className="ct-trickPos ct-trickPos--right">
                  {trickCards.RHO && (
                    <div className={`ct-card ${animSeat === "RHO" ? "ct-card--entered" : ""} ${cardColorClass(trickCards.RHO)}`}>
                      {formatCard(trickCards.RHO)}
                    </div>
                  )}
                </div>
                <div className="ct-trickPos ct-trickPos--bottom">
                  {trickCards.DECLARER && (
                    <div className={`ct-card ${animSeat === "DECLARER" ? "ct-card--entered" : ""} ${cardColorClass(trickCards.DECLARER)}`}>
                      {formatCard(trickCards.DECLARER)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="ct-trickSide">
              {showFullHands && (
                <div className="ct-sidePrompt" aria-label="Counting prompt">
                  {promptNode}
                </div>
              )}
              <button
                className="ct-btn ct-btn--secondary ct-replayBtn"
                onClick={playFromStartToShowOut}
                disabled={isPlaying || promptStep === "DEFENDERS_STARTED"}
              >
                Let me see that again
              </button>
            </div>
          </div>

          <div className="ct-seat ct-seat--rho">
            <div className="ct-seatLabel">RHO</div>
          </div>

          {/* Declarer */}
          <div className={`ct-seat ct-seat--declarer ${showFullHands ? "ct-seat--span" : ""}`}>
            <div className="ct-seatLabel">DECLARER</div>
            <div className="ct-handWrap">
              {renderSeatHand("DECLARER")}
            </div>
          </div>
          </div>
        </div>

        {!showFullHands && (
          <aside className="ct-rail" aria-label="Counting prompt">
            {promptNode}
          </aside>
        )}
      </div>

    </div>
  );
}


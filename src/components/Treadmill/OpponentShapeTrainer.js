import React, { useCallback, useEffect, useRef, useState } from "react";

const CORRECT_PAUSE_MS = 700;
const TRY_AGAIN_HINT_MS = 1300;
const TICK_LIFETIME_MS = 1100;
const STREAK_METER_STEPS = 10;
const CHEER_LIFETIME_MS = 1600;
const CHEER_MESSAGES = ["Great focus", "Perfect rhythm", "Excellent run", "On fire", "Keep going"];
const SUITS = [
  { key: "S", symbol: "♠", colorClass: "ct-card--black" },
  { key: "H", symbol: "♥", colorClass: "ct-card--red" },
  { key: "D", symbol: "♦", colorClass: "ct-card--red" },
  { key: "C", symbol: "♣", colorClass: "ct-card--black" },
];
const HAND_PATTERNS = [
  { top: "KJ83", bottom: "A10952" },
  { top: "A1074", bottom: "J983" },
  { top: "KQ2", bottom: "A107543" },
  { top: "KQ10", bottom: "A874" },
  { top: "K93", bottom: "Q1062" },
];

function parseHolding(holding) {
  return String(holding || "").match(/10|[2-9]|[AKQJT]/g) || [];
}

function pickRandomSuit(previousSuitKey) {
  const source = SUITS.filter((s) => s.key !== previousSuitKey);
  const pool = source.length ? source : SUITS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickRandomPattern(previousPatternIndex) {
  const source = HAND_PATTERNS.map((_, i) => i).filter((i) => i !== previousPatternIndex);
  const pool = source.length ? source : HAND_PATTERNS.map((_, i) => i);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickWeightedSplitLeft(total, previousLeft) {
  const all = Array.from({ length: Math.max(0, total) + 1 }, (_, i) => i);
  const source = all.filter((n) => n !== previousLeft);
  const pool = source.length ? source : all;
  if (!pool.length) return 0;

  const min = 0;
  const max = total;
  const middle = pool.filter((n) => n !== min && n !== max);
  const edgeWeight = 4; // 0-x and x-0 are rare: 8% combined
  const middleWeight = middle.length ? 92 / middle.length : 0;
  const totalWeight = pool.reduce((sum, n) => sum + (n === min || n === max ? edgeWeight : middleWeight), 0);
  if (totalWeight <= 0) return pool[Math.floor(Math.random() * pool.length)];

  let roll = Math.random() * totalWeight;
  for (let i = 0; i < pool.length; i += 1) {
    const n = pool[i];
    const w = n === min || n === max ? edgeWeight : middleWeight;
    roll -= w;
    if (roll <= 0) return n;
  }
  return pool[pool.length - 1];
}

function buildNextRound(previousRound) {
  const patternIndex = pickRandomPattern(previousRound?.patternIndex);
  const suit = pickRandomSuit(previousRound?.suit?.key);
  const topCards = parseHolding(HAND_PATTERNS[patternIndex].top);
  const bottomCards = parseHolding(HAND_PATTERNS[patternIndex].bottom);
  const ourTotal = topCards.length + bottomCards.length;
  const opponentsTotal = Math.max(0, 13 - ourTotal);
  const leftCount = pickWeightedSplitLeft(
    opponentsTotal,
    previousRound?.opponentsTotal === opponentsTotal ? previousRound.leftCount : null
  );
  return {
    patternIndex,
    suit,
    topCards,
    bottomCards,
    opponentsTotal,
    leftCount,
  };
}

export default function OpponentShapeTrainer({ lockedPreview = false }) {
  const inputRef = useRef(null);
  const correctTimerRef = useRef(null);
  const tryAgainTimerRef = useRef(null);
  const cheerTimerRef = useRef(null);
  const tickIdRef = useRef(1);

  const [round, setRound] = useState(() => buildNextRound(null));
  const [inputValue, setInputValue] = useState("");
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [tickBursts, setTickBursts] = useState([]);
  const [cheerText, setCheerText] = useState("");

  const clearActionTimers = useCallback(() => {
    if (correctTimerRef.current != null) {
      window.clearTimeout(correctTimerRef.current);
      correctTimerRef.current = null;
    }
    if (tryAgainTimerRef.current != null) {
      window.clearTimeout(tryAgainTimerRef.current);
      tryAgainTimerRef.current = null;
    }
  }, []);

  const clearCheerTimer = useCallback(() => {
    if (cheerTimerRef.current != null) {
      window.clearTimeout(cheerTimerRef.current);
      cheerTimerRef.current = null;
    }
  }, []);

  const advanceRound = useCallback(() => {
    setRound((prev) => buildNextRound(prev));
    setInputValue("");
    setShowSuccessTick(false);
    setShowTryAgain(false);
  }, []);

  useEffect(
    () => () => {
      clearActionTimers();
      clearCheerTimer();
    },
    [clearActionTimers, clearCheerTimer]
  );

  useEffect(() => {
    if (lockedPreview) return undefined;
    const t = window.setTimeout(() => inputRef.current?.focus?.({ preventScroll: true }), 0);
    return () => window.clearTimeout(t);
  }, [lockedPreview, round.leftCount, round.patternIndex, round.suit.key]);

  const handleInputChange = useCallback(
    (rawValue) => {
      if (lockedPreview) return;
      if (showSuccessTick) return;

      const cleaned = String(rawValue ?? "").replace(/[^0-9]/g, "").slice(0, 1);
      setInputValue(cleaned);
      setShowTryAgain(false);
      if (!cleaned) return;

      const submitted = Number(cleaned);
      const expected = round.opponentsTotal - round.leftCount;

      if (submitted === expected) {
        const nextStreak = streakCount + 1;
        setRoundsCompleted((v) => v + 1);
        setStreakCount(nextStreak);
        setShowSuccessTick(true);
        const burstId = tickIdRef.current;
        tickIdRef.current += 1;
        setTickBursts((prev) => [...prev.slice(-6), burstId]);
        window.setTimeout(() => {
          setTickBursts((prev) => prev.filter((id) => id !== burstId));
        }, TICK_LIFETIME_MS);
        if (nextStreak % STREAK_METER_STEPS === 0) {
          const cheer = CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)];
          setCheerText(cheer);
          clearCheerTimer();
          cheerTimerRef.current = window.setTimeout(() => {
            cheerTimerRef.current = null;
            setCheerText("");
          }, CHEER_LIFETIME_MS);
        }
        clearActionTimers();
        correctTimerRef.current = window.setTimeout(() => {
          correctTimerRef.current = null;
          advanceRound();
        }, CORRECT_PAUSE_MS);
        return;
      }

      setInputValue("");
      setShowTryAgain(true);
      setStreakCount(0);
      clearActionTimers();
      tryAgainTimerRef.current = window.setTimeout(() => {
        tryAgainTimerRef.current = null;
        setShowTryAgain(false);
      }, TRY_AGAIN_HINT_MS);
      window.setTimeout(() => inputRef.current?.focus?.({ preventScroll: true }), 0);
    },
    [
      advanceRound,
      clearActionTimers,
      clearCheerTimer,
      lockedPreview,
      round.leftCount,
      round.opponentsTotal,
      showSuccessTick,
      streakCount,
    ]
  );

  const previewClass = lockedPreview ? "tm-toolPreview tm-toolPreview--locked" : "";

  return (
    <section className={`tm-oppShape ${previewClass}`} aria-live="polite">
      <h2 className="tm-oppShape-title">Opponent shape drill</h2>
      {lockedPreview ? (
        <p className="tm-toolPreview-note">Preview only. Subscribe to use this tool.</p>
      ) : null}
      <div
        className="tm-arcadeMeter"
        role="progressbar"
        aria-label="Current streak progress"
        aria-valuemin={0}
        aria-valuemax={STREAK_METER_STEPS}
        aria-valuenow={Math.min(streakCount, STREAK_METER_STEPS)}
      >
        {Array.from({ length: STREAK_METER_STEPS }).map((_, idx) => (
          <span
            key={`opp-meter-${idx}`}
            className={`tm-arcadeMeterStep ${idx < Math.min(streakCount, STREAK_METER_STEPS) ? "tm-arcadeMeterStep--on" : ""}`}
          />
        ))}
      </div>
      <div className="tm-arcadeCheer" aria-live="polite">
        {cheerText ? <span className="tm-arcadeCheerText">{cheerText}</span> : null}
      </div>

      <div className="tm-oppShape-sidesLayout" role="group" aria-label="Opponent split prompt">
        <div className="tm-oppShape-sideBox tm-oppShape-sideBox--left">
          <div className="ct-numBox ct-numBox--dist ct-numBox--locked" aria-label={`Given value ${round.leftCount}`}>
            <div className="ct-numBoxValue ct-numBoxValue--dist">{round.leftCount}</div>
          </div>
        </div>

        <div className="tm-oppShape-table" aria-label="Trump suit setup">
          <div className="tm-oppShape-handRow">
            <div className="ct-handCardsAsCards tm-oppShape-cardStrip" aria-label={round.topCards.join(" ")}>
              {round.topCards.map((rank) => (
                <div key={`top-${rank}`} className={`ct-miniCard ct-miniCard--fan ${round.suit.colorClass}`}>
                  <div className="ct-fanFace" aria-hidden="true">
                    <div className="ct-fanRank">{rank}</div>
                    <div className="ct-fanSuit">{round.suit.symbol}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="tm-oppShape-handRow">
            <div className="ct-handCardsAsCards tm-oppShape-cardStrip" aria-label={round.bottomCards.join(" ")}>
              {round.bottomCards.map((rank) => (
                <div key={`bottom-${rank}`} className={`ct-miniCard ct-miniCard--fan ${round.suit.colorClass}`}>
                  <div className="ct-fanFace" aria-hidden="true">
                    <div className="ct-fanRank">{rank}</div>
                    <div className="ct-fanSuit">{round.suit.symbol}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tm-oppShape-sideBox tm-oppShape-sideBox--right">
          <div className="tm-buildingBlocks-answerWrap">
            <div
              className={`ct-numBox ct-numBox--dist ${showSuccessTick ? "tm-numBox--successPulse" : ""}`}
              onPointerDown={(e) => {
                if (lockedPreview) return;
                const el = inputRef.current;
                if (!el) return;
                if (e.pointerType === "mouse") e.preventDefault();
                el.focus({ preventScroll: true });
                if (e.pointerType === "mouse") el.select();
              }}
            >
              <div className="ct-numBoxValue ct-numBoxValue--dist" aria-hidden="true">
                {inputValue}
              </div>
              <input
                ref={inputRef}
                className="ct-numBoxInput ct-numBoxInput--hidden tm-oppShapeDigitInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                aria-label={`Complete ${round.leftCount} dash`}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                onFocus={(e) => e.target.select()}
                disabled={lockedPreview}
              />
            </div>
            <div className="tm-arcadeTickRail" aria-hidden="true">
              {tickBursts.map((id, idx) => (
                <span key={id} className="tm-arcadePopTick" style={{ "--tick-index": idx }}>
                  ✓
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tm-oppShape-feedback" aria-live="assertive">
        {showSuccessTick ? <span className="tm-oppShape-feedbackText tm-oppShape-feedbackText--correct">✓</span> : null}
        {!showSuccessTick && showTryAgain ? (
          <span className="tm-oppShape-feedbackText tm-oppShape-feedbackText--wrong">Try again</span>
        ) : null}
      </div>

      <p className="tm-oppShape-count">Completed: {roundsCompleted}</p>
    </section>
  );
}

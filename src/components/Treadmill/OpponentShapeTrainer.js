import React, { useCallback, useEffect, useRef, useState } from "react";

const LEFT_COUNTS = [3, 2, 4, 1, 0, 5];
const CORRECT_PAUSE_MS = 700;
const TRY_AGAIN_HINT_MS = 1300;
const TOP_HAND = ["A", "8", "3"];
const BOTTOM_HAND = ["K", "Q", "10", "7", "2"];
const LEFT_COUNT_WEIGHTS = {
  0: 5,
  1: 22.5,
  2: 22.5,
  3: 22.5,
  4: 22.5,
  5: 5,
};

function pickRandomLeftCount(previousValue) {
  const source = LEFT_COUNTS.filter((n) => n !== previousValue);
  const weightedPool = source.length ? source : LEFT_COUNTS;
  const totalWeight = weightedPool.reduce((sum, n) => sum + (LEFT_COUNT_WEIGHTS[n] || 0), 0);

  if (totalWeight <= 0) {
    return weightedPool[Math.floor(Math.random() * weightedPool.length)];
  }

  let roll = Math.random() * totalWeight;
  for (let i = 0; i < weightedPool.length; i += 1) {
    const value = weightedPool[i];
    roll -= LEFT_COUNT_WEIGHTS[value] || 0;
    if (roll <= 0) return value;
  }

  return weightedPool[weightedPool.length - 1];
}

export default function OpponentShapeTrainer() {
  const inputRef = useRef(null);
  const correctTimerRef = useRef(null);
  const tryAgainTimerRef = useRef(null);

  const [leftCount, setLeftCount] = useState(() => pickRandomLeftCount(null));
  const [inputValue, setInputValue] = useState("");
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const clearTimers = useCallback(() => {
    if (correctTimerRef.current != null) {
      window.clearTimeout(correctTimerRef.current);
      correctTimerRef.current = null;
    }
    if (tryAgainTimerRef.current != null) {
      window.clearTimeout(tryAgainTimerRef.current);
      tryAgainTimerRef.current = null;
    }
  }, []);

  const advanceRound = useCallback(() => {
    setLeftCount((prev) => pickRandomLeftCount(prev));
    setInputValue("");
    setShowSuccessTick(false);
    setShowTryAgain(false);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus?.({ preventScroll: true }), 0);
    return () => window.clearTimeout(t);
  }, [leftCount]);

  const handleInputChange = useCallback(
    (rawValue) => {
      if (showSuccessTick) return;

      const cleaned = String(rawValue ?? "").replace(/[^0-9]/g, "").slice(0, 1);
      setInputValue(cleaned);
      setShowTryAgain(false);

      if (!cleaned) return;

      const submitted = Number(cleaned);
      const expected = 5 - leftCount;

      if (submitted === expected) {
        setRoundsCompleted((v) => v + 1);
        setShowSuccessTick(true);
        clearTimers();
        correctTimerRef.current = window.setTimeout(() => {
          correctTimerRef.current = null;
          advanceRound();
        }, CORRECT_PAUSE_MS);
        return;
      }

      setInputValue("");
      setShowTryAgain(true);
      clearTimers();
      tryAgainTimerRef.current = window.setTimeout(() => {
        tryAgainTimerRef.current = null;
        setShowTryAgain(false);
      }, TRY_AGAIN_HINT_MS);
      window.setTimeout(() => inputRef.current?.focus?.({ preventScroll: true }), 0);
    },
    [advanceRound, clearTimers, leftCount, showSuccessTick]
  );

  return (
    <section className="tm-oppShape" aria-live="polite">
      <h2 className="tm-oppShape-title">Opponent shape drill</h2>

      <div className="tm-oppShape-sidesLayout" role="group" aria-label="Opponent split prompt">
        <div className="tm-oppShape-sideBox tm-oppShape-sideBox--left">
          <div className="ct-numBox ct-numBox--dist ct-numBox--locked" aria-label={`Given value ${leftCount}`}>
            <div className="ct-numBoxValue ct-numBoxValue--dist">{leftCount}</div>
          </div>
        </div>

        <div className="tm-oppShape-table" aria-label="Trump suit setup">
          <div className="tm-oppShape-handRow">
            <div className="ct-handCardsAsCards tm-oppShape-cardStrip" aria-label="A 8 3">
              {TOP_HAND.map((rank) => (
                <div key={`top-${rank}`} className="ct-miniCard ct-miniCard--fan ct-card--black">
                  <div className="ct-fanFace" aria-hidden="true">
                    <div className="ct-fanRank">{rank}</div>
                    <div className="ct-fanSuit">♠</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="tm-oppShape-handRow">
            <div className="ct-handCardsAsCards tm-oppShape-cardStrip" aria-label="K Q 10 7 2">
              {BOTTOM_HAND.map((rank) => (
                <div key={`bottom-${rank}`} className="ct-miniCard ct-miniCard--fan ct-card--black">
                  <div className="ct-fanFace" aria-hidden="true">
                    <div className="ct-fanRank">{rank}</div>
                    <div className="ct-fanSuit">♠</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tm-oppShape-sideBox tm-oppShape-sideBox--right">
          <div
            className={`ct-numBox ct-numBox--dist ${showSuccessTick ? "tm-numBox--successPulse" : ""}`}
            onPointerDown={(e) => {
              const el = inputRef.current;
              if (!el) return;
              if (e.pointerType === "mouse") {
                e.preventDefault();
              }
              el.focus({ preventScroll: true });
              if (e.pointerType === "mouse") {
                el.select();
              }
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
              aria-label={`Complete ${leftCount} dash`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </div>

      <div className="tm-oppShape-feedback" aria-live="assertive">
        {showSuccessTick ? (
          <span className="tm-oppShape-feedbackText tm-oppShape-feedbackText--correct">✓</span>
        ) : null}
        {!showSuccessTick && showTryAgain ? (
          <span className="tm-oppShape-feedbackText tm-oppShape-feedbackText--wrong">Try again</span>
        ) : null}
      </div>

      <p className="tm-oppShape-count">Completed: {roundsCompleted}</p>
    </section>
  );
}

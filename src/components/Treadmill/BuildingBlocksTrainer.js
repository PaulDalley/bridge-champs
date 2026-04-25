import React, { useCallback, useEffect, useRef, useState } from "react";

const OUR_COUNTS = [4, 5, 6, 7, 8, 9];
const CORRECT_PAUSE_MS = 700;
const TICK_LIFETIME_MS = 1100;
const STREAK_METER_STEPS = 10;
const CHEER_LIFETIME_MS = 1600;
const CHEER_MESSAGES = ["Nice run", "Great rhythm", "Sharp work", "Locked in", "Keep rolling"];

function pickRandomOurCount(previousValue) {
  const source = OUR_COUNTS.filter((n) => n !== previousValue);
  const pool = source.length ? source : OUR_COUNTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function BuildingBlocksTrainer() {
  const inputRef = useRef(null);
  const correctTimerRef = useRef(null);
  const cheerTimerRef = useRef(null);
  const tickIdRef = useRef(1);
  const [ourCount, setOurCount] = useState(() => pickRandomOurCount(null));
  const [inputValue, setInputValue] = useState("");
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [tickBursts, setTickBursts] = useState([]);
  const [cheerText, setCheerText] = useState("");

  const clearTimers = useCallback(() => {
    if (correctTimerRef.current != null) {
      window.clearTimeout(correctTimerRef.current);
      correctTimerRef.current = null;
    }
    if (cheerTimerRef.current != null) {
      window.clearTimeout(cheerTimerRef.current);
      cheerTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus?.({ preventScroll: true }), 0);
    return () => window.clearTimeout(t);
  }, [ourCount]);

  const advanceRound = useCallback(() => {
    setOurCount((prev) => pickRandomOurCount(prev));
    setInputValue("");
    setShowSuccessTick(false);
  }, []);

  const handleInputChange = useCallback(
    (rawValue) => {
      if (showSuccessTick) return;
      const cleaned = String(rawValue ?? "").replace(/[^0-9]/g, "").slice(0, 1);
      setInputValue(cleaned);
      if (!cleaned) return;

      const expected = 13 - ourCount;
      if (Number(cleaned) === expected) {
        const nextStreak = streakCount + 1;
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
          if (cheerTimerRef.current != null) {
            window.clearTimeout(cheerTimerRef.current);
          }
          cheerTimerRef.current = window.setTimeout(() => {
            cheerTimerRef.current = null;
            setCheerText("");
          }, CHEER_LIFETIME_MS);
        }
        clearTimers();
        correctTimerRef.current = window.setTimeout(() => {
          correctTimerRef.current = null;
          advanceRound();
        }, CORRECT_PAUSE_MS);
        return;
      }

      setInputValue("");
      setStreakCount(0);
      window.setTimeout(() => inputRef.current?.focus?.({ preventScroll: true }), 0);
    },
    [advanceRound, clearTimers, ourCount, showSuccessTick, streakCount]
  );

  return (
    <section className="tm-buildingBlocks" aria-live="polite">
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
            key={`bb-meter-${idx}`}
            className={`tm-arcadeMeterStep ${idx < Math.min(streakCount, STREAK_METER_STEPS) ? "tm-arcadeMeterStep--on" : ""}`}
          />
        ))}
      </div>
      <div className="tm-arcadeCheer" aria-live="polite">
        {cheerText ? <span className="tm-arcadeCheerText">{cheerText}</span> : null}
      </div>

      <div className="tm-buildingBlocks-row">
        <span className="tm-buildingBlocks-label">When we have</span>
        <div className="ct-numBox ct-numBox--dist ct-numBox--locked" aria-label={`When we have ${ourCount}`}>
          <div className="ct-numBoxValue ct-numBoxValue--dist">{ourCount}</div>
        </div>
      </div>

      <div className="tm-buildingBlocks-row">
        <span className="tm-buildingBlocks-label">They have</span>
        <div className="tm-buildingBlocks-answerWrap">
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
              className="ct-numBoxInput ct-numBoxInput--hidden tm-buildingBlocksDigitInput"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              aria-label="They have"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              onFocus={(e) => e.target.select()}
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
    </section>
  );
}

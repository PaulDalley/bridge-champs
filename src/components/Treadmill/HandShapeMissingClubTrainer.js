import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TREADMILL_HAND_SHAPES } from "../../data/treadmill/handShapes";
import {
  formatTreadmillTimeShort,
  loadTreadmillLeaderboard,
  upsertTreadmillLeaderboard,
} from "../../utils/treadmillLeaderboard";

const CORRECT_PAUSE_MS = 780;
const TRY_AGAIN_HINT_MS = 1700;

const SUIT_KEYS = ["S", "H", "D", "C"];

const SUIT_META = {
  S: { glyph: "♠", ariaSuit: "Spades", isRed: false },
  H: { glyph: "♥", ariaSuit: "Hearts", isRed: true },
  D: { glyph: "♦", ariaSuit: "Diamonds", isRed: true },
  C: { glyph: "♣", ariaSuit: "Clubs", isRed: false },
};

function parseShape(shapeStr) {
  const s = shapeStr.replace(/\s+/g, "");
  if (s.length !== 4 || !/^\d{4}$/.test(s)) return null;
  const d = s.split("").map((c) => parseInt(c, 10));
  const sum = d[0] + d[1] + d[2] + d[3];
  if (sum !== 13) return null;
  return { s: d[0], h: d[1], d: d[2], c: d[3], raw: s };
}

/** Each problem: random shape and random hidden suit (no fixed cycle). */
function pickRandomRound(shapesLength) {
  const shapeIdx = shapesLength ? Math.floor(Math.random() * shapesLength) : 0;
  const hiddenSuit = SUIT_KEYS[Math.floor(Math.random() * SUIT_KEYS.length)];
  return {
    shapeIdx,
    hiddenSuit,
    columnOrder: buildColumnOrderHiddenLast(hiddenSuit),
  };
}

/** Three visible suits in random order, then hidden suit (vacant box always on the right). */
function buildColumnOrderHiddenLast(hiddenSuit) {
  const visible = SUIT_KEYS.filter((k) => k !== hiddenSuit);
  for (let i = visible.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [visible[i], visible[j]] = [visible[j], visible[i]];
  }
  return [...visible, hiddenSuit];
}

function countForSuit(shape, suitKey) {
  const k = suitKey.toLowerCase();
  return shape[k];
}

export default function HandShapeMissingClubTrainer({ belowLeaderboardSlot, canRecordLeaderboard = false }) {
  const shapes = useMemo(() => TREADMILL_HAND_SHAPES.map(parseShape).filter(Boolean), []);
  const hiddenInputRef = useRef(null);
  const aliasInputRef = useRef(null);
  const advanceTimerRef = useRef(null);
  const tryAgainTimerRef = useRef(null);
  const streakRef = useRef(0);
  const streakStartMsRef = useRef(null);

  const [round, setRound] = useState(() => pickRandomRound(shapes.length));
  const [roundNonce, setRoundNonce] = useState(0);

  const { shapeIdx, hiddenSuit, columnOrder } = round;
  const shape = shapes[shapeIdx];

  const [hiddenInput, setHiddenInput] = useState("");
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);

  const [leaderboard, setLeaderboard] = useState(() => loadTreadmillLeaderboard());
  const [pendingStreakRecord, setPendingStreakRecord] = useState(null);
  const [aliasDraft, setAliasDraft] = useState("");

  const expectedHidden = shape ? countForSuit(shape, hiddenSuit) : 0;
  const hiddenMaxLen = expectedHidden > 9 ? 2 : 1;

  const clearTimers = useCallback(() => {
    if (advanceTimerRef.current != null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (tryAgainTimerRef.current != null) {
      window.clearTimeout(tryAgainTimerRef.current);
      tryAgainTimerRef.current = null;
    }
  }, []);

  const advanceAfterSuccess = useCallback(() => {
    clearTimers();
    setShowSuccessTick(false);
    setShowTryAgain(false);
    setHiddenInput("");
    setRound(() => pickRandomRound(shapes.length));
    setRoundNonce((n) => n + 1);
  }, [clearTimers, shapes.length]);

  const resetStreak = useCallback(() => {
    streakRef.current = 0;
    streakStartMsRef.current = null;
  }, []);

  const finishStreakModalAndAdvance = useCallback(() => {
    setPendingStreakRecord(null);
    setAliasDraft("");
    resetStreak();
    advanceAfterSuccess();
  }, [advanceAfterSuccess, resetStreak]);

  const saveAliasAndFinish = useCallback(() => {
    const name = aliasDraft.trim();
    if (!name || !pendingStreakRecord) {
      finishStreakModalAndAdvance();
      return;
    }
    if (canRecordLeaderboard) {
      setLeaderboard((prev) => upsertTreadmillLeaderboard(prev, name, pendingStreakRecord.timeMs));
    }
    finishStreakModalAndAdvance();
  }, [aliasDraft, canRecordLeaderboard, finishStreakModalAndAdvance, pendingStreakRecord]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (pendingStreakRecord) {
      const t = window.setTimeout(() => aliasInputRef.current?.focus?.({ preventScroll: true }), 60);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => hiddenInputRef.current?.focus?.({ preventScroll: true }), 0);
    return () => window.clearTimeout(t);
  }, [shapeIdx, hiddenSuit, columnOrder.join(""), roundNonce, pendingStreakRecord]);

  useEffect(() => {
    if (!pendingStreakRecord) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        finishStreakModalAndAdvance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingStreakRecord, finishStreakModalAndAdvance]);

  const handleHiddenChange = useCallback(
    (raw) => {
      if (showSuccessTick || pendingStreakRecord) return;
      const cleaned = String(raw ?? "")
        .replace(/[^0-9]/g, "")
        .slice(0, hiddenMaxLen);

      if (cleaned.length < hiddenMaxLen) {
        setHiddenInput(cleaned);
        setShowTryAgain(false);
        return;
      }

      const n = Number(cleaned, 10);
      if (Number.isNaN(n)) {
        setHiddenInput(cleaned);
        return;
      }

      if (n === expectedHidden) {
        setHiddenInput(cleaned);
        setShowSuccessTick(true);
        clearTimers();

        streakRef.current += 1;
        const nextStreak = streakRef.current;
        if (nextStreak === 1) {
          streakStartMsRef.current = Date.now();
        }

        if (nextStreak === 10 && streakStartMsRef.current != null) {
          if (canRecordLeaderboard) {
            const timeMs = Date.now() - streakStartMsRef.current;
            advanceTimerRef.current = window.setTimeout(() => {
              advanceTimerRef.current = null;
              setShowSuccessTick(false);
              setPendingStreakRecord({ timeMs });
            }, CORRECT_PAUSE_MS);
            return;
          }
          resetStreak();
          advanceTimerRef.current = window.setTimeout(() => {
            advanceTimerRef.current = null;
            advanceAfterSuccess();
          }, CORRECT_PAUSE_MS);
          return;
        }

        advanceTimerRef.current = window.setTimeout(() => {
          advanceTimerRef.current = null;
          advanceAfterSuccess();
        }, CORRECT_PAUSE_MS);
        return;
      }

      resetStreak();
      setHiddenInput("");
      setShowTryAgain(true);
      clearTimers();
      tryAgainTimerRef.current = window.setTimeout(() => {
        tryAgainTimerRef.current = null;
        setShowTryAgain(false);
      }, TRY_AGAIN_HINT_MS);
      window.setTimeout(() => {
        hiddenInputRef.current?.focus?.({ preventScroll: true });
      }, 0);
    },
    [
      advanceAfterSuccess,
      clearTimers,
      expectedHidden,
      hiddenMaxLen,
      canRecordLeaderboard,
      pendingStreakRecord,
      resetStreak,
      showSuccessTick,
    ]
  );

  if (!shape) {
    return (
      <div className="ct-questionText" style={{ fontSize: "var(--text-base)" }}>
        No valid shapes are configured. Add entries to the hand shape list.
      </div>
    );
  }

  const rows = columnOrder.map((suitKey) => {
    const meta = SUIT_META[suitKey];
    const locked = suitKey !== hiddenSuit;
    const count = countForSuit(shape, suitKey);
    return {
      suitKey,
      glyph: meta.glyph,
      ariaSuit: meta.ariaSuit,
      isRed: meta.isRed,
      locked,
      displayValue: locked ? String(count) : hiddenInput,
    };
  });

  const hiddenAriaSuit = SUIT_META[hiddenSuit]?.ariaSuit || "suit";
  const inputLocked = showSuccessTick || !!pendingStreakRecord;

  return (
    <div className="tm-handShape" aria-live="polite">
      <div className="ct-questionText tm-handShape-intro">Fill in the missing shape</div>

      <div
        className={`ct-shapeRow tm-shapeRow ${pendingStreakRecord ? "tm-handShape--blocked" : ""}`}
        role="group"
        aria-label="Hand shape lengths by suit"
        key={roundNonce}
      >
        {rows.map((row) => (
          <div
            key={row.suitKey}
            className="ct-distSeat tm-distSeat"
            {...(row.locked ? { "aria-label": `${row.ariaSuit} length ${row.displayValue}` } : {})}
          >
            <div className="ct-distLabel tm-suitDistLabel" aria-hidden="true">
              <span className={`ct-suitSym tm-suitGlyph ${row.isRed ? "ct-suitSym--red" : "ct-suitSym--black"}`}>
                {row.glyph}
              </span>
            </div>
            <div
              className={`ct-numBox ct-numBox--dist ${row.locked ? "ct-numBox--locked" : ""} ${
                showSuccessTick && !row.locked ? "tm-numBox--successPulse" : ""
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                if (row.locked || inputLocked) return;
                hiddenInputRef.current?.focus?.({ preventScroll: true });
                hiddenInputRef.current?.select?.();
              }}
            >
              <div className="ct-numBoxValue ct-numBoxValue--dist" aria-hidden="true">
                {row.displayValue}
              </div>
              {!row.locked && (
                <input
                  ref={hiddenInputRef}
                  className="ct-numBoxInput ct-numBoxInput--hidden"
                  type="text"
                  inputMode="numeric"
                  enterKeyHint="done"
                  pattern="[0-9]*"
                  maxLength={hiddenMaxLen}
                  autoComplete="off"
                  aria-label={`Enter ${hiddenAriaSuit} length`}
                  value={hiddenInput}
                  onChange={(e) => handleHiddenChange(e.target.value)}
                  onFocus={(e) => {
                    if (!inputLocked) e.target.select();
                  }}
                  disabled={inputLocked}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="tm-handShape-feedbackSlot" aria-live="assertive">
        <div className="tm-handShape-feedbackInner">
          {!pendingStreakRecord && showSuccessTick && (
            <div className="tm-successTick" role="status" aria-label="Correct">
              <span className="tm-successTickMark" aria-hidden="true">
                ✓
              </span>
            </div>
          )}
          {!pendingStreakRecord && showTryAgain && (
            <div className="tm-tryAgainHint" role="status">
              Try again
            </div>
          )}
        </div>
      </div>

      <section className="tm-lbBoard" aria-labelledby="tm-lb-board-title">
        <div className="tm-lbBoard-header">
          <h2 id="tm-lb-board-title" className="tm-lbBoard-title">
            Leaderboard
          </h2>
          <p className="tm-lbBoard-tagline">
            {canRecordLeaderboard
              ? "10 correct in a row · fastest 5 · one best time per name · this device only"
              : "Sign in to record a time. 10 correct in a row · fastest 5 · one best time per name · this device only"}
          </p>
        </div>
        <div className="tm-lbTableWrap">
          <table className="tm-lbTable">
            <thead>
              <tr>
                <th scope="col" className="tm-lbTh tm-lbTh--rank">
                  #
                </th>
                <th scope="col" className="tm-lbTh">
                  Name
                </th>
                <th scope="col" className="tm-lbTh tm-lbTh--time">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={3} className="tm-lbTd tm-lbTd--empty">
                    {canRecordLeaderboard
                      ? "No scores yet. Hit 10 correct in a row to post a time."
                      : "Sign in to post a time. Practice runs do not add scores while you are signed out."}
                  </td>
                </tr>
              ) : (
                leaderboard.map((e, i) => (
                  <tr key={`lb-row-${i}`} className={i < 3 ? `tm-lbTr--place${i + 1}` : undefined}>
                    <td className="tm-lbTd tm-lbTd--rank">{i + 1}</td>
                    <td className="tm-lbTd tm-lbTd--name">{e.alias}</td>
                    <td className="tm-lbTd tm-lbTd--time">{formatTreadmillTimeShort(e.timeMs)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {belowLeaderboardSlot}

      {pendingStreakRecord && (
        <div className="tm-lbOverlay" role="dialog" aria-modal="true" aria-labelledby="tm-lb-title">
          <div className="tm-lbCard">
            <h2 id="tm-lb-title" className="tm-lbTitle">
              10 in a row
            </h2>
            <p className="tm-lbTimeLine">
              Time: <strong>{formatTreadmillTimeShort(pendingStreakRecord.timeMs)}</strong>
            </p>
            <label className="tm-lbLabel" htmlFor="tm-lb-alias">
              Name or alias (optional for leaderboard)
            </label>
            <input
              id="tm-lb-alias"
              ref={aliasInputRef}
              className="tm-lbInput"
              type="text"
              maxLength={40}
              autoComplete="nickname"
              value={aliasDraft}
              onChange={(e) => setAliasDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveAliasAndFinish();
                }
              }}
            />
            <div className="tm-lbActions">
              <button type="button" className="ct-btn" onClick={saveAliasAndFinish}>
                Save to board
              </button>
              <button type="button" className="ct-btn ct-btn--secondary" onClick={finishStreakModalAndAdvance}>
                Skip
              </button>
            </div>
            <p className="tm-lbHint">Press Escape to skip. Same name only keeps your fastest run in the top 5.</p>
          </div>
        </div>
      )}
    </div>
  );
}

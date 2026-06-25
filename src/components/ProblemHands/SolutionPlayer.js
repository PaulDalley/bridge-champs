import React, { useMemo, useState, useRef, useCallback } from "react";
import {
  suitSymbol,
  suitColorClass,
  displayRank,
  rankValue,
  sortHand,
  legalPlays,
  trickWinner,
  sameCard,
  nextClockwise,
  suitOrderForTrump,
} from "../PlayTable/bridgeCore";
import PracticeVideoBlock from "../Counting/PracticeVideoBlock";
import "./SolutionPlayer.css";

const removeCard = (cards, card) => cards.filter((c) => !sameCard(c, card));
const lowestOf = (cards) =>
  cards.reduce((lo, c) => (lo == null || rankValue(c.rank) < rankValue(lo.rank) ? c : lo), null);

export function simulateLowestLine(hands, contract, lead) {
  if (!hands || !lead) return [];
  const remaining = {
    N: [...hands.N],
    E: [...hands.E],
    S: [...hands.S],
    W: [...hands.W],
  };
  const play = [{ seat: lead.seat, card: lead.card }];
  remaining[lead.seat] = removeCard(remaining[lead.seat], lead.card);
  let trick = [{ seat: lead.seat, card: lead.card }];
  let seat = nextClockwise(lead.seat);
  let guard = 0;
  while (play.length < 52 && guard++ < 60) {
    if (trick.length === 4) {
      seat = trickWinner(trick, contract.strain);
      trick = [];
    }
    const ledSuit = trick.length ? trick[0].card.suit : null;
    const legal = legalPlays(remaining[seat], ledSuit);
    const card = lowestOf(legal);
    if (!card) break;
    play.push({ seat, card });
    remaining[seat] = removeCard(remaining[seat], card);
    trick.push({ seat, card });
    seat = nextClockwise(seat);
  }
  return play;
}

function remainingHand(originalHand, play, cut, seat) {
  let cards = [...originalHand];
  for (let i = 0; i < cut; i++) {
    if (play[i].seat === seat) cards = removeCard(cards, play[i].card);
  }
  return sortHand(cards);
}

function currentTrick(play, cut) {
  if (cut === 0) return [];
  const trickIndex = Math.floor((cut - 1) / 4);
  return play.slice(trickIndex * 4, cut);
}

// Which message to show, given how many cards have been revealed (`step`).
// A message surfaces only once its trick has fully settled (step on a 4-card
// boundary, or the very end) — never mid-animation — and shows the latest note
// pinned anywhere within that just-completed trick. So a note typed mid-trick
// (e.g. right after the opening lead, before trick 1 finishes) appears at the
// END of that trick instead of flashing by; tricks with no note show blank, so
// each new message appears from blank and is easy to notice.
function activeMessage(messages, step, total) {
  if (!messages) return "";
  // A message pinned at card 0 is the "start"/learning message: shown at Trick 0,
  // before any card is played (the playback opens here and waits — no auto-start).
  if (step <= 0) return messages[0] || "";
  const atTrickEnd = step % 4 === 0 || step === total;
  if (!atTrickEnd) return "";
  const trickStart = Math.floor((step - 1) / 4) * 4;
  let best = "";
  for (const k of Object.keys(messages)) {
    const n = Number(k);
    if (n > trickStart && n <= step) best = messages[k];
  }
  return best;
}

/** Detect inline numbered list patterns (1. ... 2. ...) and return structured data. */
function parseListText(text) {
  const re = /(\d+)\.\s+/g;
  const matches = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const before = m.index > 0 ? text[m.index - 1] : " ";
    if (/\s/.test(before)) {
      matches.push({ idx: m.index, num: parseInt(m[1]), fullLen: m[0].length });
    }
  }
  const firstOne = matches.findIndex((x) => x.num === 1);
  if (firstOne === -1) return null;
  const listItems = [];
  let expected = 1;
  for (let i = firstOne; i < matches.length; i++) {
    if (matches[i].num !== expected) break;
    listItems.push(matches[i]);
    expected++;
  }
  if (listItems.length < 2) return null;
  const intro = text.slice(0, listItems[0].idx).trim();
  const items = listItems.map((lm, i) => {
    const start = lm.idx + lm.fullLen;
    const end = i + 1 < listItems.length ? listItems[i + 1].idx : text.length;
    return text.slice(start, end).trim();
  });
  return { intro, items };
}

/** Render a message string with numbered lists and paragraph breaks. */
function formatMessage(text) {
  if (!text || !text.trim()) return null;
  const parsed = parseListText(text);
  if (parsed) {
    const introParas = parsed.intro ? parsed.intro.split(/\n+/).filter(Boolean) : [];
    return (
      <>
        {introParas.map((p, i) => (
          <p key={i} className="sp-msgPara">{p}</p>
        ))}
        <ol className="sp-msgOl">
          {parsed.items.map((item, i) => (
            <li key={i} className="sp-msgLi">{item}</li>
          ))}
        </ol>
      </>
    );
  }
  return text.split(/\n+/).filter(Boolean).map((p, i) => (
    <p key={i} className="sp-msgPara">{p}</p>
  ));
}

function HandBox({ seat, label, cards, leftToPlay, suits, focus }) {
  return (
    <div
      className={`sp-hand sp-hand--${seat} ${leftToPlay ? "sp-hand--turn" : ""} ${
        focus ? "sp-hand--focus" : ""
      }`}
    >
      <div className="sp-handLabel">{label}</div>
      <div className="sp-handSuits">
        {suits.map((s) => {
          const ranks = cards.filter((c) => c.suit === s).map((c) => displayRank(c.rank));
          return (
            <div className="sp-suitLine" key={s}>
              <span className={`sp-suit ${suitColorClass(s)}`}>{suitSymbol(s)}</span>
              <span className="sp-ranks">{ranks.length ? ranks.join(" ") : "—"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrickCard({ seat, card }) {
  return (
    <div className={`sp-trickCard sp-trickCard--${seat}`}>
      <span className={`sp-tcRank ${suitColorClass(card.suit)}`}>{displayRank(card.rank)}</span>
      <span className={`sp-tcSuit ${suitColorClass(card.suit)}`}>{suitSymbol(card.suit)}</span>
    </div>
  );
}

export default function SolutionPlayer({ problem, play, messages, videoUrl, isPremium, isAdmin, isBasicMember }) {
  const hands = problem?.deal?.hands;
  const total = play ? play.length : 0;
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const animTimerRef = useRef(null);

  const view = useMemo(() => {
    if (!hands || !play) return null;
    const trick = currentTrick(play, step);
    const seatToPlay = step < total ? play[step].seat : null;
    return {
      remaining: {
        N: remainingHand(hands.N, play, step, "N"),
        E: remainingHand(hands.E, play, step, "E"),
        S: remainingHand(hands.S, play, step, "S"),
        W: remainingHand(hands.W, play, step, "W"),
      },
      trick,
      seatToPlay,
      message: activeMessage(messages, step, total),
    };
  }, [hands, play, messages, step, total]);

  const cancelAnim = useCallback(() => {
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    setAnimating(false);
  }, []);

  const handlePrevTrick = useCallback(() => {
    cancelAnim();
    setStep((s) => Math.max(0, (Math.ceil(s / 4) - 1) * 4));
  }, [cancelAnim]);

  const handleNextTrick = useCallback(() => {
    if (animating) return;
    const target = Math.min(total, (Math.floor(step / 4) + 1) * 4);
    if (target <= step) return;
    setAnimating(true);
    let current = step;
    const tick = () => {
      current++;
      setStep(current);
      if (current < target) {
        animTimerRef.current = setTimeout(tick, 400);
      } else {
        animTimerRef.current = null;
        setAnimating(false);
      }
    };
    tick();
  }, [animating, step, total]);

  const handleRestart = useCallback(() => {
    cancelAnim();
    setStep(0);
  }, [cancelAnim]);

  if (!hands || !play || total === 0) {
    return <p className="sp-empty">No recorded line yet.</p>;
  }

  const formatted = formatMessage(view.message);
  const suitOrder = suitOrderForTrump(problem?.contract?.strain);
  // Focus (spotlight) the hand the learner is declaring from — South in these
  // problems. Persistent through the walkthrough so the eye stays on it.
  const focusSeat = (problem && problem.contract && problem.contract.declarer) || "S";

  return (
    <div className="sp-walkthrough">
      {/* Global solution video — persists across all tricks, premium-gated. */}
      {(videoUrl || isAdmin) && (
        <PracticeVideoBlock
          videoUrl={videoUrl}
          isPremium={isPremium}
          isAdmin={isAdmin}
          isBasicMember={isBasicMember}
          label="Solution video"
          className="sp-solutionVideo"
        />
      )}
      <div className="sp-board">
        <div className="sp-row sp-row--top">
          <HandBox seat="N" label="North" cards={view.remaining.N} leftToPlay={view.seatToPlay === "N"} suits={suitOrder} focus={focusSeat === "N"} />
        </div>
        <div className="sp-row sp-row--mid">
          <HandBox seat="W" label="West" cards={view.remaining.W} leftToPlay={view.seatToPlay === "W"} suits={suitOrder} focus={focusSeat === "W"} />
          <div className="sp-trick">
            {view.trick.map((p) => (
              <TrickCard key={`${p.seat}${p.card.suit}${p.card.rank}`} seat={p.seat} card={p.card} />
            ))}
          </div>
          <HandBox seat="E" label="East" cards={view.remaining.E} leftToPlay={view.seatToPlay === "E"} suits={suitOrder} focus={focusSeat === "E"} />
        </div>
        <div className="sp-row sp-row--bot">
          <HandBox seat="S" label="South" cards={view.remaining.S} leftToPlay={view.seatToPlay === "S"} suits={suitOrder} focus={focusSeat === "S"} />
        </div>
      </div>

      <div className={`sp-message ${formatted ? "sp-message--has-content" : "sp-message--empty"}`}>
        {formatted || <span className="sp-msgEmpty"> </span>}
      </div>

      <div className="sp-controls">
        <button
          className="sp-btn"
          disabled={step === 0}
          onClick={handlePrevTrick}
        >
          ← Previous trick
        </button>
        <span className="sp-progress">
          Trick {Math.ceil(step / 4)} / {Math.ceil(total / 4)}
        </span>
        <button
          className="sp-btn sp-btn--primary"
          disabled={step >= total || animating}
          onClick={handleNextTrick}
        >
          Next trick →
        </button>
        <button className="sp-btn" onClick={handleRestart}>
          Restart
        </button>
      </div>
    </div>
  );
}

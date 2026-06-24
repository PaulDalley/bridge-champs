import React, { useEffect, useMemo, useState } from "react";
import {
  suitSymbol,
  suitColorClass,
  displayRank,
  sortHand,
  legalPlays,
  trickWinner,
  sameCard,
  nextClockwise,
  suitOrderForTrump,
} from "../PlayTable/bridgeCore";
import { loadSolution, saveSolution } from "./solutionStore";
import "./SolutionPlayer.css";

const removeCard = (cards, card) => cards.filter((c) => !sameCard(c, card));
const isLegal = (legal, card) => legal.some((c) => sameCard(c, card));

// Given the cards played so far, work out whose turn it is, the led suit, the
// legal plays, and the cards on the table for the current trick.
function playState(play, hands, strain) {
  const remaining = {};
  ["N", "E", "S", "W"].forEach((s) => {
    let cards = [...(hands[s] || [])];
    play.forEach((p) => {
      if (p.seat === s) cards = removeCard(cards, p.card);
    });
    remaining[s] = sortHand(cards);
  });
  const n = play.length;
  let trickCards = [];
  let seat = null;
  let ledSuit = null;
  if (n > 0 && n % 4 === 0) {
    seat = trickWinner(play.slice(n - 4), strain); // winner leads next trick
  } else if (n > 0) {
    const start = Math.floor(n / 4) * 4;
    trickCards = play.slice(start);
    seat = nextClockwise(trickCards[trickCards.length - 1].seat);
    ledSuit = trickCards[0].card.suit;
  }
  const legal = seat ? legalPlays(remaining[seat], ledSuit) : [];
  return { remaining, seat, ledSuit, legal, trickCards };
}

function EditorHand({ seat, label, cards, isTurn, legal, onPlay, suits }) {
  return (
    <div className={`sp-hand ${isTurn ? "sp-hand--turn" : ""}`}>
      <div className="sp-handLabel">
        {label}
        {isTurn ? " — to play" : ""}
      </div>
      {suits.map((s) => {
        const suitCards = cards.filter((c) => c.suit === s);
        return (
          <div className="sp-suitLine" key={s}>
            <span className={`sp-suit ${suitColorClass(s)}`}>{suitSymbol(s)}</span>
            <span className="sp-ranks">
              {suitCards.length === 0
                ? "—"
                : suitCards.map((c) => {
                    const playable = isTurn && isLegal(legal, c);
                    return (
                      <button
                        key={c.rank}
                        type="button"
                        className={`sp-cardBtn ${playable ? "sp-cardBtn--play" : ""}`}
                        disabled={!playable}
                        onClick={() => onPlay(seat, c)}
                      >
                        {displayRank(c.rank)}
                      </button>
                    );
                  })}
            </span>
          </div>
        );
      })}
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

export default function SolutionEditor({ problem, onDone }) {
  const lead = problem.lead;
  const [play, setPlay] = useState([{ seat: lead.seat, card: lead.card }]);
  const [messages, setMessages] = useState({});
  const [videoUrl, setVideoUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    let alive = true;
    loadSolution(problem.id).then((sol) => {
      if (!alive) return;
      if (sol && sol.play && sol.play.length) {
        setPlay(sol.play);
        setMessages(sol.messages || {});
      }
      if (sol) setVideoUrl(sol.videoUrl || "");
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [problem.id]);

  const strain = problem.contract.strain;
  const suitOrder = suitOrderForTrump(strain);
  const st = useMemo(
    () => playState(play, problem.deal.hands, strain),
    [play, problem.deal.hands, strain]
  );

  const playCard = (seat, card) => {
    if (seat !== st.seat || !isLegal(st.legal, card)) return;
    setPlay((p) => [...p, { seat, card }]);
    setNote("");
  };
  const undo = () => setPlay((p) => (p.length <= 1 ? p : p.slice(0, -1)));
  const restart = () => setPlay([{ seat: lead.seat, card: lead.card }]);
  const setMsg = (text) =>
    setMessages((m) => {
      const next = { ...m };
      if (text.trim()) next[play.length] = text;
      else delete next[play.length];
      return next;
    });
  const save = async () => {
    setSaving(true);
    try {
      await saveSolution(problem.id, { play, messages, videoUrl: videoUrl.trim() });
      setNote("Saved ✓");
    } catch (e) {
      setNote("Save failed: " + (e.code || e.message || "permission"));
    }
    setSaving(false);
  };

  if (!loaded) return <p className="sp-empty">Loading…</p>;

  const msgKeys = Object.keys(messages)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="sp-walkthrough">
      <p className="sp-editHint">
        Click cards to play the line ({play.length} of 52 played). Type a message below to pin it at this
        point; it shows from here on in playback. Save when done — you can re-open and continue any time.
      </p>
      <div className="sp-board">
        <div className="sp-row sp-row--top">
          <EditorHand seat="N" label="North" cards={st.remaining.N} isTurn={st.seat === "N"} legal={st.legal} onPlay={playCard} suits={suitOrder} />
        </div>
        <div className="sp-row sp-row--mid">
          <EditorHand seat="W" label="West" cards={st.remaining.W} isTurn={st.seat === "W"} legal={st.legal} onPlay={playCard} suits={suitOrder} />
          <div className="sp-trick">
            {st.trickCards.map((p) => (
              <TrickCard key={p.seat} seat={p.seat} card={p.card} />
            ))}
          </div>
          <EditorHand seat="E" label="East" cards={st.remaining.E} isTurn={st.seat === "E"} legal={st.legal} onPlay={playCard} suits={suitOrder} />
        </div>
        <div className="sp-row sp-row--bot">
          <EditorHand seat="S" label="South" cards={st.remaining.S} isTurn={st.seat === "S"} legal={st.legal} onPlay={playCard} suits={suitOrder} />
        </div>
      </div>

      <label className="sp-msgLabel">Message pinned at card #{play.length}</label>
      <textarea
        className="sp-msgInput"
        value={messages[play.length] || ""}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="e.g. Win the lead in hand, then lead a low spade towards dummy…"
        rows={3}
      />
      {msgKeys.length > 0 && (
        <div className="sp-msgList">
          Messages set at cards: {msgKeys.join(", ")}
        </div>
      )}

      <label className="sp-msgLabel">Solution video (YouTube URL — shown throughout, premium only)</label>
      <input
        type="text"
        className="sp-msgInput"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://youtube.com/shorts/…  (leave blank for no video)"
      />

      <div className="sp-controls">
        <button className="sp-btn" disabled={play.length <= 1} onClick={undo}>
          ↶ Undo card
        </button>
        <button className="sp-btn" onClick={restart}>
          Restart
        </button>
        <button className="sp-btn sp-btn--primary" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save solution"}
        </button>
        {onDone && (
          <button className="sp-btn" onClick={onDone}>
            Done
          </button>
        )}
        {note && <span className="sp-note">{note}</span>}
      </div>
    </div>
  );
}

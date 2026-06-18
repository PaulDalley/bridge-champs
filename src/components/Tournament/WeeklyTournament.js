import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PlayTable from "../PlayTable/PlayTable";
import { weeklyBoards, boardVul, boardDealer, computeLeaderboard } from "./weeklyBoards";
import { getWeeklyTournament, loadMyEntries, loadAllEntries, saveEntry } from "./tournamentData";
import "./WeeklyTournament.css";

const STRAIN = { S: "♠", H: "♥", D: "♦", C: "♣", N: "NT" };
const vulLabel = (v) => (v === "Both" ? "All" : v === "NS" ? "N-S" : v === "EW" ? "E-W" : "None");
const scoreStr = (n) => (n > 0 ? `+${n}` : `${n}`);
function contractStr(c) {
  if (!c) return "Passed out";
  return `${c.level}${STRAIN[c.strain] || c.strain}${c.doubled === 2 ? " XX" : c.doubled === 1 ? " X" : ""}`;
}

function WeeklyTournament({ uid, displayName, subscriptionActive, isAdmin, authReady }) {
  const isLocalhost =
    typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);
  const mockUnsub =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mockUnsub") === "1";
  const canView = (isLocalhost && !mockUnsub) || isAdmin || !!subscriptionActive;

  const [weekId, setWeekId] = useState(null);
  const [boards, setBoards] = useState(null);
  const [myEntries, setMyEntries] = useState({});
  const [view, setView] = useState("lobby"); // "lobby" | "playing" | "leaderboard"
  const [activeBoard, setActiveBoard] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [error, setError] = useState(null);

  // Load the week's boards + this player's progress.
  useEffect(() => {
    if (!canView) return;
    let cancelled = false;
    (async () => {
      try {
        const t = await getWeeklyTournament();
        const bds = weeklyBoards(t.seed);
        const mine = uid ? await loadMyEntries(t.weekId, uid) : {};
        if (!cancelled) {
          setWeekId(t.weekId);
          setBoards(bds);
          setMyEntries(mine);
        }
      } catch (e) {
        if (!cancelled) setError("Couldn't load the tournament (storage rules may not be live yet).");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canView, uid]);

  const nextBoardNo = boards
    ? (boards.find((b) => !myEntries[b.boardNo]) || {}).boardNo || null
    : null;
  const doneCount = Object.keys(myEntries).length;

  const onResult = useCallback(
    async (record) => {
      if (!activeBoard || !weekId) return;
      try {
        const saved = await saveEntry(weekId, uid, displayName, activeBoard.boardNo, record);
        setMyEntries((m) => ({ ...m, [activeBoard.boardNo]: saved }));
      } catch (e) {
        setError("Couldn't save your result (storage rules may not be live yet).");
      }
    },
    [activeBoard, weekId, uid, displayName]
  );

  const openLeaderboard = useCallback(async () => {
    setView("leaderboard");
    setLeaderboard(null);
    try {
      const all = await loadAllEntries(weekId);
      setLeaderboard(computeLeaderboard(all));
    } catch (e) {
      setLeaderboard({ players: [], datums: new Map(), impByUidBoard: {} });
      setError("Couldn't load the leaderboard (storage rules may not be live yet).");
    }
  }, [weekId]);

  // ── gates ─────────────────────────────────────────────────────────────────────
  if (!authReady) return <div className="wt-page"><p className="wt-wait">Checking access…</p></div>;
  if (!canView) {
    return (
      <div className="wt-page wt-page--locked">
        <Helmet><title>Weekly Tournament — Members</title><meta name="robots" content="noindex" /></Helmet>
        <div className="wt-lockCard">
          <h1 className="wt-lockTitle">The Weekly Tournament is for members</h1>
          <Link to="/membership?redirectTo=/weekly" className="wt-btn wt-btn--primary">View membership</Link>
        </div>
      </div>
    );
  }

  // ── playing a board ─────────────────────────────────────────────────────────────
  if (view === "playing" && activeBoard) {
    return (
      <div className="wt-page">
        <Helmet><title>Weekly Tournament — Bridge Champions</title><meta name="robots" content="noindex" /></Helmet>
        <div className="wt-playHead">Board {activeBoard.boardNo} of {boards.length}</div>
        <PlayTable
          key={activeBoard.boardNo}
          embedded
          singleDeal
          dealOverride={activeBoard}
          onResult={onResult}
          onExit={() => { setActiveBoard(null); setView("lobby"); }}
        />
      </div>
    );
  }

  // ── leaderboard ─────────────────────────────────────────────────────────────────
  if (view === "leaderboard") {
    const players = leaderboard ? leaderboard.players : null;
    const myRank = players ? players.findIndex((p) => p.uid === uid) : -1;
    return (
      <div className="wt-page">
        <Helmet><title>Weekly Tournament — Bridge Champions</title><meta name="robots" content="noindex" /></Helmet>
        <div className="wt-bar">
          <button className="wt-btn" onClick={() => setView("lobby")}>← Back</button>
          <h1 className="wt-title">Leaderboard</h1>
          <span className="wt-week">Week {weekId || "…"}</span>
        </div>
        {!players ? (
          <p className="wt-wait">Loading…</p>
        ) : players.length === 0 ? (
          <p className="wt-empty">No results yet this week.</p>
        ) : (
          <ol className="wt-board">
            {players.slice(0, 3).map((p, i) => (
              <li key={p.uid} className={`wt-row ${p.uid === uid ? "wt-row--me" : ""}`}>
                <span className="wt-rank">{i + 1}</span>
                <span className="wt-name">{p.displayName}</span>
                <span className="wt-imps">{p.totalImps >= 0 ? "+" : ""}{p.totalImps} IMPs</span>
              </li>
            ))}
            {myRank >= 3 && (
              <li className="wt-row wt-row--me wt-row--you">
                <span className="wt-rank">{myRank + 1}</span>
                <span className="wt-name">You</span>
                <span className="wt-imps">{players[myRank].totalImps >= 0 ? "+" : ""}{players[myRank].totalImps} IMPs</span>
              </li>
            )}
          </ol>
        )}
      </div>
    );
  }

  // ── lobby ───────────────────────────────────────────────────────────────────────
  return (
    <div className="wt-page">
      <Helmet><title>Weekly Tournament — Bridge Champions</title><meta name="robots" content="noindex" /></Helmet>
      <div className="wt-bar">
        <h1 className="wt-title">Weekly Tournament</h1>
        <span className="wt-week">Week {weekId || "…"} · {doneCount}/{boards ? boards.length : 10} played</span>
      </div>
      {error && <div className="wt-note">{error}</div>}
      {!boards ? (
        <p className="wt-wait">Loading boards…</p>
      ) : (
        <>
          <ul className="wt-boards">
            {boards.map((b) => {
              const entry = myEntries[b.boardNo];
              const isNext = b.boardNo === nextBoardNo;
              const locked = !entry && !isNext;
              return (
                <li key={b.boardNo} className={`wt-boardItem ${entry ? "is-done" : isNext ? "is-next" : "is-locked"}`}>
                  <span className="wt-bNo">{b.boardNo}</span>
                  <span className="wt-bMeta">{boardDealer(b.boardNo)} deals · {vulLabel(boardVul(b.boardNo))} vul</span>
                  <span className="wt-bStatus">
                    {entry ? (
                      <span className="wt-result">{contractStr(entry.contract)} · {scoreStr(entry.rawScoreNS)}</span>
                    ) : isNext ? (
                      <button className="wt-btn wt-btn--primary" onClick={() => { setActiveBoard(b); setView("playing"); }}>
                        Play
                      </button>
                    ) : (
                      <span className="wt-locked">Locked</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="wt-actions">
            <button className="wt-btn" onClick={openLeaderboard}>View leaderboard</button>
            {nextBoardNo == null && <span className="wt-done">All 10 boards played — nice!</span>}
          </div>
        </>
      )}
    </div>
  );
}

export default connect((state) => ({
  uid: state.auth?.uid,
  displayName: state.auth?.displayName || "Player",
  subscriptionActive: state.auth?.subscriptionActive === true,
  isAdmin: state.auth?.a === true,
  authReady: state.auth?.authReady === true,
}))(WeeklyTournament);

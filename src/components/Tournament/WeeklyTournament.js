import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PlayTable from "../PlayTable/PlayTable";
import { weeklyBoards, computeLeaderboard } from "./weeklyBoards";
import { getWeeklyTournament, loadMyEntries, loadAllEntries, saveEntry } from "./tournamentData";
import { sendPlayEvent } from "../../utils/analytics";
import "./WeeklyTournament.css";

// Leaderboard privacy: show "First L" (first name + surname initial), e.g.
// "Paul Dalley" -> "Paul D". Single-word names are left as-is.
function shortName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Player";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}`;
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
  const [idx, setIdx] = useState(0); // index of the board currently shown
  const [view, setView] = useState("play"); // "play" | "leaderboard"
  const [leaderboard, setLeaderboard] = useState(null);
  const [error, setError] = useState(null);

  // Load the week's boards + this player's progress; resume at the first unplayed board.
  useEffect(() => {
    if (!canView) return;
    let cancelled = false;
    (async () => {
      try {
        const t = await getWeeklyTournament();
        const bds = weeklyBoards(t.seed);
        const mine = uid ? await loadMyEntries(t.weekId, uid) : {};
        if (cancelled) return;
        setWeekId(t.weekId);
        setBoards(bds);
        setMyEntries(mine);
        const firstUndone = bds.findIndex((b) => !mine[b.boardNo]);
        setIdx(firstUndone === -1 ? bds.length : firstUndone);
      } catch (e) {
        if (!cancelled) setError("Couldn't load the tournament (are you signed in as a member?).");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canView, uid]);

  const onResult = useCallback(
    async (record) => {
      if (!weekId || !boards || !boards[idx]) return;
      const b = boards[idx];
      try {
        const saved = await saveEntry(weekId, uid, displayName, b.boardNo, record);
        setMyEntries((m) => ({ ...m, [b.boardNo]: saved }));
        sendPlayEvent("weekly_board_complete", { board_no: b.boardNo });
      } catch (e) {
        setError("Couldn't save your result (are you signed in as a member?).");
      }
    },
    [weekId, boards, idx, uid, displayName]
  );

  const nextBoard = useCallback(() => setIdx((i) => i + 1), []);

  const openLeaderboard = useCallback(async () => {
    setView("leaderboard");
    setLeaderboard(null);
    try {
      setLeaderboard(computeLeaderboard(await loadAllEntries(weekId)));
    } catch (e) {
      setLeaderboard({ players: [], datums: new Map(), impByUidBoard: {} });
    }
  }, [weekId]);

  // ── gates ───────────────────────────────────────────────────────────────────
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

  if (!boards) return <div className="wt-page"><p className="wt-wait">Loading…</p></div>;

  // Leaderboard screen — reused as a full page (after all boards are done) AND as an
  // overlay laid over the live board. Rendering it as an overlay (rather than an early
  // return that swaps out the play tree) keeps PlayTable mounted, so the hand in
  // progress is preserved when the player opens the leaderboard and comes back.
  const renderLeaderboard = () => {
    const players = leaderboard ? leaderboard.players : null;
    const myRank = players ? players.findIndex((p) => p.uid === uid) : -1;
    return (
      <div className="wt-page">
        <Helmet><title>Weekly Tournament — Bridge Champions</title><meta name="robots" content="noindex" /></Helmet>
        <div className="wt-bar">
          <button className="wt-btn" onClick={() => setView("play")}>← Back</button>
          <h1 className="wt-title">Weekly Tournament</h1>
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
                <span className="wt-name">{shortName(p.displayName)}</span>
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
  };

  // ── all 10 played ────────────────────────────────────────────────────────────
  if (idx >= boards.length) {
    if (view === "leaderboard") return renderLeaderboard();
    return (
      <div className="wt-page">
        <Helmet><title>Weekly Tournament — Bridge Champions</title><meta name="robots" content="noindex" /></Helmet>
        <div className="wt-bar">
          <h1 className="wt-title">Weekly Tournament</h1>
          <span className="wt-week">Week {weekId || "…"}</span>
        </div>
        <p className="wt-done">You've played all {boards.length} boards this week.</p>
        <div className="wt-actions">
          <button className="wt-btn wt-btn--primary" onClick={openLeaderboard}>View leaderboard</button>
          <Link to="/just-play/practice" className="wt-btn">Back to Just Play</Link>
        </div>
      </div>
    );
  }

  // ── play the current board (continuous flow) ─────────────────────────────────
  const b = boards[idx];
  const last = idx === boards.length - 1;
  return (
    <div className="wt-page wt-play">
      <Helmet><title>Weekly Tournament — Bridge Champions</title><meta name="robots" content="noindex" /></Helmet>
      <div className="wt-playBar">
        <span className="wt-title">Weekly Tournament</span>
        <span className="wt-playMeta">Board {b.boardNo} of {boards.length}</span>
        <button className="wt-link" onClick={openLeaderboard}>Leaderboard</button>
      </div>
      <PlayTable
        key={b.boardNo}
        embedded
        singleDeal
        dealOverride={b}
        persistKey={weekId ? `wt:${weekId}:${b.boardNo}` : null}
        exitLabel={last ? "Finish" : "Next board"}
        onResult={onResult}
        onExit={() => {
          if (last) sendPlayEvent("weekly_tournament_finished");
          nextBoard();
        }}
      />
      {view === "leaderboard" && <div className="wt-lbOverlay">{renderLeaderboard()}</div>}
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

import React, { useState, useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PlayTable from "../PlayTable/PlayTable";
import SolutionPlayer, { simulateLowestLine } from "./SolutionPlayer";
import SolutionEditor from "./SolutionEditor";
import { loadSolution } from "./solutionStore";
import "./ProblemHands.css";

const STRAIN_SYM = { S: "♠", H: "♥", D: "♦", C: "♣", N: "NT" };
const STRAIN_CLASS = { S: "ph-black", H: "ph-red", D: "ph-red", C: "ph-club", N: "" };
const SUIT_SYM = { S: "♠", H: "♥", D: "♦", C: "♣" };
const SUIT_CLASS = { S: "ph-black", H: "ph-red", D: "ph-red", C: "ph-club" };

const RANK_ORDER = "AKQJT98765432";
const SUIT_DISPLAY_ORDER = ["S", "H", "C", "D"];

function HandBlock({ seat, hand }) {
  const bySuit = {};
  for (const c of hand) {
    if (!bySuit[c.suit]) bySuit[c.suit] = [];
    bySuit[c.suit].push(c);
  }
  return (
    <div className="ph-handBlock">
      <div className="ph-handSeat">{seat}</div>
      {SUIT_DISPLAY_ORDER.map((s) => {
        const cards = (bySuit[s] || []).slice().sort(
          (a, b) => RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank)
        );
        return (
          <div key={s} className="ph-handSuitRow">
            <span className={`ph-suitSym ${SUIT_CLASS[s]}`}>{SUIT_SYM[s]}</span>
            <span className="ph-handRanks">
              {cards.length ? cards.map((c) => (c.rank === "T" ? "10" : c.rank)).join("") : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HandDiagram({ hands }) {
  return (
    <div className="ph-diagram">
      <div className="ph-diagRow ph-diagRow--top">
        <HandBlock seat="N" hand={hands.N} />
      </div>
      <div className="ph-diagRow ph-diagRow--mid">
        <HandBlock seat="W" hand={hands.W} />
        <div className="ph-diagVoid" />
        <HandBlock seat="E" hand={hands.E} />
      </div>
      <div className="ph-diagRow ph-diagRow--bot">
        <HandBlock seat="S" hand={hands.S} />
      </div>
    </div>
  );
}

function callLabel(call) {
  if (!call) return null;
  if (call.kind === "pass") return <span className="ph-pass">P</span>;
  if (call.kind === "double") return <span className="ph-dbl">X</span>;
  if (call.kind === "redouble") return <span className="ph-rdbl">XX</span>;
  return (
    <span>
      {call.level}
      <span className={STRAIN_CLASS[call.strain]}>{STRAIN_SYM[call.strain]}</span>
    </span>
  );
}

function AuctionGrid({ auction, dealer }) {
  const COLS = ["W", "N", "E", "S"];
  const dealerIdx = COLS.indexOf(dealer);
  const rows = [];
  let row = [];
  for (let i = 0; i < dealerIdx; i++) row.push(null);
  for (const entry of auction) {
    row.push(entry);
    if (row.length === 4) {
      rows.push(row);
      row = [];
    }
  }
  if (row.length) {
    while (row.length < 4) row.push(null);
    rows.push(row);
  }
  return (
    <table className="ph-auction">
      <thead>
        <tr>
          {COLS.map((c) => <th key={c}>{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((entry, j) => (
              <td key={j}>{entry ? callLabel(entry.call) : ""}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProblemHandPlay({ problem, uid, subscriptionActive, isAdmin, authReady }) {
  const [phase, setPhase] = useState("playing");

  const handleExit = useCallback(() => setPhase("solution"), []);
  const handlePlayAgain = useCallback(() => setPhase("playing"), []);

  // Recorded solution walkthrough (Firestore). Null until loaded / if none.
  const [solution, setSolution] = useState(null);
  useEffect(() => {
    let alive = true;
    loadSolution(problem.id).then((s) => alive && setSolution(s));
    return () => {
      alive = false;
    };
  }, [problem.id]);
  const finishRecording = useCallback(() => {
    loadSolution(problem.id).then(setSolution);
    setPhase("solution");
  }, [problem.id]);

  const isLocalhost =
    typeof window !== "undefined" &&
    /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);
  const canView = isLocalhost || isAdmin || !!subscriptionActive;

  if (!authReady) {
    return (
      <div className="ph-page">
        <p>Checking access…</p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="ph-page ph-gate">
        <h1>Problem Hands is for members</h1>
        <Link
          to="/membership?redirectTo=/just-play/problem-hands"
          className="ph-btn ph-btn--primary"
        >
          View membership
        </Link>
      </div>
    );
  }

  const { contract, lead, deal } = problem;

  if (!contract || !lead) {
    return (
      <div className="ph-page">
        <div className="ph-backBar">
          <Link to="/just-play/problem-hands" className="ph-back">← Problem Hands</Link>
        </div>
        <h1 className="ph-title">{problem.title}</h1>
        <p style={{ color: "#888", fontSize: 17 }}>Hand not yet fully configured.</p>
      </div>
    );
  }

  if (phase === "intro") {
    const rankDisplay = lead.card.rank === "T" ? "10" : lead.card.rank;
    return (
      <div className="ph-page">
        <div className="ph-backBar">
          <Link to="/just-play/problem-hands" className="ph-back">
            ← Problem Hands
          </Link>
        </div>
        <h1 className="ph-title">{problem.title}</h1>

        <div className="ph-contractBar">
          <span>
            Contract:{" "}
            <strong>
              {contract.level}
              <span className={STRAIN_CLASS[contract.strain]}>
                {STRAIN_SYM[contract.strain]}
              </span>
            </strong>{" "}
            by South
          </span>
          <span className="ph-sep">·</span>
          <span>
            Lead:{" "}
            <strong>
              <span className={SUIT_CLASS[lead.card.suit]}>
                {rankDisplay}
                {SUIT_SYM[lead.card.suit]}
              </span>
            </strong>{" "}
            by West
          </span>
        </div>

        <HandDiagram hands={deal.hands} />

        <div className="ph-intro">
          {problem.intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <AuctionGrid auction={problem.auction} dealer={deal.dealer} />

        <button
          className="ph-btn ph-btn--primary ph-startBtn"
          onClick={() => setPhase("playing")}
        >
          Start Playing
        </button>
      </div>
    );
  }

  if (phase === "playing") {
    return (
      <div className="ph-page ph-playPage">
        <PlayTable
          embedded
          singleDeal
          problemSetup={{
            hands: problem.deal.hands,
            dealer: problem.deal.dealer,
            vul: problem.deal.vul,
            auction: problem.auction,
            contract: problem.contract,
            lead: problem.lead,
          }}
          exitLabel="View solution"
          onExit={handleExit}
        />
        {/* Explanation + auction stay on the play screen, in a bordered card so
            they're readable and not jammed against the edges. */}
        <div className="ph-playInfo">
          <h3 className="ph-playInfoTitle">{problem.title} Intro</h3>
          <div className="ph-intro">
            {problem.intro.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <AuctionGrid auction={problem.auction} dealer={deal.dealer} />
          {(isLocalhost || isAdmin) && (
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <button className="ph-btn" onClick={() => setPhase("record")}>
                ✎ Record / edit solution line (admin)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "record") {
    return (
      <div className="ph-page ph-playPage">
        <div className="ph-backBar">
          <Link to="/just-play/problem-hands" className="ph-back">
            ← Problem Hands
          </Link>
        </div>
        <h1 className="ph-title">{problem.title} — Record solution (admin)</h1>
        <SolutionEditor problem={problem} onDone={finishRecording} />
      </div>
    );
  }

  return (
    <div className="ph-page">
      <div className="ph-backBar">
        <Link to="/just-play/problem-hands" className="ph-back">
          ← Problem Hands
        </Link>
      </div>
      <h1 className="ph-title">{problem.title} — Solution</h1>
      <div className="ph-solution">
        <p>{problem.solution}</p>
      </div>
      <h3 className="ph-playInfoTitle">Watch the line</h3>
      <SolutionPlayer
        problem={problem}
        play={
          solution && solution.play && solution.play.length
            ? solution.play
            : simulateLowestLine(deal.hands, contract, lead)
        }
        messages={
          solution && solution.play && solution.play.length
            ? solution.messages
            : { 0: "(Demo line — record the real line + messages with the admin button below.)" }
        }
      />
      {(isLocalhost || isAdmin) && (
        <div style={{ textAlign: "center", margin: "14px 0" }}>
          <button className="ph-btn" onClick={() => setPhase("record")}>
            ✎ Record / edit solution line (admin)
          </button>
        </div>
      )}
      <div className="ph-solutionActions">
        <button className="ph-btn" onClick={handlePlayAgain}>
          Play again
        </button>
        <Link to="/just-play/problem-hands" className="ph-btn ph-btn--primary">
          Back to list
        </Link>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth?.uid,
  subscriptionActive: state.auth?.subscriptionActive === true,
  isAdmin: state.auth?.a === true,
  authReady: state.auth?.authReady === true,
});

export default connect(mapStateToProps)(ProblemHandPlay);

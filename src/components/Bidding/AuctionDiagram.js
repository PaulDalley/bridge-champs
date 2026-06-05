import React from "react";
import "./AuctionDiagram.css";

/**
 * Display-only bridge auction diagram (board-style grid).
 *
 * Renders a West/North/East/South header and lays the calls out in the grid,
 * starting under the dealer's column. Calls are space-separated, e.g.
 *   <AuctionDiagram bidding="1♣ P 1♠ P 2♥" />
 * Supported tokens: bids like 1♣ 2♥ 2NT, P (pass), X, XX, and ? (seat to act).
 */

const SEATS = ["West", "North", "East", "South"];

function renderCall(call) {
  if (call == null || call === "") {
    return <span className="auctionDiagram-call auctionDiagram-call--empty" aria-hidden="true" />;
  }
  const c = String(call).trim();
  if (c === "P" || c.toLowerCase() === "pass") {
    return <span className="auctionDiagram-call auctionDiagram-call--pass">Pass</span>;
  }
  if (c === "?") {
    return <span className="auctionDiagram-call auctionDiagram-call--ask">?</span>;
  }
  if (c === "X" || c === "XX") {
    return <span className="auctionDiagram-call">{c}</span>;
  }
  const m = c.match(/^(\d)(NT|[♣♦♥♠])$/);
  if (m) {
    const level = m[1];
    const strain = m[2];
    if (strain === "NT") {
      return (
        <span className="auctionDiagram-call">
          {level}
          <span className="auctionDiagram-nt">NT</span>
        </span>
      );
    }
    const suitClass =
      strain === "♥" || strain === "♦"
        ? "auctionDiagram-suit--red"
        : strain === "♣"
        ? "auctionDiagram-suit--club"
        : "auctionDiagram-suit--black";
    return (
      <span className="auctionDiagram-call">
        {level}
        <span className={`auctionDiagram-suit ${suitClass}`}>{strain}</span>
      </span>
    );
  }
  return <span className="auctionDiagram-call">{c}</span>;
}

function AuctionDiagram({ bidding, dealer = "West", caption }) {
  const tokens = String(bidding || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const dealerIdx = Math.max(0, SEATS.indexOf(dealer));
  const cells = [...Array(dealerIdx).fill(null), ...tokens];
  while (cells.length % 4 !== 0) cells.push(null);

  const rows = [];
  for (let i = 0; i < cells.length; i += 4) {
    rows.push(cells.slice(i, i + 4));
  }

  return (
    <div className="auctionDiagram" role="table" aria-label={caption || "Bridge auction"}>
      <div className="auctionDiagram-row auctionDiagram-row--head" role="row">
        {SEATS.map((seat) => (
          <div key={seat} className="auctionDiagram-cell auctionDiagram-cell--head" role="columnheader">
            {seat}
          </div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} className="auctionDiagram-row" role="row">
          {row.map((call, ci) => (
            <div key={ci} className="auctionDiagram-cell" role="cell">
              {renderCall(call)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default AuctionDiagram;

/**
 * Two-step bidding box: a row of Pass + levels 1–7 (only biddable levels enabled).
 * Tapping a level reveals the strain options ♣ ♦ ♥ ♠ NT; tapping a strain bids it.
 * Hovering (or focusing) a bid reports its meaning up via onHover, shown in the
 * shared bubble beside the auction. All explanations come from BEN — no bridge
 * prose authored here.
 */
import React, { useState } from "react";
import { STRAINS, STRAIN_LABEL, isLegalCall } from "./auctionEngine";
import "./PlayTable.css";

const LEVELS = [1, 2, 3, 4, 5, 6, 7];

function strainColorClass(s) {
  if (s === "H" || s === "D") return "pt-bid--red";
  if (s === "C") return "pt-bid--club";
  if (s === "N") return "pt-bid--nt";
  return "pt-bid--black";
}

function BiddingBox({ auction, seat, onCall, disabled, meanings = {}, onHover = () => {} }) {
  const [level, setLevel] = useState(null);

  const legal = (call) => !disabled && isLegalCall(call, seat, auction);
  const levelAvailable = (L) => STRAINS.some((s) => legal({ kind: "bid", level: L, strain: s }));

  const choose = (call) => {
    onCall(call);
    setLevel(null);
    onHover(null);
  };

  const passCall = { kind: "pass" };
  const dblCall = { kind: "double" };
  const rdblCall = { kind: "redouble" };
  const showDoubles = legal(dblCall) || legal(rdblCall);

  // Report the hovered bid's label + meaning up to the shared bubble.
  const over = (label, info) => () => onHover(label, info || null);
  const out = () => onHover(null);

  return (
    <div className="pt-bidbox" aria-label="Bidding box">
      <div className="pt-bidRow">
        <button
          type="button"
          className="pt-bidBtn pt-bidBtn--pass"
          disabled={!legal(passCall)}
          onClick={() => choose(passCall)}
          onMouseEnter={over("Pass", meanings.P)}
          onMouseLeave={out}
          onFocus={over("Pass", meanings.P)}
          onBlur={out}
        >
          Pass
        </button>
        {LEVELS.map((L) => (
          <button
            type="button"
            key={L}
            className={`pt-bidBtn pt-levelBtn ${level === L ? "pt-bidBtn--active" : ""}`}
            disabled={!levelAvailable(L)}
            onClick={() => setLevel((cur) => (cur === L ? null : L))}
            aria-expanded={level === L}
          >
            {L}
          </button>
        ))}
      </div>

      {level && (
        <div className="pt-bidRow pt-bidRow--strains">
          {STRAINS.map((s) => {
            const call = { kind: "bid", level, strain: s };
            const token = `${level}${s}`;
            const label = `${level}${STRAIN_LABEL[s]}`;
            return (
              <button
                type="button"
                key={s}
                className={`pt-bidBtn pt-strainBtn ${strainColorClass(s)}`}
                disabled={!legal(call)}
                onClick={() => choose(call)}
                onMouseEnter={over(label, meanings[token])}
                onMouseLeave={out}
                onFocus={over(label, meanings[token])}
                onBlur={out}
                aria-label={`${level} ${s === "N" ? "no trump" : STRAIN_LABEL[s]}`}
              >
                {STRAIN_LABEL[s]}
              </button>
            );
          })}
        </div>
      )}

      {showDoubles && (
        <div className="pt-bidRow pt-bidRow--calls">
          {legal(dblCall) && (
            <button
              type="button"
              className="pt-bidBtn pt-bidBtn--dbl"
              onClick={() => choose(dblCall)}
              onMouseEnter={over("X", meanings.X)}
              onMouseLeave={out}
              onFocus={over("X", meanings.X)}
              onBlur={out}
            >
              X
            </button>
          )}
          {legal(rdblCall) && (
            <button
              type="button"
              className="pt-bidBtn pt-bidBtn--rdbl"
              onClick={() => choose(rdblCall)}
              onMouseEnter={over("XX", meanings.XX || meanings.R)}
              onMouseLeave={out}
              onFocus={over("XX", meanings.XX || meanings.R)}
              onBlur={out}
            >
              XX
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default BiddingBox;

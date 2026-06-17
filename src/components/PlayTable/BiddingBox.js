/**
 * Two-step bidding box: a row of Pass + levels 1–7 (only biddable levels enabled).
 * Tapping a level reveals the strain options ♣ ♦ ♥ ♠ NT; tapping a strain bids it.
 * Hovering (or focusing) a bid shows BEN's meaning for it in a bubble to the right.
 * All explanations come from BEN — no bridge prose authored here.
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

function suitSpanClass(ch) {
  if (ch === "♥" || ch === "♦") return "pt-suit--red";
  if (ch === "♣") return "pt-suit--club";
  if (ch === "♠") return "pt-suit--black";
  return null;
}

/** Tidy BEN's meaning string: BBA suit codes -> symbols, separators readable. */
function cleanMeaning(m) {
  return String(m || "")
    .replace(/!C/g, "♣")
    .replace(/!D/g, "♦")
    .replace(/!H/g, "♥")
    .replace(/!S/g, "♠")
    .replace(/\s*--\s*/g, " — ")
    .replace(/—\s*;\s*/g, "— ")
    .replace(/\s*;\s*/g, " · ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Render text with suit symbols coloured. */
function MeaningText({ text }) {
  const parts = String(text).split(/([♣♦♥♠])/);
  return (
    <>
      {parts.map((p, i) => {
        const cls = suitSpanClass(p);
        return cls ? (
          <span key={i} className={cls}>
            {p}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        );
      })}
    </>
  );
}

function BidMeaning({ label, info }) {
  if (!label) {
    return <div className="pt-bidMeaning pt-bidMeaning--idle">Hover a bid to see what it means.</div>;
  }
  return (
    <div className="pt-bidMeaning">
      <div className="pt-bidMeaningHead">
        <MeaningText text={label} />
        {info && info.alert && (
          <span className="pt-alertDot" title="Alertable">
            !
          </span>
        )}
      </div>
      <div className="pt-bidMeaningBody">
        {info && info.meaning ? <MeaningText text={cleanMeaning(info.meaning)} /> : <span className="pt-bidMeaningNone">No description available.</span>}
      </div>
    </div>
  );
}

function BiddingBox({ auction, seat, onCall, disabled, meanings = {} }) {
  const [level, setLevel] = useState(null);
  const [hover, setHover] = useState(null); // { token, label }

  const legal = (call) => !disabled && isLegalCall(call, seat, auction);
  const levelAvailable = (L) => STRAINS.some((s) => legal({ kind: "bid", level: L, strain: s }));

  const choose = (call) => {
    onCall(call);
    setLevel(null);
    setHover(null);
  };

  const passCall = { kind: "pass" };
  const dblCall = { kind: "double" };
  const rdblCall = { kind: "redouble" };
  const showDoubles = legal(dblCall) || legal(rdblCall);

  const hoverOn = (token, label) => () => setHover({ token, label });
  const hoverOff = () => setHover(null);

  // Resolve the meaning for the hovered bid (redouble may be keyed "R" or "XX").
  const hovInfo = hover ? meanings[hover.token] || (hover.token === "R" ? meanings.XX : null) : null;

  return (
    <div className="pt-bidWrap">
      <div className="pt-bidbox" aria-label="Bidding box">
        <div className="pt-bidRow">
          <button
            type="button"
            className="pt-bidBtn pt-bidBtn--pass"
            disabled={!legal(passCall)}
            onClick={() => choose(passCall)}
            onMouseEnter={hoverOn("P", "Pass")}
            onMouseLeave={hoverOff}
            onFocus={hoverOn("P", "Pass")}
            onBlur={hoverOff}
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
                  onMouseEnter={hoverOn(token, label)}
                  onMouseLeave={hoverOff}
                  onFocus={hoverOn(token, label)}
                  onBlur={hoverOff}
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
                onMouseEnter={hoverOn("X", "Double")}
                onMouseLeave={hoverOff}
                onFocus={hoverOn("X", "Double")}
                onBlur={hoverOff}
              >
                X
              </button>
            )}
            {legal(rdblCall) && (
              <button
                type="button"
                className="pt-bidBtn pt-bidBtn--rdbl"
                onClick={() => choose(rdblCall)}
                onMouseEnter={hoverOn("R", "Redouble")}
                onMouseLeave={hoverOff}
                onFocus={hoverOn("R", "Redouble")}
                onBlur={hoverOff}
              >
                XX
              </button>
            )}
          </div>
        )}
      </div>

      <BidMeaning label={hover ? hover.label : null} info={hovInfo} />
    </div>
  );
}

export default BiddingBox;

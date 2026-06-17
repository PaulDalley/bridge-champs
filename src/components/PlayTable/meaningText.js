/** Shared helpers for rendering BEN's bid meanings (used by the bidding box and
 * the auction display). Suit codes -> coloured symbols; tidy separators. */
import React from "react";

export function cleanMeaning(m) {
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

function suitSpanClass(ch) {
  if (ch === "♥" || ch === "♦") return "pt-suit--red";
  if (ch === "♣") return "pt-suit--club";
  if (ch === "♠") return "pt-suit--black";
  return null;
}

/** Render text with suit symbols coloured. */
export function MeaningText({ text }) {
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

/**
 * The shared explanation bubble. `hover` is { label, info } | null, where info
 * is { meaning, alert }. Shows BEN's meaning for the hovered bid — fed by both
 * the bidding box (your available bids) and the auction grid (bids already made).
 */
export function BidMeaning({ hover }) {
  const label = hover && hover.label;
  const info = hover && hover.info;
  if (!label) {
    return <div className="pt-bidMeaning pt-bidMeaning--idle">Hover any bid to see what it means.</div>;
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
        {info && info.meaning ? (
          <MeaningText text={cleanMeaning(info.meaning)} />
        ) : (
          <span className="pt-bidMeaningNone">No description available.</span>
        )}
      </div>
    </div>
  );
}

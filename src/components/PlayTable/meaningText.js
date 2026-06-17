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

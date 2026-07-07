// Renders a plain string with bridge suit symbols colored to house style
// (♥/♦ red, ♠ ink, ♣ green) — the same classes MakeBoard uses for auctions.
// Used for reel titles/notes so bids written as symbols (e.g. "2♣", "1♦") color
// inline. Non-suit text passes through untouched (newlines preserved for
// white-space: pre-line parents).
const CLS = { '♥': 'red-suit', '♦': 'red-suit', '♠': 'black-suit', '♣': 'bc-club' };

export default function SuitText({ children }) {
  const text = children == null ? '' : String(children);
  return text
    .split(/([♥♦♠♣])/)
    .map((part, i) => (CLS[part] ? <span key={i} className={CLS[part]}>{part}</span> : part));
}

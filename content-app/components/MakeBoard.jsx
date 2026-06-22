// Dependency-free, fully server-rendered bridge board. Replaces the CRA's
// client-only MakeBoard (Hand/Vuln/Bidding + react-materialize) for SEO: the
// hands end up as real HTML in the page, no JS required.
//
// Hand string format (from the stored body): "*S-AKQ*H-J1062*D-Q4*C-7532"
//   -> split("*").slice(1) -> ["S-AKQ", "H-J1062", ...] -> suit = el[0], cards = el.slice(2)

const SUIT = {
  S: { sym: "♠", cls: "black-suit" },
  H: { sym: "♥", cls: "red-suit" },
  D: { sym: "♦", cls: "red-suit" },
  C: { sym: "♣", cls: "black-suit" },
};
const ORDER = ["S", "H", "D", "C"];

function parseHand(str) {
  if (!str) return null;
  const hand = {};
  String(str)
    .split("*")
    .slice(1)
    .forEach((el) => {
      if (el && el.length >= 1) hand[el[0]] = el.slice(2);
    });
  return Object.keys(hand).length ? hand : null;
}

function Hand({ pos, hand }) {
  if (!hand) return null;
  return (
    <div className="bc-hand">
      {pos ? <div className="bc-hand-pos">{pos}</div> : null}
      {ORDER.map((s) => (
        <div key={s} className="bc-hand-row">
          <span className={SUIT[s].cls}>{SUIT[s].sym}</span>{" "}
          <span className="bc-hand-cards">{hand[s] && hand[s].length ? hand[s] : "—"}</span>
        </div>
      ))}
    </div>
  );
}

function Auction({ bidding }) {
  const calls = String(bidding || "").split(/[\s,]+/).filter(Boolean);
  if (!calls.length) return null;
  return (
    <div className="bc-auction" aria-label="Auction">
      <div className="bc-auction-row bc-auction-head">
        <span>W</span><span>N</span><span>E</span><span>S</span>
      </div>
      <div className="bc-auction-calls">
        {calls.map((c, i) => (
          <span key={i} className="bc-call">{c}</span>
        ))}
      </div>
    </div>
  );
}

export default function MakeBoard(props) {
  const { boardType, position } = props;
  const N = parseHand(props.North);
  const S = parseHand(props.South);
  const E = parseHand(props.East);
  const W = parseHand(props.West);
  const bidding = (props.bidding || "").trim();
  const map = { North: N, South: S, East: E, West: W };

  let body;
  if (boardType === "full") {
    body = (
      <div className="bc-board-full">
        <div className="bc-cell bc-n"><Hand pos="North" hand={N} /></div>
        <div className="bc-cell bc-w"><Hand pos="West" hand={W} /></div>
        <div className="bc-cell bc-mid">{bidding ? <Auction bidding={bidding} /> : null}</div>
        <div className="bc-cell bc-e"><Hand pos="East" hand={E} /></div>
        <div className="bc-cell bc-s"><Hand pos="South" hand={S} /></div>
      </div>
    );
  } else if (boardType === "double") {
    const [l, r] = String(position || "").split("/");
    body = (
      <div className="bc-board-row">
        <Hand pos={l} hand={map[l]} />
        <Hand pos={r} hand={map[r]} />
        {bidding ? <Auction bidding={bidding} /> : null}
      </div>
    );
  } else {
    const h = map[position] || N || S || E || W;
    body = (
      <div className="bc-board-row">
        <Hand pos={position} hand={h} />
        {bidding ? <Auction bidding={bidding} /> : null}
      </div>
    );
  }

  return (
    <div className="bc-board" role="img" aria-label="Bridge deal">
      {body}
    </div>
  );
}

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

// Which seats are vulnerable, from a `vul` prop ("NS" | "EW" | "All" | "None").
function vulSeats(vul) {
  const v = String(vul || "").trim().toLowerCase();
  if (v === "all" || v === "both") return ["North", "South", "East", "West"];
  if (v === "ns") return ["North", "South"];
  if (v === "ew") return ["East", "West"];
  return [];
}

function Hand({ pos, hand, vulnerable }) {
  if (!hand) return null;
  return (
    <div className="bc-hand">
      {pos ? <div className="bc-hand-pos">{pos}{vulnerable ? <span className="bc-hand-vul">Vul</span> : null}</div> : null}
      {ORDER.map((s) => (
        <div key={s} className="bc-hand-row">
          <span className={SUIT[s].cls}>{SUIT[s].sym}</span>{" "}
          <span className="bc-hand-cards">{hand[s] && hand[s].length ? hand[s] : "—"}</span>
        </div>
      ))}
    </div>
  );
}

// Parse one call token (e.g. "1♠", "3N", "X", "XX", "P", "*2♣", "_").
function parseCall(raw) {
  if (!raw || raw === "_") return { empty: true };
  let art = false;
  let s = raw;
  if (s[0] === "*") { art = true; s = s.slice(1); } // artificial-bid marker
  const upper = s.toUpperCase();
  if (upper === "P" || upper === "PASS") return { kind: "pass", art };
  if (upper === "X" || upper === "DBL") return { kind: "call", text: "X", art };
  if (upper === "XX" || upper === "RDBL") return { kind: "call", text: "XX", art };
  const number = s[0];
  let suit = s.slice(1);
  if (suit && suit[0].toUpperCase() === "N") return { kind: "nt", number, art };
  return { kind: "suit", number, suit, art };
}

const SUIT_CLASS = { "♥": "red-suit", "♦": "red-suit", "♣": "bc-club", "♠": "black-suit" };

function Call({ raw }) {
  const c = parseCall(raw);
  if (c.empty) return <span className="bc-call bc-call--empty" aria-hidden="true" />;
  let inner;
  if (c.kind === "pass") inner = <span className="bc-call-pass">Pass</span>;
  else if (c.kind === "call") inner = <span className="bc-call-dbl">{c.text}</span>;
  else if (c.kind === "nt") inner = <>{c.number}<span className="bc-call-nt">NT</span></>;
  else inner = <>{c.number}<span className={SUIT_CLASS[c.suit] || "black-suit"}>{c.suit}</span></>;
  return <span className={`bc-call${c.art ? " bc-call--art" : ""}`}>{inner}</span>;
}

function Auction({ bidding }) {
  const calls = String(bidding || "").split("/").map((s) => s.trim()).filter((s) => s !== "");
  if (!calls.length) return null;
  return (
    <div className="bc-auction" aria-label="Auction">
      <div className="bc-auction-grid">
        <span className="bc-auction-h">W</span>
        <span className="bc-auction-h">N</span>
        <span className="bc-auction-h">E</span>
        <span className="bc-auction-h">S</span>
        {calls.map((c, i) => (
          <Call key={i} raw={c} />
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
  const vSet = new Set(vulSeats(props.vul));

  let body;
  if (boardType === "full") {
    body = (
      <div className="bc-board-full">
        <div className="bc-cell bc-n"><Hand pos="North" hand={N} vulnerable={vSet.has("North")} /></div>
        <div className="bc-cell bc-w"><Hand pos="West" hand={W} vulnerable={vSet.has("West")} /></div>
        <div className="bc-cell bc-mid">{bidding ? <Auction bidding={bidding} /> : null}</div>
        <div className="bc-cell bc-e"><Hand pos="East" hand={E} vulnerable={vSet.has("East")} /></div>
        <div className="bc-cell bc-s"><Hand pos="South" hand={S} vulnerable={vSet.has("South")} /></div>
      </div>
    );
  } else if (boardType === "double") {
    const [l, r] = String(position || "").split("/");
    body = (
      <div className="bc-board-row">
        <Hand pos={l} hand={map[l]} vulnerable={vSet.has(l)} />
        <Hand pos={r} hand={map[r]} vulnerable={vSet.has(r)} />
        {bidding ? <Auction bidding={bidding} /> : null}
      </div>
    );
  } else {
    const h = map[position] || N || S || E || W;
    body = (
      <div className="bc-board-row">
        <Hand pos={position} hand={h} vulnerable={vSet.has(position)} />
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

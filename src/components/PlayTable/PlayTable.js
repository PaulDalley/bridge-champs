/**
 * Branded bridge play table powered by the BEN engine (with an offline mock
 * fallback). The human sits South; BEN plays the other three seats for both the
 * auction and the card play. Deal → auction → play → score.
 *
 * This component owns ALL game state (BEN is a stateless decision service):
 * dealing, turn order, legal plays, trick-winner resolution, dummy reveal and
 * scoring all live here and in the pure modules in this folder.
 *
 * No bridge teaching prose lives here — only structural labels and notation.
 */
import React, { useReducer, useEffect, useRef, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  dealHands,
  legalPlays,
  ledSuitOf,
  trickWinner,
  nextClockwise,
  partnerCompass,
  displayRank,
  suitSymbol,
  suitColorClass,
  sameCard,
  SEAT_NAME,
  SEATS,
} from "./bridgeCore";
import {
  isAuctionComplete,
  isPassout,
  isLegalCall,
  contractFromAuction,
  openingLeader,
  contractLabel,
  tricksNeeded,
  scoreContract,
  STRAIN_LABEL,
} from "./auctionEngine";
import { getBid, getLead, getPlay, getClaim, getBids, benMode } from "./benClient";
import BiddingBox from "./BiddingBox";
import { BidMeaning } from "./meaningText";
import { sendPlayEvent } from "../../utils/analytics";
import "./PlayTable.css";

const HUMAN_SEAT = "S";
const BOT_PACING_MS = 600; // small delay so bot card-plays are followable
const BID_PACING_MS = 120; // bids are slower to compute, so barely pause between them
const FORCED_PLAY_MS = 350; // forced (only-legal) card: quick visible play, no engine call
// The engine scales to zero when idle to save cost, so the FIRST call after a quiet
// spell has to cold-start the container (can be ~10-30s). If a single engine call is
// still pending after this long, show a friendly "waking up" note so the wait reads as
// expected rather than broken. Normal warm calls finish well under this.
const WARMING_HINT_MS = 4000;
const WARMING_HINT_TEXT = "Waking up the engine — the first hand can take up to 30 seconds. It's quick after that.";
const TRICK_ACK_MS = 1300;
const SUIT_DISPLAY_ORDER = ["S", "H", "C", "D"]; // ♠♥♣♦ — alternating colours (no trump / auction)

// Hand layout per contract: the trump suit goes on the left, then the remaining
// suits so the colours alternate (the two reds never sit next to each other).
const SUIT_ORDER_BY_TRUMP = {
  S: ["S", "H", "C", "D"],
  H: ["H", "S", "D", "C"],
  D: ["D", "S", "H", "C"],
  C: ["C", "H", "S", "D"],
  N: ["S", "H", "C", "D"],
};

/** Suit display order for the current contract (trump first), else the default. */
function suitOrderForContract(contract) {
  return (contract && SUIT_ORDER_BY_TRUMP[contract.strain]) || SUIT_DISPLAY_ORDER;
}

/** Re-sort a hand by a suit order; a stable sort keeps ranks high→low within a suit. */
function orderHand(hand, order) {
  return [...hand].sort((a, b) => order.indexOf(a.suit) - order.indexOf(b.suit));
}

// Vulnerability rotates each deal: none → all → N-S → E-W.
const VUL_CYCLE = ["", "Both", "NS", "EW"];

/** Short vulnerability tag for the toolbar ("" = none vulnerable). */
function vulShort(vul) {
  if (vul === "Both") return "All";
  if (vul === "NS") return "NS";
  if (vul === "EW") return "EW";
  return "NV";
}

function strainColorClass(strain) {
  if (strain === "H" || strain === "D") return "pt-suit--red";
  if (strain === "C") return "pt-suit--club";
  if (strain === "N") return "pt-suit--nt";
  return "pt-suit--black";
}

/** A call -> the token BEN's /bids map is keyed by ("P","X","XX","1S",...). */
function callToken(call) {
  if (!call) return "";
  if (call.kind === "pass") return "P";
  if (call.kind === "double") return "X";
  if (call.kind === "redouble") return "XX";
  return `${call.level}${call.strain}`;
}

/** Look up BEN's meaning for a call in a /bids meanings map. */
function meaningForCall(call, meanings) {
  const t = callToken(call);
  return meanings[t] || (t === "XX" ? meanings.R : null) || null;
}

/** Short display label for a made call, with the strain as a coloured symbol. */
function labelForCall(call) {
  if (!call) return "";
  if (call.kind === "pass") return "Pass";
  if (call.kind === "double") return "X";
  if (call.kind === "redouble") return "XX";
  return `${call.level}${STRAIN_LABEL[call.strain]}`;
}

/** A single auction call, with the suit symbol coloured. */
function BidLabel({ call }) {
  if (!call) return null;
  if (call.kind === "pass") return <span className="pt-acall pt-acall--pass">Pass</span>;
  if (call.kind === "double") return <span className="pt-acall pt-suit--red">X</span>;
  if (call.kind === "redouble") return <span className="pt-acall pt-suit--nt">XX</span>;
  return (
    <span className="pt-acall">
      <span className="pt-acallLevel">{call.level}</span>
      <span className={strainColorClass(call.strain)}>{STRAIN_LABEL[call.strain]}</span>
    </span>
  );
}

function nextBidderSeat(state) {
  if (state.phase !== "auction") return null;
  if (!state.auction.length) return state.dealer;
  return nextClockwise(state.auction[state.auction.length - 1].seat);
}

function seatToPlay(state) {
  if (state.phase !== "play") return null;
  if (!state.trickPlays.length) return state.trickLeader;
  return nextClockwise(state.trickPlays[state.trickPlays.length - 1].seat);
}

/**
 * Synthesize a minimal legal auction that yields `contract`: everyone passes up to
 * the declarer, who bids the final contract, then three passes end it. Problem-hand
 * setups often omit the auction, but BEN derives the contract (declarer + trump) from
 * the auction it's sent — an empty `ctx` makes the engine reject every /play with a
 * 400, silently dropping the table to the offline mock (illogical play). This gives
 * BEN a real auction to read.
 */
function auctionForContract(dealer, contract) {
  const calls = [];
  let seat = dealer;
  let guard = 0;
  while (seat !== contract.declarer && guard++ < 4) {
    calls.push({ seat, call: { kind: "pass" } });
    seat = nextClockwise(seat);
  }
  calls.push({ seat, call: { kind: "bid", level: contract.level, strain: contract.strain } });
  seat = nextClockwise(seat);
  for (let i = 0; i < 3; i += 1) {
    calls.push({ seat, call: { kind: "pass" } });
    seat = nextClockwise(seat);
  }
  return calls;
}

/** Set up play state from a fully-specified problem hand (skip dealing/auction). */
function freshProblemDeal(setup) {
  const leadCard = setup.lead.card;
  const leadSeat = setup.lead.seat;
  const contract = setup.contract;
  const declarer = contract.declarer;
  const dummy = partnerCompass(declarer);
  const dealer = setup.dealer || "E";

  const originalHands = {
    N: [...setup.hands.N],
    E: [...setup.hands.E],
    S: [...setup.hands.S],
    W: [...setup.hands.W],
  };

  const hands = {
    N: [...setup.hands.N],
    E: [...setup.hands.E],
    S: [...setup.hands.S],
    W: [...setup.hands.W],
  };
  hands[leadSeat] = hands[leadSeat].filter(
    (c) => !(c.suit === leadCard.suit && c.rank === leadCard.rank)
  );

  return {
    phase: "play",
    seed: null,
    dealer,
    dealCount: 1,
    vul: setup.vul || "",
    hands,
    originalHands,
    auction: setup.auction && setup.auction.length ? setup.auction : auctionForContract(dealer, contract),
    contract,
    declarer,
    dummy,
    trickLeader: leadSeat,
    trickPlays: [{ seat: leadSeat, card: leadCard }],
    playedCards: [{ seat: leadSeat, card: leadCard }],
    dummyRevealed: true,
    pendingTrickWinner: undefined,
    lastTrick: null,
    nsTricks: 0,
    ewTricks: 0,
    result: null,
  };
}

function freshDeal(seed, dealer, dealCount = 1, vulOverride = null) {
  return {
    phase: "auction",
    seed,
    dealer,
    dealCount,
    vul: vulOverride != null ? vulOverride : VUL_CYCLE[(dealCount - 1) % VUL_CYCLE.length], // rotates none → all → NS → EW
    hands: dealHands(seed),
    auction: [],
    contract: null,
    declarer: null,
    dummy: null,
    trickPlays: [],
    trickLeader: null,
    playedCards: [],
    nsTricks: 0,
    ewTricks: 0,
    dummyRevealed: false,
    pendingTrickWinner: undefined,
    lastTrick: null, // most recently completed trick: { plays:[{seat,card}], winner }
    result: null,
  };
}

function startPlay(state, contract) {
  const leader = openingLeader(contract.declarer);
  return {
    ...state,
    phase: "play",
    contract,
    declarer: contract.declarer,
    dummy: partnerCompass(contract.declarer),
    // BEN's /play needs the FULL original 13-card hands; keep an immutable copy.
    originalHands: {
      N: [...state.hands.N],
      E: [...state.hands.E],
      S: [...state.hands.S],
      W: [...state.hands.W],
    },
    trickLeader: leader,
    trickPlays: [],
    playedCards: [],
    dummyRevealed: false,
  };
}

function finishDeal(state) {
  const declarerNS = state.declarer === "N" || state.declarer === "S";
  const declarerTricks = declarerNS ? state.nsTricks : state.ewTricks;
  const vulBool =
    state.vul === "Both" ||
    (declarerNS && state.vul === "NS") ||
    (!declarerNS && state.vul === "EW");
  const declarerScore = scoreContract(state.contract, declarerTricks, vulBool);
  // The running score is always from the human's (North/South) side: when the
  // opponents declare, flip the sign (their −50 is our +50, their +420 is our −420).
  const score = declarerNS ? declarerScore : -declarerScore;
  return {
    ...state,
    phase: "done",
    result: { declarerTricks, need: tricksNeeded(state.contract), score },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "NEW_DEAL":
      return freshDeal(action.seed, nextClockwise(state.dealer), (state.dealCount || 1) + 1);

    case "ADD_CALL": {
      if (state.phase !== "auction") return state;
      if (isAuctionComplete(state.auction)) return state;
      if (action.seat !== nextBidderSeat(state)) return state;
      const auction = [
        ...state.auction,
        { seat: action.seat, call: action.call, explanation: action.explanation, alert: action.alert },
      ];
      if (!isAuctionComplete(auction)) return { ...state, auction };
      if (isPassout(auction)) return { ...state, auction, phase: "passout" };
      const contract = contractFromAuction(auction);
      if (!contract) return { ...state, auction, phase: "passout" };
      return startPlay({ ...state, auction }, contract);
    }

    case "PLAY_CARD": {
      if (state.phase !== "play") return state;
      const seat = action.seat;
      if (seat !== seatToPlay(state)) return state;
      const hand = state.hands[seat];
      const idx = hand.findIndex((c) => sameCard(c, action.card));
      if (idx === -1) return state;
      const led = ledSuitOf(state.trickPlays);
      const legal = legalPlays(hand, led);
      if (!legal.some((c) => sameCard(c, action.card))) return state;

      const newHand = hand.filter((_, i) => i !== idx);
      const hands = { ...state.hands, [seat]: newHand };
      const trickPlays = [...state.trickPlays, { seat, card: action.card }];
      const playedCards = [...state.playedCards, { seat, card: action.card }];
      const dummyRevealed = state.dummyRevealed || playedCards.length >= 1;

      if (trickPlays.length < 4) {
        return { ...state, hands, trickPlays, playedCards, dummyRevealed };
      }
      const winner = trickWinner(trickPlays, state.contract.strain);
      return {
        ...state,
        hands,
        trickPlays,
        playedCards,
        dummyRevealed,
        pendingTrickWinner: winner,
        phase: "trickAwaitAck",
      };
    }

    case "ACK_TRICK": {
      if (state.phase !== "trickAwaitAck") return state;
      const winner = state.pendingTrickWinner;
      const ns = winner === "N" || winner === "S";
      const allEmpty = SEATS.every((s) => state.hands[s].length === 0);
      const next = {
        ...state,
        trickPlays: [],
        trickLeader: winner,
        nsTricks: state.nsTricks + (ns ? 1 : 0),
        ewTricks: state.ewTricks + (ns ? 0 : 1),
        lastTrick: { plays: state.trickPlays, winner },
        pendingTrickWinner: undefined,
        phase: allEmpty ? "scoring" : "play",
      };
      return allEmpty ? finishDeal(next) : next;
    }

    case "CLAIM_ACCEPTED": {
      if (state.phase !== "play") return state;
      const declarerNS = state.declarer === "N" || state.declarer === "S";
      const declFinal = action.declarerFinalTricks;
      const ns = declarerNS ? declFinal : 13 - declFinal;
      const ew = declarerNS ? 13 - declFinal : declFinal;
      return finishDeal({ ...state, nsTricks: ns, ewTricks: ew, trickPlays: [] });
    }

    default:
      return state;
  }
}

/** True when the human's side (N/S) holds the contract — the human then plays
 * the WHOLE declaring side (declarer + dummy) instead of sitting as a passive
 * dummy. Nothing on the table moves; both N and S are simply shown and playable. */
function isHumanDeclaringSide(state) {
  if (!state.declarer) return false;
  return state.declarer === HUMAN_SEAT || state.declarer === partnerCompass(HUMAN_SEAT);
}

/** Who controls a seat's card right now: the human or a bot. When the human's
 * side declares, the human controls both N and S (plays as declarer). */
function controllerIsHuman(seat, state) {
  if (isHumanDeclaringSide(state)) return seat === state.declarer || seat === state.dummy;
  return seat === HUMAN_SEAT;
}

/** Which hands are shown face-up to the human. */
function handVisible(seat, state) {
  if (seat === HUMAN_SEAT) return true; // your own hand, always
  if (state.dummyRevealed) {
    if (seat === state.dummy) return true; // dummy, after the opening lead
    if (isHumanDeclaringSide(state) && seat === state.declarer) return true; // the declarer hand you control
  }
  return false;
}

// ── card / hand rendering ───────────────────────────────────────────────────

function BigCard({ card, playable, onPlay }) {
  return (
    <button
      type="button"
      className={`pt-bigcard ${suitColorClass(card.suit)} ${playable ? "pt-bigcard--playable" : ""}`}
      disabled={!playable}
      onClick={() => onPlay && onPlay(card)}
      aria-label={`${displayRank(card.rank)} ${suitSymbol(card.suit)}`}
    >
      <span className="pt-bigRank">{displayRank(card.rank)}</span>
      <span className="pt-bigSuit">{suitSymbol(card.suit)}</span>
    </button>
  );
}

/** Full-width row of fixed-size cards (no overlap). Cards keep their size as
 * the hand shrinks — width is locked to 1/13 of the row. Used for South + dummy. */
function HandRow({ seat, state, onPlay }) {
  const hand = orderHand(state.hands[seat], suitOrderForContract(state.contract));
  const toPlay = seatToPlay(state);
  const led = ledSuitOf(state.trickPlays);
  const canControl = state.phase === "play" && toPlay === seat && controllerIsHuman(seat, state);
  const legal = canControl ? legalPlays(hand, led) : [];
  return (
    <div className="pt-handRow" aria-label={`${SEAT_NAME[seat]} hand`}>
      {hand.map((c) => {
        const playable = canControl && legal.some((x) => sameCard(x, c));
        return <BigCard key={`${c.suit}${c.rank}`} card={c} playable={playable} onPlay={(card) => onPlay(seat, card)} />;
      })}
    </div>
  );
}

/** A small face-up card for a side dummy (display only — the bot declarer plays it). */
function SideCard({ card }) {
  return (
    <div className={`pt-sideCard ${suitColorClass(card.suit)}`}>
      <span className="pt-sideRank">{displayRank(card.rank)}</span>
      <span className="pt-sideSuit">{suitSymbol(card.suit)}</span>
    </div>
  );
}

/** A dummy shown on the LEFT (West) or RIGHT (East) edge: suits in rows, stacked. */
function SideHand({ seat, state, side }) {
  const hand = state.hands[seat];
  const order = suitOrderForContract(state.contract);
  const groups = order.map((suit) => ({ suit, cards: hand.filter((c) => c.suit === suit) })).filter(
    (g) => g.cards.length
  );
  return (
    <div className={`pt-sideHand pt-sideHand--${side}`} aria-label={`${SEAT_NAME[seat]} (dummy)`}>
      {groups.map((g) => (
        <div className="pt-sideSuitRow" key={g.suit}>
          {g.cards.map((c) => (
            <SideCard key={`${c.suit}${c.rank}`} card={c} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Contract with the strain symbol coloured by suit (e.g. 2♥, 3NT, 4♠ X). */
function ContractLabel({ contract }) {
  if (!contract) return null;
  const dbl = contract.doubled === 2 ? " XX" : contract.doubled === 1 ? " X" : "";
  return (
    <span className="pt-contract">
      {contract.level}
      <span className={strainColorClass(contract.strain)}>{STRAIN_LABEL[contract.strain]}</span>
      {dbl}
    </span>
  );
}

/** Claim dialog: choose how many MORE tricks to claim (defaults to all the rest).
 * The confirm bar shows the resulting contract outcome for the chosen amount. */
function ClaimModal({ state, busy, message, onConfirm, onCancel }) {
  const declarerNS = state.declarer === "N" || state.declarer === "S";
  const declarerWon = declarerNS ? state.nsTricks : state.ewTricks;
  const maxMore = 13 - state.nsTricks - state.ewTricks;
  const [sel, setSel] = useState(maxMore);
  const need = tricksNeeded(state.contract);
  const finalTricks = declarerWon + sel;
  const outcome =
    finalTricks >= need
      ? finalTricks === need
        ? "Contract made"
        : `Contract made +${finalTricks - need}`
      : `Contract down ${need - finalTricks}`;
  return (
    <div className="pt-modalOverlay" role="dialog" aria-label="Claim">
      <div className="pt-modal">
        <div className="pt-modalTitle">Claim</div>
        <div className="pt-modalBody">
          <div className="pt-modalQ">How many more tricks do you claim?</div>
          <div className="pt-claimNums">
            {Array.from({ length: maxMore + 1 }, (_, i) => i).map((n) => (
              <button
                type="button"
                key={n}
                className={`pt-claimNum ${n === sel ? "pt-claimNum--sel" : ""}`}
                onClick={() => setSel(n)}
                disabled={busy}
              >
                {n}
              </button>
            ))}
          </div>
          {message && <div className="pt-claimMsg">{message}</div>}
          <div className="pt-claimActions">
            <button type="button" className="pt-claimConfirm" disabled={busy} onClick={() => onConfirm(sel)}>
              {busy ? "Checking…" : `Claim — ${outcome}`}
            </button>
            <button type="button" className="pt-claimCancel" disabled={busy} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrickCard({ card }) {
  if (!card) return null;
  return (
    <div className={`pt-trickCard ${suitColorClass(card.suit)}`}>
      <span className="pt-bigRank">{displayRank(card.rank)}</span>
      <span className="pt-bigSuit">{suitSymbol(card.suit)}</span>
    </div>
  );
}

function vulnerableSeats(vul) {
  if (vul === "Both") return new Set(["N", "E", "S", "W"]);
  if (vul === "NS") return new Set(["N", "S"]);
  if (vul === "EW") return new Set(["E", "W"]);
  return new Set();
}

function AuctionPanel({ state, onHover = () => {} }) {
  const order = ["W", "N", "E", "S"]; // column order matches the reference layout
  // Pad so the dealer's column lines up: blanks before the dealer's first call.
  const lead = order.indexOf(state.dealer);
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  state.auction.forEach((e) => cells.push(e)); // whole entry, so each bid carries its meaning
  const vulSeats = vulnerableSeats(state.vul);
  const show = (entry) => () => onHover(labelForCall(entry.call), { meaning: entry.explanation, alert: entry.alert });
  const hide = () => onHover(null);
  return (
    <div className="pt-auction" aria-label="Auction">
      <div className="pt-auctionHead">
        {order.map((s) => (
          <div key={s} className={`pt-auctionCol ${vulSeats.has(s) ? "pt-auctionCol--vul" : ""}`}>
            {SEAT_NAME[s]}
            {s === HUMAN_SEAT && <span className="pt-auctionYou">(you)</span>}
          </div>
        ))}
      </div>
      <div className="pt-auctionGrid">
        {cells.map((entry, i) =>
          entry ? (
            <div
              key={i}
              className="pt-auctionCell pt-auctionCell--bid"
              tabIndex={0}
              onMouseEnter={show(entry)}
              onMouseLeave={hide}
              onFocus={show(entry)}
              onBlur={hide}
            >
              <BidLabel call={entry.call} />
            </div>
          ) : (
            <div key={i} className="pt-auctionCell" />
          )
        )}
      </div>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────────

// Standard hand-diagram suit order (spades, hearts, diamonds, clubs).
const DIAGRAM_SUITS = ["S", "H", "D", "C"];

/** One seat's 13 cards as four suit lines — for the end-of-deal review diagram. */
function HandBlock({ hand, label }) {
  return (
    <div className="pt-dealHand">
      <div className="pt-dealSeat">{label}</div>
      {DIAGRAM_SUITS.map((s) => {
        const ranks = hand.filter((c) => c.suit === s).map((c) => displayRank(c.rank)).join(" ");
        return (
          <div className="pt-dealSuitLine" key={s}>
            <span className={`pt-dealSuit ${suitColorClass(s)}`}>{suitSymbol(s)}</span>
            <span className="pt-dealRanks">{ranks || "—"}</span>
          </div>
        );
      })}
    </div>
  );
}

/** The full original deal in a compass layout (N top, W/E middle, S bottom). */
function DealDiagram({ hands }) {
  return (
    <div className="pt-dealDiagram" aria-label="Full deal">
      <HandBlock hand={hands.N} label="North" />
      <div className="pt-dealMid">
        <HandBlock hand={hands.W} label="West" />
        <HandBlock hand={hands.E} label="East" />
      </div>
      <HandBlock hand={hands.S} label="South" />
    </div>
  );
}

/** Snapshot a finished board (tournament mode) into a result record for persistence. */
function buildBoardRecord(state, passout) {
  return {
    passout,
    contract: passout ? null : state.contract,
    declarer: passout ? null : state.declarer,
    declarerTricks: passout ? 0 : state.result ? state.result.declarerTricks : 0,
    rawScoreNS: passout ? 0 : state.result ? state.result.score : 0,
    auction: state.auction.map((e) => ({ seat: e.seat, call: e.call })),
    play: state.playedCards.map((p) => ({ seat: p.seat, card: p.card })),
  };
}

/**
 * Load a persisted mid-hand snapshot (tournament resume). The reducer state is plain
 * JSON, so we round-trip it directly. Returns null (→ deal fresh) if there's no
 * snapshot, it's unreadable, or it's for a different deal than the one being shown.
 */
function loadSnapshot(key, dealOverride) {
  if (!key || typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.state) return null;
    if (dealOverride && (parsed.seed >>> 0) !== (dealOverride.seed >>> 0)) return null;
    return parsed.state;
  } catch {
    return null;
  }
}

function clearSnapshot(key) {
  if (!key || typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function PlayTable({ embedded = false, preview = false, dealOverride = null, problemSetup = null, singleDeal = false, onResult, onExit, exitLabel = "Continue", persistKey = null } = {}) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    // Tournament resume: if a mid-hand snapshot for this exact board was saved (the
    // player navigated away or reloaded), restore it instead of dealing fresh.
    const restored = loadSnapshot(persistKey, dealOverride);
    if (restored) return restored;
    return problemSetup
      ? freshProblemDeal(problemSetup)
      : dealOverride
        ? freshDeal(dealOverride.seed >>> 0, dealOverride.dealer || "N", 1, dealOverride.vul ?? "")
        : freshDeal(Date.now() >>> 0, "N");
  });
  const [thinking, setThinking] = useState(null);
  const [warming, setWarming] = useState(false); // engine call running long enough to look like a cold start
  const [notice, setNotice] = useState(null);
  const [score, setScore] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [claimMsg, setClaimMsg] = useState(null);
  const [bidMeanings, setBidMeanings] = useState({});
  const [hoverMeaning, setHoverMeaning] = useState(null); // shared bubble: { label, info } | null
  const [showAuction, setShowAuction] = useState(false); // popup: review the auction during play
  const [showLastTrick, setShowLastTrick] = useState(false); // popup: review the previous trick
  // Opponent strength / speed: Faster (skip BEN's simulation, ~10x quicker) vs
  // Stronger (full simulation). The choice persists across deals and sessions.
  const [fast, setFast] = useState(() => {
    try {
      return localStorage.getItem("pt-fast") !== "0";
    } catch {
      return true;
    }
  });
  const fastRef = useRef(fast);
  const busyRef = useRef(null);
  const scoredSeedRef = useRef(null);
  const resultFiredRef = useRef(false); // tournament: report each finished board once

  // Keep the ref current (read inside async bot turns) and remember the choice.
  useEffect(() => {
    fastRef.current = fast;
    try {
      localStorage.setItem("pt-fast", fast ? "1" : "0");
    } catch {
      /* ignore storage failures (private mode, etc.) */
    }
  }, [fast]);

  const newDeal = useCallback(() => {
    busyRef.current = null;
    setNotice(null);
    setHoverMeaning(null);
    setShowAuction(false);
    setShowLastTrick(false);
    dispatch({ type: "NEW_DEAL", seed: Date.now() >>> 0 });
  }, []);

  // Capture BEN's meaning for your own bid (from the box) onto the auction entry,
  // so the made bid explains itself on hover just like the bots' do.
  const onHumanCall = useCallback(
    (call) => {
      const info = meaningForCall(call, bidMeanings);
      dispatch({
        type: "ADD_CALL",
        seat: HUMAN_SEAT,
        call,
        explanation: info ? info.meaning : undefined,
        alert: info ? info.alert : undefined,
      });
    },
    [bidMeanings]
  );

  const onHumanPlay = useCallback((seat, card) => {
    dispatch({ type: "PLAY_CARD", seat, card });
  }, []);

  // Feed the shared explanation bubble from either the box or the auction grid.
  const onHover = useCallback((label, info) => {
    setHoverMeaning(label ? { label, info: info || null } : null);
  }, []);

  // Claim flow: open a dialog to choose how many more tricks; BEN verifies it.
  const openClaim = useCallback(() => {
    setClaimMsg(null);
    setShowClaim(true);
  }, []);
  const closeClaim = useCallback(() => {
    setShowClaim(false);
    setClaimMsg(null);
    busyRef.current = null; // let bot moves resume after cancelling
  }, []);
  const confirmClaim = useCallback(
    async (more) => {
      if (claiming) return;
      const orig = state.originalHands || state.hands;
      const declarerNS = state.declarer === "N" || state.declarer === "S";
      const declarerWon = declarerNS ? state.nsTricks : state.ewTricks;
      const claimTotal = declarerWon + more;
      setClaiming(true);
      setClaimMsg(null);
      const res = await getClaim({
        // BEN wants the number of ADDITIONAL tricks claimed (the rest), not the deal total.
        tricks: more,
        hand: orig[state.declarer],
        dummy: orig[state.dummy],
        seat: state.declarer,
        dealer: state.dealer,
        vul: state.vul,
        auction: state.auction,
        played: state.playedCards.map((p) => p.card),
      });
      setClaiming(false);
      if (res.accepted) {
        setShowClaim(false);
        dispatch({ type: "CLAIM_ACCEPTED", declarerFinalTricks: claimTotal });
      } else {
        setClaimMsg(res.error || res.message || "That claim isn't safe — pick fewer tricks, or cancel and play on.");
      }
    },
    [state, claiming]
  );

  // Drive bot turns (auction + play). The reducer is defensive, so a stale or
  // duplicate dispatch is simply ignored; busyRef just avoids firing twice for
  // the same turn (e.g. StrictMode double-invoke).
  useEffect(() => {
    if (preview) return; // static preview: no engine calls, frozen at the deal
    const sig = `${state.phase}:${state.seed}:${state.auction.length}:${state.playedCards.length}:${state.trickPlays.length}`;
    if (showClaim) return; // freeze play while the claim dialog is open

    if (state.phase === "auction") {
      const seat = nextBidderSeat(state);
      if (!seat || seat === HUMAN_SEAT) return;
      if (busyRef.current === sig) return;
      busyRef.current = sig;
      (async () => {
        setThinking(seat);
        const res = await getBid({
          hand: state.hands[seat],
          seat,
          dealer: state.dealer,
          vul: state.vul,
          auction: state.auction,
          fast: fastRef.current,
        });
        if (res.error) {
          // eslint-disable-next-line no-console
          console.warn("[BEN] bot bid fell back to offline", { seat, error: res.error });
          setNotice(
            /timed out/i.test(res.error) ? "BEN is slow to respond — using offline opponents."
              : /unreachable|network/i.test(res.error) ? "Connection issue — using offline opponents."
              : "BEN couldn't bid this hand — using offline opponents."
          );
        }
        await new Promise((r) => setTimeout(r, BID_PACING_MS));
        setThinking(null);
        // Safety: never let an illegal bot call stall the auction — fall back to Pass.
        const legalBid = isLegalCall(res.call, seat, state.auction);
        const call = legalBid ? res.call : { kind: "pass" };
        dispatch({
          type: "ADD_CALL",
          seat,
          call,
          explanation: legalBid ? res.explanation : undefined,
          alert: legalBid ? res.alert : undefined,
        });
      })();
      return;
    }

    if (state.phase === "play") {
      const seat = seatToPlay(state);
      if (!seat || controllerIsHuman(seat, state)) return;
      if (busyRef.current === sig) return;
      busyRef.current = sig;

      // Forced move (only one legal card): play it instantly — no engine round-trip.
      const led0 = ledSuitOf(state.trickPlays);
      if (state.playedCards.length > 0 && legalPlays(state.hands[seat], led0).length === 1) {
        const only = legalPlays(state.hands[seat], led0)[0];
        setTimeout(() => dispatch({ type: "PLAY_CARD", seat, card: only }), FORCED_PLAY_MS);
        return;
      }

      (async () => {
        setThinking(seat);
        const isOpeningLead = state.playedCards.length === 0;
        const orig = state.originalHands || state.hands; // full 13-card hands for BEN
        let res;
        if (isOpeningLead) {
          res = await getLead({
            hand: orig[seat],
            seat,
            dealer: state.dealer,
            vul: state.vul,
            auction: state.auction,
            fast: fastRef.current,
          });
        } else {
          // BEN must be called AS THE DECLARER for any declaring-side turn (declarer
          // or dummy) — it rejects being called as the dummy seat. Defenders call as
          // themselves. Hands sent are the full originals; BEN derives what's left
          // from `played`. `currentHand` is only for the offline-mock fallback.
          const onDeclaringSide = seat === state.declarer || seat === state.dummy;
          const benSeat = onDeclaringSide ? state.declarer : seat;
          res = await getPlay({
            hand: orig[benSeat],
            currentHand: state.hands[seat],
            dummy: orig[state.dummy],
            seat: benSeat,
            dealer: state.dealer,
            vul: state.vul,
            auction: state.auction,
            played: state.playedCards.map((p) => p.card),
            trickPlays: state.trickPlays,
            strain: state.contract.strain,
            fast: fastRef.current,
          });
        }
        if (res.error) {
          // eslint-disable-next-line no-console
          console.warn("[BEN] bot play fell back to offline", { seat, error: res.error });
          setNotice(
            /timed out/i.test(res.error) ? "BEN is slow to respond — using offline play."
              : /unreachable|network/i.test(res.error) ? "Connection issue — using offline play."
              : "BEN couldn't play this hand — using offline play."
          );
        }
        await new Promise((r) => setTimeout(r, BOT_PACING_MS));
        setThinking(null);
        // Safety: returned card must be legal for the PHYSICAL seat's current hand.
        const led = ledSuitOf(state.trickPlays);
        const legal = legalPlays(state.hands[seat], led);
        const card = legal.some((c) => sameCard(c, res.card)) ? res.card : legal[0];
        dispatch({ type: "PLAY_CARD", seat, card });
      })();
    }
  }, [state, showClaim, preview]);

  // Auto-acknowledge a completed trick after a short pause.
  useEffect(() => {
    if (preview || state.phase !== "trickAwaitAck") return undefined;
    const t = setTimeout(() => dispatch({ type: "ACK_TRICK" }), TRICK_ACK_MS);
    return () => clearTimeout(t);
  }, [state.phase, state.pendingTrickWinner, preview]);

  // Cold-start hint: if an engine call is still pending after WARMING_HINT_MS, show the
  // "waking up" note. Cleared the moment the engine responds (thinking -> null).
  useEffect(() => {
    if (!thinking) { setWarming(false); return undefined; }
    const t = setTimeout(() => setWarming(true), WARMING_HINT_MS);
    return () => clearTimeout(t);
  }, [thinking]);

  // Add each finished deal's score to the running total (once per deal).
  useEffect(() => {
    if (state.phase === "done" && state.result && scoredSeedRef.current !== state.seed) {
      scoredSeedRef.current = state.seed;
      setScore((s) => s + (state.result.score || 0));
      if (!singleDeal && !preview) sendPlayEvent("just_play_hand_complete");
    }
  }, [state.phase, state.seed, state.result, singleDeal, preview]);

  // Tournament single-deal mode: report the finished board's result exactly once.
  useEffect(() => {
    if (!singleDeal || typeof onResult !== "function" || resultFiredRef.current) return;
    if (state.phase === "done" && state.result) {
      resultFiredRef.current = true;
      clearSnapshot(persistKey);
      onResult(buildBoardRecord(state, false));
    } else if (state.phase === "passout") {
      resultFiredRef.current = true;
      clearSnapshot(persistKey);
      onResult(buildBoardRecord(state, true));
    }
  }, [state, singleDeal, onResult, persistKey]);

  // Persist the in-progress board (tournament resume) so navigating away or reloading
  // and coming back restores it instead of resetting. Skip terminal phases — the board
  // is over then and the snapshot is cleared when its result fires (above).
  useEffect(() => {
    if (!persistKey) return;
    if (state.phase === "done" || state.phase === "passout" || state.phase === "scoring") return;
    try {
      localStorage.setItem(persistKey, JSON.stringify({ v: 1, seed: state.seed, state }));
    } catch {
      /* ignore storage failures (quota, private mode) */
    }
  }, [persistKey, state]);

  // Fetch BEN's meanings for the legal bids whenever it's your turn to bid.
  useEffect(() => {
    const isHumanTurn = state.phase === "auction" && nextBidderSeat(state) === HUMAN_SEAT;
    if (preview || !isHumanTurn) {
      setBidMeanings({});
      return undefined;
    }
    let cancelled = false;
    getBids({ auction: state.auction, dealer: state.dealer }).then((m) => {
      if (!cancelled) setBidMeanings(m);
    });
    return () => {
      cancelled = true;
    };
  }, [state.phase, state.auction.length, state.seed, preview]);

  const trickBySeat = { N: null, E: null, S: null, W: null };
  for (const p of state.trickPlays) trickBySeat[p.seat] = p.card;

  const lastBySeat = { N: null, E: null, S: null, W: null };
  if (state.lastTrick) for (const p of state.lastTrick.plays) lastBySeat[p.seat] = p.card;

  const humanToBid = state.phase === "auction" && nextBidderSeat(state) === HUMAN_SEAT;
  const toPlay = seatToPlay(state);
  const statusText = (() => {
    if (state.phase === "auction") {
      const s = nextBidderSeat(state);
      return s === HUMAN_SEAT ? "Your call" : `${SEAT_NAME[s]} to bid…`;
    }
    if (state.phase === "play") {
      return controllerIsHuman(toPlay, state)
        ? toPlay === state.dummy
          ? "Play from dummy"
          : "Your card"
        : `${SEAT_NAME[toPlay]} to play…`;
    }
    if (state.phase === "trickAwaitAck") return `${SEAT_NAME[state.pendingTrickWinner]} wins the trick`;
    if (state.phase === "done" && state.result) {
      const { declarerTricks, need, score } = state.result;
      const made = declarerTricks >= need;
      return `${contractLabel(state.contract)} by ${SEAT_NAME[state.declarer]}: ${declarerTricks} tricks — ${
        made ? "made" : "down " + (need - declarerTricks)
      } (${score >= 0 ? "+" : ""}${score})`;
    }
    return "";
  })();

  const inBidding = state.phase === "auction" || state.phase === "passout";

  return (
    <div className={`pt-app ${embedded ? "pt-app--embedded" : ""}`}>
      {!embedded && (
        <Helmet>
          <title>Just Play — Bridge Champions</title>
          <meta name="robots" content="noindex" />
        </Helmet>
      )}

      {/* toolbar */}
      <div className="pt-toolbar">
        <div className="pt-tbScore">
          <div className="pt-tbScoreLabel">Score</div>
          <div className="pt-tbScoreVal">{score}</div>
        </div>
        <div
          className={`pt-tbBoard ${
            state.vul === "NS" || state.vul === "Both" ? "pt-vul-ns" : ""
          } ${state.vul === "EW" || state.vul === "Both" ? "pt-vul-ew" : ""}`}
          title={`Board ${state.dealCount} · Vul ${vulShort(state.vul)}`}
        >
          <div className="pt-boardNum">{state.dealCount}</div>
        </div>
        <div className="pt-tbContract">
          <div className="pt-tbContractLabel">
            {state.contract ? (
              <button
                type="button"
                className="pt-contractBtn"
                onClick={() => setShowAuction(true)}
                title="Show the auction"
              >
                <ContractLabel contract={state.contract} /> {state.declarer}
              </button>
            ) : inBidding ? (
              "Bidding"
            ) : (
              "—"
            )}
          </div>
          <div
            className={`pt-tbTricks ${state.lastTrick ? "pt-tbTricks--peek" : ""}`}
            onClick={() => state.lastTrick && setShowLastTrick(true)}
            title={state.lastTrick ? "Show previous trick" : "Tricks won"}
          >
            <span className="pt-trickTally">
              <span className="pt-cardBack pt-cardBack--v" aria-hidden="true" />
              <span className="pt-trickNum">{state.nsTricks}</span>
            </span>
            <span className="pt-trickTally">
              <span className="pt-cardBack pt-cardBack--h" aria-hidden="true" />
              <span className="pt-trickNum">{state.ewTricks}</span>
            </span>
          </div>
        </div>
        <div className="pt-tbBtns">
          <div className="pt-speedSeg" role="group" aria-label="Opponent speed and strength">
            <button
              type="button"
              className={`pt-segBtn ${fast ? "pt-segBtn--on" : ""}`}
              onClick={() => setFast(true)}
              title="Quicker bids and play (skips the deep simulation; opponents a little weaker)"
            >
              Faster
            </button>
            <button
              type="button"
              className={`pt-segBtn ${!fast ? "pt-segBtn--on" : ""}`}
              onClick={() => setFast(false)}
              title="Full-strength bidding and play (slower)"
            >
              Stronger
            </button>
          </div>
          <button
            type="button"
            className="pt-tbBtn"
            disabled={!(state.phase === "play" && isHumanDeclaringSide(state) && state.dummyRevealed)}
            onClick={openClaim}
          >
            Claim
          </button>
          <button type="button" className="pt-tbBtn" disabled={state.phase !== "done"} onClick={newDeal}>Results</button>
        </div>
      </div>

      <div className="pt-statusline" aria-live="polite">
        <span className={`pt-mode pt-mode--${benMode()}`}>{benMode() === "live" ? "Online" : "Offline"}</span>
        <span className="pt-statusText">{statusText}</span>
        {thinking && <span className="pt-thinkingDot" aria-hidden />}
        {warming && <span className="pt-statusNotice pt-statusNotice--warming">{WARMING_HINT_TEXT}</span>}
        {notice && <span className="pt-statusNotice">{notice}</span>}
      </div>

      {!preview && (
        <div className="pt-wipBanner" role="status">
          Just Play is brand-new and still being worked on over the next few days — expect a few rough edges. Thanks for trying it!
        </div>
      )}

      {/* TOP: North — the dummy, or the declarer you control from the dummy seat.
          At end of deal the depleted hands are hidden; the full deal diagram shows instead. */}
      {state.phase !== "done" && handVisible("N", state) && <HandRow seat="N" state={state} onPlay={onHumanPlay} />}

      {/* MIDDLE: West dummy (left) | felt | East dummy (right) */}
      <div className="pt-midRow">
        <div className="pt-sideSlot pt-sideSlot--left">
          {state.phase !== "done" && state.dummy === "W" && handVisible("W", state) && <SideHand seat="W" state={state} side="left" />}
        </div>

        <div className="pt-felt">
          {inBidding ? (
            <div className="pt-bidArea">
              <div className="pt-bidLayout">
                <div className="pt-bidColumn">
                  <AuctionPanel state={state} onHover={onHover} />
                  {state.phase === "passout" ? (
                    <div className="pt-passout">
                      <div className="pt-passoutText">Passed out — no contract this hand.</div>
                      <button type="button" className="pt-tbBtn pt-tbBtn--primary" onClick={singleDeal ? onExit : newDeal}>
                        {singleDeal ? exitLabel : "Deal next hand"}
                      </button>
                    </div>
                  ) : (
                    humanToBid && (
                      <>
                        {state.dealer === HUMAN_SEAT && state.auction.length === 0 && (
                          <div className="pt-dealerNote">You are the dealer</div>
                        )}
                        <BiddingBox
                          auction={state.auction}
                          seat={HUMAN_SEAT}
                          onCall={onHumanCall}
                          disabled={!humanToBid}
                          meanings={bidMeanings}
                          onHover={onHover}
                        />
                      </>
                    )
                  )}
                </div>
                <BidMeaning hover={hoverMeaning} />
              </div>
            </div>
          ) : state.phase === "done" ? (
            <div className="pt-doneArea">
              {state.result && (
                <div className="pt-resultOverlay pt-resultOverlay--done">
                  <div className="pt-resultText">{statusText}</div>
                  <button type="button" className="pt-tbBtn pt-tbBtn--primary" onClick={singleDeal ? onExit : newDeal}>
                    {singleDeal ? exitLabel : "Next deal"}
                  </button>
                </div>
              )}
              <DealDiagram hands={state.seed != null ? dealHands(state.seed) : state.originalHands} />
            </div>
          ) : (
            <div className="pt-trickArea" aria-label="Trick">
              <div className="pt-trickGrid">
                <div className="pt-trickPos pt-trickPos--n"><TrickCard card={trickBySeat.N} /></div>
                <div className="pt-trickPos pt-trickPos--w"><TrickCard card={trickBySeat.W} /></div>
                <div className="pt-trickPos pt-trickPos--e"><TrickCard card={trickBySeat.E} /></div>
                <div className="pt-trickPos pt-trickPos--s"><TrickCard card={trickBySeat.S} /></div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-sideSlot pt-sideSlot--right">
          {state.phase !== "done" && state.dummy === "E" && handVisible("E", state) && <SideHand seat="E" state={state} side="right" />}
        </div>
      </div>

      {/* BOTTOM: your hand (hidden at end of deal — the full diagram shows it) */}
      {state.phase !== "done" && <HandRow seat="S" state={state} onPlay={onHumanPlay} />}

      {showClaim && (
        <ClaimModal state={state} busy={claiming} message={claimMsg} onConfirm={confirmClaim} onCancel={closeClaim} />
      )}

      {showAuction && state.contract && (
        <div className="pt-auctionPop" onClick={() => setShowAuction(false)}>
          <div className="pt-auctionPopInner" onClick={(e) => e.stopPropagation()}>
            <AuctionPanel state={state} onHover={onHover} />
            <BidMeaning hover={hoverMeaning} />
          </div>
        </div>
      )}

      {showLastTrick && state.lastTrick && (
        <div className="pt-lastTrickPop" onClick={() => setShowLastTrick(false)}>
          <div className="pt-lastTrickBox" onClick={(e) => e.stopPropagation()}>
            <div className="pt-lastTrickTitle">Previous trick</div>
            <div className="pt-trickGrid pt-trickGrid--mini">
              {SEATS.map((s) => (
                <div
                  key={s}
                  className={`pt-trickPos pt-trickPos--${s.toLowerCase()} ${
                    state.lastTrick.winner === s ? "pt-trickPos--won" : ""
                  }`}
                >
                  <TrickCard card={lastBySeat[s]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayTable;

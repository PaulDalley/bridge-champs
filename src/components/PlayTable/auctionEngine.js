/**
 * Pure auction logic for the BEN play table: call legality, auction completion,
 * deriving the contract (level/strain/declarer/doubled) and duplicate scoring.
 * No React, no I/O.
 *
 * Call model (internal):
 *   { kind: "bid", level: 1..7, strain: "C"|"D"|"H"|"S"|"N" }
 *   { kind: "pass" } | { kind: "double" } | { kind: "redouble" }
 *
 * Auction = ordered array of { seat, call }, seat in N/E/S/W, starting with dealer.
 */
import { SEATS, nextClockwise, partnerCompass } from "./bridgeCore";

export const STRAINS = ["C", "D", "H", "S", "N"];
export const STRAIN_LABEL = { C: "♣", D: "♦", H: "♥", S: "♠", N: "NT" };
export const STRAIN_NAME = { C: "clubs", D: "diamonds", H: "hearts", S: "spades", N: "notrump" };

export function callsEqual(a, b) {
  if (!a || !b) return false;
  if (a.kind !== b.kind) return false;
  if (a.kind === "bid") return a.level === b.level && a.strain === b.strain;
  return true;
}

/** Numeric rank of a bid for "must be higher" comparisons. */
export function bidValue(level, strain) {
  return (level - 1) * 5 + STRAINS.indexOf(strain);
}

export function lastBid(auction) {
  for (let i = auction.length - 1; i >= 0; i--) {
    if (auction[i].call.kind === "bid") return auction[i];
  }
  return null;
}

/** The most recent non-pass call entry (bid / double / redouble). */
function lastMeaningful(auction) {
  for (let i = auction.length - 1; i >= 0; i--) {
    if (auction[i].call.kind !== "pass") return auction[i];
  }
  return null;
}

function isOpponent(seatA, seatB) {
  return partnerCompass(seatA) !== seatB && seatA !== seatB;
}

/** Is `call` legal for `seat` given the auction so far? */
export function isLegalCall(call, seat, auction) {
  if (call.kind === "pass") return true;
  if (call.kind === "bid") {
    const lb = lastBid(auction);
    if (!lb) return true;
    return bidValue(call.level, call.strain) > bidValue(lb.call.level, lb.call.strain);
  }
  const lm = lastMeaningful(auction);
  if (!lm) return false;
  if (call.kind === "double") {
    // Double a bid made by an opponent that is not already doubled/redoubled.
    return lm.call.kind === "bid" && isOpponent(seat, lm.seat);
  }
  if (call.kind === "redouble") {
    // Redouble an opponent's double of our side's bid.
    return lm.call.kind === "double" && isOpponent(seat, lm.seat);
  }
  return false;
}

/** Auction over? 4 passes (passout) or a bid followed by 3 passes. */
export function isAuctionComplete(auction) {
  if (auction.length < 4) return false;
  const last3 = auction.slice(-3);
  if (!last3.every((e) => e.call.kind === "pass")) return false;
  return true; // covers both passout (4 passes, no bid) and bid + 3 passes
}

export function isPassout(auction) {
  return auction.length === 4 && auction.every((e) => e.call.kind === "pass");
}

/**
 * Derive the final contract from a completed auction.
 * Declarer = first player of the contract side to have named the final strain.
 * Returns null on passout.
 */
export function contractFromAuction(auction) {
  if (isPassout(auction)) return null;
  const lb = lastBid(auction);
  if (!lb) return null;
  const { level, strain } = lb.call;

  let doubled = 0;
  for (let i = auction.length - 1; i >= 0; i--) {
    const k = auction[i].call.kind;
    if (k === "bid") break;
    if (k === "redouble") { doubled = 2; break; }
    if (k === "double") { doubled = 1; break; }
  }

  const declaringSide = new Set([lb.seat, partnerCompass(lb.seat)]);
  let declarer = lb.seat;
  for (const e of auction) {
    if (e.call.kind === "bid" && e.call.strain === strain && declaringSide.has(e.seat)) {
      declarer = e.seat;
      break;
    }
  }
  return { level, strain, declarer, doubled };
}

/** Seat on lead to the first trick = LHO of declarer (clockwise from declarer). */
export function openingLeader(declarer) {
  return nextClockwise(declarer);
}

export function contractLabel(contract) {
  if (!contract) return "Passed out";
  const dbl = contract.doubled === 2 ? " XX" : contract.doubled === 1 ? " X" : "";
  return `${contract.level}${STRAIN_LABEL[contract.strain]}${dbl}`;
}

export function tricksNeeded(contract) {
  return contract ? contract.level + 6 : 0;
}

const MINOR = new Set(["C", "D"]);
const MAJOR = new Set(["H", "S"]);

/**
 * Duplicate (non-rubber) score from declarer's perspective.
 * `tricksWon` = tricks taken by declarer's side. `vul` = declarer-side vulnerable?
 * Returns a positive number if the contract made, negative if defeated.
 */
export function scoreContract(contract, tricksWon, vul) {
  if (!contract) return 0;
  const need = tricksNeeded(contract);
  const { level, strain, doubled } = contract;
  const overUnder = tricksWon - need;

  if (overUnder < 0) {
    const undertricks = -overUnder;
    if (!doubled) return -(undertricks * (vul ? 100 : 50));
    // Doubled undertricks: first -100/-200 (nv/v), then escalating.
    let pen = 0;
    for (let i = 1; i <= undertricks; i++) {
      if (vul) pen += i === 1 ? 200 : 300;
      else pen += i === 1 ? 100 : i <= 3 ? 200 : 300;
    }
    return -(doubled === 2 ? pen * 2 : pen);
  }

  // Made: trick value
  let perTrick = MINOR.has(strain) ? 20 : strain === "N" ? 30 : MAJOR.has(strain) ? 30 : 20;
  let trickScore = level * perTrick;
  if (strain === "N") trickScore += 10; // NT first trick is 40
  if (doubled) trickScore *= doubled === 2 ? 4 : 2;

  const gameBonus = trickScore >= 100 ? (vul ? 500 : 300) : 50;
  const slamBonus = level === 7 ? (vul ? 1500 : 1000) : level === 6 ? (vul ? 750 : 500) : 0;
  const dblBonus = doubled ? doubled * 50 : 0; // "for the insult"
  const overScore = overUnder * (doubled ? (vul ? 200 : 100) * (doubled === 2 ? 2 : 1) : perTrick);

  return trickScore + gameBonus + slamBonus + dblBonus + overScore;
}

export { SEATS };

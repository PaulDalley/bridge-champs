/**
 * Pure bridge primitives for the BEN play table: card model, dealing, legal
 * plays and trick-winner resolution. No React, no I/O — safe to unit-test.
 *
 * Card model: { suit: "S"|"H"|"D"|"C", rank: "2".."9"|"T"|"J"|"Q"|"K"|"A" }
 * Seats: "N" | "E" | "S" | "W". Strain: "C"|"D"|"H"|"S" (trumps) or "N" (NT).
 *
 * Seat geometry (CLOCKWISE ring, nextClockwise, partner) is imported from the
 * shared bridge primitives so this stays consistent with the rest of the site.
 */
import { CLOCKWISE, partnerCompass, compassCW } from "../../bridge/seatCompassMaps";
import { nextClockwise } from "../../bridge/compassPlayOrder";

export const SEATS = CLOCKWISE; // ["N","E","S","W"]
export const SUITS = ["S", "H", "D", "C"];
export const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

// Suit display order for a stacked hand: trump on top, then the remaining suits by
// rank (spades > hearts > diamonds > clubs), with a colour-contrast swap when trump
// is clubs so its neighbour is a red suit. No trump (NT / unset) uses plain rank order.
//   S -> S H D C · H -> H S D C · D -> D S H C · C -> C H S D
const SUIT_ORDER_BY_TRUMP = {
  S: ["S", "H", "D", "C"],
  H: ["H", "S", "D", "C"],
  D: ["D", "S", "H", "C"],
  C: ["C", "H", "S", "D"],
  N: ["S", "H", "D", "C"],
};
export function suitOrderForTrump(strain) {
  return [...(SUIT_ORDER_BY_TRUMP[strain] || SUIT_ORDER_BY_TRUMP.N)];
}

/** Trick strength: index in this string = strength (A highest). */
const TRICK_RANK_ORDER = "23456789TJQKA";

export const SUIT_SYMBOL = { S: "♠", H: "♥", D: "♦", C: "♣" };
export const SEAT_NAME = { N: "North", E: "East", S: "South", W: "West" };

export { partnerCompass, compassCW, nextClockwise };

export function rankValue(rank) {
  return TRICK_RANK_ORDER.indexOf(rank);
}

/** Display "T" as "10"; everything else unchanged. */
export function displayRank(rank) {
  return rank === "T" ? "10" : String(rank);
}

export function suitSymbol(suit) {
  return SUIT_SYMBOL[suit] || suit;
}

/** ♥/♦ red, ♣ green, ♠ black — matches the site convention. */
export function suitColorClass(suit) {
  if (suit === "H" || suit === "D") return "pt-suit--red";
  if (suit === "C") return "pt-suit--club";
  return "pt-suit--black";
}

/** Deterministic small PRNG so a deal can be reproduced from a seed. */
export function mulberry32(a) {
  return function next() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildDeck() {
  const out = [];
  for (const suit of SUITS) for (const rank of RANKS) out.push({ suit, rank });
  return out;
}

function shuffle(deck, rng) {
  const a = [...deck];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Display suit order: spades, hearts, clubs, diamonds — alternates colours
 * (black, red, green, red) so the two red suits never sit side by side.
 * (Independent of SUITS / the PBN S.H.D.C order BEN requires.) */
const SUIT_DISPLAY_ORDER = ["S", "H", "C", "D"];

/** Sort a hand: by display suit order then rank high→low. */
export function sortHand(cards) {
  return [...cards].sort((a, b) => {
    const s = SUIT_DISPLAY_ORDER.indexOf(a.suit) - SUIT_DISPLAY_ORDER.indexOf(b.suit);
    if (s !== 0) return s;
    return rankValue(b.rank) - rankValue(a.rank);
  });
}

/** Deal 13 cards to each seat, sorted. Seedless = random via the supplied rng seed. */
export function dealHands(seed) {
  const rng = mulberry32(seed >>> 0);
  const shuffled = shuffle(buildDeck(), rng);
  const hands = { N: [], E: [], S: [], W: [] };
  for (let i = 0; i < 52; i++) hands[SEATS[i % 4]].push(shuffled[i]);
  for (const s of SEATS) hands[s] = sortHand(hands[s]);
  return hands;
}

export function ledSuitOf(trickPlays) {
  return trickPlays.length ? trickPlays[0].card.suit : null;
}

/** Cards that may legally be played: must follow the led suit if able. */
export function legalPlays(hand, ledSuit) {
  if (!ledSuit) return hand.slice();
  const follow = hand.filter((c) => c.suit === ledSuit);
  return follow.length ? follow : hand.slice();
}

function isTrump(strain) {
  return strain && strain !== "N" && strain !== "NT";
}

/**
 * Which play wins the trick. `plays` = [{ seat, card }] in play order.
 * `strain` is the trump suit ("C/D/H/S") or "N"/"NT" for no-trump.
 */
export function winningPlay(plays, strain) {
  if (!plays.length) return null;
  const led = plays[0].card.suit;
  if (isTrump(strain)) {
    const trumps = plays.filter((p) => p.card.suit === strain);
    if (trumps.length) {
      return trumps.reduce((best, p) => (rankValue(p.card.rank) > rankValue(best.card.rank) ? p : best));
    }
  }
  const inLed = plays.filter((p) => p.card.suit === led);
  return inLed.reduce((best, p) => (rankValue(p.card.rank) > rankValue(best.card.rank) ? p : best));
}

export function trickWinner(plays, strain) {
  const w = winningPlay(plays, strain);
  return w ? w.seat : plays[0].seat;
}

export function sameCard(a, b) {
  return a && b && a.suit === b.suit && a.rank === b.rank;
}

/**
 * Offline stand-in for BEN so the table is playable before the engine is hosted.
 * Deliberately simple and *legal* rather than strong: bots pass in the auction,
 * and follow basic "follow suit / lowest" rules in play. Swapped out automatically
 * the moment REACT_APP_BEN_API_URL is set (see benClient.js).
 */
import { legalPlays, ledSuitOf, rankValue, SUITS } from "./bridgeCore";

/** Mock bidding: always pass. Keeps auctions legal and lets the human reach a contract. */
export function mockBid() {
  return { kind: "pass" };
}

function longestSuit(hand) {
  const counts = { S: 0, H: 0, D: 0, C: 0 };
  for (const c of hand) counts[c.suit] += 1;
  let best = "S";
  let bestLen = -1;
  for (const s of SUITS) {
    if (counts[s] > bestLen) {
      bestLen = counts[s];
      best = s;
    }
  }
  return best;
}

function lowest(cards) {
  return cards.reduce((lo, c) => (rankValue(c.rank) < rankValue(lo.rank) ? c : lo));
}

/** Opening lead: a low-ish card from the longest suit. */
export function mockLead(ctx) {
  const hand = ctx.hand;
  const suit = longestSuit(hand);
  const inSuit = hand.filter((c) => c.suit === suit);
  return lowest(inSuit.length ? inSuit : hand);
}

/** Next card in play: follow suit (lowest) if able, else discard the lowest card.
 * Uses currentHand (the depleted hand) when provided — ctx.hand may be the full
 * original hand that BEN needs, which would include already-played cards. */
export function mockPlay(ctx) {
  const led = ledSuitOf(ctx.trickPlays || []);
  const legal = legalPlays(ctx.currentHand || ctx.hand, led);
  return lowest(legal);
}

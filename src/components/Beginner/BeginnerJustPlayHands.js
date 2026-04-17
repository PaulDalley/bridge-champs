import React, { useCallback, useEffect, useReducer, useState } from "react";
import { nextClockwise } from "../../bridge/compassPlayOrder";
import { compassCW } from "../../bridge/seatCompassMaps";
import "./BeginnerJustPlayHands.css";

const COMPASSES = ["N", "E", "S", "W"];

/** Led-suit trick winner: low index = weak, high = strong. */
const TRICK_RANK_ORDER = "23456789TJQKA";

const SUIT_SYMBOL = { S: "♠", H: "♥", D: "♦", C: "♣" };
const CONTRACT_STRAINS = ["NT", "S", "H", "D", "C"];
const CONTRACT_STRAIN_LABEL = { NT: "NT", S: "♠", H: "♥", D: "♦", C: "♣" };
const CONTRACT_STRAIN_NAME = {
  NT: "notrump",
  S: "spades",
  H: "hearts",
  D: "diamonds",
  C: "clubs",
};
const BID_STRAIN_ORDER = ["C", "D", "H", "S", "NT"];

const SEAT_NAME = { N: "North", E: "East", S: "South", W: "West" };

const BOT_CARD_DELAY_MS = 1000;

const SUIT_ORDER = ["S", "H", "C", "D"];
const RANK_ORDER_SORT = ["A", "K", "Q", "J", "T", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

const PARTNER = { N: "S", S: "N", E: "W", W: "E" };

const FULL_HAND_SLOTS = 13;

function getVariantConfig(variant) {
  if (variant === "defend") {
    return {
      humanSeats: new Set(["W"]),
      /** User defends with East–West; declarer side is North–South. */
      yourPartnership: new Set(["E", "W"]),
    };
  }
  return {
    humanSeats: new Set(["S", "N"]),
    yourPartnership: new Set(["N", "S"]),
  };
}

function mulberry32(a) {
  return function mulberryNext() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDeck() {
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
  const suits = ["C", "D", "H", "S"];
  const out = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      out.push({ suit, rank });
    }
  }
  return out;
}

function shuffleDeck(deck, rng) {
  const a = [...deck];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function rankSortValue(r) {
  const idx = RANK_ORDER_SORT.indexOf(String(r));
  return idx === -1 ? 999 : idx;
}

function sortCardsSuitRank(cards) {
  return [...cards].sort((a, b) => {
    const suitA = SUIT_ORDER.indexOf(a.suit);
    const suitB = SUIT_ORDER.indexOf(b.suit);
    if (suitA !== suitB) return suitA - suitB;
    return rankSortValue(a.rank) - rankSortValue(b.rank);
  });
}

function rankValueTrick(rank) {
  return TRICK_RANK_ORDER.indexOf(rank);
}

function randomLevel(rng) {
  const roll = rng();
  if (roll < 0.2) return 1;
  if (roll < 0.45) return 2;
  if (roll < 0.72) return 3;
  if (roll < 0.9) return 4;
  if (roll < 0.97) return 5;
  return 6;
}

function createRandomContract(rng, declarerCompass = "S") {
  const level = randomLevel(rng);
  const strain = CONTRACT_STRAINS[Math.floor(rng() * CONTRACT_STRAINS.length)];
  return {
    level,
    strain,
    declarerCompass,
    openingLeader: compassCW(declarerCompass),
    targetTricks: level + 6,
  };
}

function contractLabel(contract) {
  if (!contract) return "";
  return `${contract.level} ${CONTRACT_STRAIN_LABEL[contract.strain] || contract.strain}`;
}

function contractSummary(contract) {
  if (!contract) return "";
  return `Contract: ${contractLabel(contract)}. Declarer: ${SEAT_NAME[contract.declarerCompass]}. ${SEAT_NAME[contract.openingLeader]} leads first.`;
}

function isTrumpContract(contract) {
  return !!contract && contract.strain !== "NT";
}

function partnershipOfSeat(seat) {
  return seat === "N" || seat === "S" ? "NS" : "EW";
}

function callLabel(call) {
  if (!call) return "";
  if (call.type === "pass") return "Pass";
  return `${call.level}${call.strain === "NT" ? "NT" : suitSymbol(call.strain)}`;
}

function bidRank(call) {
  if (!call || call.type !== "bid") return -1;
  const strainIdx = BID_STRAIN_ORDER.indexOf(call.strain);
  if (strainIdx < 0) return -1;
  return (Number(call.level) - 1) * 5 + strainIdx;
}

function lastBidCall(auctionCalls) {
  for (let i = auctionCalls.length - 1; i >= 0; i--) {
    if (auctionCalls[i]?.call?.type === "bid") return auctionCalls[i].call;
  }
  return null;
}

function isAuctionComplete(auctionCalls) {
  if (!Array.isArray(auctionCalls) || auctionCalls.length < 4) return false;
  const hasBid = auctionCalls.some((e) => e?.call?.type === "bid");
  if (!hasBid) return false;
  const lastThree = auctionCalls.slice(-3);
  return lastThree.every((e) => e?.call?.type === "pass");
}

function isLegalCall(auctionCalls, call) {
  if (!call) return false;
  if (call.type === "pass") return true;
  if (call.type !== "bid") return false;
  const prev = lastBidCall(auctionCalls);
  return !prev || bidRank(call) > bidRank(prev);
}

function validateAuction(auctionCalls) {
  const seen = [];
  for (const entry of auctionCalls) {
    if (!entry || !entry.call || !isLegalCall(seen, entry.call)) return false;
    seen.push(entry);
  }
  return isAuctionComplete(auctionCalls);
}

function legalBidCalls(auctionCalls) {
  const prev = lastBidCall(auctionCalls);
  const minRank = prev ? bidRank(prev) + 1 : 0;
  const out = [];
  for (let level = 1; level <= 7; level++) {
    for (const strain of BID_STRAIN_ORDER) {
      const call = { type: "bid", level, strain };
      if (bidRank(call) >= minRank) out.push(call);
    }
  }
  return out;
}

function currentAuctionSeat(auctionCalls, dealerCompass) {
  let seat = dealerCompass;
  for (let i = 0; i < (auctionCalls || []).length; i++) {
    seat = nextClockwise(seat);
  }
  return seat;
}

function resolveContractFromAuction(auctionCalls, fallbackContract) {
  const lastBidEntry = [...auctionCalls].reverse().find((e) => e?.call?.type === "bid");
  if (!lastBidEntry) return fallbackContract;
  const { level, strain } = lastBidEntry.call;
  const side = partnershipOfSeat(lastBidEntry.seat);
  const declarerEntry = auctionCalls.find(
    (e) =>
      e?.call?.type === "bid" &&
      e.call.strain === strain &&
      partnershipOfSeat(e.seat) === side
  );
  const declarerCompass = declarerEntry ? declarerEntry.seat : lastBidEntry.seat;
  return {
    level,
    strain,
    declarerCompass,
    openingLeader: compassCW(declarerCompass),
    targetTricks: Number(level) + 6,
  };
}

function chooseBotAuctionCall({ auctionCalls, seat, targetContract, hand = [] }) {
  const pass = { type: "pass" };
  const legalBids = legalBidCalls(auctionCalls);
  if (!legalBids.length) return pass;

  const suitLengths = { S: 0, H: 0, D: 0, C: 0 };
  let hcp = 0;
  for (const c of hand) {
    suitLengths[c.suit] = (suitLengths[c.suit] || 0) + 1;
    if (c.rank === "A") hcp += 4;
    else if (c.rank === "K") hcp += 3;
    else if (c.rank === "Q") hcp += 2;
    else if (c.rank === "J") hcp += 1;
  }

  const longestSuits = Object.entries(suitLengths)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      const majorBias = { S: 2, H: 1, D: 0, C: -1 };
      return (majorBias[b[0]] || 0) - (majorBias[a[0]] || 0);
    })
    .map(([s]) => s);
  const preferredSuit = longestSuits[0] || "C";
  const isBalanced = Math.max(...Object.values(suitLengths)) <= 5 && Math.min(...Object.values(suitLengths)) >= 2;
  const hasAnyBid = auctionCalls.some((e) => e?.call?.type === "bid");
  const side = partnershipOfSeat(seat);
  const partnerBids = auctionCalls.filter(
    (e) => e?.call?.type === "bid" && partnershipOfSeat(e.seat) === side
  );
  const partnerLastBid = partnerBids.length ? partnerBids[partnerBids.length - 1].call : null;
  const opponentsBid = auctionCalls.some(
    (e) => e?.call?.type === "bid" && partnershipOfSeat(e.seat) !== side
  );

  // Opening style: 1NT with balanced 15-17, otherwise 1 of longest suit with opening values.
  if (!hasAnyBid && hcp >= 12) {
    const oneNt = { type: "bid", level: 1, strain: "NT" };
    if (isBalanced && hcp >= 15 && hcp <= 17 && isLegalCall(auctionCalls, oneNt)) return oneNt;
    const oneSuit = { type: "bid", level: 1, strain: preferredSuit };
    if (isLegalCall(auctionCalls, oneSuit)) return oneSuit;
  }

  // Simple response logic: raise partner with support and values.
  if (partnerLastBid && partnerLastBid.strain !== "NT") {
    const supportLen = suitLengths[partnerLastBid.strain] || 0;
    if (supportLen >= 3 && hcp >= 6) {
      const raise = { type: "bid", level: Number(partnerLastBid.level) + 1, strain: partnerLastBid.strain };
      if (isLegalCall(auctionCalls, raise)) return raise;
    }
  }

  // Competitive overcall / takeout style approximation with decent values and length.
  if (opponentsBid && hcp >= 11) {
    const overcall = legalBids.find((b) => b.level <= 2 && (suitLengths[b.strain] || 0) >= 5);
    if (overcall) return overcall;
  }

  // Keep training target reachable when sensible.
  if (targetContract && seat === targetContract.declarerCompass && hcp >= 10) {
    const targetBid = { type: "bid", level: targetContract.level, strain: targetContract.strain };
    if (isLegalCall(auctionCalls, targetBid)) return targetBid;
  }

  // Fallback: conservative cheapest legal bid with values, otherwise pass.
  if (hcp >= 10) {
    const cheapest = legalBids[0];
    if (cheapest) return cheapest;
  }
  return pass;
}

function displayRank(rank) {
  if (rank === "T") return "10";
  return String(rank);
}

function suitSymbol(suit) {
  return SUIT_SYMBOL[suit] || suit;
}

function cardColorClass(card) {
  if (!card) return "";
  return card.suit === "H" || card.suit === "D" ? "ct-card--red" : "ct-card--black";
}

function getLedSuit(trickPlays) {
  return trickPlays.length ? trickPlays[0].card.suit : null;
}

function legalPlays(hand, ledSuit) {
  if (!ledSuit) return hand.slice();
  const follow = hand.filter((c) => c.suit === ledSuit);
  return follow.length ? follow : hand.slice();
}

function samePartnership(seatA, seatB) {
  return PARTNER[seatA] === seatB;
}

function pickLowestByRank(cards) {
  if (!cards.length) return null;
  return cards.reduce((lo, c) => (rankValueTrick(c.rank) < rankValueTrick(lo.rank) ? c : lo));
}

function pickMinimumWinnerInSuit(cardsInLedSuit, highCard) {
  const winners = cardsInLedSuit.filter((c) => rankValueTrick(c.rank) > rankValueTrick(highCard.rank));
  if (!winners.length) return null;
  return pickLowestByRank(winners);
}

function pickDiscard(cards, contract) {
  if (!cards.length) return null;
  const bySuit = { S: [], H: [], D: [], C: [] };
  cards.forEach((c) => bySuit[c.suit].push(c));
  const discardSuitOrder = Object.entries(bySuit)
    .filter(([, arr]) => arr.length > 0)
    .sort((a, b) => {
      if (a[0] === contract?.strain) return 1;
      if (b[0] === contract?.strain) return -1;
      if (a[1].length !== b[1].length) return a[1].length - b[1].length;
      return SUIT_ORDER.indexOf(a[0]) - SUIT_ORDER.indexOf(b[0]);
    })
    .map(([s]) => s);
  const suit = discardSuitOrder[0];
  return pickLowestByRank(bySuit[suit] || cards);
}

function chooseLead(hand, contract) {
  const bySuit = { S: [], H: [], D: [], C: [] };
  for (const c of hand) {
    bySuit[c.suit].push(c);
  }
  const leadableSuits = isTrumpContract(contract)
    ? SUIT_ORDER.filter((s) => s !== contract.strain && bySuit[s].length > 0)
    : SUIT_ORDER.filter((s) => bySuit[s].length > 0);
  const suitPool = leadableSuits.length ? leadableSuits : SUIT_ORDER.filter((s) => bySuit[s].length > 0);
  let bestSuit = suitPool[0] || "S";
  let bestLen = -1;
  for (const s of suitPool) {
    const len = bySuit[s].length;
    if (len > bestLen) {
      bestLen = len;
      bestSuit = s;
    }
  }
  const suitCards = bySuit[bestSuit];
  // Lead an honour from shortness; fourth-best from length.
  const desc = [...suitCards].sort((a, b) => rankValueTrick(b.rank) - rankValueTrick(a.rank));
  if (desc.length <= 2) {
    const top = desc[0];
    if (top && ["A", "K", "Q"].includes(top.rank)) return top;
  }
  if (desc.length >= 4) return desc[3];
  return pickLowestByRank(suitCards);
}

function winningPlayInTrick(trickPlays, contract) {
  if (!trickPlays.length) return null;
  const ledSuit = trickPlays[0].card.suit;
  if (isTrumpContract(contract)) {
    const trumpSuit = contract.strain;
    const trumpPlays = trickPlays.filter((p) => p.card.suit === trumpSuit);
    if (trumpPlays.length) {
      return trumpPlays.reduce((best, p) =>
        rankValueTrick(p.card.rank) > rankValueTrick(best.card.rank) ? p : best
      );
    }
  }
  const ledPlays = trickPlays.filter((p) => p.card.suit === ledSuit);
  return ledPlays.reduce((best, p) =>
    rankValueTrick(p.card.rank) > rankValueTrick(best.card.rank) ? p : best
  );
}

function chooseBotCard(botSeat, hand, trickPlays, contract) {
  const led = getLedSuit(trickPlays);
  if (!led) return chooseLead(hand, contract);

  const legal = legalPlays(hand, led);
  if (!legal.length) return null;

  const inLed = hand.filter((c) => c.suit === led);
  if (inLed.length) {
    if (trickPlays.length === 1) {
      return pickLowestByRank(inLed);
    }
    if (trickPlays.length === 3) {
      const winningNow = winningPlayInTrick(trickPlays, contract);
      if (winningNow && !samePartnership(botSeat, winningNow.seat)) {
        const winCandidates = [...inLed].sort((a, b) => rankValueTrick(a.rank) - rankValueTrick(b.rank));
        const needed = winCandidates.find(
          (c) => winningNow.card.suit === led && rankValueTrick(c.rank) > rankValueTrick(winningNow.card.rank)
        );
        if (needed) return needed;
        return winCandidates[winCandidates.length - 1];
      }
    }
    const winning = winningPlayInTrick(trickPlays, contract);
    if (winning && samePartnership(botSeat, winning.seat)) {
      return pickLowestByRank(inLed);
    }
    if (winning && winning.seat !== botSeat) {
      if (winning.card.suit !== led) {
        return pickLowestByRank(inLed);
      }
      const cover = pickMinimumWinnerInSuit(inLed, winning.card);
      if (cover) return cover;
    }
    return pickLowestByRank(inLed);
  }

  if (isTrumpContract(contract)) {
    const trumpSuit = contract.strain;
    const trumps = hand.filter((c) => c.suit === trumpSuit);
    const nonTrumps = legal.filter((c) => c.suit !== trumpSuit);
    const winning = winningPlayInTrick(trickPlays, contract);
    if (trumps.length) {
      if (!winning || winning.card.suit !== trumpSuit) {
        return pickLowestByRank(trumps);
      }
      if (samePartnership(botSeat, winning.seat) && nonTrumps.length) {
        return pickLowestByRank(nonTrumps);
      }
      const overruff = trumps
        .filter((c) => rankValueTrick(c.rank) > rankValueTrick(winning.card.rank))
        .sort((a, b) => rankValueTrick(a.rank) - rankValueTrick(b.rank))[0];
      if (overruff) return overruff;
      return nonTrumps.length ? pickDiscard(nonTrumps, contract) : pickLowestByRank(trumps);
    }
  }

  return pickDiscard(legal, contract);
}

function trickWinnerForContract(trickPlays, contract) {
  const winning = winningPlayInTrick(trickPlays, contract);
  return winning ? winning.seat : trickPlays[0].seat;
}

function currentSeatToPlay(state) {
  if (state.phase !== "play") return null;
  if (state.trickPlays.length === 0) return state.trickLeader;
  const last = state.trickPlays[state.trickPlays.length - 1].seat;
  return nextClockwise(last);
}

function dealState(seed) {
  const rng = mulberry32(seed >>> 0);
  const shuffled = shuffleDeck(buildDeck(), rng);
  const hands = { N: [], E: [], S: [], W: [] };
  for (let i = 0; i < 52; i++) {
    hands[COMPASSES[i % 4]].push(shuffled[i]);
  }
  for (const c of COMPASSES) {
    hands[c] = sortCardsSuitRank(hands[c]);
  }
  const targetContract = createRandomContract(rng, "S");
  const dealerCompass = "W";
  return {
    phase: "auction",
    seed,
    hands,
    dealerCompass,
    auction: [],
    trickPlays: [],
    trickLeader: targetContract.openingLeader,
    declarerCompass: targetContract.declarerCompass,
    contract: targetContract,
    targetContract,
    nsTricksWon: 0,
    ewTricksWon: 0,
    pendingTrickWinner: undefined,
  };
}

function gameReducer(state, action) {
  if (action.type === "NEW_DEAL") {
    return dealState(action.seed);
  }
  if (action.type === "AUCTION_CALL") {
    if (state.phase !== "auction") return state;
    const { seat, call } = action;
    const expectedSeat = currentAuctionSeat(state.auction, state.dealerCompass);
    if (seat !== expectedSeat) return state;
    if (!isLegalCall(state.auction, call)) return state;
    const nextAuction = [...state.auction, { seat, call }];
    if (!isAuctionComplete(nextAuction)) {
      return { ...state, auction: nextAuction };
    }
    if (!validateAuction(nextAuction)) {
      return { ...state, auction: nextAuction };
    }
    const finalContract = resolveContractFromAuction(nextAuction, state.contract);
    return {
      ...state,
      auction: nextAuction,
      contract: finalContract,
      trickLeader: finalContract.openingLeader,
      declarerCompass: finalContract.declarerCompass,
      phase: "play",
    };
  }
  if (action.type === "ACK_TRICK") {
    if (state.phase !== "trickAwaitAck") return state;
    const winner = state.pendingTrickWinner;
    const nsWon = winner === "N" || winner === "S";
    const allEmpty = COMPASSES.every((c) => state.hands[c].length === 0);
    return {
      ...state,
      trickPlays: [],
      trickLeader: winner,
      nsTricksWon: state.nsTricksWon + (nsWon ? 1 : 0),
      ewTricksWon: state.ewTricksWon + (nsWon ? 0 : 1),
      pendingTrickWinner: undefined,
      phase: allEmpty ? "done" : "play",
    };
  }
  if (action.type !== "PLAY_CARD") return state;
  const { seat, suit, rank } = action;
  if (state.phase !== "play") return state;
  const expected = currentSeatToPlay(state);
  if (seat !== expected) return state;
  const hand = state.hands[seat];
  const idx = hand.findIndex((c) => c.suit === suit && c.rank === rank);
  if (idx === -1) return state;
  const card = hand[idx];
  const led = getLedSuit(state.trickPlays);
  const legal = legalPlays(hand, led);
  if (!legal.some((c) => c.suit === card.suit && c.rank === card.rank)) return state;

  const newHand = hand.filter((_, i) => i !== idx);
  const newHands = { ...state.hands, [seat]: newHand };
  const newPlays = [...state.trickPlays, { seat, card: { suit, rank } }];

  if (newPlays.length < 4) {
    return { ...state, hands: newHands, trickPlays: newPlays };
  }

  const winner = trickWinnerForContract(newPlays, state.contract);
  return {
    ...state,
    hands: newHands,
    trickPlays: newPlays,
    pendingTrickWinner: winner,
    phase: "trickAwaitAck",
  };
}

function FanMiniTile({ card, playable, onActivate }) {
  const face = (
    <div className="ct-fanFace" aria-hidden="true">
      <div className="ct-fanRank">{displayRank(card.rank)}</div>
      <div className="ct-fanSuit">{suitSymbol(card.suit)}</div>
    </div>
  );

  if (playable) {
    return (
      <div
        role="button"
        tabIndex={0}
        data-card-key={`${card.rank}${card.suit}`}
        className={`ct-miniCard ct-miniCard--fan ${cardColorClass(card)} ct-miniCard--playable`}
        onClick={(e) => {
          e.stopPropagation();
          onActivate(card);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate(card);
          }
        }}
      >
        {face}
      </div>
    );
  }

  return (
    <div className={`ct-miniCard ct-miniCard--fan ${cardColorClass(card)}`} aria-label={`${displayRank(card.rank)} ${suitSymbol(card.suit)}`}>
      {face}
    </div>
  );
}

function TrickMiniTile({ card }) {
  if (!card) return null;
  return (
    <div className={`ct-miniCard ct-miniCard--fan ct-miniCard--trick ${cardColorClass(card)}`}>
      <div className="ct-fanFace" aria-hidden="true">
        <div className="ct-fanRank">{displayRank(card.rank)}</div>
        <div className="ct-fanSuit">{suitSymbol(card.suit)}</div>
      </div>
    </div>
  );
}

function JustPlayTable({ variant, onDealMetaChange }) {
  const { humanSeats, yourPartnership } = getVariantConfig(variant);
  const auctionHumanSeats = variant === "defend" ? new Set(["W"]) : new Set(["S"]);

  const [state, dispatch] = useReducer(gameReducer, null, () => dealState(Date.now() >>> 0));
  const [selectedBidCode, setSelectedBidCode] = useState("");

  const onNewDeal = useCallback(() => {
    dispatch({ type: "NEW_DEAL", seed: Date.now() >>> 0 });
  }, []);
  const toPlay = currentSeatToPlay(state);
  const ledSuit = getLedSuit(state.trickPlays);
  const auctionSeat = state.phase === "auction" ? currentAuctionSeat(state.auction, state.dealerCompass) : null;
  const legalCalls = state.phase === "auction" ? legalBidCalls(state.auction) : [];
  const selectedBidCall = legalCalls.find(
    (c) => `${c.level}${c.strain}` === selectedBidCode
  );

  useEffect(() => {
    if (typeof onDealMetaChange !== "function") return;
    onDealMetaChange({
      contract: state.contract,
      nsTricksWon: state.nsTricksWon,
      ewTricksWon: state.ewTricksWon,
    });
  }, [state.contract, state.nsTricksWon, state.ewTricksWon, onDealMetaChange]);

  useEffect(() => {
    if (state.phase !== "play") return undefined;
    const seat = currentSeatToPlay(state);
    const { humanSeats: botCheckHumans } = getVariantConfig(variant);
    if (botCheckHumans.has(seat)) return undefined;
    const hand = state.hands[seat];
    if (!hand.length) return undefined;
    const pick = chooseBotCard(seat, hand, state.trickPlays, state.contract);
    if (!pick) return undefined;
    const t = window.setTimeout(() => {
      dispatch({ type: "PLAY_CARD", seat, suit: pick.suit, rank: pick.rank });
    }, BOT_CARD_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [state, variant]);

  useEffect(() => {
    if (state.phase !== "auction") return undefined;
    if (!auctionSeat) return undefined;
    if (auctionHumanSeats.has(auctionSeat)) return undefined;
    const chosenCall = chooseBotAuctionCall({
      auctionCalls: state.auction,
      seat: auctionSeat,
      targetContract: state.targetContract,
      hand: state.hands[auctionSeat] || [],
    });
    const t = window.setTimeout(() => {
      dispatch({ type: "AUCTION_CALL", seat: auctionSeat, call: chosenCall });
    }, BOT_CARD_DELAY_MS * 0.8);
    return () => window.clearTimeout(t);
  }, [state.phase, state.auction, state.targetContract, auctionSeat, auctionHumanSeats]);

  useEffect(() => {
    if (state.phase !== "auction") return;
    if (!auctionSeat || !auctionHumanSeats.has(auctionSeat)) return;
    const targetCode = `${state.targetContract.level}${state.targetContract.strain}`;
    if (legalCalls.some((c) => `${c.level}${c.strain}` === targetCode)) {
      setSelectedBidCode(targetCode);
      return;
    }
    if (!selectedBidCode && legalCalls[0]) {
      setSelectedBidCode(`${legalCalls[0].level}${legalCalls[0].strain}`);
    }
  }, [state.phase, auctionSeat, auctionHumanSeats, legalCalls, selectedBidCode, state.targetContract]);

  const playHumanCard = useCallback((seat, card) => {
    dispatch({ type: "PLAY_CARD", seat, suit: card.suit, rank: card.rank });
  }, []);

  const acknowledgeTrick = useCallback(() => {
    dispatch({ type: "ACK_TRICK" });
  }, []);
  const callPass = useCallback(() => {
    if (state.phase !== "auction" || !auctionSeat) return;
    dispatch({ type: "AUCTION_CALL", seat: auctionSeat, call: { type: "pass" } });
  }, [state.phase, auctionSeat]);
  const callBid = useCallback(() => {
    if (state.phase !== "auction" || !auctionSeat || !selectedBidCall) return;
    dispatch({ type: "AUCTION_CALL", seat: auctionSeat, call: selectedBidCall });
  }, [state.phase, auctionSeat, selectedBidCall]);

  const trickAwait = state.phase === "trickAwaitAck" && !!state.pendingTrickWinner;
  const auctionAwait = state.phase === "auction";

  const rootKeyHandler = useCallback(
    (e) => {
      if (!trickAwait) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        acknowledgeTrick();
      }
    },
    [trickAwait, acknowledgeTrick]
  );

  const trickAckLabel = trickAwait
    ? yourPartnership.has(state.pendingTrickWinner)
      ? `Your side won the trick (${SEAT_NAME[state.pendingTrickWinner]}). Click anywhere or press Enter to continue.`
      : `${SEAT_NAME[state.pendingTrickWinner]} won the trick for the other side. Click anywhere or press Enter to continue.`
    : undefined;

  const trickCardBySeat = { N: null, E: null, S: null, W: null };
  for (const p of state.trickPlays) {
    trickCardBySeat[p.seat] = p.card;
  }

  /** Opponent seats: no on-felt labels for West/East; South (defend) keeps a small seat marker. */
  const renderOpponentSeat = (compass) => {
    const n = state.hands[compass].length;
    const label = `${SEAT_NAME[compass]}, ${n} cards face down`;
    if (compass === "W" || compass === "E") {
      return <div className="ct-handWrap bjp-handWrap--opponent bjp-handWrap--opponentBare" aria-label={label} />;
    }
    return (
      <div className="ct-handWrap bjp-handWrap--opponent" aria-label={label}>
        <div className="bjp-opponentZone">
          <div className="bjp-opponentSeatName">{SEAT_NAME[compass]}</div>
          {n === 0 && (
            <div className="bjp-opponentZoneEmpty" aria-hidden>
              —
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVisibleFan = (seat, ariaLabel) => {
    const hand = state.hands[seat];
    const isHuman = humanSeats.has(seat);
    const legal = state.phase === "play" && toPlay === seat ? legalPlays(hand, ledSuit) : [];
    /** Side column (West) is too narrow for 13 pip slots; N/S keep a full-width row so ghosts preserve layout. */
    const ghostCount = seat === "N" || seat === "S" ? Math.max(0, FULL_HAND_SLOTS - hand.length) : 0;
    return (
      <div className="ct-handWrap" aria-label={ariaLabel}>
        <div className="ct-handFan ct-handFan--full">
          {hand.map((c) => {
            const can = state.phase === "play" && isHuman && toPlay === seat && legal.some((x) => x.suit === c.suit && x.rank === c.rank);
            return (
              <FanMiniTile
                key={`${seat}-${c.suit}${c.rank}`}
                card={c}
                playable={can}
                onActivate={(card) => playHumanCard(seat, card)}
              />
            );
          })}
          {Array.from({ length: ghostCount }).map((_, i) => (
            <div
              key={`${seat}-ghost-${i}`}
              className="ct-miniCard ct-miniCard--fan ct-miniCard--ghost"
              aria-hidden
            />
          ))}
        </div>
      </div>
    );
  };

  /** West in defend: same suit-row layout as main Defence / Counting side seats (no 13-wide strip in a narrow column). */
  const renderWestSuitHand = (ariaLabel) => {
    const seat = "W";
    const hand = state.hands[seat];
    const sorted = sortCardsSuitRank(hand);
    const isHuman = humanSeats.has(seat);
    const legal = state.phase === "play" && toPlay === seat ? legalPlays(hand, ledSuit) : [];
    return (
      <div className="ct-handWrap" aria-label={ariaLabel}>
        <div className="ct-suitHand">
          {SUIT_ORDER.map((suit) => {
            const suitCards = sorted.filter((c) => c.suit === suit);
            if (!suitCards.length) return null;
            return (
              <div
                key={`${seat}-suit-${suit}`}
                className="ct-suitLine"
                style={{ gridTemplateColumns: `repeat(${suitCards.length}, minmax(34px, 50px))` }}
              >
                {suitCards.map((c) => {
                  const can =
                    state.phase === "play" &&
                    isHuman &&
                    toPlay === seat &&
                    legal.some((x) => x.suit === c.suit && x.rank === c.rank);
                  return (
                    <FanMiniTile
                      key={`${seat}-${c.suit}${c.rank}`}
                      card={c}
                      playable={can}
                      onActivate={(card) => playHumanCard(seat, card)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const northSlot =
    variant === "declare"
      ? renderVisibleFan("N", "Dummy, North — your cards to play for dummy")
      : renderVisibleFan("N", "Dummy, North — declarer plays from dummy");

  const southSlot = variant === "declare" ? renderVisibleFan("S", "Your hand, South, declarer") : renderOpponentSeat("S");

  const westSlot =
    variant === "declare" ? renderOpponentSeat("W") : renderWestSuitHand("Your hand, West, defender");

  /** Match /defence/practice full-hands grid: wide West column + centre trick + East (cf. ct-table--westVisible). */
  const defendLayout =
    variant === "defend"
      ? "ct-table--bottomRowLayout ct-table--promptOnRight ct-table--westVisible bjp-table--defend"
      : "bjp-table--declare";

  return (
    <>
      <div className="bjp-contractBar" aria-label="Contract for this table">
        <div className="bjp-contractBar-row">
          <span className="bjp-contractLabel">Contract</span>
          <span className="bjp-contractValue">{contractLabel(state.contract)}</span>
          <span className="bjp-contractMeta">Target {state.contract?.targetTricks || 0} tricks</span>
        </div>
        <p className="bjp-contractDetail">
          {contractSummary(state.contract)} Trumps: {isTrumpContract(state.contract) ? CONTRACT_STRAIN_NAME[state.contract.strain] : "none"}.
          Core guideline: second hand low, third hand high.
        </p>
        <p className="bjp-scoreLine" aria-label="Current trick count">
          NS tricks: {state.nsTricksWon} · EW tricks: {state.ewTricksWon}
        </p>
      </div>
      {auctionAwait && (
        <div className="bjp-auctionPanel" aria-label="Auction">
          <div className="bjp-auctionHeading">Auction</div>
          <p className="bjp-auctionSub">
            Turn: {SEAT_NAME[auctionSeat]}. Target training contract: {contractLabel(state.targetContract)}.
          </p>
          <div className="bjp-auctionRow">
            {(state.auction || []).map((entry, idx) => (
              <span className="bjp-auctionCall" key={`auction-${idx}`}>
                {entry.seat}: {callLabel(entry.call)}
              </span>
            ))}
          </div>
          {auctionSeat && auctionHumanSeats.has(auctionSeat) && (
            <div className="bjp-auctionActions">
              <button
                type="button"
                className="ct-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  callPass();
                }}
              >
                Pass
              </button>
              <select
                className="bjp-bidSelect"
                value={selectedBidCode}
                onChange={(e) => setSelectedBidCode(e.target.value)}
                aria-label="Choose a bid"
              >
                {legalCalls.map((call) => {
                  const code = `${call.level}${call.strain}`;
                  return (
                    <option key={code} value={code}>
                      {callLabel(call)}
                    </option>
                  );
                })}
              </select>
              <button
                type="button"
                className="ct-btn"
                disabled={!selectedBidCall}
                onClick={(e) => {
                  e.stopPropagation();
                  callBid();
                }}
              >
                Bid
              </button>
            </div>
          )}
        </div>
      )}
      <div
        className={`bjp-root${variant === "defend" ? " bjp-root--defend" : ""}${trickAwait ? " bjp-root--clickContinue" : ""}`}
        onClick={trickAwait ? () => acknowledgeTrick() : undefined}
        onKeyDown={rootKeyHandler}
        role={trickAwait ? "button" : undefined}
        tabIndex={trickAwait ? 0 : undefined}
        aria-label={trickAckLabel}
      >
        <div className={`bjp-felt${variant === "defend" ? " bjp-felt--defend" : ""}`}>
        <div className={`ct-table bjp-table ${defendLayout}`}>
          <div className="ct-seat ct-seat--top">{northSlot}</div>

          <div className="ct-seat ct-seat--left">{westSlot}</div>

          <div className={`ct-trickWrap bjp-trickWrap${variant === "defend" ? " ct-trickWrap--bottomRowLayout" : ""}`}>
            <div className="ct-trickBoard" aria-label="Play area">
              <div className="ct-trickGrid" role="region" aria-label="Trick area">
                <div className="ct-trickPos ct-trickPos--top">
                  <TrickMiniTile card={trickCardBySeat.N} />
                </div>
                <div className="ct-trickPos ct-trickPos--left">
                  <TrickMiniTile card={trickCardBySeat.W} />
                </div>
                <div className="ct-trickPos ct-trickPos--right">
                  <TrickMiniTile card={trickCardBySeat.E} />
                </div>
                <div className="ct-trickPos ct-trickPos--bottom">
                  <TrickMiniTile card={trickCardBySeat.S} />
                </div>
              </div>
            </div>
          </div>

          <div className="ct-seat ct-seat--right">{renderOpponentSeat("E")}</div>

          <div className="ct-seat ct-seat--bottom">{southSlot}</div>
        </div>
      </div>

        {state.phase === "done" && (
          <div className="bjp-doneRow">
            <button
              type="button"
              className="ct-btn"
              onClick={(e) => {
                e.stopPropagation();
                onNewDeal();
              }}
            >
              New deal
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function BeginnerJustPlayHands({ trainer }) {
  return (
    <div className="bjp-shell">
      <div className="bjp-introBanner" role="status">
        <h2 className="bjp-introBanner-heading">Just play — new and under development</h2>
        <p className="bjp-introBanner-text">
          This mode is still experimental and does not work perfectly yet. You may see incorrect bids or cardplay
          choices, so treat it as a preview while we continue improving the engine.
        </p>
      </div>
      <JustPlayTable key={trainer} variant={trainer} />
    </div>
  );
}

export default BeginnerJustPlayHands;

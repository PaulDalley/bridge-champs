import React, { useCallback, useEffect, useReducer, useState } from "react";
import { nextClockwise } from "../../bridge/compassPlayOrder";
import { compassCW } from "../../bridge/seatCompassMaps";
import "./BeginnerJustPlayHands.css";

const COMPASSES = ["N", "E", "S", "W"];

/** Led-suit trick winner: low index = weak, high = strong. */
const TRICK_RANK_ORDER = "23456789TJQKA";

const SUIT_SYMBOL = { S: "♠", H: "♥", D: "♦", C: "♣" };

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

function bestInLedSuitAmongPlays(trickPlays) {
  if (!trickPlays.length) return null;
  const led = trickPlays[0].card.suit;
  let best = null;
  for (const p of trickPlays) {
    if (p.card.suit !== led) continue;
    if (!best || rankValueTrick(p.card.rank) > rankValueTrick(best.card.rank)) best = p;
  }
  return best;
}

function pickMinimumWinnerInSuit(cardsInLedSuit, highCard) {
  const winners = cardsInLedSuit.filter((c) => rankValueTrick(c.rank) > rankValueTrick(highCard.rank));
  if (!winners.length) return null;
  return pickLowestByRank(winners);
}

function chooseLead(hand) {
  const bySuit = { S: [], H: [], D: [], C: [] };
  for (const c of hand) {
    bySuit[c.suit].push(c);
  }
  let bestSuit = "S";
  let bestLen = -1;
  for (const s of SUIT_ORDER) {
    const len = bySuit[s].length;
    if (len > bestLen) {
      bestLen = len;
      bestSuit = s;
    }
  }
  const suitCards = bySuit[bestSuit];
  const desc = [...suitCards].sort((a, b) => rankValueTrick(b.rank) - rankValueTrick(a.rank));
  if (desc.length >= 4) return desc[3];
  return pickLowestByRank(suitCards);
}

function chooseBotCard(botSeat, hand, trickPlays) {
  const led = getLedSuit(trickPlays);
  if (!led) return chooseLead(hand);

  const legal = legalPlays(hand, led);
  if (!legal.length) return null;

  const inLed = hand.filter((c) => c.suit === led);
  if (inLed.length) {
    if (trickPlays.length === 1) {
      return pickLowestByRank(inLed);
    }
    const winning = bestInLedSuitAmongPlays(trickPlays);
    if (winning && samePartnership(botSeat, winning.seat)) {
      return pickLowestByRank(inLed);
    }
    if (winning && winning.seat !== botSeat) {
      const cover = pickMinimumWinnerInSuit(inLed, winning.card);
      if (cover) return cover;
    }
    return pickLowestByRank(inLed);
  }

  return pickLowestByRank(legal);
}

function trickWinnerNt(trickPlays) {
  const led = trickPlays[0].card.suit;
  let bestSeat = trickPlays[0].seat;
  let bestV = -1;
  for (const p of trickPlays) {
    if (p.card.suit !== led) continue;
    const v = rankValueTrick(p.card.rank);
    if (v > bestV) {
      bestV = v;
      bestSeat = p.seat;
    }
  }
  return bestSeat;
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
  const declarerCompass = "S";
  const openingLeader = compassCW(declarerCompass);
  return {
    phase: "play",
    seed,
    hands,
    trickPlays: [],
    trickLeader: openingLeader,
    declarerCompass,
    pendingTrickWinner: undefined,
  };
}

function gameReducer(state, action) {
  if (action.type === "NEW_DEAL") {
    return dealState(action.seed);
  }
  if (action.type === "ACK_TRICK") {
    if (state.phase !== "trickAwaitAck") return state;
    const winner = state.pendingTrickWinner;
    const allEmpty = COMPASSES.every((c) => state.hands[c].length === 0);
    return {
      ...state,
      trickPlays: [],
      trickLeader: winner,
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

  const winner = trickWinnerNt(newPlays);
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

function JustPlayTable({ variant }) {
  const { humanSeats, yourPartnership } = getVariantConfig(variant);

  const [state, dispatch] = useReducer(gameReducer, null, () => dealState(Date.now() >>> 0));

  const onNewDeal = useCallback(() => {
    dispatch({ type: "NEW_DEAL", seed: Date.now() >>> 0 });
  }, []);

  const toPlay = currentSeatToPlay(state);
  const ledSuit = getLedSuit(state.trickPlays);

  useEffect(() => {
    if (state.phase !== "play") return undefined;
    const seat = currentSeatToPlay(state);
    const { humanSeats: botCheckHumans } = getVariantConfig(variant);
    if (botCheckHumans.has(seat)) return undefined;
    const hand = state.hands[seat];
    if (!hand.length) return undefined;
    const pick = chooseBotCard(seat, hand, state.trickPlays);
    if (!pick) return undefined;
    const t = window.setTimeout(() => {
      dispatch({ type: "PLAY_CARD", seat, suit: pick.suit, rank: pick.rank });
    }, BOT_CARD_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [state, variant]);

  const playHumanCard = useCallback((seat, card) => {
    dispatch({ type: "PLAY_CARD", seat, suit: card.suit, rank: card.rank });
  }, []);

  const acknowledgeTrick = useCallback(() => {
    dispatch({ type: "ACK_TRICK" });
  }, []);

  const trickAwait = state.phase === "trickAwaitAck" && !!state.pendingTrickWinner;

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
  );
}

function BeginnerJustPlayHands({ trainer }) {
  return (
    <div className="bjp-shell">
      <div className="bjp-introBanner" role="status">
        <h2 className="bjp-introBanner-heading">Just play — new and under development</h2>
        <p className="bjp-introBanner-text">
          This table is an early preview. More modes, contracts, and coaching will arrive as we build it out.
        </p>
        <div className="bjp-contractBar" aria-label="Contract for this table">
          <div className="bjp-contractBar-row">
            <span className="bjp-contractLabel">Contract</span>
            <span className="bjp-contractValue">1 NT (no trumps)</span>
          </div>
          <p className="bjp-contractDetail">
            Every deal is played in notrump: follow suit to win tricks; there is no trump suit. South is declarer;
            West is on lead for the first trick.
          </p>
        </div>
      </div>
      <JustPlayTable key={trainer} variant={trainer} />
    </div>
  );
}

export default BeginnerJustPlayHands;

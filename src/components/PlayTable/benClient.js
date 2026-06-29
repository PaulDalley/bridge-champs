/**
 * Client for the BEN bridge engine REST API (lorserker/ben, gameapi.py).
 *
 *   /bid   -> next call given hand + auction
 *   /lead  -> opening lead given hand + auction
 *   /play  -> next card given hand + dummy + auction + cards played
 *
 * Configure the host with REACT_APP_BEN_API_URL (e.g. https://ben.bridgechampions.com).
 * When unset (or REACT_APP_BEN_MOCK=true), every call is answered locally by the
 * mock bot in mockBot.js, so the table is fully playable before BEN is hosted.
 *
 * ── Wire-format note ───────────────────────────────────────────────────────────
 * BEN's own docs are slightly inconsistent about a couple of separators (hand
 * underscores vs dots; auction dash count). All encoding lives in the small
 * functions below and is centralised behind ENCODING so that, once we can hit a
 * live BEN instance and confirm the exact strings it accepts, it's a one-line fix.
 */
import * as mock from "./mockBot";
import { STRAINS } from "./auctionEngine";

const BASE_URL = (process.env.REACT_APP_BEN_API_URL || "").replace(/\/$/, "");
const FORCE_MOCK = String(process.env.REACT_APP_BEN_MOCK || "").toLowerCase() === "true";
const DEFAULT_TOURNAMENT = process.env.REACT_APP_BEN_TOURNAMENT || "mp";
const REQUEST_TIMEOUT_MS = 60000; // cloud BEN's heaviest plays (full sim) can take ~15s+, plus a possible cold start

export function isBenConfigured() {
  return !!BASE_URL && !FORCE_MOCK;
}

export function benMode() {
  return isBenConfigured() ? "live" : "mock";
}

/**
 * Wire formats, confirmed against BEN's README-api.md:
 *   hand  : PBN with "." between suits (S.H.D.C), "T" for ten, "" = void.
 *   ctx   : auction as CONCATENATED 2-char tokens — pass "--", double "Db",
 *           redouble "Rd", bids as-is ("1C","3N"). e.g. 1C-Pass-1S => "1C--1S".
 *   played: concatenated 2-char cards, suit+rank, e.g. "SJSQSKSA".
 */
const ENCODING = {
  handSuitSep: ".",
  pass: "--",
  double: "Db",
  redouble: "Rd",
};

// ── encoders ──────────────────────────────────────────────────────────────────

/** Hand (array of {suit,rank}) -> PBN "AK97543.K.T3.AK7" (S.H.D.C, "T" for ten, "" = void). */
export function handToPBN(cards) {
  const bySuit = { S: [], H: [], D: [], C: [] };
  for (const c of cards) bySuit[c.suit].push(c.rank);
  const order = "23456789TJQKA";
  return ["S", "H", "D", "C"]
    .map((s) => bySuit[s].slice().sort((a, b) => order.indexOf(b) - order.indexOf(a)).join(""))
    .join(ENCODING.handSuitSep);
}

/** Internal call -> 2-char ctx token. bid="1S"/"3N", pass="--", double="Db", redouble="Rd". */
export function callToCtxToken(call) {
  if (!call) return "";
  if (call.kind === "pass") return ENCODING.pass;
  if (call.kind === "double") return ENCODING.double;
  if (call.kind === "redouble") return ENCODING.redouble;
  return `${call.level}${call.strain}`;
}

/** BEN bid response -> internal call. Accepts "1S", "PASS"/"--", "X"/"Db", "XX"/"Rd". */
export function tokenToCall(token) {
  const t = String(token || "").trim().toUpperCase();
  if (t === "P" || t === "PA" || t === "PASS" || t === "--" || t === "") return { kind: "pass" };
  if (t === "X" || t === "D" || t === "DB" || t === "DBL" || t === "DOUBLE") return { kind: "double" };
  if (t === "XX" || t === "R" || t === "RD" || t === "RDBL" || t === "REDOUBLE") return { kind: "redouble" };
  const m = t.match(/^([1-7])(C|D|H|S|N|NT)$/);
  if (m) return { kind: "bid", level: Number(m[1]), strain: m[2] === "NT" ? "N" : m[2] };
  return { kind: "pass" };
}

/** Auction entries -> concatenated ctx string "1C--1S" (pass = "--"). */
export function auctionToCtx(auction) {
  return auction.map((e) => callToCtxToken(e.call)).join("");
}

/** /bids parses ctx differently from /bid|/play: it STRIPS dashes and expects
 * pass = "P", double = "X", redouble = "XX". So passes must NOT be "--" here. */
function callToBidsToken(call) {
  if (!call) return "";
  if (call.kind === "pass") return "P";
  if (call.kind === "double") return "X";
  if (call.kind === "redouble") return "XX";
  return `${call.level}${call.strain}`;
}
export function auctionToBidsCtx(auction) {
  return auction.map((e) => callToBidsToken(e.call)).join("");
}

/** Card {suit,rank} -> "S7" / "DT". */
export function cardToToken(card) {
  return `${card.suit}${card.rank}`;
}

/** Played cards (chronological) -> "S7DTH4...". */
export function playedToParam(cards) {
  return cards.map(cardToToken).join("");
}

/** BEN card string -> {suit,rank}. Accepts "S7", "ST", "S10". */
export function tokenToCard(token) {
  const t = String(token || "").trim().toUpperCase();
  const suit = t[0];
  let rank = t.slice(1);
  if (rank === "10") rank = "T";
  return { suit, rank };
}

// ── HTTP ────────────────────────────────────────────────────────────────────

/**
 * Surface BEN problems in the browser console with the FULL request context, so a
 * real failing call can be inspected (status, BEN's own error body, and the exact
 * encoded params we sent). Previously every failure was swallowed into a generic
 * "connection issue" and silently replaced by the offline mock — which hid genuine
 * engine rejections (bad cardplay order, etc.) behind misleading "offline" UX.
 */
export function logBenIssue(label, info) {
  // eslint-disable-next-line no-console
  console.warn(`[BEN ${label}]`, info);
}

async function getJson(path, params) {
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${path}?${qs}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, { signal: ctrl.signal });
  } catch (e) {
    clearTimeout(timer);
    const timedOut = e && e.name === "AbortError";
    logBenIssue(timedOut ? "timeout" : "network error", { path, params, error: String((e && e.message) || e) });
    const err = new Error(timedOut ? `BEN ${path} timed out after ${REQUEST_TIMEOUT_MS}ms` : `BEN ${path} unreachable: ${(e && e.message) || e}`);
    err.timeout = timedOut;
    err.network = !timedOut;
    throw err;
  }
  clearTimeout(timer);
  if (!res.ok) {
    // BEN puts the real reason (e.g. {"error":"Cardplay order is not correct ..."})
    // in the body — capture it instead of throwing a bare status.
    let body = "";
    try { body = await res.text(); } catch (_) { /* ignore */ }
    logBenIssue("HTTP error", { path, status: res.status, params, body: body.slice(0, 500) });
    const err = new Error(`BEN ${path} HTTP ${res.status}: ${body.slice(0, 200)}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return await res.json();
}

// ── public API ────────────────────────────────────────────────────────────────
// Each takes a high-level context object; returns a normalised internal result.
// `seat`, `dealer`, `declarer` are N/E/S/W. `vul` is ""/"NS"/"EW"/"Both".

/** Ask BEN for the next call. ctx: { hand, seat, dealer, vul, auction }. */
export async function getBid(ctx) {
  if (!isBenConfigured()) return { call: mock.mockBid(ctx), source: "mock" };
  try {
    const data = await getJson("/bid", {
      hand: handToPBN(ctx.hand),
      seat: ctx.seat,
      dealer: ctx.dealer,
      vul: ctx.vul || "",
      ctx: auctionToCtx(ctx.auction),
      tournament: DEFAULT_TOURNAMENT,
      ...(ctx.fast ? { fast: "true" } : {}),
    });
    if (!data || data.bid == null) {
      const error = (data && (data.message || data.error)) || "no bid in response";
      logBenIssue("bid no-result", { seat: ctx.seat, ctx: auctionToCtx(ctx.auction), response: data, error });
      return { call: mock.mockBid(ctx), source: "mock-fallback", error };
    }
    // BEN returns alert as the string "True"/"False"; coerce to a real boolean.
    return { call: tokenToCall(data.bid), explanation: data.explanation, alert: /^true$/i.test(String(data.alert)), raw: data, source: "ben" };
  } catch (err) {
    return { call: mock.mockBid(ctx), source: "mock-fallback", error: String(err.message || err) };
  }
}

/** Ask BEN for the opening lead. ctx: { hand, seat, dealer, vul, auction }. */
export async function getLead(ctx) {
  if (!isBenConfigured()) return { card: mock.mockLead(ctx), source: "mock" };
  try {
    const data = await getJson("/lead", {
      hand: handToPBN(ctx.hand),
      seat: ctx.seat,
      dealer: ctx.dealer,
      vul: ctx.vul || "",
      ctx: auctionToCtx(ctx.auction),
      ...(ctx.fast ? { fast: "true" } : {}),
    });
    if (!data || data.card == null) {
      const error = (data && (data.message || data.error)) || "no card in response";
      logBenIssue("lead no-result", { seat: ctx.seat, ctx: auctionToCtx(ctx.auction), response: data, error });
      return { card: mock.mockLead(ctx), source: "mock-fallback", error };
    }
    return { card: tokenToCard(data.card), raw: data, source: "ben" };
  } catch (err) {
    return { card: mock.mockLead(ctx), source: "mock-fallback", error: String(err.message || err) };
  }
}

/**
 * Ask BEN for the next card in play.
 * ctx: { hand, dummy, seat, dealer, vul, auction, played, trickPlays, strain }.
 */
export async function getPlay(ctx) {
  if (!isBenConfigured()) return { card: mock.mockPlay(ctx), source: "mock" };
  try {
    const data = await getJson("/play", {
      hand: handToPBN(ctx.hand),
      dummy: ctx.dummy ? handToPBN(ctx.dummy) : "",
      seat: ctx.seat,
      dealer: ctx.dealer,
      vul: ctx.vul || "",
      ctx: auctionToCtx(ctx.auction),
      played: playedToParam(ctx.played || []),
      ...(ctx.fast ? { fast: "true" } : {}),
    });
    if (!data || data.card == null) {
      const error = (data && (data.message || data.error)) || "no card in response";
      logBenIssue("play no-result", { seat: ctx.seat, played: playedToParam(ctx.played || []), ctx: auctionToCtx(ctx.auction), response: data, error });
      return { card: mock.mockPlay(ctx), source: "mock-fallback", error };
    }
    return { card: tokenToCard(data.card), raw: data, source: "ben" };
  } catch (err) {
    return { card: mock.mockPlay(ctx), source: "mock-fallback", error: String(err.message || err) };
  }
}

/**
 * Verify a declarer's claim of `tricks` ADDITIONAL (remaining) tricks for the
 * declaring side — NOT the deal total. BEN compares it to how many more tricks
 * it computes the declaring side can take from the current position.
 * Same context as getPlay (declarer seat + full original hands + played) plus tricks.
 * Returns { accepted, tricks, result } — accepted=true means BEN agrees the claim makes.
 */
export async function getClaim(ctx) {
  if (!isBenConfigured()) {
    return { accepted: true, tricks: ctx.tricks, result: "Claim accepted (offline mock).", source: "mock" };
  }
  try {
    const data = await getJson("/claim", {
      tricks: ctx.tricks,
      hand: handToPBN(ctx.hand),
      dummy: handToPBN(ctx.dummy),
      seat: ctx.seat,
      dealer: ctx.dealer,
      vul: ctx.vul || "",
      ctx: auctionToCtx(ctx.auction),
      played: playedToParam(ctx.played || []),
    });
    if (!data || data.error) return { accepted: false, error: (data && data.error) || "no response" };
    if (data.message) return { accepted: false, message: data.message };
    const result = String(data.result || "");
    return { accepted: /accept/i.test(result), tricks: data.tricks, result, raw: data };
  } catch (err) {
    // Engine unreachable (offline). Mirror getBid/getLead/getPlay: fall back to
    // the offline mock so claiming still works during an outage, instead of being
    // the one action that hard-fails. Offline claims are accepted on trust (no
    // double-dummy validation) — same behaviour as when BEN isn't configured.
    return {
      accepted: true,
      tricks: ctx.tricks,
      result: "Claim accepted (offline — engine unreachable).",
      source: "mock-fallback",
    };
  }
}

/** Every legal bid for the current auction with BEN's meaning, as a map
 * { token: { meaning, alert } } — e.g. { "2C": { meaning: "Stayman ...", alert: true } }.
 * ctx: { auction }. Returns {} when not configured or on error. */
export async function getBids(ctx) {
  if (!isBenConfigured()) return {};
  try {
    const data = await getJson("/bids", { ctx: auctionToBidsCtx(ctx.auction), dealer: ctx.dealer || "" });
    if (!Array.isArray(data)) return {};
    const map = {};
    for (const b of data) {
      if (b && b.bid != null) map[String(b.bid)] = { meaning: b.m, alert: !!b.Alert };
    }
    return map;
  } catch {
    return {};
  }
}

export { STRAINS };

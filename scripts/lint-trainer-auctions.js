/* Guardrail: scan every trainer problem's auction string and flag
 *   (1) MALFORMED auctions (invalid calls — hard breakage), and
 *   (2) REVIEW auctions (high-level opening or a double) — a 5-second human glance
 *       that catches a wrong auction pasted into the wrong problem (e.g. the
 *       "5♦ X P ?" that landed in a Splinters problem).
 * Text-based (the problem arrays contain JSX, so they can't be require()'d).
 * Usage: node scripts/lint-trainer-auctions.js
 * Exit code 1 if any MALFORMED auction is found (so CI can gate on it).
 */
const fs = require("fs");
const path = require("path");

const FILES = [
  "src/components/Bidding/BiddingTrainer.js",
  "src/components/CardPlay/CardPlayTrainer.js",
  "src/components/Defence/DefenceTrainer.js",
  "src/components/Counting/CountingTrumpsTrainer.js",
];
// A valid auction call: pass, (re)double, the "?" turn marker, the "_" pad, or a
// bid (NT and the "N" shorthand both allowed, suits as symbols or letters).
const VALID = /^(P|Pass|X|XX|\?|_|[1-7](NT|N|[♣♦♥♠CDHScdhs]))$/;
// Single-word non-call auctions (e.g. "Recap") are intentional labels, not errors.
const isLabel = (a, toks) => toks.length === 1 && /^[A-Za-z]+$/.test(a);

const malformed = [];
const labels = [];
const review = [];
let total = 0, withAuction = 0;

for (const rel of FILES) {
  const file = path.join(__dirname, "..", rel);
  if (!fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let id = "", title = "";
  for (const line of lines) {
    let m;
    if ((m = line.match(/^\s*id:\s*"([^"]+)"/))) id = m[1];
    else if ((m = line.match(/^\s*title:\s*"([^"]+)"/))) title = m[1];
    else if ((m = line.match(/^\s*auction:\s*"([^"]*)"/))) {
      total++;
      const a = m[1].trim();
      if (!a || a === "—") continue; // intentionally no auction — fine
      withAuction++;
      const toks = a.split(/\s+/).filter(Boolean);
      const bad = toks.filter((t) => !VALID.test(t));
      if (bad.length) {
        if (isLabel(a, toks)) labels.push({ rel, id, title, a });
        else malformed.push({ rel, id, title, a, bad });
      } else {
        const firstBid = toks.find((t) => /^[1-7]/.test(t));
        const opensHigh = firstBid && Number(firstBid[0]) >= 4;
        const hasDouble = toks.includes("X") || toks.includes("XX");
        if (opensHigh || hasDouble) review.push({ rel, id, title, a });
      }
    }
  }
}

console.log(`Scanned ${total} problems (${withAuction} with an auction) across ${FILES.length} trainer files.\n`);
console.log(`*** MALFORMED auctions (invalid calls — FIX): ${malformed.length} ***`);
malformed.forEach((x) => console.log(`  [${x.id}] "${x.title}"\n     auction="${x.a}"  bad: ${x.bad.join(", ")}  (${x.rel})`));
console.log(`\n--- REVIEW (opens 4+ level or contains a double — confirm it belongs): ${review.length} ---`);
review.forEach((x) => console.log(`  [${x.id}] "${x.title}"  auction="${x.a}"`));

process.exit(malformed.length ? 1 : 0);

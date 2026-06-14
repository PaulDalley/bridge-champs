# CLAUDE.md — Bridge Champions

Context for Claude Code working in this repo. (Cursor reads `.cursor/rules/*.mdc`;
Claude Code reads this file. Keep the two in sync when conventions change.)

## What this repo is
- **React frontend + Firebase Hosting** for **bridgechampions.com** (brand name: "Bridge Champions").
- This repo is **frontend + hosting only**. It does NOT contain the backend.

## Deploy (important)
- **Push to `main` → GitHub Actions auto-deploys Hosting** (`.github/workflows/deploy-firebase-hosting.yml`).
  So: commit + push to `main` = ship to production. There is no separate manual deploy step for the site.
- Run a production build locally before pushing risky changes: `npm run build`.

## The backend lives in a SEPARATE repo
- Cloud Functions (Stripe billing, PayPal, admin tools, emails) are in
  **`github.com/PaulDalley/bridgechampions-cloud-functions`** → `functions/index.js`.
- Firebase project: **`bridgechampions`**.
- The GitHub repo can be **stale vs production** (some deployed functions aren't committed there).
  Therefore: **only ever deploy targeted functions**, never the whole group:
  `firebase deploy --only functions:NAME` (a full `--only functions` could prune prod-only functions).
- **Deploy gotcha:** if `firebase deploy` fails with a Service-Usage / permissions 403, it's usually the
  `GOOGLE_APPLICATION_CREDENTIALS` env var pointing at the Admin-SDK key (which can't deploy infra).
  Fix: `unset GOOGLE_APPLICATION_CREDENTIALS` and use `firebase login` (owner account), then deploy.

## Articles live in Firestore, not the repo
- Article bodies are stored in Firestore collections (e.g. `cardPlayBody`, `biddingBody`); the URL `:id`
  is a slug, the doc id is a hash (see `firebase.json` redirects). **Edits are immediate/live.**
- Editing is done with admin scripts using `serviceAccountKey.json` (gitignored, NOT in git — must exist
  locally to run them). See existing `scripts/*` and `docs/article-payloads/*` for patterns. Always back up
  the current body before overwriting.
- Body HTML is rendered via **interweave `<Markup>`** (supports `<img>`, `<a>`, and `<MakeBoard .../>`).
  Article images are static files under `public/images/` referenced as `/images/...` (must be pushed/deployed).
  `.interweave img` already makes them responsive/centered.

## Trainers (bidding / counting / defence / declarer)
- They all share **`src/components/Counting/CountingTrumpsTrainer.js`** (+ `CountingTrumpsTrainer.css`).
  `BiddingTrainer.js`, `DefenceTrainer.js` etc. just wrap it. **A CSS change there affects every trainer.**
- Problem data lives in big arrays (e.g. `BIDDING_PUZZLES` in `BiddingTrainer.js`). Key per-problem fields:
  `customPrompts` (`type: "INFO"` or `"PLAY_DECISION"`), `playDecisionInput: "biddingBox"`,
  `expectedChoice`/`expectedChoiceDisplay`, `revealText`, `auctionResolvedTextByPromptId` (advance the
  displayed auction per prompt), `shownHandsOverride`, `revealFullHandSeats`, `videoUrlBeforeStart`.
- Reusable **`src/components/Bidding/AuctionDiagram.js`** renders board-style auction grids in articles.
- Hand notation: ten = `10` or `T`; e.g. `S: "K103"`, `H: "AKJ94"`.

## Conventions (see `.cursor/rules/*.mdc` for the full set) — the critical ones:
- **NEVER write bridge content. Full stop.** Claude does NOT author bridge teaching or explanatory prose
  anywhere — not in articles, not on hub/landing/pillar pages, not in headings, intros, summaries, blurbs,
  or card descriptions — even when building a feature and even if it seems helpful. The user writes ALL
  bridge content. Claude builds structure/code only and inserts the user's wording **verbatim**; if a new
  page needs copy, leave it blank (or a neutral, non-bridge structural label) and ask the user for the
  words. Likewise NEVER edit / reword / "improve" existing bridge content. Flag possible typos as a note;
  don't silently fix them.
- **Bid shorthand → colored suit symbols:** when the user types a bid like `2C`/`3S`/`1NT`, render it with
  the proper symbol (`2♣`, `3♠`, `1NT`) via `TextWithColoredSuits` (or raw `♣♦♥♠` in strings, which
  auto-color). ♥/♦ red, ♠ black, ♣ green.
- Don't use shell `echo`/`sed` to write Unicode/JSX content (mojibake risk) — use the editor tools.

## Secrets / never commit
- `serviceAccountKey.json`, `firebase key.json` (local Firebase admin keys) — gitignored; never commit.
- `scripts/backup-deleted-membersData.json` and any member-data dumps — contain real PII; never commit.

## Handy commands
- Dev server: `npm start` (localhost:3000). Build: `npm run build`.
- The dev server reads **production Firestore**, so article edits show on localhost immediately.

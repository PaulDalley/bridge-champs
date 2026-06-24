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

## Internal links / "Read next" (SEO — always do this by default)
- **Every article must end with onward internal links — never leave one a dead end.** Whenever you publish
  OR edit an article, append a "Read next" line plus a link to the article's topic hub. Internal linking is
  the biggest on-page SEO lever we control (crawl depth, link equity, dwell time), so do it by default on
  every article without being asked.
- Format (matches existing bodies + `scripts/_add-read-next-links.js`):
  `<p><strong>Read next:</strong> <a href="/learn/<cat>/<slug>">Exact Article Title</a> &middot; <a ...>…</a></p>`
  then a hub link `<p><a href="/learn/<cat>/<hub-slug>">Browse all <topic> &rarr;</a></p>`. Use **2–4** related
  links, chosen from the SAME topic hub / cluster (`src/data/topicHubs.js`, `content-app/lib/topicHubs.js`,
  and the clusters in `scripts/_add-read-next-links.js`).
- **Anchor text = the linked article's EXACT existing title, verbatim.** This is structural navigation, NOT
  bridge content, so it does NOT violate "never write bridge content" — you're reusing the user's own titles,
  not authoring prose. The only non-title text allowed is neutral nav labels ("Read next:", "Browse all <topic>").
- Links point to the live `/learn/<category>/<slug>` URL. **Verify each resolves (200) before saving** — a
  broken internal link is worse than none.
- Push a body edit live without a churny redeploy via on-demand ISR (the content-app re-renders that one path):
  `curl -X POST -d '' "<bc-content origin>/api/revalidate?secret=$REVALIDATE_SECRET&path=/learn/<cat>/<slug>"`.
  Note: the PUBLIC `/api/revalidate` is NOT routed to the content-app — hit the Cloud Run **origin** directly,
  and POST needs a body (`-d ''`) or Cloud Run returns 411. The secret is a Cloud Run env var (not in the repo).

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
- **NEVER edit the user's wording (HARD RULE). Default to verbatim.** Preserve the user's exact words
  everywhere — articles, trainer problems, copy, headings, anything. This holds **even when the user
  explicitly says "proofread", "spell-check", or "improve the English"**: that permits ONLY fixing
  unambiguous misspellings/typos (e.g. "espeically" → "especially"), and even those are presented as a
  **list for the user to approve — never silently applied**. It does NOT authorize changing phrasing,
  tense, sentence structure, flow, punctuation style, word choice, or voice — those are the user's. Do not
  "tidy up", "smooth", or "clean up" prose. When in any doubt, leave the text exactly as written and flag
  it as a note. Reword only when the user points at specific text and explicitly asks for that change. The
  user's words ship verbatim. (`.cursor/rules/*.mdc` should be kept in sync with this.)
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

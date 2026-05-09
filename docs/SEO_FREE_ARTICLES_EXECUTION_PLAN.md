# Execution plan — free articles, linking, and SEO (do in order)

Use this as your **single checklist**. Tick boxes as you go. Supporting detail lives in [FREE_ARTICLES_LINKING_AND_TOPIC_DISCOVERY.md](./FREE_ARTICLES_LINKING_AND_TOPIC_DISCOVERY.md).

**Owner:** you (and whoever deploys Firestore / hosting).

---

## Phase 1 — Flip articles to free (data)

Goal: every category article body is readable **logged out**, via `isFree: true` on **both** summary + body docs (see `firestore.rules`).

**Recommended:** run the Admin script (requires `serviceAccountKey.json` in repo root, gitignored):

```bash
node scripts/set-all-articles-free.js          # dry-run: counts only
node scripts/set-all-articles-free.js --apply  # writes isFree to Firestore
```

Collections covered: `bidding`, `biddingBasics`, `biddingAdvanced`, `cardPlay`, `cardPlayBasics`, `defence`, `defenceBasics`, `counting`, plus legacy `articles` + `article`.

| Step | Action | Done |
|------|--------|------|
| 1.1 | **Dry-run** the script (`node scripts/set-all-articles-free.js`). Confirm counts look right. | ☐ |
| 1.2 | **Apply:** `node scripts/set-all-articles-free.js --apply`. Or **per article:** admin checkbox **“Make this article free”** on each article page (`DisplayCategoryArticle.js`). | ☐ |
| 1.3 | **Spot-check logged-out (private window):** at least one article per category route you care about — full **text** visible, **no** redirect to `/membership`. Sample URLs: `/declarer/articles/:id`, `/defence/articles/:id`, `/bidding/advanced/:id` or `/bidding/basics/:id`, `/counting/articles/:id`. | ☐ |
| 1.4 | **Videos:** For articles with video, confirm behaviour matches policy — free articles already unlock video playback when `isFree` (`canWatchVideo`). Premium-only videos stay gated for non-members on **non-free** articles. | ☐ |
| 1.5 | **Beginner routes** (`/beginner/articles/...`): if those articles use separate Firestore paths, confirm rules allow read when free — **test logged-out** on those URLs too. | ☐ |

---

## Phase 2 — Align product copy with “articles are free”

Goal: paid value = **trainers, quizzes (if paid), treadmill, videos tier**, not “access to articles.”

**Implemented in repo (deploy to go live):** `RecentlyAdded.js`, `PremiumMembership.js`, `HomePage.js` (post-checkout thanks), `Flyer.js`, `OtherHub.js`.

| Step | Action | Done |
|------|--------|------|
| 2.1 | Review **`RecentlyAdded.js`** trial CTA — trainers + quizzes, not articles. | ☐ |
| 2.2 | Review **`PremiumMembership.js`** — Basic: trainers library; Premium: extended coaching videos wording. | ☐ |
| 2.3 | **Search** the repo for stray **“unlock … articles”** / **“all articles”** sale lines (ignore `.broken`). | ☐ |
| 2.4 | **Deploy** Firebase Hosting after script + copy are ready. | ☐ |

---

## Phase 3 — Categories, hubs, and internal linking (content + light UX)

Goal: crawlers and humans see **topic clusters**, not isolated pages.

| Step | Action | Done |
|------|--------|------|
| 3.1 | **Hub pages:** `/declarer`, `/defence`, `/bidding`, `/counting` — ensure each has a short **intro** + obvious links into **article lists** (`/declarer/articles`, `/defence/articles`, `/bidding/advanced` & `/bidding/basics`, `/counting/articles`). Adjust copy only if navigation is buried. | ☐ |
| 3.2 | **Duplicates:** List article pairs that cover the **same intent**; pick **one canonical** URL; merge content or add internal links + redirects later — avoid competing with yourself. | ☐ |
| 3.3 | **Linking rule for new/edited articles:** Each article should link **up** (hub or category index) and **sideways** to **2+ related** articles where natural — add during editorial passes (no code required initially). | ☐ |
| 3.4 | **Optional spreadsheet:** Columns `topic`, `primary URL`, `related URLs`, `priority` — backlog for internal links and future “related articles” automation. | ☐ |

---

## Phase 4 — Technical SEO (incremental; ship as you can)

Goal: discovery + snippets + indexing hygiene without requiring a full Next rewrite.

| Step | Action | Done |
|------|--------|------|
| 4.1 | **Google Search Console:** Property verified for `bridgechampions.com`; submit **`public/sitemap.xml`** (or updated sitemap URL). | ☐ |
| 4.2 | **`public/sitemap.xml`:** Today it’s **hand-maintained** and includes legacy paths (e.g. `/cardPlay` — site may **redirect** to `/declarer`). **Plan an update:** (a) use **canonical** paths (`/declarer`, `/declarer/articles`, …); (b) add **important article URLs** OR document that dynamic articles aren’t all listed yet + schedule **generation script** later. At minimum fix **outdated** locs so GSC isn’t fed dead patterns. | ☐ |
| 4.3 | **`public/robots.txt`:** Confirms `Sitemap:` URL; adjust only if policy changes (e.g. staging host must stay **noindex** / blocked elsewhere). | ☐ |
| 4.4 | **Practice routes:** Decide policy — add **`noindex`** meta for `/declarer/practice`, `/defence/practice`, `/bidding/practice`, `/counting/practice`, etc., so **trainers don’t cannibalise** article SERPs (implementation: Helmet on trainer shells or layout wrapper). Optional but recommended. | ☐ |
| 4.5 | **Breadcrumbs + JSON-LD:** Add visible breadcrumbs + `BreadcrumbList` structured data on article template (`DisplayCategoryArticle.js`) — optional phase when ready. | ☐ |
| 4.6 | **`Article` JSON-LD:** Optional; validate with Rich Results Test after adding. | ☐ |

---

## Phase 5 — Measure and grow content

| Step | Action | Done |
|------|--------|------|
| 5.1 | After deploy + indexing lag (**~2–8 weeks**), open **GSC → Performance**: export queries/pages for baseline. | ☐ |
| 5.2 | **Monthly:** Top impressions → improve titles/descriptions or content depth; **gaps** → new article backlog ([FREE_ARTICLES_LINKING_AND_TOPIC_DISCOVERY.md §3](./FREE_ARTICLES_LINKING_AND_TOPIC_DISCOVERY.md)). | ☐ |
| 5.3 | Keep a single **content backlog** (sheet or doc): candidate topics from autocomplete / PAA / GSC gaps — assign **priority**. | ☐ |

---

## Dependency summary

```text
Phase 1 (data) ──► Phase 2 (copy) ──► deploy
       │
       └────────────► Phase 3 (hubs/links) in parallel with Phase 4 (technical) when ready
                                           │
                                           └────► Phase 5 (ongoing)
```

---

## Revision history

| Date | Change |
|------|--------|
| 2026-05-09 | Initial executable plan (phases 1–5 + code file pointers). |
| 2026-05-09 | Added `scripts/set-all-articles-free.js`; Phase 2 copy updates landed in listed components. |

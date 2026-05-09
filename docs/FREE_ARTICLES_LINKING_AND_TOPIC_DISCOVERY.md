# Free articles, internal linking, and topic discovery

**Status:** Working plan — execute and revise as Search Console data arrives.

**Step-by-step checklist:** [SEO_FREE_ARTICLES_EXECUTION_PLAN.md](./SEO_FREE_ARTICLES_EXECUTION_PLAN.md)

**Related:** [SEO_TECH_STACK_ROLLOUT_PLAN.md](./SEO_TECH_STACK_ROLLOUT_PLAN.md), [NEXT_SITE_ARCHITECTURE.md](./NEXT_SITE_ARCHITECTURE.md).

---

## 1. Making articles free (how it works today)

### 1.1 Product + security

- **Paywall rule:** Category article **bodies** live in `*Body` collections (`cardPlayBody`, `defenceBody`, `biddingBody`, `countingBody`, etc.). Reads are allowed when the user has a **valid subscription**, is **admin**, or the **body document** has `isFree == true` (see `firestore.rules`).
- **UI rule:** List cards and article views treat an article as free when **`isFree === true`** on metadata and/or body (`DisplayCategoryArticle`, `CategoryArticleListItem`, etc.).

So “make articles free” means: **`isFree: true` on both the summary row and the body doc** for each article. The admin checkbox on the article page (“Make this article free”) already updates **both** — use that per article, or batch in Firebase / a script if you need speed at scale.

### 1.2 Rollout checklist

1. **Decide scope:** All category articles vs staged by section (e.g. declarer first, then defence, bidding).
2. **Per article (or batch):** Set `isFree: true` on summary + body; optional `freeUpdatedAt` for audit.
3. **Smoke-test logged out:** Open the public URL in an incognito window — full text loads, no redirect to `/membership`.
4. **Videos:** Free articles get **`canWatchVideo`** so embedded teaching videos can play without premium (text already free); confirm behaviour matches your policy.
5. **Search Console:** After bulk changes, monitor **Page indexing** and **Enhancements** over the following weeks.

### 1.3 Bulk / operational note

If hundreds of articles need flipping, a **one-off Admin SDK script** (iterate summaries → set body + summary `isFree`) is faster than clicking each checkbox — only run against a verified backup/plan and deploy rules you already trust.

---

## 2. Internal linking — what “good” looks like

Goal: **No important article is an orphan**; hubs and siblings reinforce topic clusters.

| Mechanism | Already in product | Possible improvements |
|-----------|---------------------|-------------------------|
| **Category lists** | `CategoryArticles` lists per type (declarer, defence, bidding, …) | Keep lists ordered sensibly (difficulty / topic groups). |
| **Topic pills** | `DisplayCategoryArticle` tabs jump between declarer / defence / bidding / counting article indexes | Strong baseline cross-navigation. |
| **Hub pages** | Section hubs (`/declarer`, `/defence`, `/bidding`, …) | Ensure each hub copy links **down** into the article lists and highlights flagship articles. |
| **In-article prose** | Manual links in body content | When writing/editing, add **2+ contextual links** to related articles or hubs where natural. |
| **Related articles** | Optional / partial today | Future: derive “related” from shared tags, section, or manual `relatedIds` in metadata — not required to start. |

**Minimum viable linking discipline (until automation exists):**

1. Every **new** article: link **from** its hub or category index **and** link **out** to at least one related article or back to the hub.
2. **Pillar topics** (Stayman, Jacoby, suit preference, etc.): one **canonical** article + redirects or merges for duplicates; internal links should point to the canonical URL.

---

## 3. What new articles to add — prioritisation framework

Use **evidence + intent**, not guesses alone.

### Tier A — Your own data (highest signal once volume exists)

| Source | What to look for | Action |
|--------|------------------|--------|
| **Google Search Console** → Performance → Queries + Pages | Queries with **impressions** but low **CTR** or avg position 8–20 | Improve title/description and on-page H1/intro for existing URLs; write **new** articles only when no URL satisfies the query. |
| **GSC** Pages | URLs with impressions climbing | **Double down**: add depth, FAQs, internal links, update `dateModified`. |
| **GSC** Queries | Brand + generic (“bridge champions bidding”) vs topic queries | Topic queries indicate **content gaps** for new articles. |

If GSC is new or sparse, rely more on Tier B until data accumulates (often **8–12 weeks** after meaningful free content is indexed).

### Tier B — Market / intent discovery (no paid tools required)

| Method | How | Bridge-specific angle |
|--------|-----|------------------------|
| **Google autocomplete** | Type “bridge bidding …”, “declarer play …”, “defence against …” | Surfaces long-tail phrasing real users type. |
| **People Also Ask** + bottom-of-SERP related searches | Open incognito for your target locale | Question-shaped headings make strong **H2s** and article titles. |
| **Google Trends** (region + category if useful) | Compare a few topic phrases over 12 months | Avoid investing only in dead phrases; validate seasonality lightly. |
| **YouTube search suggestions** | Same seed keywords | Teaching topics often align with search demand. |
| **Competitors / books / curricula** | Scan chapter headings of standard texts (e.g. conventions by name) | Each **named convention** or law often deserves **one primary article** on your site (your canonical explainer). |
| **Club curriculum / beginner paths** | What teachers teach first | Maps to **hub → ordered articles** (your beginner tracks already hint at this). |

### Tier C — Paid SEO suites (optional)

Tools like Ahrefs, Semrush, or Moz can show **keyword difficulty** and **volume estimates** — useful for prioritisation, but **not mandatory**. Official ground truth for **your** site remains **Search Console**.

### Prioritisation scoring (simple)

For each candidate topic, rate briefly:

1. **Demand proxy:** Trends/autocomplete/PAA presence vs silence.  
2. **Fit:** Matches Bridge Champions tone and your trainers (supports conversion story).  
3. **Content debt:** No decent page on your site yet vs thin duplicate.  
4. **Effort:** One article vs needing diagrams/video.

Ship **high fit + clear gap** first; merge thin duplicates before adding near-duplicates.

---

## 4. Suggested backlog shape (example — replace with your GSC list)

Until you export real queries, a sensible **default order** for many bridge sites:

1. **High-volume teaching intents:** opening bids, responding, NT structure, Stayman, transfers, **declarer planning**, **defence leads**, **carding** basics.  
2. **Named conventions** you teach in trainers — each with a **reference article** that links to practice.  
3. **“Rules / situations”** learners google (revoke, claim, LOOT — where applicable to your audience).

Maintain a **single spreadsheet or Git-tracked list**: `topic`, `target keyword phrase`, `intent`, `priority`, `assigned`, `URL when live`.

---

## 5. Next engineering steps (SEO adjacent)

Not blocking “free + content,” but stack with your SEO roadmap:

- **Breadcrumbs** + **BreadcrumbList** JSON-LD on article templates.  
- **Sitemap** generation including all indexable article URLs + honest `lastmod`.  
- **`Article` JSON-LD** where title/author/date match visible content.

See [SEO_TECH_STACK_ROLLOUT_PLAN.md §7](./SEO_TECH_STACK_ROLLOUT_PLAN.md) acceptance criteria.

---

## Revision history

| Date | Change |
|------|--------|
| 2026-05-09 | Initial plan: free articles mechanics, linking, topic discovery, backlog shape. |

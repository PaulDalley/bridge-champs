# Takeout doubles complete guide — where to publish and SEO

This is **strategy only** (no bridge content). The combined draft body is in `takeout-doubles-complete-guide-body.html`.

## Recommended canonical home

**Primary URL:** `/bidding/advanced/{new-id}` (Learn → Bidding articles hub)

Reasons:

- Search intent for “takeout double”, “how to takeout double”, “takeout double tips”, and “responding to takeout double” fits the **main learn/bidding** audience better than beginner-only.
- You already have two thin/split pieces on advanced + beginner; one **pillar** page avoids cannibalisation.
- Subcategory in Firestore: **Competitive Bidding and Doubles** (matches your taxonomy).

`/learn` redirects to declarer by default — the article still lives at `/bidding/advanced/...` and appears under Bidding in the app.

## Beginner path

After the pillar is live, pick one:

1. **Redirect** `/beginner/articles/bidding/lpb7CbL5j8D4GuM8rFZ4` → new canonical URL (keeps one source of truth), or  
2. **Keep a short beginner landing** (~200 words + “read the full guide”) that links up to the pillar for SEO internal linking.

Do not maintain two full copies long term.

## Retire / redirect the old advanced article

When the new guide is published:

- Redirect `/bidding/advanced/bAld6xJ0zVd2NRekKXND` (“Responding to a Takeout Double…”) → new URL.  
- Update inbound links (read-next blocks, cluster articles, BCB-12 outline when you write it).

## Localhost review editor (optional)

A draft entry `BID-TAKEOUT-GUIDE-01` is in `src/data/review/reviewDraftArticles.js` for `/learn/review` on localhost. Paste body from the HTML file when ready.

Bump `STORAGE_KEY` in `ReviewDraftsPage.js` if the draft does not appear (already bumped for this add).

## Suggested title / meta (edit freely)

| Field | Suggestion |
|--------|------------|
| **Title** | Takeout Doubles in Bridge: Complete Guide (When to Double, How to Respond, Tips) |
| **Primary keyword** | takeout double bridge |
| **Secondary phrases** (work into H2/H3 naturally) | takeout double tips; how to takeout double; how to make a takeout double; responding to takeout double; negative double bridge; takeout double requirements; when to make a takeout double |
| **Teaser** | (You write — one sentence: making + responding + common mistakes.) |
| **Meta description** | ~155 chars covering: what a takeout double is, when to use it, how partner responds, practical tips. |

## Publish workflow (when ready)

1. Edit `takeout-doubles-complete-guide-body.html` (merge Parts 1–3, remove part labels).  
2. Publish via your existing bidding article script pattern (`publish-lebensohl-approved-article.js` / `publish-bidding-conventions-batch.js` as template) or site admin.  
3. Set `seoSubtopic`: **Takeout Doubles**, `primaryKeyword` as above.  
4. Add to sitemap / run sitemap generator if you have one.  
5. Point beginner + old advanced URLs at the new doc.  
6. Add read-next links from Lebensohl, KISS 1, Four-Level Doubles, overcalls (when live).

## What not to duplicate

- **1NT Responder Methods** (`QmadBtW2QFMGu3o51NNi`) — negative doubles in competition; link out, do not repeat.  
- **Lebensohl** — when takeout is still best; link out.

## Practice

Link to `/bidding/practice` (Doubles judgment / Lebensohl puzzles) from a “Practice” section you add in Part 3.

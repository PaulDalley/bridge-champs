 # Cluster action plan — 2026-05-17

Decision doc to clean up overlapping article clusters and lift CTR site-wide. Generated after the 2026-05-13 audit and the 5 retitle wins applied 2026-05-17.

**How to use this doc.** Each row is either "DONE" (already applied), "RECOMMEND" (waiting on your approval — tick the action you want and tell me to run it), or "WATCH" (not enough signal yet — revisit after GSC data).

---

## A. Done today (2026-05-17)

These were safe wins (title / teaser / meta only, no body rewrites). All five are live in Firestore now.

| URL | Before | After |
|---|---|---|
| `/bidding/advanced/At7zrVNseOY1Ymtn8uzZ` | How to find a major-suit fit after 1NT: Stayman, Smolen, Puppet & Texas (complete guide) (88c) | Find a Major Fit After 1NT: Stayman, Smolen, Puppet, Texas (58c) |
| `/bidding/advanced/q8Aw4XZIKKKV9RhHhPQ9` | Transfers After 1NT: When to Use Them and When to Choose Stayman Instead (72c) | 1NT Transfers vs Stayman: When to Use Each (42c) |
| `/bidding/advanced/cA7uXxJsTo1WfsouWBI8` | Bidding Basics: Build a Clear Auction Plan and Treat Bidding as a Conversation (78c) | Bidding Basics: Build a Clear Auction Plan (42c) |
| `/beginner/articles/defence/gPn9Nu22z0FhbTm5gM12` | Opening Lead Direction for Beginners: Towards Weakness or Through Strength (74c) | Opening Lead Direction: Towards Weakness or Through Strength (60c) |
| `/beginner/articles/defence/6I6a1xX5RpPdea4b6JY5` | Opening Leads for Beginners: Top of a Sequence and Longest Suit in No-Trump (75c) | Opening Leads for Beginners: Top of Sequence and Longest Suit (61c) |

Implementation: `scripts/retitle-cluster-cleanup-2026-05-17.js` (re-runnable; dry-run by default).

---

## B. Recommend — Stayman / Major-fit cluster

Six articles, 1 clear canonical (the complete guide, now retitled). Below is my recommended Keep/Retitle/Merge for each remaining member. Tick what you want and I'll execute.

| URL | Title (current) | Words | Recommendation | Why |
|---|---|---:|---|---|
| `/bidding/advanced/At7zrVNseOY1Ymtn8uzZ` | Find a Major Fit After 1NT: Stayman, Smolen, Puppet, Texas | 1317 | **CANONICAL — KEEP** | Already done. This is the pillar. All others should link up to it. |
| `/bidding/advanced/QmadBtW2QFMGu3o51NNi` | Find a Major Fit as Responder: Mainstream Methods | 613 | **RETITLE** to `1NT Responder Methods: A Practical Overview` | Same keyword set as canonical. Repositioning as "practical overview" gives it a distinct intent (overview vs deep dive). 6 inbound links — too valuable to merge. |
| `/bidding/advanced/U2h4h8kDjcgPT9k4YLq0` | Stayman Convention: Find a 4-4 Major Fit After 1NT | 355 | **MERGE → canonical** | Thin (355w), duplicates canonical's Stayman section verbatim. 7 inbound — retain via 301. |
| `/bidding/advanced/AbPr2z4sByvVgT1U5Ehc` | Puppet Stayman: How to Check for 5-Card Majors | 504 | **KEEP** | Distinct convention; deserves its own page. Slightly thin but topic-distinct. Consider EXPAND later. |
| `/bidding/advanced/DcqQjNCQDyNMWk2fOvIO` | Smolen Convention: Show 5-4 Majors After Stayman | 390 | **KEEP + EXPAND** | Distinct convention; thin (390w). Add 2 worked examples and one diagram. |
| `/bidding/advanced/q8Aw4XZIKKKV9RhHhPQ9` | 1NT Transfers vs Stayman: When to Use Each | 672 | **KEEP — retitled today** | Now positioned by intent ("when to use each") not by Stayman keyword competition. |

**Quick approval syntax.** Reply: `Stayman cluster: do it` to run merges + retitles. Or pick individual rows.

---

## C. Recommend — "Dummy" cluster (9 articles)

This is the audit's biggest cluster on paper (9 articles), but the word "dummy" appears in two separate authored series that don't actually compete on intent:

| Series | URLs | Real intent | Verdict |
|---|---|---|---|
| Pattern Recognition 1–4 (declarer) | `/declarer/articles/PFr2ryFggdD5INr7n7Lj`, `S7FMVP4zj12Yp2zbVJxm`, `XOCkGbD6q6WRCy1ZLMAS`, `F7d2Mbv0cctuildsnFKK` + Practice Hand 2 | Declarer hand-pattern strategies | **KEEP ALL — false-positive cluster** |
| Dummy Type 1–4 (defence) | `/defence/articles/zkWYwNSDTcVqPCQqQ88e`, `3qWyxmtHjM4FXfOCXBww`, `yeEqhsXrHlYaQVYFrZLl`, `UkaQmXONFWeEQINsrj1U` | Defence: reading dummy by type | **KEEP ALL — false-positive cluster** |

**Recommendation:** No merges. The clustering tool only matched on the word "dummy"; the two series are pedagogically distinct (declarer-side strategy vs defence-side hand-reading). The only thing worth doing is making sure the two series are wired correctly in internal linking so Google sees them as separate clusters.

**One tweak worth doing:** "Pattern Recognition 4: Avoid Creating Extra Losers" is thin (528w) AND in the dummy cluster — add 200-300 words and an internal link to PR2 so the series feels complete. Marked EXPAND, not merge.

---

## D. Recommend — Small 2-article clusters

These all flagged as overlap but are legitimate beginner ↔ intermediate pairs (or declarer ↔ defender pairs). Different audiences and different funnels.

| Cluster | Articles | Recommendation |
|---|---|---|
| `cash` (2) | Intermediate "Cash Side-Suit Winners with Trumps Out" + Beginner "Cash Trumps Without Blocking" | **KEEP BOTH** — distinct intent (side suits vs trumps), distinct audience. |
| `duck` (2) | Intermediate "Duck a Winner in Defence" + Beginner "Hold Up Play in No-Trump" | **KEEP BOTH** — defence vs declarer, distinct intent. Add cross-link. |
| `1nt` (intermediate) | "Responding to 1NT on Balanced Hands" + (redirect stub) | **DONE** (already merged via redirect) |
| `lead` (beginner) | Live "Opening Lead Direction..." + redirect stub | **DONE** (already merged) |
| `opening` (beginner defence) | Live "Opening Leads for Beginners..." + redirect stub | **DONE** (already merged) |
| `third` (beginner) | Live "Third Hand High..." + redirect stub | **DONE** (already merged) |
| `second` (beginner) | Live "Second Hand Low..." + redirect stub | **DONE** (already merged) |
| `bid` (beginner) | Live "Responder's First Bid..." + redirect stub | **DONE** (already merged) |
| `opening` (beginner bidding) | Live "Opening Bids..." + redirect stub | **DONE** (already merged) |
| `1nt` (beginner) | Live "Opening 1NT for Beginners..." + redirect stub | **DONE** (already merged) |
| `spot` (declarer) | Live "Counting Losers..." + redirect stub | **DONE** (already merged) |

**Net for section D:** nothing further to do. The cluster volume was inflated by post-merge redirect stubs that the audit still counted.

---

## E. EXPAND queue (thin pages that already have inbound traffic)

After cluster cleanup, the highest-leverage next move is expanding thin pages that already rank for *something*. Each of these has 3+ inbound internal links and is in the 280–550 word range — adding 300–500 words to a page that's already linked usually moves it visibly within 2–3 weeks.

Top 6 (ordered by inbound × overlap risk):

1. `/bidding/advanced/wsCt4ouPgZU1cB86fj2A` Lebensohl: Compete Smart Without Guessing (679w, but only 1 inbound — needs more inbound, not more body)
2. `/bidding/advanced/upI5TKRWWkXQ2lXlUQjE` Weak Stayman (446w, 9 inbound) — biggest leverage win
3. `/bidding/advanced/bAld6xJ0zVd2NRekKXND` Responding to a Takeout Double (425w, 8 inbound)
4. `/bidding/advanced/B4nPwmcsPuwmprAcU32E` Should You Invite with 11? (361w, 3 inbound)
5. `/declarer/articles/7tl2KmOH5MrX3aVENk7S` Declarer Play Basics: Build a Plan at Trick One (340w, 5 inbound)
6. `/declarer/articles/aQcEPGFWdvVnDt2hn5oo` Bridge Shapes Fundamentals (449w, 1 inbound) — pair with BCT-02 in review queue

**Recommendation:** I can draft EXPAND blocks for any of these on request. They are content projects (not bulk-runnable scripts), so each one is a separate "draft → you review → publish" pass.

---

## F. New review queue (publish-ready non-overlap)

These are the 15 drafts currently in `/learn/review` (10 already there + 5 added today). All audited for overlap.

| ID | Title | Status | Overlap risk |
|---|---|---|---|
| BCB-08 | Bridge Overcalls for Beginners | outline | LOW — competitive bidding, no live beginner article |
| BCB-09 | Stayman for Beginners | full draft, awaiting review | MEDIUM — companion to advanced cluster; positioned as beginner-tier intro |
| BCB-10 | Jacoby Transfers for Beginners | outline | MEDIUM — same as BCB-09; beginner intent |
| BCB-11 | Vulnerability in Bridge | outline | NONE — clear gap |
| BCB-12 | Bridge Conventions for Beginners | outline | NONE — orientation article, doesn't compete |
| BCD-05 | Counting Winners and Losers | outline | LOW — beginner version of an intermediate topic |
| BCD-06 | Bridge Entries for Beginners | outline | NONE — clear gap |
| BCD-07 | Counting Trumps for Beginners | outline | NONE — only intermediate redirect exists |
| BCD-08 | Safety Plays for Beginners | outline | NONE — no current article at any tier |
| BCF-06 | Discarding for Beginners | outline | LOW — adjacent to signals articles |
| BCF-07 | Defensive Plan at Trick One | outline | LOW — adjacent to defence basics |
| BCF-09 | Returning Partner's Suit | outline | NONE — clear gap |
| BCT-01 | How to Spot Winners Fast (Card Rush companion) | outline | NONE |
| BCT-02 | Hand Shape Recognition | outline | LOW — pairs with intermediate "Bridge Shapes Fundamentals" |
| BCT-03 | Reading Opponent Distribution | outline | LOW — pairs with intermediate "Count the Unseen Hand" |

**Suggested publish order** (best SEO leverage first, easiest first):

1. **BCB-11 Vulnerability** — biggest gap, broad keyword, no overlap.
2. **BCB-12 Conventions orientation** — second-highest gap, internal-linking goldmine.
3. **BCD-07 Counting Trumps** — high-intent beginner search.
4. **BCD-08 Safety Plays** — high-search, no existing article.
5. **BCF-09 Returning Partner's Suit** — completes the defence trio with BCF-05 (signals, live) and BCF-07 (defensive plan).

Then BCD-05 / BCD-06 / BCF-06 / BCF-07 in any order. BCT-01/02/03 should ideally wait until the treadmill landers are fully indexed (still pending — Card Rush lander shipped 2 days ago; let it indexed first).

---

## G. Priority order for the next pass (recap)

1. **Approve Stayman cluster** (Section B). 1 merge, 1 retitle. Mostly automated.
2. **Approve EXPAND list** (Section E). Each one is a content project, do 1–2 per week.
3. **Publish from new queue** in the order in Section F.
4. **Drop a fresh sitemap + run the existing GSC re-submit script** after the Stayman merge — Google will re-crawl the canonical and 301s within a week.
5. **Wait 2-3 weeks**, then re-run the audit (`scripts/seo-article-audit.js` if it exists, or regenerate manually). Re-audit will surface the next round.

---

## What I need from you

- Approve Section B (Stayman cluster). One line is enough: `Stayman cluster: do it` or `Skip merge, do retitle only`.
- Pick 1–2 from Section E for me to draft EXPAND blocks for next time.
- (Optional) Review the new drafts in `/learn/review` and confirm the publish order in Section F.

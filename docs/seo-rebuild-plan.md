# SEO content-layer rebuild — blueprint

Status: **approved direction, scaffolding next.** Owner: Paul. Created 2026-06-22.

## Why
The site is a client-rendered CRA SPA that fetches every article body from Firestore
**in the browser at render time**; SEO is faked with Puppeteer snapshots. Googlebot
renders the page, hydration discards the baked HTML and re-fetches from Firestore, that
fetch fails in Google's render sandbox, and the page is indexed as an empty
`SkeletonLoader`. Patching (shell-noindex, preload, long-polling) treats symptoms. The
root fix is to render content **on the server/at build with the data already in the HTML**.

## Decisions (locked)
- **Scope:** rebuild the **content layer only**; keep trainers / Just-Play / auth /
  checkout as the existing CRA SPA, under the same domain.
- **Framework:** **Next.js (App Router)**, SSG + **ISR with on-demand revalidation**,
  Firestore read server-side via the **Admin SDK** (no client DB read for content).
- **URL scheme:** `/learn/<category>/<slug>` for articles (category-scoped, stable).
- **Open:** deploy target (Firebase App Hosting vs Hosting+Cloud Run vs Vercel) — see end.

## Coexistence (one domain, two apps)
All content lives under `/learn/**`, so the split is by path:

```
Firebase Hosting rewrites (front door):
  /learn/**         -> Next.js content app   (Cloud Run / App Hosting service)
  /sitemap.xml      -> Next.js               (content sitemap; or merge)
  /robots.txt       -> Next.js / static
  /og/**            -> existing OG images (or Next route)
  **                -> /_shell.html          (existing CRA SPA — unchanged)
```
Home (`/`), `/about`, and the whole app keep running on CRA in Phase 1. They can move to
Next later (Phase 3) — they are not the problem.

## Taxonomy: collection -> category
Article body lives in `*Body` collections; the summary carries `slug`, `isFree`,
`redirectTo`, `isHidden`. Category for the URL:

| Summary collections | `/learn/<category>` |
|---|---|
| `cardPlay`, `cardPlayBasics`, `counting` | `declarer` |
| `defence`, `defenceBasics` | `defence` |
| `bidding`, `biddingAdvanced`, `biddingBasics` | `bidding` |
| `beginnerCardPlay`, `beginnerDefence`, `beginnerBidding` | `beginner` |

Topic (conventions / leads / trumps …) is **not** in the URL — it's carried by breadcrumbs
+ hub membership (`src/data/topicHubs.js` → `getTopicForSlug`), so re-tagging a topic never
breaks a URL. Beginner is treated as its own category `/learn/beginner/<slug>` (matches the
existing beginner pillar); its sub-area (declarer/defence/bidding) is metadata, not URL.
**Open taxonomy choice:** keep beginner as one category, or split `/learn/beginner/<area>/<slug>`.

## URL migration / redirects
- New canonical per article: `/learn/<category>/<slug>`, self-referential `<link rel=canonical>`.
- **301** every legacy URL → new: `/bidding/advanced/<slug>`, `/declarer/articles/<slug>`,
  `/defence/articles/<slug>`, `/beginner/articles/<area>/<slug>`, `/counting/articles/<slug>`,
  and every doc-id URL currently in `firebase.json` (repoint chains to the FINAL new URL).
- Generated map: `scripts/gen-redirect-map.js` → `docs/redirect-map.json` (run from live data;
  flags slug collisions within a category).
- Existing `/learn/<cat>/<topic>` hubs stay (already under `/learn`).

## Next.js content app — structure
```
app/
  learn/
    layout.tsx                      shared content chrome (header/footer match brand)
    page.tsx                        /learn root hub  (ISR)
    [category]/page.tsx             /learn/bidding etc. category hub (ISR)
    [category]/[topic]/page.tsx     topic hub (ISR)  — if topic hubs move under here
    [category]/[slug]/page.tsx      ARTICLE (ISR) — generateStaticParams from Firestore
  sitemap.ts                        next sitemap from Firestore
  robots.ts
lib/firestore-admin.ts              Admin SDK init (service account via env)
lib/articles.ts                     read summaries+body, slug->article, category map
components/...                      reuse: board renderer, auction diagram, markup
```
- **Article page**: `generateStaticParams()` lists all articles from Firestore at build;
  the page server-renders the body HTML (interweave-equivalent) → real content in HTML.
- **`generateMetadata()`**: title, description, canonical, OpenGraph, Twitter, Article +
  BreadcrumbList JSON-LD — replaces every `scripts/*` SEO hack.
- **ISR**: `export const revalidate = 3600` (hourly) **plus** an on-demand revalidate route
  (`POST /api/revalidate?path=/learn/...&secret=...`) the admin editor calls on publish →
  edits go live in seconds without a full rebuild. This preserves "edits are immediate".
- **Disambiguation**: resolve `<slug>` within `<category>` across that category's collections.

## SEO specifics (done natively, not patched)
- Real per-route `<head>` (no react-helmet snapshot timing issues).
- Self-canonical = the `/learn/<category>/<slug>` URL.
- `app/sitemap.ts` lists every live article + hub (no slug-vs-shell drift).
- Real **404** for unknown `/learn/*` (Next `not-found`), `noindex`.
- Hub pages link to articles with real `<a href>` (server-rendered) — link graph baked in.
- OG images: reuse existing `/og/<bodyId>.png` or a Next OG route.

## Phases
1. **Scaffold** — Next app, Admin SDK read layer, the redirect map, Firebase route for `/learn/**`.
2. **Articles + hubs** — `/learn/<category>/<slug>` + `/learn` hubs, ISR, metadata, sitemap,
   301s, on-demand revalidate. **Ship → SEO problem solved.** Then GSC: resubmit sitemap +
   Validate Fix.
3. **(Later) Home/about → Next**, retire CRA prerender hacks (`scripts/prerender.js`,
   `audit-*`, shell-noindex), optionally fold remaining app surface in.

## Risks / notes
- URL change is low-risk **now** (articles barely rank today) and avoids doing it twice.
- Keep the Firebase backend, Cloud Functions, Stripe/PayPal, BEN/Cloud Run untouched.
- Admin SDK service account in the Next runtime env (NOT committed) — same key family as
  `scripts/` use locally.

## Open decision — deploy target
Recommendation: **Firebase Hosting + Cloud Run** (or **Firebase App Hosting**, Next-native)
so it stays on Google, one domain, `/learn/**` rewrites to the Next service. Vercel is the
smoothest Next host but means cross-host proxying back to the Firebase-hosted CRA app.

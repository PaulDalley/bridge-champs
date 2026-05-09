# SEO-first tech stack and rollout plan

**Status:** Planning-only — revise here until you explicitly start implementation.  
**Companion:** Technical IA, article format, templates, and paid/free boundaries live in [NEXT_SITE_ARCHITECTURE.md](./NEXT_SITE_ARCHITECTURE.md). This document focuses on **stack choices, hosting, migration phases, and acceptance criteria**.

---

## How to use this document

- Treat sections marked **Decision** as explicit checklist items to lock before coding.
- Update the **Revision history** at the bottom when you change direction.
- Do not treat anything here as committed scope until you mark **Approved for build** (or similar) in this file.

---

## 1. Goal (excellent technical SEO baseline)

Ship a **public reference layer** where:

- Each indexable URL returns **meaningful HTML and metadata in the first HTTP response** (not only after client JS boot).
- **Hubs, articles, sitemaps, and internal linking** scale without one-off engineering per page.
- The **same canonical domain** as today is preserved through **301 redirects** where URLs change.
- **Members / trainers** remain valid as CSR-heavy surfaces with an explicit indexing policy (see companion doc).

---

## 2. Current baseline (constraints you are moving away from)

| Fact | SEO implication |
|------|-------------------|
| Production is CRA (`npm run build`) → static assets + **SPA fallback** (`**` → `/index.html` in `firebase.json`). | Crawlers and previews rely on **rendering** public pages; not the strongest pattern for a large indexed library. |
| Article bodies and mixed editors → Firestore / HTML / blocks. | Harder to guarantee **one** predictable template, metadata pipeline, and build-time validation. |

This is **not** a judgment on product quality — it is a **delivery-model** limit for long-tail organic growth.

---

## 3. Target stack (default recommendation)

**Decision (draft):** adopt a **React meta-framework with SSG-first** public app for indexable routes.

| Layer | Recommendation | Notes |
|-------|----------------|-------|
| Framework | **Next.js (App Router)** | SSG + `generateMetadata`, incremental adoption, large ecosystem. |
| Public content | **MDX or Markdown + frontmatter** in Git | Validated at build; review via PRs. |
| First-phase rendering | **SSG** for all indexable public routes | Simplest Firebase story; HTML per URL at deploy. |
| Article / hub presentation | Shared layouts + **typography system** (e.g. Tailwind + `@tailwindcss/typography`) | Professional consistency vs ad hoc CSS. |
| Members / trainers | **Existing app first**; optionally mount under `/app` or subdomain later | Firestore for sessions/progress; **noindex** where appropriate. |

**Alternatives to justify in writing if you choose otherwise**

| Option | When it wins |
|--------|----------------|
| **Astro** | Maximum static performance + content collections; React “islands” for shared widgets. |
| **Remix** | SSR-first product — usually **more** hosting complexity on Firebase than SSG v1. |

---

## 4. Firebase Hosting integration (must pick one path)

These options change `firebase.json`, CI, and how refreshes/deep links behave — **lock one before large route work**.

| Pattern | Summary | Tradeoff |
|---------|---------|----------|
| **A — Static export** | Next static export (or Astro build) → upload `out/` (or equivalent). Configure rewrites so **known static paths** are not masked by a blanket SPA rule. | **Lowest ops**; requires public routes to be fully pre-renderable. |
| **B — Next SSR on Firebase** | Firebase Frameworks / Cloud Functions / Cloud Run adapter for dynamic HTML per request. | **Higher ops**; use only if SSG cannot represent indexable truth. |
| **C — Split hosting** | Same Firebase project, different site or subdomain for phased cutover (e.g. marketing on new stack, legacy app on path or subdomain). | More moving parts; useful if cutover must be gradual. |

**Decision:** _[ record chosen pattern: A / B / C + notes ]_

---

## 5. Repository and CI shape (planning hooks)

| Topic | Plan |
|-------|------|
| Monorepo vs nested app | e.g. `apps/web-public` (Next) beside existing `ishbridge-41` (CRA) until cutover — **Decision:** _[ ]_ |
| Deploy workflow | Extend [`.github/workflows/deploy-firebase-hosting.yml`](../.github/workflows/deploy-firebase-hosting.yml) (or sibling workflow) to **build the chosen public app** and deploy the correct output directory. |
| `firebase.json` | Adjust **`public`**, **`rewrites`**, **`redirects`**, and cache headers so static HTML routes are not incorrectly overridden. |

---

## 6. Design and aesthetics vs SEO

**Summary:** Search engines do not rank pages on visual taste. **Technical SEO** (HTML-first delivery, metadata, speed, IA) remains the primary lever in this plan. **Design** matters **indirectly** when it affects performance, usability, and trust.

### 6.1 What design does *not* need to solve

- There is **no** requirement for a particular “premium” or trendy visual style for rankings.
- **Homepage, hubs, and landing pages** do not need a full aesthetic redesign **for SEO alone** if they already deliver clear relevance, internal links, and fast loads.

### 6.2 Where design *does* support SEO (indirect)

| Area | Mechanism |
|------|-----------|
| **Core Web Vitals** | Heavy hero images, unoptimized assets, excessive animation/JS, or poor font loading hurt **LCP / INP / CLS** — these can affect rankings and UX. |
| **Mobile usability** | Readable type, tap targets, no broken layouts — supports engagement and mobile-first indexing. |
| **Above-the-fold clarity** | Obvious **H1** and purpose-aligned copy helps users and aligns with how titles/snippets should read (clarity, not decoration). |
| **Trust and engagement** | Coherent typography and layout can reduce bounce on informational queries; **weak and indirect** vs technical signals. |

### 6.3 Practical guidance for this project

- **Prioritize** shared templates (hub + article + home), typography rhythm, and **asset budgets** alongside the new stack — so public pages look **coherent** and stay **fast**, not necessarily “flashy.”
- **Highest-impact surfaces** for a consistent first impression: **home**, **pillar hubs**, and **flagship articles** — align appearance with the new design system when building the public shell, not as a separate vanity pass.

---

## 7. SEO engineering acceptance criteria (“done” for public layer)

- **View-source / curl** on a sample article URL shows substantive **body HTML** and `<title>` / meta description without executing the main JS bundle for meaning.
- **Unique** titles and descriptions per indexable URL (template-driven from frontmatter).
- **`sitemap.xml`** generated from the **actual** route/content graph at build time.
- **`robots.txt`** correct for prod vs staging; staging should not leak duplicate indexation.
- **Structured data** where accurate (`Organization`, `WebSite`, `BreadcrumbList`, `Article` as applicable).
- **Core Web Vitals** budget on hub + article templates (mobile).
- **CI fails** on duplicate slugs or invalid frontmatter (once validation exists).

---

## 8. Migration phases (no code — sequence for when you build)

| Phase | Outcome |
|-------|---------|
| **0** | Lock §4 hosting pattern and repo layout (§5). |
| **1** | Scaffold public app: one hub template, one article template, 2–3 sample MDX pages, sitemap proof. |
| **2** | Content migration design: Firestore/HTML → MDX export rules; manual QA list for top URLs. |
| **3** | Redirect map: legacy paths → new slugs; Search Console baseline. |
| **4** | Cutover deploy; monitor coverage and redirect errors. |
| **5** | Trainers/members: explicit routes + indexing policy; link CTAs from public templates. |

---

## 9. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Wrong Hosting rewrite breaks refresh/deep links | Staging deploy + checklist for direct URL load and soft navigation. |
| HTML→MDX migration damages diagrams | Component library for hands/diagrams in MDX; human QA on high-traffic pages. |
| Scope creep (merging trainers into Next too early) | Time-box **public SSG** first; trainers second. |

---

## 10. Open decisions (copy to checklist as you resolve)

- [ ] Framework locked (Next vs Astro vs other) — ADR note in companion doc.
- [ ] Hosting pattern A / B / C (§4).
- [ ] SSG-only vs SSR for any indexable route.
- [ ] URL prefix for reference (`/learn`, `/guides`, etc.).
- [ ] Content validation library (Velite / Zod / contentlayer successor — pick what is maintained).
- [ ] Authoring: dev-only MDX vs Tina/CMS later.
- [ ] Related links: manual vs tag-assisted automation.

---

## 11. Authoritative sources and gap review

Use this section when refining the plan so **official guidance** and **quality signals** are not lost behind pure technical delivery.

### 11.1 Who to treat as primary vs interpretive

| Tier | Sources | How to use |
|------|---------|------------|
| **Primary (platform rules)** | [Google Search Central](https://developers.google.com/search/docs) (including SEO starter guide, JavaScript SEO, sitemaps, structured data policies); [Google Search Status reports](https://status.search.google.com/); [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a). | Requirements and prohibitions (indexing, spam, structured data honesty). |
| **Quality bar (not a formula)** | [Search Quality Rater Guidelines](https://www.google.com/search/howsearchworks/) (PDF updated periodically). | Defines **E-E-A-T**-style expectations for **informational** content — use for **editorial standards**, not as a keyword checklist. |
| **Performance / UX evidence** | [web.dev](https://web.dev/) (Core Web Vitals, image/font guidance); Chrome-centric but widely adopted. | Budgets for templates, not decorative redesign for its own sake. |
| **Interpretive / third-party** | Moz, Ahrefs, Semrush blogs; practitioner tests. | Useful hypotheses; **verify** against Search Central and your own Search Console data. |

Google does not publish a secret “authoritative blog” that replaces Search Central; treat **official docs + your measurements** as the top tier.

### 11.2 Themes those authorities stress — alignment with this plan

Already **covered or partially covered** in [NEXT_SITE_ARCHITECTURE.md](./NEXT_SITE_ARCHITECTURE.md) / this doc:

- Crawlable HTML and metadata; stable URLs; `robots` / sitemap; honest structured data; Core Web Vitals on templates; avoid thin/scaled junk pages; canonical discipline.

### 11.3 Gaps to watch (easy to under-specify in a “tech stack” plan)

| Theme | What authorities emphasize | Add to planning / acceptance |
|--------|----------------------------|------------------------------|
| **Helpful, people-first content** | Reward satisfying intent; demote **mass low-value** or **search-engine-first** pages. | Editorial bar for hubs/articles (depth, accuracy); avoid publishing stubs at scale. |
| **Trust / expertise (informational)** | Clear **who** the site is; factual accuracy; visible **last updated** where topics evolve. | Strong **About** / trust surfaces; `dateModified` in frontmatter; review policy for bridge facts. |
| **Structured data honesty** | Markup must reflect **visible** content; no misleading FAQ/rich-result spam. | Validate in Search Console; only deploy FAQ/HowTo/video schema where real. |
| **Images** | Meaningful **alt**; efficient formats/sizing (ties to LCP). | Image component standards in MDX templates (dims, `loading`, alt rules). |
| **Video** | If video is central to a page, surround it with **unique text**; video structured data only when accurate. | Template rules when embedding YouTube (already common in product). |
| **Accessibility** | Not a confirmed direct ranking formula, but overlaps **semantic HTML** and usability. | Heading order, link text, contrast — fold into template QA. |
| **International / locale** | `hreflang` and locale URLs when you ship multiple languages/regions. | Out of scope until needed; then explicit URL + header strategy. |
| **Large-site mechanics** | Crawl budget, server signals; **log analysis** for huge libraries. | Defer until URL count is high; optional phase. |
| **Spam / abuse policies** | Doorway pages, **scaled thin content**, **site reputation abuse** (third-party parasites — different issue). | Reinforces “no thin programmatic”; keep reference on **your** domain with substance. |

### 11.4 Ongoing habits (authorities + practitioners agree)

- **Search Console** as the source of truth for indexing, enhancements, and queries — not rank-tracking alone.
- **Periodic review** of top organic URLs for freshness and accuracy (especially laws/conventions that change).

---

## 12. Full-site SEO maximization plan (concrete)

This section ties **every major SEO lever** to **what you will build** and **how the chosen stack exploits it**. It is the operational companion to [NEXT_SITE_ARCHITECTURE.md](./NEXT_SITE_ARCHITECTURE.md) (IA, templates, paid/free split).

**Intent:** “Maximize in every respect” here means: **technical crawlability + speed**, **content depth aligned to search intent**, **trust signals for informational bridge teaching**, **measurable iteration**, and **sustainable scale** — not keyword stuffing or gray-hat shortcuts.

### 12.1 Five pillars (all required)

| Pillar | What “maximized” means | Primary owner (typical) |
|--------|-------------------------|-------------------------|
| **A. Technical foundation** | Indexable HTML per URL, correct meta/canonical/robots/sitemap, valid structured data, fast CWV, stable IA. | Engineering + hosting |
| **B. Content & intent** | Hubs + articles match real queries; one primary intent per URL; depth over thin pages; internal links from pillars. | Editorial + engineering (templates) |
| **C. Experience & trust** | Clear who-we-are, accuracy, visible dates where facts evolve, accessible readable templates (indirect quality). | Editorial + design |
| **D. Distribution & reputation** | Earned links and mentions from clubs/teachers; brand searches find you; social previews look correct. | Ops + light engineering (OG) |
| **E. Measurement & feedback** | Search Console + analytics + periodic refresh of top URLs from query data. | You + occasional eng fixes |

### 12.2 How the target stack exploits each pillar

**Default stack:** Next.js App Router + Git-backed MDX/Markdown + SSG for indexable routes (see §3).

| SEO pillar | Mechanism in stack | Concrete implementation notes |
|------------|-------------------|-------------------------------|
| **A — Technical** | SSG / `generateMetadata` / static HTML | Every indexable route ships **full HTML + title/description in first response**; no duplicate meta sources. |
| **A — Technical** | Build-time content validation | Zod/Velite/content collections: **fail CI** on bad frontmatter, duplicate slugs — prevents silent SEO regressions. |
| **A — Technical** | `next/image` (or pipeline) + font strategy | LCP/CLS budgets on hub/article templates; see [NEXT_SITE_ARCHITECTURE.md §11](./NEXT_SITE_ARCHITECTURE.md#11-page-templates--layout--design-specification). |
| **B — Content** | MDX in repo | PR-reviewed content; version history; optional partial **ISR** or rebuild-on-push if freshness cadence increases later. |
| **B — Content** | Dynamic route segments from content graph | One `[...slug]` pattern → **sitemap** generated from the same graph as pages — no drift. |
| **C — Trust** | Templates | Article template supports **last updated**, author/org attribution policy, prominent **About** / methodology links. |
| **D — Distribution** | Metadata API + optional OG image route | Per-page **Open Graph / Twitter** cards; correct canonical for shares; avoid misleading previews. |
| **E — Measurement** | Same URLs over time | **301 map** preserved; GSC property stable; **redirect audit** after cutover. |

**If you chose Astro instead of Next:** pillar A–B remain similar (SSG + collections); trainer **islands** must be explicitly bounded so public routes stay lightweight.

### 12.3 Phased roadmap (build + SEO outcomes)

Use this as the **sequencing contract** between “new site” work and “organic growth” work. Overlap phases where staffing allows; do not skip **Phase 0** decisions.

| Phase | Engineering / content outcomes | SEO outcomes |
|-------|-------------------------------|--------------|
| **0 — Lock foundations** | Hosting pattern (§4), framework ADR, URL prefix (`/learn` etc.), monorepo layout (§5). | Single canonical domain strategy; staging **noindex**; no accidental duplicate deploys in Google. |
| **1 — SEO shell MVP** | Scaffold app: **home**, **one hub**, **two articles**, nav, footer, `robots.txt`, `sitemap.xml`, sample JSON-LD, **baseline Lighthouse/GSC** property for previews. | Proof that **view-source** is substantive; snippet control on pilot URLs. |
| **2 — Template scale** | Hub + article templates finalized; MDX components for diagrams/hands; image/heading conventions; related-links block; breadcrumb + `BreadcrumbList`. | Consistent internal linking; eligible rich results where honest; CWV budget enforced on templates. |
| **3 — Content migration waves** | Export Firestore/HTML → MDX with redirect map; QA **top 20–50** legacy URLs first. | Preserve equity via **301**; fix coverage errors in GSC; monitor soft 404s. |
| **4 — Cutover + monitoring** | Deploy; Search Console **change of address** only if domain changes (here: same domain — focus **redirect** + **coverage**). | Impressions/clicks trend + indexation of new URLs; fix redirect chains. |
| **5 — Growth loop** | Editorial calendar from **GSC Queries** (high-impression / low-CTR, gaps); refresh dates on factual posts; new pillars where clusters warrant. | Rising relevance on existing intents; fewer thin pages; better CTR from improved titles/descriptions. |
| **6 — Trainers / app** | Members’ routes **noindex** where appropriate; CTAs from articles to trainers; shared auth. | Organic landing → conversion without **cloaking**; premium depth behind login stays honest. |

### 12.4 Technical exploitation checklist (ship before calling “SEO-ready”)

Checklist for **indexable** routes (hub, article, key marketing):

- [ ] **First byte HTML**: `<title>`, meta description, visible H1 and intro copy without executing React for meaning.
- [ ] **One canonical URL** per piece of content; parameters/filters canonicalized or **noindex**.
- [ ] **`robots.txt`** allows crawling of public routes; blocks admin/staging.
- [ ] **XML sitemap** auto-generated; submitted in GSC/Bing; `<lastmod>` where meaningful.
- [ ] **Structured data** validated (Rich Results Test / GSC): `Organization`, `WebSite` (with `SearchAction` only if site search is real), `BreadcrumbList`, `Article` when editorial criteria match Google’s docs.
- [ ] **OG/Twitter** meta for sharing; optional dynamic OG images for flagship pages only if ROI clear.
- [ ] **Core Web Vitals**: hub + article templates meet agreed mobile budgets (document numbers in CI or periodic Lighthouse).
- [ ] **Images**: descriptive **alt** where not decorative; dimensions set; modern formats via build pipeline.
- [ ] **Mobile**: readable type, tap targets — aligns with mobile-first indexing and usability.

### 12.5 Content program (non-technical but mandatory for “maximize”)

Without this, the best stack only crawls empty shells faster.

| Practice | Rule of thumb |
|----------|----------------|
| **Intent mapping** | Each article answers **one** primary question; hubs organize sibling intents (see [NEXT_SITE_ARCHITECTURE §10](./NEXT_SITE_ARCHITECTURE.md#10-free-public-layer--information-architecture-wiki-style)). |
| **Depth bar** | Prefer fewer strong articles over many stubs; merge thin pages into definitive guides where possible. |
| **Freshness** | Bridge conventions / laws / examples — add **`dateModified`** and actually update when facts change. |
| **Internal links** | Every new article launches with **inbound** from at least one hub or related article (no orphans). |
| **E-E-A-T alignment** | Visible **who teaches**, citations to authorities where appropriate, corrections policy — supports quality raters’ expectations for learning content. |

### 12.6 Off-site and zero-budget distribution

| Tactic | Fit for Bridge Champions |
|--------|---------------------------|
| **Club / teacher partnerships** | Newsletter mentions, syllabus links — **earned** links relevant to bridge education. |
| **Community presence** | Answer questions where allowed; link **only** when it truly helps (avoid spam patterns). |
| **Brand SERP** | Consistent `Organization` schema, accurate Google Business Profile **only if** applicable; strong **About** page. |

Avoid paid link schemes, PBNs, or mass automated outreach — inconsistent with long-term reputation for an education brand.

### 12.7 Metrics that matter (avoid vanity)

| Metric | Use |
|--------|-----|
| **GSC**: impressions, clicks, avg position (segment by query/page) | Prioritize content updates and title/description experiments. |
| **GSC**: coverage, indexing, enhancements | Catch regressions after deploys. |
| **Landing organic sessions → signup/trial** (analytics) | Connect SEO to business outcomes. |
| **Rank trackers** (optional, paid) | Supplementary only — GSC remains canonical for Google. |

### 12.8 Explicit non-goals (until strategy changes)

- **Programmatic city/service spam** (“bridge lessons in [city]” at scale without unique value).
- **Fake FAQ schema** to steal SERP features.
- **Separate “SEO doorway” domains** that duplicate the main site.
- **hreflang** until multi-locale content exists.

---

## 13. Revision history

| Date | Author | Change |
|------|--------|--------|
| 2026-05-09 | — | Initial planning doc split from architecture conversation; pre-build only. |
| 2026-05-09 | — | Added §6 Design and aesthetics vs SEO (indirect effects vs technical SEO). |
| 2026-05-09 | — | Added §11 Authoritative sources and gap review. |
| 2026-05-09 | — | Added §12 Full-site SEO maximization plan (pillars, phased roadmap, stack exploitation, checklists). |

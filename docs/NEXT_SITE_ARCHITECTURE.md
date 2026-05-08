# Next website version — architecture & technology plan

**Status:** Draft — refine in place as decisions solidify.  
**Goal:** Ship a replacement for the current public experience on the **same primary URL** when ready (cutover / migration), without doubling hosting complexity unnecessarily.

**Related:** Stack choice, Firebase hosting patterns, migration phases, and SEO acceptance criteria — [SEO_TECH_STACK_ROLLOUT_PLAN.md](./SEO_TECH_STACK_ROLLOUT_PLAN.md) (planning-only until you start implementation).

---

## 1. Purpose

| Item | Definition |
|------|------------|
| **Outcome** | A new site version optimized for long-term SEO, expandable public reference content, and a clear split between **indexed public** surfaces and **member / app** surfaces. |
| **Constraint** | Same canonical domain as today (no mandatory domain change for users or SEO equity). |
| **Non-goal (for this doc)** | Detailed content taxonomy or page list — captured elsewhere or in later sections. |

### 1.1 Product split (paid vs free)

| Layer | Scope (working plan) |
|-------|----------------------|
| **Paid / members** | **Trainer hands** as the primary paid surface at launch; additional member-only features may ship later without changing this architecture. |
| **Free / public** | **Reference layer** built for SEO and discovery: **pillar (hub) pages**, **article (leaf) pages**, navigation and internal linking — not a flat “blog only” unless intentionally minimal v1. |

**Principle:** Paid delivers **interaction and depth of practice**; free delivers **answers, structure, and trust** so search and social traffic land on real HTML pages before conversion to trainers.

---

## 2. Rendering model (foundational decision)

### 2.1 Preferred approach

| Approach | Use when |
|----------|----------|
| **Static generation (SSG)** | Marketing pages, hubs, articles, glossary-style reference — **full HTML per URL** at build time. |
| **Server-side rendering (SSR)** | Routes that must reflect **fresh or personalized** data on first request (optional; use sparingly). |
| **Client-side rendering (CSR) only** | Logged-in app surfaces, trainers, dashboards — **not** the primary carrier for indexable reference HTML. |

**Plan:** Treat **HTML in the first response** as the default for every URL intended to rank or be shared (titles, meta, body, stable links).

### 2.2 Patterns to avoid for index-critical surfaces

- **CSR-only SPA** as the sole delivery mechanism for public reference URLs (content and meta injected only after JS executes).
- **Hash-based routing** (`/#/…`) for primary content URLs.
- **Infinite scroll or “load more”** as the **only** discovery path for important URLs (crawlers and archives need linkable lists or pagination).

---

## 3. Framework & runtime — recommended direction

### 3.1 Primary candidate: React meta-framework with SSG/SSR

**Next.js (App Router)** is the default candidate:

- First-class **SSG** and **SSR**, file-based routing, **metadata API** per route.
- Large ecosystem; gradual adoption of **React Server Components** where beneficial.
- Fits **incremental migration**: public routes in Next; legacy SPA routes behind `/app` or subdomain until replaced.

**Alternatives to evaluate (document tradeoffs before choosing):**

| Option | Strength | Risk / cost |
|--------|-----------|----------------|
| **Astro** | Excellent static performance; **content collections** for markdown/MDX reference libraries. | App-heavy interactive areas need explicit “islands” or a sibling React bundle. |
| **Remix** | Strong nested layouts and forms; SSR-first. | Less common default for “mostly static blog/wiki” — still viable. |

### 3.2 UI layer

- **React** for interactive trainers and existing component logic reuse path.
- **CSS:** Prefer **one system** (e.g. Tailwind + design tokens, or CSS Modules) — decide in design phase; avoid mixing three concurrent methodologies without reason.

### 3.3 Content authoring (public reference)

Evaluate one primary path:

| Approach | Notes |
|----------|--------|
| **MDX or Markdown + frontmatter** in repo | Git-backed, reviewable, works well with SSG; scales for wiki-style growth. |
| **Headless CMS** (optional later) | If non-developers edit frequently — adds cost and sync complexity; defer unless needed. |

### 3.4 Article stack — technical specification (reference content)

**Default stack (aligns with §3.1):**

| Component | Specification |
|-----------|-----------------|
| **Authoring format** | **MDX** (Markdown + embedded React for diagrams, callouts, hand widgets where needed) **or** Markdown-only if MDX is deferred — frontmatter required on every file. |
| **Storage** | **Files in repo** under a dedicated tree (e.g. `content/articles/`, `content/hubs/`) — Git history, PR review, deterministic builds. |
| **Build** | **SSG**: at build time, resolve all content files → static HTML per URL; **no Firestore round-trip** for public article HTML on first byte (Firestore may remain for auth, progress, trainers, analytics). |
| **Routing** | Framework file-based or **dynamic segments** (e.g. `app/learn/[...slug]/page.tsx`) driven by **slug** and **content type** from frontmatter — one routing implementation for hubs and leaves. |
| **Metadata** | Per-page **`generateMetadata`** (or equivalent) from frontmatter + defaults — single source of truth (no duplicate Helmet-only path for indexable URLs). |

**Frontmatter fields (minimum contract):**

| Field | Required | Purpose |
|-------|----------|---------|
| `title` | Yes | `<title>`, H1 default, OG title |
| `description` | Yes | Meta description, OG description |
| `slug` | Yes* | URL segment(s); *or derive from file path only — pick one rule and document it |
| `contentType` | Yes | `hub` \| `article` \| `page` (marketing/legal) — drives template selection |
| `parentSlug` or `section` | Hub/articles | Breadcrumbs and hub→child relationships |
| `datePublished` / `dateModified` | Recommended | Sitemap freshness, Article schema, “updated” UI |
| `canonical` | Optional | Override when consolidating duplicates |
| `noindex` | Optional | Staging or deprecated URLs |
| `tags` / `related` | Optional | Related links block; seed internal linking |

**Collections / validation:**

- Use **contentlayer**, **Velite**, **Zod + fs**, or framework-native **content collections** — validate frontmatter at build; **fail CI** on invalid or duplicate slugs.

**Migration from current articles:**

- Current CMS/Firestore-backed articles remain until cutover; **batch migration** exports → MDX/Markdown + frontmatter; **301 map** from old IDs/paths to new slugs.

---

## 4. Hosting & deployment — constraints (Bridge Champions)

### 4.1 Current anchor

- **Firebase Hosting** (and existing CI deploy pipeline) is the operational baseline.

### 4.2 Target integration options (pick one in a later revision)

| Mode | Summary |
|------|---------|
| **Static export** | Build static HTML/CSS/JS; deploy to Hosting — simplest if **no SSR** required for v1 public shell. |
| **SSR on Firebase** | Firebase **Frameworks Backend** or **Cloud Functions** / **Cloud Run** adapter for Next SSR — required only if SSR routes are in scope for launch. |

**Plan note:** Decide **SSG-only vs SSR** before locking hosting wiring; SSG-only reduces moving parts for first cutover.

---

## 5. SEO & discoverability — technical requirements

These are **acceptance criteria** for the public layer, not optional polish:

- Unique **`title`** and **meta description** per indexable URL (template-driven).
- **Canonical URLs** for duplicate or parameterized views.
- **`sitemap.xml`** generated from the route/content graph (not hand-maintained long-term).
- **`robots.txt`** aligned with prod vs staging; **noindex** for auth-only or thin shells as needed.
- **Structured data (JSON-LD)** where accurate: `Organization`, `WebSite`, `BreadcrumbList`, `Article` / `FAQPage` as content warrants.
- **Core Web Vitals** budget per template (LCP, INP, CLS) — especially on article and hub templates.

---

## 6. Authentication & paywall boundaries

| Surface | Indexing stance |
|---------|------------------|
| **Public reference / marketing** | Indexable; meaningful HTML without subscription. |
| **Member app, trainers (primary)** | Typically **noindex** or minimal indexing; avoid **cloaking** (same URL must not show full premium content to bots but empty to users). |
| **Soft paywall / preview** | Acceptable if user-visible preview matches what search visitors receive for that URL. |

---

## 7. Migration & cutover (same URL)

Plan will include (detail later):

1. **URL mapping** — old path → new path; **301 redirects** for renamed or merged topics.
2. **Search Console** — verify property, monitor coverage after cutover.
3. **Staging** — hostname or preview deploy that does not leak duplicate indexation to prod (`robots` / auth).

---

## 8. Technology / patterns — avoid list (working)

| Avoid | Reason |
|-------|--------|
| Client-only rendering for primary reference URLs | Weaker first-byte HTML for crawlers and previews; slower iteration on SEO. |
| Multiple conflicting sources of truth for meta tags | Helmets only in CSR without SSR for index pages — same class of issue as legacy SPA-only. |
| Unbounded duplicate URLs (filters, sorts) without canonicals | Dilutes relevance and crawl budget. |
| “Thin” programmatic pages at scale | Long-term quality risk; prefer merge + depth. |

---

## 9. Relationship to current codebase

| Current | Role during transition |
|---------|-------------------------|
| CRA (`react-scripts`) + Firebase | Remains source of truth for production until cutover; trainers and member flows may move last. |
| New stack (when introduced) | Owns **public SEO shell + reference content** first; integrate auth and reuse APIs as designed. |

---

## 10. Free public layer — information architecture (wiki-style)

### 10.1 Content vs structure (both required)

| Dimension | Role |
|-----------|------|
| **Content** | Answers search intent, depth, clarity, freshness — determines relevance and rankings. |
| **Structure** | Stable URLs, hubs, internal links, templates, sitemaps — determines discoverability and sustainable scale. |

**Plan:** Lock **URL scheme + hub/article templates early**, then grow volume inside that mold; revise templates when patterns emerge (not ad hoc per page).

### 10.2 Page types

| Type | Role | SEO |
|------|------|-----|
| **Pillar / hub (“parent”)** | Wikipedia-style **overview** for a topic area: short intro, scope, **child links** (articles), optional “start here” ordering. **Not** a dump of full detail — points downward. |
| **Article (“leaf”)** | **One primary intent per URL** — specific convention, technique, law summary, etc. Deep enough to avoid “thin” classification. |
| **Marketing / utility** | Home, pricing teaser, about, contact, legal — index rules per page (some **noindex**). |

**Hierarchy (example — replace with real taxonomy):**

```text
/learn (index — optional)
  /learn/bidding (hub)
    /learn/bidding/opening-in-a-major (article)
    /learn/bidding/stayman (article)
  /learn/declarer-play (hub)
    …
```

**Rules:**

- Every **article** belongs to at least one **hub** (via `parentSlug` / section) for breadcrumbs and listing.
- **Avoid** orphan articles (no inbound internal links); hub pages must **link out** to launched children.
- **Synonyms** → one canonical article; use intro paragraph and redirects, not duplicate URLs.

### 10.3 Is free “only articles”?

**Baseline:** **Hubs + articles + navigation** — articles alone without hubs reads as a blog, not a reference system.

**Optional later (not required for v1):** glossary term pages, short “definition” chips, limited free trainer previews, newsletter archives — add when IA stabilizes.

---

## 11. Page templates — layout & design specification

**Design vs SEO:** Visual style is not a direct ranking factor; coherence, speed (Core Web Vitals), and clarity still matter indirectly. See [SEO_TECH_STACK_ROLLOUT_PLAN.md §6](./SEO_TECH_STACK_ROLLOUT_PLAN.md#6-design-and-aesthetics-vs-seo).

### 11.1 Hub (pillar) template

| Region | Content |
|--------|---------|
| **Header** | H1 = hub title; optional subdeck (1–2 sentences). |
| **Breadcrumbs** | Home → section → current hub (structured data `BreadcrumbList`). |
| **Body** | Short overview; **linked list or grid of child articles** (required); optional “related hubs.” |
| **Sidebar / footer (optional)** | Table of contents for long hubs only; else omit to stay lean. |

**Design goal:** Scan-friendly, link-rich, fast LCP (minimal hero weight).

### 11.2 Article (leaf) template

| Region | Content |
|--------|---------|
| **Header** | H1; optional last-updated; byline only if editorial policy adds authors. |
| **Breadcrumbs** | Home → hub → article. |
| **Body** | Prose; MDX components for **diagrams**, **notes/warnings**, **example hands** (reuse design system). |
| **Related** | “See also” / sibling links (frontmatter-driven + optional auto by tags). |
| **Bottom CTA (optional)** | Single soft conversion to trainers/membership — must not replace substantive article body for SEO. |

### 11.3 Shared

- **Typography scale** — readable line length; consistent H2/H3 hierarchy for snippets.
- **Images** — lazy-loaded; dimensions set; WebP/AVIF where supported by pipeline.
- **Mobile** — nav collapsible; touch targets; no horizontal scroll on prose.

---

## 12. Open decisions (checklist)

- [ ] Framework locked: Next vs Astro vs other — **record ADR snippet below**.
- [ ] SSG-only vs SSR routes for v1.
- [ ] Monorepo (`apps/web`, `apps/legacy`) vs sequential repo split — **operational preference**.
- [ ] Content tooling: MDX vs MD-only; **contentlayer / Velite / Zod** choice.
- [ ] URL prefix for reference (`/learn`, `/guides`, `/wiki`) — **locked once**, then stable.
- [ ] Exact Firebase integration path for chosen framework.
- [ ] Related-links algorithm: manual only vs tag-assisted auto.

### ADR stub (fill when decided)

**Decision:**  
**Alternatives considered:**  
**Consequences:**

---

## 13. Revision history

| Date | Change |
|------|--------|
| *(add rows as this doc evolves)* | |
| 2026-05-09 | Added product split, article stack tech spec, IA (hubs vs leaves), page templates. |

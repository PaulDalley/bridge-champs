/**
 * Prerender public routes from the production CRA build.
 *
 * Reads URLs from public/sitemap.xml, serves the build/ folder over a local
 * Express server, then uses Puppeteer to visit each route and snapshot the
 * rendered HTML to build/<path>/index.html. Firebase Hosting's SPA rewrite
 * falls through to those real files for crawler/social requests, while
 * React still hydrates for normal users.
 *
 * Usage:
 *   node scripts/prerender.js [--port 5050] [--concurrency 3] [--limit N]
 *                             [--only /path1,/path2] [--timeout 25000]
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const ROOT = path.join(__dirname, "..");
const BUILD_DIR = path.join(ROOT, "build");
const SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");
const PROD_BASE = "https://bridgechampions.com";

function getArgValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  if (!v || v.startsWith("-")) return fallback;
  return v;
}

const PORT = Number(getArgValue("--port", "5050"));
const CONCURRENCY = Math.max(1, Number(getArgValue("--concurrency", "3")));
const LIMIT = Number(getArgValue("--limit", "0")) || 0;
const TIMEOUT_MS = Number(getArgValue("--timeout", "25000"));
const ONLY = (getArgValue("--only", "") || "")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

function readSitemapUrls() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error(
      `No sitemap at ${SITEMAP_PATH}. Run \`npm run sitemap:generate\` first.`
    );
  }
  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return locs
    .map((u) => {
      try {
        const url = new URL(u);
        return url.pathname + (url.search || "");
      } catch (_) {
        return null;
      }
    })
    .filter(Boolean)
    .filter((p) => !p.startsWith("/login") && !p.startsWith("/membership"));
}

function normalisePath(p) {
  if (p === "/" || p === "") return "/";
  return p.endsWith("/") ? p.slice(0, -1) : p;
}

const ARTICLE_ROUTE_PATTERNS = [
  /^\/declarer\/articles\/[A-Za-z0-9_-]+$/,
  /^\/defence\/articles\/[A-Za-z0-9_-]+$/,
  /^\/bidding\/advanced\/[A-Za-z0-9_-]+$/,
  /^\/bidding\/basics\/[A-Za-z0-9_-]+$/,
  /^\/counting\/articles\/[A-Za-z0-9_-]+$/,
  /^\/beginner\/articles\/(declarer|defence|bidding)\/[A-Za-z0-9_-]+$/,
];

function isArticleRoutePath(p) {
  return ARTICLE_ROUTE_PATTERNS.some((re) => re.test(p));
}

// Category-list ("hub") routes that render <CategoryArticles>. These must wait
// for `.CategoryArticles` specifically — during prerender the app can briefly
// render the HomePage (auth/bootstrap gate) before the route component mounts,
// and snapshotting that transient state ships the homepage head (canonical "/",
// "Welcome to Bridge Champions" title) on a hub URL.
const HUB_ROUTE_PATTERNS = [
  /^\/declarer\/articles$/,
  /^\/defence\/articles$/,
  /^\/bidding\/advanced$/,
  /^\/bidding\/basics$/,
  /^\/counting\/articles$/,
  /^\/beginner\/articles\/(declarer|defence|bidding)$/,
];

function isHubRoutePath(p) {
  return HUB_ROUTE_PATTERNS.some((re) => re.test(p));
}

function fileForRoute(routePath) {
  const clean = normalisePath(routePath);
  const segments = clean === "/" ? [] : clean.replace(/^\/+/, "").split("/");
  const dir = path.join(BUILD_DIR, ...segments);
  return { dir, file: path.join(dir, "index.html") };
}

function startStaticServer() {
  if (!fs.existsSync(BUILD_DIR)) {
    throw new Error(
      `No build directory at ${BUILD_DIR}. Run \`npm run build\` first.`
    );
  }
  const app = express();
  app.use(
    express.static(BUILD_DIR, {
      extensions: ["html"],
      index: false,
      redirect: false,
    })
  );
  app.get("*", (_req, res) => {
    res.sendFile(path.join(BUILD_DIR, "index.html"));
  });
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => resolve(server));
  });
}

async function snapshotRoute(browser, routePath) {
  const page = await browser.newPage();
  const localUrl = `http://localhost:${PORT}${routePath}`;
  let html = null;
  try {
    page.setDefaultNavigationTimeout(TIMEOUT_MS);
    await page.setUserAgent(
      "Mozilla/5.0 (compatible; BridgeChampsPrerender/1.0; +https://bridgechampions.com)"
    );
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      if (/googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|hotjar\.com|stripe\.com\/v3/.test(url)) {
        return req.abort();
      }
      return req.continue();
    });

    const response = await page.goto(localUrl, { waitUntil: "domcontentloaded" });
    if (response && response.status() >= 400) {
      throw new Error(`HTTP ${response.status()} at ${routePath}`);
    }

    const articleRoutePatterns = [
      /^\/declarer\/articles\/[A-Za-z0-9_-]+$/,
      /^\/defence\/articles\/[A-Za-z0-9_-]+$/,
      /^\/bidding\/advanced\/[A-Za-z0-9_-]+$/,
      /^\/bidding\/basics\/[A-Za-z0-9_-]+$/,
      /^\/counting\/articles\/[A-Za-z0-9_-]+$/,
      /^\/beginner\/articles\/(declarer|defence|bidding)\/[A-Za-z0-9_-]+$/,
    ];
    const isArticleRoute = articleRoutePatterns.some((re) => re.test(routePath));
    const isHubRoute = isHubRoutePath(routePath);
    const routeKind = isArticleRoute ? "article" : isHubRoute ? "hub" : "other";

    try {
      await page.waitForFunction(
        (kind) => {
          const root = document.getElementById("root");
          if (!root) return false;
          if (kind === "article") {
            const article = document.querySelector(".DisplayArticle-content");
            if (!article) return false;
            return article.textContent.trim().length > 300;
          }
          if (kind === "hub") {
            // Require the category list itself — never accept a transient
            // HomePage render for a hub URL.
            const hub = document.querySelector(".CategoryArticles");
            return !!hub && hub.textContent.trim().length > 400;
          }
          const generic = document.querySelector(
            ".CategoryArticles, .HomePage, main, .BeginnerLanding, .LandingPage"
          );
          if (generic && generic.textContent.trim().length > 200) return true;
          return root.textContent.trim().length > 300;
        },
        { timeout: 20000, polling: 400 },
        routeKind
      );
    } catch (waitErr) {
      let snapshotDiag = null;
      try {
        snapshotDiag = await page.evaluate(() => ({
          title: document.title || "",
          url: location.href,
          rootSize: (document.getElementById("root") || {}).textContent?.length || 0,
          hasArticle: !!document.querySelector(".DisplayArticle-content"),
          articleSize:
            (document.querySelector(".DisplayArticle-content") || {}).textContent?.length || 0,
          hasCategoryArticles: !!document.querySelector(".CategoryArticles"),
        }));
        if (process.env.PRERENDER_DEBUG) console.warn("DIAG:", JSON.stringify(snapshotDiag));
      } catch (diagErr) {
        if (process.env.PRERENDER_DEBUG) console.warn("DIAG-ERR (retrying after 500ms):", diagErr.message);
        try {
          await new Promise((r) => setTimeout(r, 500));
          snapshotDiag = await page.evaluate(() => ({
            title: document.title || "",
            rootSize: (document.getElementById("root") || {}).textContent?.length || 0,
            hasArticle: !!document.querySelector(".DisplayArticle-content"),
            articleSize:
              (document.querySelector(".DisplayArticle-content") || {}).textContent?.length || 0,
          }));
        } catch (_) {
          throw waitErr;
        }
      }
      const DEFAULT_TITLE_FRAGMENTS = [
        "Bridge Champions \u2014 Bridge lessons",
        "Bridge Champions \u2014",
      ];
      const titleIsDefault = DEFAULT_TITLE_FRAGMENTS.some((t) =>
        (snapshotDiag.title || "").includes(t)
      );
      const articleOk = isArticleRoute && snapshotDiag.hasArticle && snapshotDiag.articleSize > 300;
      const hubOk = isHubRoute && snapshotDiag.hasCategoryArticles && snapshotDiag.rootSize > 800;
      const otherOk = !isArticleRoute && !isHubRoute && !titleIsDefault && snapshotDiag.rootSize > 800;
      if (articleOk || hubOk || otherOk) {
        console.warn(
          `SOFT ${routePath} :: wait timed out but page is filled (title="${(snapshotDiag.title || "").slice(
            0,
            80
          )}", rootSize=${snapshotDiag.rootSize})`
        );
      } else {
        if (process.env.PRERENDER_DEBUG) {
          console.warn("DEBUG diag:", JSON.stringify(snapshotDiag, null, 2));
        }
        throw waitErr;
      }
    }

    // On article routes, wait (best-effort) for the related-articles widget
    // to populate. This is what gives crawlers the internal-link graph.
    // If it doesn't show up in time, we still snapshot — just without it.
    if (isArticleRoute) {
      try {
        await page.waitForFunction(
          () => {
            const related = document.querySelector(".DisplayArticle-related");
            if (!related) return false;
            const items = related.querySelectorAll(".DisplayArticle-relatedItem");
            return items.length > 0;
          },
          { timeout: 8000, polling: 300 }
        );
      } catch (_) {
        console.warn(`NOTE ${routePath} :: related-articles widget did not populate before snapshot`);
      }
    }

    // Nudge requestAnimationFrame: react-helmet-async flushes the <head> inside
    // a rAF callback, and in headless Chrome rAF can stall on a static page that
    // isn't painting new frames — so Helmet never writes its title/description/
    // canonical. A tiny scroll + a couple of forced rAF ticks wakes the frame
    // loop so Helmet commits before we snapshot. (Article pages flush anyway
    // because their async data loads keep triggering frames.)
    try {
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            try { window.scrollTo(0, 1); window.scrollTo(0, 0); } catch (_) {}
            requestAnimationFrame(() =>
              requestAnimationFrame(() => setTimeout(resolve, 0))
            );
          })
      );
    } catch (_) {}

    // Wait (best-effort) for react-helmet-async to flush the per-page <head>.
    // Hub/category pages resolve the content wait almost instantly (breadcrumbs
    // + title render synchronously), which can snapshot BEFORE Helmet writes the
    // page's own canonical/title — leaving the default index.html head. Waiting
    // for a canonical link (or a non-default <title>) guarantees we capture the
    // route's real head. Article routes already satisfy this immediately.
    try {
      await page.waitForFunction(
        () => {
          const canonical = document.querySelector("link[rel='canonical']");
          if (canonical && canonical.getAttribute("href")) return true;
          const title = document.title || "";
          const isDefault =
            title.includes("Bridge Champions \u2014 Bridge lessons") ||
            title.trim() === "Bridge Champions";
          return !!title && !isDefault;
        },
        { timeout: 8000, polling: 250 }
      );
    } catch (_) {
      console.warn(`NOTE ${routePath} :: per-page <head> (canonical/title) not applied before snapshot`);
    }

    await page.evaluate(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      await sleep(500);
    });

    const canonicalUrl = `${PROD_BASE}${normalisePath(routePath)}`;
    await page.evaluate((selfUrl) => {
      // Deterministic head backfill. react-helmet-async usually applies the
      // per-page <head>, but on content-heavy hub pages (many articles + live
      // Firestore listeners) it can re-render past the snapshot window and ship
      // the default index.html head. A page's canonical is always its own URL,
      // so inject a self-referential canonical when one is missing, and replace
      // the homepage-default og:url/title with route-specific values. This makes
      // canonical/title timing-proof (the signal Google uses to de-duplicate).
      const DEFAULT_TITLE_FRAGMENTS = [
        "Bridge Champions \u2014 Bridge lessons",
      ];
      const titleIsDefault = (t) =>
        !t ||
        t.trim() === "Bridge Champions" ||
        DEFAULT_TITLE_FRAGMENTS.some((frag) => t.includes(frag));

      const isHome = selfUrl === "https://bridgechampions.com/";
      const pointsHome = (href) =>
        href === "https://bridgechampions.com/" || href === "https://bridgechampions.com";

      let canonical = document.head.querySelector("link[rel='canonical']");
      const curHref = canonical && canonical.getAttribute("href");
      // Set a self-referential canonical when missing, or when a non-home route
      // wrongly inherited the homepage canonical (transient HomePage render).
      if (!canonical || !curHref || (!isHome && pointsHome(curHref))) {
        if (!canonical) {
          canonical = document.createElement("link");
          canonical.setAttribute("rel", "canonical");
          document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", selfUrl);
      }

      // og:url / twitter:url: if still pointing at the homepage, retarget to self.
      ["og:url", "twitter:url"].forEach((key) => {
        const attr = key.startsWith("og:") ? "property" : "name";
        const el = document.head.querySelector(`meta[${attr}='${key}']`);
        if (el) {
          const val = el.getAttribute("content") || "";
          if (val === "https://bridgechampions.com/" || val === "https://bridgechampions.com") {
            el.setAttribute("content", selfUrl);
          }
        }
      });

      // Title: when still the homepage default, derive one from the page's H1
      // (hub pages render <h1 class="CategoryArticles-title">). Article pages
      // already get their real title from Helmet, so this only touches hubs.
      if (titleIsDefault(document.title)) {
        const h1 =
          document.querySelector("h1.CategoryArticles-title") ||
          document.querySelector("h1");
        const h1Text = h1 ? h1.textContent.trim() : "";
        // Never derive a title from the homepage hero ("Welcome to Bridge
        // Champions") — that means we caught a transient homepage render.
        if (h1Text && !/^welcome to/i.test(h1Text)) {
          const derived = `${h1Text} - Bridge Champions`;
          document.title = derived;
          const ogTitle = document.head.querySelector("meta[property='og:title']");
          if (ogTitle) ogTitle.setAttribute("content", derived);
        }
      }

      const dedupeBy = (selector, keyFn) => {
        const seen = new Map();
        document.head.querySelectorAll(selector).forEach((el) => {
          const k = keyFn(el);
          if (!k) return;
          seen.set(k, el);
        });
        document.head.querySelectorAll(selector).forEach((el) => {
          const k = keyFn(el);
          if (!k) return;
          if (seen.get(k) !== el) el.remove();
        });
      };
      dedupeBy("meta[name]", (el) => `n:${el.getAttribute("name")}`);
      dedupeBy("meta[property]", (el) => `p:${el.getAttribute("property")}`);
      dedupeBy("link[rel='canonical']", () => "canonical");

      const titles = document.head.querySelectorAll("title");
      if (titles.length > 1) {
        for (let i = 0; i < titles.length - 1; i++) titles[i].remove();
      }

      const marker = document.createElement("meta");
      marker.setAttribute("name", "x-prerendered");
      marker.setAttribute("content", new Date().toISOString());
      document.head.appendChild(marker);
    }, canonicalUrl);

    html = await page.content();
  } finally {
    await page.close();
  }
  return html;
}

async function writeSnapshot(routePath, html) {
  const { dir, file } = fileForRoute(routePath);
  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(file, html, "utf8");
  return path.relative(BUILD_DIR, file);
}

async function runQueue(items, worker) {
  let idx = 0;
  const results = { ok: 0, fail: 0, failed: [] };
  async function next() {
    while (idx < items.length) {
      const myIdx = idx++;
      const item = items[myIdx];
      const label = `[${myIdx + 1}/${items.length}] ${item}`;
      try {
        const written = await worker(item);
        results.ok++;
        console.log(`OK   ${label} -> ${written}`);
      } catch (err) {
        results.fail++;
        results.failed.push({ path: item, error: err.message });
        console.warn(`FAIL ${label} :: ${err.message}`);
      }
    }
  }
  const workers = Array.from({ length: CONCURRENCY }, () => next());
  await Promise.all(workers);
  return results;
}

function preserveSpaShell() {
  const shellSource = path.join(BUILD_DIR, "index.html");
  const shellTarget = path.join(BUILD_DIR, "_shell.html");
  if (!fs.existsSync(shellSource)) {
    throw new Error(`No build/index.html — did you run \`npm run build\`?`);
  }
  fs.copyFileSync(shellSource, shellTarget);
  console.log(`Preserved SPA shell at build/_shell.html`);
}

async function run() {
  console.log("Reading sitemap…");
  preserveSpaShell();
  let routes = readSitemapUrls();
  const onlyFilters = ONLY.filter((s) => s && s !== "/");
  if (onlyFilters.length || ONLY.includes("/")) {
    routes = routes.filter(
      (p) =>
        (ONLY.includes("/") && p === "/") ||
        onlyFilters.some((only) => p === only || p.startsWith(`${only}/`))
    );
  }
  routes = [...new Set(routes.map(normalisePath))];
  if (LIMIT) routes = routes.slice(0, LIMIT);
  if (!routes.length) {
    console.warn("No routes to prerender. Exiting.");
    return;
  }
  console.log(`Will prerender ${routes.length} routes (concurrency=${CONCURRENCY}).`);

  console.log("Starting static server…");
  const server = await startStaticServer();
  console.log(`Static server on http://localhost:${PORT}`);

  console.log("Launching Chromium…");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  let results;
  try {
    results = await runQueue(routes, async (routePath) => {
      const html = await snapshotRoute(browser, routePath);
      return writeSnapshot(routePath, html);
    });
  } finally {
    await browser.close();
    server.close();
  }

  console.log("---");
  console.log(`Done. ok=${results.ok} fail=${results.fail} base=${PROD_BASE}`);

  // Coverage guard: surface article prerender gaps LOUDLY. A bare SPA shell
  // (no prerendered HTML) is the most common reason individual articles don't
  // get indexed, so make any shortfall obvious in the CI log/annotations and
  // in a machine-readable file — without failing the deploy (the site already
  // shipped via fast-deploy).
  const articleRoutes = routes.filter(isArticleRoutePath);
  const failedArticleRoutes = results.failed.filter((f) => isArticleRoutePath(normalisePath(f.path)));
  const articleOk = articleRoutes.length - failedArticleRoutes.length;
  const articleCoverage = articleRoutes.length
    ? articleOk / articleRoutes.length
    : 1;
  console.log(
    `Article coverage: ${articleOk}/${articleRoutes.length} prerendered ` +
      `(${Math.round(articleCoverage * 100)}%).`
  );

  const coveragePath = path.join(BUILD_DIR, "prerender-coverage.json");
  fs.writeFileSync(
    coveragePath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalRoutes: routes.length,
        okRoutes: results.ok,
        failedRoutes: results.fail,
        articleRoutes: articleRoutes.length,
        articleOk,
        articleFailed: failedArticleRoutes.length,
        articleCoveragePct: Math.round(articleCoverage * 100),
        failedArticlePaths: failedArticleRoutes.map((f) => f.path),
      },
      null,
      2
    )
  );

  if (failedArticleRoutes.length > 0) {
    // GitHub Actions annotation — shows up prominently on the run summary.
    console.warn(
      `::warning title=Prerender coverage::${failedArticleRoutes.length} of ` +
        `${articleRoutes.length} article pages did NOT prerender and shipped as ` +
        `bare SPA shells (won't index well). See build/prerender-coverage.json.`
    );
    failedArticleRoutes.forEach((f) =>
      console.warn(`  unprerendered article: ${f.path} :: ${f.error}`)
    );
  }

  if (results.failed.length) {
    const summaryPath = path.join(BUILD_DIR, "prerender-failures.json");
    fs.writeFileSync(summaryPath, JSON.stringify(results.failed, null, 2));
    console.log(`Wrote failure detail to ${path.relative(ROOT, summaryPath)}`);
  }
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Prerender failed:", err);
    process.exit(1);
  }
);
